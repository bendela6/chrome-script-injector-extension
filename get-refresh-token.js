function getRefreshToken(clientId, clientSecret, code) {
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

  return fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
    },
    body: formBody,
  }).then((response) => response.json());
}

getRefreshToken(
  //
  "CLIENT_ID",
  "CLIENT_SECRET",
  "AUTH_CODE"
)
  .then((token) => {
    console.log("Refresh Token:", token);
  })
  .catch((error) => {
    console.error("Error fetching refresh token:", error);
  });
