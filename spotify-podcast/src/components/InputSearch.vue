<template>
  <div class="flex justify-center my-6">
    <div class="relative w-full max-w-md">
      <label for="search" class="sr-only">Search</label>
      <input
        id="search"
        v-model="query"
        type="text"
        placeholder="Search podcasts..."
        class="w-full px-4 py-3 border border-gray-600 rounded-lg bg-black text-white placeholder-gray-400 focus:outline-none focus:ring focus:ring-green-400"
        @keyup.enter="handleKeyUpEnter"
        aria-label="Search podcasts"
      />
      <div class="absolute inset-y-0 right-3 flex items-center">
        <svg
          class="w-5 h-5 text-gray-400"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M21 21l-4.35-4.35M16 10a6 6 0 1 1-12 0 6 6 0 0 1 12 0z"
          />
        </svg>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
const emit = defineEmits(["search"]); // Define event
const query = ref("");

const handleKeyUpEnter = () => {
  emit("search", query.value); // Emit search event with input value
};
</script>
