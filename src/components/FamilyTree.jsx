import React from 'react';
import Tree from 'react-d3-tree';

const FamilyTreeComponent = () => {
    const treeData = {
        name: "Kakek",
        attributes: { dob: "1950-01-01", status: "Hidup" },
        children: [
            {
                name: "Ayah",
                attributes: { dob: "1980-03-15", status: "Hidup" },
                children: [
                    { name: "Anak 1", attributes: { dob: "2005-07-10", status: "Hidup" } },
                    { name: "Anak 2", attributes: { dob: "2008-09-22", status: "Hidup" } }
                ]
            },
            {
                name: "Ibu",
                attributes: { dob: "1985-06-20", status: "Hidup" }
            }
        ]
    };

    return (
        <div className="w-[100vw] h-[100vh] flex justify-center items-center bg-red-500">
            <Tree
                data={treeData}
                orientation="vertical"
                translate={{ x: 900, y: 100 }}
                nodeSize={{ x: 200, y: 200 }}
                pathFunc="step"
                separation={{ siblings: 1.5, nonSiblings: 2 }}
                collapsible={false}
                renderCustomNodeElement={({ nodeDatum, toggleNode }) => (
                    <foreignObject
                        width="200"
                        height="100"
                        x="-100"
                        y="-50"
                        onClick={() => {
                            console.log("Node yang diklik:", nodeDatum);
                            alert(`Node yang diklik: ${nodeDatum.name}`);
                        }}
                        style={{ cursor: 'pointer' }}
                    >
                        <div className="bg-white border border-gray-300 rounded-lg p-4 shadow-lg">
                            <h3 className="text-lg font-semibold">{nodeDatum.name}</h3>
                            {nodeDatum.attributes && (
                                <div className="text-sm text-gray-600 flex justify-between">
                                    <p>{nodeDatum.attributes.dob}</p>
                                    <p>{nodeDatum.attributes.status}</p>
                                </div>
                            )}
                        </div>
                    </foreignObject>
                )}
            />
        </div>
    );
};

export default FamilyTreeComponent;
