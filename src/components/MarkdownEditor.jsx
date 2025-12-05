export default function MarkdownEditor({ value, onChange, onDrop, onDragOver, ref }) {
    return (
        <div className="flex flex-col h-[600px]">
            <h2 className="text-xl font-semibold mb-3 text-slate-200">
                Markdown
            </h2>
            <textarea
                ref={ref}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                onDrop={onDrop}
                onDragOver={onDragOver}
                placeholder="# Titre&#10;&#10;Écrivez votre markdown ici..."
                className="flex-1 w-full bg-slate-900 border border-slate-700 rounded-lg p-4 text-slate-200 font-mono text-sm outline-none focus:ring-2 focus:ring-blue-500 resize-none shadow-lg"
            />
        </div>
    );
}
