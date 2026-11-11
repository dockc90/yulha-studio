const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const srcDir = 'C:/Users/user/untold-original';
const destDir = 'C:/Users/user/yulha-studio';

fs.mkdirSync(destDir, { recursive: true });

function copyRecursive(src, dest) {
  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (const entry of entries) {
    if (['node_modules', '.git', 'dist', '.next'].includes(entry.name)) continue;

    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      fs.mkdirSync(destPath, { recursive: true });
      copyRecursive(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

copyRecursive(srcDir, destDir);
console.log('Copied project files to yulha-studio');

// Create node_modules junction
const targetJunction = path.join(destDir, 'node_modules');
if (!fs.existsSync(targetJunction)) {
  try {
    execSync(`cmd /c mklink /J "${targetJunction}" "${path.join(srcDir, 'node_modules')}"`);
    console.log('Created node_modules junction successfully');
  } catch(e) {
    console.error('Failed to create junction:', e.message);
  }
}
