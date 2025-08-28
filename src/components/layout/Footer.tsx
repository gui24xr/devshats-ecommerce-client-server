import React from 'react';

const Footer = () => {
  const footerSections = [
    {
      title: 'Empresa',
      links: [
        { name: 'Nosotros', href: '/nosotros' },
        { name: 'Contacto', href: '/contacto' },
        { name: 'Ubicación', href: '/ubicacion' }
      ]
    },
    {
      title: 'Productos',
      links: [
        { name: 'Catálogo', href: '/productos' },
        { name: 'Ofertas', href: '/ofertas' },
        { name: 'Nuevos', href: '/nuevos' }
      ]
    },
    {
      title: 'Soporte',
      links: [
        { name: 'FAQ', href: '/faq' },
        { name: 'Ayuda', href: '/ayuda' },
        { name: 'Garantía', href: '/garantia' }
      ]
    }
  ];

  const socialLinks = [
    { name: 'Facebook', href: '#', icon: 'M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z' },
    { name: 'Instagram', href: '#', icon: 'M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987s11.987-5.367 11.987-11.987C24.004 5.367 18.637.001 12.017.001zM8.449 16.988c-2.458 0-4.467-2.01-4.467-4.467 0-2.458 2.009-4.467 4.467-4.467s4.467 2.009 4.467 4.467c0 2.457-2.009 4.467-4.467 4.467zm7.679 0c-2.458 0-4.467-2.01-4.467-4.467 0-2.458 2.009-4.467 4.467-4.467s4.467 2.009 4.467 4.467c0 2.457-2.009 4.467-4.467 4.467z' },
    { name: 'Twitter', href: '#', icon: 'M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z' }
  ];

  return (
    <footer className="bg-blue-600 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-1">
            <h3 className="text-2xl font-bold mb-4">Mi Empresa</h3>
            <p className="text-blue-200 mb-4">
              Ofrecemos los mejores productos y servicios para nuestros clientes.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  className="text-blue-200 hover:text-white transition-colors duration-200"
                  title={social.name}
                >
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d={social.icon} />
                  </svg>
                </a>
              ))}
            </div>
          </div>

          {/* Footer Sections */}
          {footerSections.map((section) => (
            <div key={section.title}>
              <h4 className="text-lg font-semibold mb-4">{section.title}</h4>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className="text-blue-200 hover:text-white transition-colors duration-200"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-blue-500 mt-8 pt-8 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-blue-200 text-sm">
            © 2025 Mi Empresa. Todos los derechos reservados.
          </p>
          <div className="flex space-x-6 mt-4 sm:mt-0">
            <a href="/privacidad" className="text-blue-200 hover:text-white text-sm transition-colors duration-200">
              Política de Privacidad
            </a>
            <a href="/terminos" className="text-blue-200 hover:text-white text-sm transition-colors duration-200">
              Términos de Uso
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;