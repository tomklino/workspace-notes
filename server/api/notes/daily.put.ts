import { useNotesReader } from "~/utils/notesReader"

export default defineEventHandler(async (event) => {
    const query = getQuery(event)
    const numberOfNotes = Number(query?.num)

    const notesReader = useNotesReader()
    const [ err, dailyNotes ] = await notesReader.createDailyNotes(numberOfNotes)
    if(err) {
        console.error(err)
        throw createError({
            statusCode: 500,
            statusMessage: "Internal Server Error"
        })
    }
    return dailyNotes
})
