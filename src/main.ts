import { createApp } from "vue";
import { createPinia } from "pinia";
import router from "./router";
import App from "./App.vue";
import "./index.css";

const app = createApp(App);
app.use(createPinia());
app.use(router);
app.mount("#app");

// Register Service Worker for PWA (production only)
if ("serviceWorker" in navigator && import.meta.env.PROD) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/sw.js")
      .catch((err) => console.warn("[SW] Failed:", err));
  });
}
