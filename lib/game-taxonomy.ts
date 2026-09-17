import type { StepOption } from "./types";

export const GAME_TYPES: StepOption[] = [
  { value: "kuis", label: "Kuis Pilihan Ganda" },
  { value: "mencocokan", label: "Mencocokan" },
  { value: "susun_huruf", label: "Susun Huruf" },
  { value: "kartu_ingatan", label: "Kartu Ingatan" },
  { value: "benar_salah", label: "Benar atau Salah" },
  { value: "isi_rumpang", label: "Isi Kata Rumpang" },
  { value: "urutkan", label: "Urutkan" },
  { value: "tebak_gambar", label: "Tebak Gambar" },
  { value: "seret_kelompok", label: "Seret & Kelompokkan" },
  { value: "labirin", label: "Labirin Edukasi" },
];

/** Layout + interaction rules Claude must follow for each basic game type. */
export const GAME_TYPE_MECHANICS: Record<string, string> = {
  kuis:
    "Tampilkan 1 soal + 4 pilihan jawaban berbentuk tombol besar dalam grid 2x2, soal di atas. User klik jawaban → highlight hijau (benar) atau merah (salah) → delay 800ms → soal berikutnya.",
  mencocokan:
    "Tampilkan dua kolom item yang harus dipasangkan (misal istilah di kiri, arti/gambar di kanan, urutan diacak). User tap satu item di kolom kiri lalu satu di kolom kanan untuk membuat pasangan → beri highlight hijau jika pasangan benar (kedua item terkunci), merah sebentar lalu reset jika salah.",
  susun_huruf:
    "Tampilkan kata target secara acak hurufnya sebagai kotak-kotak huruf lepas, dan sejumlah slot kosong sesuai panjang kata. User tap huruf untuk mengisi slot berikutnya (atau drag ke slot). Saat semua slot terisi, cek otomatis: benar → animasi berhasil; salah → getar ringan dan reset slot.",
  kartu_ingatan:
    "Tampilkan grid kartu tertutup (jumlah genap, isinya pasangan gambar/istilah materi). User tap dua kartu untuk membukanya; jika pasangan cocok, kartu tetap terbuka dengan animasi berhasil; jika tidak, kartu tertutup lagi setelah delay singkat.",
  benar_salah:
    "Tampilkan satu pernyataan terkait materi + 2 tombol besar berdampingan: Benar dan Salah. User klik salah satu → highlight hijau/merah → delay 800ms → pernyataan berikutnya.",
  isi_rumpang:
    "Tampilkan satu kalimat dengan bagian kosong (rumpang) + beberapa pilihan kata sebagai tombol untuk mengisi bagian kosong tersebut. User klik pilihan yang tepat → highlight benar/salah → lanjut ke kalimat berikutnya.",
  urutkan:
    "Tampilkan beberapa item/gambar dalam urutan acak yang harus disusun ulang sesuai urutan yang benar (drag untuk menukar posisi, atau tap berurutan). Setelah user menandai urutan final, cek otomatis dan beri feedback.",
  tebak_gambar:
    "Tampilkan satu ilustrasi/gambar besar terkait materi + beberapa pilihan jawaban berbentuk tombol teks. User klik jawaban yang cocok dengan gambar → highlight benar/salah → lanjut ke gambar berikutnya.",
  seret_kelompok:
    "Tampilkan beberapa item yang harus diseret (drag & drop) ke salah satu dari 2-3 kotak kategori yang sesuai. Beri feedback saat item diletakkan di kategori benar (nempel + animasi) atau salah (kembali ke posisi awal).",
  labirin:
    "Tampilkan jalur/labirin sederhana dengan beberapa titik pemberhentian (checkpoint). Di tiap checkpoint muncul satu pertanyaan singkat; jawaban benar membuka jalan ke checkpoint berikutnya hingga mencapai titik akhir.",
};

export const THEMES: StepOption[] = [
  { value: "hijaiyah", label: "Hijaiyah" },
  { value: "asmaul_husna", label: "Asmaul Husna" },
  { value: "angka_berhitung", label: "Angka & Berhitung" },
  { value: "nama_bulan", label: "Nama Bulan" },
  { value: "nama_hari", label: "Nama Hari" },
  { value: "warna", label: "Warna" },
  { value: "bentuk_geometri", label: "Bentuk Geometri" },
  { value: "hewan_habitat", label: "Hewan & Habitatnya" },
  { value: "buah_sayur", label: "Buah & Sayur" },
  { value: "profesi", label: "Profesi & Cita-cita" },
  { value: "anggota_tubuh", label: "Anggota Tubuh" },
  { value: "sains_dasar", label: "Sains Dasar" },
  { value: "transportasi", label: "Transportasi" },
  { value: "alfabet", label: "Alfabet" },
  { value: "adab_akhlak", label: "Adab & Akhlak Islami" },
  { value: "doa_harian", label: "Doa Sehari-hari" },
  { value: "rukun_islam_iman", label: "Rukun Islam & Rukun Iman" },
  { value: "tata_surya", label: "Tata Surya & Luar Angkasa" },
  { value: "kebersihan_kesehatan", label: "Kebersihan & Kesehatan" },
  { value: "bendera_negara", label: "Bendera & Negara" },
];

