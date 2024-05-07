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

    function copy() {
        navigator.clipboard.writeText(data.value.content)
        copyButtonText.value = "Copied!"
        setTimeout(() => { copyButtonText.value = "Copy"}, 5000)
    }
</script>

<style lang="scss" scoped>

</style>
