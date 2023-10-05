<template>
    <div>
        <header class="shadow-sm bg-white">
            <nav class="container mx-auto p-4 flex justify-between">
                <NuxtLink class="font-bold" to="/">Workspace Notes</NuxtLink>
                <ul class="flex gap-4">
                    <!--TODO add input field to take the number of days to look back to-->
                    <li class="btn">Reload</li>
                </ul>
            </nav>
        </header>

        <div class="containter mx-auto p-4">
            <slot />
        </div>
    </div>
</template>

<style scoped>
    .router-link-exact-active {
        color: #12b488;
    }
</style>