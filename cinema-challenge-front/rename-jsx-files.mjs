// rename-jsx-files.mjs
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Files to rename
const filesToRename = [
  'src/context/AlertContext.js',
  'src/context/AuthContext.js'
];

console.log('Renaming .js files with JSX to .jsx:');
console.log('--------------------------------------');

filesToRename.forEach(file => {
  const oldPath = path.join(__dirname, file);
  const newPath = oldPath.replace('.js', '.jsx');
  
  try {
    // Check if the file exists
    if (fs.existsSync(oldPath)) {
      // Rename the file
      fs.renameSync(oldPath, newPath);
      
      // Update imports in other files if needed
      console.log(`Renamed ${oldPath} to ${newPath}`);
      
      // Also update any imports in App.jsx or other files if needed
    } else {
      console.log(`File not found: ${oldPath}`);
    }
  } catch (error) {
    console.error(`Error renaming ${oldPath}:`, error);
  }
});

console.log('--------------------------------------');
console.log('Renaming complete. Remember to update any imports in your files!');
