<template>
    <div>
        <header class="shadow-sm bg-white">
            <nav class="container mx-auto p-4 flex justify-between">
                <ul class="flex gap-4">
                    <NuxtLink class="font-bold" to="/">Workspace Notes</NuxtLink>
                    <li class="block justify-stretch ml-8">
                        <Menu as="div" class="relative inline-block text-left w-24">
                            <div>
                                <MenuButton :class="[searchType === 'days' ? 'bg-[#12b488] text-white font-semibold' : 'bg-white text-gray-900 ring-1 ring-inset ring-gray-300', 'inline-flex w-full justify-center rounded-md px-3 py-2 text-sm']">
                                    {{ lookbackDisplay }}
                                </MenuButton>
                            </div>

                            <transition enter-active-class="transition ease-out duration-100" enter-from-class="transform opacity-0 scale-95" enter-to-class="transform opacity-100 scale-100" leave-active-class="transition ease-in duration-75" leave-from-class="transform opacity-100 scale-100" leave-to-class="transform opacity-0 scale-95">
                            <MenuItems class="absolute right-0 z-10 mt-2 w-24 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                <div class="py-1">
                                <MenuItem v-slot="{ active }">
                                    <div
                                        :class="[active ? 'bg-gray-100 text-gray-900' : 'text-gray-700', 'block px-4 py-2 text-sm cursor-pointer']"
                                        @click="lookbackDisplay = '5 Days' ; days = 5; searchType = 'days'; $notesLoader.refresh()">
                                        5 Days
                                    </div>
                                </MenuItem>
                                <MenuItem v-slot="{ active }">
                                    <div
                                        :class="[active ? 'bg-gray-100 text-gray-900' : 'text-gray-700', 'block px-4 py-2 text-sm cursor-pointer']"
                                        @click="lookbackDisplay = '4 Weeks' ; days = 28; searchType = 'days'; $notesLoader.refresh()">
                                        4 Weeks
                                    </div>
                                </MenuItem>
                                <MenuItem v-slot="{ active }">
                                    <div
                                        :class="[active ? 'bg-gray-100 text-gray-900' : 'text-gray-700', 'block px-4 py-2 text-sm cursor-pointer']"
                                        @click="lookbackDisplay = '3 Months' ; days = 90; searchType = 'days'; $notesLoader.refresh()">
                                        3 Months
                                    </div>
                                </MenuItem>
                                <MenuItem v-slot="{ active }">
                                    <div
                                        :class="[active ? 'bg-gray-100 text-gray-900' : 'text-gray-700', 'block px-4 py-2 text-sm cursor-pointer']"
                                        @click="lookbackDisplay = '1 Year' ; days = 365; searchType = 'days'; $notesLoader.refresh()">
                                        1 Year
                                    </div>
                                </MenuItem>
                                </div>
                            </MenuItems>
                            </transition>
                        </Menu>
                    </li>
                    <li class="min-w-min">
                        <div
                            :class="[searchType === 'bug' ? 'bg-[#12b488] text-white font-semibold' : 'bg-white text-gray-900 ring-1 ring-inset ring-gray-300', 'inline-flex w-18 mx-4 justify-center rounded-md px-3 py-2 text-sm cursor-pointer']"
                            @click="searchType = 'bug'; $notesLoader.refresh()">Search bug
                        </div>
                        <input
                        class="shadow appearance-none border rounded h-8 w-[120px] py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        id="bug" type="text" placeholder="b/"
                        @keydown.enter="searchType = 'bug'; $notesLoader.refresh()"
                        v-model="bug">
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
    import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/vue'

    const searchType = useState("searchType", () => "days") // "days" or "bug"
    const days = useState("days", () => 5)
    const bug = useState("bug")

    let lookbackDisplay = "5 Days"
</script>

<style scoped>
    .router-link-exact-active {
        color: #12b488;
    }
</style>