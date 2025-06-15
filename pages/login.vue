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
      </div>
    </div>
  </div>
</template>

<script setup>
// Redirect to home if already authenticated
const { status } = useAuth()

watch(status, (newStatus) => {
  if (newStatus === 'authenticated') {
    navigateTo('/')
  }
}, { immediate: true })
</script>
