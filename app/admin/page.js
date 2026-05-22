'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export default function AdminPage() {
  const [projects, setProjects] = useState([])
  const [user, setUser] = useState(null)
  
  // Form State
  const [selectedProjectId, setSelectedProjectId] = useState('')
  const [fileName, setFileName] = useState('')
  const [category, setCategory] = useState('Publications')
  const [isPrivate, setIsPrivate] = useState(false)
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // 1. Check if user is logged in
    supabase.auth.getUser().then(({ data }) => setUser(data.user))
    // 2. Fetch projects for the dropdown
    supabase.from('projects').select('id, name').then(({ data }) => setProjects(data))
  }, [])

  // SECURITY GATE: If not logged in, don't show the form
  if (!user) {
    return <div className="p-20 text-center text-red-500 font-bold">Access Denied. Please Login first.</div>
  }

  async function handleUpload(e) {
    e.preventDefault()
    if (!file || !selectedProjectId) return alert("Please select a file and a project")
    
    setLoading(true)
    
    try {
      // 1. Decide which bucket to use
      const bucket = isPrivate ? 'private-data' : 'public-research'
      
      // 2. Upload file to Supabase Storage
      const fileExt = file.name.split('.').pop()
      const path = `${Date.now()}_${file.name}` // Unique name
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(path, file)

      if (uploadError) throw uploadError

      // 3. Get the URL of the uploaded file
      const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(path)

      // 4. Save file info into our Database table
      const { error: dbError } = await supabase.from('files').insert([{
        project_id: selectedProjectId,
        file_name: fileName || file.name,
        file_url: urlData.publicUrl,
        category: category,
        is_private: isPrivate,
        file_type: fileExt
      }])

      if (dbError) throw dbError

      alert("File successfully uploaded and linked to project!")
      setFileName(''); setFile(null) // Reset form
    } catch (err) {
      alert(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-xl mx-auto p-10 bg-white shadow-lg rounded-xl mt-10">
      <h1 className="text-2xl font-bold mb-6">Admin: Upload Research Data</h1>
      
      <form onSubmit={handleUpload} className="space-y-4">
        {/* Project Selection */}
        <div>
          <label className="block text-sm font-bold mb-1">Select Project</label>
          <select 
            className="w-full border p-2 rounded"
            onChange={(e) => setSelectedProjectId(e.target.value)}
            required
          >
            <option value="">-- Select Project --</option>
            {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
        </div>

        {/* Display Name */}
        <div>
          <label className="block text-sm font-bold mb-1">File Display Name</label>
          <input 
            type="text" className="w-full border p-2 rounded" placeholder="e.g. Annual Report 2024"
            value={fileName} onChange={(e) => setFileName(e.target.value)}
          />
        </div>

        {/* Category Select */}
        <div>
          <label className="block text-sm font-bold mb-1">Sidebar Category</label>
          <select 
            className="w-full border p-2 rounded"
            value={category} onChange={(e) => setCategory(e.target.value)}
          >
            <option>Data</option>
            <option>Publications</option>
            <option>Methods</option>
            <option>Team</option>
            <option>Gallery</option>
            <option>Reports</option>
          </select>
        </div>

        {/* File Picker */}
        <div>
          <label className="block text-sm font-bold mb-1">Select File (.pdf, .xlsx, .csv)</label>
          <input type="file" onChange={(e) => setFile(e.target.files[0])} required className="w-full" />
        </div>

        {/* Privacy Toggle */}
        <div className="flex items-center space-x-2">
          <input type="checkbox" checked={isPrivate} onChange={(e) => setIsPrivate(e.target.checked)} id="priv" />
          <label htmlFor="priv" className="text-sm font-bold">Mark as Private (Login Required to Download)</label>
        </div>

        <button 
          disabled={loading}
          className="w-full bg-blue-600 text-white font-bold p-3 rounded-lg hover:bg-blue-700 transition"
        >
          {loading ? "Uploading..." : "Upload & Link File"}
        </button>
      </form>
    </div>
  )
}