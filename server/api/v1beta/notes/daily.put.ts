import { useNotesReader } from "~/utils/notesReader"
import { getServerSession } from '#auth'

export default eventHandler(async (event) => {
    const session = await getServerSession(event)
    if (!session?.user) {
        throw createError({ statusCode: 401, statusMessage: 'Unauthenticated' })
    }
    if(!session.user.email) {
        throw createError({ statusCode: 401, statusMessage: 'No email found for user' })
    }
    const userId = session.user.email as string
    const query = getQuery(event)
    const numberOfNotes = Number(query?.num)
    const dateStr = query?.date as string | undefined
    let date: Date | undefined
    if (dateStr) {
        const parsedDate = new Date(dateStr)
        if (!isNaN(parsedDate.getTime())) {
            date = parsedDate
        }
    }

    const notesReader = useNotesReader(userId)
    const [ err, dailyNotes ] = await notesReader.createDailyNotes(numberOfNotes, date)
    if(err) {
        console.error("Error while trying to create daily notes", err)
        throw createError({
            statusCode: 500,
            statusMessage: "Internal Server Error"
        })
    }
    return dailyNotes
})
