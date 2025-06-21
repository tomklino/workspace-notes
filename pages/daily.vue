<template>
    <div class="h-full flex flex-col space-y-2 w-full no-scrollbar">
        <NoteCard v-for="(note, i) in dailyNotes"
            :noteID=note :key="note" startRaw editable
            @click="active = i" :noteActive="i === active"
            :class="[i === active ? 'flex-1' : 'overflow-y-hidden' , 'basis-12 overflow-x-auto']"/>

        <!-- Floating Add Button -->
        <button @click="addNote" class="fixed bottom-6 right-6 w-14 h-14 bg-[#12b488] text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center z-50 opacity-60 hover:opacity-100">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
            </svg>
        </button>
    </div>
</template>

<script setup>
    let active = ref(0)
    const { $dailyNotes } = useNuxtApp()
    const dailyNotesNumber = useState('dailyNotesNumber')

    const dailyNotes = ref(await $dailyNotes.requestDaily(dailyNotesNumber.value))

    const addNote = async () => {
        dailyNotesNumber.value = dailyNotes.value.length + 1
        dailyNotes.value = await $dailyNotes.requestDaily(dailyNotesNumber.value)
    }
</script>

<style lang="scss" scoped>

</style>
