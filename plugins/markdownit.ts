import md from "markdown-it"

export default defineNuxtPlugin(() => {
    const renderer = md()
    return {
        provide: {
            // TODO fix: Doesn't render checkboxes correctly
            mdRenderer: (content: any): string => {
                if(typeof content !== 'string')
                    return ""
                return renderer.render(content)
            }
        }
    }
})
