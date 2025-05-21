import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [ '/game/play/'], // プレイ中の画面はインデックス不要
    },
    sitemap: 'https://acro-attack.wakaport.com',
  }
}
