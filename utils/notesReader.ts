import * as fs from 'fs'
import path from 'path'

export default function initNotesReader(datadir: string) {
    async function readNote(id: string) {
        return await readFile(datadir, id)
    }

    async function listNotes(): Promise<Array<string>> {
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

function readDir(datadir: string): Promise<[Error|null, Array<string>|null]> {
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
