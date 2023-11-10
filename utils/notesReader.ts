import { exec } from 'child_process'
import { readdir, readFile, stat } from 'node:fs/promises'
import path from 'path'

type ErrorTuple<T> = [Error|null,T|null]

type NotesReader = {
    readNote: (id: string) => Promise<ErrorTuple<string>>,
    listNotes: (days: number) => Promise<ErrorTuple<string[]>>
    bugNotes: (bug: string) => Promise<ErrorTuple<string[]>>
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
    async function readNote(id: string): Promise<ErrorTuple<string>> {
        try {
            const file = await readFile(path.join(datadir, decodeURIComponent(id)), 'utf-8')
            return [ null, file ]
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

    async function _isNoteEmpty(note: string): Promise<boolean> {
        const noteStat = await stat(path.join(datadir, decodeURIComponent(note)))
        return noteStat.size === 0
    }

    async function _getNotesForDate(date: Date): Promise<ErrorTuple<string[]>> {
        const yearDir = String(date.getFullYear())
        const monthDir = date.toLocaleString('default', { month: 'long' })
            .toLowerCase()
            .concat('.d')
        const dayDir = `workspaces-${date.toISOString().split('T')[0]}`
        const notesFullPath = path.join(datadir, yearDir, monthDir, dayDir)
        const notesInternalPath = path.join(yearDir, monthDir, dayDir)

        try {
            const filesRaw = await readdir(notesFullPath)
            const files = filesRaw
                .map(f => path.join(notesInternalPath, f))
                .map(encodeURIComponent)
            return [ null, files ]
        } catch (err: any) {
            return [ err, null ]
        }
    }

    function _dateOfNote(note: string): Date {
        try {
            // parse date from note id format:
            // "2023/november.d/workspaces-2023-11-09/workspace-1.md"
            return new Date(
                note.split('/')[2].split('-').slice(1).join('-')
                )
        } catch (err: any) {
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
    }
}
