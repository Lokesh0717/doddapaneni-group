import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const MESSAGES_DIR = path.join(__dirname, '../messages');
const LOCALES = ['te', 'hi', 'es']; // Target locales
const SOURCE_LOCALE = 'en';

function loadJSON(filePath) {
  if (!fs.existsSync(filePath)) return {};
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function saveJSON(filePath, data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n');
}

function syncKeys(source, target, locale) {
  let modified = false;

  for (const key in source) {
    if (typeof source[key] === 'object' && source[key] !== null) {
      if (!target[key] || typeof target[key] !== 'object') {
        target[key] = {};
        modified = true;
      }
      if (syncKeys(source[key], target[key], locale)) {
        modified = true;
      }
    } else {
      if (target[key] === undefined) {
        // Missing key: Copy from source (English)
        // Note: This does not translate, it only ensures the key exists.
        // Real translation would require an external API service.
        target[key] = source[key];
        console.log(`[${locale}] Added missing key: ${key} (Value: "${source[key]}")`);
        modified = true;
      }
    }
  }
  return modified;
}

function main() {
  console.log('Starting locale synchronization...');
  
  const sourcePath = path.join(MESSAGES_DIR, `${SOURCE_LOCALE}.json`);
  const sourceData = loadJSON(sourcePath);

  for (const locale of LOCALES) {
    const targetPath = path.join(MESSAGES_DIR, `${locale}.json`);
    const targetData = loadJSON(targetPath);
    
    console.log(`Syncing ${SOURCE_LOCALE} -> ${locale}...`);
    const isModified = syncKeys(sourceData, targetData, locale);
    
    if (isModified) {
      saveJSON(targetPath, targetData);
      console.log(`Updated ${locale}.json`);
    } else {
      console.log(`No changes needed for ${locale}.json`);
    }
  }
  
  console.log('Synchronization complete.');
}

main();
