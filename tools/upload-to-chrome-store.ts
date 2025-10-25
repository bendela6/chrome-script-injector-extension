import { execSync } from "child_process";
import { existsSync } from "fs";

/**
 * Upload Chrome Extension to Chrome Web Store
 *
 * Required environment variables:
 * - CLIENT_ID: Your Chrome Web Store client ID
 * - CLIENT_SECRET: Your Chrome Web Store client secret
 * - REFRESH_TOKEN: Your Chrome Web Store refresh token
 * - EXTENSION_ID: Your Chrome extension ID
 *
 * Optional environment variables:
 * - EXTENSION_FILE: Path to the zip file (default: extension.zip)
 * - PUBLISH: Set to "true" to auto-publish after upload
 */

interface TokenResponse {
  access_token?: string;
  error?: string;
  error_description?: string;
}

function log(message: string): void {
  console.log(`[Chrome Store Upload] ${message}`);
}

function error(message: string): void {
  console.error(`[Chrome Store Upload ERROR] ${message}`);
}

function getAccessToken(clientId: string, clientSecret: string, refreshToken: string): string {
  log("Getting access token...");

  const tokenUrl = "https://oauth2.googleapis.com/token";
  const data = [
    `client_id=${clientId}`,
    `client_secret=${clientSecret}`,
    `refresh_token=${refreshToken}`,
    "grant_type=refresh_token",
  ].join("&");

  try {
    const response = execSync(`curl -s -X POST -d "${data}" ${tokenUrl}`, { encoding: "utf8" });

    const parsed: TokenResponse = JSON.parse(response);

    if (!parsed.access_token) {
      error("Failed to get access token. Response:");
      console.error(response);
      throw new Error("No access token in response");
    }

    log("Access token obtained successfully");
    return parsed.access_token;
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    error(`Failed to get access token: ${message}`);
    throw err;
  }
}

function uploadExtension(accessToken: string, extensionId: string, filePath: string): void {
  log(`Uploading extension from ${filePath}...`);

  if (!existsSync(filePath)) {
    throw new Error(`Extension file not found: ${filePath}`);
  }

  const uploadUrl = `https://www.googleapis.com/upload/chromewebstore/v1.1/items/${extensionId}`;

  try {
    execSync(
      `curl -v -H "Authorization: Bearer ${accessToken}" -H "x-goog-api-version: 2" -X PUT -T "${filePath}" "${uploadUrl}"`,
      { encoding: "utf8", stdio: "inherit" }
    );

    log("Extension uploaded successfully");
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    error(`Failed to upload extension: ${message}`);
    throw err;
  }
}

function publishExtension(accessToken: string, extensionId: string): void {
  log("Publishing extension...");

  const publishUrl = `https://www.googleapis.com/chromewebstore/v1.1/items/${extensionId}/publish`;

  try {
    execSync(
      `curl -v -H "Authorization: Bearer ${accessToken}" -H "x-goog-api-version: 2" -H "Content-Length: 0" -X POST "${publishUrl}"`,
      { encoding: "utf8", stdio: "inherit" }
    );

    log("Extension published successfully");
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    error(`Failed to publish extension: ${message}`);
    throw err;
  }
}

async function main(): Promise<void> {
  const clientId = process.env.CLIENT_ID;
  const clientSecret = process.env.CLIENT_SECRET;
  const refreshToken = process.env.REFRESH_TOKEN;
  const extensionId = process.env.EXTENSION_ID;
  const extensionFile = process.env.EXTENSION_FILE || "extension.zip";
  const shouldPublish = process.env.PUBLISH === "true";

  // Validate required environment variables
  if (!clientId || !clientSecret || !refreshToken || !extensionId) {
    error("Missing required environment variables");
    console.error("Required:");
    console.error("  - CLIENT_ID");
    console.error("  - CLIENT_SECRET");
    console.error("  - REFRESH_TOKEN");
    console.error("  - EXTENSION_ID");
    console.error("\nOptional:");
    console.error("  - EXTENSION_FILE (default: extension.zip)");
    console.error('  - PUBLISH (set to "true" to auto-publish)');
    process.exit(1);
  }

  try {
    // Step 1: Get access token
    const accessToken = getAccessToken(clientId, clientSecret, refreshToken);

    // Step 2: Upload extension
    uploadExtension(accessToken, extensionId, extensionFile);

    // Step 3: Optionally publish
    if (shouldPublish) {
      publishExtension(accessToken, extensionId);
    } else {
      log("Skipping publish (set PUBLISH=true to auto-publish)");
    }

    log("✅ All done!");
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    error(`Process failed: ${message}`);
    process.exit(1);
  }
}

main();
