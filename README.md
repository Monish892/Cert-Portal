# Certificate Portal – Fullstack Production System

A **full-stack certificate automation system** built with **React (Vite)**, **TailwindCSS**, **Node.js**, **Express**, and **MongoDB**.  
Supports **PDF template upload**, **QR code embedding**, **batch ZIP processing**, and **automated issuance**.

---

## 🚀 Features

- Upload certificate template (PDF)
- Select QR placement using visual click interface
- Upload batch ZIP (PDFs + CSV/XLSX mapping file)
- Validate, process, and embed QR codes into certificates
- Batch issuance automation (50 files per chunk)
- Real-time dashboard with progress tracking
- Download final ZIP of issued certificates
- Error handling, retry, and file-status management
- MongoDB storage for project metadata and batch tracking

---

## ⚡ Getting Started

### 1. Clone Repository
```bash
git clone https://github.com/your-username/certificate-portal.git
cd certificate-portal
```

---

## 🗄 Backend Setup

### 2. Install backend dependencies
```bash
cd backend
npm install
```

### 3. Configure environment variables  
Create a `.env` file:

```env
PORT=4000
MONGO_URI=mongodb://localhost:27017/certificate_portal
MAX_LIMIT=250
```

### 4. Start backend server
```bash
npm run dev
```

Backend runs on:  
➡ **http://localhost:4000**

---

## 💻 Frontend Setup

### 5. Install frontend dependencies
```bash
cd frontend
npm install
```

### 6. Fix PDF worker requirement
```bash
mkdir -p public
cp node_modules/pdfjs-dist/build/pdf.worker.mjs public/pdf.worker.mjs
```

### 7. Start frontend (Vite)
```bash
npm run dev
```

Frontend runs on:  
➡ **http://localhost:8000**

---

## 🧱 Folder Structure

```
project/
├── backend/
│   ├── routes/
│   ├── models/
│   ├── uploads/
│   ├── server.js
│   └── .env
│
├── frontend/
│   ├── src/
│   ├── public/
│   └── vite.config.js
│
└── docker-compose.yml
```

---

## 📦 Batch ZIP Format

Your ZIP **must include**:

```
certificate_map.csv  or  certificate_map.xlsx
john_doe.pdf
jane_doe.pdf
alice_smith.pdf
```

### Example CSV:
```
filename,certificateId
john_doe.pdf,CERT001
jane_doe.pdf,CERT002
alice_smith.pdf,CERT003
```

---

## 🔥 API Overview

### **Upload ZIP**
```
POST /api/batch/upload-zip
```

### **Start Issuance**
```
POST /api/batch/start-issuance
```

### **Get Batch Status**
```
GET /api/batch/status/:batchId
```

### **Download Final ZIP**
```
GET /api/batch/download-issued/:batchId
```

---

## 📄 How Issuance Works

For every certificate:

1. Load PDF using **pdf-lib**  
2. Generate QR using **qrcode**  
3. Embed QR at stored coordinates  
4. Save issued file inside `/uploads/issued/{batchId}`  
5. Update batch progress in MongoDB  
6. Frontend dashboard auto-updates  
7. Allow ZIP download after completion  

---

## 🐳 Optional: Start MongoDB with Docker

```bash
docker-compose up -d
```

MongoDB runs at:

```
mongodb://localhost:27017
```

---

