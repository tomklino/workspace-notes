<template>
    <div :class="[noteActive ? 'bg-white' : 'bg-slate-200 hover:cursor-pointer', 'flex flex-col p-4 mx-0 shadow-md rounded-lg divide-y']">
        <ul class="w-full flex justify-between mb-2">
            <li class="flex justify-start mb-2 text-slate-700 text-sm">
                {{ new Date(Date.parse(data.ISODateString)).toLocaleDateString('he-IL') }}
            </li>
            <li class="w-full justify-start ml-2">{{ $titleOf(data.content) }}</li>
            <li :class="[noteActive ? '': 'hidden', 'flex']">
                <div
                class="cursor-pointer min-w-fit max-w-fit">
                    <label class="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" v-model="viewRaw" class="sr-only peer">
                        <div
                            class="w-8 h-4 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-[#12b488] peer-checked:ring-1"></div>
                        <span class="ml-3 text-sm font-medium text-gray-500 dark:text-gray-300">Raw</span>
                    </label>
                </div>
                <div
                    :class="[copyButtonText === 'Copy' ? '' : 'bg-[#12b488]', 'px-2 mx-2 w-[60px] ring-1 rounded text-center cursor-pointer']"
                    @click="copy">
                    <label
                        :class="[copyButtonText === 'Copy' ? 'text-slate-700' : 'text-white font-semibold', 'cursor-pointer text-sm']">
                        {{ copyButtonText }}
                    </label>
                </div>
            </li>
        </ul>
        <div v-if="!viewRaw"
            class="prose max-w-none prose-a:text-blue-600 pt-2"
            v-html="$mdRenderer(data.content)">
        </div>

        <code v-if="viewRaw" v-highlight
            :contenteditable=editable
            @input="updateContent"
            class="block whitespace-pre overflow-x-scroll flex-1">
            {{ data.content }}

        </code>
    </div>
</template>

<script setup>
    import { ref, render } from 'vue';
    import hljs from 'highlight.js'

    const { $mdRenderer, $titleOf } = useNuxtApp()

    const { noteID, startRaw, noteActive } = defineProps(
        {
            noteID: String,
            startRaw: Boolean,
            noteActive: {
                type: Boolean,
                default: true
            },
            editable: {
                type: Boolean,
                default: false
            }
        })
    const { data } = await useFetch(`/api/notes/${noteID}`)

    let viewRaw = ref(startRaw ? true : false)
    let copyButtonText = ref("Copy")
    let inactivityTimer;

    function updateContent(event) {
        data.value.content = event.target.textContent;

        let selection = getSelection(event.target)
        let highlightedContent = hljs.highlight(
            event.target.textContent,
            { language: "md" }).value

        if(event.target.innerHTML != highlightedContent.replaceAll("&#x27;", '\'').replaceAll("&quot;", '"')) {
            event.target.innerHTML = highlightedContent
            restoreSelection(event.target, ...selection)
        }

        if(inactivityTimer) clearTimeout(inactivityTimer)
        inactivityTimer = setTimeout(async () => {
            const response = await $fetch(`/api/notes/${noteID}`, {
                method: 'POST',
                body: {
                    content: data.value.content
                }
            })

            inactivityTimer = undefined
        }, 2000)
    }

    function getSelection(targetElement) {
        const sel = window.getSelection();
        const textSegments = getTextSegments(targetElement);
        let anchorIndex = null;
        let focusIndex = null;
        let currentIndex = 0;
        textSegments.forEach(({text, node}) => {
            if (node === sel.anchorNode) {
                anchorIndex = currentIndex + sel.anchorOffset;
            }
            if (node === sel.focusNode) {
                focusIndex = currentIndex + sel.focusOffset;
            }
            currentIndex += text.length;
        });

        return [ anchorIndex, focusIndex ]
    }

    function restoreSelection(targetElement, absoluteAnchorIndex, absoluteFocusIndex) {
        const sel = window.getSelection();
        const textSegments = getTextSegments(targetElement);
        let anchorNode = targetElement;
        let anchorIndex = 0;
        let focusNode = targetElement;
        let focusIndex = 0;
        let currentIndex = 0;
        textSegments.forEach(({text, node}) => {
            const startIndexOfNode = currentIndex;
            const endIndexOfNode = startIndexOfNode + text.length;
            if (startIndexOfNode <= absoluteAnchorIndex && absoluteAnchorIndex <= endIndexOfNode) {
                anchorNode = node;
                anchorIndex = absoluteAnchorIndex - startIndexOfNode;
            }
            if (startIndexOfNode <= absoluteFocusIndex && absoluteFocusIndex <= endIndexOfNode) {
                focusNode = node;
                focusIndex = absoluteFocusIndex - startIndexOfNode;
            }
            currentIndex += text.length;
        });
        sel.setBaseAndExtent(anchorNode, anchorIndex, focusNode, focusIndex);
    }

    function getTextSegments(element) {
        const textSegments = [];
        Array.from(element.childNodes).forEach((node) => {
            switch(node.nodeType) {
                case Node.TEXT_NODE:
                    textSegments.push({text: node.nodeValue, node});
                    break;

                case Node.ELEMENT_NODE:
                    textSegments.splice(textSegments.length, 0, ...(getTextSegments(node)));
                    break;

                default:
                    throw new Error(`Unexpected node type: ${node.nodeType}`);
            }
        });
        return textSegments;
    }

    function copy() {
        navigator.clipboard.writeText(data.value.content)
        copyButtonText.value = "Copied!"
        setTimeout(() => { copyButtonText.value = "Copy"}, 5000)
    }
</script>

<style lang="scss" scoped>

</style>
