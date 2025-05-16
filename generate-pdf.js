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
  console.log(`Open this file in your browser to preview the styling.`);
}

// Parse command line arguments
const args = process.argv.slice(2);
const previewMode = args.includes('--preview');

// Input and output files
const inputFile = './cvs/em.md';
const stylesheetPath = './styles/cv-styling.css';
const outputPdfFile = './pdfs/em_cv.pdf';
const outputHtmlFile = './pdfs/em_cv_preview.html';

// Generate either HTML preview or PDF based on mode
if (previewMode) {
  generatePreview(inputFile, stylesheetPath, outputHtmlFile).catch(console.error);
} else {
  generateCV(inputFile, stylesheetPath, outputPdfFile).catch(console.error);
} 