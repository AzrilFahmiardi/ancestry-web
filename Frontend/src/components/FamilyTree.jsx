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
  const [isNodeFormVisible, setIsNodeFormVisible] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    dob: "",
    status: "",
    parentID: null,
    spouseID:null
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

    console.log("Right Click Node Data:", nodeDatum);
    console.log("Is Spouse:", isSpouse);
    
    // Use the nodeDatum directly as it's already properly formatted in renderCustomNode
    setContextMenu({
        visible: true,
        x: event.pageX,
        y: event.pageY,
        nodeData: nodeDatum,
        isSpouse,
        nodeId: isSpouse ? nodeDatum.id_spouse : nodeDatum.id,
    });
};

  const handleAddChild = () => {
    // Find the parent ID from the node's path or other identifiable information
    const parentId = contextMenu.nodeData.id; // This needs to be sourced correctly
    setFormData({
      name: "",
      dob: "",
      status: "",
      parentID: parentId,
      spouseID: null
    });
    setIsNodeFormVisible(true);
    setContextMenu({ ...contextMenu, visible: false });
  };

  const handleAddSpouse = () => {
    const currentNodeId = contextMenu.nodeData.id; // This needs to be sourced correctly
    setFormData({
      name: "",
      dob: "",
      status: "",
      parentID: null,
      spouseID: currentNodeId
    });
    setIsNodeFormVisible(true);
    setContextMenu({ ...contextMenu, visible: false });
  };

  const handleEdit = () => {
    // Determine if we're editing a spouse
    const isEditingSpouse = contextMenu.isSpouse;
    
    // Get the correct data based on whether we're editing main person or spouse
    let editData;
    let editId;
    
    if (isEditingSpouse) {
        // For spouse, use the spouse data
        editData = {
            name: contextMenu.nodeData.name,
            dob: contextMenu.nodeData.dob,
            status: contextMenu.nodeData.status
        };
        editId = contextMenu.nodeData.id;
    } else {
        // For main person, use the main data     
        editData = {
            name: contextMenu.nodeData.name,
            dob: contextMenu.nodeData.attributes?.dob,
            status: contextMenu.nodeData.attributes?.status
        };
        editId = contextMenu.nodeData.id;
    }

    console.log("Editing:", { isEditingSpouse, editData, editId });

    setFormData({
        name: editData.name || '',
        dob: editData.dob || '',
        status: editData.status || '',
        parentID: null,
        spouseID: null,
        editId: editId,
        isEditingSpouse: isEditingSpouse
    });

    setIsNodeFormVisible(true);
    setContextMenu({ ...contextMenu, visible: false });
};

  const handleDelete = async () => {
    try {
      const deleteId = contextMenu.nodeData.id;
      await familyTreeService.deleteFamilyMember(deleteId);
      
      // Reload family tree after deletion
      loadFamilyTree();
      
      setContextMenu({ ...contextMenu, visible: false });
    } catch (error) {
      console.error("Error deleting family member:", error);
      // Optionally show error message to user
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        const submissionData = {
            name: formData.name,
            dob: formData.dob,
            status: formData.status
        };

        console.log('Submitting update:', {
            id: formData.editId,
            data: submissionData,
            isSpouse: formData.isEditingSpouse
        });

        if (formData.editId) {
            // Edit existing person or spouse
            await familyTreeService.updateFamilyMember(
                formData.editId,
                submissionData,
                formData.isEditingSpouse
            );
        } else if (formData.parentID || formData.spouseID) {
            // Add new person
            await familyTreeService.addFamilyMember({
                ...submissionData,
                parentId: formData.parentID,
                spouseId: formData.spouseID
            });
        }

        // Reset form and reload tree
        setFormData({
            name: "",
            dob: "",
            status: "",
            parentID: null,
            spouseID: null,
            editId: null,
            isEditingSpouse: false
        });
        
        await loadFamilyTree();
        setIsNodeFormVisible(false);
        setContextMenu({ visible: false, nodeData: null });
    } catch (error) {
        console.error("Error adding/editing family member:", error);
        alert("Error updating family member. Please try again.");
    }
};
const nodeForm = () => {
  if (!isNodeFormVisible) return null;

  return (
    <div className="fixed top-0 left-0 w-screen h-screen bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
        <h2 className="form-title text-xl font-semibold mb-4 text-center">
          {formData.spouseID ? 'Add Spouse' : 
           formData.parentID ? 'Add Child' : 
           'Edit Family Member'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input 
              type="text" 
              name="name"
              placeholder="Enter name"
              value={formData.name}
              onChange={handleInputChange}
              required
              className="w-full mt-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
            <input 
              type="date" 
              name="dob"
              value={formData.dob}
              onChange={handleInputChange}
              className="w-full mt-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Status</label>
            <div className="flex items-center space-x-4 mt-2">
              <label className="inline-flex items-center">
                <input 
                  type="radio" 
                  name="status"
                  value="hidup"
                  checked={formData.status === "hidup"}
                  onChange={handleInputChange}
                  className="text-blue-500 focus:ring-2 focus:ring-blue-500"
                />
                <span className="ml-2">Hidup</span>
              </label>
              <label className="inline-flex items-center">
                <input 
                  type="radio" 
                  name="status"
                  value="mati"
                  checked={formData.status === "mati"}
                  onChange={handleInputChange}
                  className="text-blue-500 focus:ring-2 focus:ring-blue-500"
                />
                <span className="ml-2">Mati</span>
              </label>
            </div>
          </div>
          <div className="flex justify-end space-x-2">
            <button 
              type="button" 
              className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
              onClick={() => setIsNodeFormVisible(false)}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              {formData.spouseID || formData.parentID ? 'Add' : 'Update'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
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
            {/* Pass spouse data directly to context menu */}
            <g onContextMenu={(e) => handleRightClick(
              { 
                id: nodeDatum.spouse.id,
                name: nodeDatum.spouse.name,
                dob: nodeDatum.spouse.dob,
                status: nodeDatum.spouse.status
              }, 
              e, 
              true
            )}>
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
          {nodeForm()}
        </>
      )}
    </div>
  );
};

export default FamilyTreeComponent;