"use client";

import { Link } from '@/i18n/routing';
import Image from 'next/image';
import { Calendar, ArrowRight } from 'lucide-react';
import { useTranslations, useLocale } from 'next-intl';
import { motion } from 'framer-motion';

// Blog posts data
const blogPosts = [
  {
    slug: 'future-of-ecommerce-2026',
    title: 'The Future of E-Commerce in 2026: Trends and Opportunities',
    excerpt: 'Explore the latest trends shaping the e-commerce landscape, from AI-powered personalization to sustainable shopping practices.',
    date: '2026-02-06',
    category: 'E-Commerce',
    image: '/home.jpg',
  },
  {
    slug: 'healthcare-technology-innovations',
    title: 'Healthcare Technology Innovations: Transforming Patient Care',
    excerpt: 'Discover how cutting-edge technology is revolutionizing healthcare delivery and improving patient outcomes.',
    date: '2026-02-06',
    category: 'Healthcare',
    image: '/about.jpg',
  },
  {
    slug: 'sustainable-construction-practices',
    title: 'Sustainable Construction Practices for Modern Buildings',
    excerpt: 'Learn about eco-friendly construction methods and materials that are shaping the future of the building industry.',
    date: '2026-02-06',
    category: 'Construction',
    image: '/home.jpg',
  },
  {
    slug: 'digital-marketing-strategies',
    title: 'Effective Digital Marketing Strategies for 2026',
    excerpt: 'Master the latest digital marketing techniques to grow your business and reach your target audience effectively.',
    date: '2026-02-06',
    category: 'Digital Marketing',
    image: '/about.jpg',
  },
  {
    slug: 'ai-transformation-business',
    title: 'How AI is Transforming Business Operations',
    excerpt: 'Understand the impact of artificial intelligence on business processes and how to leverage it for competitive advantage.',
    date: '2026-02-06',
    category: 'Technology',
    image: '/home.jpg',
  },
  {
    slug: 'global-trade-opportunities',
    title: 'Global Trade Opportunities in Emerging Markets',
    excerpt: 'Explore lucrative opportunities in international trade and learn how to navigate cross-border business challenges.',
    date: '2026-02-06',
    category: 'Import/Export',
    image: '/about.jpg',
  },
  {
    slug: 'logistics-automation',
    title: 'Automation in Logistics: Streamlining Supply Chains',
    excerpt: 'Discover how automation technologies are optimizing logistics operations and reducing costs.',
    date: '2026-02-06',
    category: 'Logistics',
    image: '/home.jpg',
  },
  {
    slug: 'workforce-development-skills',
    title: 'Workforce Development: Building Skills for the Future',
    excerpt: 'Learn about essential skills and training programs needed to prepare your workforce for tomorrow\'s challenges.',
    date: '2026-02-06',
    category: 'Education',
    image: '/about.jpg',
  },
  {
    slug: 'media-digital-transformation',
    title: 'Digital Transformation in Media and News',
    excerpt: 'How traditional media companies are adapting to digital platforms and engaging modern audiences.',
    date: '2026-02-06',
    category: 'Media',
    image: '/home.jpg',
  },
  {
    slug: 'manufacturing-industry-4-0',
    title: 'Industry 4.0: The Future of Manufacturing',
    excerpt: 'Explore how smart manufacturing and IoT are revolutionizing production processes and efficiency.',
    date: '2026-02-06',
    category: 'Manufacturing',
    image: '/about.jpg',
  },
  {
    slug: 'food-processing-innovation',
    title: 'Innovation in Food Processing and Safety',
    excerpt: 'Latest technologies and practices ensuring food safety and quality in modern food processing facilities.',
    date: '2026-02-06',
    category: 'Food Processing',
    image: '/home.jpg',
  },
  {
    slug: 'real-estate-investment-tips',
    title: 'Real Estate Investment Strategies for 2026',
    excerpt: 'Expert insights on real estate investment opportunities and market trends for the coming year.',
    date: '2026-02-06',
    category: 'Real Estate',
    image: '/about.jpg',
  },
  {
    slug: 'cloud-computing-benefits',
    title: 'Cloud Computing: Benefits for Small and Medium Businesses',
    excerpt: 'How cloud solutions can help SMBs scale efficiently and reduce IT infrastructure costs.',
    date: '2026-02-06',
    category: 'Technology',
    image: '/home.jpg',
  },
  {
    slug: 'telemedicine-healthcare',
    title: 'Telemedicine: Expanding Healthcare Access',
    excerpt: 'The role of telemedicine in making healthcare more accessible and convenient for patients worldwide.',
    date: '2026-02-06',
    category: 'Healthcare',
    image: '/about.jpg',
  },
  {
    slug: 'sustainable-business-practices',
    title: 'Sustainable Business Practices: A Competitive Advantage',
    excerpt: 'How adopting sustainable practices can drive business growth and create long-term value.',
    date: '2026-02-06',
    category: 'Business',
    image: '/home.jpg',
  },
  {
    slug: 'customer-experience-digital-age',
    title: 'Customer Experience in the Digital Age',
    excerpt: 'Strategies for delivering exceptional customer experiences across digital touchpoints.',
    date: '2026-02-06',
    category: 'Digital Marketing',
    image: '/about.jpg',
  },
  {
    slug: 'data-security-best-practices',
    title: 'Data Security Best Practices for Businesses',
    excerpt: 'Essential cybersecurity measures every business should implement to protect sensitive data.',
    date: '2026-02-06',
    category: 'Technology',
    image: '/home.jpg',
  },
  {
    slug: 'remote-work-productivity',
    title: 'Maximizing Productivity in Remote Work Environments',
    excerpt: 'Best practices and tools for maintaining high productivity in distributed teams.',
    date: '2026-02-06',
    category: 'Business',
    image: '/about.jpg',
  },
  {
    slug: 'supply-chain-resilience',
    title: 'Building Resilient Supply Chains',
    excerpt: 'How to create supply chains that can withstand disruptions and adapt to changing conditions.',
    date: '2026-02-06',
    category: 'Logistics',
    image: '/home.jpg',
  },
  {
    slug: 'entrepreneurship-startup-success',
    title: 'Entrepreneurship: Keys to Startup Success',
    excerpt: 'Essential strategies and insights for building a successful startup from the ground up.',
    date: '2026-02-06',
    category: 'Business',
    image: '/about.jpg',
  },
];

