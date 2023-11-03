<template>
    <div class="container p-4 mx-0 my-5 shadow-md rounded-lg bg-white max-w-3xl divide-y">
        <!--TODO display metadata on the note (date, tags, etc.)-->
        <div class="container w-full flex justify-end px-10">
            <div
            class="cursor-pointer mb-2 min-w-fit max-w-fit">
                <label class="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" v-model="viewRaw" class="sr-only peer">
                    <div
                        class="w-8 h-4 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-[#12b488] peer-checked:ring-1"></div>
                    <span class="ml-3 text-sm font-medium text-gray-500 dark:text-gray-300">Raw</span>
                </label>
            </div>
        </div>
        <div
            :class="[viewRaw ? 'font-mono text-slate-700 text-sm' : 'prose prose-a:text-blue-600', 'pt-2']"
            v-html="viewRaw ? displayRaw(data) : $mdRenderer(data)">
        </div>
    </div>
</template>

<script setup>
    import { ref } from 'vue';

    const { noteID } = defineProps(['noteID'])
    const { data } = await useFetch(`/api/notes/${noteID}`)

    let viewRaw = ref(false)

    function displayRaw(data) {
        return data.split('\n').join('<br>')
    }
</script>

<style lang="scss" scoped>

</style>
