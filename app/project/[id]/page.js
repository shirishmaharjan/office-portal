'use client'
import { useEffect, useState, use as useReact } from 'react'
import { supabase } from '@/lib/supabase'
import { FileText, Database, Map, Image, Users, Layout, Lock, Download, ChevronRight } from 'lucide-react'

export default function ProjectDetails({ params }) {
  const resolvedParams = useReact(params);
  const id = resolvedParams.id;

  const [project, setProject] = useState(null)
  const [files, setFiles] = useState([])
  const [user, setUser] = useState(null)
  const [activeTab, setActiveTab] = useState('Data')

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user))
    supabase.from('projects').select('*').eq('id', id).single().then(({ data }) => setProject(data))
    supabase.from('files').select('*').eq('project_id', id).then(({ data }) => setFiles(data || []))
  }, [id])

  const categories = [
    { name: 'Data', icon: Database, count: files.filter(f => f.category === 'Data').length },
    { name: 'Methods', icon: Layout, count: files.filter(f => f.category === 'Methods').length },
    { name: 'Publications', icon: FileText, count: files.filter(f => f.category === 'Publications').length },
    { name: 'Reports', icon: FileText, count: files.filter(f => f.category === 'Reports').length },
    { name: 'Maps & GIS', icon: Map, count: files.filter(f => f.category === 'Gallery').length },
    { name: 'Team', icon: Users, count: 5 },
  ];

  return (
    <div className="bg-[#F8F9FA] min-h-screen pb-20">
      {/* Header / Breadcrumbs */}
      <div className="max-w-7xl mx-auto px-6 py-4 text-sm text-gray-500">
        Home / Projects / <span className="font-semibold text-gray-900">{project?.name}</span>
      </div>

      <div className="max-w-7xl mx-auto px-6">
        {/* Project Hero Card */}
        <div className="bg-white border border-gray-200 rounded-2xl p-8 mb-8 shadow-sm">
          <div className="flex items-center space-x-2 text-xs font-bold text-teal-600 uppercase mb-4">
            <span>{project?.theme}</span>
            <span>•</span>
            <span>{project?.name}</span>
          </div>
          <h1 className="text-5xl font-serif text-gray-900 mb-6">{project?.name}</h1>
          <p className="text-gray-600 text-lg max-w-4xl mb-10 leading-relaxed">{project?.description}</p>
          
          <div className="grid grid-cols-5 gap-8 border-t border-gray-100 pt-8">
            <div><p className="text-[10px] uppercase font-bold text-gray-400 mb-1">Thematic Area</p><p className="font-medium">{project?.theme}</p></div>
            <div><p className="text-[10px] uppercase font-bold text-gray-400 mb-1">Period</p><p className="font-medium">{project?.period}</p></div>
            <div><p className="text-[10px] uppercase font-bold text-gray-400 mb-1">Funder</p><p className="font-medium">{project?.funder}</p></div>
            <div><p className="text-[10px] uppercase font-bold text-gray-400 mb-1">Status</p><p className="font-medium">{project?.status}</p></div>
            <div><p className="text-[10px] uppercase font-bold text-gray-400 mb-1">Countries</p><p className="font-medium">{project?.countries}</p></div>
          </div>
        </div>

        <div className="flex gap-8">
          {/* Sidebar */}
          <div className="w-64 flex-shrink-0">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">Project Folders</p>
            <div className="space-y-1">
              {categories.map((cat) => (
                <button
                  key={cat.name}
                  onClick={() => setActiveTab(cat.name)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all ${
                    activeTab === cat.name ? 'bg-blue-50 text-blue-700 shadow-sm' : 'text-gray-500 hover:bg-gray-100'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <cat.icon size={18} />
                    <span className="text-sm font-medium">{cat.name}</span>
                  </div>
                  <span className="text-xs font-bold opacity-50">{cat.count}</span>
                </button>
              ))}
            </div>
          </div>

          {/* File Table Content */}
          <div className="flex-1 bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
            <div className="px-8 py-6 border-b border-gray-100 flex items-center space-x-4 bg-gray-50/30">
              <Database className="text-amber-500" size={24} />
              <div>
                <h3 className="text-xl font-bold text-gray-800">{activeTab} Files</h3>
                <p className="text-sm text-gray-500">Datasets and research materials for this project.</p>
              </div>
            </div>

            <table className="w-full text-left">
              <thead className="bg-gray-50 text-[10px] uppercase font-bold text-gray-400 border-b border-gray-100">
                <tr>
                  <th className="px-8 py-4">File Name</th>
                  <th className="px-4 py-4">Type</th>
                  <th className="px-4 py-4">Date</th>
                  <th className="px-4 py-4">Size</th>
                  <th className="px-8 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 text-sm">
                {files.filter(f => f.category === activeTab || (activeTab === 'Data' && f.category === 'Data')).map(file => (
                  <tr key={file.id} className="hover:bg-gray-50/50 transition">
                    <td className="px-8 py-5 flex items-center space-x-3 font-medium text-gray-700 italic">
                      <FileText size={16} className="text-gray-300" />
                      <span>{file.file_name}</span>
                    </td>
                    <td className="px-4 py-5 font-mono text-[10px] text-gray-400 uppercase tracking-tighter">
                      <span className="border border-gray-200 px-2 py-0.5 rounded">{file.file_type || 'PDF'}</span>
                    </td>
                    <td className="px-4 py-5 text-gray-400">{file.upload_date || 'Jan 2024'}</td>
                    <td className="px-4 py-5 text-gray-400">{file.file_size || '1.2 MB'}</td>
                    <td className="px-8 py-5 text-right">
                      {file.is_private && !user ? (
                        <button className="bg-amber-50 text-amber-600 border border-amber-200 px-3 py-1.5 rounded-lg text-xs font-bold inline-flex items-center space-x-2">
                          <Lock size={12} /> <span>REQUEST ACCESS</span>
                        </button>
                      ) : (
                        <a href={file.file_url} className="text-gray-400 hover:text-blue-600 flex items-center justify-end space-x-1 text-xs font-bold transition">
                          <span>DOWNLOAD</span> <Download size={14} />
                        </a>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}