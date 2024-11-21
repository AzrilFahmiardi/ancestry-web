import React from "react";
import Tree from "react-d3-tree";
import { TreeData } from "../data/treeData";
import NodeCard from "./NodeCard";

const FamilyTreeComponent = () => {
  return (
    <div className="w-full h-screen flex justify-center items-center bg-gray-100">
      <Tree
        data={TreeData}
        orientation="vertical"
        translate={{ x: 1200, y: 100 }}
        nodeSize={{ x: 270, y: 180 }}
        renderCustomNodeElement={({ nodeDatum}) => (
          <NodeCard nodeDatum={nodeDatum} />
        )}
        pathFunc={(linkDatum) => {
          const { source, target } = linkDatum;
          return `M${source.x - 115},${source.y}V${(source.y + target.y) / 2}H${target.x}V${target.y}`;
        }}
      />
    </div>
  );
};

export default FamilyTreeComponent;