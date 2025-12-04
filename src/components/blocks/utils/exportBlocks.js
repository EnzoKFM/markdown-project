export const exportSingleBlock = (block) => {
  const content = block.content;
  const filename = `${block.name}.part.mdlc`;

  downloadFile(content, filename);
};

export const exportMultipleBlocks = (blocks) => {
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const filename = `blocks_export_${timestamp}.parts.mdlc`;

  const content = blocks
    .map((block) => {
      return `# ${block.name}\n\n${block.content}`;
    })
    .join("\n\n---\n\n");

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
