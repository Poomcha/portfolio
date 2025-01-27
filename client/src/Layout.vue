<!-- Global Layout of the app -->
<script setup lang="ts">
import { ref } from 'vue';

const footer = ref(null)
const contact = ref(null)
const icon = ref(null)

let direction = -1;

function handleClick() {
    const contactSize = (contact.value! as HTMLUListElement).offsetHeight;
    const translateOffset = direction < 0 ? direction * contactSize - 30 : 0;
    const rotationAngle = direction < 0 ? direction * 180 : 0;
    const animateOptions: KeyframeAnimationOptions = {
        // Temporisation
        duration: 300,
        fill: "forwards",
    };

    (footer.value! as HTMLElement).animate(
        [
            // Step
            { transform: `translateY(${translateOffset}px)` },
        ],
        animateOptions,

    );

    (icon.value! as HTMLImageElement).animate(
        [
            { transform: `rotate(${rotationAngle}deg)` }
        ],
        animateOptions
    )

    direction *= -1
}
</script>

<template>
    <div class="layout p-relative flex flex-column flex-center gap-2fs">
        <header>
            <div class="flex">
                <img src="./assets/images/wip-2.png" alt="WIP" width="400" height="300" style="margin: auto;">
            </div>
        </header>
        <main>
            <Suspense>
                <slot></slot>
            </Suspense>
        </main>
        <footer class="flex flex-column footer" ref="footer">
            <!-- !!!
            Integrate a list a link (email, linkedin, github) and a short paragraphe to contact me.
              -->
            <button class="flex flex-center gap-fs footer-button" @click="handleClick">
                <div>
                    <span>Contact</span>
                </div>
                <img src="./assets/icons/caret-up-solid.svg" alt="Show Footer" class="icon icon-caret" ref="icon">
            </button>
            <ul class="flex flex-evenly-x gap-fs contact" ref="contact">
                <li>
                    <a href="https://www.linkedin.com/in/benjamin-degen%C3%A8ve-93b991186/"
                        class="flex flex-center gap-fs">
                        <img src="./assets/icons/linkedin-brands-solid.svg" alt="LinkedIn Logo" class="icon">
                        <span>LinkedIn</span>
                    </a>
                </li>
                <li>
                    <a href="https://github.com/Poomcha" class="flex flex-center gap-fs">
                        <img src="./assets/icons/github-brands-solid.svg" alt="Github Logo" class="icon">
                        <span>Github</span>
                    </a>
                </li>
                <li>
                    <a href="mailto:ben.degeneve@gmail.com" class="flex flex-center gap-fs">
                        <img src="./assets/icons/envelope-solid.svg" alt="Email Logo" class="icon">
                        <span>Email</span>
                    </a>
                </li>
            </ul>
        </footer>
    </div>
</template>

<style lang="css">
.layout {
    padding: 0 var(--padding-lr-layout);
    min-height: 100vh;
    overflow-y: hidden;
}

.footer {
    margin-top: auto;
    position: relative;
    top: 45px;
}

.footer-button {
    border-radius: 0;
    border-top-left-radius: 0.2rem;
    border-top-right-radius: 0.2rem;
    margin-left: auto;
}

.contact {
    background-color: var(--color-text);
    color: var(--color-background);
    padding: 0.5rem;
    border-top-left-radius: 0.2rem;
    border-bottom-right-radius: 0.2rem;
    border-bottom-left-radius: 0.2rem;
}
</style>