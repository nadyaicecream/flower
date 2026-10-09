# I LOVE YOU — Neon Particle Heart

Website romantis dengan partikel hati bergerak, partikel yang membentuk tulisan `I LOVE YOU`, foto pilihan di pojok layar, musik ambient sintetis orisinal, dan efek animasi saat layar disentuh/diklik.

## Jalankan secara lokal
1. Ekstrak file ZIP.
2. Buka `index.html` di browser modern.
3. Tekan tombol musik untuk memulai audio (browser meminta interaksi pengguna terlebih dahulu).
4. Tekan **Add your photo** untuk memilih foto dari perangkat. Foto hanya dibaca di browser dan tidak diunggah ke server.

## Pasang di GitHub Pages
1. Buat repository baru di GitHub.
2. Ekstrak ZIP dan upload `index.html`, `style.css`, `script.js`, dan `README.md` ke root repository.
3. Buka **Settings → Pages**.
4. Pada **Build and deployment**, pilih **Deploy from a branch**.
5. Pilih branch `main` dan folder `/(root)`, lalu tekan **Save**.
6. Tunggu deployment selesai, lalu buka alamat Pages yang ditampilkan GitHub.

## Kustomisasi
- Tulisan utama dan subtitle: `index.html`
- Warna dan tampilan: `style.css` (variabel `--red` dan `--mint`)
- Gerakan partikel, efek sentuh, dan musik: `script.js`

Catatan: Google Fonts memerlukan internet. Musik dibuat langsung melalui Web Audio API dan tidak memakai lagu berhak cipta atau file musik eksternal.
