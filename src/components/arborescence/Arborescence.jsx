import {useTree} from "../../hooks/useTree.js"

function Arborescence() {
    const [tree, setTree] = useTree('fileTree')

    if(!tree){
        const defaultTree = { id: 'root', name: 'root', children: [] };
        setTree(defaultTree)
        return <div></div>;
    }

    const addNode = (parentId, newNode) => {
        const addRecursive = (node) => {
            if(node.id === parentId){
                node.children = [...node.children, newNode]
            } else {
                node.children.forEach(addRecursive)
            }
        };
        const newTree = { ...tree };
        addRecursive(newTree);
        setTree(newTree);
    }

    return(
    <>
        <section>
            <h1>Arborescence</h1>
            <div>
                <button onClick={() => addNode('root', { id: 'folder1', name: 'New Folder', children: [] })}>Ajouter un dossier</button>
            </div>
            
        </section>
    </>
    )
}

export default Arborescence