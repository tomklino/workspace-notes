export default defineNuxtPlugin(() => {
    return {
        provide: {
            titleOf: (content: any): string => {
                let titleLine = content
                    .split('\n')
                    .find((line: string) => line.startsWith("# "))

                if(typeof titleLine !== "string") return "No title"

                return titleLine.replace(/# /, "")
            }
        }
    }
})
