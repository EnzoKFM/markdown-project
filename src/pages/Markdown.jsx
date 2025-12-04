import { useState, useRef } from "react";
import MarkdownEditor from "../components/MarkdownEditor";
import MarkdownPreview from "../components/MarkdownPreview";
import MarkdownBlocks from "../components/MarkdownBlocks";
import { useBlockShortcuts } from "../hooks/useBlockShortcuts";
import { useSelector } from "react-redux";

export default function Markdown() {
    const [text, setText] = useState("");
    const textareaRef = useRef(null);
    const { blocks } = useSelector((state) => state.blocks);

    function insert(content) {
        const textarea = textareaRef.current;

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;

        setText((prev) => prev.slice(0, start) + content + prev.slice(end));
    }

    useBlockShortcuts(blocks, insert);

    return (
        <div className="w-full min-h-screen bg-slate-950 text-slate-100 p-6">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold mb-6">Éditeur Markdown</h1>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <MarkdownEditor value={text} onChange={setText} ref={textareaRef} />

                    <MarkdownPreview content={text} />

                    <MarkdownBlocks blocks={blocks} />
                </div>
            </div>
        </div>
    );
}
