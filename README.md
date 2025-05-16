# Markdown CV Demo

This folder includes ATS-friendly resume templates in Markdown format (in the `cvs` directory) and a corresponding stylesheet (`style.css`).

## To generate a styled PDF

```bash
# Generate PDF using the npm script (converts cvs/em.md to PDF)
npm run build
```

## Using the Programmatic API

The project includes a JavaScript file (`generate-pdf.js`) that uses md-to-pdf's API to generate PDFs:

```bash
# Generate PDF
npm run build

# Generate HTML preview (useful for styling)
npm run preview
```

## Live Preview with Auto-Refresh

For the best development experience, use the live preview mode that automatically updates when you change your CV or stylesheet:

```bash
# Install dependencies
npm install

# Start live preview server
npm run live
```

This will:
1. Generate an HTML preview of your CV
2. Open it in your default browser
3. Watch for changes in your CV and stylesheet files
4. Automatically refresh the preview when changes are detected

When using the preview mode, an HTML file will be created in the `pdfs` directory that you can open in your browser. This allows you to quickly preview styling changes before generating the final PDF.

### How the script works

```javascript
const { mdToPdf } = require('md-to-pdf');
const path = require('path');
const fs = require('fs');

// Generate a specific CV as PDF
async function generateCV(inputFile, stylesheetPath, outputFile) {
  await mdToPdf(
    { path: inputFile },
    { 
      stylesheet: stylesheetPath,
      dest: outputFile
    }
  );
  console.log(`PDF created at: ${outputFile}`);
}

// Generate a preview HTML for styling
async function generatePreview(inputFile, stylesheetPath, outputHtmlFile) {
  const result = await mdToPdf(
    { path: inputFile },
    { 
      stylesheet: stylesheetPath,
      as_html: true
    }
  );
  
  fs.writeFileSync(outputHtmlFile, result.content);
  console.log(`HTML preview created at: ${outputHtmlFile}`);
}
```

This approach gives you a clean, printable, and ATS-scannable resume with layout and styling.
