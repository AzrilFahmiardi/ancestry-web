import axios from 'axios';

const API_BASE_URL = 'https://ancestry-web.onrender.com';
// const API_BASE_URL = 'http://localhost:5000';

class FamilyTreeService {
    constructor() {
        this.api = axios.create({
            baseURL: API_BASE_URL,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }

    async getAllTrees() {
        try {
            const response = await this.api.get('/trees');
            return response.data;
        } catch (error) {
            console.error('Error fetching trees:', error);
            throw new Error('Failed to fetch family trees');
        }
    }

    async getTreesbyId(id) {
        try {
            const response = await this.api.get('/trees');
            return response.data;
        } catch (error) {
            console.error('Error fetching trees:', error);
            throw new Error('Failed to fetch family trees');
        }
    }

    async createTree(name) {
        try {
            const response = await this.api.post('/trees', { name });
            return response.data;
        } catch (error) {
            console.error('Error creating family tree:', error);
            throw new Error('Failed to create family tree');
        }
    }

    async deleteTree(treeId) {
        try {
            const response = await this.api.delete(`/trees/${treeId}`);
            return response.data;
        } catch (error) {
            console.error('Error deleting family tree:', error);
            throw new Error('Failed to delete family tree');
        }
    }

    async searchTrees(searchTerm) {
        try {
            const response = await this.api.get(`/trees/search?term=${searchTerm}`);
            return response.data;
        } catch (error) {
            console.error('Error searching trees:', error);
            throw new Error('Failed to search family trees');
        }
    }

    async getFamilyTree(treeId) {
        try {
            const response = await this.api.get(`/treedata/${treeId}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching family tree:', error);
            throw new Error('Failed to fetch family tree data');
        }
    }

    async addFamilyMember(memberData) {
        try {
            const response = await this.api.post('/family', {
                ...memberData,
                treeId: memberData.treeId
            });
            return response.data;
        } catch (error) {
            console.error('Error adding family member:', error);
            throw new Error('Failed to add family member');
        }
    }

    async updateFamilyMember(id, memberData, isSpouse = false) {
        try {
            console.log('Updating member:', { id, memberData, isSpouse });
            const response = await this.api.put(`/family/${id}`, {
                ...memberData,
                isSpouse  
            });
            return response.data;
        } catch (error) {
            console.error('Error updating family member:', error);
            throw new Error('Failed to update family member');
        }
    }

    async deleteFamilyMember(id) {
        try {
            const response = await this.api.delete(`/family/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error deleting family member:', error);
            throw new Error('Failed to delete family member');
        }
    }


    async addSpouse(mainMemberId, spouseData) {
        try {
            const spouseResponse = await this.api.post('/family', {
                ...spouseData,
                spouseId: mainMemberId
            });
            return spouseResponse.data;
        } catch (error) {
            console.error('Error adding spouse:', error);
            throw new Error('Failed to add spouse');
        }
    }
}

export const familyTreeService = new FamilyTreeService();