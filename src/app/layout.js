import './globals.css'; 
import Header from './components/Header'; 
import Footer from './components/Footer';

export const metadata = {
  title: 'Free AI Tools',
  description: 'Free AI Tools Platform based on Cloudflare AI',
};

const Layout = ({ children }) => {
  return (
    <html lang="en">
      <body>
        <Header />
        <main>{children}</main> {/* 渲染子页面内容 */}
        <Footer />
      </body>
    </html>
  );
};

export default Layout;
