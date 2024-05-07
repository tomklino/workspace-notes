<template>
    <div class="h-screen flex flex-col space-y-2 w-full no-scrollbar">
        <NoteCard v-for="(note, i) in dailyNotes"
            :noteID=note :key="note" startRaw :noteActive="i === active"
            @click="active = i"
            :class="[i === active ? 'flex-1' : 'overflow-y-hidden' , 'basis-12 overflow-x-auto']"/>
    </div>
</template>

<script setup>
    definePageMeta({
        layout: 'daily'
    })

    let active = ref(0)
    const { $dailyNotes } = useNuxtApp()

    const dailyNotes = await $dailyNotes.requestDaily()
</script>

<style lang="scss" scoped>

</style>
