Microservices Saga Pattern with gRPC

Project ini adalah implementasi dari pola Saga Orchestration dengan menggunakan arsitektur Microservices dan protokol komunikasi gRPC.

Struktur Layanan
Terdapat 4 komponen utama:

- Orchestrator: Mengatur alur transaksi lintas layanan.
- Order Service: Menerima dan mengelola pesanan.
- Payment Service: Memproses dan mengembalikan pembayaran.
- Shipping Service: Mengatur proses pengiriman.

Setiap service berjalan secara independen dan berkomunikasi menggunakan gRPC + Protocol Buffers.

---

Tugas ini dikerjakan untuk mata kuliah Pemrograman Website Lanjutan

Nama: Muhammad Kaisar Teddy

NIM: 122140058
