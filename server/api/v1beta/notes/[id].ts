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
    const [ err, note ] = await notesReader.readNote(noteID)
    if(err) {
        console.error(err)
        return { content: "## 404" }
    }
    return note
})
