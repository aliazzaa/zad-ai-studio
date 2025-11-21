
# Zad AI Studio (استوديو زاد AI) - Deployment Guide

## 📄 نظرة عامة (Overview)
هذا تطبيق ويب حديث (Single Page Application) مبني باستخدام **React** و **TypeScript** و **Vite**.
يعتمد التطبيق على الذكاء الاصطناعي من جوجل (**Google Gemini API**) لإنشاء محتوى إسلامي.

This is a modern Single Page Application (SPA) built with **React**, **TypeScript**, and **Vite**.
It utilizes **Google Gemini API** to generate Islamic content.

---

## 🚀 تعليمات للمطور / مسؤول النشر (For the Developer / DevOps)

### 1. المتطلبات (Prerequisites)
*   **Node.js**: v18 or higher.
*   **Firebase CLI**: `npm install -g firebase-tools`

### 2. إعداد البيئة (Environment Setup)
يجب إنشاء ملف `.env` في المجلد الرئيسي (Root) يحتوي على المفاتيح التالية:
Create a `.env` file in the root directory with the following keys:

```env
# Google Gemini API Key (Required for content generation)
VITE_API_KEY=AIzaSy...YourKeyHere

# YouTube API Keys (Optional - for Live Stream features)
VITE_YOUTUBE_CLIENT_ID=your_client_id.apps.googleusercontent.com
VITE_YOUTUBE_API_KEY=your_youtube_data_api_key
```

### 3. التثبيت والبناء (Install & Build)

```bash
# 1. Install dependencies
npm install

# 2. Build the project for production
npm run build
```
سيقوم هذا الأمر بإنشاء مجلد `dist` يحتوي على الملفات الجاهزة للرفع.
This will create a `dist` folder containing the production-ready files.

### 4. الرفع على Firebase (Deploy to Firebase)

المشروع يحتوي بالفعل على ملف `firebase.json` مهيأ.
The project already includes a configured `firebase.json`.

```bash
# 1. Login to Firebase
firebase login

# 2. Initialize project (Select existing project created in Firebase Console)
# Choose: Hosting: Configure files for Firebase Hosting...
# Public directory: dist
# Configure as SPA: Yes
# Overwrite index.html: No (Important!)
firebase init hosting

# 3. Deploy
firebase deploy
```

---

## ⚙️ الهيكلية التقنية (Technical Structure)
*   **Framework**: React 18
*   **Build Tool**: Vite
*   **Styling**: Tailwind CSS
*   **AI Integration**: @google/genai SDK
*   **Deployment Target**: Firebase Hosting (Static)

## ⚠️ ملاحظات هامة (Important Notes)
*   **Environment Variables**: Since this is a client-side app, ensure API keys are restricted in the Google Cloud Console to the deployment domain (Referrer restriction) to prevent misuse.
*   **Firebase Configuration**: The `firebase.json` is set up to handle SPA routing (rewrites to index.html).
