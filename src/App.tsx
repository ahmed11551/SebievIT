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
  Shield,
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
  Github,
  ArrowUp,
  Share2,
  Star,
  Quote,
  Download,
  PartyPopper,
  Tag,
  Percent,
  Calculator,
  Headphones,
  Layout,
  Award,
  Rocket,
  ChevronDown,
  Clock,
  ExternalLink as LinkIcon
} from 'lucide-react';
import { cn } from './lib/utils';
import { submitLead } from './firebase';
import { generateCP } from './utils/pdfGenerator';

// --- DATA ---
const PROJECTS = [
  {
    title: "ERP для ГК Т1",
    category: "Enterprise Backend",
    tags: ["NestJS", "RabbitMQ", "Postgres"],
    desc: "Автоматизация госзакупок: ускорил обработку данных на 40% и исключил потерю заявок."
  },
  {
    title: "Sber AI Dashboard",
    category: "Highload UI",
    tags: ["React", "D3.js", "WebSockets"],
    desc: "Система мониторинга обучения нейросетей в реальном времени. Обработка 50к+ метрик/сек."
  },
  {
    title: "VTB Mobile Banking",
    category: "Fintech",
    tags: ["Microfrontends", "React Native", "Security"],
    desc: "Рефакторинг критических узлов авторизации и защиты данных пользователей."
  },
  {
    title: "Ozon Warehouse Core",
    category: "Logistics",
    tags: ["Go", "gRPC", "Redis"],
    desc: "Система управления складскими остатками: снижение задержек API на 25%."
  },
  {
    title: "Bitrix Luxury Shop",
    category: "E-commerce",
    tags: ["Bitrix", "PHP 8", "MySQL"],
    desc: "Интернет-магазин премиум-сегмента с кастомным функционалом личного кабинета."
  },
  {
    title: "Industrial IoT Platform",
    category: "IoT / Manufacturing",
    tags: ["MQTT", "InfluxDB", "Grafana"],
    desc: "Сбор и анализ телеметрии с 2000+ станков на промышленном предприятии."
  },
  {
    title: "CRM for Real Estate",
    category: "SaaS",
    tags: ["Next.js", "Serverless", "Supabase"],
    desc: "Облачная CRM для управления объектами недвижимости и сделками."
  },
  {
    title: "Crypto Trading Engine",
    category: "Web3 / Trading",
    tags: ["Rust", "WASM", "Zero-Knowledge"],
    desc: "Ядро для децентрализованной биржи с минимальной задержкой исполнения ордеров."
  },
  {
    title: "EduTech Portal",
    category: "Education",
    tags: ["Strapi", "Vue.js", "AWS"],
    desc: "Платформа для онлайн-обучения с системой интерактивных тестов и видеосвязи."
  }
];

const PRICING_TIERS = [
  {
    id: "landing",
    name: "Лендинг / Сайт-визитка",
    price: "от 85 000 ₽",
    description: "Быстрый запуск продукта с архитектурой «на вырост». Идеально для проверки гипотез без техдолга.",
    features: [
      "Индивидуальный дизайн High-End",
      "Технологии: React / Next.js",
      "Полная SEO-подготовка",
      "Запуск за 10-14 дней"
    ],
    recommended: false
  },
  {
    id: "corporate",
    name: "Корпоративный сайт / Магазин",
    price: "от 210 000 ₽",
    description: "Комплексная экосистема для лидеров индустрии. Автоматизация, безопасность и масштабируемость.",
    features: [
      "Микросервисная архитектура",
      "Интеграция с ERP / 1C",
      "Безопасность по стандарту OWASP",
      "SLA и поддержка 12 месяцев"
    ],
    recommended: true
  },
  {
    id: "premium",
    name: "Индивидуальная разработка",
    price: "от 430 000 ₽",
    description: "Сложные нагруженные системы, Big Data и финансовые инструменты для бизнеса.",
    features: [
      "Highload (100k+ запросов/сек)",
      "Кластеры Kubernetes",
      "Продвинутая AI-логика",
      "SLA 99.99% (Гарантия аптайма)"
    ],
    recommended: false
  }
];

const CALCULATOR_OPTIONS = {
  cms: [
    { id: 'custom', label: 'Кастомный Next.js', price: 160000, desc: 'Бескомпромиссная скорость и имидж.' },
    { id: 'strapi', label: 'Headless / Strapi', price: 95000, desc: 'Гибкое управление данными.' },
    { id: 'bitrix', label: '1С-Битрикс PRO', price: 110000, desc: 'Профессиональное решение для ритейла.' },
    { id: 'wp', label: 'WordPress PRO', price: 75000, desc: 'Для контентных проектов и блогов.' },
    { id: 'tilda', label: 'Tilda Luxury', price: 45000, desc: 'Премиальный старт за 5-7 дней.' }
  ],
  type: [
    { id: 'new', label: 'С чистого листа', price: 0, desc: 'Разработка новой системы.' },
    { id: 'refactor', label: 'Реинжиниринг / Ускорение', price: 85000, desc: 'Оптимизация текущих систем.' }
  ],
  features: [
    { id: 'ai', label: 'AI Модуль (ИИ)', price: 95000, desc: 'Ассистенты и автоматизация.' },
    { id: 'legal', label: 'Безопасность', price: 55000, desc: 'Защита данных и ФЗ-152.' },
    { id: 'performance', label: 'Оптимизация скорости', price: 35000, desc: 'Загрузка сайта <500мс.' },
    { id: 'seo', label: 'SEO Продвижение', price: 50000, desc: 'Техническое превосходство.' }
  ]
};

