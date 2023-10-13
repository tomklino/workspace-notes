export default defineNuxtPlugin(async () => {
    const days = useState('days')
    const { pending, data: notes, refresh } =
        await useAsyncData('notes', () => {
            return $fetch(`/api/notes?days=${days.value}`)
        })
    return {
        provide: {
            notesLoader: {
                pending,
                notes,
                refresh,
            }
        }
    }
})
