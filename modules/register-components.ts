import { addComponent
  , defineNuxtModule
   } from '@nuxt/kit'
import { hljs } from "highlight.js";

export default defineNuxtModule({
  setup() {
    addComponent({
      name: 'CodeEditor',
      export: 'CodeEditor',
      filePath: 'simple-code-editor'
    })
  }
})
