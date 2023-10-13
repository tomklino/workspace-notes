<template>
    <div>
        <button
            class="btn"
            v-on:click="refresh" >
        Reload {{ days || 5 }} days</button>
        <div v-if="!pending && notes.length > 0">
            <NoteCard v-for="note in notes" :noteID=note :key="note"/>
        </div>
    </div>
</template>

<script setup>
    const days = useState("days")
    const { pending, data: notes, refresh } =
        await useAsyncData('notes', () => $fetch(`/api/notes?days=${days.value}`))
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
