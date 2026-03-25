/* eslint-env browser */
const ALLOWED_TYPES = new Set(['success', 'error', 'info', 'warning'])

// Vertical gap between stacked toasts (px). Default `.toastle` margin-bottom is 0 so this is the only default gap.
const SPACING = 9

const REGISTRY_KEY = Symbol.for('toastle.registry.v1')

/**
 * @typedef {object} ToastleRegistry
 * @property {1} apiVersion
 * @property {Map<string, HTMLElement[]>} stacks
 */

/**
 * @returns {ToastleRegistry | null}
 */
function getOrCreateRegistry () {
  if (typeof globalThis === 'undefined') {
    return null
  }
  let reg = globalThis[REGISTRY_KEY]
  if (!reg || typeof reg !== 'object' || reg.apiVersion !== 1 || !(reg.stacks instanceof Map)) {
    reg = { apiVersion: 1, stacks: new Map() }
    globalThis[REGISTRY_KEY] = reg
  }
  return reg
}

/**
 * @param {number} top
 */
function registryKeyForTop (top) {
  return String(top)
}

/**
 * @param {number} value
 * @param {number} fallback
 * @param {number} min
 * @param {number} max
 */
function clampFiniteNumber (value, fallback, min, max) {
  const n = Number(value)
  if (!Number.isFinite(n)) {
    return fallback
  }
  return Math.min(max, Math.max(min, n))
}

/** @param {HTMLElement} el */
function verticalFootprint (el) {
  if (!el?.getBoundingClientRect) {
    return 0
  }
  const rect = el.getBoundingClientRect()
  const cs = getComputedStyle(el)
  const marginBottom = parseFloat(cs.marginBottom) || 0
  return rect.height + marginBottom
}

/**
 * @param {HTMLElement[]} toasts
 * @param {number} baseTop
 * @param {number} gap
 */
function applyStackPositions (toasts, baseTop, gap) {
  let y = baseTop
  for (const toast of toasts) {
    toast.style.top = `${y}px`
    const footprint = verticalFootprint(toast) || 40
    y += footprint + gap
  }
}

const Toastle = rawOptions => {
  if (typeof document === 'undefined' || !document.body) {
    return
  }

  const reg = getOrCreateRegistry()
  if (!reg) {
    return
  }

  const options =
    rawOptions !== null && typeof rawOptions === 'object' ? rawOptions : {}

  const {
    text: textRaw = '',
    duration: durationRaw = 3000,
    type: typeRaw = 'success',
    top: topRaw = 40
  } = options

  const text = String(textRaw ?? '')
  const duration = clampFiniteNumber(durationRaw, 3000, 0, 86400000)
  const top = clampFiniteNumber(topRaw, 40, -10000, 10000)
  const type = ALLOWED_TYPES.has(typeRaw) ? typeRaw : 'success'
  const stackKey = registryKeyForTop(top)

  let activeToasts = reg.stacks.get(stackKey)
  if (!activeToasts) {
    activeToasts = []
    reg.stacks.set(stackKey, activeToasts)
  }

  const notice = document.createElement('div')
  notice.className = 'toastle'
  notice.classList.add(`toastle-${type}`)
  notice.textContent = text

  notice.setAttribute('role', 'status')
  notice.setAttribute('aria-live', 'polite')
  notice.setAttribute('aria-atomic', 'true')
  notice.setAttribute('aria-relevant', 'additions')

  notice.style.position = 'fixed'
  notice.style.left = '50%'
  notice.style.transform = 'translateX(-50%)'
  notice.style.opacity = '0'
  notice.style.transition = 'opacity 0.5s ease, top 0.3s ease'

  document.body.appendChild(notice)
  activeToasts.push(notice)

  const reflowStack = () => {
    applyStackPositions(activeToasts, top, SPACING)
  }

  reflowStack()
  requestAnimationFrame(reflowStack)

  setTimeout(() => {
    notice.style.opacity = '1'
  }, 100)

  setTimeout(() => {
    notice.style.opacity = '0'

    setTimeout(() => {
      const index = activeToasts.indexOf(notice)
      if (index > -1) {
        activeToasts.splice(index, 1)
      }

      if (activeToasts.length === 0) {
        reg.stacks.delete(stackKey)
      } else {
        reflowStack()
      }

      notice.remove()
    }, 500)
  }, duration)
}

export default Toastle
