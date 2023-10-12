import { exec } from 'child_process'
import * as fs from 'fs'
import path from 'path'

type ErrorTuple<T> = [Error|null,T|null]

type NotesReader = {
    readNote: (id: string) => Promise<ErrorTuple<string>>,
    listNotes: (days: number) => Promise<ErrorTuple<string[]>>
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
            return [ err, null ]
        }
        return [ null, file ]
    }

    async function listNotes(days: number): Promise<ErrorTuple<string[]>> {
        if(isNaN(days)) days = 5
        // TODO This is insecure - replace this with js logic to read files newer than `days` old, ordered by date
        const command = "find -daystart -mtime " + `-${days}` + " -type f \\\( -name '*.txt' -o -name '*.md' \\\) -not \\\( -empty \\\) -printf \"%T@ %p\\\\n\"| sort -rn | awk '{ print $2 }'"
        return new Promise((resolve) => {
            exec(command, { cwd: datadir, shell: '/bin/bash' }, (err, stdout) => {
                if(err) {
                    console.log(err)
                    return resolve ([ err, null ])
                }
                return resolve ([ null,
                    stdout.trim().split('\n').map(encodeURIComponent) ])
            })
        })
        return [ null, null ]
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
