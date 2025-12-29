// Very small markdown renderer (headings, lists, code, links)
window.renderMarkdown = function (md) {
  return md
    .replace(/^### (.*$)/gim, "<h3>$1</h3>")
    .replace(/^## (.*$)/gim, "<h2>$1</h2>")
    .replace(/^# (.*$)/gim, "<h1>$1</h1>")
    .replace(/^\> (.*$)/gim, "<blockquote>$1</blockquote>")
    .replace(/\*\*(.*)\*\*/gim, "<strong>$1</strong>")
    .replace(/\*(.*)\*/gim, "<em>$1</em>")
    .replace(/`([^`]+)`/gim, "<code>$1</code>")
    .replace(/```([\s\S]*?)```/gim, "<pre><code>$1</code></pre>")
    .replace(/^\- (.*$)/gim, "<li>$1</li>")
    .replace(/(<li>.*<\/li>)/gim, "<ul>$1</ul>")
    .replace(/\[([^\]]+)\]\(([^)]+)\)/gim, '<a href="$2">$1</a>')
    .replace(/\n$/gim, "<br />");
};
