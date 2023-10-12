<template>
    <div>
        <header class="shadow-sm bg-white">
            <nav class="container mx-auto p-4 flex justify-between">
                <NuxtLink class="font-bold" to="/">Workspace Notes</NuxtLink>
                <ul class="flex gap-4">
                    <!--TODO add input field to take the number of days to look back to-->
                    <label class="block text-gray-700 text-sm font-bold mb-2" for="days">
                        Days (Lookback)
                    </label>
                    <!--<input class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="username" type="text" placeholder="Username">-->
                    <input
                        class="shadow appearance-none border rounded w-14 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        id="days" type="text" placeholder="5"
                        v-model="days">
                    <li class="btn" @click="test">Reload {{ days || 5 }} days</li>
                </ul>
            </nav>
        </header>

        <div class="containter mx-auto p-4">
            <slot />
        </div>
    </div>
</template>

<script setup>
    const days = useState("days", () => 5)
    function test(event) {
        console.log("tests")
    }
</script>

<style scoped>
    .router-link-exact-active {
        color: #12b488;
    }
</style>