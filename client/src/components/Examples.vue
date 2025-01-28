<script setup lang="ts">
import { computed } from 'vue';

import { Store } from '../store';
import Example from './Example.vue';

const props = defineProps<{ store: Store }>()

const examples = computed(() => props.store.getExamples())
</script>

<template>
    <ul class="flex flex-wrap gap-fs">
        <li v-for="example in examples">
            <Example :example="example" :store="props.store" />
        </li>
    </ul>
</template>