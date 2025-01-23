<script setup lang="ts">
import Question from './Question.vue';
import Answer from './Answer.vue';

import { computed } from 'vue';

import { Store } from '../store';

const props = defineProps<{ store: Store }>()
const computedStoreQA = computed(() => {
    return props.store.getStore().qA
})

</script>

<template>
    <ul>
        <li v-for="questionAnswer in computedStoreQA" :key="questionAnswer.id">
            <Question :question="questionAnswer.question" :id="questionAnswer.id" :store="props.store" />
            <Answer :answer="questionAnswer.answer" :id="questionAnswer.id" :store="props.store"/>
        </li>
    </ul>
</template>
