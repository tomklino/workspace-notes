import { useNotesReader } from "~/utils/notesReader"
import { getServerSession } from '#auth'

export default defineEventHandler(async (event) => {
    const session = await getServerSession(event)
    if (!session?.user || !session.user.email) {
        throw createError({ statusCode: 401, statusMessage: 'Unauthenticated' })
    }
    const userId = session.user.email as string
    const notesReader = useNotesReader(userId)
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
