
import hljs from "highlight.js"
import 'highlight.js/styles/default.css';

export default defineNuxtPlugin((nuxtApp) => {
    hljs.configure({
        languages: ["markdown"]
    })
    nuxtApp.vueApp.directive('highlight', {
        mounted (el) {
        hljs.highlightElement(el)
        }
    })
})
