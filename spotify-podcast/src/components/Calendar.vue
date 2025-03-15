<template>
  <div
    class="w-full h-screen p-4 bg-blue-800 font-semibold text-black overflow-hidden"
  >
    <vue-cal
      :events="events"
      :time="false"
      @event-click="openModal"
      default-view="month"
      :views="['month', 'week']"
      class="w-full h-full shadow rounded-lg overflow-hidden"
    />
    <Modal
      v-if="selectedEvent"
      :episode="selectedEvent"
      @close="closeModal"
      class="z-10"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, defineProps, computed } from "vue";
import VueCal from "vue-cal";
import "vue-cal/dist/vuecal.css";
import Modal from "./Modal.vue";

const props = defineProps<{
  episodeList: Array<{
    podcastId: string;
    podcastName: string;
    episodes: Array<{
      release_date: string;
      name: string;
      description: string;
      external_urls?: { spotify: string };
      images?: Array<{ url: string }>;
    }>;
  }>;
}>();

const colorClasses: { [key: string]: string } = {
  "podcast-1": "bg-blue-600 text-white pt-2",
  "podcast-2": "bg-violet-800 text-white pt-2",
  "podcast-3": "bg-green-400 text-white pt-2",
  "podcast-4": "bg-green-800 text-white pt-2",
  "podcast-5": "bg-green-600 text-white pt-2",
};

const events = computed(() => {
  return props.episodeList.flatMap((podcast, index) => {
    const colorClass = colorClasses[`podcast-${index + 1}`];
    return podcast.episodes.map((episode) => ({
      start: episode.release_date,
      end: episode.release_date,
      title: `<div class="${colorClass}">${podcast.podcastName}: <br /> ${episode.name}</div>`,

      episode: {
        podcastName: podcast.podcastName,
        ...episode,
      },
    }));
  });
});

const selectedEvent = ref(null);

function openModal(event) {
  selectedEvent.value = event.episode;
}

function closeModal() {
  selectedEvent.value = null;
}
</script>

<style scoped>
.podcast-1 {
  @apply bg-blue-600;
}
.podcast-2 {
  @apply bg-green-500;
}
.podcast-3 {
  @apply bg-red-red;
}
redcast-4 {
  @apply bg-pink-500;
}
.podcast-5 {
  @apply bg-purple-600;
}
</style>
