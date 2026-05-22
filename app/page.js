'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

export default function Dashboard() {
  const [projects, setProjects] = useState([])

  useEffect(() => {
    supabase.from('projects').select('*').then(({ data }) => setProjects(data))
  }, [])

  return (
    <main className="p-10">
      <h1 className="text-2xl font-bold mb-5">Research Dashboard</h1>
      <div className="grid gap-4">
        {projects.map(p => (
          <Link href={`/project/${p.id}`} key={p.id} className="p-4 border rounded hover:bg-gray-50">
            <h2 className="text-xl font-semibold text-blue-600">{p.name}</h2>
            <p>{p.description}</p>
          </Link>
        ))}
      </div>
    </main>
  )
}