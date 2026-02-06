"use client";

import { Mail, Phone, MapPin, Send, CheckCircle2 } from 'lucide-react';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslations, useLocale } from 'next-intl';
import ContentPage from '@/components/ContentPage';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

export default function Contact() {
  const locale = useLocale();
  const t = useTranslations('ContactPage');
  const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success'>('idle');

  const contactSchema = z.object({
    name: z.string().min(1, t('nameRequired')),
    email: z.string().min(1, t('emailRequired')).email(t('emailInvalid')),
    message: z.string().min(1, t('messageRequired')).min(10, t('messageMinLength')),
  });

  type ContactFormValues = z.infer<typeof contactSchema>;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormValues) => {
    setFormStatus('submitting');
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (response.ok) {
        setFormStatus('success');
        setTimeout(() => setFormStatus('idle'), 5000);
        reset();
      } else {
        alert('Failed to send message. Please try again.');
        setFormStatus('idle');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('An error occurred. Please try again.');
      setFormStatus('idle');
    }
  };

  return (
    <ContentPage pageKey="contact" locale={locale}>
    <div className="min-h-screen bg-white">
      {/* Page heading – small blue strip */}
      <section className="bg-blue-900 py-8 md:py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-2xl md:text-3xl font-bold text-white">{t('headerTitle')}</h1>
          <p className="mt-2 text-blue-200 text-sm md:text-base max-w-2xl mx-auto">{t('headerSubtitle')}</p>
        </div>
      </section>

      <section className="py-12 md:py-16 px-4 sm:px-6 lg:px-8 bg-blue-50">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <span className="inline-block w-12 h-0.5 rounded-full bg-blue-800 mb-4" />
              <h2 className="text-xl md:text-2xl font-bold text-slate-900 mb-6 tracking-tight">{t('getInTouch')}</h2>
              <div className="space-y-4">
                <div className="bg-white p-5 rounded-xl border border-blue-200 flex items-start gap-4 hover:border-blue-600 transition-colors">
                  <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center text-blue-900">
                    <Mail size={20} strokeWidth={1.75} />
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-slate-900">{t('emailTitle')}</h3>
                    <p className="text-slate-700 text-sm mt-1">info@doddapanenigroup.net</p>
                    <p className="text-slate-500 text-xs mt-1">{t('emailResponse')}</p>
                  </div>
                </div>
                <div className="bg-white p-5 rounded-xl border border-blue-200 flex items-start gap-4 hover:border-blue-600 transition-colors">
                  <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center text-blue-900">
                    <Phone size={20} strokeWidth={1.75} />
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-slate-900">{t('phoneTitle')}</h3>
                    <p className="text-slate-700 text-sm mt-1">+91 814 224 6666 (India)</p>
                    <p className="text-slate-700 text-sm">+1 (352)230-8586 (USA)</p>
                    <p className="text-slate-500 text-xs mt-1">{t('phoneAvailability')}</p>
                  </div>
                </div>
                <div className="bg-white p-5 rounded-xl border border-blue-200 flex items-start gap-4 hover:border-blue-600 transition-colors">
                  <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center text-blue-900">
                    <MapPin size={20} strokeWidth={1.75} />
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-slate-900">{t('locationsTitle')}</h3>
                    <div className="mt-2 space-y-2 text-sm text-slate-700">
                      <div>
                        <p className="font-medium text-slate-800">{t('locationIndia')}</p>
                        <p className="text-slate-600">{t('addressIndia')}</p>
                      </div>
                      <div>
                        <p className="font-medium text-slate-800">{t('locationUSA')}</p>
                        <p className="text-slate-600">{t('addressUSA')}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Form */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-white p-6 md:p-8 rounded-xl border border-blue-200 shadow-sm"
            >
              <h2 className="text-xl font-bold text-slate-900 mb-5">{t('formTitle')}</h2>
              {formStatus === 'success' ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-blue-50 border border-blue-200 text-blue-900 p-6 rounded-xl flex flex-col items-center text-center"
                >
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-3">
                    <CheckCircle2 className="h-6 w-6 text-blue-800" strokeWidth={1.75} />
                  </div>
                  <h3 className="text-lg font-bold mb-1">{t('successTitle')}</h3>
                  <p className="text-sm font-medium text-blue-900">{t('successMessage')}</p>
                </motion.div>
              ) : (
                <form className="space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
                  <div>
                    <label htmlFor="name" className="block text-sm font-semibold text-slate-700 mb-1.5">{t('formName')}</label>
                    <input
                      type="text"
                      id="name"
                      {...register('name')}
                      className={`block w-full rounded-lg border bg-white px-3 py-2.5 text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-blue-800 focus:border-blue-800 ${
                        errors.name ? 'border-red-400' : 'border-blue-200'
                      }`}
                      placeholder={t('formNamePlaceholder')}
                    />
                    {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name.message}</p>}
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-semibold text-slate-700 mb-1.5">{t('formEmail')}</label>
                    <input
                      type="email"
                      id="email"
                      {...register('email')}
                      className={`block w-full rounded-lg border bg-white px-3 py-2.5 text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-blue-800 focus:border-blue-800 ${
                        errors.email ? 'border-red-400' : 'border-blue-200'
                      }`}
                      placeholder={t('formEmailPlaceholder')}
                    />
                    {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>}
                  </div>
                  <div>
                    <label htmlFor="message" className="block text-sm font-semibold text-slate-700 mb-1.5">{t('formMessage')}</label>
                    <textarea
                      id="message"
                      rows={4}
                      {...register('message')}
                      className={`block w-full rounded-lg border bg-white px-3 py-2.5 text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-blue-800 focus:border-blue-800 resize-none ${
                        errors.message ? 'border-red-400' : 'border-blue-200'
                      }`}
                      placeholder={t('formMessagePlaceholder')}
                    />
                    {errors.message && <p className="mt-1 text-xs text-red-600">{errors.message.message}</p>}
                  </div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full flex justify-center items-center gap-2 py-3 px-4 rounded-lg font-semibold text-white bg-blue-800 hover:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-800 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <Send className="h-4 w-4 animate-pulse" strokeWidth={1.75} />
                        {t('sendingButton')}
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4" strokeWidth={1.75} />
                        {t('sendButton')}
                      </>
                    )}
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        </div>
      </section>
    </div>
    </ContentPage>
  );
}
