const fs = require('node:fs');
const path = require('node:path');

const targetPath = path.join(
  __dirname,
  '..',
  'node_modules',
  'react-native-css-interop',
  'dist',
  'metro',
  'index.js'
);

const legacy = `            haste.emit("change", {
                eventsQueue: [
                    {
                        filePath,
                        metadata: {
                            modifiedTime: Date.now(),
                            size: 1,
                            type: "virtual",
                        },
                        type: "change",
                    },
                ],
            });`;

const patched = `            haste.emit("change", {
                changes: {
                    addedFiles: new Map(),
                    modifiedFiles: new Map([
                        [
                            filePath,
                            {
                                modifiedTime: Date.now(),
                                isSymlink: false,
                            },
                        ],
                    ]),
                    removedFiles: new Map(),
                },
                rootDir: "",
            });`;

try {
  if (!fs.existsSync(targetPath)) {
    process.exit(0);
  }

  const current = fs.readFileSync(targetPath, 'utf8');
  if (current.includes('addedFiles: new Map()')) {
    process.exit(0);
  }

  if (!current.includes(legacy)) {
    console.warn('[MDS] NativeWind Metro patch target did not match; leaving file unchanged.');
    process.exit(0);
  }

  fs.writeFileSync(targetPath, current.replace(legacy, patched), 'utf8');
  console.log('[MDS] Patched react-native-css-interop Metro change event for Metro 0.85.');
} catch (error) {
  console.warn(`[MDS] Could not patch NativeWind Metro integration: ${error.message}`);
}
