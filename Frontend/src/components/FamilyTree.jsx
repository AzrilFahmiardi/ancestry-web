import React from "react";
import Tree from "react-d3-tree";

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

  const rawTreeData = {
    name: "Kakek",
    attributes: { dob: "1950-01-01", status: "Hidup" },
    spouse: { name: "Nenek", dob: "1952-02-20", status: "Hidup" },
    children: [
      {
        name: "Ayah",
        attributes: { dob: "1980-03-15", status: "Hidup" },
        spouse: { name: "Ibu", dob: "1985-06-20", status: "Hidup" },
        children: [
          {
            name: "Anak 1",
            attributes: { dob: "2005-07-10", status: "Hidup" },
            spouse: { name: "Mantu", dob: "1990-07-20", status: "Hidup" },
            children: [
              {
                name: "Cucu 1",
                attributes: { dob: "2025-01-01", status: "Hidup" },
              },
              {
                name: "Cucu 2",
                attributes: { dob: "2027-01-01", status: "Hidup" },
              },
            ],
          },
          {
            name: "Anak 2",
            attributes: { dob: "2008-09-22", status: "Hidup" },
            spouse: { name: "Mantu 2", dob: "2010-01-01", status: "Hidup" },
            children: [
              {
                name: "Cucu 3",
                attributes: { dob: "2030-05-15", status: "Hidup" },
                spouse: { name: "Cucu 3's Spouse", dob: "2032-01-20", status: "Hidup" },
                children: [
                  {
                    name: "Cicit 1",
                    attributes: { dob: "2050-06-10", status: "Hidup" },
                  },
                ],
              },
            ],
          },
          {
            name: "Anak 3",
            attributes: { dob: "2012-01-10", status: "Hidup" },
          },
        ],
      },
      {
        name: "Paman",
        attributes: { dob: "1985-04-10", status: "Hidup" },
        spouse: { name: "Bibi", dob: "1987-08-22", status: "Hidup" },
        children: [
          {
            name: "Sepupu 1",
            attributes: { dob: "2010-03-15", status: "Hidup" },
            children: [
              {
                name: "Keponakan 1",
                attributes: { dob: "2030-02-10", status: "Hidup" },
              },
            ],
          },
          {
            name: "Sepupu 2",
            attributes: { dob: "2012-07-20", status: "Hidup" },
          },
        ],
      },
      {
        name: "Bibi 2",
        attributes: { dob: "1990-11-25", status: "Hidup" },
      },
    ],
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
