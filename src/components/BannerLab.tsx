import React from 'react';
import { motion } from 'motion/react';
import { Code2, Terminal, Cpu, Globe, Rocket, Shield, Database, Layout } from 'lucide-react';

const BannerLab = () => {
  return (
    <div className="min-h-screen bg-slate-50 p-8 sm:p-20 font-sans">
      <div className="max-w-6xl mx-auto space-y-20">
        
        <header className="space-y-4">
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 text-center">Sebiev Brand Kit</h1>
          <p className="text-slate-500 text-center font-medium">Профессиональные ассеты для соцсетей (сделайте скриншот для использования)</p>
        </header>

        {/* AVATAR SECTION */}
        <section className="space-y-8">
          <h2 className="text-xl font-bold uppercase tracking-widest text-slate-400">1. Аватарки (WhatsApp / Telegram)</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            
            {/* Template 1: Minimalist Tech */}
            <div className="flex flex-col items-center gap-4">
              <div id="avatar-1" className="w-64 h-64 bg-slate-900 rounded-[2.5rem] flex items-center justify-center p-12 relative overflow-hidden shadow-2xl">
                <div className="absolute inset-0 bg-emerald-500/5 blur-3xl rounded-full" />
                <Code2 size={120} className="text-emerald-500 relative z-10" />
                <div className="absolute bottom-6 font-bold text-white tracking-widest text-xs uppercase">SEBIEV.TECH</div>
              </div>
              <span className="text-xs font-bold text-slate-400 italic">Minimalist Code</span>
            </div>

            {/* Template 2: Initials / Modern */}
            <div className="flex flex-col items-center gap-4">
              <div className="w-64 h-64 bg-slate-900 rounded-full flex flex-col items-center justify-center relative overflow-hidden shadow-2xl border-4 border-emerald-500/20">
                <div className="text-7xl font-bold text-white tracking-tighter">AS</div>
                <div className="h-1 w-12 bg-rose-500 mt-2 rounded-full" />
                <div className="mt-4 font-bold text-emerald-500 text-[10px] tracking-[0.3em] uppercase">SENIOR ENGINEER</div>
              </div>
              <span className="text-xs font-bold text-slate-400 italic">Portrait Circle</span>
            </div>

            {/* Template 3: Dark Terminal */}
            <div className="flex flex-col items-center gap-4">
              <div className="w-64 h-64 bg-black rounded-[2.5rem] flex items-center justify-center p-8 relative overflow-hidden shadow-2xl">
                <Terminal size={140} className="text-white/10 absolute -right-10 -bottom-10 rotate-12" />
                <div className="relative z-10 flex flex-col items-center text-center">
                  <Cpu size={48} className="text-rose-500 mb-4" />
                  <div className="font-mono text-emerald-500 text-sm">{`{ fullstack: true }`}</div>
                </div>
              </div>
              <span className="text-xs font-bold text-slate-400 italic">Terminal Dark</span>
            </div>

          </div>
        </section>

        {/* BANNER SECTION */}
        <section className="space-y-8">
          <h2 className="text-xl font-bold uppercase tracking-widest text-slate-400">2. Баннеры (Telegram / Instagram)</h2>
          
          {/* Main Header Banner */}
          <div className="space-y-12">
            <div className="relative w-full aspect-[16/6] bg-slate-900 rounded-[3rem] overflow-hidden p-12 flex flex-col justify-between shadow-2xl group">
              <div className="absolute top-0 right-0 w-1/2 h-full bg-emerald-500/5 blur-[120px] rounded-full translate-x-1/2" />
              
              <div className="flex justify-between items-start relative z-10">
                <div className="space-y-1">
                  <div className="text-emerald-500 font-bold text-xs uppercase tracking-[0.4em]">Available for projects 2025</div>
                  <h3 className="text-4xl sm:text-6xl font-bold text-white tracking-tighter">Ahmed Sebiev</h3>
                  <p className="text-slate-400 text-lg font-medium opacity-80">Fullstack Software Architect</p>
                </div>
                <div className="flex gap-4">
                  <div className="p-3 bg-white/5 rounded-2xl backdrop-blur-sm border border-white/10">
                    <Globe className="text-white" size={24} />
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-8 relative z-10">
                <div className="flex items-center gap-3">
                   <Shield size={20} className="text-emerald-500" />
                   <span className="text-white/60 font-medium text-sm">Security First</span>
                </div>
                <div className="flex items-center gap-3">
                   <Rocket size={20} className="text-rose-500" />
                   <span className="text-white/60 font-medium text-sm">Scalable Cloud</span>
                </div>
                <div className="flex items-center gap-3">
                   <Database size={20} className="text-blue-400" />
                   <span className="text-white/60 font-medium text-sm">Complex Data</span>
                </div>
              </div>
            </div>

            {/* Service Focus Banner */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <div className="aspect-[16/9] bg-gradient-to-br from-slate-900 to-black rounded-[2.5rem] p-10 flex flex-col justify-end gap-4 shadow-xl border border-white/5 overflow-hidden relative">
                  <Layout size={200} className="absolute -top-10 -right-10 text-emerald-500/10 -rotate-12" />
                  <div className="text-emerald-500 font-bold text-xs tracking-widest uppercase">Expertise</div>
                  <h4 className="text-3xl font-bold text-white">ERP & CRM Systems</h4>
                  <p className="text-slate-400 text-sm">Custom business automation from scratch.</p>
               </div>
               
               <div className="aspect-[16/9] bg-emerald-500 rounded-[2.5rem] p-10 flex flex-col justify-end gap-4 shadow-xl overflow-hidden relative">
                  <Globe size={200} className="absolute -top-10 -right-10 text-white/20 rotate-12" />
                  <div className="text-slate-900/40 font-bold text-xs tracking-widest uppercase">Experience</div>
                  <h4 className="text-3xl font-bold text-slate-900">Senior Fullstack</h4>
                  <p className="text-slate-900/60 text-sm">Ex-Lanit / Ex-T1 Engineering.</p>
               </div>
            </div>
          </div>
        </section>

        <footer className="pt-20 pb-10 text-center">
            <p className="text-slate-400 text-sm italic">Сделайте качественный скриншот нужного элемента. Эти дизайны синхронизированы с вашим основным сайтом.</p>
        </footer>

      </div>
    </div>
  );
};

export default BannerLab;
