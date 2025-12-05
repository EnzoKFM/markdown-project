import { useState, useRef } from "react";
import MarkdownEditor from "../components/MarkdownEditor";
import MarkdownPreview from "../components/MarkdownPreview";
import MarkdownBlocks from "../components/MarkdownBlocks";
import { useBlockShortcuts } from "../hooks/useBlockShortcuts";
import { Provider, useSelector } from "react-redux";
import store from "../store/store";
import Arborescence from "../components/arborescence/Arborescence";
import { saveNode } from "../store/slices/treeSlice";
import { useDispatch } from "react-redux";

export default function Markdown() {
    const [text, setText] = useState("");
    const [node, setNode] = useState(null)
    const textareaRef = useRef(null);
    const { blocks } = useSelector((state) => state.blocks);
    const dispatch = useDispatch();

    function insertBlock(content) {
        const textarea = textareaRef.current;

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;

        setText((prev) => prev.slice(0, start) + content + prev.slice(end));
    }

    function insertNode(node) {
        setNode(node)
        setText("")

        const textarea = textareaRef.current;

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;

        setText((prev) => prev.slice(0, start) + node.text + prev.slice(end));
        console.log(text)
    }

    function saveFile(content) {
        setText(content)

        const nodeId = node.id
        dispatch(saveNode({nodeId, content}))
    }

    function exportNode () {
        const content = node.text;
        const filename = `${node.name}.md`;

        downloadFile(content, filename);
    };

    const downloadFile = (content, filename) => {
        const blob = new Blob([content], { type: "text/plain" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    useBlockShortcuts(blocks, insertBlock);

    return (
        <div className="flex w-full min-h-screen bg-slate-950 text-slate-100 p-6">
            <div className="w-[20%] ">
                <Provider store={store}>
                    <Arborescence 
                        OnFileClick={insertNode}/>
                </Provider>
            </div>
            <div className="w-[80%] mx-auto">
                <div className="flex justify-between ">
                    <h1 className="text-3xl font-bold mb-6">Éditeur Markdown</h1>
                    <button className="cursor-pointer" onClick={exportNode}>📤 Export</button>
                </div>
                

                <div style={{visibility : node ? 'visible' : 'hidden'}}className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <MarkdownEditor value={text} onChange={saveFile} ref={textareaRef} />

                    <MarkdownPreview content={text} />

                    <MarkdownBlocks blocks={blocks} />
                </div>
            </div>
        </div>
    );
}
