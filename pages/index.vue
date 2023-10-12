<template>
    <div>
        <button
            class="btn"
            v-on:click="reloadNotes"
            >
        Reload {{ days || 5 }} days</button>
        <NoteCard v-for="note in notes" :noteID=note :key="note"/>
    </div>
</template>

<script setup>
    const days = useState("days")
    let notes = new Array()
    await reloadNotes()

    async function reloadNotes(event) {
        console.log(`reloading ${days.value} days`)
        let response = await useFetch(`/api/notes?days=${days.value}`)
        notes = response.data
        refreshNuxtData()
    }
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
