#!/usr/bin/env node

import { execSync } from "child_process";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Read version from package.json
const packageJsonPath = join(__dirname, "../package.json");
const packageJson = JSON.parse(readFileSync(packageJsonPath, "utf-8"));
const version = packageJson.version;
const tag = `v${version}`;

console.log(`Creating git tag: ${tag}`);

try {
  // Check if tag already exists
  try {
    execSync(`git rev-parse ${tag}`, { stdio: "pipe" });
    console.error(`Error: Tag ${tag} already exists!`);
    console.log("\nTo create a new tag, update the version in package.json first.");
    process.exit(1);
  } catch (e) {
    // Tag doesn't exist, continue
  }

  // Check if there are uncommitted changes
  const status = execSync("git status --porcelain", { encoding: "utf-8" });
  if (status.trim()) {
    console.error("Error: You have uncommitted changes. Please commit or stash them first.");
    console.log("\nUncommitted changes:");
    console.log(status);
    process.exit(1);
  }

  // Create the tag
  execSync(`git tag -a ${tag} -m "Release ${tag}"`, { stdio: "inherit" });
  console.log(`✓ Tag ${tag} created successfully`);

  // Ask if user wants to push
  console.log("\nTo push the tag and trigger the publish workflow, run:");
  console.log(`  git push origin ${tag}`);
  console.log("\nOr to push it now, run this script with --push flag");

  // Check if --push flag is provided
  if (process.argv.includes("--push")) {
    console.log("\nPushing tag to remote...");
    execSync(`git push origin ${tag}`, { stdio: "inherit" });
    console.log(`✓ Tag ${tag} pushed to remote`);
    console.log("\nThe GitHub Actions workflow should now be triggered!");
  }
} catch (error) {
  console.error("Error creating tag:", error.message);
  process.exit(1);
}
