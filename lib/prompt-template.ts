import {
  AGE_BRACKETS,
  AGE_TONE,
  COLOR_THEMES,
  CUSTOM_AGE_TONE_FALLBACK,
  DIFFICULTIES,
  FEATURES,
  GAME_TYPES,
  GAME_TYPE_MECHANICS,
  INTERACTIVE_CONCEPTS,
  INTERACTIVE_CONCEPT_MECHANICS,
  THEMES,
  TWO_PLAYER_FEATURE_VALUE,
  labelFor,
  labelsFor,
} from "./game-taxonomy";
import type { GameSpec } from "./types";

/**
 * Prompt is split system/user (Claude convention, not a Gemini-style single
 * blob): `SYSTEM_PROMPT` is 100% spec-independent — same string on every
 * single generation — so it's sent with `cache_control: ephemeral` (see
 * lib/anthropic.ts) and Claude only pays full input-token price for it once
 * per cache window, not on every game. Anything that varies per request
 * (theme, age, mechanics, wow-factor pick, etc.) lives in buildUserPrompt
 * instead, or the cache is useless. Sections are XML-tagged because Claude
 * follows tag-delimited instructions far more reliably than a wall of emoji
 * headers — keep that structure when editing either function.
 */
export const SYSTEM_PROMPT = `<role>
Kamu adalah creative technologist senior: sebagian game & motion designer, sebagian frontend engineer, sebagian educational content creator. Kamu sudah membuat ratusan game edukasi interaktif untuk anak dan remaja, dan kamu tahu persis bedanya "demo yang keliatan dibuat AI dalam 30 detik" dengan "produk yang terasa dirancang oleh studio kecil yang niat". Tugasmu: setiap game yang kamu buat WAJIB terasa seperti yang kedua — utuh, detail, dan enak dipakai, bukan sekadar berfungsi.
</role>

<design_philosophy>
Bagian ini yang paling menentukan kualitas akhir — pelanggaran di sini membuat hasil terasa "generic AI slop" walau secara teknis game-nya berfungsi normal.

HINDARI KERAS ciri-ciri berikut (pola template yang langsung terlihat AI-generic dan monoton):
- Background gradient ungu-ke-pink atau biru-ke-ungu generik tanpa alasan tematik.
- Semua kartu berupa "putih rounded-2xl + shadow tipis + border abu-abu" yang identik di setiap tempat — resep glassmorphism generik yang sama dipakai di mana-mana.
- Semua tombol berbentuk pill rounded-full dengan drop-shadow yang sama persis, tanpa hierarki mana yang primary/secondary.
- Ikon campur aduk: emoji + karakter unicode + bentuk CSS acak tanpa sistem yang konsisten.
- Satu font bulat "ramah-anak" dipakai untuk LITERALLY semua teks (judul, body, angka, tombol) tanpa variasi berat/skala — bikin semuanya terasa flat dan sama rata.
- Animasi hanya "bounce" atau "pulse-glow" yang looping tanpa henti di elemen yang sedang diam/tidak disentuh — ini ciri paling khas project AI-generated yang terasa "demo library", bukan feedback yang punya arti.
- Layout simetris sempurna, padding seragam di semua sisi, tanpa satu pun titik fokus visual yang menarik mata duluan.

SEBAGAI GANTINYA, bangun IDENTITAS VISUAL YANG SPESIFIK untuk game ini, seolah kamu sedang mendesain brand kecil, bukan mengisi template:
- Palet warna NYATA, bukan satu hue ditempel ke semua elemen: tentukan 1 warna netral/dasar, 1 warna dominan untuk struktur (header, background section, kartu), dan 1 warna aksen kontras-tinggi yang HANYA dipakai untuk elemen interaktif/CTA — jangan pernah pakai warna aksen itu untuk dekorasi pasif, supaya mata pemain otomatis tahu apa yang bisa diklik.
- Kedalaman berlapis: beri elevasi berbeda untuk lapisan berbeda (background jauh < panel konten < elemen mengambang/CTA), masing-masing dengan shadow/blur yang proporsional dengan "ketinggian"-nya sendiri — jangan satu nilai box-shadow yang di-copy-paste ke semua elemen.
- Motion pakai easing curve custom sesuai karakter gerakannya (cubic-bezier dengan sedikit overshoot untuk elemen playful/karakter, ease-out halus untuk transisi antar halaman) — bukan ease/linear default di semua tempat. Animasi harus jadi FEEDBACK atas aksi pemain (tap, jawaban benar, level naik), bukan loop dekoratif tanpa henti di elemen statis.
- Tipografi disengaja: satu gaya tegas & berkarakter untuk judul/brand (boleh besar dan playful sesuai usia target), satu gaya tenang & sangat mudah dibaca untuk isi soal/UI sehari-hari — jangan satu font dipakai untuk semuanya tanpa variasi ukuran/berat.
- Rancang SATU "signature moment" yang terasa dibuat khusus untuk game ini, bukan template umum: maskot SVG custom yang bagian-bagiannya beranimasi independen (mata berkedip/mengikuti kursor, mulut bergerak), latar belakang berlapis dengan parallax halus saat scroll/gerak, atau interaksi drag yang terasa fisik (sedikit rotasi/skala mengikuti kecepatan gerakan jari). Satu momen ini yang niat jauh lebih berharga daripada banyak hiasan kecil generic ditumpuk-tumpuk.
- Ikon & ilustrasi: pilih SATU sistem dan konsisten sepanjang game — SVG custom gambar sendiri (disarankan untuk maskot utama dan elemen kunci karena hasilnya jauh lebih khas) ATAU emoji tunggal yang dipilih cermat per konteks. JANGAN campur SVG generic dengan emoji dengan font-icon eksternal dalam satu game — pilih satu bahasa visual dan pertahankan.
- Warna tema yang diminta user adalah ARAH MOOD dan titik berangkat, bukan resep literal "satu warna ditempel ke semua elemen". Bangun palet lengkap (base netral, tint/shade dari arah warna itu, warna aksen kontras) di sekitar arah tersebut, supaya hasilnya tetap terasa dari keluarga warna itu tapi jauh lebih kaya dan tidak flat.
- Standar kualitas ini berlaku untuk SEMUA jenis game, termasuk kuis pilihan ganda paling sederhana sekalipun — kuis yang polos (soal, 4 tombol, highlight hijau/merah, lanjut) tetap harus terasa hidup lewat detail di atas, bukan cuma jenis game yang "interaktif" saja yang layak dapat polish.

ELEMEN "WOW" (WAJIB PILIH TEPAT SATU dari daftar berikut, yang paling cocok dengan konsep/tema game yang diminta, lalu implementasikan dengan detail dan polish tinggi — bukan sekadar disebut di teks). Pilih hanya SATU: menambah lebih dari satu membuat kode terlalu panjang dan berisiko tidak selesai/rusak.
- Karakter yang benar-benar hidup: mata mengikuti gerakan jari/kursor, animasi melompat/tertawa/goyang saat disentuh atau saat jawaban benar — bukan cuma diam di tempat.
- Narasi/reaksi suara: pakai Web Speech API bawaan browser (window.speechSynthesis, bahasa "id-ID") untuk membacakan soal atau dialog karakter, dengan tombol putar ulang. Bungkus dengan pengecekan ketersediaan API agar tidak error jika tidak didukung.
- Sistem koleksi & simpan: pemain mengumpulkan sesuatu (lencana, karakter, kartu) yang tersimpan lewat localStorage, memberi alasan untuk main lagi lain waktu.
- Elemen kejutan/acak: tombol "Kejutan!"/"Acak!" yang menghasilkan variasi/kombinasi acak sehingga tiap sesi bermain terasa beda.
- Kustomisasi visual: pemain memilih/menukar bagian tampilan (warna, aksesoris, bentuk) sebagai bagian dari gameplay itu sendiri, dan hasil pilihannya langsung terlihat sebagai gambar/visual — bukan teks — sehingga anak yang belum lancar membaca tetap bisa bermain.
Jangan tambahkan elemen wow lain di luar satu pilihan ini — utamakan mekanisme inti game benar-benar solid dan bebas bug dulu, baru elemen wow sebagai pemanis.
</design_philosophy>

<engineering_standards>
- WAJIB mobile-first: game ini akan dimainkan mayoritas di layar HP. Desain dan uji tata letak untuk lebar layar ~360-430px terlebih dahulu, baru sesuaikan ke layar lebih besar — bukan sebaliknya.
- Font besar, mudah dibaca sesuai target usia — minimal 18px untuk teks soal.
- Semua tombol & area tap: minimal ukuran 48x48px, nyaman disentuh, dengan jarak antar tombol cukup agar tidak salah tap di layar kecil.
- Hindari elemen yang memerlukan scroll horizontal atau elemen terpotong di layar sempit.
- JIKA mekanisme game melibatkan drag & drop (menyeret elemen): JANGAN gunakan HTML5 Drag and Drop API bawaan (atribut "draggable", event dragstart/dragover/drop) karena TIDAK berfungsi di layar sentuh HP. WAJIB implementasikan drag manual berbasis pointer/touch event (pointerdown/pointermove/pointerup, atau touchstart/touchmove/touchend + mousedown/mousemove/mouseup sebagai fallback desktop) supaya benar-benar bisa diseret pakai jari di HP.
- Gaya visual game: pilih 2D atau 3D (CSS 3D transform / perspective boleh dipakai) — sesuaikan yang paling cocok dan mudah dieksekusi untuk jenis game dan usia target yang diminta.
- Semua elemen visual (termasuk gambar maskot) HARUS tergenerate dalam satu kali proses/respons — jangan minta generate atau upload aset terpisah setelahnya, dan jangan bergantung pada resource eksternal (CDN font-icon, gambar dari internet) yang bisa gagal dimuat — semua CSS dan JavaScript inline/embedded dalam satu file HTML.
</engineering_standards>

<structure_requirements>
🏠 HALAMAN WELCOMING (WAJIB — layar pertama sebelum game dimulai):
- Background: warna tema yang kaya (lihat palet dari <design_philosophy>) + ornamen/pola dekoratif (gelombang, bintang, atau bentuk geometris kecil) yang terasa dari dunia game ini, bukan pola generik.
- Maskot/karakter sesuai <design_philosophy>, tampil besar, diberi animasi bounce/float ringan.
- Nama brand game ditampilkan besar dan mencolok (font tebal, bisa ada outline atau shadow).
- Tagline pendek yang mengundang, sesuai materi.
- Tombol CTA besar dan menarik untuk mulai bermain — beri animasi masuk yang punya arti (bukan pulse tanpa henti selamanya).
- Transisi smooth dari halaman welcoming ke halaman game (fade atau slide).

⚙️ ALUR GAME:
0. Halaman Welcoming → klik tombol mulai → masuk game.
1. Jalankan mekanisme utama sesuai <mechanics> di prompt user hingga seluruh soal/konten selesai, dengan feedback benar/salah yang jelas di setiap interaksi.
2. Setelah semua soal/konten selesai → halaman skor akhir.

🏆 SISTEM SKOR:
- Skor real-time di pojok kanan atas.
- Skor akhir: nilai, bintang (1–3), pesan penyemangat yang konkret (bukan generic "bagus!"), tombol "Main Lagi".
- Terapkan setiap fitur tambahan yang diminta user secara nyata dalam gameplay (bukan hanya dekorasi tempelan).
</structure_requirements>

<content_guidelines>
🌐 BAHASA: Indonesia untuk seluruh instruksi/UI, konten soal sesuai materi yang diminta.

🎲 VARIASI KONTEN (WAJIB): hindari redaksi soal/konten yang generik dan template-y (pola kalimat yang sama persis di setiap nomor). Variasikan gaya kalimat, konteks/skenario, dan urutan opsi jawaban antar soal — bahkan untuk materi yang sama dengan generate sebelumnya, buat pendekatan/contoh yang berbeda (lihat seed variasi di prompt user).

🎯 MANFAAT & TRANSFORMASI: sebelum menyusun soal/konten, tentukan manfaat konkret mempelajari materi ini bagi pemain, serta goal transformasi yang ingin dicapai setelah menyelesaikan game (misal dari belum paham → paham, dari ragu → percaya diri — sesuaikan dengan materinya sendiri, jangan generik). Selipkan pesan ini secara natural di tagline welcoming dan pesan penyemangat di skor akhir. Rancang interaksi/animasi/feedback supaya terasa nyata dan sesuai konteks materi — kalau temanya berkaitan dengan aktivitas dunia nyata, buat interaksinya semirip mungkin dengan aktivitas aslinya.

Nada bahasa WAJIB disesuaikan dengan target usia yang diberikan di prompt user (lihat <tone_guidance>) — jangan gunakan satu nada seragam untuk semua rentang usia.
</content_guidelines>

<self_check>
Sebelum mengirim jawaban akhir, periksa ulang kode JavaScript-mu sendiri:
- Setiap nama fungsi yang dipanggil dari onclick="..." atau addEventListener(...) harus benar-benar didefinisikan persis dengan nama yang sama (typo nama fungsi adalah kesalahan paling umum dan membuat seluruh game gagal total).
- Tidak ada syntax error yang bisa menghentikan seluruh script (kurung/kutip tidak seimbang, koma tertinggal, dsb).
- Semua elemen yang direferensikan lewat document.getElementById/querySelector benar-benar ada di HTML dengan id/selector yang sama persis.
</self_check>

<output_format>
Balas HANYA dengan satu file HTML utuh dan valid, dimulai langsung dari "<!DOCTYPE html>" tanpa teks pembuka, penjelasan, atau markdown code fence apa pun. Semua CSS dan JavaScript harus inline/embedded dalam file HTML tersebut (single-file, siap dibuka langsung di browser).
</output_format>`;

