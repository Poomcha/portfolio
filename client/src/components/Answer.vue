<script setup lang="ts">
import { computed, ref, watch } from 'vue';

import { Store } from '../store';

const answerHtml = ref<HTMLDivElement | null>(null)

const props = defineProps<{ answer?: string; id: string, store: Store }>()

const computedAnswer = computed(() => props.store.getStoreAnswer(props.id))

watch(computedAnswer, () => {
    if (!answerHtml.value) { return }
    else {
        answerHtml.value.scrollIntoView({ block: "end", inline: "end" })
    }
})
</script>

<template>
    <div v-if="computedAnswer">
        <div>
            <span style="color: var(--color-text-assistant-name);">@poomcha-assistant ></span>
        </div>
        <br />
        <div v-html="answer" ref="answerHtml"
            style="background-color: var(--color-background-qA); padding: var(--padding-qA); border-radius: 0.2rem;">
        </div>
        <br />
    </div>
</template>