import { createRouter, createWebHistory } from 'vue-router';
import HomePage from '@/components/pages/HomePage.vue';
import MainDashboard from '@/components/pages/MainDashboard.vue';

const routes = [
  { path: '/', component: HomePage },
  { path: '/chart', component: MainDashboard}
];

const router = createRouter({
  history: createWebHistory('/onikon/'),
  routes
});

export default router;