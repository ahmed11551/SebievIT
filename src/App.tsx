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
      className="text-3xl sm:text-4xl font-black tracking-tighter text-slate-950 uppercase"
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
    if (!formState.phone.match(/^\+?[\d\s-]{10,24}$/)) {
      setFormError('Пожалуйста, введите корректный номер телефона (минимум 10 цифр).');
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
    <div className="min-h-screen font-sans selection:bg-emerald-100 selection:text-emerald-900 scroll-smooth overflow-x-hidden w-full mesh-background relative">
      <div className="fixed inset-0 pointer-events-none noise-filter z-0" />
      
      {/* PROGRESS BAR */}
      <motion.div className="fixed top-0 left-0 right-0 h-1 bg-emerald-600 origin-left z-[100]" style={{ scaleX }} />

      {/* HEADER */}
      <header className="sticky top-0 z-50 bg-white/70 backdrop-blur-2xl border-b border-slate-100 w-full overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 h-24 flex justify-between items-center relative">
          <div className="flex items-center gap-4 group cursor-pointer" onClick={() => (window.scrollTo({top:0, behavior:'smooth'}), setActiveTab('portfolio'))}>
            <div className="w-12 h-12 bg-emerald-600 rounded-2xl flex items-center justify-center text-white shadow-2xl transition-all hover:bg-emerald-700 hover:rotate-6 shrink-0">
               <Cpu size={28} />
            </div>
            <div className="flex flex-col">
              <h1 className="text-2xl font-black tracking-tighter text-slate-950 uppercase leading-none">
                SEBIEV <span className="text-emerald-600">FULLSTACK</span>
              </h1>
              <div className="flex gap-2 text-[9px] font-black text-slate-400 mt-1 uppercase tracking-[0.2em] leading-none">
                <span className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Fullstack Engineering
                </span>
                <span className="opacity-20">•</span>
                <span>Rel. 2026</span>
              </div>
            </div>
          </div>

          <nav className="hidden md:flex gap-1 bg-slate-50 p-1.5 rounded-2xl border border-slate-200/50">
            {[
              { id: 'portfolio', label: 'Портфолио' },
              { id: 'pricing', label: 'Цены' }
            ].map((tab) => (
              <button 
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={cn(
                  "px-8 py-2.5 rounded-xl text-[10px] font-black transition-all uppercase tracking-widest",
                  activeTab === tab.id ? "bg-emerald-600 text-white shadow-xl shadow-emerald-500/20" : "text-slate-500 hover:text-slate-950"
                )}
              >
                {tab.label}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsContactOpen(true)}
              className="sleek-button-primary px-8"
            >
              Начать проект
            </button>
          </div>
        </div>
      </header>

      {/* MOBILE BOTTOM NAV */}
          <nav className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 bg-slate-950/90 backdrop-blur-xl border border-white/10 p-2 rounded-2xl flex gap-1 z-50 shadow-2xl">
        {[
          { id: 'portfolio', label: 'Портфолио', icon: Briefcase },
          { id: 'pricing', label: 'Цены', icon: Zap }
        ].map((tab) => (
          <button 
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={cn(
              "flex flex-col items-center gap-1 px-4 sm:px-8 py-2 rounded-xl transition-all",
              activeTab === tab.id ? "bg-emerald-600 text-white" : "text-white/60 hover:text-white"
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
                    <span className="inline-block px-4 py-1 bg-emerald-50 text-emerald-700 text-[10px] font-bold uppercase tracking-widest rounded-full border border-emerald-100">
                       Senior IT-Architect • Highload & Security Expert
                    </span>
                      <motion.h2 
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        className="text-[clamp(2.5rem,8vw,6.5rem)] font-black tracking-tighter text-slate-950 leading-[0.85] uppercase break-words text-balance"
                      >
                        SEBIEV <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-emerald-500 to-cyan-500">FULLSTACK.</span>
                      </motion.h2>
                    <p className="text-xl text-slate-500 max-w-2xl font-medium leading-relaxed">
                      Любые системы: CMS, Bitrix или кастомный код. 
                      Фокус на окупаемости и техническом совершенстве.
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-4">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 p-6 sm:p-8 sleek-card w-full sm:w-auto relative group overflow-hidden border-emerald-100/50">
                      <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      <div className="flex flex-col relative z-10 transition-transform group-hover:translate-x-1">
                        <span className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.2em] mb-1">Elite Engineering Rate</span>
                        <span className="text-3xl font-black text-slate-950 tracking-tighter italic">250 000 ₽ <span className="text-sm not-italic opacity-40">+</span></span>
                      </div>
                      <div className="hidden sm:block w-px h-12 bg-slate-200 relative z-10 mx-4" />
                      <div className="flex flex-col relative z-10 transition-transform group-hover:translate-x-1">
                        <span className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.2em] mb-1">Projects Launched</span>
                        <span className="text-3xl font-black text-slate-950 tracking-tighter italic">100 <span className="text-sm not-italic opacity-40">+</span></span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4">
                     <button 
                       onClick={() => setIsContactOpen(true)}
                       className="flex-1 sleek-button-primary flex items-center justify-center gap-3 py-4 shadow-xl shadow-emerald-200 active:scale-95 transition-all"
                     >
                       <AnimatedIcon icon={MessageSquare} size={20} />
                       <span className="font-black uppercase tracking-tighter">Обсудить проект</span>
                     </button>
                     <a 
                       href="tel:89259409404" 
                       className="flex-1 sleek-button-secondary flex items-center justify-center gap-3 py-4 border-slate-200 active:scale-95 transition-all"
                     >
                       <AnimatedIcon icon={Phone} size={20} />
                       <span className="font-black uppercase tracking-tighter">Связаться голосом</span>
                     </a>
                     <button 
                       onClick={sharePortfolio} 
                       className="w-14 h-14 hidden sm:flex items-center justify-center bg-white border border-slate-200 rounded-2xl hover:bg-slate-50 transition-colors shrink-0 shadow-sm"
                     >
                       <AnimatedIcon icon={Share2} size={20} />
                     </button>
                  </div>
                </div>

                <div className="w-full lg:w-1/3 order-first lg:order-last">
                  <div className="bg-emerald-600 p-6 sm:p-10 rounded-[3rem] text-white shadow-2xl relative overflow-hidden group border border-white/20">
                    <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <motion.div 
                      animate={{ rotate: [0, 10, 0] }}
                      transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
                      className="absolute -top-6 -right-6 text-white/10 blur-sm"
                    >
                      <ShieldCheck size={120} />
                    </motion.div>
                    <h4 className="text-xl sm:text-2xl font-black mb-6 uppercase italic">Архитектура стека</h4>
                    <div className="space-y-6">
                      {[
                        { label: 'Стабильность сервера', val: 'Enterprise (NestJS)', icon: Code2, color: 'text-white' },
                        { label: 'Uptime 99.9%', val: 'K8s Масштабирование', icon: Server, color: 'text-white' },
                        { label: 'Скорость доступа', val: 'Low-latency архитектура', icon: Database, color: 'text-white' },
                        { label: 'Интерфейс', val: 'High-End UX/UI системы', icon: Globe, color: 'text-white' }
                      ].map((s, i) => (
                        <div key={i} className="flex gap-4 items-start">
                          <div className={cn("p-2 bg-white/10 rounded-lg shrink-0 border border-white/20", s.color)}><s.icon size={16} /></div>
                          <div className="space-y-1">
                            <div className="text-[10px] font-bold text-emerald-100 uppercase tracking-widest">{s.label}</div>
                            <div className="text-sm font-bold text-white">{s.val}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-8 pt-8 border-t border-white/20 flex justify-between items-center text-[10px] font-mono text-emerald-100">
                      <span>ЛИЦЕНЗИРОВАН</span>
                      <span>v2.1.25</span>
                    </div>
                  </div>
                </div>
              </section>

              {/* EXPERIENCE & PROJECTS */}
              <section>
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-8">
                  <SectionHeading 
                    subtitle="Кейсы с подтвержденной окупаемостью и масштабируемостью."
                    hasDiscount
                  >
                    Инвестиционное портфолио
                  </SectionHeading>
                  <div className="flex gap-2 p-1 bg-slate-100 rounded-xl overflow-x-auto pb-2 md:pb-1 scrollbar-hide">
                    {[
                      { id: 'All', label: 'Все' },
                      { id: 'Backend', label: 'Бэкенд' },
                      { id: 'Web', label: 'Веб' },
                      { id: 'Infra', label: 'Инфра' }
                    ].map(f => (
                      <button 
                        key={f.id}
                        onClick={() => setProjectFilter(f.id as any)}
                        aria-label={`Фильтровать по ${f.label}`}
                        className={cn(
                          "px-4 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap",
                          projectFilter === f.id ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700 hover:bg-white/50"
                        )}
                      >
                        {f.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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
                        whileHover={{ y: -5, scale: 1.02 }}
                        className="p-6 bg-white border border-slate-200 rounded-3xl hover:shadow-2xl hover:border-emerald-100 transition-all cursor-default"
                      >
                        <div className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest mb-2">{proj.category}</div>
                        <h4 className="font-black text-slate-950 mb-2 uppercase tracking-tighter">{proj.title}</h4>
                        <p className="text-xs text-slate-500 mb-4 font-medium">{proj.desc}</p>
                        <div className="flex flex-wrap gap-1">
                          {proj.tags.map(t => <span key={t} className="px-2 py-0.5 bg-slate-50 text-[9px] font-bold text-slate-400 rounded-md border border-slate-100">{t}</span>)}
                        </div>
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
              <div className="bg-emerald-50 rounded-[3rem] p-8 sm:p-12 lg:p-20 text-slate-900 relative overflow-hidden shadow-sm border border-emerald-100">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-200/20 rounded-full blur-[120px] -mr-32 -mt-32" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-cyan-200/20 rounded-full blur-[100px] -ml-32 -mb-32" />
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 relative z-10">
                  <div className="space-y-12">
                     <div>
                       <h3 className="text-3xl font-black mb-4 uppercase tracking-tighter italic">Расчет окупаемости</h3>
                       <p className="text-slate-500 font-medium">Выберите технологическое ядро и дополнительные модули для точной оценки стоимости.</p>
                     </div>

                     <div className="space-y-8">
                       <div className="space-y-4">
                         <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                           <Layers size={12} className="text-emerald-500" />
                           Технологическое ядро
                         </label>
                         <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                           {CALCULATOR_OPTIONS.cms.map(c => (
                             <button 
                               key={c.id} 
                               onClick={() => setCalcCMS(c.id)}
                               className={cn(
                                 "px-6 py-4 rounded-2xl border text-sm font-bold transition-all text-left relative overflow-hidden group min-h-[140px] flex flex-col justify-between",
                                 calcCMS === c.id ? "bg-white text-slate-950 border-emerald-200 shadow-xl scale-[1.02]" : "bg-white/50 border-slate-200 hover:border-emerald-300 hover:bg-white"
                               )}
                             >
                                {calcCMS === c.id && <motion.div layoutId="calcCMSactive" className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-600" />}
                                <div className="space-y-1">
                                  <div className="text-sm font-black uppercase tracking-tighter">{c.label}</div>
                                  <div className={cn("text-[9px] font-medium leading-tight pr-2", calcCMS === c.id ? "text-slate-500" : "text-slate-400")}>
                                    {c.desc}
                                  </div>
                                </div>
                                <div className={cn("mt-4 text-xs font-mono font-bold", calcCMS === c.id ? "text-emerald-600" : "text-emerald-500")}>
                                  {c.price > 0 ? `${c.price.toLocaleString()} ₽` : 'Стандарт индустрии'}
                                </div>
                             </button>
                           ))}
                         </div>
                       </div>

                       <div className="space-y-4">
                         <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                           <Zap size={12} className="text-emerald-500" />
                           Формат разработки
                         </label>
                         <div className="flex flex-col sm:flex-row gap-3">
                           {CALCULATOR_OPTIONS.type.map(t => (
                             <button 
                               key={t.id} 
                               onClick={() => setCalcType(t.id)}
                               className={cn(
                                 "flex-1 px-6 py-4 rounded-2xl border text-sm font-bold transition-all text-left relative overflow-hidden min-h-[100px] flex flex-col justify-between",
                                 calcType === t.id ? "bg-white text-slate-900 border-emerald-200 shadow-xl scale-[1.02]" : "bg-white/50 border-slate-200 hover:border-emerald-300 hover:bg-white"
                               )}
                             >
                                {calcType === t.id && <motion.div layoutId="calcTypeactive" className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-600" />}
                                <div className="space-y-1">
                                  <div className="text-sm font-black uppercase tracking-tighter">{t.label}</div>
                                  <div className={cn("text-[9px] font-medium leading-tight", calcType === t.id ? "text-slate-500" : "text-slate-400")}>
                                    {t.desc}
                                  </div>
                                </div>
                                <div className={cn("mt-2 text-[9px] font-mono font-bold", calcType === t.id ? "text-emerald-600" : "text-emerald-500")}>
                                  {t.price > 0 ? `+ ${t.price.toLocaleString()} ₽` : 'Базовая лицензия'}
                                </div>
                             </button>
                           ))}
                         </div>
                       </div>

                       <div className="space-y-4">
                         <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                           <Cpu size={12} className="text-emerald-500" />
                           Дополнительно
                         </label>
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
                                 calcFeatures.includes(f.id) ? "bg-emerald-600 text-white border-emerald-600 shadow-lg" : "bg-white/50 border-slate-200 hover:border-emerald-300 hover:bg-white"
                               )}
                             >
                               <div className="w-full">
                                 <div className="text-sm font-bold flex justify-between items-start mb-1 gap-2">
                                   <span>{f.label}</span>
                                   <PlusCircle size={14} className={cn("transition-transform shrink-0", calcFeatures.includes(f.id) ? "rotate-45" : "")} />
                                 </div>
                                 <div className={cn("text-[9px] font-medium leading-tight mb-2", calcFeatures.includes(f.id) ? "text-emerald-100" : "text-slate-400")}>
                                   {(f as any).desc}
                                 </div>
                                 <div className={cn("text-[10px] font-mono", calcFeatures.includes(f.id) ? "text-white" : "text-emerald-600")}>
                                   + {f.price.toLocaleString()} ₽
                                 </div>
                               </div>
                             </button>
                           ))}
                         </div>
                       </div>
                     </div>
                  </div>

                  <div className="lg:sticky lg:top-32 bg-white text-slate-900 rounded-[2.5rem] p-6 sm:p-10 flex flex-col justify-between h-fit shadow-2xl border border-emerald-100 relative">
                    <div className="absolute -top-4 -left-4 flex flex-col gap-2">
                      <div className="bg-emerald-600 text-white text-[10px] font-bold px-4 py-2 rounded-full uppercase tracking-widest shadow-lg flex items-center gap-2">
                        <Tag size={12} />
                        <span>Скидка -40% активирована</span>
                      </div>
                      <div className="bg-white text-slate-900 border border-emerald-100 text-[10px] font-bold px-4 py-2 rounded-full uppercase tracking-widest shadow-lg flex items-center gap-2">
                         <ShieldCheck size={12} className="text-emerald-600" />
                         <span>Гарантия 1 год</span>
                      </div>
                    </div>
                    <div className="space-y-6 pt-4">
                       <div className="space-y-4">
                          <div className="flex justify-between items-center text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">
                             <span>Состав решения</span>
                             <span>Инвестиции</span>
                          </div>
                          <div className="space-y-4 max-h-[250px] overflow-y-auto custom-scrollbar pr-2">
                             <div className="flex justify-between items-center text-sm font-bold">
                                <span className="text-slate-700">Ядро: {selectedCMS?.label}</span>
                                <div className="text-right flex flex-col items-end">
                                  <span className="line-through text-slate-300 text-[10px] whitespace-nowrap">{(selectedCMS?.price || 0).toLocaleString('ru-RU')} ₽</span>
                                  <span className="text-emerald-600 whitespace-nowrap font-mono tracking-tighter">{((selectedCMS?.price || 0) * 0.6).toLocaleString('ru-RU')} ₽</span>
                                </div>
                             </div>
                             {selectedType && selectedType.price !== 0 && (
                               <div className="flex justify-between items-center text-sm font-medium">
                                  <span className="text-slate-500">{selectedType.label}</span>
                                  <div className="text-right flex flex-col items-end">
                                    <span className="line-through text-slate-300 text-[10px] whitespace-nowrap">+{selectedType.price.toLocaleString('ru-RU')} ₽</span>
                                    <span className="text-slate-900 whitespace-nowrap font-mono tracking-tighter">+{(selectedType.price * 0.6).toLocaleString('ru-RU')} ₽</span>
                                  </div>
                               </div>
                             )}
                             {selectedFeaturesList.map(f => (
                               <div key={f.id} className="flex justify-between items-center text-sm font-medium">
                                  <span className="text-slate-500">{f.label}</span>
                                  <div className="text-right flex flex-col items-end">
                                    <span className="line-through text-slate-300 text-[10px] whitespace-nowrap">+{f.price.toLocaleString('ru-RU')} ₽</span>
                                    <span className="text-slate-900 whitespace-nowrap font-mono tracking-tighter">+{(f.price * 0.6).toLocaleString('ru-RU')} ₽</span>
                                  </div>
                               </div>
                             ))}
                             
                             <div className="pt-2 mt-2 border-t border-slate-50 space-y-1">
                               <div className="flex justify-between text-[10px] font-black text-emerald-600 uppercase">
                                 <span>SEO Оптимизация</span>
                                 <span>Включено</span>
                               </div>
                               <div className="flex justify-between text-[10px] font-black text-emerald-600 uppercase">
                                 <span>Безопасность (OWASP)</span>
                                 <span>Включено</span>
                               </div>
                             </div>
                          </div>
                       </div>
                       
                       <div className="pt-6 border-t-2 border-dashed border-slate-100 space-y-4">
                         <div className="flex justify-between items-end">
                            <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">Итоговая оценка</div>
                            <div className="text-xs font-bold text-rose-500 uppercase flex items-center gap-1">
                               <Percent size={10} />
                               Экономия 40%
                            </div>
                         </div>
                         <div className="flex items-baseline gap-2 flex-wrap">
                           <div className="text-4xl sm:text-5xl font-bold tracking-tighter text-slate-900 leading-none font-mono whitespace-nowrap">
                             {calculateTotal().toLocaleString('ru-RU')} <span className="text-xl font-normal text-slate-400">₽</span>
                           </div>
                           <div className="text-base font-bold text-slate-300 line-through font-mono whitespace-nowrap">
                             {getOriginalTotal().toLocaleString('ru-RU')} ₽
                           </div>
                         </div>
                       </div>

                       <div className="space-y-3 pt-2">
                          <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                             <span>Срок реализации</span>
                             <span className="text-slate-900">от 10 рабочих дней</span>
                          </div>
                          <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                             <span>Тех. поддержка</span>
                             <span className="text-slate-900">Бесплатно 1 год</span>
                          </div>
                       </div>
                    </div>
                    <button 
                      onClick={() => setIsContactOpen(true)}
                      className="w-full bg-emerald-600 text-white py-5 rounded-2xl font-black text-base mt-10 hover:bg-emerald-700 transition-all active:scale-95 shadow-xl shadow-emerald-500/20 flex items-center justify-center gap-3 uppercase tracking-tighter"
                    >
                      <span>Зафиксировать скидку</span>
                      <ChevronRight size={18} />
                    </button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {PRICING_TIERS.map((tier) => {
                  const originalPriceValue = parseInt(tier.price.replace(/[^\d]/g, ''));
                  const discountedPrice = Math.round(originalPriceValue * 0.6).toLocaleString('ru-RU');
                  const originalPrice = originalPriceValue.toLocaleString('ru-RU');

                  return (
                    <motion.div 
                      key={tier.id} 
                      whileHover={{ y: -5, scale: 1.01 }}
                      className={cn("sleek-card p-6 sm:p-10 flex flex-col items-start relative overflow-hidden transition-shadow hover:shadow-2xl hover:shadow-emerald-500/10", tier.recommended && "ring-2 ring-slate-900 shadow-2xl")}
                    >
                      {tier.recommended && <div className="absolute top-4 right-4 bg-slate-900 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase">Выбор рынка</div>}
                      <div className="absolute -right-8 top-4 rotate-45 bg-rose-500 text-white text-[8px] font-bold px-8 py-1 uppercase tracking-tighter shadow-lg z-20">Скидка -40%</div>
                      
                      <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">{tier.name}</h4>
                      <div className="flex flex-col mb-6">
                        <div className="text-sm font-bold text-slate-300 line-through font-mono whitespace-nowrap">от {originalPrice} ₽</div>
                        <div className="text-3xl sm:text-4xl font-bold text-slate-900 font-mono tracking-tighter leading-none whitespace-nowrap">от {discountedPrice} ₽</div>
                      </div>
                      
                      <p className="text-sm text-slate-500 mb-8 font-medium min-h-[3rem] leading-relaxed text-balance">{tier.description}</p>
                      <div className="space-y-4 mb-8 flex-1 w-full">
                        {tier.features.map((f, i) => (
                          <div key={i} className="flex items-start gap-3 text-sm font-bold text-slate-700">
                            <CheckCircle2 size={18} className="text-emerald-500 shrink-0 mt-0.5" />
                            <span className="leading-tight">{f}</span>
                          </div>
                        ))}
                      </div>

                      <div className="w-full bg-slate-50 p-4 rounded-xl mb-8 space-y-2 border border-slate-100">
                         <div className="flex items-center gap-2 text-[9px] font-bold text-emerald-600 uppercase tracking-widest">
                            <ShieldCheck size={12} />
                            <span>Безопасность (Enterprise)</span>
                         </div>
                         <div className="flex items-center gap-2 text-[9px] font-bold text-emerald-600 uppercase tracking-widest">
                            <TrendingUp size={12} />
                            <span>Микроразметка & SEO</span>
                         </div>
                      </div>

                      <button 
                        onClick={() => {setFormState({...formState, tier: tier.name}); setIsContactOpen(true);}}
                        className={cn("w-full py-4 rounded-xl font-black transition-all active:scale-95 uppercase tracking-widest text-[10px]", tier.recommended ? "bg-emerald-600 text-white shadow-xl shadow-emerald-500/20" : "bg-slate-100 text-slate-600 hover:bg-slate-200")}
                      >
                        Запустить проект
                      </button>
                    </motion.div>
                  );
                })}
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
                className="flex-1 overflow-y-auto pr-2 custom-scrollbar scroll-smooth"
              >
                <AnimatePresence mode="wait">
                  {!isFormSubmitted ? (
                    <motion.form 
                      key="form-fields"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      onSubmit={handleApply} 
                      className="space-y-6 pt-2 pb-10"
                    >
                      {formError && (
                        <motion.div 
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          className="p-3 bg-rose-50 text-rose-600 text-xs font-bold rounded-xl border border-rose-100"
                        >
                          {formError}
                        </motion.div>
                      )}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-6">
                        <div className="space-y-1 group relative">
                          <input 
                            required
                            autoFocus
                            type="text" 
                            name="name"
                            autoComplete="name"
                            className="peer w-full py-3 border-b border-slate-200 focus:outline-none focus:border-emerald-500 transition-colors font-black text-lg bg-transparent uppercase tracking-tighter" 
                            placeholder=" "
                            value={formState.name}
                            onChange={e => setFormState({...formState, name: e.target.value})}
                          />
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2 absolute top-0 left-0 transition-all pointer-events-none peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-placeholder-shown:text-slate-400 peer-focus:top-0 peer-focus:text-[10px] peer-focus:text-emerald-600">
                             Как вас зовут?
                          </label>
                        </div>
                        <div className="space-y-1 group relative">
                          <input 
                            required
                            type="tel" 
                            name="tel"
                            autoComplete="tel"
                            className="peer w-full py-3 border-b border-slate-200 focus:outline-none focus:border-emerald-500 transition-colors font-black text-lg bg-transparent uppercase tracking-tighter" 
                            placeholder=" "
                            value={formState.phone}
                            onChange={e => setFormState({...formState, phone: e.target.value})}
                          />
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2 absolute top-0 left-0 transition-all pointer-events-none peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-placeholder-shown:text-slate-400 peer-focus:top-0 peer-focus:text-[10px] peer-focus:text-emerald-600">
                             Телефон
                          </label>
                        </div>
                      </div>
                      
                        <div className="space-y-1 group relative">
                          <input 
                            required
                            type="text" 
                            name="contact"
                            autoComplete="off"
                            className="peer w-full py-3 border-b border-slate-200 focus:outline-none focus:border-emerald-500 transition-colors font-black text-lg bg-transparent uppercase tracking-tighter" 
                            placeholder=" "
                            value={formState.contact}
                            onChange={e => setFormState({...formState, contact: e.target.value})}
                          />
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2 absolute top-0 left-0 transition-all pointer-events-none peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-placeholder-shown:text-slate-400 peer-focus:top-0 peer-focus:text-[10px] peer-focus:text-emerald-600">
                             Email или Telegram
                          </label>
                        </div>

                      <div className="space-y-1 group relative">
                        <textarea 
                          required
                          rows={2} 
                          className="peer w-full py-3 border-b border-slate-200 focus:outline-none focus:border-emerald-500 transition-colors font-bold text-lg resize-none bg-transparent" 
                          placeholder=" "
                          value={formState.message}
                          onChange={e => setFormState({...formState, message: e.target.value})}
                        />
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2 absolute top-0 left-0 transition-all pointer-events-none peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-placeholder-shown:text-slate-400 peer-focus:top-0 peer-focus:text-[10px] peer-focus:text-emerald-500">
                           Опишите задачу
                        </label>
                      </div>
                      
                      <div className="pt-6">
                        <button 
                          disabled={isSubmitting}
                          type="submit" 
                          className={cn(
                            "w-full bg-slate-900 text-white py-5 rounded-2xl text-lg font-bold shadow-2xl transition-all active:scale-95 flex items-center justify-center gap-3 hover:bg-slate-800",
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
                        
                        <div className="mt-8 flex flex-col items-center gap-3">
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest border-t border-slate-100 w-full pt-8 text-center">Или свяжитесь напрямую</p>
                          <div className="flex gap-2 w-full">
                            <a 
                              href={`https://t.me/SebievTL?text=${encodeURIComponent(`Привет! Я с сайта ${window.location.host}. Хочу обсудить проект.`)}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex-1 flex items-center justify-center gap-2 text-slate-900 font-bold hover:text-emerald-600 transition-colors py-3 bg-slate-50 rounded-2xl border border-slate-200 hover:bg-white"
                            >
                              <MessageSquare size={18} className="text-emerald-500" />
                              <span>Telegram</span>
                            </a>
                            <a 
                              href={`https://wa.me/79259409404?text=${encodeURIComponent(`Привет! Пишу по поводу разработки проекта.`)}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex-1 flex items-center justify-center gap-2 text-slate-900 font-bold hover:text-emerald-600 transition-colors py-3 bg-slate-50 rounded-2xl border border-slate-200 hover:bg-white"
                            >
                              <Phone size={18} className="text-emerald-500" />
                              <span>WhatsApp</span>
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
                      className="flex flex-col items-center text-center space-y-8 py-4"
                    >
                      <div className="relative">
                        <div className="w-24 h-24 bg-emerald-600 rounded-2xl flex items-center justify-center text-white shadow-2xl rotate-3">
                           <Code2 size={48} className="text-white" />
                           <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-white rounded-lg flex items-center justify-center text-emerald-600 shadow-lg -rotate-12">
                              <CheckCircle2 size={16} strokeWidth={3} />
                           </div>
                        </div>
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
                           className="w-full bg-emerald-600 text-white py-5 rounded-2xl text-lg font-bold shadow-xl shadow-emerald-500/20 transition-all active:scale-95 flex items-center justify-center gap-3 border-2 border-emerald-600 hover:bg-white hover:text-emerald-700 group"
                         >
                           <Download size={20} className="group-hover:translate-y-1 transition-transform" />
                           <span>Скачать КП (PDF)</span>
                         </button>

                         <a 
                            href={`https://t.me/SebievTL?text=${encodeURIComponent(`Ахмед, я только что отправил расчет проекта с сайта! Меня зовут ${formState.name}.`)}`} 
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full bg-slate-50 text-slate-900 py-5 rounded-2xl text-lg font-bold border border-slate-200 transition-all active:scale-95 flex items-center justify-center gap-3 hover:bg-white hover:border-emerald-200"
                         >
                            <MessageSquare size={20} className="text-emerald-500" />
                            <span>Написать в Telegram</span>
                         </a>

                         <button 
                           onClick={closeContact}
                           className="w-full text-slate-400 font-bold py-4 hover:text-slate-900 transition-colors uppercase tracking-widest text-[10px]"
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
                  <span>Moscow / 2026</span>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
