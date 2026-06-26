import { promises as fs } from "fs";
import path from "path";

const projectRoot = path.resolve(process.argv[2] || path.join(import.meta.dirname, ".."));
const iconPackageRoot = path.join(projectRoot, "experimemo-icons-package");
const assetsRoot = path.join(projectRoot, "assets");
const copyTargets = [
  {
    source: path.join(iconPackageRoot, "ios", "AppIcon-1024x1024.png"),
    destination: path.join(assetsRoot, "icon.png"),
  },
  {
    source: path.join(iconPackageRoot, "ios", "AppIcon-1024x1024.png"),
    destination: path.join(assetsRoot, "adaptive-icon.png"),
  },
  {
    source: path.join(iconPackageRoot, "ios", "AppIcon-1024x1024.png"),
    destination: path.join(assetsRoot, "splash.png"),
  },
  {
    source: path.join(iconPackageRoot, "android", "res", "mipmap-mdpi", "icon.png"),
    destination: path.join(assetsRoot, "favicon.png"),
  },
  {
    source: path.join(iconPackageRoot, "android", "play_store_512x512.png"),
    destination: path.join(assetsRoot, "play-store-icon.png"),
  },
];

async function ensureDir(dirPath) {
  await fs.mkdir(dirPath, { recursive: true });
}

async function copyFile(source, destination) {
  try {
    await ensureDir(path.dirname(destination));
    await fs.copyFile(source, destination);
    console.log(`Copied ${path.relative(projectRoot, source)} -> ${path.relative(projectRoot, destination)}`);
  } catch (error) {
    if (error?.code === "ENOENT") {
      console.warn(`Source missing: ${source}`);
      return;
    }
    throw error;
  }
}

for (const { source, destination } of copyTargets) {
  await copyFile(source, destination);
}

console.log("Expo icon copy complete.");
