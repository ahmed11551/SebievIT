import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useSpring } from 'motion/react';
import { 
  Terminal, 
  Code2, 
  Cpu, 
  Globe, 
  Mail, 
  Send, 
  Briefcase, 
  Database, 
  Layers, 
  Server,
  ChevronRight,
  ExternalLink,
  LineChart,
  Search,
  CheckCircle2,
  TrendingUp,
  MapPin,
  X,
  PlusCircle,
  ShieldCheck,
  Zap,
  Phone,
  MessageSquare,
  ArrowUp,
  Share2,
  Star,
  Quote,
  Download,
  PartyPopper
} from 'lucide-react';
import { cn } from './lib/utils';
import { submitLead } from './firebase';
import { generateCP } from './utils/pdfGenerator';

// --- DATA ---
const REVIEWS = [
  {
    name: "Игорь Морозов",
    role: "CTO, Fintech Startup",
    text: "Ахмед — один из лучших бэкенд-инженеров, с кем мне приходилось работать. Его подход к проектированию микросервисов спас наш проект при масштабировании.",
    stars: 5,
    avatar: "ИМ"
  },
  {
    name: "Елена Волкова",
    role: "Product Owner, LogiTech",
    text: "Редко встретишь разработчика, который так глубоко погружается в бизнес-логику. Решение для RabbitMQ работает как часы уже год.",
    stars: 5,
    avatar: "ЕВ"
  },
  {
    name: "Дмитрий К.",
    role: "Lead Architect, E-commerce",
    text: "Профилирование Node.js, которое сделал Ахмед, сократило наши расходы на сервера в 2 раза. Очень рекомендую для сложных задач.",
    stars: 5,
    avatar: "ДК"
  },
  {
    name: "Антон Борисов",
    role: "CEO, Retail Systems",
    text: "Быстрая интеграция со складским учетом 1С. Все баги были закрыты в первую неделю. Настоящий профи.",
    stars: 5,
    avatar: "АБ"
  }
];

const PROJECTS = [
  {
    title: "ERP для ГК Т1",
    category: "Backend",
    tags: ["NestJS", "RabbitMQ", "Postgres"],
    desc: "Система управления данными госзакупок."
  },
  {
    title: "Highload API",
    category: "Infra",
    tags: ["K8s", "Docker", "Go"],
    desc: "Отказоустойчивая архитектура для 20k RPS."
  },
  {
    title: "E-commerce Platform",
    category: "Web",
    tags: ["Next.js", "Redux", "Stripe"],
    desc: "Кастомная витрина с мгновенным поиском."
  },
  {
    title: "Security Audit",
    category: "Backend",
    tags: ["OpenSSL", "OWASP", "Pen Test"],
    desc: "Полный аудит уязвимостей банковского ПО."
  }
];

const PRICING_TIERS = [
  {
    id: "landing",
    name: "Лендинг / MVP",
    price: "от 120 000 ₽",
    description: "Быстрый старт для бизнеса на Tilda или React (Next.js). Полный фокус на конверсию.",
    features: [
      "Дизайн и адаптивная верстка",
      "Базовая SEO-оптимизация",
      "Интеграция с метриками",
      "Форма обратной связи",
      "Срок: 7-14 дней"
    ],
    recommended: false
  },
  {
    id: "corporate",
    name: "Корпоративный сайт",
    price: "от 350 000 ₽",
    description: "Профессиональный сайт на CMS (WordPress, Bitrix24, 1C) или кастомный стек.",
    features: [
      "Сложная структура страниц",
      "Интеграция с CRM/1C",
      "Каталог услуг или товаров",
      "Админ-панель управления",
      "Тех. поддержка 3 месяца"
    ],
    recommended: true
  },
  {
    id: "enterprise",
    name: "Проектирование систем",
    price: "от 1 500 000 ₽",
    description: "Микросервисы, CRM, ERP или высоконагруженные API с гарантией SLA.",
    features: [
      "Микросервисная архитектура",
      "Highload оптимизация",
      "RabbitMQ / Kafka / Redis",
      "CI/CD и Kubernetes",
      "SLA 99.9% и поддержка"
    ],
    recommended: false
  }
];

const CALCULATOR_OPTIONS = {
  cms: [
    { id: 'none', label: 'Без CMS (Custom Code)', price: 0 },
    { id: 'wp', label: 'WordPress', price: 50000 },
    { id: 'bitrix', label: 'Bitrix24 / 1C', price: 120000 },
    { id: 'tilda', label: 'Tilda (Low-code)', price: 30000 }
  ],
  type: [
    { id: 'new', label: 'Новый проект с нуля', price: 0 },
    { id: 'refactor', label: 'Доработка / Рефакторинг', price: -20000 }
  ],
  features: [
    { id: 'seo', label: 'SEO Продвижение', price: 40000 },
    { id: 'multilang', label: 'Мультиязычность', price: 60000 },
    { id: 'payment', label: 'Платежные системы', price: 50000 },
    { id: 'tma', label: 'Telegram Mini App (TMA)', price: 150000 }
  ]
};

