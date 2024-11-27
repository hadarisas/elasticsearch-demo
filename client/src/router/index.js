import { createRouter, createWebHistory } from "vue-router";
import HomePage from "../views/HomePage.vue";
import SearchPage from "../views/SearchPage.vue";
import ProductDetails from "../components/ProductDetails.vue";
import AddProduct from "../components/AddProduct.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomePage,
    },
    {
      path: "/search",
      name: "search",
      component: SearchPage,
    },
    {
      path: "/product/:id",
      name: "product-details",
      component: ProductDetails,
    },
    {
      path: "/add-product",
      name: "add-product",
      component: AddProduct,
    },
  ],
});

export default router;
