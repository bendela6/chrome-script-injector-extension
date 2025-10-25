#!/usr/bin/env node

import { execSync } from "child_process";
import { readFileSync, writeFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const PACKAGE_JSON_PATH = join(__dirname, "../package.json");
const MANIFEST_JSON_PATH = join(__dirname, "../src/manifest.json");

/**
 * Parses a semantic version string
 * @param {string} version - Version string like "1.0.7"
 * @returns {{major: number, minor: number, patch: number}}
 */
function parseVersion(version) {
  const [major, minor, patch] = version.split(".").map(Number);
  return { major, minor, patch };
}

/**
 * Formats version object back to string
 * @param {{major: number, minor: number, patch: number}} version
 * @returns {string}
 */
function formatVersion(version) {
  return `${version.major}.${version.minor}.${version.patch}`;
}

/**
 * Increments version based on type
 * @param {string} currentVersion - Current version string
 * @param {'patch'|'minor'|'major'} type - Type of version bump
 * @returns {string}
 */
function incrementVersion(currentVersion, type) {
  const version = parseVersion(currentVersion);

  switch (type) {
    case "major":
      version.major++;
      version.minor = 0;
      version.patch = 0;
      break;
    case "minor":
      version.minor++;
      version.patch = 0;
      break;
    case "patch":
    default:
      version.patch++;
      break;
  }

  return formatVersion(version);
}

/**
 * Updates version in a JSON file
 * @param {string} filePath - Path to JSON file
 * @param {string} newVersion - New version string
 */
function updateJsonVersion(filePath, newVersion) {
  const content = readFileSync(filePath, "utf-8");
  const json = JSON.parse(content);
  json.version = newVersion;

  // Preserve formatting by using 2 spaces indent
  writeFileSync(filePath, JSON.stringify(json, null, 2) + "\n", "utf-8");
}

/**
 * Executes a shell command and returns output
 * @param {string} command - Command to execute
 * @returns {string}
 */
function exec(command) {
  return execSync(command, { encoding: "utf-8" }).trim();
}

/**
 * Checks if there are uncommitted changes (excluding version files)
 * @returns {boolean}
 */
function hasUncommittedChanges() {
  const status = exec("git status --porcelain");
  if (!status) return false;

  // Filter out changes to version files
  const lines = status.split("\n").filter((line) => {
    return (
      !line.includes("package.json") &&
      !line.includes("manifest.json") &&
      !line.includes("package-lock.json")
    );
  });

  return lines.length > 0;
}

/**
 * Main release function
 */
async function main() {
  const args = process.argv.slice(2);
  const versionType = args[0] || "patch"; // patch, minor, or major
  const shouldPush = args.includes("--push");

  // Validate version type
  if (!["patch", "minor", "major"].includes(versionType)) {
    console.error(`❌ Invalid version type: ${versionType}`);
    console.error("Usage: npm run release [patch|minor|major] [--push]");
    console.error("\nExamples:");
    console.error("  npm run release patch        # 1.0.7 -> 1.0.8");
    console.error("  npm run release minor        # 1.0.7 -> 1.1.0");
    console.error("  npm run release major        # 1.0.7 -> 2.0.0");
    console.error("  npm run release patch --push # Bump and push tag");
    process.exit(1);
  }

  console.log(`\n🚀 Starting ${versionType} release...\n`);

  // Check for uncommitted changes
  if (hasUncommittedChanges()) {
    console.error("❌ Error: You have uncommitted changes.");
    console.error("Please commit or stash them first (excluding package.json/manifest.json).\n");
    console.log(exec("git status --short"));
    process.exit(1);
  }

  // Read current version
  const packageJson = JSON.parse(readFileSync(PACKAGE_JSON_PATH, "utf-8"));
  const currentVersion = packageJson.version;
  const newVersion = incrementVersion(currentVersion, versionType);

  console.log(`📦 Current version: ${currentVersion}`);
  console.log(`📦 New version:     ${newVersion}\n`);

  // Check if tag already exists
  try {
    exec(`git rev-parse v${newVersion}`);
    console.error(`❌ Error: Tag v${newVersion} already exists!`);
    process.exit(1);
  } catch (e) {
    // Tag doesn't exist, continue
  }

  // Update package.json
  console.log("📝 Updating package.json...");
  updateJsonVersion(PACKAGE_JSON_PATH, newVersion);

  // Update manifest.json
  console.log("📝 Updating manifest.json...");
  updateJsonVersion(MANIFEST_JSON_PATH, newVersion);

  // Stage the changes
  console.log("📝 Staging version changes...");
  exec("git add package.json src/manifest.json");

  // Commit the changes
  console.log(`📝 Committing version bump to ${newVersion}...\n`);
  exec(`git commit -m "chore: bump version to ${newVersion}"`);

  // Create tag
  console.log(`🏷️  Creating tag v${newVersion}...`);
  exec(`git tag -a v${newVersion} -m "Release v${newVersion}"`);
  console.log(`✅ Tag v${newVersion} created successfully\n`);

  if (shouldPush) {
    console.log("📤 Pushing changes to remote...");
    exec("git push origin main");

    console.log(`📤 Pushing tag v${newVersion} to remote...`);
    exec(`git push origin v${newVersion}`);

    console.log(`\n✅ Release v${newVersion} completed and pushed!`);
    console.log("🎉 GitHub Actions workflow should now be triggered!");
  } else {
    console.log("📋 To push the changes and tag, run:");
    console.log(`   git push origin main`);
    console.log(`   git push origin v${newVersion}`);
    console.log("\n💡 Or run the command again with --push flag:");
    console.log(`   npm run release ${versionType} --push`);
  }

  console.log(`\n✨ Done!\n`);
}

main().catch((error) => {
  console.error("\n❌ Error during release:", error.message);
  process.exit(1);
});
