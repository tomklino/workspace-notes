import { useNotesReader } from "~/utils/notesReader"
import { getServerSession } from '#auth'

export default defineEventHandler(async (event) => {
    const session = await getServerSession(event)
    if (!session?.user) {
        throw createError({ statusCode: 401, statusMessage: 'Unauthenticated' })
    }
    const user = session.user
    if (!user.email) {
        throw createError({ statusCode: 401, statusMessage: 'User email not found in session' })
    }
    const userId = user.email as string
    const query = getQuery(event)
    const days = Number(query?.days)
    const bug = query?.bug ? String(query.bug) : null

    const notesReader = useNotesReader(userId)
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
