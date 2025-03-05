<template>
  <div class="layout">
    <Sidebar id="Sidebar"/>
    <div class="content">
      <NavBar id="NavBar" />
      <router-view class="main"/>
    </div>
  </div>
</template>

<script setup>
import NavBar from './components/NavBar.vue';
import Sidebar from './components/SideBar.vue';
</script>

<style scoped>
.layout {
  display: flex;
  height: 100vh; 
  overflow: hidden;
}

.content {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

#NavBar {
  position: fixed;
  width: 100%;
  z-index: 1000;
}

.main {
  margin-top: 100px;
  padding: 0 50px 20px;
  flex-grow: 1; 
  overflow-y: auto; 
  height: calc(100vh - 60px); 
  scrollbar-width: none;
}

@media (max-width: 768px) {
  #Sidebar {
    position: fixed;
    z-index: 1000 !important;
  }
  .content {
    position: fixed;
    z-index: 998;
  }
    .main {
      margin-top: 60px;
    }
  }
</style>