export const AGE_BRACKETS: StepOption[] = [
  { value: "3-4", label: "3-4 tahun" },
  { value: "5-6", label: "5-6 tahun (TK)" },
  { value: "7-8", label: "7-8 tahun (SD Awal)" },
  { value: "9-10", label: "9-10 tahun (SD)" },
];

/** Explicit tone instruction per fixed age bracket — decided in code, not left
 * for the model to infer, since these four values are always in this shape. */
export const AGE_TONE: Record<string, string> = {
  "3-4":
    "Usia 3-4 tahun (PAUD): gunakan kalimat sangat pendek dan sederhana, kosakata dasar, sapaan hangat seperti \"adik-adik\", banyak pengulangan dan visual besar, hindari teks panjang.",
  "5-6":
    "Usia 5-6 tahun (TK): gunakan nada ramah-anak, sederhana dan playful, sapaan \"adik-adik\", kalimat pendek dan mudah dipahami.",
  "7-8":
    "Usia 7-8 tahun (SD Awal): nada ramah-anak dan playful namun boleh sedikit lebih kaya kosakata dan konteks dibanding usia TK, tetap sederhana dan menyenangkan.",
  "9-10":
    "Usia 9-10 tahun (SD): nada tetap ceria dan bersahabat, boleh menggunakan kalimat yang sedikit lebih kompleks dan tantangan yang lebih menuntut pemikiran, sebut pengguna \"kamu\" atau \"adik-adik\".",
};

/** Fallback tone-detection block used only when the age field is custom/typed
 * free text, reproducing the original manual template's conditional logic. */
export const CUSTOM_AGE_TONE_FALLBACK = `SESUAIKAN NADA & GAYA DENGAN TARGET USIA:
- Jika target usia menunjukkan dewasa/remaja akhir/profesional (mis. "Dewasa", "18+", "17+", atau angka >= 17): gunakan nada bahasa matang, praktis, tidak kekanak-kanakan — HINDARI sebutan "anak", analogi mainan anak, sapaan "adik-adik", warna pastel/karakter maskot ala anak TK. Sebut pengguna sebagai "kamu"/"pemain"/"peserta".
- Jika target usia menunjukkan anak-anak (di bawah 12 tahun, "TK", "PAUD", "SD"): gunakan nada ramah-anak, sederhana dan playful seperti biasa.
- Jika target usia menunjukkan remaja (13-16 tahun, SMP/SMA): nada lebih santai tapi tetap tidak kekanak-kanakan.`;

export const DIFFICULTIES: StepOption[] = [
  { value: "mudah", label: "Mudah" },
  { value: "sedang", label: "Sedang" },
  { value: "menantang", label: "Menantang" },
];

export const FEATURES: StepOption[] = [
  { value: "skor_poin", label: "Skor & Poin" },
  { value: "animasi_bintang", label: "Animasi Bintang / Confetti" },
  { value: "coba_lagi", label: "Tombol Coba Lagi" },
  { value: "timer", label: "Timer / Tantangan Waktu" },
  { value: "level_bertahap", label: "Level Bertahap" },
  { value: "badge", label: "Badge / Lencana Pencapaian" },
  { value: "leaderboard", label: "Leaderboard Sesi (lokal)" },
  { value: "hint", label: "Petunjuk / Hint" },
  { value: "progress_bar", label: "Progress Bar" },
  { value: "efek_suara", label: "Efek Suara Sederhana" },
];

export const COLOR_THEMES: StepOption[] = [
  { value: "pink_ceria", label: "Pink Ceria" },
  { value: "pelangi", label: "Pelangi" },
  { value: "biru_muda", label: "Biru Muda / Langit" },
  { value: "hijau_toska", label: "Hijau Toska" },
  { value: "oranye_cerah", label: "Oranye Cerah" },
  { value: "ungu_lavender", label: "Ungu Lavender" },
  { value: "kuning_matahari", label: "Kuning Matahari" },
  { value: "merah_ceri", label: "Merah Ceri" },
  { value: "coklat_hangat", label: "Coklat Hangat" },
  { value: "pastel_multicolor", label: "Pastel Multicolor" },
];

export const INTERACTIVE_CONCEPTS: StepOption[] = [
  { value: "kartu_terbalik", label: "Dunia Kartu Terbalik" },
  { value: "quest_rpg", label: "Petualangan Quest RPG" },
  { value: "lab_seret_lepas", label: "Laboratorium Seret & Lepas" },
  { value: "arena_kecepatan", label: "Arena Tantangan Kecepatan" },
  { value: "kebun_dunia", label: "Pembangun Dunia Kebun" },
  { value: "pulau_harta_karun", label: "Petualangan Pulau Harta Karun" },
  { value: "roket_angkasa", label: "Balapan Roket Angkasa" },
  { value: "kota_impian", label: "Kota Impian Bangun-Bangunan" },
  { value: "detektif_cilik", label: "Detektif Misteri Cilik" },
  { value: "kebun_binatang", label: "Kebun Binatang Interaktif" },
];

export const CUSTOM_OPTION_VALUE = "__custom__";
export const CUSTOM_OPTION_LABEL = "Ketik Sendiri";

export function labelFor(options: StepOption[], value: string): string {
  return options.find((o) => o.value === value)?.label ?? value;
}

export function labelsFor(options: StepOption[], values: string[]): string {
  return values.map((v) => labelFor(options, v)).join(", ");
}
