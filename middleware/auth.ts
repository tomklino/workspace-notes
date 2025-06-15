export default defineNuxtRouteMiddleware((to) => {
  const { status } = useAuth()

  if (status.value === 'unauthenticated') {
    return navigateTo('/login')
  }
})
