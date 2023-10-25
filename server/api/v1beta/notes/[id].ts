import { useNotesReader } from "~/utils/notesReader"

export default defineEventHandler(async (event) => {
    const notesReader = useNotesReader()
    const _id = getRouterParam(event, 'id')
    if (typeof _id !== 'string') {
        return "## Invalid Note ID"
    }
    const noteID: string = decodeURIComponent(_id)
    const [ err, contents ] = await notesReader.readNote(noteID)
    if(err) {
        console.error(err)
        return "## 404"
    }
    return contents
})