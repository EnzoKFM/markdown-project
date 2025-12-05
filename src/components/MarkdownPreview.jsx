import { marked } from "marked";
import { useSelector } from "react-redux";

marked.use({
    breaks: true,
});

export default function MarkdownPreview({ content }) {

    const images = useSelector((state) => state.images.list);

    let rendered = marked.parse(content || "");

    // 2. remplacer les <img src="img:ID"> par base64
    rendered = rendered.replace(
        /<img\s+[^>]*src="img:([^"]+)"[^>]*>/g,
        (match, id) => {
            const img = images.find(i => i.id === id);
            if (!img) return match; // image inconnue → on laisse tel quel

            return `<img src="${img.data}" alt="${img.name}" />`;
        }
    );


    return (
        <div className="flex flex-col h-[600px]">
            <h2 className="text-xl font-semibold mb-4">Preview</h2>

            <div
                className="prose prose-slate prose-invert flex-1 w-full bg-slate-900 border border-slate-700 rounded-xl p-4 text-slate-300 overflow-auto max-w-none"
                dangerouslySetInnerHTML={{ __html: rendered }}
            />
        </div>
    );
}
