'use client'
import { useEffect, useState, use } from 'react'
import { supabase } from '@/lib/supabase'

export default function ProjectDetails({ params }) {
  const resolvedParams = use(params);
  const id = resolvedParams.id;

  const [project, setProject] = useState(null)
  const [files, setFiles] = useState([])
  const [user, setUser] = useState(null)
  const [activeTab, setActiveTab] = useState('Publications') 

  const categories = ['Data', 'Publications', 'Methods', 'Team', 'Gallery', 'Reports'];

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user))
    supabase.from('projects').select('*').eq('id', id).single().then(({ data }) => setProject(data))
    supabase.from('files').select('*').eq('project_id', id).then(({ data }) => setFiles(data || []))
  }, [id])

  // Function to handle the Email Request
  const handleRequestAccess = (fileName) => {
    const recipient = "datascience@herdint.com";
    const subject = encodeURIComponent(`Data Request: ${project?.name} - ${fileName}`);
    const body = encodeURIComponent(
      `Dear Data Science Team,\n\nI would like to request access to the dataset: ${fileName}.\n\n` +
      `My Name: \n` +
      `Organization: \n` +
      `Reason for requesting this data (Justification): \n\n` +
      `I agree to the data usage terms of HERD International.`
    );
    
    window.location.href = `mailto:${recipient}?subject=${subject}&body=${body}`;
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* SIDEBAR EXPLORER */}
      <div className="w-64 bg-white border-r border-gray-200 p-6 flex flex-col">
        <a href="/" className="text-sm text-blue-600 mb-8 flex items-center hover:underline">← Dashboard</a>
        <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Project Folders</h2>
        <nav className="space-y-1">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveTab(cat)}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition ${
                activeTab === cat ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </nav>
      </div>

      {/* MAIN CONTENT */}
      <div className="flex-1 p-10">
        <div className="max-w-4xl">
          <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded uppercase tracking-wide">
            {project?.theme || 'Research Project'}
          </span>
          <h1 className="text-4xl font-extrabold text-gray-900 mt-2 mb-4">{project?.name}</h1>
          <p className="text-gray-600 text-lg mb-8 leading-relaxed">{project?.description}</p>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50/50">
              <h3 className="font-bold text-gray-700">{activeTab} Files</h3>
              {!user && (
                <span className="text-xs text-amber-700 bg-amber-50 px-2 py-1 rounded border border-amber-200 font-medium">
                  🔒 Some files may require access request
                </span>
              )}
            </div>

            <ul className="divide-y divide-gray-100">
              {files.filter(f => f.category === activeTab).length === 0 ? (
                <li className="p-10 text-center text-gray-400 italic">No files in the "{activeTab}" folder.</li>
              ) : (
                files.filter(f => f.category === activeTab).map(file => (
                  <li key={file.id} className="p-4 flex justify-between items-center hover:bg-gray-50 transition">
                    <div className="flex items-center space-x-4">
                      <div className="bg-gray-100 p-2 rounded text-2xl">
                        {file.file_name.endsWith('.pdf') ? '📄' : '📊'}
                      </div>
                      <div>
                        <p className={`font-semibold ${file.is_private && !user ? 'text-gray-500' : 'text-gray-800'}`}>
                          {file.file_name} {file.is_private && '🔒'}
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5">Project Asset • 2024</p>
                      </div>
                    </div>

                    {/* ACTION BUTTON LOGIC */}
                    {file.is_private && !user ? (
                      <button 
                        onClick={() => handleRequestAccess(file.file_name)}
                        className="text-xs font-bold bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 shadow-sm transition"
                      >
                        REQUEST ACCESS
                      </button>
                    ) : (
                      <a 
                        href={file.file_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-sm font-bold text-blue-600 border border-blue-600 px-4 py-2 rounded-lg hover:bg-blue-600 hover:text-white transition"
                      >
                        Download
                      </a>
                    )}
                  </li>
                ))
              )}
            </ul>
          </div>
          
          <p className="mt-6 text-sm text-gray-400 text-center">
            For technical support regarding datasets, contact HERD International Data Science Team.
          </p>
        </div>
      </div>
    </div>
  )
}