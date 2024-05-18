export default defineNuxtPlugin(async () => {
    const searchType = useState("searchType")
    const days = useState('days')
    const bug = useState('bug')
    const { pending, data: notes, refresh } =
        await useAsyncData('notes', () => {
            return $fetch(`/api/v1beta/notes`, {
                query: {
                    days: searchType.value === 'days' ? days.value : null,
                    bug: searchType.value === 'bug' ? bug.value : null
                }
            })
        },
        {
            watch: [days, bug, searchType],
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
