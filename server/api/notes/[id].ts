import initNotesReader from "~/utils/notesReader"

// TODO init in a more global file
const notesReader = initNotesReader('/home/tomklino/notes/october.d/workspaces-2023-10-03/')

export default defineEventHandler(async (event) => {
    const _id = getRouterParam(event, 'id')
    if (typeof _id !== 'string') {
        return "## Invalid Note ID"
    }
    const noteID: string = decodeURIComponent(_id)
    const [ err, contents ] = await notesReader.readNote(noteID)
    if(err) {
        return "## 404"
    }
    return contents
})