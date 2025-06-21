<template>
  <div>
    <div v-if="status === 'loading'" class="flex items-center gap-2 px-4 py-2">
      <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
      <span>Loading...</span>
    </div>

    <div v-else-if="status === 'authenticated'" class="relative flex items-center gap-4">
      <div
        @click="toggleDropdown"
        class="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
        ref="userInfo"
      >
        <img
          v-if="data?.user?.image"
          :src="data.user.image"
          :alt="data.user.name || 'User'"
          class="w-8 h-8 rounded-full"
        >
        <span class="font-medium hidden lg:block">{{ data?.user?.name }}</span>
      </div>

      <!-- Floating dropdown -->
      <div
        v-if="showDropdown"
        class="absolute top-full right-0 mt-2 bg-white border border-gray-200 rounded-md shadow-lg z-50 py-1 min-w-[120px]"
        ref="dropdown"
      >
        <button
          @click="handleSignOut"
          class="w-full px-4 py-2 text-left text-red-600 hover:bg-red-50 transition-colors"
        >
          Sign Out
        </button>
      </div>
    </div>

    <button
      v-else
      @click="signIn('google')"
      class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2"
    >
      <svg class="w-5 h-5" viewBox="0 0 24 24">
        <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
        <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
        <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
        <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
      </svg>
      Sign in with Google
    </button>
  </div>
</template>

<script setup>
const { data, status, signIn, signOut } = useAuth()

const showDropdown = ref(false)
const userInfo = ref(null)
const dropdown = ref(null)

const toggleDropdown = () => {
  showDropdown.value = !showDropdown.value
}

const handleSignOut = () => {
  showDropdown.value = false
  signOut()
}

// Handle outside clicks
const handleClickOutside = (event) => {
  if (showDropdown.value) {
    const userInfoEl = userInfo.value
    const dropdownEl = dropdown.value

    if (userInfoEl && dropdownEl &&
        !userInfoEl.contains(event.target) &&
        !dropdownEl.contains(event.target)) {
      showDropdown.value = false
    }
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>
