/* eslint-disable react-hooks/incompatible-library */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* @disableReactCompiler */
'use client'

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight, Sheet } from 'lucide-react'
import ExportSPKModal from './components/ExportSpkModal'

type BengkelLog = {
  id: string
  nomor_polisi: string | null
  nama_bengkel: string | null
  jam_masuk: string | null
  jam_keluar: string | null
  durasi: string | null
  created_at: string | null
}

export default function SPK() {
  const [data, setData] = useState<BengkelLog[]>([])
  const [q, setQ] = useState('')
  const [page, setPage] = useState(1)
  const [pageCount, setPageCount] = useState(0)
  const [sorting, setSorting] = useState<any[]>([])
  const [exportOpen, setExportOpen] = useState(false)
  const limit = 10

  const columns: ColumnDef<BengkelLog>[] = [
    { accessorKey: 'nomor_polisi', header: 'No Polisi' },
    { accessorKey: 'nama_bengkel', header: 'Bengkel' },
    {
      accessorKey: 'jam_masuk',
      header: 'Jam Mulai (In-Stall)',
      cell: info =>
        info.getValue()
          ? new Date(info.getValue() as string).toLocaleString()
          : '-',
    },
    {
      accessorKey: 'jam_keluar',
      header: 'Jam Selesai (Out-Stall)',
      cell: info =>
        info.getValue()
          ? new Date(info.getValue() as string).toLocaleString()
          : '-',
    },
    { accessorKey: 'durasi', header: 'Durasi' },
    {
      accessorKey: 'created_at',
      header: 'Timestamp',
      cell: info =>
        info.getValue()
          ? new Date(info.getValue() as string).toLocaleString()
          : '-',
    },
  ]

  const table = useReactTable({
    data,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    manualPagination: true,
    pageCount,
  })

  useEffect(() => {
    const fetchData = async () => {
      const sort = sorting[0]?.id ?? 'created_at'
      const order = sorting[0]?.desc ? 'desc' : 'asc'

      const res = await fetch(
        `/api/bengkel-log?page=${page}&limit=${limit}&q=${q}&sort=${sort}&order=${order}`
      )
      const json = await res.json()

      setData(json.data)
      setPageCount(Math.ceil(json.total / limit))
    }

    fetchData()
  }, [q, page, sorting])

  return (
    <div className="p-6 space-y-4">
      <div className="flex justify-between">
        <input
          className="border rounded px-3 py-2"
          placeholder="Search..."
          onChange={e => {
            setQ(e.target.value)
            setPage(1)
          }}
        />
        <Button variant="outline" className='hover:cursor-pointer' onClick={() => setExportOpen(true)}>
          <Sheet size={32} color='green' />  Export
        </Button>
      </div>

      <table className="w-full border">
        <thead>
          {table.getHeaderGroups().map(hg => (
            <tr key={hg.id}>
              {hg.headers.map(header => (
                <th
                  key={header.id}
                  className="border p-2 cursor-pointer"
                  onClick={header.column.getToggleSortingHandler()}
                >
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
                  {{
                    asc: ' 🔼',
                    desc: ' 🔽',
                  }[header.column.getIsSorted() as string] ?? ''}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map(row => (
            <tr key={row.id}>
              {row.getVisibleCells().map(cell => (
                <td key={cell.id} className="border p-2">
                  {flexRender(
                    cell.column.columnDef.cell,
                    cell.getContext()
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="flex gap-2 items-center justify-center">
        <Button variant='outline'
          className='hover:cursor-pointer text-gray-900'
          disabled={page === 1}
          onClick={() => setPage(p => p - 1)}
        >
          <ChevronLeft />
        </Button>
        <span>
          Halaman {page} dari {pageCount}
        </span>
        <Button variant='outline'
          className='hover:cursor-pointer text-gray-900'
          disabled={page === pageCount}
          onClick={() => setPage(p => p + 1)}
        >
          <ChevronRight />
        </Button>
      </div>
      <ExportSPKModal
        open={exportOpen}
        onClose={() => setExportOpen(false)}
      />
    </div>
  )
}
