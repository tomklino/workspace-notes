import { useNotesReader } from "~/utils/notesReader"

export default defineEventHandler(async (event) => {
    const query = getQuery(event)
    const days = Number(query?.days)
    const notesReader = useNotesReader()
    const [ err, notes ] = await notesReader.listNotes(days)
    if(err) return []
    return notes
})
