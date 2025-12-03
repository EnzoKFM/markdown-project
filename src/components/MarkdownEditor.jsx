import { useState } from "react";
import MarkdownPreview from "./MarkdownPreview";

export default function MarkdownEditor() {
    const [text, setText] = useState("");

    return (
        <div className="w-full bg-slate-950 text-slate-100 p-6">
            <div className="max-w-6xl mx-auto h-full grid grid-cols-1 lg:grid-cols-2 gap-6">

                <div className="flex flex-col h-full">
                    <h2 className="text-xl font-semibold mb-4">Markdown</h2>

                    <textarea
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder="# Markdown..."
                        className="flex-1 w-full bg-slate-900 border border-slate-700 rounded-xl p-4 text-slate-200 font-mono text-sm outline-none resize-none shadow-inner"
                    />
                </div>

                <MarkdownPreview content={text} />

            </div>
        </div>
    );
}
