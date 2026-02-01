"use client";

import { 
  ShoppingCart, 
  Cpu, 
  Megaphone, 
  Stethoscope, 
  Building, 
  Globe, 
  Utensils, 
  GraduationCap, 
  Truck, 
  Tv, 
  Factory, 
  Users,
  CheckCircle,
  LucideIcon
} from 'lucide-react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';

// Map service keys to icons
const iconMap: Record<string, LucideIcon> = {
  "ecommerce": ShoppingCart,
  "software": Cpu,
  "digitalMarketing": Megaphone,
  "healthcare": Stethoscope,
  "construction": Building,
  "importExport": Globe,
  "food": Utensils,
  "education": GraduationCap,
  "logistics": Truck,
  "media": Tv,
  "manufacturing": Factory,
  "staffing": Users
};

export default function Services() {
  const t = useTranslations('ServicesPage');
  const tServices = useTranslations('Home.servicesList');

  const serviceKeys = [
    "ecommerce",
    "software",
    "digitalMarketing",
    "healthcare",
    "construction",
    "importExport",
    "food",
    "education",
    "logistics",
    "media",
    "manufacturing",
    "staffing"
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
    <div className="bg-slate-50 min-h-screen">
      {/* Header */}
      <section className="relative bg-slate-900 text-white py-32 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 z-0">
             <Image
                src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80"
                alt="Global Services"
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
          <h1 className="text-4xl md:text-5xl font-bold mb-6">{t('title')}</h1>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
            {t('description')}
          </p>
        </motion.div>
      </section>

      {/* Services List */}
      <div className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6"
          >
            {serviceKeys.map((key, index) => {
              const IconComponent = iconMap[key] || CheckCircle;
              
              return (
                <motion.div 
                  key={index} 
                  variants={itemVariants}
                  className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col md:flex-row gap-6 group"
                >
                  <div className="bg-blue-50 p-4 rounded-xl flex-shrink-0 h-fit w-fit group-hover:bg-blue-600 transition-colors duration-300">
                    <IconComponent className="text-blue-600 group-hover:text-white transition-colors duration-300" size={32} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-3 group-hover:text-blue-600 transition-colors">{tServices(`${key}.title`)}</h3>
                    <p className="text-slate-600 leading-relaxed">
                      {tServices(`${key}.description`)}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
