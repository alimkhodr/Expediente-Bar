/* eslint-disable @typescript-eslint/no-explicit-any */
export default defineNuxtPlugin(() => {
  if (import.meta.client && process.env.NODE_ENV === 'production') {
    // Initialize Microsoft Clarity using the official script method
    (function (c: any, l: any, a: any, r: any, i: any, t: any, y: any) {
      c[a] = c[a] || function (...args: any[]) {
        (c[a].q = c[a].q || []).push(args)
      }
      t = l.createElement(r)
      t.async = 1
      t.src = 'https://www.clarity.ms/tag/' + i
      y = l.getElementsByTagName(r)[0]
      y.parentNode.insertBefore(t, y)
    })(window, document, 'clarity', 'script', 't8ownucnt6', undefined, undefined)
  }
})
