import { useNotesReader } from "~/utils/notesReader"

export default defineEventHandler(async (event) => {
    const notesReader = useNotesReader()
    const [ err, notes ] = await notesReader.listNotes()
    if(err) return []
    return notes
})
