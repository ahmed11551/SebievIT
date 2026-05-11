import React, { useState, useEffect } from 'react';
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
  Quote
} from 'lucide-react';
import { cn } from './lib/utils';
import { submitLead } from './firebase';

// --- DATA ---
const REVIEWS = [
  {
    name: "Игорь Морозов",
    role: "CTO, Fintech Startup",
    text: "Ахмед — один из лучших бэкенд-инженеров, с кем мне приходилось работать. Его подход к проектированию микросервисов спас наш проект при масштабировании.",
    stars: 5
  },
  {
    name: "Елена Волкова",
    role: "Product Owner, LogiTech",
    text: "Редко встретишь разработчика, который так глубоко погружается в бизнес-логику. Решение для RabbitMQ работает как часы уже год.",
    stars: 5
  },
  {
    name: "Дмитрий К.",
    role: "Lead Architect, E-commerce",
    text: "Профилирование Node.js, которое сделал Ахмед, сократило наши расходы на сервера в 2 раза. Очень рекомендую для сложных задач.",
    stars: 5
  }
];
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

const PRICING_TIERS = [
  {
    id: "basic",
    name: "Эконом (MVP / Лендинг)",
    price: "от 120 000 ₽",
    description: "Идеально для быстрого тестирования гипотез. Профессиональный старт вашего бизнеса.",
    features: [
      "Разработка на React / Next.js / Tilda",
      "Базовая SEO-оптимизация",
      "Адаптивность (Mobile First)",
      "Интеграция с 1-2 сервисами",
      "Срок: до 14 дней"
    ],
    recommended: false
  },
  {
    id: "pro",
    name: "Стандарт (Advanced)",
    price: "от 650 000 ₽",
    description: "Полноценный продукт с кастомной бизнес-логикой и высокой нагрузкой.",
    features: [
      "Индивидуальный стек (React/NestJS)",
      "Проектирование архитектуры базы данных",
      "Личный кабинет и панель управления",
      "API интеграции любой сложности",
      "Техническая поддержка (3 мес.)"
    ],
    recommended: true
  },
  {
    id: "business",
    name: "Бизнес (SLA / High-load)",
    price: "от 2 500 000 ₽",
    description: "Промышленные решения для крупного бизнеса с заделом на миллионы пользователей.",
    features: [
      "Микросервисы & Kubernetes",
      "Брокеры сообщений (Kafka / RabbitMQ)",
      "Аудит безопасности и нагрузочные тесты",
      "Полный CI/CD пайплайн",
      "Сопровождение и SLA 99.9%"
    ],
    recommended: false
  }
];

const ADDONS = [
  { name: "Миграция с CMS (WP/Joomla)", price: "от 100 000 ₽", cat: "Development" },
  { name: "Доработка функционала", price: "7 000 ₽ / час", cat: "Hourly" },
  { name: "Аудит и Оптимизация", price: "от 150 000 ₽", cat: "Consulting" },
  { name: "Telegram Mini App", price: "от 200 000 ₽", cat: "Mobile" },
  { name: "Поддержка (Maintenance)", price: "от 40 000 ₽ / мес.", cat: "Service" }
];

const AUDIT_PLATFORMS = [
  {
    name: "Habr Career",
    region: "РФ",
    type: "Работа",
    rating: "9.8/10",
    pros: "Самая высокая концентрация топовых ИТ-офферов. Вилки 350к+ — стандарт для Senior.",
    verdict: "Ахмед, твой опыт в Т1 делает тебя желанным кандидатом здесь."
  },
  {
    name: "Toptal",
    region: "Global",
    type: "Фриланс",
    rating: "9.5/10",
    pros: "Элитный клуб 3%. Выплаты в валюте ($100+/час).",
    verdict: "Требует подготовки к скринингу, но доход в разы выше."
  }
];

// --- COMPONENTS ---

const SectionHeading = ({ children, subtitle }: { children: React.ReactNode, subtitle?: string }) => (
  <div className="mb-12">
    <motion.h2 
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      className="text-4xl font-bold tracking-tight text-slate-900"
    >
      {children}
    </motion.h2>
    {subtitle && <p className="text-slate-500 mt-2 max-w-2xl font-medium">{subtitle}</p>}
  </div>
);

