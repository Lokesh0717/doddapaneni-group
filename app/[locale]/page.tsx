"use client";

import { Link } from '@/i18n/routing';
import Image from 'next/image';
import { ArrowRight, CheckCircle, TrendingUp, Shield, Globe } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTranslations, useLocale } from 'next-intl';
import ContentPage from '@/components/ContentPage';

export default function Home() {
  const locale = useLocale();
  const t = useTranslations('Home');
  
  const services = [
    {
      title: t('servicesList.ecommerce.title'),
      description: t('servicesList.ecommerce.description')
    },
    {
      title: t('servicesList.software.title'),
      description: t('servicesList.software.description')
    },
    {
      title: t('servicesList.digitalMarketing.title'),
      description: t('servicesList.digitalMarketing.description')
    },
    {
      title: t('servicesList.healthcare.title'),
      description: t('servicesList.healthcare.description')
    },
    {
      title: t('servicesList.construction.title'),
      description: t('servicesList.construction.description')
    },
    {
      title: t('servicesList.importExport.title'),
      description: t('servicesList.importExport.description')
    },
    {
      title: t('servicesList.food.title'),
      description: t('servicesList.food.description')
    },
    {
      title: t('servicesList.education.title'),
      description: t('servicesList.education.description')
    },
    {
      title: t('servicesList.logistics.title'),
      description: t('servicesList.logistics.description')
    },
    {
      title: t('servicesList.media.title'),
      description: t('servicesList.media.description')
    },
    {
      title: t('servicesList.manufacturing.title'),
      description: t('servicesList.manufacturing.description')
    },
    {
      title: t('servicesList.staffing.title'),
      description: t('servicesList.staffing.description')
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <ContentPage pageKey="home" locale={locale}>
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-slate-900 text-white pt-32 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80"
            alt="Corporate Architecture"
            fill
            className="object-cover opacity-50"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900/95 via-slate-900/80 to-slate-900/90"></div>
          <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="lg:w-3/4"
          >
            <div className="inline-block px-4 py-1.5 mb-6 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-300 font-medium text-sm">
              {t('innovating')}
            </div>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 tracking-tight flex flex-col gap-4">
              <span>
                {t.rich('heroTitleLine1', {
                  highlight: (chunks) => <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">{chunks}</span>
                })}
              </span>
              {t('heroTitleLine2') ? (
                <span>
                  {t.rich('heroTitleLine2', {
                    highlight: (chunks) => <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">{chunks}</span>
                  })}
                </span>
              ) : null}
            </h1>
            <p className="text-xl md:text-2xl text-slate-300 mb-8 leading-relaxed max-w-2xl">
              {t('heroSubtitle')}
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/services" className="bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-blue-500 transition-all shadow-lg shadow-blue-900/50 hover:shadow-blue-900/70 flex items-center">
                {t('exploreServices')} <ArrowRight className="ml-2" size={20} />
              </Link>
              <Link href="/about" className="bg-white/10 backdrop-blur-sm border border-white/20 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white/20 transition-all">
                {t('learnAboutUs')}
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Intro Stats/Features */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100"
            >
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 mb-6">
                <Globe size={24} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">{t('globalReach')}</h3>
              <p className="text-slate-600 leading-relaxed">{t('globalReachDesc')}</p>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100"
            >
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 mb-6">
                <TrendingUp size={24} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">{t('sustainableGrowth')}</h3>
              <p className="text-slate-600 leading-relaxed">{t('sustainableGrowthDesc')}</p>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100"
            >
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 mb-6">
                <Shield size={24} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">{t('trustedPartner')}</h3>
              <p className="text-slate-600 leading-relaxed">{t('trustedPartnerDesc')}</p>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
             <motion.div 
               initial={{ opacity: 0, x: -30 }}
               whileInView={{ opacity: 1, x: 0 }}
               viewport={{ once: true }}
               transition={{ duration: 0.6 }}
               className="relative h-[400px] rounded-2xl overflow-hidden shadow-xl order-2 lg:order-1"
             >
                <Image 
                  src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80"
                  alt="Team collaboration"
                  fill
                  className="object-cover"
                />
             </motion.div>
             
             <motion.div 
               initial={{ opacity: 0, x: 30 }}
               whileInView={{ opacity: 1, x: 0 }}
               viewport={{ once: true }}
               transition={{ duration: 0.6 }}
               className="order-1 lg:order-2"
             >
                <h2 className="text-sm text-blue-600 font-bold tracking-widest uppercase mb-3">{t('whoWeAre')}</h2>
                <p className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                  {t('buildingSustainable')}
                </p>
                <p className="text-xl text-slate-600 leading-relaxed mb-6">
                  {t('description')}
                </p>
                <Link href="/about" className="inline-flex items-center text-blue-600 font-bold hover:text-blue-800 transition-colors">
                  {t('readStory')} <ArrowRight className="ml-2" size={20} />
                </Link>
             </motion.div>
          </div>
        </div>
      </section>

      {/* Services Preview */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-6">
            <div className="max-w-2xl">
              <h2 className="text-4xl font-bold text-slate-900 mb-4">{t('ourServices')}</h2>
              <p className="text-xl text-slate-600">{t('diverseSolutions')}</p>
            </div>
            <Link href="/services" className="hidden md:flex items-center text-blue-600 font-bold hover:text-blue-800 transition-colors group">
              {t('viewAllServices')} <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
            </Link>
          </div>

          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {services.slice(0, 6).map((service, index) => (
              <motion.div 
                key={index} 
                variants={itemVariants}
                className="group bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                    <CheckCircle size={24} />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-blue-600 transition-colors">{service.title}</h3>
                <p className="text-slate-600 mb-6 leading-relaxed line-clamp-3">{service.description}</p>
                <Link href="/services" className="inline-flex items-center text-blue-600 font-semibold hover:text-blue-800 transition-colors">
                  {t('learnMore')} <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
              </motion.div>
            ))}
          </motion.div>
          
          <div className="mt-12 text-center md:hidden">
             <Link href="/services" className="inline-flex items-center text-blue-600 font-bold hover:text-blue-800">
              {t('viewAllServices')} <ArrowRight className="ml-2" size={20} />
            </Link>
          </div>
        </div>
      </section>

      {/* Group Companies Section - Marquee (scrolling logos) */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-slate-900 mb-4">{t('ourGroupCompanies')}</h3>
            <p className="text-slate-600">{t('drivingExcellence')}</p>
          </div>
          <div className="relative overflow-hidden py-6 bg-white/50 rounded-2xl border border-slate-100">
            <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-slate-50 to-transparent z-10" />
            <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-slate-50 to-transparent z-10" />
            <div className="flex">
              <motion.div
                className="flex gap-16 md:gap-24 items-center flex-nowrap pr-16 md:pr-24"
                animate={{ x: '-50%' }}
                transition={{ repeat: Infinity, ease: 'linear', duration: 30 }}
              >
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="flex gap-16 md:gap-24 items-center shrink-0">
                    {[
                      { src: '/dlsin.jpg', link: '/companies/dlsin' },
                      { src: '/janathamirror.jpeg', link: '/companies/janatha-mirror' },
                      { src: '/dealsmedi.png', link: '/companies/dealsmedi' },
                    ].map((logo, index) => (
                      <Link
                        key={`${i}-${index}`}
                        href={logo.link}
                        className="relative w-40 h-24 flex-shrink-0 transition-all duration-300 hover:scale-110"
                      >
                        <Image
                          src={logo.src}
                          alt={`Group Company Logo ${index + 1}`}
                          fill
                          className="object-contain"
                        />
                      </Link>
                    ))}
                  </div>
                ))}
              </motion.div>
            </div>
          </div>
        </div>
      </section>

    </div>
    </ContentPage>
  );
}
