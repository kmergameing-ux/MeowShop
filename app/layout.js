import './globals.css';

export const metadata = {
  title: 'MeowShop',
  description: 'Fast Cambodia game top-up shop',
  icons: {
    icon: '/imsela_com-removed-20260902_203809.png',
  },
};

export default function RootLayout({ children }) {
  return <html lang="km"><body>{children}</body></html>;
}
