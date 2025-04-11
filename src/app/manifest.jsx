export default function manifest() {
    return {
      name: "darel's Project",
      short_name: 'dP',
      description: "darel's Project Web App",
      lang: "en",
      start_url: '/',
      display: 'standalone',
      background_color: '#fff',
      theme_color: '#fff',
      icons: [
        {
          src: '/favicon.ico',
          sizes: 'any',
          type: 'image/x-icon',
        },
      ],
    }
  }