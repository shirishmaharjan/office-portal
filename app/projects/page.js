'use client'
export const dynamic = 'force-dynamic';
import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { Database, FileText, Layout, ChevronRight, Users, Map, ClipboardList } from 'lucide-react'
import Link from 'next/link'

export default function ProjectsPage() {
  const [projects, setProjects] = useState([])
  const [activeFilter, setActiveFilter] = useState('All Projects')

  const themes = ['All Projects', 'Urban Health', 'TB & Infectious Diseases', 'Health Systems', 'Nutrition & MCH', 'Mental Health']

  useEffect(() => {
    supabase.from('projects').select('*').order('theme', { ascending: true }).then(({ data }) => {
      setProjects(data || [])
    })
  }, [])

  // Grouping Logic
  const grouped = projects.reduce((acc, proj) => {
    const key = proj.theme || 'Other'
    if (!acc[key]) acc[key] = []
    acc[key].push(proj)
    return acc
  }, {})

  return (
    <div className="bg-[#F8F9FA] min-h-screen pb-20">
      {/* 1. FILTER PILLS */}
      <div className="sticky top-0 bg-[#F8F9FA]/80 backdrop-blur-md z-10 border-b border-gray-100 mb-12">
        <div className="max-w-7xl mx-auto px-10 py-6 flex space-x-3 overflow-x-auto no-scrollbar">
          {themes.map(t => (
            <button 
              key={t}
              onClick={() => setActiveFilter(t)}
              className={`px-6 py-2 rounded-full text-xs font-bold border transition-all whitespace-nowrap ${
                activeFilter === t ? 'bg-[#1B4332] text-white border-[#1B4332] shadow-lg shadow-green-900/20' : 'bg-white text-gray-500 border-gray-200 hover:border-gray-400'
              }`}
            >
              <span className={`inline-block w-2 h-2 rounded-full mr-2 ${activeFilter === t ? 'bg-white' : 'bg-gray-300'}`}></span>
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* 2. GROUPED PROJECT SECTIONS */}
      <div className="max-w-7xl mx-auto px-10 space-y-24">
        {Object.keys(grouped).map((theme, index) => (
          (activeFilter === 'All Projects' || activeFilter === theme) && (
            <section key={theme} className="animate-in fade-in slide-in-from-bottom-4 duration-700">
              {/* THEME HEADER */}
              <div className="flex justify-between items-end border-b border-gray-200 pb-5 mb-10">
                <div className="flex items-center space-x-6">
                  <span className="text-teal-600 font-mono text-sm font-bold tracking-tighter">0{index + 1}</span>
                  <h2 className="text-4xl font-serif text-gray-900 tracking-tight">{theme}</h2>
                </div>
                <span className="text-[10px] font-black text-gray-300 uppercase tracking-[0.2em]">{grouped[theme].length} Projects Found</span>
              </div>

              {/* PROJECT GRID */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {grouped[theme].map(p => (
                  <Link href={`/project/${p.id}`} key={p.id} className="bg-white border border-gray-100 rounded-2xl p-8 hover:shadow-2xl hover:-translate-y-1 transition-all group relative flex flex-col h-full">
                    <div className="mb-6 flex justify-between items-start">
                      <p className="text-[10px] font-bold text-teal-600 uppercase tracking-widest border-b-2 border-teal-100 pb-1 inline-block">{p.theme}</p>
                      <span className="text-[10px] font-bold text-gray-300 italic font-mono">{p.project_year}</span>
                    </div>
                    
                    <h3 className="text-3xl font-serif text-gray-900 mb-4 group-hover:text-blue-600 transition-colors leading-tight">{p.name}</h3>
                    <p className="text-gray-400 text-sm font-light mb-8 line-clamp-3 leading-relaxed flex-grow">{p.description}</p>
                    
                    {/* CATEGORY TAGS (Mock indicators) */}
                    <div className="flex flex-wrap gap-2 mt-auto">
                       <span className="bg-amber-50 text-amber-600 text-[9px] font-bold px-2 py-1 rounded flex items-center border border-amber-100 italic">
                          <Database size={10} className="mr-1"/> Data
                       </span>
                       <span className="bg-blue-50 text-blue-600 text-[9px] font-bold px-2 py-1 rounded flex items-center border border-blue-100 italic">
                          <FileText size={10} className="mr-1"/> Publications
                       </span>
                       {index % 2 === 0 && (
                        <span className="bg-teal-50 text-teal-600 text-[9px] font-bold px-2 py-1 rounded flex items-center border border-teal-100 italic">
                            <Layout size={10} className="mr-1"/> Methods
                        </span>
                       )}
                    </div>

                    <div className="absolute bottom-8 right-8 opacity-0 group-hover:opacity-100 group-hover:translate-x-2 transition-all">
                        <ChevronRight className="text-blue-600" size={20} />
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )
        ))}
      </div>
    </div>
  )
}