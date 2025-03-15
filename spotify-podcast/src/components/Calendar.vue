<template>
  <div class="w-full h-screen p-4 bg-gray-900 text-white overflow-hidden">
    <h1 class="text-2xl font-bold mb-4 text-blue-300">Calendar</h1>
    <vue-cal
      :events="events"
      :time="false"
      @event-click="openModal"
      default-view="month"
      :views="['month', 'week']"
      :color-classes="colorClasses"
      class="w-full h-full shadow rounded-lg overflow-hidden"
      style="background-color: #1f2937; color: #ffffff"
    />
  </div>
</template>

<script setup lang="ts">
import { defineProps, computed } from "vue";
import VueCal from "vue-cal";
import "vue-cal/dist/vuecal.css";

const props = defineProps<{
  episodeList: Array<{
    podcastId: string;
    podcastName: string;
    episodes: Array<{ release_date: string; title: string }>;
  }>;
}>();

// Blue theme for event colours that suit the dark background
const colorClasses = {
  "podcast-1": "bg-blue-600",
  "podcast-2": "bg-blue-500",
  "podcast-3": "bg-blue-400",
  "podcast-4": "bg-blue-300",
  "podcast-5": "bg-blue-200",
};

const events = computed(() => {
  return props.episodeList.flatMap((podcast, index) => {
    const colorClass = `podcast-${index + 1}`;
    return podcast.episodes.map((episode) => ({
      start: episode.release_date,
      end: episode.release_date,
      title: `${podcast.podcastName}: ${episode.title}`,
      class: colorClass,
    }));
  });
});

function openModal(event) {
  console.log("Open modal for event:", event);
  // Add your modal opening logic here
}
</script>