const EXPERIENCE = [
  {
    company: "Группа компаний Т1",
    role: "Ведущий Fullstack-разработчик",
    period: "2024 — Настоящее время",
    description: "Разработка высоконагруженных систем управления данными для государственного сектора. Модернизация архитектуры и отказоустойчивость.",
    achievements: [
      "Миграция монолита (NestJS) на микросервисы.",
      "Настройка RabbitMQ через Transactional Outbox.",
      "Оптимизация PostgreSQL: ответ сокращен с 820мс до 310мс.",
      "CI/CD в Kubernetes с Zero-downtime (SIGTERM/preStop)."
    ],
    tags: ["NestJS", "RabbitMQ", "Postgres", "K8s"]
  },
  {
    company: "Ланит",
    role: "Fullstack-разработчик",
    period: "2022 — 2023",
    description: "ERP-система для управления внутренними ресурсами и проектами компании.",
    achievements: [
      "Вынос PDF-генерации в Worker Threads (Piscina).",
      "Rate Limiter в Redis (Leaky Bucket) — 12k RPS.",
      "Динамические дашборды на Vue 3."
    ],
    tags: ["Node.js", "Redis", "Vue 3"]
  }
];

const ADDONS = [
  { name: "Миграция с CMS (WP/Joomla)", price: "от 100 000 ₽", cat: "Development" },
  { name: "Доработка функционала", price: "7 000 ₽ / час", cat: "Hourly" },
  { name: "Аудит и Оптимизация", price: "от 150 000 ₽", cat: "Consulting" },
  { name: "Telegram Mini App", price: "от 200 000 ₽", cat: "Mobile" },
  { name: "Поддержка (Maintenance)", price: "от 40 000 ₽ / мес.", cat: "Service" }
];


// --- COMPONENTS ---

const SectionHeading = ({ children, subtitle }: { children: React.ReactNode, subtitle?: string }) => (
  <div className="mb-12">
    <motion.h2 
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900"
    >
      {children}
    </motion.h2>
    {subtitle && <p className="text-slate-500 mt-2 max-w-2xl font-medium text-sm sm:text-base">{subtitle}</p>}
  </div>
);

