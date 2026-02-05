import {Link} from '@/i18n/routing';
import {useTranslations} from 'next-intl';
import Image from 'next/image';

export default function Footer() {
  const t = useTranslations('Footer');
  const navT = useTranslations('Navbar');
  const currentYear = new Date().getFullYear();
  const companyName = "Doddapaneni Group";
  const contact = {
    email: "info@doddapanenigroup.net",
    locations: [
      {
        phone: "+91 814 224 6666",
        address: "Plot No 22,23,41,42 & 43, Sri Krishna Avenue, Venkataramana Colony, Gokul Plots, Vasanth Nagar, Ranga Reddy District, 500085"
      },
      {
        phone: "+1 (352)230-8586",
        address: "5052 SW 40th PL, Ocala, Florida, 34474"
      }
    ]
  };

  return (
    <footer className="bg-blue-900 text-white pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="mb-6">
              <Image 
                src="/logo.png" 
                alt={companyName} 
                width={280} 
                height={112} 
                className="h-16 w-auto object-contain"
              />
            </div>
            <p className="text-blue-400 text-sm leading-relaxed">
              {t('tagline')}
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">{t('quickLinks')}</h3>
            <ul className="space-y-2">
              <li><Link href="/" className="text-blue-300 hover:text-white text-sm">{navT('home')}</Link></li>
              <li><Link href="/about" className="text-blue-300 hover:text-white text-sm">{navT('about')}</Link></li>
              <li><Link href="/services" className="text-blue-300 hover:text-white text-sm">{navT('services')}</Link></li>
              <li><Link href="/contact" className="text-blue-300 hover:text-white text-sm">{navT('contact')}</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">{t('contact')}</h3>
            <div className="text-blue-400 text-sm space-y-6">
              {contact.locations.map((location, index) => (
                <div key={index} className="space-y-3">
                  <p>
                    <span className="text-white font-medium mr-2">{t('phone')}:</span>
                    <a href={`tel:${location.phone.replace(/[^\d+]/g, '')}`} className="hover:text-white transition-colors">
                      {location.phone}
                    </a>
                  </p>
                  <div className="flex items-start">
                    <span className="text-white font-medium mr-2 shrink-0">{t('address')}:</span>
                    <a 
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location.address)}`}
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="hover:text-white transition-colors"
                    >
                      {location.address}
                    </a>
                  </div>
                </div>
              ))}
              {contact.email && (
                <p>
                  <span className="text-white font-medium mr-2">{t('email')}:</span>
                  <a href={`mailto:${contact.email}`} className="hover:text-white transition-colors">
                    {contact.email}
                  </a>
                </p>
              )}
            </div>
          </div>
        </div>
        <div className="border-t border-blue-800 mt-8 pt-8 text-center text-blue-400 text-sm">
          <p>&copy; {currentYear} {companyName}. {t('rights')}</p>
        </div>
      </div>
    </footer>
  );
}
