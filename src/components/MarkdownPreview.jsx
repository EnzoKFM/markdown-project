import MarkdownIt from "markdown-it";

const md = new MarkdownIt({
    html: true,
    linkify: true,
    typographer: true,
    breaks: true
});

export default function MarkdownPreview({ content }) {

    const rendered = md.render(content || "");

    return (
        <div className="flex flex-col h-full">
            <h2 className="text-xl font-semibold mb-4">Preview</h2>

            <div
                className="prose prose-slate prose-invert flex-1 w-full bg-slate-900 border border-slate-700 rounded-xl p-4 text-slate-300 overflow-auto max-w-none"
                dangerouslySetInnerHTML={{ __html: rendered }}
            />
        </div>
    );
}