const EXPERIENCE = [
  {
    company: "Группа компаний Т1",
    role: "Ведущий Fullstack-разработчик",
    period: "2024 — Н.В.",
    location: "Москва",
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
    location: "Москва",
    description: "ERP-система для управления внутренними ресурсами и проектами компании.",
    achievements: [
      "Вынос PDF-генерации в Worker Threads (Piscina).",
      "Rate Limiter в Redis (Leaky Bucket) — 12k RPS.",
      "Динамические дашборды на Vue 3."
    ],
    tags: ["Node.js", "Redis", "Vue 3"]
  },
  {
    company: "Sber AI",
    role: "Frontend Engineer (Contract)",
    period: "2021 — 2022",
    location: "U.A.E / Remote",
    description: "Интеграция LLM в корпоративные интерфейсы. Работа над ML-инструментарием.",
    achievements: [
      "Разработка Canvas-based визуализации нейронных сетей.",
      "Оптимизация рендеринга больших графов (WebGL).",
      "Реализация стриминга токенов для чат-ботов."
    ],
    tags: ["Three.js", "React", "Python"]
  }
];

const ADDONS = [
  { name: "Технический аудит системы", price: "от 90 000 ₽", cat: "Consulting", icon: Search },
  { name: "Миграция данных (SQL/NoSQL)", price: "от 110 000 ₽", cat: "Engineering", icon: Database },
  { name: "Юридический чекап (Legal Tech)", price: "от 35 000 ₽", cat: "Legal", icon: ShieldCheck },
  { name: "Настройка CI/CD & K8s", price: "от 160 000 ₽", cat: "Infrastructure", icon: Server },
  { name: "Абонентская поддержка L3", price: "от 45 000 ₽ / мес", cat: "Support", icon: Headphones },
  { name: "Разработка Telegram Mini App", price: "от 190 000 ₽", cat: "Mobile", icon: Layout }
];


// --- COMPONENTS ---

const Marquee = ({ children, speed = 30, pauseOnHover = true }: { children: React.ReactNode, speed?: number, pauseOnHover?: boolean }) => {
  return (
    <div className="flex overflow-hidden relative group">
      <motion.div 
        className="flex items-center gap-6 pr-6 whitespace-nowrap"
        animate={{ x: [0, "-50%"] }}
        transition={{ 
          duration: speed, 
          repeat: Infinity, 
          ease: "linear" 
        }}
        {...(pauseOnHover ? { 
          whileHover: { animationPlayState: "paused" }
        } : {})}
      >
        {children}
        {children}
      </motion.div>
    </div>
  );
};

