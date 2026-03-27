<script setup lang="ts">
import { RouterView } from 'vue-router'
import MainLayout from '@/layouts/MainLayout.vue'
import ModalContainer from '@/components/common/ModalContainer.vue'
</script>

<template>
  <MainLayout>
    <RouterView />
  </MainLayout>
  <ModalContainer />
</template>

<style>
@import './assets/main.css';
</style>
