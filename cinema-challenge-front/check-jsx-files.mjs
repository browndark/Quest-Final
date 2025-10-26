// check-jsx-files.mjs
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// List of directories to search for .js files
const directories = [
  path.join(__dirname, 'src/context'),
  path.join(__dirname, 'src/hooks')
];

// Regular expression to detect JSX in a file
const jsxRegex = /<[A-Za-z][A-Za-z0-9]*(?:\s+[A-Za-z][A-Za-z0-9]*(?:={(?:{.*?}|\".*?\"|'.*?')}|\s+[A-Za-z]+=(?:\".*?\"|'.*?'))?)*\s*\/?>|<\/[A-Za-z][A-Za-z0-9]*>/;

console.log('Checking for JS files containing JSX that should be renamed to .jsx:');
console.log('--------------------------------------------------------------');

// Walk through each directory
directories.forEach(directory => {
  try {
    // Read all files in the directory
    const files = fs.readdirSync(directory);
    
    files.forEach(file => {
      // Only process .js files
      if (path.extname(file) === '.js') {
        const filePath = path.join(directory, file);
        const content = fs.readFileSync(filePath, 'utf-8');
        
        // Check if the file contains JSX
        if (jsxRegex.test(content)) {
          console.log(`${filePath} contains JSX and should be renamed to .jsx`);
        }
      }
    });
  } catch (error) {
    console.error(`Error reading directory ${directory}:`, error);
  }
});

console.log('--------------------------------------------------------------');
console.log('Check complete. Consider renaming these files or ensuring proper Vite configuration.');
