import { Header, Sidebar, Footer } from '@/Components';
import React from 'react';

const Layout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
        <Header />
        <div className="flex flex-1">
            {/* <Sidebar /> */}
            <main className="flex-1 lg:p-4">
                {children}
            </main>
        </div>
        <Footer />
    </div>
  );
};

export default Layout;