export default function App() {
  const [activeTab, setActiveTab] = useState<'portfolio' | 'pricing'>('portfolio');
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [projectFilter, setProjectFilter] = useState<'All' | 'Backend' | 'Web' | 'Infra'>('All');
  const [lang, setLang] = useState<'RU' | 'EN'>('RU');
  
  const drawerContentRef = useRef<HTMLDivElement>(null);
  // Calculator State
  const [calcCMS, setCalcCMS] = useState('none');
  const [calcType, setCalcType] = useState('new');
  const [calcFeatures, setCalcFeatures] = useState<string[]>([]);
  
  const reviewsRef = useRef<HTMLDivElement>(null);
  const [sliderConstraints, setSliderConstraints] = useState({ right: 0, left: 0 });

  const [formState, setFormState] = useState({ name: '', contact: '', phone: '', message: '', tier: '' });

  const selectedCMS = CALCULATOR_OPTIONS.cms.find(c => c.id === calcCMS);
  const selectedType = CALCULATOR_OPTIONS.type.find(t => t.id === calcType);
  const selectedFeaturesList = CALCULATOR_OPTIONS.features.filter(f => calcFeatures.includes(f.id));

  const calculateTotal = () => {
    let total = 120000; // Base price
    total += selectedCMS?.price || 0;
    total += selectedType?.price || 0;
    selectedFeaturesList.forEach(f => {
      total += f.price;
    });
    return total;
  };

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  useEffect(() => {
    if (isContactOpen && drawerContentRef.current) {
      drawerContentRef.current.scrollTo(0, 0);
    }
    if (isContactOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [isContactOpen]);

  useEffect(() => {
    if (isFormSubmitted && drawerContentRef.current) {
      drawerContentRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [isFormSubmitted]);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };

    const updateConstraints = () => {
      if (reviewsRef.current) {
        const fullWidth = reviewsRef.current.scrollWidth;
        const visibleWidth = reviewsRef.current.offsetWidth;
        setSliderConstraints({ right: 0, left: -(fullWidth - visibleWidth + 40) });
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', updateConstraints);
    setTimeout(updateConstraints, 500); // Initial calculation

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', updateConstraints);
    };
  }, []);

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formState.phone.match(/^\+?[\d\s-]{10,20}$/)) {
      alert('Пожалуйста, введите корректный номер телефона.');
      return;
    }
    
    try {
      setIsSubmitting(true);
      const finalData = {
        ...formState,
        total: calculateTotal(),
        calculatorData: activeTab === 'pricing' ? {
          cms: calcCMS,
          type: calcType,
          features: calcFeatures,
          total: calculateTotal()
        } : null
      };

      await submitLead(finalData);
      setIsFormSubmitted(true);
      
      // Auto-scroll to top of drawer on success
      if (drawerContentRef.current) {
        drawerContentRef.current.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } catch (err) {
      console.error("Submission error:", err);
      alert('Произошла ошибка при отправке. Пожалуйста, напишите в Telegram напрямую.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const downloadCP = () => {
    generateCP({
      name: formState.name || 'Клиент',
      calcCMS,
      calcType,
      calcFeatures,
      total: calculateTotal(),
      options: CALCULATOR_OPTIONS
    });
  };

  const closeContact = () => {
    setIsContactOpen(false);
    setTimeout(() => {
      setIsFormSubmitted(false);
      setFormState({ name: '', contact: '', phone: '', message: '', tier: '' });
    }, 300);
  };

  const sharePortfolio = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Портфолио Ахмеда Себиева',
        text: 'Senior Fullstack Engineer с 9-летним опытом.',
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Ссылка скопирована в буфер обмена!');
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // --- ANIMATED ICON WRAPPER ---
  const AnimatedIcon = ({ icon: Icon, color = "currentColor", size = 20 }: { icon: any, color?: string, size?: number }) => (
    <motion.div
      whileHover={{ scale: 1.2, rotate: 10 }}
      whileTap={{ scale: 0.9 }}
      transition={{ type: "spring", stiffness: 400, damping: 10 }}
      style={{ color }}
    >
      <Icon size={size} />
    </motion.div>
  );

  return (
    <div className="min-h-screen font-sans selection:bg-slate-900 selection:text-white scroll-smooth overflow-x-hidden w-full">
      {/* PROGRESS BAR */}
      <motion.div className="fixed top-0 left-0 right-0 h-1 bg-emerald-500 origin-left z-[100]" style={{ scaleX }} />

      {/* HEADER */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-xl border-b border-slate-200 w-full overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center relative">
          <div className="flex flex-col">
            <h1 className="text-xl md:text-2xl font-bold tracking-tight text-slate-900 uppercase">
              Ахмед <span className="font-normal text-slate-500 hidden sm:inline">Себиев</span>
            </h1>
            <div className="flex gap-2 sm:gap-4 text-[9px] sm:text-[10px] font-mono text-slate-400 mt-0.5 uppercase tracking-widest">
              <span>Senior Engineer</span>
              <span className="text-slate-200">•</span>
              <span>2025</span>
            </div>
          </div>

          <nav className="hidden md:flex gap-1 bg-slate-100 p-1 rounded-full border border-slate-200">
            {[
              { id: 'portfolio', label: 'Опыт' },
              { id: 'pricing', label: 'Тарифы' }
            ].map((tab) => (
              <button 
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={cn(
                  "px-6 py-1.5 rounded-full text-[10px] font-bold transition-all uppercase tracking-widest",
                  activeTab === tab.id ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-900"
                )}
              >
                {tab.label}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-2 sm:gap-4">
            <button 
              onClick={() => setLang(lang === 'RU' ? 'EN' : 'RU')}
              className="w-10 h-10 rounded-full border border-slate-200 text-[10px] font-bold text-slate-900 hover:bg-slate-100 hidden sm:flex items-center justify-center transition-all"
            >
              {lang}
            </button>
            <button 
              onClick={() => setIsContactOpen(true)}
              className="sleek-button-primary px-4 sm:px-8 py-2.5 text-[10px] sm:text-xs"
            >
              Связаться
            </button>
          </div>
        </div>
      </header>

      {/* MOBILE BOTTOM NAV */}
      <nav className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 bg-slate-900/90 backdrop-blur-xl border border-white/10 p-2 rounded-2xl flex gap-1 z-50 shadow-2xl">
        {[
          { id: 'portfolio', label: 'Опыт', icon: Briefcase },
          { id: 'pricing', label: 'Цены', icon: Zap }
        ].map((tab) => (
          <button 
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={cn(
              "flex flex-col items-center gap-1 px-4 sm:px-8 py-2 rounded-xl transition-all",
              activeTab === tab.id ? "bg-emerald-500 text-slate-900" : "text-white/60 hover:text-white"
            )}
          >
            <tab.icon size={16} />
            <span className="text-[8px] font-bold uppercase tracking-widest">{tab.label}</span>
          </button>
        ))}
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-12 md:py-24">
        <AnimatePresence mode="wait">
          {activeTab === 'portfolio' && (
            <motion.div 
              key="portfolio"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-32"
            >
              {/* HERO / BUSINESS CARD STYLE */}
              <section className="flex flex-col lg:flex-row gap-16 lg:items-center">
                <div className="flex-1 space-y-8">
                  <div className="space-y-4">
                    <span className="inline-block px-4 py-1 bg-emerald-100 text-emerald-700 text-[10px] font-bold uppercase tracking-widest rounded-full">
                      9+ Лет Опыта • Fullstack Expert
                    </span>
                    <h2 className="text-6xl md:text-8xl font-bold tracking-tighter text-slate-900 leading-[0.85]">
                      ENGINEERING <br />
                      <span className="gradient-text">INTELLIGENCE.</span>
                    </h2>
                    <p className="text-xl text-slate-500 max-w-2xl font-medium leading-relaxed">
                      Я — Ахмед Себиев, фулстек-разработчик с глубокой экспертизой в бэкенде. 
                      Проектирую и внедряю сложные отказоустойчивые системы для финтеха, госсектора и логистики.
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-4">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 p-6 sleek-card w-full sm:w-auto">
                      <div className="flex flex-col">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Текущий рейт</span>
                        <span className="text-2xl font-bold text-slate-900">300 000 ₽ +</span>
                      </div>
                      <div className="hidden sm:block w-px h-10 bg-slate-200" />
                      <div className="flex flex-col">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Локация</span>
                        <span className="text-lg font-bold text-slate-900">Москва / Remote</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4">
                     <a href="https://t.me/SebievTL" className="flex-1 sleek-button-primary flex items-center justify-center gap-3 py-4">
                       <AnimatedIcon icon={MessageSquare} size={20} />
                       <span className="font-bold">Telegram</span>
                     </a>
                     <a href="tel:89259409404" className="flex-1 sleek-button-secondary flex items-center justify-center gap-3 py-4">
                       <AnimatedIcon icon={Phone} size={20} />
                       <span className="font-bold">8 925 940-94-04</span>
                     </a>
                     <button onClick={sharePortfolio} className="w-14 h-14 hidden sm:flex items-center justify-center bg-slate-100 rounded-2xl hover:bg-slate-200 transition-colors shrink-0">
                       <AnimatedIcon icon={Share2} size={20} />
                     </button>
                  </div>
                </div>

                <div className="w-full lg:w-1/3 order-first lg:order-last">
                  <div className="bg-slate-900 p-6 sm:p-8 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden">
                    <motion.div 
                      animate={{ rotate: [0, 5, 0] }}
                      transition={{ repeat: Infinity, duration: 6 }}
                      className="absolute top-4 right-4 text-emerald-500"
                    >
                      <ShieldCheck size={32} />
                    </motion.div>
                    <h4 className="text-xl sm:text-2xl font-bold mb-6">Stack Specs</h4>
                    <div className="space-y-6">
                      {[
                        { label: 'Runtime', val: 'Node.js / TS / NestJS', icon: Code2, color: 'text-blue-400' },
                        { label: 'Infrastructure', val: 'K8s / Docker / CI', icon: Server, color: 'text-purple-400' },
                        { label: 'Databases', val: 'PostgreSQL / Redis', icon: Database, color: 'text-orange-400' },
                        { label: 'Frontend', val: 'React / Next.js / Vue', icon: Globe, color: 'text-emerald-400' }
                      ].map((s, i) => (
                        <div key={i} className="flex gap-4 items-start">
                          <div className={cn("p-2 bg-white/5 rounded-lg shrink-0", s.color)}><s.icon size={16} /></div>
                          <div className="space-y-1">
                            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{s.label}</div>
                            <div className="text-sm font-bold text-slate-200">{s.val}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-8 pt-8 border-t border-white/10 flex justify-between items-center text-[10px] font-mono text-slate-500">
                      <span>VERIFIED ENGINEER</span>
                      <span>v2.0.25</span>
                    </div>
                  </div>
                </div>
              </section>

              {/* EXPERIENCE & PROJECTS */}
              <section>
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-8">
                  <SectionHeading subtitle="Мой опыт в ГК Т1 и Ланит — работа с масштабами страны.">
                    Профессиональный опыт
                  </SectionHeading>
                  <div className="flex gap-2 p-1 bg-slate-100 rounded-xl overflow-x-auto pb-2 md:pb-1">
                    {['All', 'Backend', 'Web', 'Infra'].map(f => (
                      <button 
                        key={f}
                        onClick={() => setProjectFilter(f as any)}
                        className={cn(
                          "px-4 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap",
                          projectFilter === f ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
                        )}
                      >
                        {f}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {EXPERIENCE.map((job, idx) => (
                    <motion.div 
                      key={idx} 
                      whileHover={{ y: -5 }}
                      layout
                      className="sleek-card p-6 sm:p-10 group overflow-hidden relative"
                    >
                      <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rotate-45 translate-x-16 -translate-y-16 group-hover:bg-emerald-50 transition-colors" />
                      <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mb-1 leading-tight">{job.role}</h3>
                      <div className="text-emerald-600 font-bold text-[10px] sm:text-xs uppercase tracking-widest mb-6">
                        {job.company} — {job.period}
                      </div>
                      <p className="text-slate-500 mb-8 font-medium leading-relaxed text-sm sm:text-base">{job.description}</p>
                      <div className="space-y-4">
                        {job.achievements.map((a, i) => (
                          <div key={i} className="flex gap-4 text-xs sm:text-sm font-bold text-slate-700">
                            <Zap size={16} className="text-emerald-500 shrink-0 mt-1" />
                            <span>{a}</span>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* PROJECT GRID */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-16">
                  <AnimatePresence>
                    {PROJECTS.filter(p => projectFilter === 'All' || p.category === projectFilter).map((proj, i) => (
                      <motion.div 
                        key={i}
                        layout
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                         className="p-6 bg-white border border-slate-200 rounded-3xl hover:shadow-xl transition-all"
                      >
                        <div className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest mb-2">{proj.category}</div>
                        <h4 className="font-bold text-slate-900 mb-2">{proj.title}</h4>
                        <p className="text-xs text-slate-500 mb-4 font-medium">{proj.desc}</p>
                        <div className="flex flex-wrap gap-1">
                          {proj.tags.map(t => <span key={t} className="px-2 py-0.5 bg-slate-50 text-[9px] font-bold text-slate-400 rounded-md border border-slate-100">{t}</span>)}
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </section>

              {/* REVIEWS SECTION */}
              <section className="overflow-hidden w-full relative">
                <SectionHeading subtitle="Что говорят коллеги и клиенты о совместной работе.">
                  Отзывы
                </SectionHeading>
                <div className="relative group -mx-6 px-6 overflow-visible">
                   <motion.div 
                     ref={reviewsRef}
                     className="flex gap-6 cursor-grab active:cursor-grabbing pb-8 pr-12"
                     drag="x"
                     dragConstraints={sliderConstraints}
                     whileTap={{ cursor: 'grabbing' }}
                   >
                     {REVIEWS.map((review, i) => (
                       <motion.div 
                         key={i} 
                         className="min-w-[280px] sm:min-w-[400px] sleek-card p-6 sm:p-8 flex flex-col justify-between"
                       >
                         <div className="space-y-4">
                           <div className="flex gap-1">
                             {[...Array(review.stars)].map((_, idx) => (
                               <Star key={idx} size={14} className="fill-emerald-500 text-emerald-500" />
                             ))}
                           </div>
                           <Quote className="text-slate-100" size={32} />
                           <p className="text-slate-600 italic font-medium leading-relaxed text-sm sm:text-base">
                             «{review.text}»
                           </p>
                         </div>
                         <div className="mt-8 flex items-center gap-4">
                           <div className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center text-white text-xs font-bold">
                             {review.avatar}
                           </div>
                           <div>
                             <div className="font-bold text-slate-900">{review.name}</div>
                             <div className="text-[10px] font-bold text-slate-400 uppercase">{review.role}</div>
                           </div>
                         </div>
                       </motion.div>
                     ))}
                   </motion.div>
                </div>
              </section>
            </motion.div>
          )}

          {activeTab === 'pricing' && (
            <motion.div 
              key="pricing"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-24"
            >
              <div className="text-center max-w-3xl mx-auto space-y-6">
                <h2 className="text-4xl md:text-5xl font-bold tracking-tight">Сервисы & Тарифы 2025</h2>
                <p className="text-slate-500 text-sm sm:text-lg font-medium">
                  Прозрачное ценообразование на основе рыночных показателей Москвы. 
                  Индивидуальный подход к каждой бизнес-задаче.
                </p>
              </div>

              {/* CALCULATOR SECTION */}
              <div className="bg-slate-900 rounded-[3rem] p-8 sm:p-12 lg:p-20 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-[100px]" />
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 relative z-10">
                  <div className="space-y-12">
                     <div>
                       <h3 className="text-3xl font-bold mb-4">Калькулятор проекта</h3>
                       <p className="text-slate-400 font-medium">Выберите необходимые параметры для оценки предварительной стоимости.</p>
                     </div>

                     <div className="space-y-8">
                       <div className="space-y-4">
                         <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Платформа / CMS</label>
                         <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                           {CALCULATOR_OPTIONS.cms.map(c => (
                             <button 
                               key={c.id} 
                               onClick={() => setCalcCMS(c.id)}
                               className={cn(
                                 "px-6 py-4 rounded-2xl border text-sm font-bold transition-all text-left relative overflow-hidden group",
                                 calcCMS === c.id ? "bg-white text-slate-900 border-white shadow-xl scale-[1.02]" : "border-white/10 hover:border-white/30"
                               )}
                             >
                               {calcCMS === c.id && <motion.div layoutId="calcCMSactive" className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-500" />}
                               {c.label}
                               <div className="text-[10px] opacity-50">{c.price > 0 ? `+${c.price.toLocaleString()} ₽` : 'Базовая'}</div>
                             </button>
                           ))}
                         </div>
                       </div>

                       <div className="space-y-4">
                         <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Тип работ</label>
                         <div className="flex flex-col sm:flex-row gap-3">
                           {CALCULATOR_OPTIONS.type.map(t => (
                             <button 
                               key={t.id} 
                               onClick={() => setCalcType(t.id)}
                               className={cn(
                                 "flex-1 px-6 py-4 rounded-2xl border text-sm font-bold transition-all text-left relative overflow-hidden",
                                 calcType === t.id ? "bg-white text-slate-900 border-white shadow-xl scale-[1.02]" : "border-white/10 hover:border-white/30"
                               )}
                             >
                               {calcType === t.id && <motion.div layoutId="calcTypeactive" className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-500" />}
                               {t.label}
                             </button>
                           ))}
                         </div>
                       </div>

                       <div className="space-y-4">
                         <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Дополнительно</label>
                         <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                           {CALCULATOR_OPTIONS.features.map(f => (
                             <button 
                               key={f.id} 
                               onClick={() => {
                                 setCalcFeatures(prev => 
                                   prev.includes(f.id) ? prev.filter(id => id !== f.id) : [...prev, f.id]
                                 )
                               }}
                               className={cn(
                                 "px-6 py-4 rounded-2xl border text-sm font-bold transition-all text-left flex justify-between items-center group",
                                 calcFeatures.includes(f.id) ? "bg-emerald-500 text-white border-emerald-500" : "border-white/10 hover:border-white/30"
                               )}
                             >
                               <span>{f.label}</span>
                               <PlusCircle size={16} className={cn("transition-transform", calcFeatures.includes(f.id) ? "rotate-45" : "group-hover:scale-110")} />
                             </button>
                           ))}
                         </div>
                       </div>
                     </div>
                  </div>

                  <div className="lg:sticky lg:top-32 bg-white text-slate-900 rounded-[2.5rem] p-6 sm:p-10 flex flex-col justify-between h-fit shadow-2xl relative">
                    <div className="absolute -top-4 -left-4 bg-emerald-500 text-slate-900 text-[10px] font-bold px-4 py-2 rounded-full uppercase tracking-widest shadow-lg">Детализация</div>
                    <div className="space-y-6">
                       <div className="space-y-4">
                          <div className="flex justify-between items-center text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">
                             <span>Компонент</span>
                             <span>Цена</span>
                          </div>
                          <div className="space-y-2 max-h-[200px] overflow-y-auto custom-scrollbar pr-2">
                             <div className="flex justify-between text-sm font-bold">
                                <span>Базовая разработка</span>
                                <span>120 000 ₽</span>
                             </div>
                             {selectedCMS && selectedCMS.id !== 'none' && (
                               <div className="flex justify-between text-sm font-medium text-slate-500">
                                  <span>{selectedCMS.label}</span>
                                  <span>+{selectedCMS.price.toLocaleString()} ₽</span>
                               </div>
                             )}
                             {selectedType && selectedType.id !== 'none' && (
                               <div className="flex justify-between text-sm font-medium text-slate-500">
                                  <span>{selectedType.label}</span>
                                  <span>{selectedType.price.toLocaleString()} ₽</span>
                               </div>
                             )}
                             {selectedFeaturesList.map(f => (
                               <div key={f.id} className="flex justify-between text-sm font-medium text-slate-500">
                                  <span>{f.label}</span>
                                  <span>+{f.price.toLocaleString()} ₽</span>
                               </div>
                             ))}
                          </div>
                       </div>
                       
                       <div className="pt-6 border-t-2 border-dashed border-slate-100 space-y-4">
                         <div className="text-xs font-bold text-slate-400 uppercase">Итоговая оценка</div>
                         <div className="text-4xl sm:text-5xl font-bold tracking-tighter text-slate-900">
                           {calculateTotal().toLocaleString()} <span className="text-xl font-normal text-slate-400">₽</span>
                         </div>
                       </div>

                       <div className="space-y-3 pt-2">
                          <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                             <span>Срок</span>
                             <span className="text-slate-900">от 10 рабочих дней</span>
                          </div>
                          <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                             <span>Гарантия</span>
                             <span className="text-slate-900">12 месяцев</span>
                          </div>
                       </div>
                    </div>
                    <button 
                      onClick={() => setIsContactOpen(true)}
                      className="w-full bg-slate-900 text-white py-5 rounded-2xl font-bold text-base mt-10 hover:bg-slate-800 transition-all active:scale-95 shadow-xl shadow-slate-900/10"
                    >
                      Получить КП
                    </button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {PRICING_TIERS.map((tier) => (
                  <div key={tier.id} className={cn("sleek-card p-6 sm:p-10 flex flex-col items-start relative overflow-hidden", tier.recommended && "ring-2 ring-slate-900 shadow-2xl")}>
                    {tier.recommended && <div className="absolute top-4 right-4 bg-slate-900 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase">Top Pick</div>}
                    <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">{tier.name}</h4>
                    <div className="text-3xl sm:text-4xl font-bold mb-6 break-words w-full">{tier.price}</div>
                    <p className="text-sm text-slate-500 mb-8 font-medium">{tier.description}</p>
                    <div className="space-y-4 mb-12 flex-1 w-full">
                      {tier.features.map((f, i) => (
                        <div key={i} className="flex items-start gap-3 text-sm font-bold text-slate-700">
                          <CheckCircle2 size={18} className="text-emerald-500 shrink-0 mt-0.5" />
                          <span>{f}</span>
                        </div>
                      ))}
                    </div>
                    <button 
                      onClick={() => {setFormState({...formState, tier: tier.name}); setIsContactOpen(true);}}
                      className={cn("w-full py-4 rounded-xl font-bold transition-all", tier.recommended ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600")}
                    >
                      Заказать
                    </button>
                  </div>
                ))}
              </div>

              {/* RETURN TO TOP BUTTON */}
              <AnimatePresence>
                {showScrollTop && (
                  <motion.button
                    initial={{ opacity: 0, scale: 0.5, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.5, y: 20 }}
                    onClick={scrollToTop}
                    className="fixed bottom-8 right-8 z-50 w-14 h-14 bg-slate-900 text-white rounded-full flex items-center justify-center shadow-2xl hover:bg-slate-800 transition-colors"
                  >
                    <ArrowUp size={24} />
                  </motion.button>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* FOOTER */}
      <footer className="bg-slate-900 py-24 text-white">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-16">
          <div className="space-y-6">
            <h4 className="text-2xl font-bold">Ахмед Себиев</h4>
            <p className="text-slate-400 font-medium max-w-xs">
              Senior Fullstack Engineer. Превращаю сложные технические задачи в элегантные решения.
            </p>
            <div className="flex gap-4">
              <a href="https://t.me/SebievTL" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-emerald-500 transition-colors"><MessageSquare size={18} /></a>
              <a href="mailto:Ahmed1155@mail.ru" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-emerald-500 transition-colors"><Mail size={18} /></a>
            </div>
          </div>
          <div>
            <h5 className="font-bold uppercase text-[10px] tracking-widest text-slate-500 mb-8">Навигация</h5>
            <ul className="space-y-4 font-bold text-sm">
              <li><button onClick={() => setActiveTab('portfolio')} className="hover:text-emerald-500 transition-colors">Портфолио</button></li>
              <li><button onClick={() => setActiveTab('pricing')} className="hover:text-emerald-500 transition-colors">Услуги и цены</button></li>
            </ul>
          </div>
          <div className="space-y-6">
            <h5 className="font-bold uppercase text-[10px] tracking-widest text-slate-500 mb-8">Контакты</h5>
            <div className="space-y-4 font-bold text-sm">
              <p>TG: <a href="https://t.me/SebievTL" className="hover:text-emerald-500">@SebievTL</a></p>
              <p>Phone: <a href="tel:89259409404" className="hover:text-emerald-500">8 925 940-94-04</a></p>
              <p>Email: <a href="mailto:Ahmed1155@mail.ru" className="hover:text-emerald-500">Ahmed1155@mail.ru</a></p>
              <p className="text-slate-500 font-medium">Available: Mon - Fri, 10:00 - 20:00 MSK</p>
            </div>
          </div>
        </div>
      </footer>

      {/* CONTACT DRAWER */}
      <AnimatePresence>
        {isContactOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsContactOpen(false)}
              className="fixed inset-0 bg-slate-950/60 backdrop-blur-md z-[60]"
            />
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed right-0 top-0 bottom-0 w-full max-w-xl bg-white z-[70] shadow-2xl p-6 sm:p-12 flex flex-col overflow-hidden"
            >
              <div className="flex justify-between items-center mb-6 sm:mb-12 shrink-0 bg-white z-10">
                <AnimatePresence mode="wait">
                  {!isFormSubmitted ? (
                    <motion.div 
                      key="header-form"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                    >
                      <h3 className="text-2xl sm:text-4xl font-bold tracking-tight">Новый проект</h3>
                      {formState.tier && <span className="text-[10px] font-bold text-emerald-600 uppercase mt-1 block">Тариф: {formState.tier}</span>}
                    </motion.div>
                  ) : (
                    <motion.div 
                      key="header-success"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                    >
                      <h3 className="text-2xl sm:text-4xl font-bold tracking-tight text-emerald-600">Готово!</h3>
                    </motion.div>
                  )}
                </AnimatePresence>
                <button onClick={closeContact} className="p-2 sm:p-3 hover:bg-slate-100 rounded-full transition-all shrink-0">
                  <X size={24} />
                </button>
              </div>

              <div 
                ref={drawerContentRef}
                className="flex-1 overflow-y-auto pr-2 custom-scrollbar no-scrollbar scroll-smooth"
              >
                <AnimatePresence mode="wait">
                  {!isFormSubmitted ? (
                    <motion.form 
                      key="form-fields"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      onSubmit={handleApply} 
                      className="space-y-8"
                    >
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Как вас зовут?</label>
                        <input 
                          required
                          type="text" 
                          className="w-full py-4 border-b border-slate-200 focus:outline-none focus:border-slate-900 transition-colors font-bold text-lg sm:text-xl" 
                          placeholder="Александр"
                          value={formState.name}
                          onChange={e => setFormState({...formState, name: e.target.value})}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Email или Telegram</label>
                        <input 
                          required
                          type="text" 
                          className="w-full py-4 border-b border-slate-200 focus:outline-none focus:border-slate-900 transition-colors font-bold text-lg sm:text-xl" 
                          placeholder="@alex_ceo"
                          value={formState.contact}
                          onChange={e => setFormState({...formState, contact: e.target.value})}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Телефон</label>
                        <input 
                          required
                          type="tel" 
                          className="w-full py-4 border-b border-slate-200 focus:outline-none focus:border-slate-900 transition-colors font-bold text-lg sm:text-xl" 
                          placeholder="+7 (999) 000-00-00"
                          value={formState.phone}
                          onChange={e => setFormState({...formState, phone: e.target.value})}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Опишите задачу</label>
                        <textarea 
                          required
                          rows={3} 
                          className="w-full py-4 border-b border-slate-200 focus:outline-none focus:border-slate-900 transition-colors font-bold text-lg sm:text-xl resize-none" 
                          placeholder="Например: Нужна ERP система для логистики..."
                          value={formState.message}
                          onChange={e => setFormState({...formState, message: e.target.value})}
                        />
                      </div>
                      
                      <div className="pt-4">
                        <button 
                          disabled={isSubmitting}
                          type="submit" 
                          className={cn(
                            "w-full bg-slate-900 text-white py-5 rounded-2xl text-lg font-bold shadow-2xl transition-all active:scale-95 flex items-center justify-center gap-3",
                            isSubmitting && "opacity-50 cursor-not-allowed"
                          )}
                        >
                          {isSubmitting ? 'Отправка...' : (
                            <>
                              <span>Отправить запрос</span>
                              <Send size={20} />
                            </>
                          )}
                        </button>
                        
                        <div className="mt-6 flex flex-col items-center gap-3">
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Или в один клик</p>
                          <a 
                            href={`https://t.me/SebievTL?text=${encodeURIComponent(`Привет, Ахмед! Меня зовут ${formState.name}. Хочу проект: ${formState.message}`)}`} 
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-slate-900 font-bold hover:text-emerald-600 transition-colors"
                          >
                            <MessageSquare size={18} />
                            <span>Написать в Telegram</span>
                          </a>
                        </div>
                      </div>
                    </motion.form>
                  ) : (
                    <motion.div 
                      key="success-message"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="flex flex-col items-center text-center space-y-8 py-8"
                    >
                      <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-500">
                        <CheckCircle2 size={40} />
                      </div>
                      <div className="space-y-3">
                        <h4 className="text-2xl font-bold text-slate-900">Заявка принята!</h4>
                        <p className="text-slate-500 font-medium text-sm sm:text-base leading-relaxed">
                          Спасибо за доверие, {formState.name}! <br/> Я получил данные и отвечу вам в ближайшее время.
                        </p>
                      </div>

                      <div className="w-full grid grid-cols-1 gap-3">
                         <button 
                           onClick={downloadCP}
                           className="w-full bg-slate-900 text-white py-5 rounded-2xl text-lg font-bold shadow-2xl transition-all active:scale-95 flex items-center justify-center gap-3 border-2 border-slate-900 hover:bg-white hover:text-slate-900 group"
                         >
                           <Download size={20} className="group-hover:translate-y-1 transition-transform" />
                           <span>Скачать КП (PDF)</span>
                         </button>

                         <a 
                            href={`https://t.me/SebievTL?text=${encodeURIComponent(`Ахмед, я только что отправил расчет проекта с сайта! Меня зовут ${formState.name}.`)}`} 
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full bg-slate-50 text-slate-900 py-5 rounded-2xl text-lg font-bold border border-slate-100 transition-all active:scale-95 flex items-center justify-center gap-3 hover:bg-white hover:border-emerald-200"
                         >
                            <MessageSquare size={20} className="text-emerald-500" />
                            <span>Написать в Telegram</span>
                         </a>

                         <button 
                           onClick={closeContact}
                           className="w-full text-slate-400 font-bold py-4 hover:text-slate-900 transition-colors"
                         >
                           Вернуться на сайт
                         </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="mt-12 pt-12 border-t border-slate-100">
                <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  <span>Ahmed Sebiev</span>
                  <span>Moscow / 2025</span>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
