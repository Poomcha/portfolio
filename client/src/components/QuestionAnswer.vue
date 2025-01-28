<script setup lang="ts">
import Question from './Question.vue';
import Answer from './Answer.vue';

import { computed } from 'vue';

import { Store } from '../store';
import Examples from './Examples.vue';

const props = defineProps<{ store: Store }>()

const computedStoreQA = computed(() => {
    return props.store.getStore().qA.slice(1)
})

const computedFirstAnswer = computed(() => {
    const firstQAId = props.store.getFirstId()
    return {
        answer: props.store.getStoreAnswer(firstQAId),
        id: firstQAId
    }
})
</script>

<template>
    <ul>
        <li>
            <Answer :answer="computedFirstAnswer.answer" :id="computedFirstAnswer.id" :store="props.store" />
            <Examples :store="props.store" />
            <br />
        </li>
        <li v-for="questionAnswer in computedStoreQA" :key="questionAnswer.id">
            <Question :question="questionAnswer.question" :id="questionAnswer.id" :store="props.store" />
            <Answer :answer="questionAnswer.answer" :id="questionAnswer.id" :store="props.store" />
        </li>
    </ul>
</template>
