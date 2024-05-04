import { useNotesReader } from "~/utils/notesReader"

export default defineEventHandler(async (event) => {
    const notesReader = useNotesReader()
    const _id = getRouterParam(event, 'id')
    if (typeof _id !== 'string') {
        return "## Invalid Note ID"
    }
    const noteID: string = decodeURIComponent(_id)
    console.log(`POST edit note ${noteID}`)
    const { content }: { content: string } = await readBody(event)
    const [ err, response ] = await notesReader.editNote(noteID, content)
    if(err) {
        console.error(err)
        return "500 internal server error"
    }
    return response
})
