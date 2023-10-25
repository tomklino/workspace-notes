<template>
    <div>
        <header class="shadow-sm bg-white">
            <nav class="container mx-auto p-4 flex justify-between">
                <ul class="flex gap-4">
                    <NuxtLink class="font-bold" to="/">Workspace Notes</NuxtLink>
                    <li class="min-w-min">
                        <!--TODO add input field to take the number of days to look back to-->
                        <label class="text-gray-700 text-sm font-bold w-20 align-middle m-5" for="days">
                            Lookback:
                        </label>
                        <!--<input class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="username" type="text" placeholder="Username">-->
                        <input
                        class="shadow appearance-none border rounded h-8 w-14 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        id="days" type="text" placeholder="5"
                        v-model="days">
                        <div class="btn inline-block ml-2" @click="searchType = 'days'; $notesLoader.refresh()">Reload {{ days || 5 }} days</div>
                    </li >
                    <li class="min-w-min">
                        <!--TODO add input field to take the number of days to look back to-->
                        <label class="text-gray-700 text-sm font-bold w-20 align-middle m-5" for="days">
                            Bug:
                        </label>
                        <!--<input class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="username" type="text" placeholder="Username">-->
                        <input
                        class="shadow appearance-none border rounded h-8 w-16 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        id="bug" type="text" placeholder="b/"
                        v-model="bug">
                        <div class="btn inline-block ml-2" @click="searchType = 'bug'; $notesLoader.refresh()">Search {{ bug || "bug" }}</div>
                    </li>
                </ul>
            </nav>
        </header>

        <div class="containter mx-auto p-4">
            <slot />
        </div>
    </div>
</template>

<script setup>
    const searchType = useState("searchType", () => "days") // "days" or "bug"
    const days = useState("days", () => 5)
    const bug = useState("bug")
</script>

<style scoped>
    .router-link-exact-active {
        color: #12b488;
    }
</style>