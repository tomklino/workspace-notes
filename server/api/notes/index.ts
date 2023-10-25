import { useNotesReader } from "~/utils/notesReader"

export default defineEventHandler(async (event) => {
    const query = getQuery(event)
    const days = Number(query?.days)
    const bug = query?.bug ? String(query.bug) : null

    const notesReader = useNotesReader()
    if(typeof bug === 'string' && bug.length > 0) {
        console.log("GET notes with bug query:", bug)
        const [ err, notes ] = await notesReader.bugNotes(bug)
        if(err) return []
        return notes
    }
    if(days) {
        console.log("GET notes with days query")
        const [ err, notes ] = await notesReader.listNotes(days)
        if(err) return []
        return notes
    }
    console.log("GET notes without a query")
    const [ err, notes ] = await notesReader.listNotes(5)
    if(err) return []
    return notes
})
