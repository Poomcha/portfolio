<script setup lang="ts">
import { computed } from "vue";

import Layout from "./Layout.vue"
import QuestionAnswer from "./components/QuestionAnswer.vue";

import { Store } from "./store";

const store = computed(() => new Store());
</script>

<template>
  <Layout>
    <!-- !!!
     Create a QuestionAnswer component: display pairs of Question / Answer
     Create a Answer component: display AI answers
     Create a Question component: display User questions 
     -->
    <QuestionAnswer :store="store" />
  </Layout>
</template>

<style lang="css"></style>
