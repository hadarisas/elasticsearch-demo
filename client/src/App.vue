<script setup>
import { ref, watch, computed, onBeforeUnmount } from "vue";

/*
 * debounce is a js utility library that simplifies common programming tasks and gives us more capabilities when executing them.
 * in our case we use it to limit the number of requests to the server
 * (to improve performance, avoid too many requests to the server when the user is typing fast)
 */

import debounce from "lodash/debounce";

//searchQuery is a ref (a reactivity text variable) that holds the search query entered by the user
const searchQuery = ref("");

//searchResults is a ref (a reactivity variable) that holds the search results
const searchResults = ref({
  exact: true,
  hits: [],
  suggestion: null,
  total: 0,
});

//suggestions is a ref (a reactivity array variable) that holds the suggestions for the search query
const suggestions = ref([]);

//loading is a ref (a reactivity boolean variable) that holds the loading state of the search results
const loading = ref(false);

//currentPage is a ref (a reactivity variable) that holds the current page number
const currentPage = ref(1);

//itemsPerPage is a ref (a reactivity variable) that holds the number of items per page
const itemsPerPage = 5;

//searchTime is a ref (a reactivity variable) that holds the search time
const searchTime = ref(0);

//fetchSuggestions is a debounced function that fetches suggestions for the search query
const fetchSuggestions = debounce(async (query) => {
  //if the query is empty, clear the suggestions
  if (!query.trim()) {
    suggestions.value = [];
    return;
  }
  //try to fetch the suggestions from the server

  try {
    const response = await fetch(
      `http://localhost:3001/api/search?q=${encodeURIComponent(query)}`
    );
    const data = await response.json();
    //convert the data to an array to be able to use the  javascript map function
    const dataArray = Array.from(data);
    suggestions.value = dataArray.map((item) => item._source.name);
  } catch (error) {
    console.error("Suggestion fetch error:", error);
  }
}, 300);

//performSearch is a debounced function that fetches the search results for the search query
/*
 * the debounce function takes 3 arguments:
 * the function to debounce,
 * the delay (in milliseconds),
 * and the options (in our case we don't need any options)
 */
const performSearch = debounce(async (query, page = 1) => {
  //if the query is empty, clear the search results
  if (!query.trim()) {
    searchResults.value = {
      exact: true,
      hits: [],
      suggestion: null,
      total: 0,
      page: 1,
      totalPages: 0,
    };
    return;
  }

  //set the loading state to true to indicate that the search results are being fetched
  loading.value = true;

  //start the timer to measure the search time
  const startTime = performance.now();
  try {
    const response = await fetch(
      `http://localhost:3001/api/search?q=${encodeURIComponent(
        query
      )}&page=${page}&limit=${itemsPerPage}`
    );
    /*
      `http://localhost:3001/api/search?q=${encodeURIComponent(
        query
      )}&page=${page}&limit=${itemsPerPage}` */

    //if the response is not ok, throw an error
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log("Search results:", JSON.stringify(data));

    //update the search results
    searchResults.value = data;

    //update the current page number
    currentPage.value = data.page;

    //stop the timer and calculate the search time
    const endTime = performance.now();

    //calculate the search time and round it to 2 decimal places
    searchTime.value = ((endTime - startTime) / 1000).toFixed(2);
  } catch (error) {
    console.error("Search error:", error);
    searchResults.value = {
      exact: true,
      hits: [],
      suggestion: null,
      total: 0,
      page: 1,
      totalPages: 0,
    };
  } finally {
    loading.value = false;
  }
}, 300);

//handleSuggestionClick is a function that handles the click event on a suggestion
const handleSuggestionClick = async (suggestion) => {
  //update the search query with the suggestion
  searchQuery.value = suggestion;
  suggestions.value = [];
  await performSearch(suggestion, 1);
};

//handlePageChange is a function that handles the click event on a page number
const handlePageChange = (page) => {
  performSearch(searchQuery.value, page);
};

onBeforeUnmount(() => {
  // Cancel any pending debounced operations
  fetchSuggestions.cancel();
  performSearch.cancel();
});

const totalPages = computed(() => searchResults.value.totalPages || 0);

