type LocalNote = {
  content: string
  ISODateString: string
  tags: Array<[string, string]>
}

const storageKey = 'workspace-notes.local-notes.v1'

function readNotes(): Record<string, LocalNote> {
  try {
    return JSON.parse(localStorage.getItem(storageKey) || '{}')
  } catch {
    return {}
  }
}

function writeNotes(notes: Record<string, LocalNote>) {
  localStorage.setItem(storageKey, JSON.stringify(notes))
}

function dateForId(id: string) {
  const date = decodeURIComponent(id).split('/')[2]?.replace('workspaces-', '')
  return date ? new Date(`${date}T00:00:00.000Z`).toISOString() : new Date().toISOString()
}

function idForDate(date: Date, number: number) {
  const isoDate = date.toISOString().slice(0, 10)
  const month = date.toLocaleString('default', { month: 'long', timeZone: 'UTC' }).toLowerCase()
  return `${date.getUTCFullYear()}/${month}.d/workspaces-${isoDate}/workspace-${number}.md`
}

export default defineNuxtPlugin({
  name: 'local-notes',
  enforce: 'pre',
  setup() {
  const localMode = useState<boolean>('localMode', () => false)
  localMode.value = localStorage.getItem('workspace-notes.local-mode') === 'true'

  function enable() {
    localStorage.setItem('workspace-notes.local-mode', 'true')
    localMode.value = true
  }

  function disable() {
    localStorage.removeItem('workspace-notes.local-mode')
    localMode.value = false
  }

  function read(id: string): LocalNote {
    const decodedId = decodeURIComponent(id)
    return readNotes()[decodedId] || { content: '', ISODateString: dateForId(decodedId), tags: [] }
  }

  function save(id: string, content: string) {
    const decodedId = decodeURIComponent(id)
    const notes = readNotes()
    notes[decodedId] = { ...read(decodedId), content }
    writeNotes(notes)
  }

  function list(days: number, bug?: string) {
    const notes = readNotes()
    const cutoff = new Date()
    cutoff.setDate(cutoff.getDate() - (Number.isFinite(days) ? days : 5))

    return Object.entries(notes)
      .filter(([id, note]) => {
        if (bug) return note.content.split('\n').some(line => line.trim() === `Bug: ${bug}` || line.trim() === `Label: ${bug}`)
        return note.content.length > 0 && new Date(note.ISODateString) >= cutoff
      })
      .sort(([a], [b]) => dateForId(b).localeCompare(dateForId(a)))
      .map(([id]) => encodeURIComponent(id))
  }

  function createDaily(numberOfNotes: number, date = new Date()) {
    const notes = readNotes()
    const ids: string[] = []
    for (let number = 1; number <= numberOfNotes; number++) {
      const id = idForDate(date, number)
      if (!notes[id]) notes[id] = { content: '', ISODateString: dateForId(id), tags: [] }
      ids.push(encodeURIComponent(id))
    }
    writeNotes(notes)
    return ids
  }

    return { provide: { localNotes: { localMode, enable, disable, read, save, list, createDaily } } }
  }
})
