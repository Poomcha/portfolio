<script setup lang="ts">
import Layout from "./Layout.vue"
import QuestionAnswer from "./components/QuestionAnswer.vue";

import { Store } from "./store";

const store = new Store();

store.initStore()
</script>

<template>
  <Layout>
    <QuestionAnswer :store="store" />
  </Layout>
</template>

<style lang="css"></style>
