"use client";

import { Target, Eye, Award } from 'lucide-react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';

export default function About() {
  const t = useTranslations('About');

  const companies = [
    { name: "DG Tech Solutions", industry: t('industries.it') },
    { name: "DG Infra & Realty", industry: t('industries.construction') },
    { name: "DG Global Trade", industry: t('industries.importExport') },
    { name: "DG Health", industry: t('industries.healthcare') },
    { name: "DG Logistics", industry: t('industries.logistics') },
    { name: "DG Manufacturing", industry: t('industries.manufacturing') }
  ];

  const values = [
    t('valuesList.integrity'),
    t('valuesList.transparency'),
    t('valuesList.customerFocus'),
    t('valuesList.innovation'),
    t('valuesList.operationalExcellence'),
    t('valuesList.sustainableGrowth')
  ];

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Header */}
      <section className="relative bg-slate-900 text-white py-32 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 z-0">
            <Image
                src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80"
                alt="Modern Office"
                fill
                className="object-cover opacity-20"
                priority
            />
            <div className="absolute inset-0 bg-gradient-to-br from-slate-900/95 via-blue-900/80 to-slate-900/90"></div>
            <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
        </div>
        
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 max-w-7xl mx-auto text-center"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-6">{t('headerTitle')}</h1>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
            {t('headerSubtitle')}
          </p>
        </motion.div>
      </section>

      {/* Intro */}
      <div className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="lg:grid lg:grid-cols-2 lg:gap-10 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl font-bold text-slate-900 mb-6">{t('introTitle')}</h2>
              <p className="text-slate-600 text-lg leading-relaxed mb-6">
                {t('introText')}
              </p>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="mt-6 lg:mt-0 relative"
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-blue-600 to-cyan-400 rounded-2xl transform rotate-3 scale-105 opacity-20 blur-lg"></div>
              <div className="relative rounded-2xl overflow-hidden shadow-xl border border-slate-100 h-80">
                 <Image
                    src="https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80"
                    alt="Strategic Meeting"
                    fill
                    className="object-cover"
                 />
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Vision & Mission */}
      <div className="py-12 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="bg-slate-50 p-8 rounded-3xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center mb-6">
                <div className="bg-blue-100 p-4 rounded-2xl mr-4 text-blue-600">
                  <Eye size={32} />
                </div>
                <h3 className="text-2xl font-bold text-slate-900">{t('visionTitle')}</h3>
              </div>
              <p className="text-slate-600 text-lg leading-relaxed">
                {t('visionText')}
              </p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-slate-50 p-8 rounded-3xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center mb-6">
                <div className="bg-blue-100 p-4 rounded-2xl mr-4 text-blue-600">
                  <Target size={32} />
                </div>
                <h3 className="text-2xl font-bold text-slate-900">{t('missionTitle')}</h3>
              </div>
              <p className="text-slate-600 text-lg leading-relaxed">
                {t('missionText')}
              </p>
            </motion.div>
          </div>

          {/* Group Companies Grid */}
          <div className="pt-8 border-t border-slate-100">
            <div className="text-center mb-6">
               <h3 className="text-2xl font-bold text-slate-900 mb-4">{t('companiesTitle')}</h3>
               <p className="text-slate-600">{t('companiesSubtitle')}</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {companies.map((company, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-slate-50 p-6 rounded-xl border border-slate-200 flex flex-col items-center justify-center text-center hover:bg-white hover:shadow-md transition-all duration-300"
                >
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-sm mb-3">
                    {company.name.substring(0, 2)}
                  </div>
                  <h4 className="font-bold text-slate-800">{company.name}</h4>
                  <span className="text-sm text-slate-500 mt-1">{company.industry}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Core Values */}
      <div className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-8"
          >
             <h2 className="text-3xl font-bold text-slate-900 mb-4">{t('valuesTitle')}</h2>
             <p className="text-xl text-slate-600 max-w-2xl mx-auto">{t('valuesSubtitle')}</p>
          </motion.div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {values.map((value, index) => (
              <motion.div 
                key={index} 
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center p-6 bg-white rounded-xl shadow-sm border border-slate-100 hover:shadow-md hover:-translate-y-1 transition-all"
              >
                <div className="bg-blue-50 p-3 rounded-full mr-4 text-blue-600">
                  <Award size={24} />
                </div>
                <span className="text-lg font-semibold text-slate-900">{value}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}