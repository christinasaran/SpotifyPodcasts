<template>
  <div
    class="bg-blue-100 text-blue-900 px-4 py-4 rounded-md shadow-sm mt-4 select-none"
  >
    <div class="flex items-center justify-between" v-if="podcasts.length > 0">
      <span class="font-semibold" aria-live="polite">
        {{ selectedPodcasts.length }} of 5 podcasts selected
      </span>
      <button
        :disabled="selectedPodcasts.length === 0"
        @keydown.enter="onGenerateCalendarClick"
        @keydown.space.prevent="onGenerateCalendarClick"
        @click="onGenerateCalendarClick"
        tabindex="0"
        class="px-3 py-2 rounded-md bg-blue-600 hover:bg-blue-800 text-white disabled:bg-gray-400 focus:outline-none focus:ring focus:ring-blue-300 transition"
        aria-label="Generate Calendar"
      >
        Generate Calendar
      </button>
    </div>
    <div v-else class="font-semibold">Please search for a podcast</div>
  </div>
  <ul class="space-y-2">
    <li
      v-for="podcast in podcasts"
      :key="podcast.id"
      @click="selectPodcast(podcast.id)"
      @keydown.enter="selectPodcast(podcast.id)"
      @keydown.space.prevent="selectPodcast(podcast.id)"
      tabindex="0"
      role="button"
      :aria-selected="selectedPodcasts.some((p) => p.id === podcast.id)"
      :aria-label="'Select podcast ' + podcast.name"
      :class="[
        'group flex items-center p-4 border rounded-md cursor-pointer focus:outline-none',
        selectedPodcasts.some((p) => p.id === podcast.id)
          ? 'bg-blue-600 ring-2 ring-blue-700 hover:bg-blue-800 focus:bg-blue-800'
          : 'hover:bg-gray-600 focus:bg-gray-600',
      ]"
    >
      <!-- Display the podcast image. Using the 300px image if available -->
      <img
        :src="podcast.images[1]?.url || podcast.images[0]?.url"
        alt="Podcast image"
        class="w-16 h-16 object-cover rounded mr-4"
      />

      <!-- Show name and description -->
      <div class="flex-1 overflow-hidden">
        <h2 class="text-lg font-semibold text-white group-focus:text-white">
          {{ podcast.name }}
        </h2>
        <p class="text-sm text-white group-focus:text-white truncate">
          {{ podcast.description }}
        </p>
      </div>
    </li>
  </ul>
</template>

<script setup lang="ts">
import { defineEmits, defineProps, onMounted } from "vue";
import type { Podcast, SelectedPodcast } from "../types/podcast";

// Expect an array of podcasts from the parent component
const props = defineProps<{
  podcasts: Podcast[];
  selectedPodcasts: SelectedPodcast[];
}>();
const emit = defineEmits(["generate-calendar"]);

// Toggle podcast selection, limiting to a maximum of 5 selections
function selectPodcast(id: string) {
  const index = props.selectedPodcasts.findIndex((p) => p.id === id);
  if (index !== -1) {
    // Remove if already selected
    props.selectedPodcasts.splice(index, 1);
  } else if (props.selectedPodcasts.length < 5) {
    // Add if less than 5 selected
    const podcast = props.podcasts.find((p) => p.id === id);
    if (podcast) {
      const selectedPodcast: SelectedPodcast = {
        name: podcast.name,
        id: podcast.id,
      };
      props.selectedPodcasts.push(selectedPodcast);
    }
  }
}

// should have at least one selected podcast
function onGenerateCalendarClick() {
  console.log(props.selectedPodcasts);
  emit("generate-calendar");
}

onMounted(() => {});
</script>
