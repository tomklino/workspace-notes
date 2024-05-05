<template>
    <div>
        <div>
            <NoteCard v-for="note in dailyNotes"
                :noteID=note :key="note" startRaw=true
                class="overflow-x-auto"/>
        </div>
    </div>
</template>

<script setup>
    definePageMeta({
        layout: 'daily'
    })

    const { $dailyNotes } = useNuxtApp()

    const dailyNotes = await $dailyNotes.requestDaily()
</script>

<style lang="scss" scoped>

</style>