const displayedPages = computed(() => {
  const total = totalPages.value;
  const current = currentPage.value;
  const pages = [];

  if (total <= 7) {
    for (let i = 1; i <= total; i++) {
      pages.push(i);
    }
  } else {
    pages.push(1);
    if (current > 3) {
      pages.push("...");
    }
    for (
      let i = Math.max(2, current - 1);
      i <= Math.min(current + 1, total - 1);
      i++
    ) {
      pages.push(i);
    }
    if (current < total - 2) {
      pages.push("...");
    }
    pages.push(total);
  }

  return pages;
});

//watch is a reactivity function that watches for changes in the searchQuery variable (when the user starts typing)
watch(searchQuery, (newQuery) => {
  //fetch the suggestions for the new query
  fetchSuggestions(newQuery);
  //perform the search for the new query
  performSearch(newQuery, 1);
});
</script>

<template>
  <div class="min-h-screen bg-white">
    <div
      class="max-w-2xl mx-auto px-4"
      :class="
        searchResults.hits.length
          ? 'pt-6'
          : 'h-screen flex flex-col items-center justify-center'
      "
    >
      <div :class="searchResults.hits.length ? '' : '-mt-32'">
        <h1 class="text-center mb-8">
          <span class="text-4xl font-extrabold">
            <span class="text-blue-500">G</span>
            <span class="text-red-500">o</span>
            <span class="text-yellow-500">o</span>
            <span class="text-blue-500">g</span>
            <span class="text-green-500">l</span>
            <span class="text-red-500">e</span>
          </span>
        </h1>

        <div class="mb-6 relative">
          <div class="relative">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search products..."
              class="w-full px-12 py-3 rounded-full border border-gray-200 hover:shadow-md focus:shadow-md transition-shadow duration-200 outline-none"
            />
            <svg
              class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>

          <ul
            v-if="suggestions.length > 0"
            class="absolute bg-white w-full mt-1 rounded-lg shadow-lg border border-gray-200 overflow-hidden z-10"
          >
            <li
              v-for="suggestion in suggestions"
              :key="suggestion"
              @click="handleSuggestionClick(suggestion)"
              class="px-4 py-3 hover:bg-gray-100 cursor-pointer flex items-center"
            >
              <svg
                class="w-4 h-4 mr-3 text-gray-400"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              {{ suggestion }}
            </li>
          </ul>
        </div>
      </div>

      <div v-if="loading" class="text-center py-8 text-gray-600">
        <div
          class="animate-spin w-6 h-6 border-2 border-gray-300 border-t-blue-500 rounded-full mx-auto"
        ></div>
      </div>

      <div v-else-if="searchResults.hits.length > 0" class="space-y-6 pb-8">
        <div v-if="!searchResults.exact" class="text-sm text-gray-600 mb-4">
          Showing results for: <strong>{{ searchResults.suggestion }}</strong>
        </div>
        <p class="text-sm text-gray-600 mb-4">
          About {{ searchResults.hits.length }} results ({{ searchTime }}
          seconds)
        </p>
        <div
          v-for="result in searchResults.hits"
          :key="result._id"
          class="mb-6"
        >
          <h2
            class="text-lg text-[#1a0dab] hover:underline cursor-pointer mb-1"
          >
            {{ result._source.name }}
          </h2>
          <p class="text-sm text-[#006621] mb-1">
            www.example.com/product/{{ result._id }}
          </p>
          <p class="text-sm text-gray-600 mb-1">
            {{ result._source.description }}
          </p>
          <p class="text-green-700 font-medium">${{ result._source.price }}</p>
        </div>

        <div v-if="totalPages > 1" class="flex justify-center mt-8">
          <div class="inline-flex items-center justify-center">
            <button
              v-if="currentPage > 1"
              @click="handlePageChange(currentPage - 1)"
              class="text-[#1a0dab] hover:underline mr-4"
            >
              Previous
            </button>
            <div class="flex space-x-2">
              <template v-for="page in displayedPages" :key="page">
                <button
                  v-if="page !== '...'"
                  @click="handlePageChange(page)"
                  :class="[
                    'px-3 py-1 rounded',
                    currentPage === page
                      ? 'text-black font-bold'
                      : 'text-[#1a0dab] hover:underline',
                  ]"
                >
                  {{ page }}
                </button>
                <span v-else class="px-3 py-1">{{ page }}</span>
              </template>
            </div>
            <button
              v-if="currentPage < totalPages"
              @click="handlePageChange(currentPage + 1)"
              class="text-[#1a0dab] hover:underline ml-4"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      <div
        v-else-if="searchQuery && !loading"
        class="text-center py-8 text-gray-600"
      >
        No results found
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Remove existing styles */
</style>
