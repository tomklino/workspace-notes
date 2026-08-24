export default defineNuxtRouteMiddleware(async () => {
  if (process.client && localStorage.getItem('workspace-notes.local-mode') === 'true') return

  const { getSession } = useAuth()
  const session = await getSession()

  if (!session?.user) {
    return navigateTo('/login')
  }
})
