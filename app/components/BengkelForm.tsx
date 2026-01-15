/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { supabase } from '../lib/supabase'
import { useState } from 'react'


export default function BengkelForm() {
  const [form, setForm] = useState({
    nomor_polisi: '',
    nama_bengkel: '',
    jam_masuk: '',
    jam_keluar: ''
  })


  const submit = async () => {
    await supabase.from('bengkel_log').insert(form)
    alert('Data saved')
    setForm({ nomor_polisi: '', nama_bengkel: '', jam_masuk: '', jam_keluar: '' })
  }


  return (
    <div className="space-y-3">
      {Object.keys(form).map((key) => (
        <input
          key={key}
          type={key.includes('jam') ? 'datetime-local' : 'text'}
          placeholder={key}
          className="border p-2 w-full"
          value={(form as any)[key]}
          onChange={e => setForm({ ...form, [key]: e.target.value })}
        />
      ))}
      <button onClick={submit} className="bg-blue-600 text-white px-4 py-2">
        Save
      </button>
    </div>
  )
}