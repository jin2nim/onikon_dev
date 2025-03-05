<template>
  <header class="header">
    <button class="menu-button" @click="toggleMenu">☰</button>
  </header>

  <aside class="sidebar" :class="{ open: isOpen }">
    <h1 id="logo">Onikon</h1>
    <nav>
      <ul>
        <li><router-link to="/">Dashboard</router-link></li>
        <li><router-link to="/chart">Chart</router-link></li>
      </ul>
    </nav>
    <button class="close-button" @click="toggleMenu">✖</button>
  </aside>

  <div v-if="isOpen" class="overlay" @click="closeMenu"></div>
</template>

<script setup>
import { ref } from 'vue';

const isOpen = ref(false);

const toggleMenu = () => {
  isOpen.value = !isOpen.value;
};

const closeMenu = () => {
  isOpen.value = false;
};


</script>

<style scoped>
.sidebar {
  width: 250px;
  height: 100vh;
  background: #2c3e50;
  color: white;
  padding: 20px;
  text-align: center;
  z-index: 1000;
}

.header,
.close-button {
  display: none;
}

#logo {
  padding: 15px;
}

nav {
    margin-top: 80px;
    height: 100%;
    display: flex;
    flex-direction: column;
    /* justify-content: center; */
}
nav ul {
  display: flex;
  flex-direction: column;
  gap: 20px;
}
nav li a {
  color: white;
  font-size: 1.125rem;
}

nav li a:hover {
  color: orange;
  font-weight: 700;
}

/* Mobile */
@media (max-width: 768px) {
  .sidebar {
    transform: translateX(-100%);
    position: fixed;
    left: 0;
    top: 0;
    transition: transform 0.3s ease-in-out;
  }
  .sidebar.open {
    transform: translateX(0);
  }

  .header {
    display: block;
    background: #34495e;
    padding: 10px;
    text-align: left;
    height: 60px;
    z-index: 1000 !important;
  }

  .menu-button,
  .close-button {
    background: none;
    border: none;
    font-size: 24px;
    color: white;
    cursor: pointer;
  }

  .close-button {
    display: block;
    position: absolute;
    right: 30px;
    top: 30px;
  }
  .menu-button {
    margin-top: 3px;
  }
}

.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5); 
  z-index: 999; 
}
</style>
