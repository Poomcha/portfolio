<script setup lang="ts">
import Layout from "./Layout.vue"
import QuestionAnswer from "./components/QuestionAnswer.vue";
import Examples from "./components/Examples.vue";

import { Store } from "./store";

const store = new Store();

store.initStore()
</script>

<template>
  <Layout>
    <!-- <Examples :store=store /> -->
    <QuestionAnswer :store="store" />
  </Layout>
</template>

<style lang="css"></style>
