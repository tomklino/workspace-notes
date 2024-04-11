<template>
    <div>
        <ClientOnly>
            <CodeEditor :languages="[['js']]"></CodeEditor>
        </ClientOnly>
    </div>
</template>

<script>
import CodeEditor from "simple-code-editor";
import { HighlightJS } from "highlight.js";

export default {
    name: 'About',
    components: {
        HighlightJS,
        CodeEditor
    }
}
</script>

<style lang="scss" scoped>
    h2 {
        margin-bottom: 20px;
        font-size: 36px
    }
    p {
        margin: 20px
    }
</style>