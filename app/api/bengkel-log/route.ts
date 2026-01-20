/* eslint-disable @typescript-eslint/no-explicit-any */
import { prisma } from '@/app/lib/prisma'
import { serializeBigInt } from '@/app/lib/serialize'
import { duration } from '@/app/lib/duration'
import { NextResponse } from 'next/server'

/* =========================
   GET (list + search)
========================= */
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)


    const page = Number(searchParams.get('page') ?? 1)
    const limit = Number(searchParams.get('limit') ?? 10)
    const q = searchParams.get('q') ?? ''
    const sort = searchParams.get('sort') ?? 'created_at'
    const order = searchParams.get('order') ?? 'desc'
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')


    const skip = (page - 1) * limit


    const where: any = {
      ...(q && {
        OR: [
          { nomor_polisi: { contains: q, mode: 'insensitive' } },
          { nama_bengkel: { contains: q, mode: 'insensitive' } },
        ],
      }),
      ...(startDate && endDate && {
        jam_mulai: {
          gte: new Date(startDate),
          lte: new Date(endDate),
        },
      }),
    }


    const [data, total] = await Promise.all([
      prisma.bengkel_log.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sort]: order },
      }),
      prisma.bengkel_log.count({ where }),
    ])


    return NextResponse.json({
      data: serializeBigInt(data),
      total,
      page,
      limit,
    })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ data: [], total: 0 })
  }
}

/* =========================
   POST (create)
========================= */
export async function POST(req: Request) {
  const body = await req.json()

  const jamMasuk = new Date(body.jam_masuk)
  const jamKeluar = new Date(body.jam_keluar)

  if (isNaN(jamMasuk.getTime()) || isNaN(jamKeluar.getTime())) {
    return NextResponse.json(
      { error: 'Jam masuk / keluar tidak valid' },
      { status: 400 }
    )
  }

  if (jamKeluar < jamMasuk) {
    return NextResponse.json(
      { error: 'Jam keluar tidak boleh lebih kecil dari jam masuk' },
      { status: 400 }
    )
  }

  const durasi = duration(jamMasuk, jamKeluar)

  const data = await prisma.bengkel_log.create({
    data: {
      nomor_polisi: body.nomor_polisi,
      nama_bengkel: body.nama_bengkel,
      jam_masuk: jamMasuk,
      jam_keluar: jamKeluar,
      durasi,
      keterangan: body.keterangan,
      km_aktual: body.km_aktual
    },
  })

  return NextResponse.json(serializeBigInt(data))
}
