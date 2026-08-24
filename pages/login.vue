<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50">
    <div class="max-w-md w-full space-y-8">
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Sign in to your account
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          Welcome to Workspace Notes
        </p>
      </div>
      <div class="mt-8 space-y-6">
        <LoginButton />
        <button
          @click="startLocalMode"
          class="w-full px-4 py-2 border border-[#12b488] text-[#0d8b69] rounded-md hover:bg-[#12b488]/10 transition-colors"
        >
          Continue locally
        </button>
        <p class="text-center text-xs text-gray-500">
          Notes stay only in this browser's local storage.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
// Redirect to home if already authenticated
const { status } = useAuth()
const { $localNotes } = useNuxtApp()

const startLocalMode = async () => {
  $localNotes.enable()
  await navigateTo('/')
}

watch(status, (newStatus) => {
  if (newStatus === 'authenticated') {
    navigateTo('/')
  }
}, { immediate: true })
</script>
