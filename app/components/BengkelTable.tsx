/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useEffect, useState } from "react"
import { supabase } from "../lib/supabase"

export default function BengkelTable() {
  const [data, setData] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');

  const pageSize = 5;

  useEffect(() => {
    const fetchData = async () => {
      const from = (page - 1) * pageSize
      const to = from + pageSize - 1


      let query = supabase
        .from('bengkel_log')
        .select('*')
        .order('created_at', { ascending: false })
        .range(from, to)


      if (search) query = query.ilike('nomor_polisi', `%${search}%`)


      const { data } = await query
      setData(data || [])
    }
    fetchData()
  }, [page, search])

  return (
    <div>
      <input
        placeholder="Search Nomor Polisi"
        className="border p-2 mb-3"
        onChange={e => setSearch(e.target.value)}
      />


      <table className="w-full border">
        <thead>
          <tr className="border">
            <th>ID</th>
            <th>Nomor Polisi</th>
            <th>Bengkel</th>
            <th>Masuk</th>
            <th>Keluar</th>
          </tr>
        </thead>
        <tbody>
          {data.map(row => (
            <tr key={row.id} className="border">
              <td>{row.id}</td>
              <td>{row.nomor_polisi}</td>
              <td>{row.nama_bengkel}</td>
              <td>{row.jam_masuk}</td>
              <td>{row.jam_keluar}</td>
            </tr>
          ))}
        </tbody>
      </table>


      <div className="mt-4 flex gap-2">
        <button onClick={() => setPage(p => Math.max(1, p - 1))}>Prev</button>
        <button onClick={() => setPage(p => p + 1)}>Next</button>
      </div>
    </div>
  )
};
