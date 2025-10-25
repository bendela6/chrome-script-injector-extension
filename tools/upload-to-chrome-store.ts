import { existsSync, readFileSync } from "fs";

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

async function getAccessToken(
  clientId: string,
  clientSecret: string,
  refreshToken: string
): Promise<string> {
  log("Getting access token...");

  const tokenUrl = "https://oauth2.googleapis.com/token";

  const params = new URLSearchParams({
    client_id: clientId,
    client_secret: clientSecret,
    refresh_token: refreshToken,
    grant_type: "refresh_token",
  });

  const response = await fetch(tokenUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: params.toString(),
  });

  const parsed: TokenResponse = await response.json();

  if (!parsed.access_token) {
    error("Failed to get access token. Response:");
    console.error(JSON.stringify(parsed, null, 2));
    if (parsed.error) {
      throw new Error(
        `${parsed.error}: ${parsed.error_description || "No access token in response"}`
      );
    }
    throw new Error("No access token in response");
  }

  log("Access token obtained successfully");
  return parsed.access_token;
}

async function uploadExtension(
  accessToken: string,
  extensionId: string,
  filePath: string
): Promise<void> {
  log(`Uploading extension from ${filePath}...`);

  if (!existsSync(filePath)) {
    throw new Error(`Extension file not found: ${filePath}`);
  }

  const uploadUrl = `https://www.googleapis.com/upload/chromewebstore/v1.1/items/${extensionId}`;

  const fileBuffer = readFileSync(filePath);

  const response = await fetch(uploadUrl, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "x-goog-api-version": "2",
    },
    body: fileBuffer,
  });

  const result = await response.json();

  if (!response.ok) {
    error("Upload failed. Response:");
    console.error(JSON.stringify(result, null, 2));
    throw new Error(`Upload failed with status ${response.status}`);
  }

  log("Extension uploaded successfully");
  console.log("Upload result:", JSON.stringify(result, null, 2));
}

async function publishExtension(accessToken: string, extensionId: string): Promise<void> {
  log("Publishing extension...");

  const publishUrl = `https://www.googleapis.com/chromewebstore/v1.1/items/${extensionId}/publish`;

  const response = await fetch(publishUrl, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "x-goog-api-version": "2",
      "Content-Length": "0",
    },
  });

  const result = await response.json();

  if (!response.ok) {
    error("Publish failed. Response:");
    console.error(JSON.stringify(result, null, 2));
    throw new Error(`Publish failed with status ${response.status}`);
  }

  log("Extension published successfully");
  console.log("Publish result:", JSON.stringify(result, null, 2));
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
    const accessToken = await getAccessToken(clientId, clientSecret, refreshToken);

    // Step 2: Upload extension
    await uploadExtension(accessToken, extensionId, extensionFile);

    // Step 3: Optionally publish
    if (shouldPublish) {
      await publishExtension(accessToken, extensionId);
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
