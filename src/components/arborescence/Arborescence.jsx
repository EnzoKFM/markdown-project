import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { addNode, moveNode, changeName, deleteNode, importNode } from "../../store/slices/treeSlice.js";
import InputModal from "../modals/InputModal.jsx";
import ConfirmModal from "../modals/ConfirmModal.jsx";

function Arborescence() {
    const tree = useSelector((state) => state.tree.tree);
    const dispatch = useDispatch();

    const [draggedId, setDraggedId] = useState(null);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [usedNodeId, setUsedNodeId] = useState(null);
    const [contextMenu, setContextMenu] = useState({
        visible: false,
        x: 0,
        y: 0,
        nodeId: null,
    });

    const findNode = (node, id) => {
        if (node.id === id) return node;
        for (const child of node.children || []) {
            const found = findNode(child, id);
            if (found) return found;
        }
        return null;
    };

    const isChild = (node, targetId) => {
        if (!node.children) return false;
        for (const child of node.children) {
            if (child.id === targetId) return true;
            if (isChild(child, targetId)) return true;
        }
        return false;
    };

    const handleAddNode = (parentId, nodeType) => {
        dispatch(addNode({ parentId, nodeType }));
    };

    const handleMoveNode = (nodeId, newParentId) => {
        dispatch(moveNode({ nodeId, newParentId }));
    };

    const handleChangeName = (value) => {
        dispatch(changeName({ nodeId: usedNodeId, newName: value }));
        setUsedNodeId(null);
    };

    const handleDeleteNode = () => {
        dispatch(deleteNode(usedNodeId));
        setUsedNodeId(null);
    };

    const handleImportFile = (e) => {
        if(e.target.files) {
            const file = e.target.files[0]

            const reader = new FileReader();

            reader.onload = (e) => {
                const fileContent = event.target.result;

                const fileNode = {
                    id: crypto.randomUUID(),
                    name: file.name.split('.').slice(0, -1).join('.'),
                    type: 'file',
                    text: fileContent,
                    children: [],
                };

                dispatch(importNode({ fileNode }))
            }
            reader.readAsText(file);
        }
    };

    const [openFolders, setOpenFolders] = useState({});

    const toggleFolder = (id) => {
        setOpenFolders(prev => ({
            ...prev,
            [id]: !prev[id]
        }));
    };

    const handleContextMenu = (e, nodeId) => {
        e.preventDefault();
        e.stopPropagation();
        setContextMenu({
            visible: true,
            x: e.pageX,
            y: e.pageY,
            nodeId,
        });
    };

    const closeContextMenu = () => {
        setContextMenu({ visible: false, x: 0, y: 0, nodeId: null });
    };

    useEffect(() => {
        const handleClick = () => closeContextMenu();
        window.addEventListener("click", handleClick);
        return () => window.removeEventListener("click", handleClick);
    }, []);

    const renderTree = (nodes) => {
        return (
            <ul className="pl-6 list-none">
            {nodes.map((node) => {
                const draggedNode = findNode(tree, draggedId);
                const dropAllowed = !(draggedId === node.id) && !(draggedNode && isChild(draggedNode, node.id));

                const isFolder = (node.type == 'folder');
                const isOpen = openFolders[node.id];

                return (
                <li
                    key={node.id}
                    draggable
                    onDragStart={(e) => {
                        e.stopPropagation();
                        setDraggedId(node.id);
                    }}

                    onDragOver={(e) => e.preventDefault()}

                    onDrop={(e) => {
                        e.stopPropagation();
                        if (dropAllowed) handleMoveNode(draggedId, node.id);
                        setDraggedId(null);
                    }}

                    className={`p-1 rounded cursor-${dropAllowed ? 'grab' : 'not-allowed'}`}
                    onContextMenu={(e) => { handleContextMenu(e, node.id) }}
                >
                    <div className="flex items-center justify-between">
                        <div
                            className="flex items-center gap-2 cursor-pointer"
                            onClick={(e) => {
                                e.stopPropagation();
                                if (isFolder) {
                                    toggleFolder(node.id)
                                } else {
                                    console.log("Informations du fichier : ", node.text);
                                };
                            }}
                        >
                            {isFolder ? (isOpen ? "🔽📂" : "▶️📁") : "📄"}{" "}
                            {node.name}
                        </div>
                    </div>

                    {isFolder && isOpen && renderTree(node.children)}
                </li>
                );
            })}
            </ul>
        );
    };

    return (
        <>
            <section className="p-4">
                <h1 className="text-3xl font-bold">Arborescence</h1>
                <div className="flex gap-4">
                    <button className="cursor-pointer" onClick={() => handleAddNode('root', 'file')}>📄 File</button>
                    <button className="cursor-pointer" onClick={() => handleAddNode('root', 'folder')}>📁 Folder</button>

                    <label className="cursor-pointer" htmlFor="file">📥 Import</label>
                    <input id="file" className="hidden" type="file" accept=".md" onChange={handleImportFile} />
                </div>
                
                {renderTree(tree.children)}

                <div 
                    style={{visibility: draggedId != null ? "visible" : "hidden", height: draggedId != null ? "auto" : "0"}}
                    className="mt-6 bg-blue-50 border-2 border-dashed border-blue-400 rounded p-3 mb-4 text-center text-blue-600"
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => {
                        e.stopPropagation();
                        handleMoveNode(draggedId, 'root');
                        setDraggedId(null);
                    }}
                >📁 Déposer ici pour déplacer à la racine</div>
                <InputModal
                    isOpen={isEditOpen}
                    onClose={() => setIsEditOpen(false)}
                    onSubmit={handleChangeName}
                    title="Entrez le nom"
                />
                <ConfirmModal
                    isOpen={isDeleteOpen}
                    onClose={() => setIsDeleteOpen(false)}
                    onSubmit={handleDeleteNode}
                    title="Voulez-vous vraiment supprimer ?"
                />
            </section>

            {contextMenu.visible && (
            <div
                className="absolute bg-white shadow-lg border rounded p-2 z-50"
                style={{ top: contextMenu.y, left: contextMenu.x }}
            >
                <button
                    className="block px-2 py-1 hover:bg-gray-100 w-full text-left"
                    onClick={() => {
                        setUsedNodeId(contextMenu.nodeId);
                        setIsEditOpen(true);
                        closeContextMenu();
                    }}
                >✏️ Éditer</button>
                <button
                    className="block px-2 py-1 hover:bg-gray-100 w-full text-left"
                    onClick={() => {
                        setUsedNodeId(contextMenu.nodeId);
                        setIsDeleteOpen(true);
                        closeContextMenu();
                    }}
                >❌ Supprimer</button>
            </div>
            )}
        </>
    );
}

export default Arborescence;