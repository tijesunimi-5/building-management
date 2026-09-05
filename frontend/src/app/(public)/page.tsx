'use client';

import React from 'react';
import Link from 'next/link';
import { BRAND_CONFIG } from '../../utils/brandConfig';
import {
  Wrench,
  Zap,
  Paintbrush,
  Hammer,
  ShieldCheck,
  Sparkles,
  ClipboardCheck,
  Home,
  CheckCircle2,
  ArrowRight,
  Clock,
  Camera,
  Star
} from 'lucide-react';

export default function PublicLandingPage() {
  const services = [
    {
      icon: <Wrench className="w-6 h-6 text-sky-600" />,
      title: 'Plumbing & Water Systems',
      description: 'Expert tap repairs, pipe leak detection, cartridge replacements, and emergency plumbing care.'
    },
    {
      icon: <Zap className="w-6 h-6 text-amber-500" />,
      title: 'Electrical Services',
      description: 'Panel inspections, lighting fixture installations, switch troubleshooting, and safety audits.'
    },
    {
      icon: <Paintbrush className="w-6 h-6 text-indigo-500" />,
      title: 'Interior & Exterior Painting',
      description: 'Precision wall patching, full interior refresh, trim painting, and protective exterior coatings.'
    },
    {
      icon: <Hammer className="w-6 h-6 text-slate-700" />,
      title: 'General Repairs & Handyman',
      description: 'Drywall repairs, door hardware replacement, cabinetry touch-ups, and structural maintenance.'
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-emerald-600" />,
      title: 'Property Inspection & Audits',
      description: 'Comprehensive baseline condition reports, seasonal checklists, and preventive maintenance.'
    },
    {
      icon: <Sparkles className="w-6 h-6 text-cyan-600" />,
      title: 'Deep Cleaning & Turnover',
      description: 'Post-construction cleanup, property refresh between tenants, and seasonal deep cleaning.'
    },
    {
      icon: <ClipboardCheck className="w-6 h-6 text-violet-600" />,
      title: 'Ongoing Maintenance Care',
      description: 'Scheduled monthly or quarterly maintenance programs tailored to residential single-family homes.'
    },
    {
      icon: <Home className="w-6 h-6 text-rose-500" />,
      title: 'General Home Services',
      description: 'Custom property requests, appliance installations, winterization, and outdoor deck maintenance.'
    }
  ];

  const steps = [
    {
      number: '01',
      title: 'Request',
      description: 'Submit your property maintenance request online in seconds with optional photos.'
    },
    {
      number: '02',
      title: 'Assessment',
      description: 'Our dispatch team reviews your request, defines tasks, and assigns a licensed technician.'
    },
    {
      number: '03',
      title: 'Work',
      description: 'Your assigned worker arrives on site, performs initial inspection, and begins work.'
    },
    {
      number: '04',
      title: 'Track',
      description: 'Follow live progress, Before/After photo evidence, and completed tasks from your dashboard.'
    }
  ];

  return (
    <div className="bg-white min-h-screen text-slate-800 font-sans">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-slate-900 text-white pt-16 pb-24 lg:pt-24 lg:pb-32">
        <div 
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(#38bdf8 1px, transparent 1px)`,
            backgroundSize: '32px 32px'
          }}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 text-left">
              
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-800 border border-slate-700 text-xs font-semibold text-sky-400">
                <ShieldCheck className="w-4 h-4" />
                <span>Canadian Professional Property Care Platform</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
                {BRAND_CONFIG.tagline}
              </h1>

              <p className="text-lg sm:text-xl text-slate-300 max-w-2xl font-normal leading-relaxed">
                {BRAND_CONFIG.subTagline}
              </p>

              {/* Core Value Highlight Card */}
              <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700/80 max-w-xl text-sm text-slate-200 flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-white block">Full Property Transparency</span>
                  <span>{BRAND_CONFIG.trustValueProp}</span>
                </div>
              </div>

              {/* CTAs */}
              <div className="pt-2 flex flex-wrap items-center gap-4">
                <Link
                  href="/client/request"
                  className="px-7 py-3.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-base shadow-lg shadow-sky-600/30 transition-all duration-200 flex items-center gap-2 group"
                >
                  <span>Request a Service</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>

                <Link
                  href="/login"
                  className="px-6 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-semibold text-base border border-slate-700 transition-all duration-200"
                >
                  Client & Staff Login
                </Link>
              </div>

              {/* Trust Indicators */}
              <div className="pt-6 border-t border-slate-800 flex items-center gap-6 text-xs text-slate-400">
                <div className="flex items-center gap-1.5">
                  <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                  <span className="font-semibold text-slate-200">4.9/5 Client Rating</span>
                </div>
                <span>•</span>
                <div>Servicing GTA & Major Canadian Metro Areas</div>
              </div>

            </div>

            {/* Right Dashboard Preview Visual */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none bg-slate-800/90 rounded-2xl border border-slate-700 p-5 shadow-2xl backdrop-blur-md">
                
                {/* Visual Header */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-700 mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-rose-500" />
                    <div className="w-3 h-3 rounded-full bg-amber-500" />
                    <div className="w-3 h-3 rounded-full bg-emerald-500" />
                    <span className="text-xs font-semibold text-slate-300 ml-2">Live Property Tracker</span>
                  </div>
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-bold px-2 py-0.5 rounded-full border border-emerald-500/30">
                    Active Job
                  </span>
                </div>

                {/* Property Card Mock */}
                <div className="bg-slate-900 rounded-xl p-4 border border-slate-700 mb-4 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white text-sm">Thompson Residence</span>
                    <span className="text-slate-400">Toronto, ON</span>
                  </div>
                  <p className="text-slate-300">Service: Plumbing Repair & Cartridge Swap</p>
                  
                  {/* Live Progress Bar */}
                  <div className="space-y-1 pt-1">
                    <div className="flex justify-between text-[11px]">
                      <span className="text-sky-400 font-semibold">Progress</span>
                      <span className="text-slate-300 font-bold">60% Completed</span>
                    </div>
                    <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div className="bg-sky-500 h-full w-3/5" />
                    </div>
                  </div>
                </div>

                {/* Timeline Event Sample */}
                <div className="space-y-3">
                  <div className="flex items-start gap-3 bg-slate-900/60 p-3 rounded-xl border border-slate-700/60">
                    <div className="p-2 rounded-lg bg-sky-500/20 text-sky-400">
                      <Camera className="w-4 h-4" />
                    </div>
                    <div className="text-xs">
                      <span className="text-slate-400 text-[10px] block">Aug 17 — 03:45 PM</span>
                      <span className="font-bold text-white block">Progress Photo Uploaded</span>
                      <span className="text-slate-300 text-[11px]">Kitchen cartridge installed & pressure verified.</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 bg-slate-900/60 p-3 rounded-xl border border-slate-700/60">
                    <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400">
                      <Clock className="w-4 h-4" />
                    </div>
                    <div className="text-xs">
                      <span className="text-slate-400 text-[10px] block">Aug 15 — 08:30 AM</span>
                      <span className="font-bold text-white block">Technician Assigned</span>
                      <span className="text-slate-300 text-[11px]">Michael Carter assigned to property.</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-700 text-center">
                  <Link
                    href="/login"
                    className="text-xs font-semibold text-sky-400 hover:text-sky-300 flex items-center justify-center gap-1 mx-auto"
                  >
                    <span>Click to Sign In & Explore Portals</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Services Grid Section */}
      <section id="services" className="py-20 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-sky-600 bg-sky-50 px-3 py-1 rounded-full border border-sky-200">
              Professional Capabilities
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
              Full-Spectrum Home & Property Maintenance
            </h2>
            <p className="text-base sm:text-lg text-slate-600">
              From emergency repairs to ongoing scheduled care, our licensed specialists cover every detail of your property.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((svc, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center mb-4">
                    {svc.icon}
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">
                    {svc.title}
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {svc.description}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-100">
                  <Link
                    href="/client/request"
                    className="text-xs font-bold text-sky-600 hover:text-sky-700 flex items-center gap-1 group"
                  >
                    <span>Request Service</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-sky-600 bg-sky-50 px-3 py-1 rounded-full border border-sky-200">
              Transparent 4-Step Process
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
              How Property Maintenance Should Work
            </h2>
            <p className="text-base text-slate-600">
              No phone tag, no ambiguous updates. Monitor every repair with verified photographic evidence.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
            {steps.map((step, idx) => (
              <div key={idx} className="bg-slate-50 rounded-2xl p-6 border border-slate-200 relative group hover:bg-slate-900 hover:text-white transition-all duration-300">
                <div className="text-3xl font-extrabold text-sky-600 group-hover:text-sky-400 mb-4">
                  {step.number}
                </div>
                <h3 className="text-xl font-bold text-slate-900 group-hover:text-white mb-2">
                  {step.title}
                </h3>
                <p className="text-sm text-slate-600 group-hover:text-slate-300 leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-3xl space-y-6">
          <span className="text-xs font-bold uppercase tracking-widest text-sky-400 bg-slate-800 px-3 py-1 rounded-full border border-slate-700">
            About {BRAND_CONFIG.shortName}
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold">
            Built for Modern Property Owners
          </h2>
          <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
            We built {BRAND_CONFIG.companyName} on a single fundamental mandate: homeowners and property managers deserve total visibility into property maintenance without having to chase down workers or call dispatch for daily updates.
          </p>

          <div className="pt-6 grid grid-cols-2 md:grid-cols-4 gap-6 text-center border-t border-slate-800">
            <div>
              <span className="text-3xl font-extrabold text-sky-400 block">100%</span>
              <span className="text-xs text-slate-400 font-medium">Digital Audit Trail</span>
            </div>
            <div>
              <span className="text-3xl font-extrabold text-sky-400 block">4.9 ★</span>
              <span className="text-xs text-slate-400 font-medium">Average Review</span>
            </div>
            <div>
              <span className="text-3xl font-extrabold text-sky-400 block">1,400+</span>
              <span className="text-xs text-slate-400 font-medium">Services Completed</span>
            </div>
            <div>
              <span className="text-3xl font-extrabold text-sky-400 block">24/7</span>
              <span className="text-xs text-slate-400 font-medium">Portal Access</span>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
