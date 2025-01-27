<script setup lang="ts">
import { computed } from 'vue';

import { Store } from '../store';

const props = defineProps<{ answer?: string; id: string, store: Store }>()

const computedAnswer = computed(() => props.store.getStoreAnswer(props.id))
</script>

<template>
    <div v-if="computedAnswer">
        <div>
            <span style="color: var(--color-text-assistant-name);">@poomcha-assistant ></span>
        </div>
        <br />
        <div v-html="answer"></div>
        <br />
    </div>
</template>