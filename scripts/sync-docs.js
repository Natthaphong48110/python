import fs from 'fs';
import path from 'path';

const root = process.cwd();
const distDir = path.join(root, 'dist');
const docsDir = path.join(root, 'docs');

if (fs.existsSync(distDir)) {
  if (!fs.existsSync(docsDir)) {
    fs.mkdirSync(docsDir, { recursive: true });
  }

  // Copy dist to docs
  fs.cpSync(distDir, docsDir, { recursive: true });

  // Ensure 404.html exists for GitHub Pages SPA
  const indexHtml = path.join(docsDir, 'index.html');
  const notFoundHtml = path.join(docsDir, '404.html');
  if (fs.existsSync(indexHtml)) {
    fs.copyFileSync(indexHtml, notFoundHtml);
  }

  // Ensure .nojekyll exists
  fs.writeFileSync(path.join(docsDir, '.nojekyll'), '');

  // Remove node server bundles from docs (they are not needed for GitHub Pages static files)
  const serverCjs = path.join(docsDir, 'server.cjs');
  const serverMap = path.join(docsDir, 'server.cjs.map');
  if (fs.existsSync(serverCjs)) fs.unlinkSync(serverCjs);
  if (fs.existsSync(serverMap)) fs.unlinkSync(serverMap);

  console.log('✓ Successfully synced dist to docs for GitHub Pages (branch main, /docs)');
} else {
  console.warn('dist directory does not exist');
}