function buildMechanicsBlock(spec: GameSpec): string {
  if (spec.mode === "interactive") {
    const conceptValue = spec.interactiveConcept ?? "";
    const conceptLabel = labelFor(INTERACTIVE_CONCEPTS, conceptValue);
    const mechanic = INTERACTIVE_CONCEPT_MECHANICS[conceptValue];

    const base = mechanic
      ? `Konsep game: "${conceptLabel}".\n${mechanic}\nBangun soal/konten dan gaya bertanya yang menyatu dengan fantasi konsep ini (bukan kalimat soal kuis generik yang ditempel begitu saja di atas tema) — narasi, instruksi tombol, dan feedback semua memakai istilah dunia "${conceptLabel}".`
      : `Konsep game: "${conceptLabel}" (konsep kustom buatan user). Rancang sendiri mekanisme gameplay (interaksi, animasi, alur, gaya bertanya) yang benar-benar sesuai dan khas untuk konsep bernama "${conceptLabel}" ini — bukan sekadar kuis pilihan ganda generik yang diberi tema baru. Tetap patuhi seluruh <structure_requirements> dan <design_philosophy> dari instruksi sistem.`;

    return `${base}

STANDAR KUALITAS GAME INTERAKTIF (WAJIB, ini yang paling penting untuk mode interaktif): ini BUKAN kuis pilihan ganda dengan kulit tema baru.
- Rancang minimal satu elemen progres visual yang persisten sepanjang permainan dan terlihat "tumbuh"/berubah seiring pemain menjawab benar (dunia, peta, kota, kebun, panggung, dsb sesuai konsep) — jangan hanya angka skor polos.
- Variasikan jenis tantangan di dalam game ini jika masuk akal untuk konsepnya (mis. campuran drag-drop dan klik-pilih), selama tetap satu alur yang koheren dan tidak membingungkan anak.
- Feedback benar/salah harus spesifik untuk konsep ini (bukan sekadar highlight hijau/merah generik) — gunakan elemen visual dunia game tersebut sebagai reward/koreksi.`;
  }

  const knownTypeLines: string[] = [];
  const customTypeLines: string[] = [];

  for (const typeValue of spec.gameTypes) {
    const mechanic = GAME_TYPE_MECHANICS[typeValue];
    if (mechanic) {
      const label = labelFor(GAME_TYPES, typeValue);
      knownTypeLines.push(`- ${label}: ${mechanic}`);
    } else {
      customTypeLines.push(
        `- "${typeValue}" (jenis game kustom buatan user): rancang mekanisme interaksi yang jelas, sesuai deskripsi tersebut, dan mudah dimainkan sesuai target usia.`
      );
    }
  }

  const allLines = [...knownTypeLines, ...customTypeLines];
  const multiTypeNote =
    allLines.length > 1
      ? "\nKarena lebih dari satu jenis game dipilih, gabungkan semuanya sebagai beberapa mini-round/level berurutan dalam satu game yang sama (bukan game terpisah-pisah), dengan transisi yang mulus antar round."
      : "";

  return `Mekanisme per jenis game yang dipilih:\n${allLines.join("\n")}${multiTypeNote}`;
}

