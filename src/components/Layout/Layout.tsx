import React from 'react';
import Header from './Header';
import Footer from './Footer';
import { BaseComponentProps } from '../../types';

/**
 * Main Layout Component
 * Provides consistent header, footer, and main content area
 */
interface LayoutProps extends BaseComponentProps {
  showHeader?: boolean;
  showFooter?: boolean;
}

function Layout({ 
  children, 
  className = '', 
  showHeader = true, 
  showFooter = true 
}: LayoutProps) {
  return (
    <div className={`min-h-screen flex flex-col ${className}`}>
      {showHeader && <Header />}
      
      <main className="flex-1">
        {children}
      </main>
      
      {showFooter && <Footer />}
    </div>
  );
}

export default Layout;