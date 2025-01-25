<script setup lang="ts">

import { computed, onMounted, ref } from 'vue';
import { Mistral } from '../mistral'
import { Store } from '../store'

const props = defineProps<{ question?: string, id: string, store: Store }>()

function updateQuestion(event: Event) {
    props.store.setStoreQuestion((event.target as HTMLInputElement).innerText, props.id)
}

async function handleSubmit(event: Event) {
    // Assistant is display ahead of response
    props.store.setStoreAnswer(" ", props.id);

    // Disable contentEditable
    (event.target as HTMLParagraphElement).attributes.removeNamedItem("contenteditable")

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


        } catch (error) {
            throw error
        }

        // Insert new question prompt
        props.store.insertNewQA()
    }


}

const contentEditable = ref<HTMLParagraphElement | null>(null)

onMounted(() => {
    const contentEditableId = contentEditable.value!.dataset["id"]!
    if (props.store.getCurrentQuestionId() === contentEditableId) {
        console.log("focusing...")
        contentEditable.value!.focus()
    }
})
</script>

<template>
    <div class="flex flex-column gap-fs">
        <div>
            <span style="color: var(--color-text-user-name);">@user ></span>
        </div>
        <p contenteditable="plaintext-only" ref="contentEditable" :key="`cE-${id}`" @input="updateQuestion"
            @keydown.enter.exact.prevent="handleSubmit" :data-id="id">
        </p>
    </div>
    <br />
</template>
