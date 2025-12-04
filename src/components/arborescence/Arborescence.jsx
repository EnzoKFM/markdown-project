import {useTree} from "../../hooks/useTree.js"
import {useState} from "react"
import InputModal from "../modals/InputModal.jsx";
import ConfirmModal from "../modals/ConfirmModal.jsx";

function Arborescence() {
    const [tree, setTree] = useTree('fileTree')
    const [draggedId, setDraggedId] = useState(null);

    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);

    const [usedNodeId, setUsedNodeId] = useState(null);

    if(!tree){
        const defaultTree = { id: 'root', name: 'root', type: 'root', children: [] };
        setTree(defaultTree)
        return <div></div>;
    }

    const addNode = (parentId, nodeType) => {
        let newNode = {}
        if(nodeType == "folder"){
            newNode = { id: crypto.randomUUID(), name: 'New Folder', type: 'folder', children: [] }
        } else {
            newNode = { id: crypto.randomUUID(), name: 'New File', type: 'file', children: [] }
        }

        const addNodeRecursive = (node) => {
            if(node.id === parentId){
                node.children = [...node.children, newNode]
            } else {
                node.children.forEach(addNodeRecursive)
            }
        };
        const newTree = { ...tree };
        addNodeRecursive(newTree);
        setTree(newTree);
    }

    const findNode = (node, id) => {
        if (node.id === id) return node;
        for (const child of node.children) {
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

    const moveNode = (nodeId, newParentId) => {
        const newTree = structuredClone(tree);

        let movedNode = null;

        if (nodeId === newParentId) {
            console.warn("Impossible de placer un dossier dans lui-même");
            return;
        }

        const draggedNode = findNode(newTree, nodeId);
        if (!draggedNode) return;

        if (isChild(draggedNode, newParentId)) {
            console.warn("Impossible de mettre un dossier dans un de ses descendants");
            return;
        }

        const parentNode = findNode(newTree, newParentId);
        if (parentNode.type === 'file'){
            console.warn("Ceci n'est pas un dossier");
            return;
        }

        const removeNodeRecursive = (node) => {
            if (!node.children) return;

            node.children = node.children.filter(child => {
                if (child.id === nodeId) {
                    movedNode = child;
                    return false;
                }
                return true;
            });

            node.children.forEach(removeNodeRecursive);
        };

        removeNodeRecursive(newTree);

        if (!movedNode) {
            console.warn("Node not found:", nodeId);
            return;
        }

        const addNodeRecursive = (node) => {
            if (node.id === newParentId) {
                node.children.push(movedNode);
                return true;
            }
            return node.children.some(addNodeRecursive);
        };

        addNodeRecursive(newTree);

        setTree(newTree);
    };

    const changeName = (value) => {
        const newTree = { ...tree };

        const changeNodeRecursive = (node, newValue) => {
            if(node.id === usedNodeId){
                node.name = newValue
            } else {
                node.children.forEach(child => changeNodeRecursive(child, newValue))
            }
        };

        changeNodeRecursive(newTree, value)
        setTree(newTree)
        setUsedNodeId(null)
    }

    const deleteNode = () => {
        const newTree = { ...tree };

        const deleteNodeRecursive = (node) => {
            if (node.id === usedNodeId) return false;
            
            if (node.children) {
                node.children = node.children.filter(deleteNodeRecursive);
            }
            
            return true;
        };

        if (newTree.children) {
            newTree.children = newTree.children.filter(deleteNodeRecursive);
        }

        setTree(newTree)
        setUsedNodeId(null)
    }

    const renderTree = (nodes) => {
        return (
            <ul className="pl-10 list-disc">
                {nodes.map((node) => {
                const draggedNode = findNode(tree, draggedId);
                const dropAllowed = !(draggedId === node.id) && !(draggedNode && isChild(draggedNode, node.id));

                return (
                    <li
                    key={node.id}
                    draggable
                    onDragStart={(e) => {e.stopPropagation(); setDraggedId(node.id)}}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => {
                        e.stopPropagation();
                        if (dropAllowed) moveNode(draggedId, node.id);
                    }}
                    onClick={(e) => {e.stopPropagation(), console.log("Nom du node : ", node.name)}}
                    className={`
                        p-1 rounded
                        cursor-${dropAllowed ? 'grab' : 'not-allowed'}
                    `}
                    >
                    {node.name}

                    <div className="inline-flex gap-4">
                        <button className='ml-4' onClick={() => { setUsedNodeId(node.id); setIsEditOpen(true)}}>✏️</button>
                        <button onClick={() => { setUsedNodeId(node.id); setIsDeleteOpen(true)}}>❌</button>
                    </div>

                    {node.children?.length > 0 && renderTree(node.children)}
                    </li>
                );
                })}
            </ul>
        );
    };

    const deleteTree = () => {
        const defaultTree = { id: 'root', name: 'root', children: [] };
        setTree(defaultTree)
    }

    return(
    <>
        <section className="border-1 border-solid rounded-xl p-4">
            <h1 className="text-3xl font-bold">Arborescence</h1>
            {renderTree(tree.children)}
            <div className="flex gap-4">
                <button onClick={() => addNode('root', 'folder')}>Ajouter un dossier</button>
                <button onClick={() => addNode('root', 'file')}>Ajouter un fichier</button>
                <button onClick={deleteTree}>Vider le localStorage</button>
            </div>
            <InputModal
                isOpen={isEditOpen}
                onClose={() => setIsEditOpen(false)}
                onSubmit={changeName}
                title="Entrez le nom"
            />
            <ConfirmModal
                isOpen={isDeleteOpen}
                onClose={() => setIsDeleteOpen(false)}
                onSubmit={deleteNode}
                title="Voulez-vous vraiment supprimer ?"
            />
        </section>
    </>
    )
}

export default Arborescence