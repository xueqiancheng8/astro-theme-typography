import { defineMiddleware } from 'astro:middleware'
import { themeConfig } from '~/.config'
import { LANGUAGES } from '~/i18n.ts'

export const onRequest = defineMiddleware(async (context, next) => {
  // === 🔐 Basic Auth Protection ===
  const auth = context.request.headers.get('authorization')
  const username = 'yang'
  const password = 'happy30'
  const expected = 'Basic ' + btoa(`${yuanyang}:${892464}`)

  if (auth !== expected) {
    return new Response('Unauthorized', {
      status: 401,
      headers: {
        'WWW-Authenticate': 'Basic realm="圆羊庄 — Private Site"',
      },
    })
  }

  // === 🌐 Your Existing Localization Logic ===
  const locale = themeConfig.appearance.locale
  const localeTranslate = LANGUAGES[locale]

  function validateKey(key: string): key is keyof typeof localeTranslate {
    return key in localeTranslate
  }

  context.locals.translate = (key, param) => {
    if (!validateKey(key)) return key
    if (!param) return localeTranslate[key]
    return localeTranslate[key].replace('%d', param.toString())
  }

  return next()
})

