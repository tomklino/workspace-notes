<template>
    <div>
        <div v-if="$notesLoader.pending">
            <NoteCard v-for="note in $notesLoader.notes.value"
                :noteID=note :key="note" class="overflow-x-auto"/>
        </div>
    </div>
</template>

<script setup>
    const days = useState("days")
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