const SectionHeading = ({ children, subtitle, hasDiscount }: { children: React.ReactNode, subtitle?: string, hasDiscount?: boolean }) => (
  <div className="mb-12 relative flex flex-col items-start">
    {hasDiscount && (
      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 1, scale: 1 }}
        className="flex items-center gap-2 px-3 py-1 bg-emerald-600 text-white rounded-full text-[10px] font-bold uppercase tracking-widest mb-4 shadow-lg shadow-emerald-500/20"
      >
        <Percent size={10} />
        <span>Весенняя привилегия: преференция 40%</span>
      </motion.div>
    )}
    <motion.h2 
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      className="text-2xl sm:text-4xl font-black tracking-tighter text-slate-950 uppercase leading-none"
    >
      {children}
    </motion.h2>
    {subtitle && <p className="text-slate-500 mt-2 max-w-2xl font-medium text-sm sm:text-base border-l-2 border-emerald-100 pl-4">{subtitle}</p>}
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
  const [calcCMS, setCalcCMS] = useState('custom');
  const [calcType, setCalcType] = useState('new');
  const [calcFeatures, setCalcFeatures] = useState<string[]>([]);
  const [formError, setFormError] = useState<string | null>(null);
  
  const reviewsRef = useRef<HTMLDivElement>(null);
  const [sliderConstraints, setSliderConstraints] = useState({ right: 0, left: 0 });

  const [formState, setFormState] = useState({ name: '', contact: '', phone: '', message: '', tier: '' });

  const selectedCMS = CALCULATOR_OPTIONS.cms.find(c => c.id === calcCMS);
  const selectedType = CALCULATOR_OPTIONS.type.find(t => t.id === calcType);
  const selectedFeaturesList = CALCULATOR_OPTIONS.features.filter(f => calcFeatures.includes(f.id));

  const calculateTotal = () => {
    let total = selectedCMS?.price || 150000; 
    total += selectedType?.price || 0;
    selectedFeaturesList.forEach(f => {
      total += f.price;
    });
    return Math.round(total * 0.6); 
  };

  const getOriginalTotal = () => {
    let total = selectedCMS?.price || 150000;
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
    setFormError(null);

    // QA Check: validation
    if (formState.name.trim().length < 2) {
      setFormError('Пожалуйста, введите ваше имя.');
      return;
    }
    if (!formState.phone.match(/^\+?[\d\s-]{10,24}$/)) {
      setFormError('Пожалуйста, введите корректный номер телефона.');
      return;
    }
    if (formState.message.trim().length < 5) {
      setFormError('Пожалуйста, опишите вашу задачу подробнее.');
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
    <div className="min-h-screen font-sans selection:bg-emerald-100 selection:text-emerald-900 scroll-smooth overflow-x-hidden w-full bg-white relative technical-grid">
      <div className="hidden sm:block fixed inset-0 pointer-events-none noise-filter z-0" />
      
      {/* PROGRESS BAR */}
      {/* HEADER */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-3xl w-full overflow-hidden sm:border-b sm:border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 sm:h-24 flex justify-between items-center relative">
          <div className="flex items-center gap-3 sm:gap-5 group cursor-pointer" onClick={() => (window.scrollTo({top:0, behavior:'smooth'}), setActiveTab('portfolio'))}>
            <div className="w-10 h-10 sm:w-16 h-16 bg-[#00a86b] rounded-2xl flex items-center justify-center text-white shadow-xl transition-all hover:rotate-6 shrink-0 active:scale-95">
               <Cpu size={22} className="sm:hidden" />
               <Cpu size={36} className="hidden sm:block" />
            </div>
            <div className="flex flex-col">
              <h1 className="text-sm sm:text-3xl font-black tracking-tighter text-slate-950 uppercase leading-none">
                SEBIEV <span className="text-[#00a86b]">FULLSTACK</span>
              </h1>
              <div className="flex gap-2 text-[6px] sm:text-[10px] font-mono font-bold text-slate-400 mt-1 uppercase tracking-[0.1em] leading-none items-center">
                <span>FULLSTACK ENGINEERING</span>
                <span className="opacity-40">•</span>
                <span>REL. 2026</span>
              </div>
            </div>
          </div>


          <nav className="hidden lg:flex gap-1 bg-slate-50 p-1.5 rounded-2xl border border-slate-200/50">
            {[
              { id: 'portfolio', label: 'Портфолио' },
              { id: 'pricing', label: 'Цены' }
            ].map((tab) => (
              <button 
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={cn(
                  "px-8 py-2.5 rounded-xl text-[10px] font-black transition-all uppercase tracking-widest",
                  activeTab === tab.id ? "bg-[#00a86b] text-white shadow-lg" : "text-slate-500 hover:text-slate-950"
                )}
              >
                {tab.label}
              </button>
            ))}
          </nav>

          <div className="flex items-center">
            <button 
              onClick={() => setIsContactOpen(true)}
              className="bg-slate-950 text-white px-7 sm:px-12 py-3.5 sm:py-6 rounded-2xl text-[10px] sm:text-[15px] font-black uppercase tracking-tight hover:bg-[#00a86b] transition-all shadow-[0_10px_30px_-10px_rgba(0,0,0,0.5)] active:scale-95"
            >
              Начать проект
            </button>
          </div>

        </div>
      </header>

      {/* MOBILE BOTTOM NAV */}
      <nav className="lg:hidden fixed bottom-6 left-1/2 -translate-x-1/2 w-[92%] max-w-[400px] bg-[#1a1b1e]/98 backdrop-blur-2xl border border-white/5 p-2 rounded-3xl flex gap-2 z-50 shadow-[0_20px_50px_rgba(0,0,0,0.4)]">
        <button 
          onClick={() => { setActiveTab('portfolio'); window.scrollTo({top:0, behavior:'smooth'}); }}
          className={cn(
            "flex-1 flex flex-col items-center justify-center gap-1.5 py-3 rounded-2xl transition-all active:scale-95",
            activeTab === 'portfolio' ? "bg-[#00a86b] text-white" : "text-white/40"
          )}
        >
          <Briefcase size={18} strokeWidth={2.5} />
          <span className="text-[9px] font-black uppercase tracking-widest">Портфолио</span>
        </button>
        <button 
          onClick={() => { setActiveTab('pricing'); window.scrollTo({top:0, behavior:'smooth'}); }}
          className={cn(
            "flex-1 flex flex-col items-center justify-center gap-1.5 py-3 rounded-2xl transition-all active:scale-95",
            activeTab === 'pricing' ? "bg-[#00a86b] text-white" : "text-white/40"
          )}
        >
          <Zap size={18} strokeWidth={2.5} />
          <span className="text-[9px] font-black uppercase tracking-widest">Цены</span>
        </button>
      </nav>



      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-24 space-y-0">
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
              <section className="flex flex-col lg:flex-row gap-10 lg:gap-16 lg:items-center py-4 sm:py-12">
                <div className="flex-1 space-y-6 sm:space-y-8">
                  <div className="space-y-3 sm:space-y-4">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-950 text-white text-[8px] sm:text-[10px] font-mono font-bold uppercase tracking-widest rounded-full">
                       <ShieldCheck size={10} className="sm:size-[12px] text-emerald-400" />
                        CORE_ENGINE: ACTIVE
                    </div>
                      <motion.h2 
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-[clamp(1.5rem,8vw,6rem)] font-black tracking-tighter text-slate-950 leading-[0.9] uppercase text-balance"
                      >
                        SENIOR IT-ARCHITECT • <span className="text-[#00a86b] italic">HIGHLAND & SECURITY EXPERT.</span>
                      </motion.h2>

                    <p className="text-sm sm:text-xl text-slate-500 max-w-2xl font-serif italic leading-relaxed text-balance">
                      Разработка цифровой архитектуры для Highload систем и кастомных UI. Фокус на техническое превосходство и бизнес-эффективность.
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-4">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-5 sm:p-8 sleek-card w-full sm:w-auto relative group overflow-hidden border-slate-100 technical-grid">
                      <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      <div className="flex flex-col relative z-10 transition-transform group-hover:translate-x-1">
                        <span className="text-[9px] font-mono font-bold text-emerald-600/50 uppercase tracking-[0.2em] mb-1">ENTRY_RATE</span>
                        <span className="text-2xl sm:text-3xl font-mono font-bold text-slate-950 tracking-tighter italic">250K <span className="text-xs font-mono not-italic opacity-30">RUB+</span></span>
                      </div>
                      <div className="hidden sm:block w-px h-10 bg-slate-100 relative z-10 mx-2" />
                      <div className="flex flex-col relative z-10 transition-transform group-hover:translate-x-1">
                        <span className="text-[9px] font-mono font-bold text-emerald-600/50 uppercase tracking-[0.2em] mb-1">UNITS_SHIPPED</span>
                        <span className="text-2xl sm:text-3xl font-mono font-bold text-slate-950 tracking-tighter italic">100<span className="text-xs font-mono not-italic opacity-30">.EXE</span></span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:flex lg:flex-row gap-3 sm:gap-4">
                     <button 
                       onClick={() => setIsContactOpen(true)}
                       className="flex-1 sleek-button-primary flex items-center justify-center gap-3 py-4 sm:py-5 shadow-xl shadow-emerald-500/10 active:scale-95 transition-all text-xs sm:text-sm"
                     >
                       <AnimatedIcon icon={MessageSquare} size={18} />
                       <span className="font-black uppercase tracking-widest">Обсудить задачу</span>
                     </button>
                     <a 
                       href="tel:89259409404" 
                       className="flex-1 sleek-button-secondary bg-white flex items-center justify-center gap-3 py-4 sm:py-5 border-slate-200 active:scale-95 transition-all text-xs sm:text-sm"
                     >
                       <AnimatedIcon icon={Phone} size={18} />
                       <span className="font-black uppercase tracking-widest">Позвонить</span>
                     </a>
                     <button 
                       onClick={sharePortfolio} 
                       className="w-14 h-14 hidden lg:flex items-center justify-center bg-white border border-slate-200 rounded-2xl hover:bg-slate-50 transition-colors shrink-0 shadow-sm"
                     >
                       <AnimatedIcon icon={Share2} size={18} />
                     </button>
                  </div>
                </div>

                <div className="w-full lg:w-[420px] order-first lg:order-last">
                  <div className="bg-[#00a86b] p-8 sm:p-14 rounded-[3.2rem] sm:rounded-[4rem] text-white shadow-2xl relative overflow-hidden group border border-white/10">
                    <div className="absolute inset-0 bg-gradient-to-br from-white/15 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="space-y-12 relative z-10">
                      <h4 className="text-[26px] sm:text-4xl font-black uppercase italic tracking-tighter leading-none">АРХИТЕКТУРА СТЕКА</h4>
                      <div className="space-y-9">
                        {[
                          { label: 'СТАБИЛЬНОСТЬ СЕРВЕРА', val: 'Enterprise (NestJS)', icon: Code2 },
                          { label: 'UPTIME 99.9%', val: 'K8s Масштабирование', icon: Server },
                          { label: 'СКОРОСТЬ ДОСТУПА', val: 'Low-latency архитектура', icon: Database },
                          { label: 'ИНТЕРФЕЙС', val: 'High-End UX/UI системы', icon: Globe }
                        ].map((s, i) => (
                          <div key={i} className="flex gap-5 items-center">
                            <div className="w-14 h-14 flex items-center justify-center bg-white/15 rounded-2xl border border-white/20 shrink-0 shadow-lg"><s.icon size={22} /></div>
                            <div className="space-y-1">
                              <div className="text-[11px] font-bold text-white/60 uppercase tracking-widest leading-none">{s.label}</div>
                              <div className="text-lg sm:text-2xl font-black text-white uppercase tracking-tight leading-none">{s.val}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="mt-12 pt-10 border-t border-white/10 flex justify-between items-center text-[11px] font-black text-white/50 uppercase tracking-[0.2em]">
                        <span>ЛИЦЕНЗИРОВАН</span>
                        <span>v2.1.25</span>
                      </div>
                    </div>
                  </div>
                </div>


              </section>

              {/* EXPERIENCE & PROJECTS */}
              <section className="space-y-12">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-6">
                  <SectionHeading 
                    subtitle="Кейсы с подтвержденной окупаемостью и масштабируемостью."
                    hasDiscount
                  >
                    Ключевые проекты
                  </SectionHeading>
                  <div className="flex gap-2 p-1 bg-slate-100/50 rounded-xl overflow-x-auto pb-1 scrollbar-hide">
                    {[
                      { id: 'All', label: 'Все проекты' },
                      { id: 'Backend', label: 'Сервер' },
                      { id: 'Web', label: 'Веб-системы' }
                    ].map(f => (
                      <button 
                        key={f.id}
                        onClick={() => setProjectFilter(f.id as any)}
                        className={cn(
                          "px-5 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap",
                          projectFilter === f.id ? "bg-white text-slate-900 shadow-sm" : "text-slate-400 hover:text-slate-600"
                        )}
                      >
                        {f.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
                  {EXPERIENCE.map((job, idx) => (
                    <motion.div 
                      key={idx} 
                      whileHover={{ y: -5, scale: 1.01 }}
                      layout
                      className="bg-white border border-slate-100 p-8 sm:p-10 rounded-[2.5rem] shadow-sm hover:shadow-2xl hover:shadow-emerald-500/10 transition-all group flex flex-col relative overflow-hidden"
                    >
                      <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                        <span className="text-6xl font-black font-sans">{idx + 1}</span>
                      </div>
                      
                      <div className="flex items-center gap-3 mb-8">
                        <div className="px-3 py-1 bg-slate-900 text-white rounded-lg text-[10px] font-mono font-bold tracking-tighter">
                          {job.period}
                        </div>
                        <div className="w-px h-3 bg-slate-200" />
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                          {job.location}
                        </div>
                      </div>

                      <div className="mb-6">
                        <h3 className="text-2xl font-black text-slate-950 mb-1 leading-tight group-hover:text-emerald-600 transition-colors uppercase tracking-tighter">
                          {job.role}
                        </h3>
                        <div className="text-emerald-400 font-bold text-xs uppercase tracking-widest">
                          {job.company}
                        </div>
                      </div>

                      <p className="text-slate-500 mb-10 font-medium leading-relaxed text-sm sm:text-base">
                        {job.description}
                      </p>

                      <div className="space-y-4 mb-10 flex-1">
                        {job.achievements.map((a, i) => (
                          <div key={i} className="flex gap-4 text-xs font-bold text-slate-700 leading-tight">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0 mt-1.5" />
                            <span>{a}</span>
                          </div>
                        ))}
                      </div>

                      <div className="flex flex-wrap gap-2 pt-6 border-t border-slate-50">
                        {job.tags.map(tag => (
                          <span key={tag} className="px-3 py-1 bg-slate-50 text-slate-500 rounded-full text-[10px] font-bold uppercase tracking-wider">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </motion.div>
                  ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 pt-8 sm:pt-12">
                  <AnimatePresence mode="popLayout">
                    {PROJECTS.filter(p => projectFilter === 'All' || p.category === projectFilter).map((proj, i) => (
                      <motion.div 
                        key={proj.title}
                        layout
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="p-5 sm:p-6 bg-white border border-slate-100 rounded-[1.5rem] sm:rounded-3xl hover:shadow-2xl transition-all h-full flex flex-col justify-between group active:scale-95 touch-manipulation relative overflow-hidden"
                      >
                        <div className="absolute top-0 right-0 p-3">
                           <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/20 group-hover:bg-emerald-500 transition-colors" />
                        </div>
                        <div>
                          <div className="text-[7px] sm:text-[10px] font-mono font-bold text-emerald-600 uppercase tracking-widest mb-2">{proj.category}</div>
                          <h4 className="font-black text-slate-900 text-sm sm:text-base mb-2 uppercase tracking-tighter leading-tight group-hover:text-emerald-600 transition-colors">{proj.title}</h4>
                          <p className="text-[10px] sm:text-xs text-slate-500 mb-4 font-serif italic leading-relaxed line-clamp-3">{proj.desc}</p>
                        </div>
                        <button 
                          onClick={() => { setIsContactOpen(true); setFormState(prev => ({ ...prev, message: `Интересует кейс: ${proj.title}` })); }}
                          className="w-full py-3 bg-slate-50 hover:bg-slate-950 hover:text-white rounded-xl text-[9px] sm:text-[10px] font-mono font-bold uppercase tracking-widest transition-all"
                        >
                          OPEN_CASE.EXE
                        </button>
                      </motion.div>
                    ))}
                  </AnimatePresence>
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
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  className="inline-flex items-center gap-2 bg-rose-500 text-white px-6 py-2 rounded-full text-xs font-bold uppercase tracking-widest shadow-xl shadow-rose-500/20"
                >
                  <Tag size={14} />
                  <span>Весенняя акция: -40% на всё</span>
                </motion.div>
                <h2 className="text-4xl md:text-6xl font-bold tracking-tighter uppercase">Сервисы & <span className="text-slate-400">Тарифы</span></h2>
                <p className="text-slate-500 text-sm sm:text-lg font-medium max-w-2xl mx-auto text-balance">
                  Прозрачное ценообразование на основе рыночных показателей. 
                  Каждая деталь проекта имеет значение для конечного результата.
                </p>
              </div>


              {/* CALCULATOR SECTION */}
              <div className="bg-white rounded-[1.5rem] sm:rounded-[3rem] p-5 sm:p-12 lg:p-20 text-slate-900 relative overflow-hidden shadow-2xl border border-slate-100 mb-20 technical-grid">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[120px] -mr-32 -mt-32" />
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 relative z-10">
                  <div className="space-y-6 sm:space-y-12">
                     <div>
                       <h3 className="text-xl sm:text-3xl font-black mb-2 sm:mb-4 uppercase tracking-tighter italic leading-none">Estimate Costs</h3>
                       <p className="text-[11px] sm:text-base text-slate-500 font-serif italic leading-relaxed">Настройте параметры проекта для мгновенного технического расчета сметы.</p>
                     </div>

                     <div className="space-y-6 sm:space-y-8">
                       <div className="space-y-3">
                         <label className="text-[8px] sm:text-[10px] font-mono font-bold text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2 pl-1">
                           <Layers size={10} className="text-emerald-500" />
                           CORE_STACK
                         </label>
                         <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                           {CALCULATOR_OPTIONS.cms.map(c => (
                             <button 
                               key={c.id} 
                               onClick={() => setCalcCMS(c.id)}
                               className={cn(
                                 "px-4 py-3 rounded-xl border text-left transition-all relative overflow-hidden flex flex-col justify-between min-h-[65px] sm:min-h-[140px] active:scale-95 touch-manipulation",
                                 calcCMS === c.id ? "bg-slate-950 text-white border-slate-950 shadow-xl" : "bg-white border-slate-100"
                               )}
                             >
                                <div className="space-y-0.5">
                                  <div className="text-[10px] sm:text-sm font-mono font-bold uppercase tracking-tight leading-none">{c.label}</div>
                                  <div className={cn("text-[8px] font-serif italic leading-none opacity-40 hidden sm:block", calcCMS === c.id ? "text-white" : "text-slate-400")}>
                                    {c.desc}
                                  </div>
                                </div>
                                <div className={cn("mt-1 text-[9px] font-mono font-bold tracking-widest uppercase", calcCMS === c.id ? "text-emerald-400" : "text-emerald-600")}>
                                  {c.price > 0 ? `${c.price.toLocaleString()} RUB` : 'BASIS'}
                                </div>
                             </button>
                           ))}
                         </div>
                       </div>

                       <div className="space-y-3 sm:space-y-4">
                         <label className="text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 pl-1">
                           <Zap size={12} className="text-emerald-500" />
                           Тип разработки
                         </label>
                         <div className="grid grid-cols-2 gap-2 sm:gap-3">
                           {CALCULATOR_OPTIONS.type.map(t => (
                             <button 
                               key={t.id} 
                               onClick={() => setCalcType(t.id)}
                               className={cn(
                                 "px-4 sm:px-6 py-3 sm:py-4 rounded-xl sm:rounded-2xl border text-xs sm:text-sm font-bold transition-all text-left min-h-[60px] sm:min-h-[80px] active:scale-95 touch-manipulation",
                                 calcType === t.id ? "bg-slate-950 text-white border-slate-950 shadow-xl" : "bg-white border-slate-100"
                               )}
                             >
                                <div className="text-[10px] sm:text-sm font-black uppercase tracking-tighter">{t.label}</div>
                                <div className={cn("mt-1 text-[8px] sm:text-[9px] font-black uppercase", calcType === t.id ? "text-emerald-600" : "text-emerald-400")}>
                                  {t.price > 0 ? `+ ${t.price.toLocaleString()} ₽` : '0 ₽'}
                                </div>
                             </button>
                           ))}
                         </div>
                       </div>

                       <div className="space-y-3 sm:space-y-4">
                         <label className="text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 pl-1">
                           <Cpu size={12} className="text-emerald-500" />
                           Модули расширения
                         </label>
                         <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                           {CALCULATOR_OPTIONS.features.map(f => (
                             <button 
                               key={f.id} 
                               onClick={() => {
                                 setCalcFeatures(prev => 
                                   prev.includes(f.id) ? prev.filter(id => id !== f.id) : [...prev, f.id]
                                 )
                               }}
                               className={cn(
                                 "px-5 sm:px-6 py-3 sm:py-4 rounded-xl sm:rounded-2xl border text-xs sm:text-sm font-bold transition-all text-left flex justify-between items-center",
                                 calcFeatures.includes(f.id) ? "bg-emerald-600 text-white border-emerald-600 shadow-lg" : "bg-white/50 border-slate-100 hover:border-emerald-200 hover:bg-white"
                               )}
                             >
                               <div className="flex-1">
                                 <div className="text-[10px] sm:text-sm font-black uppercase tracking-tighter flex justify-between items-center">
                                   <span>{f.label}</span>
                                   <PlusCircle size={14} className={cn("transition-transform", calcFeatures.includes(f.id) ? "rotate-45" : "")} />
                                 </div>
                                 <div className={cn("mt-0.5 text-[9px] font-black uppercase opacity-60", calcFeatures.includes(f.id) ? "text-white" : "text-emerald-600")}>
                                   + {f.price.toLocaleString()} ₽
                                 </div>
                               </div>
                             </button>
                           ))}
                         </div>
                       </div>
                     </div>
                  </div>

                      <div className="lg:sticky lg:top-32 bg-white text-slate-900 rounded-[1.5rem] sm:rounded-[2.5rem] p-5 sm:p-10 flex flex-col justify-between h-fit shadow-2xl border border-slate-100 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1 bg-emerald-600/20" />
                        <div className="absolute -top-3 -left-3 flex flex-col gap-2 z-20">
                          <div className="bg-slate-950 text-emerald-400 text-[8px] font-mono font-bold px-3 py-1.5 rounded-full uppercase tracking-widest shadow-lg flex items-center gap-1">
                            <Tag size={10} />
                            <span>SAVINGS: 40%</span>
                          </div>
                        </div>
                        
                        <div className="space-y-4 pt-1">
                           <div className="space-y-3">
                              <div className="flex justify-between items-center text-[8px] font-mono font-bold text-slate-300 uppercase tracking-[0.2em] border-b border-slate-50 pb-1.5">
                                 <span>PROJECTION</span>
                                 <span>BUDGET_EST</span>
                              </div>
                              <div className="space-y-2.5 max-h-[140px] sm:max-h-[250px] overflow-y-auto custom-scrollbar pr-1">
                                 <div className="flex justify-between items-start text-[10px] sm:text-sm font-mono font-bold uppercase tracking-tight">
                                    <span className="text-slate-800 flex-1">{selectedCMS?.label}</span>
                                    <span className="text-emerald-600 font-bold">{(calculateTotal()).toLocaleString('ru-RU')} RUB</span>
                                 </div>
                                 {selectedFeaturesList.map(f => (
                                   <div key={f.id} className="flex justify-between items-start text-[9px] sm:text-xs font-mono font-bold uppercase tracking-tight text-slate-400">
                                     <span className="flex-1">{f.label}</span>
                                     <span>+{Math.round(f.price * 0.6).toLocaleString('ru-RU')}</span>
                                   </div>
                                 ))}
                              </div>
                           </div>
                           
                           <div className="pt-3 border-t border-dashed border-slate-200">
                             <div className="text-[8px] font-mono font-bold text-slate-400 uppercase tracking-[0.2em] mb-1.5">INITIAL_BUDGET.SYS</div>
                             <div className="flex items-baseline gap-2">
                               <div className="text-2xl sm:text-5xl font-mono font-bold tracking-tighter text-slate-950 leading-none italic">
                                 {calculateTotal().toLocaleString('ru-RU')} <span className="text-xs font-mono text-slate-300 not-italic">RUB</span>
                               </div>
                               <div className="text-[9px] sm:text-base font-mono font-bold text-slate-300 line-through italic opacity-50">
                                 {getOriginalTotal().toLocaleString('ru-RU')} RUB
                               </div>
                             </div>
                           </div>
                        </div>
                        <button 
                          onClick={() => setIsContactOpen(true)}
                          className="w-full bg-slate-950 text-white py-4 rounded-xl font-mono font-bold text-[10px] sm:text-base mt-5 hover:bg-emerald-600 transition-all shadow-[0_15px_30px_-5px_rgba(0,0,0,0.3)] flex items-center justify-center gap-2 uppercase tracking-widest active:scale-95"
                        >
                          <span>EXECUTE_DEAL</span>
                          <ChevronRight size={14} />
                        </button>
                      </div>
                </div>
              </div>

              <div className="flex flex-col space-y-8">
                <div className="flex overflow-x-auto pb-8 sm:grid sm:grid-cols-3 gap-4 sm:gap-8 no-scrollbar snap-x snap-mandatory px-4 -mx-4 sm:px-0 sm:mx-0">
                  {PRICING_TIERS.map((tier) => {
                    const originalPriceValue = parseInt(tier.price.replace(/[^\d]/g, ''));
                    const discountedPrice = Math.round(originalPriceValue * 0.6).toLocaleString('ru-RU');
                    const originalPrice = originalPriceValue.toLocaleString('ru-RU');

                    return (
                      <motion.div 
                        key={tier.id} 
                        className={cn(
                          "min-w-[85vw] sm:min-w-0 snap-center sleek-card p-6 sm:p-10 flex flex-col items-start relative overflow-hidden transition-all active:scale-[0.98] border-slate-100",
                          tier.recommended && "ring-2 ring-slate-950 shadow-2xl bg-white"
                        )}
                      >
                        {tier.recommended && <div className="absolute top-4 left-4 bg-slate-950 text-white text-[8px] font-black px-2 py-1 rounded-md uppercase tracking-widest">Recommended</div>}
                        <div className="absolute -right-10 top-5 rotate-45 bg-rose-500 text-white text-[7px] font-black px-10 py-1 uppercase tracking-widest italic shadow-sm">Sale -40%</div>
                        
                        <h4 className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-4 mt-2">{tier.name}</h4>
                        <div className="flex flex-col mb-6">
                          <div className="text-[10px] font-black text-slate-200 line-through mb-0.5">от {originalPrice} ₽</div>
                          <div className="text-2xl sm:text-4xl font-black text-slate-950 italic tracking-tighter leading-none">от {discountedPrice} ₽</div>
                        </div>
                        
                        <div className="space-y-3 mb-8 flex-1 w-full">
                          {tier.features.map((f, i) => (
                            <div key={i} className="flex items-start gap-2.5 text-slate-700">
                              <CheckCircle2 size={12} className="text-emerald-500 shrink-0 mt-0.5" />
                              <span className="leading-tight uppercase tracking-tight text-[9px] font-bold">{f}</span>
                            </div>
                          ))}
                        </div>

                        <button 
                          onClick={() => {setFormState({...formState, tier: tier.name}); setIsContactOpen(true);}}
                          className={cn(
                            "w-full py-3.5 rounded-xl font-black transition-all uppercase tracking-widest text-[9px]", 
                            tier.recommended ? "bg-emerald-600 text-white shadow-lg" : "bg-slate-100 text-slate-600"
                          )}
                        >
                          Выбрать
                        </button>
                      </motion.div>
                    );
                  })}
                </div>
              </div>

              {/* RETURN TO TOP BUTTON */}
              <AnimatePresence>
                {showScrollTop && (
                  <motion.button
                    initial={{ opacity: 0, scale: 0.5, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.5, y: 20 }}
                    onClick={scrollToTop}
                    aria-label="Наверх"
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
      <footer className="bg-slate-50 py-24 text-slate-900 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-16">
          <div className="space-y-6">
            <h4 className="text-2xl font-bold uppercase tracking-tighter">Ахмед Себиев</h4>
            <p className="text-slate-500 font-medium max-w-xs leading-relaxed">
              Senior Fullstack Engineer. Архитектор сложных систем с фокусом на безопасность и окупаемость.
            </p>
            <div className="flex gap-4">
              <a href="https://t.me/SebievTL" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl bg-white flex items-center justify-center hover:bg-emerald-600 hover:text-white transition-all border border-slate-200 shadow-sm"><MessageSquare size={18} /></a>
              <a href="mailto:Ahmed1155@mail.ru" className="w-10 h-10 rounded-xl bg-white flex items-center justify-center hover:bg-emerald-600 hover:text-white transition-all border border-slate-200 shadow-sm"><Mail size={18} /></a>
              <a href="https://github.com/AhmedSebiev" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl bg-white flex items-center justify-center hover:bg-emerald-600 hover:text-white transition-all border border-slate-200 shadow-sm"><Github size={18} /></a>
            </div>
          </div>
          <div>
            <h5 className="font-bold uppercase text-[10px] tracking-widest text-slate-400 mb-8">Навигация</h5>
            <ul className="space-y-4 font-bold text-sm">
              <li><button onClick={() => { setActiveTab('portfolio'); window.scrollTo({top:0, behavior:'smooth'}); }} className="hover:text-emerald-600 transition-colors uppercase tracking-tight">Портфолио проектов</button></li>
              <li><button onClick={() => { setActiveTab('pricing'); window.scrollTo({top:0, behavior:'smooth'}); }} className="hover:text-emerald-600 transition-colors uppercase tracking-tight">Цены и калькулятор</button></li>
            </ul>
          </div>
          <div className="space-y-6">
            <h5 className="font-bold uppercase text-[10px] tracking-widest text-slate-400 mb-8">Прямая связь</h5>
            <div className="space-y-4 font-bold text-sm">
              <p>Telegram: <a href="https://t.me/SebievTL" target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:underline">@SebievTL</a></p>
              <p>Моб. телефон: <a href="tel:89259409404" className="text-emerald-600 hover:underline">8 925 940-94-04</a></p>
              <p>Email: <a href="mailto:Ahmed1155@mail.ru" className="text-emerald-600 hover:underline">Ahmed1155@mail.ru</a></p>
              <p className="text-slate-400 font-medium text-xs">Доступен для обсуждения: Пн — Пт, 10:00 — 20:00 МСК</p>
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
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 35, stiffness: 400 }}
              className="fixed right-0 bottom-0 left-0 sm:left-auto top-0 sm:top-0 w-full max-w-xl bg-white z-[100] shadow-2xl flex flex-col overflow-hidden h-full sm:h-full rounded-t-[2.5rem] sm:rounded-none"
            >
              {/* PULL BAR ON MOBILE */}
              <div className="sm:hidden w-full flex justify-center pt-3 pb-2 shrink-0">
                <div className="w-10 h-1 bg-slate-100 rounded-full" />
              </div>

              <div className="flex justify-between items-center px-6 sm:px-12 py-3 sm:py-6 shrink-0 bg-white z-20 border-b border-slate-50">
                <AnimatePresence mode="wait">
                  {!isFormSubmitted ? (
                    <motion.div 
                      key="header-form"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                    >
                      <h3 className="text-xl sm:text-2xl font-black tracking-tight uppercase italic">Новый проект</h3>
                      {formState.tier && <span className="text-[10px] font-bold text-emerald-600 uppercase mt-0.5 block">Выбран тариф: {formState.tier}</span>}
                    </motion.div>
                  ) : (
                    <motion.div 
                      key="header-success"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center text-white">
                          <CheckCircle2 size={16} />
                        </div>
                        <h3 className="text-xl font-black tracking-tight text-emerald-600 uppercase italic">Отправлено</h3>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
                <button 
                  onClick={closeContact}
                  className="w-10 h-10 rounded-full hover:bg-slate-50 flex items-center justify-center transition-colors text-slate-400 hover:text-slate-950"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto px-6 sm:px-12 py-8 sm:py-10 custom-scrollbar overscroll-contain">
                <AnimatePresence mode="wait">
                  {!isFormSubmitted ? (
                    <motion.form 
                      key="form-fields"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      onSubmit={handleApply} 
                      className="space-y-8 sm:space-y-10"
                    >
                      {formError && (
                        <motion.div 
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="p-4 bg-rose-50 text-rose-600 text-[10px] font-black uppercase tracking-widest rounded-2xl border border-rose-100 mb-6"
                        >
                          {formError}
                        </motion.div>
                      )}
                      
                      <div className="space-y-6 sm:space-y-8">
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Как вас зовут?</label>
                          <input 
                            required
                            type="text" 
                            name="name"
                            autoComplete="name"
                            placeholder="Имя или Название"
                            className="w-full px-5 py-3.5 sm:px-6 sm:py-4 rounded-xl sm:rounded-2xl bg-slate-50 border border-slate-100 focus:bg-white focus:border-emerald-500 transition-all font-bold text-slate-900 outline-none text-sm sm:text-base shadow-sm" 
                            value={formState.name}
                            onChange={e => setFormState({...formState, name: e.target.value})}
                          />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                          <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Телефон</label>
                            <input 
                              required
                              type="tel" 
                              name="phone"
                              inputMode="tel"
                              autoComplete="tel"
                              placeholder="+7 (___) ___ __ __"
                              className="w-full px-5 py-3.5 sm:px-6 sm:py-4 rounded-xl sm:rounded-2xl bg-slate-50 border border-slate-100 focus:bg-white focus:border-emerald-500 transition-all font-bold text-slate-900 outline-none text-sm sm:text-base shadow-sm" 
                              value={formState.phone}
                              onChange={e => setFormState({...formState, phone: e.target.value})}
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Telegram / Email</label>
                            <input 
                              required
                              type="text" 
                              name="contact"
                              autoComplete="off"
                              placeholder="@username / mail"
                              className="w-full px-5 py-3.5 sm:px-6 sm:py-4 rounded-xl sm:rounded-2xl bg-slate-50 border border-slate-100 focus:bg-white focus:border-emerald-500 transition-all font-bold text-slate-900 outline-none text-sm sm:text-base shadow-sm" 
                              value={formState.contact}
                              onChange={e => setFormState({...formState, contact: e.target.value})}
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Опишите задачу</label>
                          <textarea 
                            required
                            rows={4} 
                            placeholder="Расскажите немного о вашем проекте..."
                            className="w-full px-5 py-3.5 sm:px-6 sm:py-4 rounded-xl sm:rounded-2xl bg-slate-50 border border-slate-100 focus:bg-white focus:border-emerald-500 transition-all font-bold text-slate-900 outline-none resize-none text-sm sm:text-base shadow-sm" 
                            value={formState.message}
                            onChange={e => setFormState({...formState, message: e.target.value})}
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-6 sm:space-y-8 pb-10">
                        <button 
                          disabled={isSubmitting}
                          type="submit" 
                          className={cn(
                            "w-full bg-slate-950 text-white py-4 sm:py-5 rounded-xl sm:rounded-2xl font-black uppercase tracking-widest text-xs sm:text-sm shadow-2xl transition-all active:scale-95 flex items-center justify-center gap-2 sm:gap-3 hover:bg-emerald-600 group",
                            isSubmitting && "opacity-50 cursor-not-allowed"
                          )}
                        >
                          {isSubmitting ? 'Отправка...' : (
                            <>
                              <span>Обсудить задачу</span>
                              <Send size={16} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                            </>
                          )}
                        </button>
                        
                        <div className="space-y-4 sm:space-y-6">
                          <div className="flex items-center gap-4">
                            <div className="h-px bg-slate-100 flex-1" />
                            <p className="text-[9px] font-black text-slate-300 uppercase tracking-[0.3em]">Мессенджеры</p>
                            <div className="h-px bg-slate-100 flex-1" />
                          </div>
                          
                          <div className="grid grid-cols-2 gap-3 sm:gap-4">
                            <a 
                              href={`https://t.me/SebievTL?text=${encodeURIComponent(`Привет! Я с сайта ${window.location.host}. Хочу обсудить проект.`)}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center justify-center gap-2 py-3.5 sm:py-4 bg-slate-50 rounded-xl sm:rounded-2xl border border-slate-100 hover:bg-white hover:border-emerald-200 transition-all text-slate-900"
                            >
                              <MessageSquare size={16} className="text-emerald-500" />
                              <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest">Telegram</span>
                            </a>
                            <a 
                              href={`https://wa.me/79259409404?text=${encodeURIComponent(`Привет! Пишу по поводу разработки проекта.`)}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center justify-center gap-2 py-3.5 sm:py-4 bg-slate-50 rounded-xl sm:rounded-2xl border border-slate-100 hover:bg-white hover:border-emerald-200 transition-all text-slate-900"
                            >
                              <Phone size={16} className="text-emerald-500" />
                              <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest">WhatsApp</span>
                            </a>
                          </div>
                        </div>
                      </div>
                    </motion.form>
                  ) : (
                    <motion.div 
                      key="success-message"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="flex flex-col items-center text-center space-y-10 py-12"
                    >
                      <div className="relative">
                        <div className="w-24 h-24 bg-emerald-600 rounded-3xl flex items-center justify-center text-white shadow-2xl rotate-3">
                           <Rocket size={40} className="text-white" />
                           <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-white rounded-xl flex items-center justify-center text-emerald-600 shadow-xl border-4 border-emerald-50">
                              <CheckCircle2 size={20} strokeWidth={3} />
                           </div>
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <h4 className="text-2xl font-black text-slate-900 uppercase tracking-tighter italic">Заявка в работе</h4>
                        <p className="text-slate-500 font-medium text-sm leading-relaxed max-w-[280px] mx-auto">
                           {formState.name}, спасибо! Начинаю изучать данные. Свяжусь в ближайшее время.
                        </p>
                      </div>

                      <div className="w-full space-y-3 pt-6">
                         <button 
                           onClick={downloadCP}
                           className="w-full bg-emerald-600 text-white py-4 rounded-xl text-xs font-black uppercase tracking-widest shadow-xl shadow-emerald-500/20 transition-all active:scale-95 flex items-center justify-center gap-3 hover:bg-emerald-700"
                         >
                           <Download size={18} />
                           <span>Скачать смету (PDF)</span>
                         </button>

                         <button 
                           onClick={closeContact}
                           className="w-full py-4 text-slate-400 hover:text-slate-900 text-[10px] font-black uppercase tracking-[0.2em] transition-colors"
                         >
                           Закрыть окно
                         </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="shrink-0 px-12 py-6 bg-slate-50 border-t border-slate-100 hidden sm:block">
                <div className="flex justify-between items-center text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">
                  <span>Ahmed Sebiev IT</span>
                  <span>v2026.05</span>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
