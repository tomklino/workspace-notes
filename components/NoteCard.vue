<template>
    <div class="container p-4 mx-0 my-5 shadow-md rounded-lg bg-white max-w-3xl divide-y">
        <ul class="container w-full flex justify-between mb-2">
            <li class="container w-full flex justify-start mb-2 text-slate-700 text-sm">
                {{ new Date(Date.parse(data.ISODateString)).toLocaleDateString('he-IL') }}
            </li>
            <li
            class="cursor-pointer min-w-fit max-w-fit">
                <label class="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" v-model="viewRaw" class="sr-only peer">
                    <div
                        class="w-8 h-4 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-[#12b488] peer-checked:ring-1"></div>
                    <span class="ml-3 text-sm font-medium text-gray-500 dark:text-gray-300">Raw</span>
                </label>
            </li>
            <li
                :class="[copyButtonText === 'Copy' ? '' : 'bg-[#12b488]', 'px-2 mx-2 w-[60px] ring-1 rounded text-center cursor-pointer']"
                @click="copy">
                <label
                    :class="[copyButtonText === 'Copy' ? 'text-slate-700' : 'text-white font-semibold', 'cursor-pointer text-sm']">
                    {{ copyButtonText }}
                </label>
            </li>
        </ul>
        <div v-if="!viewRaw"
            class="prose prose-a:text-blue-600 pt-2"
            v-html="$mdRenderer(data.content)">
        </div>

        <code v-if="viewRaw" v-html="data.content" v-highlight
            class="block whitespace-pre overflow-x-scroll">

        </code>
    </div>
</template>

<script setup>
    import { ref } from 'vue';

    const { noteID } = defineProps(['noteID'])
    const { data } = await useFetch(`/api/notes/${noteID}`)

    let viewRaw = ref(false)
    let copyButtonText = ref("Copy")

    function copy() {
        navigator.clipboard.writeText(data.value.content)
        copyButtonText.value = "Copied!"
        setTimeout(() => { copyButtonText.value = "Copy"}, 5000)
    }
</script>

<style lang="scss" scoped>
.hljs-bullet {
    color: red
}
</style>
