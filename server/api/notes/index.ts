import { useNotesReader } from "~/utils/notesReader"

export default defineEventHandler(async (event) => {
    const notesReader = useNotesReader()
    return await notesReader.listNotes()
})
