'use client'
export const dynamic = 'force-dynamic';
import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { Database, FileText, Layout, ChevronRight } from 'lucide-react'
import Link from 'next/link'

export default function ProjectsPage() {
  const [projects, setProjects] = useState([])
  const [activeFilter, setActiveFilter] = useState('All Projects')

  const themes = ['All Projects', 'Urban Health', 'TB & Infectious Diseases', 'Health Systems', 'Nutrition & MCH', 'Mental Health']

  useEffect(() => {
    supabase.from('projects').select('*').then(({ data }) => setProjects(data || []))
  }, [])

  // Logic to group projects by Theme
  const grouped = projects.reduce((acc, proj) => {
    const key = proj.theme || 'Other'
    if (!acc[key]) acc[key] = []
    acc[key].push(proj)
    return acc
  }, {})

  return (
    <div className="bg-[#F8F9FA] min-h-screen pb-20">
      {/* FILTER PILLS */}
      <div className="max-w-7xl mx-auto px-10 py-10 flex space-x-4">
        {themes.map(t => (
          <button 
            key={t}
            onClick={() => setActiveFilter(t)}
            className={`px-6 py-2 rounded-full text-xs font-bold border transition ${
              activeFilter === t ? 'bg-[#1B4332] text-white border-[#1B4332]' : 'bg-white text-gray-500 border-gray-200'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="max-w-7xl mx-auto px-10 space-y-20">
        {Object.keys(grouped).map((theme, index) => (
          (activeFilter === 'All Projects' || activeFilter === theme) && (
            <section key={theme}>
              <div className="flex justify-between items-end border-b border-gray-200 pb-4 mb-10">
                <div className="flex items-center space-x-6">
                  <span className="text-teal-600 font-mono text-sm font-bold">0{index + 1}</span>
                  <h2 className="text-3xl font-serif text-gray-900">{theme}</h2>
                </div>
                <span className="text-xs font-bold text-gray-300 italic">{grouped[theme].length} projects</span>
              </div>

              <div className="grid grid-cols-3 gap-8">
                {grouped[theme].map(p => (
                  <Link href={`/project/${p.id}`} key={p.id} className="bg-white border border-gray-100 rounded-2xl p-8 hover:shadow-xl transition-all group relative">
                    <p className="text-[10px] font-bold text-teal-600 uppercase mb-4 tracking-widest">{p.theme}</p>
                    <h3 className="text-2xl font-serif text-gray-900 mb-4 group-hover:text-blue-600">{p.name}</h3>
                    <p className="text-gray-400 text-sm font-light mb-8 line-clamp-3">{p.description}</p>
                    
                    <div className="flex space-x-2">
                       <span className="bg-amber-50 text-amber-600 text-[9px] font-bold px-2 py-1 rounded flex items-center italic"><Database size={10} className="mr-1"/> Data</span>
                       <span className="bg-blue-50 text-blue-600 text-[9px] font-bold px-2 py-1 rounded flex items-center italic"><FileText size={10} className="mr-1"/> Publications</span>
                       <span className="bg-teal-50 text-teal-600 text-[9px] font-bold px-2 py-1 rounded flex items-center italic"><Layout size={10} className="mr-1"/> Methods</span>
                    </div>
                    <ChevronRight className="absolute bottom-8 right-8 text-gray-200 group-hover:text-blue-600" />
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