<template>
    <header class="navbar">
      <h1>{{ today }}'s Dashboard</h1>
    </header>
  </template>
  
<script setup>
  import dayjs from 'dayjs';
  const today = dayjs().format('MM/DD')
</script>
  <style scoped>
  .navbar {
    height: 100px;
    background: #34495e;
    color: white;
    display: flex;
    align-items: center;
    padding: 0 20px;
    font-size: 1.25rem;
  }

  @media (max-width: 768px) {
    header {
      height: 60px !important;
      padding-left: 50px !important;
    }
    .navbar {
      font-size: 1rem;
      white-space: nowrap;
    }
  }
  </style>