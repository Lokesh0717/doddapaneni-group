"use client";

import { Mail, Phone, MapPin, Send, CheckCircle2 } from 'lucide-react';
import { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

export default function Contact() {
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
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setFormStatus('success');
        // Reset after 5 seconds
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
    <div className="bg-slate-50 min-h-screen">
      {/* Header */}
      <section className="relative bg-slate-900 text-white py-32 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 z-0">
             <Image
                src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80"
                alt="Contact Us"
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

      <div className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            
            {/* Contact Info */}
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl font-bold text-slate-900 mb-8">{t('getInTouch')}</h2>
              <div className="space-y-8">
                {/* Email */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-start hover:shadow-md transition-shadow">
                  <div className="bg-blue-50 p-3 rounded-xl mr-4">
                    <Mail className="text-blue-600" size={24} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">{t('emailTitle')}</h3>
                    <p className="text-slate-600 font-medium">lk8772000@gmail.com</p>
                    <p className="text-sm text-slate-500 mt-1">{t('emailResponse')}</p>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-start hover:shadow-md transition-shadow">
                  <div className="bg-blue-50 p-3 rounded-xl mr-4">
                    <Phone className="text-blue-600" size={24} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">{t('phoneTitle')}</h3>
                    <p className="text-slate-600 font-medium">+91 8142246666 (India)</p>
                    <p className="text-slate-600 font-medium mt-1">+1(352)230-8586 (USA)</p>
                    <p className="text-sm text-slate-500 mt-1">{t('phoneAvailability')}</p>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-start hover:shadow-md transition-shadow">
                  <div className="bg-blue-50 p-3 rounded-xl mr-4">
                    <MapPin className="text-blue-600" size={24} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">{t('locationsTitle')}</h3>
                    
                    <div className="mb-4">
                      <p className="text-slate-800 font-semibold mb-1">{t('locationIndia')}</p>
                      <p className="text-slate-600 leading-relaxed">
                        {t('addressIndia')}
                      </p>
                    </div>

                    <div>
                      <p className="text-slate-800 font-semibold mb-1">{t('locationUSA')}</p>
                      <p className="text-slate-600 leading-relaxed">
                        {t('addressUSA')}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Contact Form */}
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white p-6 lg:p-8 rounded-3xl shadow-lg border border-slate-100"
            >
              <h2 className="text-2xl font-bold text-slate-900 mb-6">{t('formTitle')}</h2>
              {formStatus === 'success' ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-green-50 border border-green-200 text-green-800 p-8 rounded-2xl flex flex-col items-center text-center"
                >
                  <div className="bg-green-100 p-3 rounded-full mb-4">
                    <CheckCircle2 className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">{t('successTitle')}</h3>
                  <p className="font-medium">{t('successMessage')}</p>
                </motion.div>
              ) : (
                <form className="space-y-6" onSubmit={handleSubmit(onSubmit)} noValidate>
                  <div>
                    <label htmlFor="name" className="block text-sm font-semibold text-slate-700 mb-2">{t('formName')}</label>
                    <input
                      type="text"
                      id="name"
                      {...register('name')}
                      className={`block w-full rounded-lg border bg-slate-50 px-4 py-3 text-slate-900 focus:bg-white transition-colors ${
                        errors.name 
                          ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
                          : 'border-slate-200 focus:border-blue-500 focus:ring-blue-500'
                      }`}
                      placeholder={t('formNamePlaceholder')}
                    />
                    {errors.name && (
                      <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-semibold text-slate-700 mb-2">{t('formEmail')}</label>
                    <input
                      type="email"
                      id="email"
                      {...register('email')}
                      className={`block w-full rounded-lg border bg-slate-50 px-4 py-3 text-slate-900 focus:bg-white transition-colors ${
                        errors.email
                          ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
                          : 'border-slate-200 focus:border-blue-500 focus:ring-blue-500'
                      }`}
                      placeholder={t('formEmailPlaceholder')}
                    />
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="message" className="block text-sm font-semibold text-slate-700 mb-2">{t('formMessage')}</label>
                    <textarea
                      id="message"
                      rows={4}
                      {...register('message')}
                      className={`block w-full rounded-lg border bg-slate-50 px-4 py-3 text-slate-900 focus:bg-white transition-colors ${
                        errors.message
                          ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
                          : 'border-slate-200 focus:border-blue-500 focus:ring-blue-500'
                      }`}
                      placeholder={t('formMessagePlaceholder')}
                    ></textarea>
                    {errors.message && (
                      <p className="mt-1 text-sm text-red-600">{errors.message.message}</p>
                    )}
                  </div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full flex justify-center items-center py-4 px-6 border border-transparent rounded-lg shadow-sm text-lg font-bold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all ${isSubmitting ? 'opacity-75 cursor-not-allowed' : 'hover:-translate-y-1 hover:shadow-lg'}`}
                  >
                    {isSubmitting ? (
                      <>
                        <Send className="mr-2 h-5 w-5 animate-pulse" />
                        {t('sendingButton')}
                      </>
                    ) : (
                      <>
                        <Send className="mr-2 h-5 w-5" />
                        {t('sendButton')}
                      </>
                    )}
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
