import * as fs from 'fs'
import path from 'path'

export default defineEventHandler(async (event) => {
    return await readExampleFile()
})

function readExampleFile() {
    return new Promise((resolve) => {
        fs.readFile(path.join('/tmp/markdown.md'), 'utf-8', (err, file) => {
            resolve(file)
        })
    })
}