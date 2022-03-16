import * as polyfill from 'abort-controller'

export function polyfillAbortController() {
  console.log('before', globalThis.AbortController)
  if (!globalThis.AbortController) {
    globalThis.AbortController = polyfill.AbortController
  }
  console.log('after', globalThis.AbortController)
  
  if (!globalThis.AbortSignal) {
    globalThis.AbortSignal = polyfill.AbortSignal
  }
}
