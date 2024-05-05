export default defineNuxtPlugin(async () => {
    const searchType = useState("searchType")
    const days = useState('days')
    const bug = useState('bug')
    const { pending, data: notes, refresh } =
        await useAsyncData('notes', () => {
            if(searchType.value === 'days')
                return $fetch(`/api/v1beta/notes?days=${days.value}`)
            if(searchType.value === 'bug')
                return $fetch(`/api/v1beta/notes?bug=${bug.value}`)

            // default
            return $fetch(`/api/v1beta/notes`)
        })
    function requestDaily() {
        console.log("putting daily notes")
        return $fetch(`/api/notes/daily?num=4`, {
            method: 'PUT'
        })
    }
    return {
        provide: {
            notesLoader: {
                pending,
                notes,
                refresh,
            },
            dailyNotes: {
                requestDaily
            }
        }
    }
})
