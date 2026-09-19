import type { StepOption } from "./types";

/** Shown on the opening "idea" step: a handful of concrete examples from
 * each mode (so "Game Basic" / "Game Interaktif" mean something concrete on
 * first sight, not just a bare label) plus an explicit escape hatch to the
 * full picker for users who'd rather browse than free-type. Values are
 * namespaced ("basic:", "interactive:", "explore:") so lib/flow-machine.ts
 * can route each pick without a separate lookup table. */
export const IDEA_SUGGESTIONS: StepOption[] = [
  { value: "basic:kuis", label: "Kuis Perkalian Seru", emoji: "🧠", group: "basic" },
  { value: "basic:mencocokan", label: "Mencocokan Hewan & Habitat", emoji: "🔗", group: "basic" },
  { value: "basic:susun_huruf", label: "Susun Huruf Alfabet", emoji: "🔤", group: "basic" },
  { value: "interactive:quest_rpg", label: "Petualangan Quest RPG", emoji: "🗺️", group: "interactive" },
  { value: "interactive:pabrik_karakter", label: "Pabrik Karakter Ajaib", emoji: "🏭", group: "interactive" },
  { value: "interactive:lab_seret_lepas", label: "Laboratorium Seret & Lepas", emoji: "🧪", group: "interactive" },
  { value: "explore:basic", label: "Lihat semua jenis Game Basic", emoji: "🧩", group: "explore" },
  { value: "explore:interactive", label: "Lihat semua konsep Game Interaktif", emoji: "🎮", group: "explore" },
];

export const GAME_TYPES: StepOption[] = [
  { value: "kuis", label: "Kuis Pilihan Ganda", emoji: "🧠" },
  { value: "mencocokan", label: "Mencocokan", emoji: "🔗" },
  { value: "susun_huruf", label: "Susun Huruf", emoji: "🔤" },
  { value: "kartu_ingatan", label: "Kartu Ingatan", emoji: "🃏" },
  { value: "benar_salah", label: "Benar atau Salah", emoji: "✅" },
  { value: "isi_rumpang", label: "Isi Kata Rumpang", emoji: "✏️" },
  { value: "urutkan", label: "Urutkan", emoji: "🔢" },
  { value: "tebak_gambar", label: "Tebak Gambar", emoji: "🖼️" },
  { value: "seret_kelompok", label: "Seret & Kelompokkan", emoji: "🧺" },
  { value: "labirin", label: "Labirin Edukasi", emoji: "🌀" },
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
  { value: "hijaiyah", label: "Hijaiyah", emoji: "🕌" },
  { value: "asmaul_husna", label: "Asmaul Husna", emoji: "🌟" },
  { value: "angka_berhitung", label: "Angka & Berhitung", emoji: "🔢" },
  { value: "nama_bulan", label: "Nama Bulan", emoji: "📅" },
  { value: "nama_hari", label: "Nama Hari", emoji: "☀️" },
  { value: "warna", label: "Warna", emoji: "🎨" },
  { value: "bentuk_geometri", label: "Bentuk Geometri", emoji: "🔷" },
  { value: "hewan_habitat", label: "Hewan & Habitatnya", emoji: "🐾" },
  { value: "buah_sayur", label: "Buah & Sayur", emoji: "🍎" },
  { value: "profesi", label: "Profesi & Cita-cita", emoji: "👩‍⚕️" },
  { value: "anggota_tubuh", label: "Anggota Tubuh", emoji: "🧍" },
  { value: "sains_dasar", label: "Sains Dasar", emoji: "🔬" },
  { value: "transportasi", label: "Transportasi", emoji: "🚗" },
  { value: "alfabet", label: "Alfabet", emoji: "🔡" },
  { value: "adab_akhlak", label: "Adab & Akhlak Islami", emoji: "🤲" },
  { value: "doa_harian", label: "Doa Sehari-hari", emoji: "📿" },
  { value: "rukun_islam_iman", label: "Rukun Islam & Rukun Iman", emoji: "☪️" },
  { value: "tata_surya", label: "Tata Surya & Luar Angkasa", emoji: "🪐" },
  { value: "kebersihan_kesehatan", label: "Kebersihan & Kesehatan", emoji: "🧼" },
  { value: "bendera_negara", label: "Bendera & Negara", emoji: "🏳️" },
  { value: "bahasa_inggris", label: "Bahasa Inggris Dasar", emoji: "🇬🇧" },
  { value: "bahasa_indonesia", label: "Bahasa Indonesia", emoji: "🇮🇩" },
  { value: "perkalian_pembagian", label: "Perkalian & Pembagian", emoji: "✖️" },
  { value: "ips_sosial", label: "Pengetahuan Sosial (IPS)", emoji: "🌏" },
  { value: "pancasila_ppkn", label: "Pancasila & PPKn", emoji: "🕊️" },
  { value: "seni_kerajinan", label: "Seni & Kerajinan", emoji: "🖌️" },
  { value: "olahraga_pjok", label: "Olahraga & Gerak Tubuh", emoji: "⚽" },
];

