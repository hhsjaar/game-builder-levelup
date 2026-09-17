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
  THEMES,
  labelFor,
  labelsFor,
} from "./game-taxonomy";
import type { GameSpec } from "./types";

function buildMechanicsBlock(spec: GameSpec): string {
  if (spec.mode === "interactive") {
    const conceptLabel = labelFor(INTERACTIVE_CONCEPTS, spec.interactiveConcept ?? "");
    return `Konsep game: "${conceptLabel}". Rancang mekanisme gameplay (interaksi, animasi, alur) yang benar-benar sesuai dan khas untuk konsep ini — bukan sekadar kuis pilihan ganda generik yang diberi tema baru. Tetap patuhi seluruh aturan visual, halaman welcoming, branding, sistem skor, dan penyesuaian usia di bagian lain instruksi ini.`;
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

export function buildGamePrompt(spec: GameSpec): string {
  const sessionId = crypto.randomUUID();
  const themeLabels = labelsFor(THEMES, spec.themes);
  const ageLabels = labelsFor(AGE_BRACKETS, spec.ages);
  const difficultyLabel = labelFor(DIFFICULTIES, spec.difficulty);
  const featureLabels = labelsFor(FEATURES, spec.features);
  const colorLabel = labelFor(COLOR_THEMES, spec.colorTheme);
  const gameTypeLabels =
    spec.mode === "basic" ? labelsFor(GAME_TYPES, spec.gameTypes) : labelFor(INTERACTIVE_CONCEPTS, spec.interactiveConcept ?? "");

  const designNotesLine = spec.designNotes
    ? `- Catatan desain tambahan dari user: ${spec.designNotes}`
    : "";
  const specialInstructionsBlock = spec.specialInstructions
    ? `\n\n📌 INSTRUKSI KHUSUS TAMBAHAN DARI USER:\n${spec.specialInstructions}`
    : "";

  return `Kamu adalah game developer dan educational content creator yang berpengalaman membuat game edukasi interaktif. Kamu memahami prinsip desain UI yang disesuaikan target usia, learning psychology, dan cara membuat kode yang bersih serta maintainable. Setiap game yang kamu buat harus terasa seperti produk final yang polished — bukan demo atau prototipe.

🎨 KETENTUAN VISUAL:
- MASKOT UTAMA: buat ilustrasi karakter yang relevan dengan materi "${themeLabels}" dan brand "${spec.gameName}". Tampilkan di halaman welcoming dengan animasi ringan (bounce/float).
- Gaya visual game: pilih 2D atau 3D (CSS 3D transform / perspective boleh dipakai) — sesuaikan yang paling cocok dan mudah dieksekusi untuk jenis game ini dan usia target.
- Ikon, badge, feedback benar/salah, dan elemen visual lainnya: bebas ditentukan sendiri (emoji, Font Awesome, atau SVG) — pilih yang paling kontekstual dengan materi dan konsisten, jangan generik/asal tempel.
- Semua elemen visual (termasuk gambar maskot) HARUS tergenerate dalam satu kali proses/respons — jangan minta generate atau upload aset terpisah setelahnya.

Buatkan game edukasi interaktif sesuai target usia yang ditentukan di bawah.

📋 SPESIFIKASI GAME:
- Jenis game: ${gameTypeLabels}
- Materi/tema: ${themeLabels}
- Target usia: ${ageLabels}
- Tingkat kesulitan: ${difficultyLabel}
- Fitur tambahan: ${featureLabels}
- Brand: "${spec.gameName}", tema warna: ${colorLabel}
${designNotesLine}

⚠️ ${buildAgeToneBlock(spec)}

🎲 VARIASI KONTEN (WAJIB):
- Hindari redaksi soal/konten yang generik dan template-y (pola kalimat yang sama persis di setiap nomor).
- Variasikan gaya kalimat, konteks/skenario, dan urutan opsi jawaban antar soal — bahkan untuk materi yang sama dengan generate sebelumnya, buat pendekatan/contoh yang berbeda.
- ID sesi acak (hanya untuk mendorong variasi internal, jangan ditampilkan ke user): ${sessionId}

🎯 MANFAAT & TRANSFORMASI:
- Sebelum menyusun soal/konten, tentukan manfaat konkret mempelajari "${themeLabels}" bagi pemain, serta goal transformasi yang ingin dicapai setelah menyelesaikan game ini (misal dari belum paham → paham, dari ragu → percaya diri, dari lambat → cepat — sesuaikan dengan materinya sendiri, jangan generik).
- Selipkan pesan manfaat/transformasi ini secara natural di tagline halaman welcoming dan di pesan penyemangat pada halaman skor akhir.
- Rancang pengalaman mekanik game (interaksi, animasi, feedback) supaya terasa nyata dan sesuai konteks materi/jenis game — bukan generik asal jadi. Contoh: kalau temanya berkaitan dengan aktivitas dunia nyata, buat interaksinya semirip mungkin dengan aktivitas aslinya.

📐 KETENTUAN TEKNIS:
- Responsive & mobile-first
- Semua soal/konten harus relevan dengan materi "${themeLabels}" (bukan soal generik)
- Font besar, mudah dibaca sesuai target usia — minimal 18px untuk teks soal
- Semua tombol & area tap: minimal ukuran 48x48px, nyaman disentuh

🏠 HALAMAN WELCOMING (WAJIB — LAYAR PERTAMA SEBELUM GAME):
- Background: warna tema yang kaya + ornamen/pola dekoratif (gelombang, bintang, atau bentuk geometris kecil)
- Maskot/karakter: ilustrasi sesuai ketentuan visual di atas, tampil besar, diberi animasi bounce atau float terus-menerus
- Nama brand "${spec.gameName}" ditampilkan besar dan mencolok (font tebal, bisa ada outline atau shadow)
- Tagline pendek yang mengundang, sesuaikan dengan materi
- Tombol CTA besar dan menarik untuk mulai bermain, dengan animasi pulse atau glow
- Transisi smooth dari halaman welcoming ke halaman game (fade atau slide)

🎮 MEKANISME GAME (WAJIB IKUTI):
${buildMechanicsBlock(spec)}

⚙️ ALUR GAME:
0. Halaman Welcoming → klik tombol mulai → masuk game
1. Jalankan mekanisme utama di atas hingga seluruh soal/konten selesai, dengan feedback benar/salah yang jelas di setiap interaksi
2. Setelah semua soal/konten selesai → halaman skor akhir

🎨 DESAIN:
- Tema warna: ${colorLabel} — konsisten di semua halaman
- Gaya visual: sesuaikan dengan target usia (cerah & playful untuk anak, lebih clean/matang untuk usia dewasa/remaja akhir)
- Animasi: transisi halaman smooth, feedback animasi saat benar/salah

🌐 BAHASA: Indonesia untuk instruksi, konten soal sesuai materi

🏆 SISTEM SKOR:
- Skor real-time di pojok kanan atas
- Skor akhir: nilai, bintang (1–3), pesan penyemangat, tombol "Main Lagi"
- Terapkan fitur tambahan berikut secara nyata dalam gameplay (bukan hanya dekorasi): ${featureLabels}${specialInstructionsBlock}

📤 FORMAT OUTPUT (WAJIB):
Balas HANYA dengan satu file HTML utuh dan valid, dimulai langsung dari "<!DOCTYPE html>" tanpa teks pembuka, penjelasan, atau markdown code fence apa pun. Semua CSS dan JavaScript harus inline/embedded dalam file HTML tersebut (single-file, siap dibuka langsung di browser).`;
}
