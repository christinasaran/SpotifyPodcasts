<template>
  <div
    v-if="isModalOpen"
    class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
    role="dialog"
    aria-modal="true"
    aria-labelledby="modal-title"
    @keydown.esc="closeModal"
  >
    <div
      class="bg-white p-6 rounded-lg shadow-lg w-96"
      tabindex="0"
      ref="modal"
    >
      <div class="flex justify-between items-center mb-4">
        <h2 id="modal-title" class="text-xl font-semibold">
          {{ episode.podcastName }}
        </h2>
        <button
          @click="closeModal"
          @keydown.enter="closeModal"
          @keydown.space="closeModal"
          class="text-gray-500 hover:text-gray-800"
          aria-label="Close modal"
        >
          &times;
        </button>
      </div>
      <img
        v-if="episode.images && episode.images.length > 0"
        :src="episode.images[0].url"
        alt="Episode Image"
        class="w-full h-48 object-cover rounded-lg mb-4"
      />
      <p class="mb-4">{{ episode.name }}</p>
      <p class="mb-4 text-sm text-gray-700 text-ellipsis line-clamp-3">
        {{ episode.description }}
      </p>
      <p class="text-sm text-gray-600 mb-2">
        Release Date: {{ formattedReleaseDate }}
      </p>
      <a
        v-if="episode.external_urls?.spotify"
        :href="episode.external_urls?.spotify"
        target="_blank"
        class="text-green-500 cursor-pointer hover:underline"
        @keydown.enter="openLink"
        @keydown.space="openLink"
        >Listen on Spotify</a
      >
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  ref,
  computed,
  defineProps,
  defineEmits,
  onMounted,
  onUnmounted,
} from "vue";

const props = defineProps<{
  episode: {
    podcastName: string;
    name: string;
    description: string;
    release_date: string;
    external_urls?: { spotify: string };
    images?: Array<{ url: string }>;
  };
}>();

const emit = defineEmits(["close"]);

const isModalOpen = ref(true);
const modal = ref(null);

const closeModal = () => {
  isModalOpen.value = false;
  emit("close");
};

const formattedReleaseDate = computed(() => {
  return new Date(props.episode.release_date).toLocaleDateString();
});

const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === "Escape") {
    closeModal();
  }
};

const openLink = (event: KeyboardEvent) => {
  if (event.target instanceof HTMLAnchorElement) {
    window.open(event.target.href, "_blank");
  }
};

onMounted(() => {
  document.addEventListener("keydown", handleKeydown);
  if (modal.value) {
    modal.value.focus();
  }
});

onUnmounted(() => {
  document.removeEventListener("keydown", handleKeydown);
});
</script>

<style scoped>
/* Optional TailwindCSS customization */
</style>
