<script setup lang="ts">
import { Store } from '../store';

const props = defineProps<{ example: string, color?: string, store: Store }>()

function handleClick(event: Event) {
    props.store.setStoreQuestion(
        (event.target as HTMLButtonElement).innerText,
        props.store.getCurrentId()
    );

    window.scrollTo(0, window.document.body.scrollHeight)
}
</script>

<template>
    <button class="flex button-example" style="text-align: left;" @click.prevent="handleClick">
        {{ props.example }}
    </button>
</template>