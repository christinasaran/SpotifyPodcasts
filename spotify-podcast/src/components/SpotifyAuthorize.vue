<script setup lang="ts">
import { onMounted } from "vue";

const clientId: string = "388dcaf144944b57bc090f478c6a5cbc";

const redirectUrl: string = "http://127.0.0.1:5173"; // your redirect URL - must be localhost URL and/or HTTPS

const authorizationEndpoint: string = "https://accounts.spotify.com/authorize";
const tokenEndpoint: string = "https://accounts.spotify.com/api/token";
const scope: string = "user-read-private user-read-email";

interface TokenResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
}

// Data structure that manages the current active token, caching it in localStorage
const currentToken = {
  get access_token(): string | null {
    return localStorage.getItem("access_token");
  },
  get refresh_token(): string | null {
    return localStorage.getItem("refresh_token");
  },
  get expires_in(): string | null {
    // Note: this uses "refresh_in" instead of "expires_in" as the key. Keeping as-is.
    return localStorage.getItem("refresh_in");
  },
  get expires(): string | null {
    return localStorage.getItem("expires");
  },

  save: function (response: TokenResponse): void {
    const { access_token, refresh_token, expires_in } = response;
    localStorage.setItem("access_token", access_token);
    localStorage.setItem("refresh_token", refresh_token);
    localStorage.setItem("expires_in", expires_in.toString());

    const now = new Date();
    const expiry = new Date(now.getTime() + expires_in * 1000);
    // Convert Date to string to store it
    localStorage.setItem("expires", expiry.toString());
  },
};

// Spotify API Calls
async function getToken(code: string): Promise<TokenResponse> {
  const code_verifier: string | null = localStorage.getItem("code_verifier");
  const response = await fetch(tokenEndpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      client_id: clientId,
      grant_type: "authorization_code",
      code: code,
      redirect_uri: redirectUrl,
      code_verifier: code_verifier || "",
    }),
  });

  return await response.json();
}

async function redirectToSpotifyAuthorize(): Promise<void> {
  const possible: string =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const randomValues = crypto.getRandomValues(new Uint8Array(64));
  const randomString = randomValues.reduce(
    (acc, x) => acc + possible[x % possible.length],
    ""
  );

  const code_verifier: string = randomString;
  const data = new TextEncoder().encode(code_verifier);
  const hashed = await crypto.subtle.digest("SHA-256", data);

  const code_challenge_base64 = btoa(
    String.fromCharCode(...new Uint8Array(hashed))
  )
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");

  window.localStorage.setItem("code_verifier", code_verifier);

  const authUrl = new URL(authorizationEndpoint);
  const params = {
    response_type: "code",
    client_id: clientId,
    scope: scope,
    code_challenge_method: "S256",
    code_challenge: code_challenge_base64,
    redirect_uri: redirectUrl,
  };

  authUrl.search = new URLSearchParams(params).toString();
  window.location.href = authUrl.toString(); // Redirect the user to the authorization server for login
}

async function handleSpotifyCallback(): Promise<void> {
  // On page load, try to fetch auth code from current browser search URL
  const args = new URLSearchParams(window.location.search);
  const code = args.get("code");

  // If we find a code, we're in a callback, do a token exchange
  if (code) {
    const token = await getToken(code);
    debugger;
    currentToken.save(token);

    // Remove code from URL so we can refresh correctly.
    const url = new URL(window.location.href);
    url.searchParams.delete("code");

    const updatedUrl = url.search ? url.href : url.href.replace("?", "");
    window.history.replaceState({}, document.title, updatedUrl);
  }
}

onMounted(() => {
  handleSpotifyCallback();
});
</script>

<template>
  <button @click="redirectToSpotifyAuthorize">Authorize Spotify</button>
</template>

<style scoped></style>
