'use client';
import React, { useState } from 'react';
import Link from 'next/link';

/*theme puede ser transparent o white*/ 

const Navbar = ({ config }: any) => {

  const { backgroundColor, title, titleLogoIcon, titleColor, linksColor} = config
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { name: 'Home', href: '/' },
    { name: 'Productos', href: '/productos' },
    { name: 'Nosotros', href: '/nosotros' },
    { name: 'Contacto', href: '/contacto' },
  ];

  return (
    <nav className={backgroundColor}>
      <div className="container mx-auto py-1 px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <span className={`text-2xl font-bold  ${titleColor}`}>{titleLogoIcon} {title}</span>
          </div>

          {/* Navigation Links - Desktop */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`text-2xl ${linksColor} font-bold hover:text-blue-200 px-3 py-2 text-sm font-medium transition-colors duration-200`}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>

         

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              type="button"
              onClick={() => setIsOpen(!isOpen)}
              className={`text-2xl ${linksColor} font-bold hover:text-blue-200 px-3 py-2 text-sm font-medium transition-colors duration-200`}
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu - Solo visible cuando isOpen es true */}
      {isOpen && (
        <div className="md:hidden">
            {navItems.map((item) => (
            <div className={`px-2 pt-2 pb-3 space-y-1 sm:px-3 ${backgroundColor || "bg-blue-700"}`}>
              <Link
                key={item.name}
                href={item.href}
                className={`block ${linksColor} text-lg font-bold hover:text-blue-200 px-3 py-2 transition-colors duration-200`}
              >
                {item.name}
              </Link>
            </div>
          ))}
          </div>
          
        )}
       
    </nav>
  );
};

export default Navbar;