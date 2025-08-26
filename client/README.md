# 📸 Image Optimizer

A modern web application for optimizing images into multiple formats (**JPEG, PNG, WebP, AVIF**).  
Built with **React** (frontend) and **Express + Sharp** (backend).  

---

## ✨ Features
- Upload an image from your computer  
- Select output format (JPEG, PNG, WebP, AVIF) via dropdown menu  
- Optimize image using **Sharp** on the server  
- Preview optimized image in the browser  
- Download optimized image  
- Clean UI styled with **Tailwind CSS**

---

## 🛠️ Tech Stack
- **Frontend:** React + Tailwind CSS  
- **Backend:** Node.js (Express)  
- **Image Processing:** Sharp  

---

## 🚀 Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/javorkooo/image-optimizer.git
cd image-optimizer

### 2. Install dependencies (Frontend)
cd client
npm install

### 2. Install dependencies (Backend)
cd ../server
npm install

### 3. Run the application (Start Frontend)
cd client
npm start

### 3. Run the application (Start Backend)
cd ../server
npx node index.js
