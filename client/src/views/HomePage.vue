<template>
  <div
    class="min-h-screen w-full bg-gradient-to-br from-gray-200 to-gray-300 text-slate-900 font-mono overflow-y-hidden"
  >
    <div class="h-screen flex items-center justify-center">
      <div class="max-w-6xl mx-auto p-8 space-y-12 text-center">
        <!-- Title -->
        <h2 class="text-5xl font-bold font-mono animate-fade-in">
          Elasticsearch in Action
        </h2>

        <!-- Authors and Repository -->
        <div class="space-y-8 mb-16">
          <div class="flex flex-col items-center space-y-4">
            <h3 class="text-xl font-semibold text-blue-400">Authors</h3>
            <div class="flex justify-between w-full max-w-md">
              <span class="text-slate-800 font-mono font-semibold"
                >EL HADRI HASSAN</span
              >
              <span class="text-slate-800 font-mono font-semibold"
                >ID-ADMED KAMAL</span
              >
            </div>
          </div>

          <div class="flex flex-col items-center space-y-2">
            <h3 class="text-xl font-semibold text-blue-400">Repository</h3>
            <a
              href="https://github.com/hadarisas/elasticsearch_demo"
              target="_blank"
              rel="noopener noreferrer"
              class="text-blue-500 hover:text-blue-400 transition-colors"
            >
              GitHub Repository →
            </a>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <router-link
            to="/add-product"
            class="group bg-gray-800/50 backdrop-blur p-8 rounded-xl hover:bg-gray-700/50 transition-all duration-300"
          >
            <h3 class="text-2xl font-semibold text-white mb-4">Add Product</h3>
            <p class="text-gray-300 mb-6">
              Add new products to the Elasticsearch index
            </p>
            <span
              class="inline-flex items-center text-blue-400 group-hover:text-blue-300"
            >
              Get Started
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5 ml-2"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fill-rule="evenodd"
                  d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                  clip-rule="evenodd"
                />
              </svg>
            </span>
          </router-link>

          <router-link
            to="/search"
            class="group bg-gray-800/50 backdrop-blur p-8 rounded-xl hover:bg-gray-700/50 transition-all duration-300"
          >
            <h3 class="text-2xl font-semibold text-white mb-4">
              Search Products
            </h3>
            <p class="text-gray-300 mb-6">
              Search and filter products in real-time
            </p>
            <span
              class="inline-flex items-center text-green-400 group-hover:text-green-300"
            >
              Try Demo
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5 ml-2"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fill-rule="evenodd"
                  d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                  clip-rule="evenodd"
                />
              </svg>
            </span>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup></script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 1s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
