<template>
    <div>
        <NoteCard v-for="note in notes" :noteID=note :key="note"/>
    </div>
</template>

<script setup>
    const { data: notes } = await useFetch('/api/notes')
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