export const AGE_BRACKETS: StepOption[] = [
  { value: "3-4", label: "3-4 tahun", emoji: "👶" },
  { value: "5-6", label: "5-6 tahun (TK)", emoji: "🧒" },
  { value: "7-8", label: "7-8 tahun (SD Awal)", emoji: "👦" },
  { value: "9-10", label: "9-10 tahun (SD)", emoji: "🧑" },
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
  { value: "mudah", label: "Mudah", emoji: "😊" },
  { value: "sedang", label: "Sedang", emoji: "😐" },
  { value: "menantang", label: "Menantang", emoji: "🔥" },
];

export const FEATURES: StepOption[] = [
  { value: "skor_poin", label: "Skor & Poin", emoji: "🏆" },
  { value: "animasi_bintang", label: "Animasi Bintang / Confetti", emoji: "🎉" },
  { value: "coba_lagi", label: "Tombol Coba Lagi", emoji: "🔁" },
  { value: "timer", label: "Timer / Tantangan Waktu", emoji: "⏱️" },
  { value: "level_bertahap", label: "Level Bertahap", emoji: "📈" },
  { value: "badge", label: "Badge / Lencana Pencapaian", emoji: "🎖️" },
  { value: "leaderboard", label: "Leaderboard Sesi (lokal)", emoji: "🥇" },
  { value: "hint", label: "Petunjuk / Hint", emoji: "💡" },
  { value: "progress_bar", label: "Progress Bar", emoji: "📊" },
  { value: "efek_suara", label: "Efek Suara Sederhana", emoji: "🔊" },
  { value: "dua_pemain", label: "Mode 2 Pemain (Main Bareng)", emoji: "👨‍👩‍👧" },
];

/** Feature value that turns on the shared/turn-based 2-player instruction
 * block in the prompt (e.g. anak bermain bergantian dengan orang tua). */
export const TWO_PLAYER_FEATURE_VALUE = "dua_pemain";

export const COLOR_THEMES: StepOption[] = [
  { value: "pink_ceria", label: "Pink Ceria", emoji: "🌸" },
  { value: "pelangi", label: "Pelangi", emoji: "🌈" },
  { value: "biru_muda", label: "Biru Muda / Langit", emoji: "💙" },
  { value: "hijau_toska", label: "Hijau Toska", emoji: "🌿" },
  { value: "oranye_cerah", label: "Oranye Cerah", emoji: "🧡" },
  { value: "ungu_lavender", label: "Ungu Lavender", emoji: "💜" },
  { value: "kuning_matahari", label: "Kuning Matahari", emoji: "💛" },
  { value: "merah_ceri", label: "Merah Ceri", emoji: "❤️" },
  { value: "coklat_hangat", label: "Coklat Hangat", emoji: "🤎" },
  { value: "pastel_multicolor", label: "Pastel Multicolor", emoji: "🍬" },
];

