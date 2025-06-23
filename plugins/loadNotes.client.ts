export default defineNuxtPlugin(async () => {
    const searchType = useState("searchType")
    const days = useState('days')
    const bug = useState('bug')

    const { pending, data: notes, refresh } =
        await useAsyncData('notes', () => {
            const params = new URLSearchParams()
            if (searchType.value === 'days' && days.value != null)
                params.append('days', String(days.value))
            if (searchType.value === 'bug' && bug.value != null)
                params.append('bug', String(bug.value))
            return $fetch(`/api/v1beta/notes?${params.toString()}`)
        },
        {
            watch: [days, bug, searchType],
        })

    function requestDaily(notes: number = 4) {
        console.log("putting daily notes")
        const effectiveDate = new Date()
        const url = `/api/v1beta/notes/daily?num=${notes}&date=${
            effectiveDate.toISOString().split('T')[0]
        }`
        return $fetch(url, {
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
