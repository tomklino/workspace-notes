import MarkdownIt from "markdown-it"
import { tasklist } from "@mdit/plugin-tasklist"

export default defineNuxtPlugin(() => {
    const md = MarkdownIt()
        // @ts-ignore - the plugin works but the types are not updated to the
        // current version of MarkDownIt
        .use(tasklist, {})
    return {
        provide: {
            // TODO fix: Doesn't render checkboxes correctly
            mdRenderer: (content: any): string => {
                if(typeof content !== 'string')
                    return ""
                return md.render(content)
            }
        }
    }
})