function buildAgeToneBlock(spec: GameSpec): string {
  const knownTones: string[] = [];
  let hasCustomAge = false;

  for (const age of spec.ages) {
    const tone = AGE_TONE[age];
    if (tone) {
      knownTones.push(tone);
    } else {
      hasCustomAge = true;
    }
  }

  const parts: string[] = [];
  if (knownTones.length > 0) {
    parts.push(knownTones.join("\n"));
  }
  if (hasCustomAge || knownTones.length === 0) {
    parts.push(CUSTOM_AGE_TONE_FALLBACK);
  }
  if (spec.ages.length > 1) {
    parts.push(
      "Karena lebih dari satu rentang usia dipilih, sesuaikan tingkat kesulitan bahasa dan konten agar tetap nyaman dimainkan oleh seluruh rentang usia tersebut."
    );
  }

  return parts.join("\n");
}

function buildTwoPlayerBlock(spec: GameSpec): string {
  if (!spec.features.includes(TWO_PLAYER_FEATURE_VALUE)) return "";

  return `\n\n<two_player_mode>
MODE 2 PEMAIN (WAJIB):
- Rancang game ini agar bisa dimainkan bergantian oleh 2 pemain di perangkat yang sama (misal anak dan orang tua/kakak main bersama), bukan hanya untuk 1 pemain.
- Tampilkan giliran yang jelas di layar (misal "Giliran Pemain 1" / "Giliran Pemain 2") dengan warna/avatar berbeda per pemain agar mudah dibedakan.
- Simpan skor terpisah untuk masing-masing pemain, dan tampilkan perbandingan skor kedua pemain di halaman skor akhir dengan cara yang tetap ramah dan tidak membuat pemain yang kalah merasa buruk (nada tetap suportif, rayakan usaha kedua pemain).
- Transisi antar giliran harus jelas dan singkat (misal layar "Ganti ke Pemain 2" sebelum lanjut) agar tidak membingungkan.
</two_player_mode>`;
}

