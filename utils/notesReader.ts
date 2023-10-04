import * as fs from 'fs'
import path from 'path'

type NotesReader = {
    readNote: (id: string) => Promise<[Error|null, string]>,
    listNotes: () => Promise<string[]>
}

let _notesReader: null|NotesReader = null

export function useNotesReader() {
    if(_notesReader === null) {
        _notesReader = initNotesReader('/home/tomklino/notes/october.d/workspaces-2023-10-03/')
    }
    return _notesReader
}
function initNotesReader(datadir: string): NotesReader {
    async function readNote(id: string): Promise<[Error|null, string]> {
        const [ err, file ] = await readFile(datadir, id)
        if(err) {
            return [ err, "" ]
        }
        return [ null, file ]
    }

    async function listNotes(): Promise<string[]> {
        const [ err, _notes ]= await readDir(datadir)
        if (err || !Array.isArray(_notes)) {
            return []
        }
        return _notes
            .filter(fname => fname.endsWith('.md') || fname.endsWith('.txt'))
            .map(fname => encodeURIComponent(fname))
    }

    return {
        readNote,
        listNotes
    }
}

function readDir(datadir: string): Promise<[Error|null, string[]|null]> {
    return new Promise((resolve) => {
        fs.readdir(datadir, (err, files) => {
            resolve([err, files])
        })
    })
}

function readFile(datadir: string, filePath: string): Promise<[Error|null, string]> {
    return new Promise((resolve) => {
        fs.readFile(path.join(datadir, filePath), 'utf-8', (err, file) => {
            resolve([err, file])
        })
    })
}
