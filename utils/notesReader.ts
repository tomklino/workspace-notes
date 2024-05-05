import { exec } from 'child_process'
import { readdir, readFile, stat, writeFile, mkdir, open } from 'node:fs/promises'
import path from 'path'

type ErrorTuple<T> = [Error|null,T|null]

type Note = {
    content: string,
    ISODateString: string,
    tags: Array<[ string, string ]>
}

type NotesReader = {
    createDailyNotes(numberOfNotes: number): Promise<ErrorTuple<string[]>>
    readNote: (id: string) => Promise<ErrorTuple<Note>>,
    listNotes: (days: number) => Promise<ErrorTuple<string[]>>
    bugNotes: (bug: string) => Promise<ErrorTuple<string[]>>
    editNote: (id: string, content: string) => Promise<ErrorTuple<string>>
}

let _notesReader: null|NotesReader = null

export function useNotesReader() {
    if(_notesReader === null) {
        const config = useRuntimeConfig()
        _notesReader = initNotesReader(config.dataDir)
    }
    return _notesReader
}

function initNotesReader(datadir: string): NotesReader {
    async function readNote(id: string): Promise<ErrorTuple<Note>> {
        try {
            const fileContents =
                await readFile(
                    path.join(datadir, decodeURIComponent(id)), 'utf-8')
            const note = {
                content: fileContents,
                ISODateString: _dateOfNote(id).toISOString(),
                tags: []
            }

            return [ null, note ]
        } catch (err: any) {
            return [ err, null ]
        }
    }

    async function bugNotes(bug: string): Promise<ErrorTuple<string[]>> {
        try {
            const allNotes =
                (await readdir(datadir, { recursive: true }))
                .filter(note => note.endsWith('.txt') || note.endsWith('.md'))
            const rawResults: string[] = []
            await Promise.all(allNotes.map(async (note) =>{
                if(await hasBugLabel(note, bug)) rawResults.push(note)
            }))
            const results = rawResults
                .sort((a, b) => { return _dateOfNote(a) < _dateOfNote(b) ? -1 : 1 })
                .reverse()
                .map(r => encodeURIComponent(r))
            return [ null, results ]
        } catch (err: any) {
            return [ err, null ]
        }
    }

    async function hasBugLabel(note: string, bug: string): Promise<boolean> {
        try {
            const noteContents = await readFile(path.join(datadir, note), { encoding: 'utf-8' })
            return noteContents.split('\n').some(line => line.trim() === `Bug: ${bug}`)
        } catch (err: any) {
            throw err
        }
    }

    async function listNotes(days: number): Promise<ErrorTuple<string[]>> {
        if(isNaN(days)) days = 5
        const lookupDates: Date[] = []
        while(days >= 0)
            lookupDates.push(_todayMinusDays(days--))

        const foundNotes: Set<string> = new Set()
        await Promise.all(lookupDates.map(async (lookupDate: Date) => {
            let [ err, notes ] = await _getNotesForDate(lookupDate)
            if(err) {
                if(err.message.startsWith('ENOENT')) return
                console.error(
                    "ERROR: unexpected error looking up notes for date",
                    err)
            }
            if(notes === null) return
            notes.forEach(note => foundNotes.add(note))
        }))

        const unsortedResults: string[] = []
        await Promise.all(Array.from(foundNotes).map(async (note) => {
            if(!await _isNoteEmpty(note))
                unsortedResults.push(note)
        }))

        const results = unsortedResults
            .sort((a, b) => { return _dateOfNote(a) < _dateOfNote(b) ? -1 : 1 })
            .reverse()
            .map(encodeURIComponent)

        return [ null, results ]
    }

    async function editNote(id: string, content: string): Promise<ErrorTuple<string>> {
        try {
            await writeFile(
                path.join(datadir, decodeURIComponent(id)),
                content, 'utf-8')
        } catch (err: any) {
            return [ err, null ]
        }
        return [ null, id ]
    }

    async function createDailyNotes(numberOfNotes: number): Promise<ErrorTuple<string[]>> {
        const dailyDirectory = _getNotesDirForDate(new Date())
        try {
            await mkdir(path.join(datadir, dailyDirectory), { recursive: true })
        } catch(err: any) {
            return [ err, null ]
        }

        // create or extend number of notes in the dir to match `numberOfNotes`
        // TODO will be much better if it's done concurrently
        for(let i = 1; i <= numberOfNotes; i++) {
            await _touchNote(path.join(
                datadir,
                dailyDirectory,
                `workspace-${i}.md`))
        }

        // return the IDs of all files in the daily directory
        try {
            const notes = await _getNotesInDir(dailyDirectory)
            return [ null, notes ]
        } catch(err: any) {
            return [ err, null]
        }
    }

    async function _touchNote(note: string): Promise<boolean> {
        let fh;
        try {
            fh = await open(note, 'a')
        } finally {
            fh?.close()
            return true
        }
    }

    async function _isNoteEmpty(note: string): Promise<boolean> {
        const noteStat = await stat(path.join(datadir, decodeURIComponent(note)))
        return noteStat.size === 0
    }

    async function _getNotesForDate(date: Date): Promise<ErrorTuple<string[]>> {
        const notesInternalPath = _getNotesDirForDate(date)

        try {
            const files = await _getNotesInDir(notesInternalPath)
            return [ null, files ]
        } catch (err: any) {
            return [ err, null ]
        }
    }

    async function _getNotesInDir(internalPath: string): Promise<string[]> {
        const filesRaw = await readdir(path.join(datadir, internalPath))
        return filesRaw
            .filter(f => f.endsWith('md') || f.endsWith('txt'))
            .map(f => path.join(internalPath, f))
            .map(encodeURIComponent)
    }

    function _getNotesDirForDate(date: Date): string {
        const yearDir = String(date.getFullYear())
        const monthDir = date.toLocaleString('default', { month: 'long' })
            .toLowerCase()
            .concat('.d')
        const dayDir = `workspaces-${date.toISOString().split('T')[0]}`
        const notesInternalPath = path.join(yearDir, monthDir, dayDir)

        return notesInternalPath
    }

    function _dateOfNote(note: string): Date {
        try {
            // parse date from note id format:
            // "2023/november.d/workspaces-2023-11-09/workspace-1.md"
            return new Date(
                decodeURIComponent(note)
                    .split('/')[2]
                    .split('-')
                    .slice(1)
                    .join('-')
                )
        } catch (err: any) {
            console.error("WARNING: Unable to parse date", note);
            return new Date()
        }
    }

    function _todayMinusDays(days: number): Date {
        const d = new Date()
        d.setDate(d.getDate() - days)
        return d
    }

    return {
        readNote,
        listNotes,
        bugNotes,
        editNote,
        createDailyNotes
    }
}
