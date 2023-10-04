<template>
    <div>
        <h2>Home</h2>
        <div>
            <div class="prose" v-html="$mdRenderer.render(data)"></div>
        </div>

    </div>
</template>

<script setup>
    const { data } = await useFetch('/api/hello')
</script>

<style lang="scss" scoped>
    h2 {
        margin-bottom: 20px;
        font-size: 36px
    }
    p {
        margin: 20px
    }
</style>