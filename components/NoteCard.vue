<template>
    <div class="container p-4 mx-0 my-5 shadow-md rounded-lg bg-white max-w-3xl">
        <!--TODO display metadata on the note (date, tags, etc.)-->
        <div class="prose" v-html="$mdRenderer(data)"></div>
    </div>
</template>

<script setup>
    const { noteID } = defineProps(['noteID'])
    const { data } = await useFetch(`/api/notes/${noteID}`)
</script>

<style lang="scss" scoped>

</style>
