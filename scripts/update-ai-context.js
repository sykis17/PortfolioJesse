const fs = require('fs');
const path = require('path');

function scanDirectory(dir, ext, maxDepth = 2, currentDepth = 0) {
  if (currentDepth >= maxDepth) return [];
  const files = [];
  try {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    entries.forEach(entry => {
      if (entry.isDirectory() && !entry.name.startsWith('.')) {
        files.push(...scanDirectory(path.join(dir, entry.name), ext, maxDepth, currentDepth + 1));
      } else if (entry.isFile() && entry.name.endsWith(ext)) {
        files.push(path.join(dir, entry.name));
      }
    });
  } catch (e) {
    // silently skip inaccessible dirs
  }
  return files;
}

function buildContext() {
  let context = "# PORTFOLIO PROJECT CONTEXT\n\n";
  context += `Generated: ${new Date().toISOString()}\n\n`;

  // Config files
  context += "## CONFIGURATION FILES\n\n";
  const configFiles = [
    'docusaurus.config.js',
    'tailwind.config.js',
    'sidebars.js',
    'package.json'
  ];

  configFiles.forEach(file => {
    const fullPath = path.resolve(process.cwd(), file);
    if (fs.existsSync(fullPath)) {
      const content = fs.readFileSync(fullPath, 'utf-8');
      context += `### ${file}\n\`\`\`\n${content.substring(0, 1500)}\n\`\`\`\n\n`;
    }
  });

  // Components
  context += "## COMPONENTS\n\n";
  const components = scanDirectory(path.resolve(process.cwd(), 'src/components'), '.jsx', 1)
    .concat(scanDirectory(path.resolve(process.cwd(), 'src/components'), '.js', 1));
  
  components.forEach(file => {
    const name = path.basename(file);
    const content = fs.readFileSync(file, 'utf-8');
    context += `### ${name}\n\`\`\`jsx\n${content.substring(0, 1000)}\n\`\`\`\n\n`;
  });

  // Utils
  context += "## UTILITIES\n\n";
  const utils = scanDirectory(path.resolve(process.cwd(), 'src/utils'), '.js', 1);
  utils.forEach(file => {
    const name = path.basename(file);
    const content = fs.readFileSync(file, 'utf-8');
    context += `### ${name}\n\`\`\`js\n${content.substring(0, 800)}\n\`\`\`\n\n`;
  });

  // Config directory
  context += "## CONFIG\n\n";
  const configDir = scanDirectory(path.resolve(process.cwd(), 'src/config'), '.js', 1);
  configDir.forEach(file => {
    const name = path.basename(file);
    const content = fs.readFileSync(file, 'utf-8');
    context += `### ${name}\n\`\`\`js\n${content.substring(0, 1000)}\n\`\`\`\n\n`;
  });

  // Docs
  context += "## DOCUMENTATION\n\n";
  const docs = scanDirectory(path.resolve(process.cwd(), 'docs'), '.mdx', 1)
    .concat(scanDirectory(path.resolve(process.cwd(), 'docs'), '.md', 1));
  
  docs.forEach(file => {
    const name = path.basename(file);
    const content = fs.readFileSync(file, 'utf-8');
    context += `### ${name}\n\`\`\`\n${content.substring(0, 800)}\n\`\`\`\n\n`;
  });

  // Save to static directory
  const targetDir = path.resolve(process.cwd(), 'static/ai-context');
  if (!fs.existsSync(targetDir)) fs.mkdirSync(targetDir, { recursive: true });

  fs.writeFileSync(path.join(targetDir, 'CODE_MAP.txt'), context);
  console.log("✅ AI context updated: static/ai-context/CODE_MAP.txt");
  console.log(`📊 Context size: ${(context.length / 1024).toFixed(2)} KB`);
}

buildContext();