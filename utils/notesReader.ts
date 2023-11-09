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
        // TODO This is insecure - replace this with js logic to iterate over files
        const command = "grep -rI '^Bug: " + bug + "' | cut -d':' -f1"
        return new Promise((resolve) => {
            exec(command, { cwd: datadir, shell: '/bin/bash' }, (err, stdout) => {
                if(err) {
                    console.log(err)
                    return resolve([ err, null ])
                }
                return resolve( [null,
                    stdout
                        .trim()
                        .split('\n')
                        .map(encodeURIComponent)
                        .filter(str => str.length > 0)
                ])
            })
        })
    }

    async function listNotes(days: number): Promise<ErrorTuple<string[]>> {
        if(isNaN(days)) days = 5
        const foundNotes: Set<string> = new Set()
        while(days >= 0) {
            // TODO: sequential, could be parrallel
            let lookupDate = _todayMinusDays(days--)
            let [ err, notes ] = await _getNotesForDate(lookupDate)
            if(err) {
                if(err.message.startsWith('ENOENT')) continue
                return [ err, null ]
            }
            if(notes === null) continue

            // TODO: sequential, could be parrallel
            notes.forEach(async (note) => {
                if(!await _isNoteEmpty(note))
                    foundNotes.add(note)
            })
        }

        const results = Array.from(foundNotes)
            .sort((a, b) => { return _dateOfNote(a) < _dateOfNote(b) ? -1 : 1})
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
        bugNotes
    }
}
