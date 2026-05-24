import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Activity, ShieldAlert, Users, Award, MapPin, ArrowRight, HeartHandshake, Phone } from 'lucide-react';
import LeafletMap from '../components/Widgets/LeafletMap';
import Navbar from '../components/Layout/Navbar';
import Footer from '../components/Layout/Footer';
import { Link } from 'react-router-dom';

export default function LandingPage() {
  const [awarenessPosts, setAwarenessPosts] = useState([]);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const data = await api.citizen.getAwareness();
      setAwarenessPosts(data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 font-sans">
      <Navbar />

      {/* Real-time Health Alert Ticker */}
      <div className="bg-red-600 text-white text-xs font-semibold py-2 px-4 overflow-hidden relative w-full border-b border-red-700">
        <div className="flex gap-8 animate-pulse">
          <span className="flex items-center gap-1.5 shrink-0">
            <ShieldAlert className="h-3.5 w-3.5" />
            CRITICAL MONSOON UPDATE:
          </span>
          <span className="flex-1">
            Dengue prevention drive is active in Rampur Block. Keep water containers dry. Report sanitation issues immediately!
          </span>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative px-6 py-16 md:py-24 text-center max-w-6xl mx-auto flex flex-col items-center">
        {/* Soft Radial Gradients */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 -z-10 h-80 w-80 rounded-full bg-health-400/20 blur-3xl dark:bg-health-900/30"></div>
        <div className="absolute top-20 left-1/3 -translate-x-1/2 -z-10 h-72 w-72 rounded-full bg-cyan-400/20 blur-3xl dark:bg-cyan-900/20"></div>

        <span className="rounded-full bg-health-100 dark:bg-health-950/60 px-4 py-1.5 text-xs font-bold text-health-600 dark:text-health-400 flex items-center gap-1.5 mb-6">
          <Activity className="h-3.5 w-3.5 animate-pulse" />
          GOVERNMENT APPROVED DIGITAL PLATFORM
        </span>
        
        <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
          Bridging Healthcare Gaps in <br />
          <span className="bg-gradient-to-r from-health-600 to-cyan-500 bg-clip-text text-transparent dark:from-health-400 dark:to-cyan-400">
            Rural & Local Communities
          </span>
        </h1>
        
        <p className="mt-6 text-sm md:text-base text-slate-500 max-w-2xl dark:text-slate-400 leading-relaxed">
          Book free clinic appointments, view local vaccination calendars, check sanitisation profiles, and report public health issues directly to regional healthcare coordinators.
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            to="/register"
            className="flex items-center gap-2 rounded-xl bg-health-600 px-6 py-3 text-sm font-semibold text-white shadow-glow hover:bg-health-500 hover:scale-105 active:scale-95 transition-all"
          >
            Create Free Account
            <ArrowRight className="h-4 w-4" />
          </Link>
          <a
            href="#hospitals"
            className="flex items-center gap-2 rounded-xl bg-white border border-slate-200 px-6 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800 transition-all"
          >
            Find Clinic Map
          </a>
        </div>
      </section>

      {/* Community Metrics Dashboard Ticker */}
      <section className="px-6 py-8 border-y border-slate-200/50 bg-white/50 backdrop-blur-md dark:border-slate-800/50 dark:bg-slate-900/40">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="space-y-1">
            <h3 className="text-2xl md:text-3xl font-extrabold text-health-600 dark:text-health-400">12+</h3>
            <p className="text-xs text-slate-400 font-medium">Integrated Rural Clinics</p>
          </div>
          <div className="space-y-1">
            <h3 className="text-2xl md:text-3xl font-extrabold text-cyan-600 dark:text-cyan-400">95%</h3>
            <p className="text-xs text-slate-400 font-medium">SOS Response Rate</p>
          </div>
          <div className="space-y-1">
            <h3 className="text-2xl md:text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">4,500+</h3>
            <p className="text-xs text-slate-400 font-medium">Vaccinations Registered</p>
          </div>
          <div className="space-y-1">
            <h3 className="text-2xl md:text-3xl font-extrabold text-violet-600 dark:text-violet-400">120+</h3>
            <p className="text-xs text-slate-400 font-medium">Sanitation Fixes Resolved</p>
          </div>
        </div>
      </section>

      {/* Hospital Locator Map Anchor */}
      <section id="hospitals" className="px-6 py-16 max-w-6xl mx-auto w-full grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-4">
          <LeafletMap />
        </div>
        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-glass dark:border-slate-800 dark:bg-slate-900/50">
            <h3 className="font-bold text-sm text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
              <HeartHandshake className="h-4.5 w-4.5 text-health-500" />
              Community SOS Hotline
            </h3>
            <p className="mt-2 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              If you require instant first-aid advice or ambulance dispatch:
            </p>
            <div className="mt-4 rounded-xl bg-red-50 p-4 border border-red-100 dark:bg-red-950/20 dark:border-red-950/40 text-red-600 dark:text-red-400 flex items-center gap-3">
              <Phone className="h-6 w-6 animate-bounce" />
              <div>
                <p className="text-xs font-bold">EMERGENCY LINE</p>
                <p className="text-sm font-mono font-bold mt-0.5">102 / 108 / 112</p>
              </div>
            </div>
            <p className="mt-4 text-[10px] text-slate-400">
              For digital GPS SOS broadcasts, please log in and click the red SOS trigger in your dashboard.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-glass dark:border-slate-800 dark:bg-slate-900/50">
            <h3 className="font-bold text-sm text-slate-800 dark:text-slate-200">
              Public Campaigns
            </h3>
            <div className="mt-4 space-y-4">
              <div className="border-l-2 border-health-500 pl-3">
                <p className="text-xs font-semibold text-slate-700 dark:text-slate-200">Polio Immunization Drive</p>
                <p className="text-[10px] text-slate-400 mt-0.5">Ages 0-5. Next Monday at Apex Clinic.</p>
              </div>
              <div className="border-l-2 border-cyan-500 pl-3">
                <p className="text-xs font-semibold text-slate-700 dark:text-slate-200">Water Purification Survey</p>
                <p className="text-[10px] text-slate-400 mt-0.5">Sanitation inspectors visiting Rampur Sector B.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Public Awareness Campaign Blogs */}
      <section className="px-6 py-12 max-w-6xl mx-auto w-full border-t border-slate-200/50 dark:border-slate-800/50">
        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-6 flex items-center gap-2">
          <Award className="h-5 w-5 text-health-500" />
          Health Awareness & Campaigns
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {awarenessPosts.slice(0, 3).map(post => (
            <div key={post.id} className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-glass dark:border-slate-800 dark:bg-slate-900/50 flex flex-col">
              <img
                src={post.imageUrl}
                alt={post.title}
                className="h-40 w-full object-cover"
              />
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <span className="text-[9px] font-bold text-health-600 bg-health-50 dark:bg-health-950/40 dark:text-health-400 px-2 py-0.5 rounded uppercase">
                    {post.category}
                  </span>
                  <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100 mt-2 leading-snug">
                    {post.title}
                  </h3>
                  <p className="text-[11px] text-slate-500 mt-2 line-clamp-3 leading-relaxed dark:text-slate-400">
                    {post.content}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center text-[10px] text-slate-400">
                  <span>By {post.authorName}</span>
                  <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}
