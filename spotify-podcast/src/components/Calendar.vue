<template>
  <div
    class="w-full h-screen p-4 bg-slate-200 font-semibold text-black overflow-hidden"
  >
    <vue-cal
      :events="events"
      :time="false"
      events-on-month-view="short"
      @event-click="openModal"
      :disable-views="['years', 'year']"
      active-view="month"
      :views="['day', 'month', 'week']"
      class="w-full h-full shadow rounded-lg overflow-hidden"
      aria-live="polite"
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
import type { EpisodeList, SelectedEvent } from "../types/podcast";

const props = defineProps<{
  episodeList: EpisodeList[];
}>();

const colorClasses: { [key: string]: string } = {
  "podcast-1": "bg-blue-600 text-white pt-2",
  "podcast-2": "bg-violet-600 text-white pt-2",
  "podcast-3": "bg-teal-600 text-white pt-2",
  "podcast-4": "bg-pink-600 text-white pt-2",
  "podcast-5": "bg-gray-600 text-white pt-2",
};

const events = computed(() => {
  return props.episodeList.flatMap((podcast, index) => {
    const colorClass = colorClasses[`podcast-${index + 1}`];
    return podcast.episodes.map((episode) => ({
      start: episode.release_date,
      end: episode.release_date,
      title: `<div class=" px-2 pb-2 overflow-hidden truncate ${colorClass}">${podcast.podcastName}: <br /> ${episode.name}</div>`,

      episode: {
        podcastName: podcast.podcastName,
        ...episode,
      },
    }));
  });
});

const selectedEvent = ref<null | SelectedEvent>(null);

function openModal(event: { episode?: SelectedEvent }) {
  if (event.episode) {
    selectedEvent.value = event.episode;
  } else {
    selectedEvent.value = null;
  }
}

function closeModal() {
  selectedEvent.value = null;
}
</script>

<style>
.vuecal--month-view .vuecal__cell-content {
  justify-content: flex-start;
  height: 100%;
  align-items: flex-end;
}

.vuecal--month-view .vuecal__cell-date {
  padding: 4px;
}
.vuecal--month-view .vuecal__no-event {
  display: none;
}
.vuecal--short-events .vuecal__event-title {
  text-align: left;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  padding: 0;
}
</style>