export const INTERACTIVE_CONCEPTS: StepOption[] = [
  { value: "kartu_terbalik", label: "Dunia Kartu Terbalik", emoji: "🃏" },
  { value: "quest_rpg", label: "Petualangan Quest RPG", emoji: "🗺️" },
  { value: "lab_seret_lepas", label: "Laboratorium Seret & Lepas", emoji: "🧪" },
  { value: "arena_kecepatan", label: "Arena Tantangan Kecepatan", emoji: "⚡" },
  { value: "kebun_dunia", label: "Pembangun Dunia Kebun", emoji: "🌻" },
  { value: "pulau_harta_karun", label: "Petualangan Pulau Harta Karun", emoji: "🏝️" },
  { value: "roket_angkasa", label: "Balapan Roket Angkasa", emoji: "🚀" },
  { value: "kota_impian", label: "Kota Impian Bangun-Bangunan", emoji: "🏙️" },
  { value: "detektif_cilik", label: "Detektif Misteri Cilik", emoji: "🕵️" },
  { value: "kebun_binatang", label: "Kebun Binatang Interaktif", emoji: "🦁" },
  { value: "resto_chef", label: "Restoran Mini Chef", emoji: "🍳" },
  { value: "sirkus_terampil", label: "Sirkus Terampil", emoji: "🎪" },
  { value: "puzzle_ajaib", label: "Puzzle Dunia Ajaib", emoji: "🧩" },
  { value: "panggung_musik", label: "Panggung Musik Ceria", emoji: "🎵" },
  { value: "rumah_boneka", label: "Rumah Boneka Interaktif", emoji: "🏠" },
  { value: "pabrik_karakter", label: "Pabrik Karakter Ajaib", emoji: "🏭" },
];

/** Bespoke gameplay loop + question style per interactive concept — written
 * specifically for that concept's name/fantasy, not a generic "be creative"
 * instruction and not the basic-game quiz layout. */
