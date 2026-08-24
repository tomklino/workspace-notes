export default defineNuxtPlugin(async () => {
  const searchType = useState('searchType')
  const days = useState('days')
  const bug = useState('bug')
  const { $localNotes } = useNuxtApp()

  const loadNotes = () => {
    if ($localNotes.localMode.value) return $localNotes.list(days.value, searchType.value === 'bug' ? bug.value : undefined)

    const params = new URLSearchParams()
    if (searchType.value === 'days' && days.value != null) params.append('days', String(days.value))
    if (searchType.value === 'bug' && bug.value != null) params.append('bug', String(bug.value))
    return $fetch(`/api/v1beta/notes?${params.toString()}`)
  }

  const { pending, data: notes, refresh } = await useAsyncData('notes', loadNotes, {
    watch: [days, bug, searchType, $localNotes.localMode]
  })

  function requestDaily(notes: number = 4) {
    if ($localNotes.localMode.value) return $localNotes.createDaily(notes)

    const effectiveDate = new Date()
    return $fetch(`/api/v1beta/notes/daily?num=${notes}&date=${effectiveDate.toISOString().split('T')[0]}`, { method: 'PUT' })
  }

  return {
    provide: {
      notesLoader: { pending, notes, refresh },
      dailyNotes: { requestDaily }
    }
  }
})
