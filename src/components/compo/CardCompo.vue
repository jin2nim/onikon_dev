<template>
    <div class="box">
        <h3 class="box-title">{{ title }}</h3>
        <h1 :class="['box-number', { 'cancel': isRed }]">{{ number }}</h1>
    </div>    
</template>

<script setup>
import { defineProps } from 'vue';

defineProps({
    title: String, 
    number: Number, 
    isRed: Boolean
});
</script>

<style>
.cancel {
    color: red;
}
</style>
