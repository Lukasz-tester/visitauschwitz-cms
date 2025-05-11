const MAX_RELOAD_ATTEMPTS = 2 // Limit the number of reloads
const RELOAD_FLAG = 'rsc_reload_attempts'

self.addEventListener('fetch', (event) => {
  event.respondWith(
    (async () => {
      const response = await fetch(event.request)

      // Only check JSON responses and skip non-GET requests
      if (
        event.request.method === 'GET' &&
        response.headers.get('content-type')?.includes('application/json')
      ) {
        const clonedResponse = response.clone()
        const responseText = await clonedResponse.text()

        // 🧐 Check if it's raw RSC JSON
        if (
          response.headers.get('content-type')?.includes('application/json') &&
          /"children":\s*\[|{/.test(responseText)
        ) {
          console.warn('[Service Worker] Detected raw RSC JSON response.')

          //TODO: REMOVE CODE BELOW if sw.js works well, also remove RscIndicator.jsx
          // 📡 Notify the main thread
          self.clients.matchAll().then((clients) => {
            clients.forEach((client) => client.postMessage({ type: 'RSC_DETECTED' }))
          })
          //TODO -removal end

          // 🔍 Check reload attempts to avoid infinite loops
          const attempts = Number(sessionStorage.getItem(RELOAD_FLAG) || 0)

          if (attempts < MAX_RELOAD_ATTEMPTS) {
            sessionStorage.setItem(RELOAD_FLAG, attempts + 1)

            // 📡 Notify the main thread
            self.clients.matchAll().then((clients) => {
              clients.forEach((client) => client.postMessage({ type: 'RELOAD_PAGE' }))
            })
          } else {
            console.warn('[Service Worker] Maximum reload attempts reached.')
          }
        }
      }

      return response
    })(),
  )
})
