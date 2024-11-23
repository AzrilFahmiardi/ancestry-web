const express = require("express");
const cors = require("cors");
const pool = require("./database");
require("dotenv").config();

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.status(200).send("OK");
});

app.get('/trees', async (req, res) => {
    try {
        const [trees] = await pool.query('SELECT * FROM FamilyTree ORDER BY created_at DESC');
        res.json(trees);
    } catch (error) {
        console.error('Error fetching trees:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.post('/trees', async (req, res) => {
    try {
        const { name } = req.body;
        const [result] = await pool.query(
            'INSERT INTO FamilyTree (name) VALUES (?)',
            [name]
        );
        res.status(201).json({ 
            id: result.insertId, 
            name,
            message: 'Family tree created successfully' 
        });
    } catch (error) {
        console.error('Error creating family tree:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


app.get('/treedata/:treeId', async (req, res) => {
    try {
        const { treeId } = req.params;
        await pool.query('SET FOREIGN_KEY_CHECKS=0;');
        
        const [rows] = await pool.query(`
            WITH RECURSIVE TreeHierarchy AS (
                SELECT 
                    k.id,
                    k.name,
                    k.dob,
                    k.status,
                    k.id_spouse,
                    0 as level,
                    CAST(k.id AS CHAR(200)) as path
                FROM Keluarga k
                WHERE NOT EXISTS (
                    SELECT 1 
                    FROM KeluargaHubungan kh
                    WHERE kh.descendant_id = k.id AND kh.ancestor_id != k.id
                )
                AND k.tree_id = ?

                UNION ALL

                SELECT 
                    k.id,
                    k.name,
                    k.dob,
                    k.status,
                    k.id_spouse,
                    th.level + 1,
                    CONCAT(th.path, ',', k.id)
                FROM TreeHierarchy th
                INNER JOIN KeluargaHubungan kh ON kh.ancestor_id = th.id
                INNER JOIN Keluarga k ON k.id = kh.descendant_id
                WHERE kh.depth = 1
            )
            SELECT 
                h.*,
                s.name as spouse_name,
                s.dob as spouse_dob,
                s.status as spouse_status
            FROM TreeHierarchy h
            LEFT JOIN Keluarga s ON h.id_spouse = s.id
            ORDER BY h.level, h.id;
        `, [treeId]);

        const buildFamilyTree = (data) => {
            // Create a map for quick node lookup
            const nodeMap = new Map();
        
            // First pass: create all nodes
            data.forEach(row => {
                nodeMap.set(row.id, {
                    id: row.id, // Tambahkan baris ini untuk menyertakan ID
                    name: row.name,
                    attributes: {
                        dob: row.dob.toISOString().split('T')[0],
                        status: row.status
                    }
                });
        
                // Add spouse information if exists
                if (row.spouse_name) {
                    nodeMap.get(row.id).spouse = {
                        id:row.id_spouse,
                        name: row.spouse_name,
                        dob: row.spouse_dob.toISOString().split('T')[0],
                        status: row.spouse_status
                    };
                }
            });
        
            // Second pass: build the tree structure
            data.forEach(row => {
                if (row.path) {
                    const pathIds = row.path.split(',').map(Number);
                    if (pathIds.length > 1) {
                        const parentId = pathIds[pathIds.length - 2];
                        const parentNode = nodeMap.get(parentId);
                        if (parentNode) {
                            if (!parentNode.children) {
                                parentNode.children = [];
                            }
                            parentNode.children.push(nodeMap.get(row.id));
                        }
                    }
                }
            });
        
            // Return the root node
            const rootNode = data.find(row => row.level === 0);
            return rootNode ? nodeMap.get(rootNode.id) : null;
        };

        const treeData = buildFamilyTree(rows);
        res.json(treeData);

    } catch (error) {
        console.error('Error fetching tree data:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.post('/family', async (req, res) => {
    try {
        const { name, dob, status, parentId, spouseId, treeId } = req.body;
        
        const [result] = await pool.query(
            'INSERT INTO Keluarga (name, dob, status, id_spouse, tree_id) VALUES (?, ?, ?, ?, ?)',
            [name, dob, status, spouseId || null, treeId]
        );
        
        const newMemberId = result.insertId;
        
        // If spouse is provided, update spouse's reference
        if (spouseId) {
            await pool.query(
                'UPDATE Keluarga SET id_spouse = ? WHERE id = ?',
                [newMemberId, spouseId]
            );
        }
        
        // If parent is provided, create relationship
        if (parentId) {
            // Insert self-relationship first
            await pool.query(
                'INSERT IGNORE INTO KeluargaHubungan (ancestor_id, descendant_id, depth) VALUES (?, ?, 0)',
                [newMemberId, newMemberId]
            );
            
            // Insert direct relationship (depth = 1)
            await pool.query(
                'INSERT IGNORE INTO KeluargaHubungan (ancestor_id, descendant_id, depth) VALUES (?, ?, 1)',
                [parentId, newMemberId]
            );
            
            // Insert inherited relationships with IGNORE to prevent duplicates
            await pool.query(`
                INSERT IGNORE INTO KeluargaHubungan (ancestor_id, descendant_id, depth)
                SELECT kh.ancestor_id, ?, kh.depth + 1
                FROM KeluargaHubungan kh
                WHERE kh.descendant_id = ?
            `, [newMemberId, parentId]);
        }
        
        res.status(201).json({ id: newMemberId, message: 'Family member added successfully' });
    } catch (error) {
        console.error('Error adding family member:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.put('/family/:id', async (req, res) => {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();
        
        const { id } = req.params;
        const { name, dob, status, isSpouse } = req.body;
        
        console.log('Updating member:', { id, name, dob, status, isSpouse });

        if (isSpouse) {
            // If updating a spouse, we need to find the correct record
            // First, check if this ID exists in id_spouse column
            const [spouseCheck] = await connection.query(
                'SELECT id FROM Keluarga WHERE id = ?',
                [id]
            );

            if (spouseCheck.length > 0) {
                // Update the spouse record
                await connection.query(
                    'UPDATE Keluarga SET name = ?, dob = ?, status = ? WHERE id = ?',
                    [name, dob, status, id]
                );
            } else {
                throw new Error('Spouse record not found');
            }
        } else {
            // Update main family member
            await connection.query(
                'UPDATE Keluarga SET name = ?, dob = ?, status = ? WHERE id = ?',
                [name, dob, status, id]
            );
        }
        
        await connection.commit();
        res.json({ 
            message: 'Family member updated successfully',
            isSpouse: isSpouse
        });
    } catch (error) {
        await connection.rollback();
        console.error('Error updating family member:', error);
        res.status(500).json({ 
            error: 'Internal server error',
            details: error.message 
        });
    } finally {
        connection.release();
    }
});

app.delete('/family/:id', async (req, res) => {
    try {
        const { id } = req.params;
        console.log(id);
        
        
        // Delete relationships
        await pool.query('DELETE FROM KeluargaHubungan WHERE ancestor_id = ? OR descendant_id = ?', [id, id]);
        
        // Delete family member
        await pool.query('DELETE FROM Keluarga WHERE id = ?', [id]);
        
        res.json({ message: 'Family member deleted successfully' });
    } catch (error) {
        console.error('Error deleting family member:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});