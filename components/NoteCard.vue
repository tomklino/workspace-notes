<template>
    <div class="container md-5 p-4 m-5 shadow-md rounded-lg bg-white">
        <div class="prose" v-html="$mdRenderer.render(data)"></div>
    </div>
</template>

<script setup>
    const { noteID } = defineProps(['noteID'])
    const { data } = await useFetch(`/api/notes/${noteID}`)
</script>

<style lang="scss" scoped>

</style>