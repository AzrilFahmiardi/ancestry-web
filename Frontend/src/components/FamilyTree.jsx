import React from "react";
import Tree from "react-d3-tree";
import { rawTreeData } from "../data/treeData";

const FamilyTreeComponent = () => {
  const transformTreeData = (data) => {
    const processNode = (node) => {
      const { spouse, children = [], ...rest } = node;

      const processedNode = {
        name: node.name,
        attributes: rest.attributes,
        children: children.map((child) => processNode(child)),
        spouse: spouse ? { ...spouse } : null, // Tambahkan pasangan langsung
      };

      return processedNode;
    };

    return processNode(data);
  };

  
  

  const treeData = transformTreeData(rawTreeData);

  return (
    <div className="w-full h-screen flex justify-center items-center bg-gray-100">
      <Tree
        data={treeData}
        orientation="vertical"
        translate={{ x: 500, y: 100 }}
        nodeSize={{ x: 270, y: 150 }}
        renderCustomNodeElement={({ nodeDatum, hierarchyPointNode }) => {
          const nodeWidth = 200;
          const spouseOffset = nodeWidth + 20; // Jarak pasangan

          return (
            <>
              {/* Horizontal line for spouse connection */}
              {nodeDatum.spouse && (
                <line
                  x1="-100"
                  y1="0"
                  x2="-200"
                  y2="0"
                  stroke="#999"
                  strokeWidth="2"
                />
              )}

              {/* Node Utama */}
              <foreignObject
                width="200"
                height="300"
                x="-100"
                y="-50"
                style={{ cursor: "pointer" }}
              >
                <div className="p-4 border rounded-lg shadow-lg bg-white">
                  <h3 className="text-lg font-bold">{nodeDatum.name}</h3>
                  {nodeDatum.attributes && (
                    <div className="text-sm">
                      <p>DoB: {nodeDatum.attributes.dob}</p>
                      <p>Status: {nodeDatum.attributes.status}</p>
                    </div>
                  )}
                </div>
              </foreignObject>

              {/* Pasangan */}
              {nodeDatum.spouse && (
                <foreignObject
                  width="200"
                  height="300"
                  x={-550 + spouseOffset} // Posisi sejajar ke kanan node utama
                  y="-50"
                  style={{ cursor: "pointer" }}
                >
                  <div className="p-4 border rounded-lg shadow-lg bg-blue-100">
                    <h3 className="text-lg font-bold">{nodeDatum.spouse.name}</h3>
                    <div className="text-sm">
                      <p>DoB: {nodeDatum.spouse.dob}</p>
                      <p>Status: {nodeDatum.spouse.status}</p>
                    </div>
                  </div>
                </foreignObject>
              )}
            </>
          );
        }}
        pathFunc={(linkDatum) => {
          const { source, target } = linkDatum;

          // Garis koneksi pasangan
          if (target.data.isSpouse) {
            return `M${source.x},${source.y}H${target.x}`;
          }

          // Garis koneksi parent-child (vertikal)
          return `M${source.x},${source.y}V${(source.y + target.y) / 2}H${target.x}V${target.y}`;
        }}
      />
    </div>
  );
};

export default FamilyTreeComponent;