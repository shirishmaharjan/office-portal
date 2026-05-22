'use client'
export const dynamic = 'force-dynamic';
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { Search, Globe, Activity, ShieldCheck, Heart, Brain, Database, ChevronRight } from 'lucide-react'
import Link from 'next/link'

export default function Home() {
  const [projects, setProjects] = useState([])
  const [search, setSearch] = useState('')

  useEffect(() => {
    supabase.from('projects').select('*').limit(3).then(({ data }) => setProjects(data || []))
  }, [])

  const themes = [
    { name: 'Urban Health', icon: Globe, color: 'text-blue-500', desc: 'City health systems, slum health, and air pollution' },
    { name: 'TB & Infectious Disease', icon: Activity, color: 'text-red-500', desc: 'Tuberculosis detection, treatment, and COVID-19' },
    { name: 'Health Systems', icon: ShieldCheck, color: 'text-purple-500', desc: 'Governance, resilience, and subnational management' },
    { name: 'Nutrition & MCH', icon: Heart, color: 'text-green-500', desc: 'Maternal nutrition and child health programs' },
    { name: 'Mental Health', icon: Brain, color: 'text-pink-500', desc: 'Psychosocial wellbeing and crisis response' },
  ]

  return (
    <main className="bg-white min-h-screen pb-20">
      {/* HERO SECTION */}
      <section className="max-w-7xl mx-auto px-10 pt-24 pb-16">
        <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest mb-4">Research Data System • HERD International</p>
        <h1 className="text-7xl font-serif text-gray-900 mb-8 leading-[1.1]">
          Health, Environment, <span className="italic text-teal-600 font-light">Research</span> & Development
        </h1>
        <p className="text-gray-500 text-xl max-w-3xl mb-12 leading-relaxed font-light">
          Discover and access research datasets, publications, methods, and findings from HERD International's multidisciplenary portfolio spanning Nepal and South Asia.
        </p>

        {/* SEARCH */}
        <div className="flex max-w-3xl shadow-2xl shadow-blue-100 rounded-xl overflow-hidden border border-gray-100 mb-20">
          <div className="flex-1 flex items-center bg-gray-50/50 px-6">
            <Search className="text-gray-300 mr-3" size={22} />
            <input 
              type="text" placeholder="Search datasets, projects, publications..." 
              className="bg-transparent w-full py-6 outline-none text-gray-700 font-light"
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button className="bg-[#0066CC] text-white px-12 font-bold hover:bg-blue-700 transition">Search</button>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-5 gap-12 border-t border-gray-100 pt-12">
          {[ 
            {v:'5', l:'Thematic Areas'}, {v:'17', l:'Projects'}, {v:'48', l:'Datasets'}, {v:'132', l:'Publications'}, {v:'Nepal', l:'Primary Focus'}
          ].map(s => (
            <div key={s.l}><p className="text-5xl font-serif text-gray-900 mb-1">{s.v}</p><p className="text-[10px] uppercase font-bold text-gray-400 tracking-widest">{s.l}</p></div>
          ))}
        </div>
      </section>

      {/* THEMATIC TOPICS GRID */}
      <section className="bg-gray-50/30 py-24 border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-10">
          <h2 className="text-3xl font-serif text-gray-900 mb-12">Thematic Topics</h2>
          <div className="grid grid-cols-5 gap-6">
            {themes.map(t => (
              <div key={t.name} className="bg-white border border-gray-200 p-8 rounded-2xl hover:shadow-xl transition-all cursor-pointer group">
                <t.icon className={`${t.color} mb-6`} size={32} strokeWidth={1.5} />
                <h3 className="font-bold text-gray-900 mb-3 group-hover:text-blue-600">{t.name}</h3>
                <p className="text-xs text-gray-400 leading-relaxed font-light">{t.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED DATASETS */}
      <section className="max-w-7xl mx-auto px-10 py-24">
        <h2 className="text-3xl font-serif text-gray-900 mb-12">Featured Datasets</h2>
        <div className="space-y-6">
          {projects.map(p => (
            <Link href={`/project/${p.id}`} key={p.id} className="block bg-white border border-gray-100 p-10 rounded-2xl hover:border-blue-400 transition-all shadow-sm group">
              <div className="flex justify-between items-center">
                <div className="max-w-3xl">
                  <p className="text-[10px] uppercase font-bold text-blue-500 mb-3 tracking-widest">Dataset • {p.theme}</p>
                  <h3 className="text-3xl font-serif text-gray-900 mb-3 group-hover:text-blue-600 transition">{p.name} — {p.subtitle || 'Kathmandu Valley'}</h3>
                  <p className="text-gray-400 font-light mb-8 italic">{p.description}</p>
                  <div className="flex items-center space-x-6 text-[10px] font-bold text-gray-300 uppercase">
                     <span>{p.file_tags || 'GeoJSON + CSV'} • 12.4 MB</span>
                     <span>{p.project_year || '2024'}</span>
                  </div>
                </div>
                <div className="text-gray-300 group-hover:text-blue-600 font-bold text-xs flex items-center border border-gray-100 px-5 py-2.5 rounded-lg">
                  View Project <ChevronRight size={16} />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  )
}