window.renderMarkdown = function (md) {
  const lines = md.split("\n");
  let html = "";
  let inList = false;
  let inCodeBlock = false;

  for (let line of lines) {
    // Code blocks
    if (line.startsWith("```")) {
      inCodeBlock = !inCodeBlock;
      html += inCodeBlock ? "<pre><code>" : "</code></pre>";
      continue;
    }

    if (inCodeBlock) {
      html += line.replace(/</g, "&lt;").replace(/>/g, "&gt;") + "\n";
      continue;
    }

    // Headings
    if (line.startsWith("### ")) {
      html += `<h3>${line.slice(4)}</h3>`;
      continue;
    }
    if (line.startsWith("## ")) {
      html += `<h2>${line.slice(3)}</h2>`;
      continue;
    }
    if (line.startsWith("# ")) {
      html += `<h1>${line.slice(2)}</h1>`;
      continue;
    }

    // Horizontal rule
    if (line.trim() === "---") {
      if (inList) {
        html += "</ul>";
        inList = false;
      }
      html += "<hr />";
      continue;
    }

    // Lists
    if (line.startsWith("- ")) {
      if (!inList) {
        html += "<ul>";
        inList = true;
      }
      html += `<li>${line.slice(2)}</li>`;
      continue;
    } else if (inList) {
      html += "</ul>";
      inList = false;
    }

    // Blockquotes
    if (line.startsWith("> ")) {
      html += `<blockquote>${line.slice(2)}</blockquote>`;
      continue;
    }

    // Empty line
    if (!line.trim()) {
      html += "<br />";
      continue;
    }

    // Inline formatting
    let text = line
      .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.+?)\*/g, "<em>$1</em>")
      .replace(/`(.+?)`/g, "<code>$1</code>")
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');

    html += `<p>${text}</p>`;
  }

  if (inList) html += "</ul>";

  return html;
};
