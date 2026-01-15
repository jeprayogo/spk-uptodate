-- CreateTable
CREATE TABLE "bengkel_log" (
    "id" BIGSERIAL NOT NULL,
    "nomor_polisi" VARCHAR(20),
    "nama_bengkel" VARCHAR(100),
    "jam_masuk" TIMESTAMP(6),
    "jam_keluar" TIMESTAMP(6),
    "durasi" VARCHAR(100),
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "bengkel_log_pkey" PRIMARY KEY ("id")
);
