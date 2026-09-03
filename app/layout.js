import './globals.css';

export const metadata = {
  verification: { google: 'FNYIdc1V-dZ6sT4v1k6nb1Qa9Dp9yb3zcO472YoQp3U' },
  title: 'MeowShop - Game Top Up Cambodia',
  description: 'MeowShop - Fast and easy game top up in Cambodia. Top up diamonds and game credits quickly and securely.',
  icons: {
    icon: '/imsela_com-removed-20260902_203809.png',
  },
};

export default function RootLayout({ children }) {
  return <html lang="km"><body>{children}</body></html>;
}