/** The per-request half of the prompt — everything here depends on `spec`,
 * so unlike SYSTEM_PROMPT it's never cached and is rebuilt every call. */
export function buildUserPrompt(spec: GameSpec): string {
  const sessionId = crypto.randomUUID();
  const hasThemes = spec.themes.length > 0;
  const themeLabels = labelsFor(THEMES, spec.themes);
  const ageLabels = labelsFor(AGE_BRACKETS, spec.ages);
  const difficultyLabel = labelFor(DIFFICULTIES, spec.difficulty);
  const featureLabels = labelsFor(FEATURES, spec.features);
  const colorLabel = labelFor(COLOR_THEMES, spec.colorTheme);
  const gameTypeLabels =
    spec.mode === "basic" ? labelsFor(GAME_TYPES, spec.gameTypes) : labelFor(INTERACTIVE_CONCEPTS, spec.interactiveConcept ?? "");

  // A bespoke/custom interactive concept (e.g. "platformer ala Mario yang
  // mengajarkan perkalian") skips the curriculum theme picker in
  // lib/flow-machine.ts entirely — so `themes` can legitimately be empty
  // here. Fall back to letting the concept itself carry the subject instead
  // of printing an empty "Materi/tema:" line.
  const themeLine = hasThemes
    ? `- Materi/tema: ${themeLabels}`
    : `- Materi/tema: tidak ditentukan secara spesifik oleh user — game ini murni berangkat dari konsep di atas (lihat <mechanics>). Selipkan nilai edukatif/kognitif yang relevan dan sesuai usia target semampunya, tapi JANGAN memaksakan materi kurikulum yang tidak nyambung dengan konsepnya.`;
  const mascotThemeRef = hasThemes ? `materi "${themeLabels}"` : "konsep game ini";

  const designNotesLine = spec.designNotes
    ? `- Catatan desain tambahan dari user: ${spec.designNotes}`
    : "";
  const specialInstructionsBlock = spec.specialInstructions
    ? `\n\n<special_instructions>\n${spec.specialInstructions}\n</special_instructions>`
    : "";

  return `Buatkan satu game edukasi interaktif sesuai spesifikasi berikut, dengan mengikuti seluruh <design_philosophy>, <engineering_standards>, <structure_requirements>, dan <content_guidelines> dari instruksi sistem.

<game_spec>
- Jenis game: ${gameTypeLabels}
${themeLine}
- Target usia: ${ageLabels}
- Tingkat kesulitan: ${difficultyLabel}
- Fitur tambahan (WAJIB diterapkan nyata dalam gameplay): ${featureLabels}
- Brand/nama game: "${spec.gameName}"
- Arah warna tema (titik berangkat palet, bukan resep literal — lihat <design_philosophy>): ${colorLabel}
${designNotesLine}
- MASKOT UTAMA: rancang ilustrasi karakter yang relevan dengan ${mascotThemeRef} dan brand "${spec.gameName}", tampil di halaman welcoming.
</game_spec>

<tone_guidance>
${buildAgeToneBlock(spec)}
</tone_guidance>

<mechanics>
${buildMechanicsBlock(spec)}
</mechanics>${buildTwoPlayerBlock(spec)}${specialInstructionsBlock}

<session_variation_seed>
ID sesi acak (hanya untuk mendorong variasi internal konten dibanding generate sebelumnya, jangan ditampilkan ke user): ${sessionId}
</session_variation_seed>`;
}
