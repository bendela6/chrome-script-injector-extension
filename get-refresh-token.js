import dotenv from "dotenv";
dotenv.config();

const clientId = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;
const authCode = process.env.AUTH_CODE;

async function getRefreshToken(clientId, clientSecret, code) {
  console.log("🔄 Requesting refresh token from Google OAuth...\n");

  const data = {
    client_id: clientId,
    client_secret: clientSecret,
    code: code,
    grant_type: "authorization_code",
    redirect_uri: "urn:ietf:wg:oauth:2.0:oob",
  };

  const formBody = Object.keys(data)
    .map((key) => encodeURIComponent(key) + "=" + encodeURIComponent(data[key]))
    .join("&");

  try {
    const response = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
      },
      body: formBody,
    });

    const result = await response.json();

    if (!response.ok || result.error) {
      console.error("❌ Error:", result.error);
      console.error("Description:", result.error_description);

      if (result.error === "invalid_grant") {
        console.error("\n💡 This usually means:");
        console.error("  - The authorization code has expired (they expire quickly!)");
        console.error("  - The authorization code was already used");
        console.error("  - The clientId/clientSecret don't match");
        console.error("\nPlease get a new authorization code and try again.");
      }
      return;
    }

    console.log("✅ Success! Here are your tokens:\n");
    console.log("REFRESH_TOKEN:", result.refresh_token);
    console.log("\nAccess Token (expires in 1 hour):", result.access_token);
    console.log("\n⚠️  Save the REFRESH_TOKEN in your environment variables!");
    console.log("   This is the token you'll use for uploads.");

    return result;
  } catch (error) {
    console.error("❌ Error fetching refresh token:", error.message);
  }
}

if (clientId && clientSecret && authCode) {
  void getRefreshToken(clientId, clientSecret, authCode);
} else {
  const params = {
    scope: "https://www.googleapis.com/auth/chromewebstore",
    access_type: "offline",
    response_type: "code",
    redirect_uri: "urn:ietf:wg:oauth:2.0:oob",
    client_id: clientId,
  };

  const authUrl =
    `https://accounts.google.com/o/oauth2/v2/auth?` +
    Object.entries(params)
      .map(([key, value]) => `${key}=${value}`)
      .join("&");
  console.log("🔑 To get an authorization code, visit this URL in your browser:\n");
  console.log(authUrl + "\n");
}
