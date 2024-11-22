import React, { useState, useEffect } from "react";
import Tree from "react-d3-tree";
import { familyTreeService } from "../services/familyTreeService";
import NodeCard from "./NodeCard";

const FamilyTreeComponent = () => {
  const [treeData, setTreeData] = useState();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [contextMenu, setContextMenu] = useState({
    visible: false,
    x: 0,
    y: 0,
    nodeData: null,
    isSpouse: false
  });

  useEffect(() => {
    loadFamilyTree();
    const handleClick = (e) => {
      if (!e.target.closest('.context-menu')) {
        setContextMenu({ ...contextMenu, visible: false });
      }
    };
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  const loadFamilyTree = async () => {
    try {
      setLoading(true);
      const data = await familyTreeService.getFamilyTree();
      setTreeData(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRightClick = (nodeDatum, event, isSpouse = false) => {
    event.preventDefault();
    event.stopPropagation();
    
    // Menentukan data yang akan ditampilkan berdasarkan apakah yang diklik adalah spouse atau bukan
    const displayData = isSpouse ? nodeDatum.spouse : nodeDatum;
    
    setContextMenu({
      visible: true,
      x: event.pageX,
      y: event.pageY,
      nodeData: displayData,
      isSpouse
    });
    
  };

  const handleAddChild = () => {
    console.log("Add child for:", contextMenu.nodeData);
    setContextMenu({ ...contextMenu, visible: false });
  };

  const handleAddSpouse = () => {
    console.log("Add spouse for:", contextMenu.nodeData);
    setContextMenu({ ...contextMenu, visible: false });
  };

  const handleEdit = () => {
    console.log("Edit for:", contextMenu.nodeData);
    setContextMenu({ ...contextMenu, visible: false });
  };
  const handleDelete = () => {
    console.log("Delete for:", contextMenu.nodeData);
    setContextMenu({ ...contextMenu, visible: false });
  };

  const renderContextMenu = () => {
    if (!contextMenu.visible) return null;

    return (
      <div 
        className="context-menu absolute bg-white shadow-lg rounded-lg border p-4 z-50"
        style={{ 
          top: contextMenu.y -100, 
          left: contextMenu.x + 100,
          minWidth: '200px'
        }}
      >
        <div className="mb-4">
          <h3 className="font-bold mb-2">{contextMenu.nodeData.name || 'N/A'}</h3>
        </div>
        
        <div className="w-[300px] flex flex-row flex-wrap ">
          <button 
            className="w-[50%] text-left px-4 py-2 hover:bg-gray-100 rounded"
            onClick={handleAddChild}
          >
            Add Child
          </button>
          <button 
            className="w-[50%] text-left px-4 py-2 hover:bg-gray-100 rounded"
            onClick={handleAddSpouse}
          >
            Add Spouse
          </button>
          <button 
            className="w-[50%] text-left px-4 py-2 hover:bg-gray-100 rounded"
            onClick={handleEdit}
          >
            Edit Person
          </button>
          <button 
            className="w-[50%] text-left px-4 py-2 hover:bg-gray-100 rounded"
            onClick={handleDelete}
          >
            Delete Person
          </button>
        </div>
      </div>
    );
  };

  const renderCustomNode = (rd3tProps) => {
    const { nodeDatum } = rd3tProps;
    return (
      <g>
        {/* Main node card */}
        <g onContextMenu={(e) => handleRightClick(nodeDatum, e, false)}>
          <foreignObject
            width="200"
            height="300"
            x="-100"
            y="-50"
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
        </g>

        {/* Spouse card if exists */}
        {nodeDatum.spouse && (
          <>
            <line
              x1="-100"
              y1="0"
              x2="-200"
              y2="0"
              stroke="#000"
              strokeWidth="1"
            />
            <g onContextMenu={(e) => handleRightClick(nodeDatum, e, true)}>
              <foreignObject
                width="200"
                height="300"
                x={-550 + 220}
                y="-50"
              >
                <div className="p-4 border rounded-lg shadow-lg bg-blue-100">
                  <h3 className="text-lg font-bold">{nodeDatum.spouse.name}</h3>
                  <div className="text-sm">
                    <p>DoB: {nodeDatum.spouse.dob}</p>
                    <p>Status: {nodeDatum.spouse.status}</p>
                  </div>
                </div>
              </foreignObject>
            </g>
          </>
        )}
      </g>
    );
  };

  return (
    <div 
      className="w-full h-[90vh] flex justify-center items-center bg-[green]"
      onContextMenu={(e) => e.preventDefault()}
    >
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      {treeData && (
        <>
          <Tree
            data={treeData}
            collapsible={true}
            orientation="vertical"
            translate={{ x: 1200, y: 100 }}
            nodeSize={{ x: 480, y: 180 }}
            renderCustomNodeElement={renderCustomNode}
            pathFunc={(linkDatum) => {
              const { source, target } = linkDatum;
              return `M${source.x},${source.y}V${(source.y + target.y) / 2}H${target.x}V${target.y}`;
            }}
          />
          {renderContextMenu()}
        </>
      )}
    </div>
  );
};

export default FamilyTreeComponent;