<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();
const product = ref(null);
const loading = ref(true);
const error = ref(null);
const selectedImage = ref(0);
const quantity = ref(1);

const fetchProductDetails = async () => {
  try {
    loading.value = true;
    const response = await fetch(
      `http://localhost:3001/api/products/${route.params.id}`
    );
    if (!response.ok) throw new Error("Product not found");
    product.value = await response.json();
  } catch (err) {
    error.value = err.message;
  } finally {
    loading.value = false;
  }
};

const goBack = () => {
  router.back();
};

const addToCart = () => {
  // Implement cart functionality
  alert(`Added ${quantity.value} item(s) to cart`);
};

const updateQuantity = (delta) => {
  const newValue = quantity.value + delta;
  if (newValue >= 1 && newValue <= (product.value?.stock || 1)) {
    quantity.value = newValue;
  }
};

onMounted(fetchProductDetails);
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Breadcrumb -->
    <nav
      class="max-w-7xl mx-auto px-4 py-4 flex items-center space-x-2 text-sm text-gray-600"
    >
      <button @click="goBack" class="hover:text-gray-900">Home</button>
      <span>/</span>
      <span>{{ product?.category }}</span>
      <span>/</span>
      <span class="text-gray-900">{{ product?.name }}</span>
    </nav>

    <div v-if="loading" class="flex justify-center py-20">
      <div
        class="animate-spin w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full"
      ></div>
    </div>

    <div v-else-if="error" class="text-red-500 text-center py-20">
      {{ error }}
    </div>

    <main v-else-if="product" class="max-w-7xl mx-auto px-4 py-8">
      <div class="lg:grid lg:grid-cols-2 lg:gap-x-8">
        <!-- Image gallery -->
        <div class="flex flex-col">
          <div
            class="aspect-w-4 aspect-h-3 rounded-lg bg-gray-100 overflow-hidden"
          >
            <img
              :src="
                product.images?.[selectedImage]?.url ||
                'https://via.placeholder.com/600'
              "
              :alt="product.images?.[selectedImage]?.alt || product.name"
              class="object-cover object-center w-full h-full"
            />
          </div>
          <!-- Thumbnail gallery -->
          <div class="mt-4 grid grid-cols-4 gap-4">
            <button
              v-for="(image, index) in product.images"
              :key="index"
              @click="selectedImage = index"
              class="relative rounded-lg bg-gray-100 overflow-hidden"
              :class="{ 'ring-2 ring-blue-500': selectedImage === index }"
            >
              <img
                :src="image.url"
                :alt="image.alt"
                class="object-cover object-center w-full h-24"
              />
            </button>
          </div>
        </div>

        <!-- Product info -->
        <div class="mt-10 lg:mt-0 lg:pl-8">
          <div class="flex justify-between items-center">
            <h1 class="text-3xl font-bold text-gray-900">{{ product.name }}</h1>
            <p class="text-3xl font-bold text-blue-600">${{ product.price }}</p>
          </div>

          <!-- Brand -->
          <div class="mt-3">
            <p class="text-lg text-gray-600">
              By
              <span class="font-medium text-gray-900">{{ product.brand }}</span>
            </p>
          </div>

          <!-- Rating -->
          <div class="mt-4 flex items-center">
            <div class="flex items-center">
              <template v-for="n in 5" :key="n">
                <svg
                  :class="[
                    'w-5 h-5',
                    n <= Math.round(product.rating)
                      ? 'text-yellow-400'
                      : 'text-gray-300',
                  ]"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                  />
                </svg>
              </template>
            </div>
            <p class="ml-2 text-sm text-gray-600">
              {{ product.rating }} ({{ product.reviews_count }} reviews)
            </p>
          </div>

          <!-- Stock status -->
          <div class="mt-4">
            <p
              :class="[
                'text-sm font-medium',
                product.stock > 0 ? 'text-green-600' : 'text-red-600',
              ]"
            >
              {{
                product.stock > 0 ? `${product.stock} in stock` : "Out of stock"
              }}
            </p>
          </div>

          <!-- Add to cart section -->
          <div class="mt-8 border-t border-gray-200 pt-8">
            <div class="flex items-center space-x-4">
              <div class="flex items-center border border-gray-300 rounded-md">
                <button
                  @click="updateQuantity(-1)"
                  class="p-2 hover:bg-gray-100"
                  :disabled="quantity <= 1"
                >
                  <svg
                    class="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M20 12H4"
                    />
                  </svg>
                </button>
                <span class="px-4 py-2 border-x border-gray-300">{{
                  quantity
                }}</span>
                <button
                  @click="updateQuantity(1)"
                  class="p-2 hover:bg-gray-100"
                  :disabled="quantity >= product.stock"
                >
                  <svg
                    class="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                </button>
              </div>
              <button
                @click="addToCart"
                class="flex-1 bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                :disabled="product.stock <= 0"
              >
                Add to Cart
              </button>
            </div>

            <!-- Shipping info -->
            <div class="mt-6 space-y-2 text-sm text-gray-600">
              <div
                v-if="product.shipping_info?.free_shipping"
                class="flex items-center"
              >
                <svg
                  class="w-5 h-5 mr-2 text-green-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span>Free Shipping</span>
              </div>
              <div class="flex items-center">
                <svg
                  class="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>Delivery estimate: 2-4 business days</span>
              </div>
            </div>
          </div>

          <!-- Description -->
          <div class="mt-8 border-t border-gray-200 pt-8">
            <h2 class="text-xl font-bold text-gray-900">About this item</h2>
            <p class="mt-4 text-gray-600 leading-relaxed">
              {{ product.description }}
            </p>
          </div>

          <!-- Features -->
          <div class="mt-8">
            <h2 class="text-xl font-bold text-gray-900">Key Features</h2>
            <ul class="mt-4 space-y-2">
              <li
                v-for="feature in product.features"
                :key="feature"
                class="flex items-start"
              >
                <svg
                  class="w-5 h-5 mr-2 text-green-500 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span class="text-gray-600">{{ feature }}</span>
              </li>
            </ul>
          </div>

          <!-- Specifications -->
          <div class="mt-8 border-t border-gray-200 pt-8">
            <h2 class="text-xl font-bold text-gray-900">
              Technical Specifications
            </h2>
            <dl class="mt-4 grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">
              <template v-for="spec in product.specifications" :key="spec.name">
                <div class="border-b border-gray-200 pb-4">
                  <dt class="text-sm font-medium text-gray-500">
                    {{ spec.name }}
                  </dt>
                  <dd class="mt-1 text-sm text-gray-900">{{ spec.value }}</dd>
                </div>
              </template>
            </dl>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>
