<template>
    <div v-for="note in $notesLoader.notes.value" :key="note">
       <NoteCard :noteID=note class="overflow-x-auto mb-5"/>
    </div>
</template>

<script setup>

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
