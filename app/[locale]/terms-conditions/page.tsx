"use client";

import { useTranslations, useLocale } from 'next-intl';
import ContentPage from '@/components/ContentPage';
import { FileText } from 'lucide-react';

export default function TermsConditions() {
  const locale = useLocale();
  const t = useTranslations('TermsConditions');

  return (
    <ContentPage pageKey="terms-conditions" locale={locale}>
      <div className="min-h-screen bg-white">
        {/* Page heading */}
        <section className="bg-blue-900 py-8 md:py-10 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center">
                <FileText className="text-white" size={32} />
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
                <h2 className="text-xl font-bold text-slate-900 mb-3">{t('acceptance')}</h2>
                <p className="text-slate-700 leading-relaxed">{t('acceptanceDesc')}</p>
              </div>

              <div>
                <h2 className="text-xl font-bold text-slate-900 mb-3">{t('useLicense')}</h2>
                <p className="text-slate-700 leading-relaxed">{t('useLicenseDesc')}</p>
              </div>

              <div>
                <h2 className="text-xl font-bold text-slate-900 mb-3">{t('restrictions')}</h2>
                <p className="text-slate-700 leading-relaxed">{t('restrictionsDesc')}</p>
              </div>

              <div>
                <h2 className="text-xl font-bold text-slate-900 mb-3">{t('disclaimer')}</h2>
                <p className="text-slate-700 leading-relaxed">{t('disclaimerDesc')}</p>
              </div>

              <div>
                <h2 className="text-xl font-bold text-slate-900 mb-3">{t('limitations')}</h2>
                <p className="text-slate-700 leading-relaxed">{t('limitationsDesc')}</p>
              </div>

              <div>
                <h2 className="text-xl font-bold text-slate-900 mb-3">{t('revisions')}</h2>
                <p className="text-slate-700 leading-relaxed">{t('revisionsDesc')}</p>
              </div>

              <div>
                <h2 className="text-xl font-bold text-slate-900 mb-3">{t('links')}</h2>
                <p className="text-slate-700 leading-relaxed">{t('linksDesc')}</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </ContentPage>
  );
}