export default function App() {
  const [activeTab, setActiveTab] = useState<'portfolio' | 'pricing' | 'audit'>('portfolio');
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [formState, setFormState] = useState({ name: '', contact: '', message: '', tier: '' });

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await submitLead(formState);
      alert('Заявка успешно отправлена! Ахмед свяжется с вами в ближайшее время.');
      setIsContactOpen(false);
      setFormState({ name: '', contact: '', message: '', tier: '' });
    } catch (err) {
      alert('Произошла ошибка при отправке. Пожалуйста, напишите в Telegram напрямую.');
    } finally {
      setIsSubmitting(false);
    }
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
    <div className="min-h-screen font-sans selection:bg-slate-900 selection:text-white scroll-smooth">
      {/* PROGRESS BAR */}
      <motion.div className="fixed top-0 left-0 right-0 h-1 bg-emerald-500 origin-left z-[100]" style={{ scaleX }} />

      {/* HEADER */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-xl border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
          <div className="flex flex-col">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 uppercase">
              Ахмед <span className="font-normal text-slate-500">Себиев</span>
            </h1>
            <div className="flex gap-4 text-[10px] font-mono text-slate-400 mt-0.5 uppercase tracking-widest">
              <span>Senior Fullstack Engineer</span>
              <span className="text-slate-200">•</span>
              <span>Built to Scale</span>
            </div>
          </div>

          <nav className="hidden md:flex gap-1 bg-slate-100 p-1 rounded-full border border-slate-200">
            {[
              { id: 'portfolio', label: 'Опыт' },
              { id: 'pricing', label: 'Тарифы' },
              { id: 'audit', label: 'Анализ' }
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

          <div className="flex items-center gap-4">
            <div className="hidden lg:flex flex-col items-end mr-4">
              <span className="text-[10px] font-bold text-emerald-600 uppercase">Available</span>
              <span className="text-xs font-bold text-slate-900 leading-none">Status: Ready</span>
            </div>
            <button 
              onClick={() => setIsContactOpen(true)}
              className="sleek-button-primary px-8 text-sm"
            >
              Связаться
            </button>
          </div>
        </div>
      </header>

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
                    <div className="flex items-center gap-6 p-6 sleek-card">
                      <div className="flex flex-col">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Текущий рейт</span>
                        <span className="text-2xl font-bold text-slate-900">300 000 ₽ +</span>
                      </div>
                      <div className="w-px h-10 bg-slate-200" />
                      <div className="flex flex-col">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Локация</span>
                        <span className="text-lg font-bold text-slate-900">Москва / Remote</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-4">
                     <a href="https://t.me/SebievTL" className="sleek-button-primary flex items-center gap-2">
                       <AnimatedIcon icon={MessageSquare} size={18} /> Telegram
                     </a>
                     <a href="mailto:Ahmed1155@mail.ru" className="sleek-button-secondary flex items-center gap-2">
                       <AnimatedIcon icon={Mail} size={18} /> Ahmed1155@mail.ru
                     </a>
                     <button onClick={sharePortfolio} className="w-12 h-12 flex items-center justify-center bg-slate-100 rounded-full hover:bg-slate-200 transition-colors">
                       <AnimatedIcon icon={Share2} size={18} />
                     </button>
                  </div>
                </div>

                <div className="w-full lg:w-1/3">
                  <div className="bg-slate-900 p-8 rounded-3xl text-white shadow-2xl relative overflow-hidden">
                    <motion.div 
                      animate={{ rotate: [0, 5, 0] }}
                      transition={{ repeat: Infinity, duration: 6 }}
                      className="absolute top-4 right-4 text-emerald-500"
                    >
                      <ShieldCheck size={32} />
                    </motion.div>
                    <h4 className="text-2xl font-bold mb-6">Stack Specs</h4>
                    <div className="space-y-6">
                      {[
                        { label: 'Runtime', val: 'Node.js / TS / NestJS', icon: Code2, color: 'text-blue-400' },
                        { label: 'Infrastructure', val: 'K8s / Docker / CI', icon: Server, color: 'text-purple-400' },
                        { label: 'Databases', val: 'PostgreSQL / Redis', icon: Database, color: 'text-orange-400' },
                        { label: 'Frontend', val: 'React / Next.js / Vue', icon: Globe, color: 'text-emerald-400' }
                      ].map((s, i) => (
                        <div key={i} className="flex gap-4 items-start">
                          <div className={cn("p-2 bg-white/5 rounded-lg", s.color)}><s.icon size={16} /></div>
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

              {/* EXPERIENCE */}
              <section>
                <SectionHeading subtitle="Мой опыт в ГК Т1 и Ланит — работа с масштабами страны.">
                  Профессиональное портфолио
                </SectionHeading>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {EXPERIENCE.map((job, idx) => (
                    <motion.div 
                      key={idx} 
                      whileHover={{ y: -5 }}
                      className="sleek-card p-10 group overflow-hidden relative"
                    >
                      <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rotate-45 translate-x-16 -translate-y-16 group-hover:bg-emerald-50 transition-colors" />
                      <h3 className="text-2xl font-bold text-slate-900 mb-1">{job.role}</h3>
                      <div className="text-emerald-600 font-bold text-xs uppercase tracking-widest mb-6">
                        {job.company} — {job.period}
                      </div>
                      <p className="text-slate-500 mb-8 font-medium leading-relaxed">{job.description}</p>
                      <div className="space-y-4">
                        {job.achievements.map((a, i) => (
                          <div key={i} className="flex gap-4 text-sm font-bold text-slate-700">
                            <Zap size={16} className="text-emerald-500 shrink-0 mt-1" />
                            <span>{a}</span>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </section>

              {/* REVIEWS SECTION */}
              <section>
                <SectionHeading subtitle="Что говорят коллеги и клиенты о совместной работе.">
                  Отзывы
                </SectionHeading>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {REVIEWS.map((review, i) => (
                    <div key={i} className="sleek-card p-8 flex flex-col justify-between">
                      <div className="space-y-4">
                        <div className="flex gap-1">
                          {[...Array(review.stars)].map((_, idx) => (
                            <Star key={idx} size={14} className="fill-emerald-500 text-emerald-500" />
                          ))}
                        </div>
                        <Quote className="text-slate-200" size={32} />
                        <p className="text-slate-600 italic font-medium leading-relaxed">
                          «{review.text}»
                        </p>
                      </div>
                      <div className="mt-8">
                        <div className="font-bold text-slate-900">{review.name}</div>
                        <div className="text-[10px] font-bold text-slate-400 uppercase">{review.role}</div>
                      </div>
                    </div>
                  ))}
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
                <h2 className="text-5xl font-bold tracking-tight">Стоимость Инжиниринга</h2>
                <p className="text-slate-500 text-lg font-medium">
                  Средние рыночные цены Москвы 2025. Прозрачность и результат превыше всего.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {PRICING_TIERS.map((tier) => (
                  <div key={tier.id} className={cn("sleek-card p-10 flex flex-col items-start relative overflow-hidden", tier.recommended && "ring-2 ring-slate-900 shadow-2xl")}>
                    {tier.recommended && <div className="absolute top-4 right-4 bg-slate-900 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase">Top Pick</div>}
                    <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">{tier.name}</h4>
                    <div className="text-4xl font-bold mb-6">{tier.price}</div>
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
                      Заказать по тарифу
                    </button>
                  </div>
                ))}
              </div>

              <div className="bg-white border border-slate-200 rounded-[3rem] p-12 lg:p-20 overflow-hidden relative">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-start">
                  <div>
                    <h3 className="text-3xl font-bold mb-4">Дополнительная <br />детализация</h3>
                    <p className="text-slate-500 font-medium mb-8">
                      Гибкие условия для расширения текущих проектов и точечной доработки систем.
                    </p>
                    <div className="flex flex-col gap-4">
                       <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                          <Phone size={20} className="text-slate-400" />
                          <div>
                            <div className="text-sm font-bold">Консультация (1 час) — Бесплатно</div>
                            <div className="text-[10px] text-slate-400 font-bold uppercase">Обсуждение ТЗ и архитектуры</div>
                          </div>
                       </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {ADDONS.map((a, idx) => (
                      <div key={idx} className="p-6 sleek-card flex flex-col gap-2">
                        <div className="text-[10px] font-bold text-slate-400 uppercase">{a.cat}</div>
                        <div className="font-bold text-slate-900 leading-tight">{a.name}</div>
                        <div className="text-sm font-bold text-emerald-600 mt-2">{a.price}</div>
                      </div>
                    ))}
                  </div>
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
                    className="fixed bottom-8 right-8 z-50 w-14 h-14 bg-slate-900 text-white rounded-full flex items-center justify-center shadow-2xl hover:bg-slate-800 transition-colors"
                  >
                    <ArrowUp size={24} />
                  </motion.button>
                )}
              </AnimatePresence>
            </motion.div>
          )}

          {activeTab === 'audit' && (
             <motion.div 
               key="audit"
               initial={{ opacity: 0, scale: 0.98 }}
               animate={{ opacity: 1, scale: 1 }}
               className="space-y-16"
             >
               <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                 {AUDIT_PLATFORMS.map((p, idx) => (
                   <div key={idx} className="sleek-card p-12 relative overflow-hidden">
                     <div className="absolute -top-10 -right-10 w-40 h-40 bg-slate-50 rounded-full blur-3xl opacity-50" />
                     <h3 className="text-3xl font-bold mb-2">{p.name}</h3>
                     <p className="text-xs font-bold text-emerald-600 uppercase tracking-[0.2em] mb-8">{p.region} • {p.type}</p>
                     <p className="text-lg text-slate-600 font-medium leading-relaxed mb-10">{p.pros}</p>
                     <div className="flex items-center gap-4 p-6 bg-slate-900 text-white rounded-2xl">
                        <TrendingUp size={24} className="text-emerald-500" />
                        <p className="font-bold tracking-tight leading-tight">«{p.verdict}»</p>
                     </div>
                   </div>
                 ))}
               </div>

               <div className="p-12 sleek-card bg-slate-50 border-slate-200">
                  <h3 className="text-2xl font-bold mb-8">Резюме по Москве 2025</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[
                      { label: 'Junior+', val: '90к — 140к' },
                      { label: 'Middle+', val: '180к — 280к' },
                      { label: 'Senior/Lead', val: '350к — 550к' }
                    ].map((m, i) => (
                      <div key={i} className="space-y-2">
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{m.label}</div>
                        <div className="text-3xl font-bold text-slate-900">{m.val}</div>
                      </div>
                    ))}
                  </div>
               </div>
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
            <ul className="space-y-4 font-bold">
              <li><button onClick={() => setActiveTab('portfolio')} className="hover:text-emerald-500 transition-colors">Портфолио</button></li>
              <li><button onClick={() => setActiveTab('pricing')} className="hover:text-emerald-500 transition-colors">Услуги и цены</button></li>
              <li><button onClick={() => setActiveTab('audit')} className="hover:text-emerald-500 transition-colors">Анализ рынка</button></li>
            </ul>
          </div>
          <div className="space-y-6">
            <h5 className="font-bold uppercase text-[10px] tracking-widest text-slate-500 mb-8">Контакты</h5>
            <div className="space-y-4 font-bold">
              <p>TG: @SebievTL</p>
              <p>Email: Ahmed1155@mail.ru</p>
              <p className="text-slate-500">Available: Mon - Fri, 10:00 - 20:00 MSK</p>
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
              className="fixed right-0 top-0 bottom-0 w-full max-w-xl bg-white z-[70] shadow-2xl p-12 flex flex-col"
            >
              <div className="flex justify-between items-center mb-16">
                <div>
                  <h3 className="text-4xl font-bold tracking-tight">Новый проект</h3>
                  {formState.tier && <span className="text-xs font-bold text-emerald-600 uppercase mt-2 block">Выбран тариф: {formState.tier}</span>}
                </div>
                <button onClick={() => setIsContactOpen(false)} className="p-3 hover:bg-slate-100 rounded-full transition-all">
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleApply} className="space-y-8 flex-1 overflow-y-auto pr-2 custom-scrollbar">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Как вас зовут?</label>
                  <input 
                    required
                    type="text" 
                    className="w-full py-4 border-b border-slate-200 focus:outline-none focus:border-slate-900 transition-colors font-bold text-xl" 
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
                    className="w-full py-4 border-b border-slate-200 focus:outline-none focus:border-slate-900 transition-colors font-bold text-xl" 
                    placeholder="@alex_ceo"
                    value={formState.contact}
                    onChange={e => setFormState({...formState, contact: e.target.value})}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Опишите задачу</label>
                  <textarea 
                    required
                    rows={4} 
                    className="w-full py-4 border-b border-slate-200 focus:outline-none focus:border-slate-900 transition-colors font-bold text-xl resize-none" 
                    placeholder="Например: Нужна ERP система для логистики..."
                    value={formState.message}
                    onChange={e => setFormState({...formState, message: e.target.value})}
                  />
                </div>
                
                <button 
                  disabled={isSubmitting}
                  type="submit" 
                  className={cn(
                    "w-full sleek-button-primary py-6 text-xl shadow-2xl shadow-slate-900/20",
                    isSubmitting && "opacity-50 cursor-not-allowed"
                  )}
                >
                  {isSubmitting ? 'Отправка...' : 'Отправить запрос'}
                </button>
              </form>

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
