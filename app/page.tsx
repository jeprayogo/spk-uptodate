'use client'

import { useState } from "react"
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";
import Alert from "./components/Alert";
import { Button } from "@/components/ui/button";
import { Car, Loader2Icon, Wrench } from "lucide-react";

export default function Home() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [alert, setAlert] = useState<{ message: string; type: 'info' | 'error' | 'success' | 'warning' | undefined }>({ message: '', type: undefined });

  const [form, setForm] = useState({
    nomor_polisi: '',
    nama_bengkel: '',
    jam_masuk: '',
    jam_keluar: '',
    durasi: '',
  });

  const [error, setError] = useState<Record<string, string | undefined>>({
    nomor_polisi: '',
    nama_bengkel: '',
    jam_masuk: '',
    jam_keluar: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;

    setForm(prevFormData => ({
      ...prevFormData,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const validateForm = () => {

    let isValidForm = true

    const newError: Record<string, string | undefined> = {
      nomor_polisi: '',
      nama_bengkel: '',
      jam_masuk: '',
      jam_keluar: '',
    };

    if (!form.nomor_polisi) {
      isValidForm = false
      newError.nomor_polisi = 'Plat Nomor Harus Diisi'
    }

    if (!form.nama_bengkel) {
      isValidForm = false
      newError.nama_bengkel = 'Nama Bengkel Harus Diisi'
    }

    if (!form.jam_masuk) {
      isValidForm = false
      newError.jam_masuk = 'Jam Mulai (In-Stall) Harus Diisi'
    }

    if (!form.jam_keluar) {
      isValidForm = false
      newError.jam_keluar = 'Jam Selesai (Out-Stall) Harus Diisi'
    }

    if (new Date(form.jam_keluar) < new Date(form.jam_masuk)) {
      isValidForm = false
      newError.jam_keluar = 'Jam keluar tidak boleh lebih kecil dari jam masuk'
    }


    setError(newError)
    return isValidForm
  }

  const submit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault()

    if (!validateForm()) return;

    setLoading(true)

    try {
      const response = await fetch('/api/bengkel-log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          jam_masuk: new Date(form.jam_masuk),
          jam_keluar: new Date(form.jam_keluar),
        }),
      })

      if (!response.ok) throw new Error('Gagal menyimpan data')

      Swal.fire({
        icon: "success",
        title: "Data berhasil disimpan",
        showConfirmButton: false,
        timer: 1500,
      });
      resetForm()
      setTimeout(() => router.refresh(), 500);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Terjadi kesalahan menambahkan Member";
      setAlert({ message, type: "error" });
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setForm({
      nomor_polisi: '',
      nama_bengkel: '',
      jam_masuk: '',
      jam_keluar: '',
      durasi: '',
    });
    setError({
      nomor_polisi: '',
      nama_bengkel: '',
      jam_masuk: '',
      jam_keluar: '',
    });
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col items-center justify-center">
      {alert.message && <Alert message={alert.message} type={alert.type} />}
      <div className="w-full max-w-xl bg-white rounded-2xl shadow-lg p-6 space-y-5">
        <h1 className="text-2xl font-semibold text-slate-800 text-center">Catatan Bengkel Kendaraan</h1>
        <p className="m-5 text-sm text-center text-slate-600">Silahkan isi data kendaraan dibawah ini</p>

        <form onSubmit={submit} className="max-w-xl mx-auto">
          <div className="mb-5">
            <label htmlFor="nomor_polisi" className="block mb-2.5 text-sm font-medium text-heading">Nomor Polisi</label>
            <div className="relative">
              <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                <Car color="gray" size={18} />
              </div>
              <input
                className={`${error.nomor_polisi ? 'border-red-500' : ''} block w-full ps-9 pe-3 py-2.5 bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand shadow-xs placeholder:text-body`}
                name="nomor_polisi"
                placeholder="B 1234 XYZ"
                maxLength={11}
                onChange={handleChange}
                value={form.nomor_polisi}
              />
            </div>
            {error.nomor_polisi && <p className="mt-2 text-sm text-red-600">{error.nomor_polisi}</p>}
          </div>



          <div className="mb-5">
            <label htmlFor="nama_bengkel" className="block mb-2.5 text-sm font-medium text-heading">Nama Bengkel</label>
            <div className="relative">
              <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                <Wrench size={18} color="gray" />
              </div>
              <input
                className={`${error.nama_bengkel ? 'border-red-500' : ''} block w-full ps-9 pe-3 py-2.5 bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand shadow-xs `}
                name="nama_bengkel"
                placeholder="Nama Bengkel"
                onChange={handleChange}
                value={form.nama_bengkel}
              />
            </div>

            {error.nama_bengkel && <p className="mt-2 text-sm text-red-600">{error.nama_bengkel}</p>}
          </div>



          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="mb-5">
              <label htmlFor="jam_masuk" className="block mb-2.5 text-sm font-medium text-heading">Jam Mulai (In-Stall)</label>
              <input
                type="datetime-local"
                className={`w-full rounded-lg border ${error.jam_masuk ? 'border-red-500' : ''} px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                name="jam_masuk"
                placeholder="Pilih Jam Mulai (In-Stall)"
                onChange={handleChange}
                value={form.jam_masuk}
              />
              {error.jam_masuk && <p className="mt-2 text-sm text-red-600">{error.jam_masuk}</p>}
            </div>



            <div className="mb-5">
              <label htmlFor="jam_keluar" className="block mb-2.5 text-sm font-medium text-heading">Jam Selesai (Out-Stall)</label>
              <input
                type="datetime-local"
                className={`w-full rounded-lg border ${error.jam_keluar ? 'border-red-500' : ''} px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                name="jam_keluar"
                placeholder="Pilih Jam Selesai (Out-Stall)"
                onChange={handleChange}
                value={form.jam_keluar}
              />
              {error.jam_keluar && <p className="mt-2 text-sm text-red-600">{error.jam_keluar}</p>}
            </div>
          </div>



          <div className="space-x-4">
            {loading ? (
              <Button disabled>
                <Loader2Icon className="animate-spin" />
                Please wait
              </Button>
            ) : (
              <Button className="hover: cursor-pointer" type='submit'>Simpan</Button>
            )}
          </div>
        </form>
      </div>
    </div>
  )
};
