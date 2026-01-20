/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useState } from 'react'
import * as XLSX from 'xlsx-js-style'
import { Button } from '@/components/ui/button'
import { FaRegFileExcel } from "react-icons/fa";
import { formatNumber } from '@/app/lib/number_format';

type Props = {
  open: boolean
  onClose: () => void
}

export default function ExportSPKModal({ open, onClose }: Props) {
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [loading, setLoading] = useState(false)

  if (!open) return null

  const exportExcel = async () => {
    setLoading(true)
    try {
      const res = await fetch(
        `/api/bengkel-log?startDate=${startDate}&endDate=${endDate}&limit=10000`
      )
      const json = await res.json()

      const worksheet = XLSX.utils.json_to_sheet(
        json.data.map((d: any) => ({
          'Nomor Polisi': d.nomor_polisi ?? '-',
          'KM Aktual': formatNumber(d.km_aktual),
          'Nama Bengkel': d.nama_bengkel ?? '-',
          'Jam Mulai (In-Stall)': d.jam_masuk
            ? new Date(d.jam_masuk).toLocaleString()
            : '-',
          'Jam Selesai (Out-Stall)': d.jam_keluar
            ? new Date(d.jam_keluar).toLocaleString()
            : '-',
          'Durasi': d.durasi ?? '-',
          'Pekerjaan': d.keterangan ?? '-',
          'Timestamp': d.created_at
            ? new Date(d.created_at).toLocaleString()
            : '-',
        }))
      )

      /* =========================
      HEADER STYLE
  ========================= */
      const range = XLSX.utils.decode_range(worksheet['!ref']!)

      for (let C = range.s.c; C <= range.e.c; ++C) {
        const cellAddress = XLSX.utils.encode_cell({ r: 0, c: C })
        const cell = worksheet[cellAddress]

        if (!cell) continue

        cell.s = {
          font: { bold: true },
          alignment: { horizontal: 'center', vertical: 'center', wrapText: true },
          border: {
            top: { style: 'thin' },
            bottom: { style: 'thin' },
            left: { style: 'thin' },
            right: { style: 'thin' },
          },
        }
      }

      /* =========================
         BODY STYLE
      ========================= */
      for (let R = range.s.r + 1; R <= range.e.r; ++R) {
        for (let C = range.s.c; C <= range.e.c; ++C) {
          const addr = XLSX.utils.encode_cell({ r: R, c: C })
          const cell = worksheet[addr]
          if (!cell) continue

          cell.s = {
            alignment: { vertical: 'center', wrapText: true },
            border: {
              top: { style: 'thin' },
              bottom: { style: 'thin' },
              left: { style: 'thin' },
              right: { style: 'thin' },
            },
          }
        }
      }

      /* =========================
         COLUMN WIDTH
      ========================= */
      worksheet['!cols'] = [
        { wch: 15 }, // nomor_polisi
        { wch: 15 }, // km_aktual
        { wch: 25 }, // nama_bengkel
        { wch: 22 }, // jam_masuk
        { wch: 22 }, // jam_keluar
        { wch: 22 }, // durasi
        { wch: 25 }, // keterangan
        { wch: 25 }, // created_at
      ]

      // worksheet['!rows'] = new Array(range.e.r + 1).fill({ hpt: 24 })

      const workbook = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(workbook, worksheet, 'SPK')

      XLSX.writeFile(workbook, 'spk-bengkel.xlsx')
      onClose()
    } finally {
      setLoading(false)
    }

  }

  return (
    <div className='fixed inset-0 z-50 bg-black/40 flex items-center justify-center'>
      <div className="bg-white rounded-xl p-6 w-full max-w-md space-y-4">
        <h1 className="text-xl font-semibold">Export SPK</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="mb-5">
            <label className="block mb-2.5 text-sm font-medium text-heading">Jam Mulai Awal</label>
            <input
              type="date"
              className="w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={e => setStartDate(e.target.value)}
            />
          </div>
          <div className="mb-5">
            <label className="block mb-2.5 text-sm font-medium text-heading">Jam Mulai Akhir</label>
            <input
              type="date"
              className="w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              name="jam_keluar"
              onChange={e => setEndDate(e.target.value)}
            />
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <Button variant="outline" onClick={onClose} className='hover:cursor-pointer'>
            Cancel
          </Button>
          <Button variant={'outline'} onClick={exportExcel} disabled={loading} className='hover:cursor-pointer'>
            <FaRegFileExcel className='w-6 h-6 text-xl text-green-600' /> {loading ? 'Exporting...' : 'Export'}
          </Button>
        </div>
      </div>
    </div>

  )
}
