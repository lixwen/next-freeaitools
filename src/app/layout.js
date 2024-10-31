import './globals.css'; 
import Header from './components/Header'; 
import Footer from './components/Footer';
import Script from 'next/script';

export const metadata = {
  title: 'Free AI Tools',
  description: 'Free AI Tools Platform based on Cloudflare AI',
};

const Layout = ({ children }) => {
  return (
    <html lang="en">
      <body>
        <Header />
        <main>{children}</main>
        <Footer />
        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-YE2FH6DW8Y"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-YE2FH6DW8Y');
          `}
        </Script>
      </body>
    </html>
  );
};

export default Layout;
