const { mdToPdf } = require('md-to-pdf');
const fs = require('fs');
const path = require('path');
const liveServer = require('live-server');

// Settings
const CV_FILE = './cvs/em.md';
const STYLESHEET = './styles/cv-styling.css';
const OUTPUT_DIR = './pdfs';
const HTML_PREVIEW = path.join(OUTPUT_DIR, 'preview.html');

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Generate HTML preview
async function generatePreview() {
  console.log('Generating HTML preview...');
  
  try {
    const result = await mdToPdf(
      { path: CV_FILE },
      { 
        stylesheet: STYLESHEET,
        as_html: true
      }
    );
    
    // Create an HTML file with auto-refresh capability
    const htmlWithRefresh = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>CV Preview</title>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          /* PDF-like rendering */
          @page {
            size: A4;
            margin: 0;
          }
          body {
            box-sizing: border-box;
            margin: 0 auto;
            padding: 20mm;
            width: 210mm;
            min-height: 297mm;
            background-color: white;
            box-shadow: 0 0 20px rgba(0, 0, 0, 0.15);
            font-size: 12pt;
          }
          @media screen {
            html {
              background: #eee;
              padding: 30px;
            }
            body {
              font-size: 12pt !important;
              line-height: 1.5 !important;
            }
          }
        </style>
        ${result.content.split('</head>')[0]}
      </head>
      ${result.content.split('</head>')[1]}
    `;
    
    fs.writeFileSync(HTML_PREVIEW, htmlWithRefresh);
    console.log(`Preview updated at: ${HTML_PREVIEW}`);
  } catch (err) {
    console.error('Error generating preview:', err);
  }
}

// Watch for changes in CV files and stylesheets
function watchFiles() {
  console.log('Watching for changes...');
  
  // Watch CV file
  fs.watch(CV_FILE, { persistent: true }, (eventType) => {
    if (eventType === 'change') {
      console.log(`${CV_FILE} changed. Updating preview...`);
      generatePreview();
    }
  });
  
  // Watch stylesheet
  fs.watch(STYLESHEET, { persistent: true }, (eventType) => {
    if (eventType === 'change') {
      console.log(`${STYLESHEET} changed. Updating preview...`);
      generatePreview();
    }
  });
  
  // Watch all CV files
  try {
    const cvsDir = path.dirname(CV_FILE);
    fs.watch(cvsDir, { persistent: true }, (eventType, filename) => {
      if (eventType === 'change' && filename && filename.endsWith('.md')) {
        console.log(`CV file changed: ${filename}. Updating preview...`);
        generatePreview();
      }
    });
  } catch (err) {
    console.error('Error watching CVs directory:', err);
  }
  
  // Watch all stylesheet files
  try {
    const stylesDir = path.dirname(STYLESHEET);
    fs.watch(stylesDir, { persistent: true }, (eventType, filename) => {
      if (eventType === 'change' && filename && filename.endsWith('.css')) {
        console.log(`Stylesheet changed: ${filename}. Updating preview...`);
        generatePreview();
      }
    });
  } catch (err) {
    console.error('Error watching styles directory:', err);
  }
}

// Start live server
function startServer() {
  const params = {
    port: 8181,
    root: OUTPUT_DIR,
    open: true,
    file: path.basename(HTML_PREVIEW),
    wait: 1000
  };
  
  liveServer.start(params);
  console.log(`Live server started at http://localhost:${params.port}`);
}

// Main function
async function main() {
  await generatePreview();
  watchFiles();
  startServer();
  console.log('Live preview is running. Edit your CV or stylesheet to see changes.');
}

main().catch(console.error); 