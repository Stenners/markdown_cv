const { mdToPdf } = require('md-to-pdf');
const path = require('path');
const fs = require('fs');
const chokidar = require('chokidar');

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

// Process all markdown files in the cvs directory
async function processAllCVs() {
  const cvsDir = './cvs';
  const pdfsDir = './pdfs';
  const stylesheetPath = './styles/cv-styling.css';

  // Ensure pdfs directory exists
  if (!fs.existsSync(pdfsDir)) {
    fs.mkdirSync(pdfsDir);
  }

  // Get all .md files from cvs directory
  const files = fs.readdirSync(cvsDir)
    .filter(file => file.endsWith('.md'));

  for (const file of files) {
    const inputFile = path.join(cvsDir, file);
    const baseName = path.basename(file, '.md');
    const outputPdfFile = path.join(pdfsDir, `${baseName}.pdf`);

    console.log(`Processing ${file}...`);
    
    try {
      await generateCV(inputFile, stylesheetPath, outputPdfFile);
    } catch (error) {
      console.error(`Error processing ${file}:`, error);
    }
  }
}

// Watch for changes in markdown files
function watchCVs() {
  const cvsDir = './cvs';
  const stylesheetPath = './styles/cv-styling.css';
  const pdfsDir = './pdfs';

  console.log('Watching for changes in CV files...');

  const watcher = chokidar.watch(path.join(cvsDir, '*.md'), {
    ignored: /(^|[\/\\])\../, // ignore dotfiles
    persistent: true
  });

  watcher
    .on('change', async (filepath) => {
      const baseName = path.basename(filepath, '.md');
      const outputPdfFile = path.join(pdfsDir, `${baseName}.pdf`);
      console.log(`File ${filepath} has been changed. Regenerating PDF...`);
      try {
        await generateCV(filepath, stylesheetPath, outputPdfFile);
      } catch (error) {
        console.error(`Error processing ${filepath}:`, error);
      }
    });
}

// Check if we're in watch mode
const isWatchMode = process.argv.includes('--watch');

if (isWatchMode) {
  watchCVs();
} else {
  processAllCVs().catch(console.error);
} 