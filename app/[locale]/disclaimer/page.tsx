"use client";

import { useTranslations, useLocale } from 'next-intl';
import ContentPage from '@/components/ContentPage';
import { AlertTriangle } from 'lucide-react';

export default function Disclaimer() {
  const locale = useLocale();
  const t = useTranslations('Disclaimer');

  return (
    <ContentPage pageKey="disclaimer" locale={locale}>
      <div className="min-h-screen bg-white">
        {/* Page heading */}
        <section className="bg-blue-900 py-8 md:py-10 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center">
                <AlertTriangle className="text-white" size={32} />
              </div>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-white">{t('title')}</h1>
            <p className="mt-2 text-blue-200 text-sm md:text-base">{t('subtitle')}</p>
            <p className="mt-2 text-blue-300 text-xs">{t('lastUpdated')}</p>
          </div>
        </section>

        {/* Content */}
        <section className="py-12 md:py-16 px-4 sm:px-6 lg:px-8 bg-slate-50">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-xl shadow-sm border border-blue-100 p-6 md:p-8 space-y-8">
              <div>
                <h2 className="text-xl font-bold text-slate-900 mb-3">{t('general')}</h2>
                <p className="text-slate-700 leading-relaxed">{t('generalDesc')}</p>
              </div>

              <div>
                <h2 className="text-xl font-bold text-slate-900 mb-3">{t('noWarranty')}</h2>
                <p className="text-slate-700 leading-relaxed">{t('noWarrantyDesc')}</p>
              </div>

              <div>
                <h2 className="text-xl font-bold text-slate-900 mb-3">{t('limitation')}</h2>
                <p className="text-slate-700 leading-relaxed">{t('limitationDesc')}</p>
              </div>

              <div>
                <h2 className="text-xl font-bold text-slate-900 mb-3">{t('externalLinks')}</h2>
                <p className="text-slate-700 leading-relaxed">{t('externalLinksDesc')}</p>
              </div>

              <div>
                <h2 className="text-xl font-bold text-slate-900 mb-3">{t('businessDisclaimer')}</h2>
                <p className="text-slate-700 leading-relaxed">{t('businessDisclaimerDesc')}</p>
              </div>

              <div>
                <h2 className="text-xl font-bold text-slate-900 mb-3">{t('jurisdiction')}</h2>
                <p className="text-slate-700 leading-relaxed">{t('jurisdictionDesc')}</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </ContentPage>
  );
}