export default function BlogPage() {
  const locale = useLocale();
  const t = useTranslations('Blog');

  return (
    <div className="min-h-screen bg-white">
      {/* Page Header */}
      <section className="bg-blue-900 py-12 md:py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
            {t('title')}
          </h1>
          <p className="text-blue-200 text-lg md:text-xl max-w-3xl mx-auto">
            {t('subtitle')}
          </p>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="py-12 md:py-16 px-4 sm:px-6 lg:px-8 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.map((post, index) => (
              <motion.article
                key={post.slug}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-300 border border-slate-200"
              >
                <Link href={`/blog/${post.slug}`}>
                  <div className="relative h-48 w-full">
                    <Image
                      src={post.image}
                      alt={post.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded-full">
                        {post.category}
                      </span>
                      <div className="flex items-center text-slate-500 text-xs">
                        <Calendar size={14} className="mr-1" />
                        {new Date(post.date).toLocaleDateString(locale, {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </div>
                    </div>
                    <h2 className="text-xl font-bold text-slate-900 mb-3 line-clamp-2 hover:text-blue-600 transition-colors">
                      {post.title}
                    </h2>
                    <p className="text-slate-600 text-sm mb-4 line-clamp-3">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center text-blue-600 font-semibold text-sm">
                      {t('readMore')}
                      <ArrowRight size={16} className="ml-2" />
                    </div>
                  </div>
                </Link>
              </motion.article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