export const INTERACTIVE_CONCEPT_MECHANICS: Record<string, string> = {
  kartu_terbalik:
    "Sebarkan kartu-kartu besar bergaya dunia bertema materi, tertutup dengan pola unik. Pemain membalik 2 kartu tiap giliran untuk mencari pasangan (gambar ↔ istilah/jawaban materi). Setiap pasangan cocok memicu satu elemen 'dunia' di latar belakang menyala/tumbuh (bukan sekadar kartu hilang) — beri rasa dunia yang hidup dan makin lengkap seiring progres.",
  quest_rpg:
    "Karakter kecil pemain berjalan di peta perjalanan linear/bercabang sederhana dari titik ke titik. Di tiap titik ada 'penjaga' ramah yang mengajukan satu tantangan terkait materi; jawaban benar memberi item/EXP dan membuka jalan ke titik berikutnya, jawaban salah cukup beri kesempatan coba lagi tanpa hukuman berat. Akhiri dengan perayaan 'naik level' di titik akhir peta.",
  lab_seret_lepas:
    "Tampilkan meja laboratorium dengan beberapa 'bahan/objek' yang harus diseret (drag & drop) ke dalam wadah/kategori sesuai materi. Kombinasi benar memicu reaksi visual seru (percikan warna/gelembung, aman dan lucu — bukan menakutkan). Bahan yang belum dikelompokkan tetap terlihat menunggu di rak sampai semua selesai.",
  arena_kecepatan:
    "Serangkaian tantangan singkat muncul cepat berurutan dengan ring/bar waktu berjalan di sekitar layar. Pemain menjawab secepat mungkin untuk mengejar 'combo streak' — jawaban benar berturut-turut memicu efek visual combo yang makin meriah (api/kilat/bintang bertumpuk).",
  kebun_dunia:
    "Setiap jawaban benar menumbuhkan satu elemen kebun (bunga, pohon kecil, atau hewan kebun) di lahan virtual milik pemain, tumbuh dengan animasi mekar. Di akhir permainan, tampilkan kebun yang sudah penuh tumbuh sebagai hasil karya personal pemain, lalu beri opsi 'lihat kebunku' sebelum ke skor akhir.",
  pulau_harta_karun:
    "Tampilkan peta pulau dengan beberapa titik X tersembunyi. Setiap titik dibuka dengan menjawab satu pertanyaan/teka-teki terkait materi; titik yang terbuka mengungkap sebagian jalur peta dan memberi koin virtual. Di titik terakhir, peti harta karun terbuka dengan animasi perayaan besar.",
  roket_angkasa:
    "Roket pemain melaju di lintasan angkasa berlatar bintang paralaks; setiap jawaban benar mendorong roket maju signifikan menuju planet tujuan, jawaban salah membuat roket melambat sedikit (jangan pernah mundur/gagal total, supaya tetap memacu semangat). Rayakan pendaratan di planet tujuan sebagai puncak permainan.",
  kota_impian:
    "Setiap jawaban benar membuka satu gedung/bangunan baru yang langsung ditambahkan ke skyline kota virtual milik pemain (rumah, taman, gedung ikonik sesuai tema). Kota yang makin ramai dan berwarna jadi representasi visual kemajuan belajar; tampilkan skyline penuh di halaman skor akhir.",
  detektif_cilik:
    "Sajikan satu 'kasus' ringan dan ceria (mis. mencari benda hilang, memecahkan kode rahasia) — bukan tema menakutkan. Tiap pertanyaan terkait materi yang dijawab benar memberi satu 'petunjuk' yang dikumpulkan di papan investigasi virtual; setelah semua petunjuk terkumpul, ungkap solusi kasus sebagai klimaks permainan.",
  kebun_binatang:
    "Pemain 'membuka kandang' hewan baru satu per satu di kebun binatang virtual dengan menjawab pertanyaan terkait materi per hewan. Hewan yang sudah terbuka bisa disentuh untuk animasi/reaksi lucu singkat sebagai reward, dan berjejer di zoo virtual yang makin ramai.",
  resto_chef:
    "Pemain berperan sebagai koki cilik yang menerima 'pesanan' pelanggan animasi. Setiap pesanan diselesaikan dengan menjawab pertanyaan materi atau menyeret bahan yang benar ke piring (drag & drop). Pesanan yang selesai benar disajikan ke pelanggan yang terlihat senang; pesanan menumpuk jadi skor 'pelanggan puas'.",
  sirkus_terampil:
    "Susun beberapa mini-tantangan singkat bergaya atraksi sirkus berurutan sebagai satu 'pertunjukan' (mis. melempar bola ke keranjang berlabel jawaban benar, menjaga karakter tetap seimbang selama menjawab tepat waktu). Penonton animasi bertepuk tangan/bersorak setiap atraksi berhasil, memberi rasa pertunjukan yang hidup.",
  puzzle_ajaib:
    "Satu gambar besar bertema materi terbagi menjadi beberapa potongan puzzle yang terkunci. Setiap jawaban benar pada pertanyaan terkait materi membuka satu potongan untuk dipasang (drag ke slot yang tepat). Gambar utuh yang akhirnya terungkap jadi reward visual utama di penghujung permainan.",
  panggung_musik:
    "Pemain 'tampil' di panggung virtual; setiap jawaban benar menambahkan satu instrumen, penari, atau lampu sorot baru ke panggung sehingga pertunjukan makin ramai dan meriah secara visual seiring progres. Tutup dengan 'pertunjukan penuh' saat semua soal selesai, lengkap dengan tepuk tangan penonton.",
  rumah_boneka:
    "Pemain mendekorasi satu ruangan rumah boneka virtual; setiap jawaban benar membuka satu item dekorasi baru (furnitur/hiasan sesuai tema) untuk ditempatkan lewat drag & drop ke ruangan. Rancang agar mudah dimainkan berdua secara bergantian (mis. anak & orang tua bergiliran menjawab) sambil menata rumah bersama.",
  pabrik_karakter:
    "Pemain merakit karakter/makhluk unik dengan memilih dari MAKSIMAL 3 kategori bagian saja (contoh: bentuk badan, warna, dan satu aksesoris) — JANGAN lebih dari 3 kategori, supaya kode tetap ringkas dan cepat dibuat. Bangun tampilan karakter dari bentuk CSS sederhana (div bulat/oval yang diwarnai) dikombinasikan dengan 1-2 emoji sebagai aksesoris/wajah — JANGAN menggambar SVG custom terpisah untuk tiap pilihan (supaya jumlah kode terkendali). Setiap pilihan LANGSUNG terlihat di preview karakter (bukan teks/dropdown), jadi anak yang belum lancar membaca tetap bisa bermain. Sediakan tombol 'Acak!' untuk kombinasi kejutan dengan nama lucu otomatis, dan tombol 'Simpan ke Koleksi' (localStorage) untuk mengumpulkan karakter. Karakter yang sudah jadi bisa disentuh untuk animasi reaksi singkat (melompat/goyang). Selipkan satu pertanyaan singkat terkait materi sebelum tiap kategori terbuka (mis. jawab benar dulu baru bisa memilih warna).",
};

export const CUSTOM_OPTION_VALUE = "__custom__";
export const CUSTOM_OPTION_LABEL = "Ketik Sendiri";
export const CUSTOM_OPTION_EMOJI = "✏️";

export function labelFor(options: StepOption[], value: string): string {
  return options.find((o) => o.value === value)?.label ?? value;
}

export function labelsFor(options: StepOption[], values: string[]): string {
  return values.map((v) => labelFor(options, v)).join(", ");
}
