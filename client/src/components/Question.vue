<script setup lang="ts">

import { computed } from 'vue';
import { Mistral } from '../mistral'
import { Store } from '../store'

const props = defineProps<{ question?: string, id: string, store: Store }>()

function updateQuestion(event: Event) {
    props.store.setStoreQuestion((event.target as HTMLInputElement).value, props.id)
}

async function handleSubmit(event: Event) {
    // Assistant is display ahead of response
    props.store.setStoreAnswer(" ", props.id)

    const mistral = new Mistral()


    const question = props.store.getStoreQuestion(props.id)
    if (question) {
        try {
            // This should be a stream
            const response = await mistral.chat(question)

            if (response) {
                const reader = response.getReader()
                const decoder = new TextDecoder('utf-8')

                while (true) {
                    const { done, value } = await reader.read();
                    if (done) {
                        break;
                    }
                    const chunk = decoder.decode(value, { stream: true });
                    props.store.appendToStoreAnswer(chunk, props.id)
                }
            }

            // Insert new question prompt
            props.store.insertNewQA()
        } catch (error) {
            throw error
        }
    }
}

const computedDisabled = computed(() => !!props.store.getStoreAnswer(props.id))
</script>

<template>
    <div class="flex gap-fs">
        <div>
            <span style="color: var(--color-text-user-name);">@user ></span>
        </div>
        <form>
            <input type="text" @input="updateQuestion" @keydown.enter.prevent="handleSubmit"
                :disabled="computedDisabled">
        </form>
    </div>
    <br />
</template>
