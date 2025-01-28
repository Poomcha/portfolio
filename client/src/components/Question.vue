<script setup lang="ts">

import { computed, onMounted, ref } from 'vue';
import { Mistral } from '../mistral'
import { Store } from '../store'

const props = defineProps<{ question?: string, id: string, store: Store }>()
const contentEditable = ref<HTMLParagraphElement | null>(null)

function isMobile() {
    const userAgent = window.navigator.userAgent;
    if (
        userAgent.includes("Mobile") ||
        userAgent.includes("Tablet") ||
        userAgent.includes("Mobi") ||
        userAgent.includes("IEMobile")
    ) {
        return true
    }
    return false
}

// Update store question
function updateQuestion(event: Event) {
    const element = event.target as HTMLParagraphElement
    props.store.setStoreQuestion(element.innerText, props.id)
}

// Handle enter differently on Mobile / PC
function handleEnter(event: Event) {
    if (isMobile()) {
        handleLineBreak()
    }
    else {
        event.preventDefault()
        submit(contentEditable)
    }
}

// Add line break to contenteditable
function handleLineBreak() {
    contentEditable.value!.innerText.concat("\n")
}

// Handle click (only mobile)
function handleClick() {
    submit(contentEditable)
}

// Submit contenteditable, query Mistral API
async function submit(cE: typeof contentEditable) {
    if (!cE.value) return

    const mistral = new Mistral()

    const question = props.store.getStoreQuestion(props.id)
    if (question && question.trim().length > 0) {

        // Disable contentEditable
        cE.value.attributes.removeNamedItem("contenteditable");
        // Insert parsed corresponding question
        cE.value.innerText = question;

        try {
            await mistral.streamToStore(props.store, question, props.id)
        } catch (error) {
            throw error
        }

        // Insert new question prompt
        props.store.insertNewQA()
    }
}

function isActiveQuestion() {
    return props.id === props.store.getCurrentId()
}

onMounted(() => {
    const contentEditableId = contentEditable.value!.dataset["id"]
    if (props.store.getCurrentId() === contentEditableId) {
        contentEditable.value!.focus()
    }
})

const showSubmitButton = computed(() => isActiveQuestion())

const question = computed(() => props.store.getStoreQuestion(props.id))
</script>

<template>
    <div class="flex flex-column gap-fs">
        <div>
            <span style="color: var(--color-text-user-name);">@user ></span>
        </div>
        <div class="flex gap-2fs" style="max-width: 100%;">
            <p contenteditable="plaintext-only" ref="contentEditable" :key="`cE-${id}`" @input="updateQuestion"
                @change="handleChange" @keydown.enter.exact="handleEnter" @keydown.shift.enter="handleLineBreak"
                :data-id="id">
                {{ question }}
            </p>
            <button v-if="showSubmitButton" @click="handleClick" class="flex flex-center button-submit"
                style="align-self: last baseline; margin-left: auto;">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="icon icon-light">
                    <path
                        d="M256 448c141.4 0 256-93.1 256-208S397.4 32 256 32S0 125.1 0 240c0 45.1 17.7 86.8 47.7 120.9c-1.9 24.5-11.4 46.3-21.4 62.9c-5.5 9.2-11.1 16.6-15.2 21.6c-2.1 2.5-3.7 4.4-4.9 5.7c-.6 .6-1 1.1-1.3 1.4l-.3 .3c0 0 0 0 0 0c0 0 0 0 0 0s0 0 0 0s0 0 0 0c-4.6 4.6-5.9 11.4-3.4 17.4c2.5 6 8.3 9.9 14.8 9.9c28.7 0 57.6-8.9 81.6-19.3c22.9-10 42.4-21.9 54.3-30.6c31.8 11.5 67 17.9 104.1 17.9zM128 208a32 32 0 1 1 0 64 32 32 0 1 1 0-64zm128 0a32 32 0 1 1 0 64 32 32 0 1 1 0-64zm96 32a32 32 0 1 1 64 0 32 32 0 1 1 -64 0z" />
                </svg>
            </button>
        </div>
    </div>
    <br />
</template>
