<script setup lang="ts">
import { ref } from "vue";

const query = ref("");
const podcasts = ref<any[]>([]);
const isLoading = ref(false);
const error = ref<string | null>(null);

const CLIENT_ID = "388dcaf144944b57bc090f478c6a5cbc";
const CLIENT_SECRET = "4872b0f68eeb49c4b0af71f5fb4b7893";

// Function to get Spotify API Access Token
async function getAccessToken(): Promise<string | null> {
  try {
    const response = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${btoa(`${CLIENT_ID}:${CLIENT_SECRET}`)}`,
      },
      body: "grant_type=client_credentials",
    });

    const data = await response.json();
    return data.access_token;
  } catch (err) {
    console.error("Error getting access token:", err);
    return null;
  }
}

// Function to search for podcasts
async function searchPodcasts() {
  if (!query.value.trim()) return;

  isLoading.value = true;
  error.value = null;
  podcasts.value = [];

  const token = await getAccessToken();
  if (!token) {
    error.value = "Failed to authenticate with Spotify API.";
    isLoading.value = false;
    return;
  }

  try {
    const response = await fetch(
      `https://api.spotify.com/v1/search?q=${encodeURIComponent(
        query.value
      )}&type=show`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    const data = await response.json();
    podcasts.value = data.shows?.items || [];
  } catch (err) {
    console.error("Error searching for podcasts:", err);
    error.value = "Failed to fetch podcast data.";
  }

  isLoading.value = false;
}
</script>

<template>
  <div class="p-6 max-w-lg mx-auto">
    <h1 class="text-2xl font-bold mb-4">Search for Podcasts on Spotify</h1>

    <div class="flex gap-2">
      <input
        v-model="query"
        placeholder="Enter podcast name"
        class="border p-2 rounded w-full"
      />
      <button
        @click="searchPodcasts"
        class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Search
      </button>
    </div>

    <p v-if="isLoading" class="mt-4 text-gray-500">Loading...</p>
    <p v-if="error" class="mt-4 text-red-500">{{ error }}</p>

    <div v-if="podcasts.length" class="mt-6">
      <h2 class="text-xl font-semibold">Results:</h2>
      <ul class="mt-2">
        <li
          v-for="podcast in podcasts"
          :key="podcast.id"
          class="mt-2 p-4 border rounded hover:bg-gray-100"
        >
          <a
            :href="podcast.external_urls.spotify"
            target="_blank"
            class="text-blue-500 hover:underline"
          >
            {{ podcast.name }}
          </a>
          <p class="text-sm text-gray-600">
            {{ podcast.description.slice(0, 100) }}...
          </p>
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped></style>
