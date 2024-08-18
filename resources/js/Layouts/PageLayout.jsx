import { Header, Sidebar, Footer } from '@/Components';
import React from 'react';

const Layout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
        <div className="flex flex-1">
            {/* <Sidebar /> */}
            <main className="flex-1">
                {children}
            </main>
        </div>
        <Footer />
    </div>
  );
};

export default Layout;
