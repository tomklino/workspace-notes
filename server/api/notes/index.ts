import initNotesReader from "~/utils/notesReader"

// TODO init in a more global file
const notesReader = initNotesReader('/home/tomklino/notes/october.d/workspaces-2023-10-03/')


export default defineEventHandler(async (event) => {
    return await notesReader.listNotes()
})
