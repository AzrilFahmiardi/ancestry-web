import React from "react";

const NodeCard = ({ nodeDatum }) => {
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
          stroke="#000"
          strokeWidth="1"
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
};

export default NodeCard;