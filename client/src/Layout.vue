<!-- Global Layout of the app -->

<template>
    <div class="layout">
        <header></header>
        <main>
            <slot></slot>
        </main>
        <footer>
            <!-- !!!
            Integrate a list a link (email, linkedin, github) and a short paragraphe to contact me.
              -->
        </footer>
    </div>
</template>

<style lang="css">
.layout {
    padding: 15px;
    width: 100%;
    min-height: 100vh;
}
</style>