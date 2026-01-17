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
import { ChevronLeft, ChevronRight, Search } from 'lucide-react'
import { FaRegFileExcel } from "react-icons/fa";
import { FcDeleteDatabase } from "react-icons/fc";
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
        <div className='relative'>
          <div className='absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none'>
            <Search size={18} />
          </div>
          <input
            className="block w-full p-3 ps-9 rounded-lg bg-gray-50 border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand shadow-xs placeholder:text-body"
            placeholder="Cari Data"
            onChange={e => {
              setQ(e.target.value)
              setPage(1)
            }}
          />
        </div>
        <Button variant="outline" className='hover:cursor-pointer' onClick={() => setExportOpen(true)}>
          <FaRegFileExcel className='w-6 h-6 text-xl text-green-600' /> Export
        </Button>
      </div>

      <table className="w-full text-sm text-left rtl:text-right text-body border rounded-lg">
        <thead className='text-heading text-body bg-slate-100 border-b border-default-medium'>
          {table.getHeaderGroups().map(hg => (
            <tr key={hg.id}>
              {hg.headers.map(header => (
                <th
                  key={header.id}
                  className="border p-2 cursor-pointer px-6 py-3 font-bold text-center hover:cursor-pointer"
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
          {table.getRowModel().rows.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className="text-center text-lg px-6 py-8 text-gray-500 font-black"
              >
                <div className='flex flex-col items-center justify-center'>
                  <FcDeleteDatabase size={32} className='mb-3' />
                  Data Kosong
                </div>
              </td>
            </tr>
          ) : (
            table.getRowModel().rows.map(row => (
              <tr
                key={row.id}
                className="bg-neutral-primary-soft border-b border-default hover:bg-slate-50"
              >
                {row.getVisibleCells().map(cell => (
                  <td key={cell.id} className="border px-6 py-4">
                    {flexRender(
                      cell.column.columnDef.cell,
                      cell.getContext()
                    )}
                  </td>
                ))}
              </tr>
            ))
          )}
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
