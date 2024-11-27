<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const loading = ref(false);
const error = ref(null);
const success = ref(false);

const product = ref({
  name: "",
  description: "",
  price: "",
  brand: "",
  category: "",
  specifications: [{ name: "", value: "" }],
  images: [{ url: "", alt: "" }],
  stock: 0,
  features: [""],
  shipping_info: {
    weight: "",
    dimensions: "",
    free_shipping: false,
  },
});

const categories = [
  "Smartphones",
  "Laptops",
  "Tablets",
  "Headphones",
  "Cameras",
  "Gaming",
  "Accessories",
  "Wearables",
];

const addSpecification = () => {
  product.value.specifications.push({ name: "", value: "" });
};

const removeSpecification = (index) => {
  product.value.specifications.splice(index, 1);
};

const addImage = () => {
  product.value.images.push({ url: "", alt: "" });
};

const removeImage = (index) => {
  product.value.images.splice(index, 1);
};

const addFeature = () => {
  product.value.features.push("");
};

const removeFeature = (index) => {
  product.value.features.splice(index, 1);
};

const submitProduct = async () => {
  try {
    loading.value = true;
    error.value = null;

    // Convert price and stock to numbers
    const formattedProduct = {
      ...product.value,
      price: parseFloat(product.value.price),
      stock: parseInt(product.value.stock),
      shipping_info: {
        ...product.value.shipping_info,
        weight: parseFloat(product.value.shipping_info.weight),
      },
    };

    const response = await fetch("http://localhost:3001/api/products", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formattedProduct),
    });

    if (!response.ok) {
      throw new Error("Failed to add product");
    }

    const result = await response.json();
    success.value = true;

    // Redirect to product details after 2 seconds
    setTimeout(() => {
      router.push(`/product/${result.id}`);
    }, 2000);
  } catch (err) {
    error.value = err.message;
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900">Add New Product</h1>
        <p class="mt-2 text-sm text-gray-600">
          Fill in the details below to add a new product to the catalog.
        </p>
      </div>

      <!-- Success Message -->
      <div
        v-if="success"
        class="mb-6 p-4 bg-green-50 border border-green-200 rounded-md"
      >
        <div class="flex">
          <div class="flex-shrink-0">
            <svg
              class="h-5 w-5 text-green-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <div class="ml-3">
            <p class="text-sm font-medium text-green-800">
              Product added successfully! Redirecting...
            </p>
          </div>
        </div>
      </div>

      <!-- Error Message -->
      <div
        v-if="error"
        class="mb-6 p-4 bg-red-50 border border-red-200 rounded-md"
      >
        <div class="flex">
          <div class="flex-shrink-0">
            <svg
              class="h-5 w-5 text-red-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>
          <div class="ml-3">
            <p class="text-sm font-medium text-red-800">{{ error }}</p>
          </div>
        </div>
      </div>

      <!-- Form -->
      <form @submit.prevent="submitProduct" class="space-y-8">
        <!-- Basic Information -->
        <div class="bg-white shadow rounded-lg p-6">
          <h2 class="text-lg font-medium text-gray-900 mb-4">
            Basic Information
          </h2>
          <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label class="block text-sm font-medium text-gray-700"
                >Product Name</label
              >
              <input
                type="text"
                v-model="product.name"
                required
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700"
                >Brand</label
              >
              <input
                type="text"
                v-model="product.brand"
                required
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700"
                >Category</label
              >
              <select
                v-model="product.category"
                required
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="">Select a category</option>
                <option
                  v-for="category in categories"
                  :key="category"
                  :value="category"
                >
                  {{ category }}
                </option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700"
                >Price ($)</label
              >
              <input
                type="number"
                v-model="product.price"
                required
                min="0"
                step="0.01"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div class="sm:col-span-2">
              <label class="block text-sm font-medium text-gray-700"
                >Description</label
              >
              <textarea
                v-model="product.description"
                rows="4"
                required
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              ></textarea>
            </div>
          </div>
        </div>

        <!-- Images -->
        <div class="bg-white shadow rounded-lg p-6">
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-lg font-medium text-gray-900">Product Images</h2>
            <button
              type="button"
              @click="addImage"
              class="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200"
            >
              Add Image
            </button>
          </div>

          <div class="space-y-4">
            <div
              v-for="(image, index) in product.images"
              :key="index"
              class="grid grid-cols-1 gap-4 sm:grid-cols-2"
            >
              <div>
                <label class="block text-sm font-medium text-gray-700"
                  >Image URL</label
                >
                <input
                  type="url"
                  v-model="image.url"
                  required
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div class="relative">
                <label class="block text-sm font-medium text-gray-700"
                  >Alt Text</label
                >
                <div class="flex">
                  <input
                    type="text"
                    v-model="image.alt"
                    required
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    @click="removeImage(index)"
                    class="ml-2 mt-1 inline-flex items-center p-1 border border-transparent rounded-full text-red-600 hover:bg-red-100"
                  >
                    <svg
                      class="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Specifications -->
        <div class="bg-white shadow rounded-lg p-6">
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-lg font-medium text-gray-900">Specifications</h2>
            <button
              type="button"
              @click="addSpecification"
              class="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200"
            >
              Add Specification
            </button>
          </div>

          <div class="space-y-4">
            <div
              v-for="(spec, index) in product.specifications"
              :key="index"
              class="grid grid-cols-1 gap-4 sm:grid-cols-2"
            >
              <div>
                <label class="block text-sm font-medium text-gray-700"
                  >Name</label
                >
                <input
                  type="text"
                  v-model="spec.name"
                  required
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div class="relative">
                <label class="block text-sm font-medium text-gray-700"
                  >Value</label
                >
                <div class="flex">
                  <input
                    type="text"
                    v-model="spec.value"
                    required
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    @click="removeSpecification(index)"
                    class="ml-2 mt-1 inline-flex items-center p-1 border border-transparent rounded-full text-red-600 hover:bg-red-100"
                  >
                    <svg
                      class="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Features -->
        <div class="bg-white shadow rounded-lg p-6">
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-lg font-medium text-gray-900">Features</h2>
            <button
              type="button"
              @click="addFeature"
              class="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200"
            >
              Add Feature
            </button>
          </div>

          <div class="space-y-4">
            <div
              v-for="(feature, index) in product.features"
              :key="index"
              class="flex items-center"
            >
              <input
                type="text"
                v-model="product.features[index]"
                required
                class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
              <button
                type="button"
                @click="removeFeature(index)"
                class="ml-2 inline-flex items-center p-1 border border-transparent rounded-full text-red-600 hover:bg-red-100"
              >
                <svg
                  class="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <!-- Shipping Information -->
        <div class="bg-white shadow rounded-lg p-6">
          <h2 class="text-lg font-medium text-gray-900 mb-4">
            Shipping Information
          </h2>
          <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label class="block text-sm font-medium text-gray-700"
                >Weight (kg)</label
              >
              <input
                type="number"
                v-model="product.shipping_info.weight"
                required
                min="0"
                step="0.001"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700"
                >Dimensions</label
              >
              <input
                type="text"
                v-model="product.shipping_info.dimensions"
                placeholder="e.g., 10 x 20 x 30 cm"
                required
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div class="sm:col-span-2">
              <label class="flex items-center">
                <input
                  type="checkbox"
                  v-model="product.shipping_info.free_shipping"
                  class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span class="ml-2 text-sm text-gray-600">Free Shipping</span>
              </label>
            </div>
          </div>
        </div>

        <!-- Stock Information -->
        <div class="bg-white shadow rounded-lg p-6">
          <h2 class="text-lg font-medium text-gray-900 mb-4">
            Stock Information
          </h2>
          <div>
            <label class="block text-sm font-medium text-gray-700"
              >Stock Quantity</label
            >
            <input
              type="number"
              v-model="product.stock"
              required
              min="0"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        </div>

        <!-- Submit Button -->
        <div class="flex justify-end">
          <button
            type="submit"
            :disabled="loading"
            class="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            <svg
              v-if="loading"
              class="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                class="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                stroke-width="4"
              />
              <path
                class="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            {{ loading ? "Adding Product..." : "Add Product" }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
