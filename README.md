# Markdown CV Demo

This folder includes an ATS-friendly resume in Markdown (`cv.md`) and a corresponding stylesheet (`style.css`).

## To generate a styled PDF (recommended):

### Option A: With `md-to-pdf` (Node)

```bash
npm install -g md-to-pdf
md-to-pdf cv.md --stylesheet style.css
```

### Option B: With `markdown-pdf` (Node)

```bash
npm install -g markdown-pdf
markdown-pdf cv.md -s style.css -o cv.pdf
```

This approach gives you a clean, printable, and ATS-scannable resume with layout and styling.
