import * as fs from 'fs'
import path from 'path'

type ErrorTuple<T> = [Error|null,T|null]

type NotesReader = {
    readNote: (id: string) => Promise<ErrorTuple<string>>,
    listNotes: () => Promise<ErrorTuple<string[]>>
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
        const [ err, file ] = await readFile(datadir, id)
        if(err) {
            return [ err, "" ]
        }
        return [ null, file ]
    }

    async function listNotes(): Promise<ErrorTuple<string[]>> {
        const [ err, _notes ]= await readDir(datadir)
        if (err || !Array.isArray(_notes)) {
            return [ err, null ]
        }
        return [ null, _notes
            .filter(fname => fname.endsWith('.md') || fname.endsWith('.txt'))
            .map(fname => encodeURIComponent(fname)) ]
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
