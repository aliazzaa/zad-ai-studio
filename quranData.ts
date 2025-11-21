
import { Surah, Ayah } from './types';

// This file contains a subset of the Quran data for demonstration.
// In a full implementation, this would contain all 114 Surahs and their verses.

export const surahs: Surah[] = [
  { "number": 1, "name": "سُورَةُ ٱلْفَاتِحَةِ", "englishName": "Al-Faatiha", "numberOfAyahs": 7 },
  { "number": 2, "name": "سُورَةُ ٱلْبَقَرَةِ", "englishName": "Al-Baqara", "numberOfAyahs": 286 },
  { "number": 112, "name": "سُورَةُ ٱلْإِخْلَاصِ", "englishName": "Al-Ikhlaas", "numberOfAyahs": 4 },
  { "number": 113, "name": "سُورَةُ ٱلْفَلَقِ", "englishName": "Al-Falaq", "numberOfAyahs": 5 },
  { "number": 114, "name": "سُورَةُ ٱلنَّاسِ", "englishName": "An-Naas", "numberOfAyahs": 6 }
];

export const quranData: { [key: number]: Ayah[] } = {
  1: [
    { "number": 1, "audio": "https://cdn.islamic.network/quran/audio/128/ar.alafasy/1.mp3", "text": "بِسۡمِ ٱللَّهِ ٱلرَّحۡمَـٰنِ ٱلرَّحِيمِ", "numberInSurah": 1 },
    { "number": 2, "audio": "https://cdn.islamic.network/quran/audio/128/ar.alafasy/2.mp3", "text": "ٱلۡحَمۡدُ لِلَّهِ رَبِّ ٱلۡعَـٰلَمِينَ", "numberInSurah": 2 },
    { "number": 3, "audio": "https://cdn.islamic.network/quran/audio/128/ar.alafasy/3.mp3", "text": "ٱلرَّحۡمَـٰنِ ٱلرَّحِيمِ", "numberInSurah": 3 },
    { "number": 4, "audio": "https://cdn.islamic.network/quran/audio/128/ar.alafasy/4.mp3", "text": "مَـٰلِكِ يَوۡمِ ٱلدِّينِ", "numberInSurah": 4 },
    { "number": 5, "audio": "https://cdn.islamic.network/quran/audio/128/ar.alafasy/5.mp3", "text": "إِيَّاكَ نَعۡبُدُ وَإِيَّاكَ نَسۡتَعِينُ", "numberInSurah": 5 },
    { "number": 6, "audio": "https://cdn.islamic.network/quran/audio/128/ar.alafasy/6.mp3", "text": "ٱهۡدِنَا ٱلصِّرَٰطَ ٱلۡمُسۡتَقِيمَ", "numberInSurah": 6 },
    { "number": 7, "audio": "https://cdn.islamic.network/quran/audio/128/ar.alafasy/7.mp3", "text": "صِرَٰطَ ٱلَّذِينَ أَنۡعَمۡتَ عَلَيۡهِمۡ غَيۡرِ ٱلۡمَغۡضُوبِ عَلَيۡهِمۡ وَلَا ٱلضَّآلِّينَ", "numberInSurah": 7 }
  ],
  2: [ // Sample of Al-Baqara
    { "number": 8, "audio": "https://cdn.islamic.network/quran/audio/128/ar.alafasy/8.mp3", "text": "الٓمٓ", "numberInSurah": 1 },
    { "number": 9, "audio": "https://cdn.islamic.network/quran/audio/128/ar.alafasy/9.mp3", "text": "ذَٰلِكَ ٱلْكِتَابُ لَا رَيْبَ فِيهِ هُدًى لِّلْمُتَّقِينَ", "numberInSurah": 2 },
    { "number": 10, "audio": "https://cdn.islamic.network/quran/audio/128/ar.alafasy/10.mp3", "text": "ٱلَّذِينَ يُؤْمِنُونَ بِٱلْغَيْبِ وَيُقِيمُونَ ٱلصَّلَوٰةَ وَمِمَّا رَزَقْنَاهُمْ يُنفِقُونَ", "numberInSurah": 3 },
    { "number": 11, "audio": "https://cdn.islamic.network/quran/audio/128/ar.alafasy/11.mp3", "text": "وَٱلَّذِينَ يُؤْمِنُونَ بِمَآ أُنزِلَ إِلَيْكَ وَمَآ أُنزِلَ مِن قَبْلِكَ وَبِٱلْءَاخِرَةِ هُمْ يُوقِنُونَ", "numberInSurah": 4 },
    { "number": 12, "audio": "https://cdn.islamic.network/quran/audio/128/ar.alafasy/12.mp3", "text": "أُو۟لَـٰٓئِكَ عَلَىٰ هُدًى مِّن رَّبِّهِمْ وَأُو۟لَـٰٓئِكَ هُمُ ٱلْمُفْلِحُونَ", "numberInSurah": 5 },
  ],
  112: [
    { "number": 6222, "audio": "https://cdn.islamic.network/quran/audio/128/ar.alafasy/6222.mp3", "text": "قُلۡ هُوَ ٱللَّهُ أَحَدٌ", "numberInSurah": 1 },
    { "number": 6223, "audio": "https://cdn.islamic.network/quran/audio/128/ar.alafasy/6223.mp3", "text": "ٱللَّهُ ٱلصَّمَدُ", "numberInSurah": 2 },
    { "number": 6224, "audio": "https://cdn.islamic.network/quran/audio/128/ar.alafasy/6224.mp3", "text": "لَمۡ يَلِدۡ وَلَمۡ يُولَدۡ", "numberInSurah": 3 },
    { "number": 6225, "audio": "https://cdn.islamic.network/quran/audio/128/ar.alafasy/6225.mp3", "text": "وَلَمۡ يَكُن لَّهُۥ كُفُوًا أَحَدُۢ", "numberInSurah": 4 }
  ],
  113: [
    { "number": 6226, "audio": "https://cdn.islamic.network/quran/audio/128/ar.alafasy/6226.mp3", "text": "قُلۡ أَعُوذُ بِرَبِّ ٱلۡفَلَقِ", "numberInSurah": 1 },
    { "number": 6227, "audio": "https://cdn.islamic.network/quran/audio/128/ar.alafasy/6227.mp3", "text": "مِن شَرِّ مَا خَلَقَ", "numberInSurah": 2 },
    { "number": 6228, "audio": "https://cdn.islamic.network/quran/audio/128/ar.alafasy/6228.mp3", "text": "وَمِن شَرِّ غَاسِقٍ إِذَا وَقَبَ", "numberInSurah": 3 },
    { "number": 6229, "audio": "https://cdn.islamic.network/quran/audio/128/ar.alafasy/6229.mp3", "text": "وَمِن شَرِّ ٱلنَّفَّـٰثَـٰتِ فِي ٱلۡعُقَدِ", "numberInSurah": 4 },
    { "number": 6230, "audio": "https://cdn.islamic.network/quran/audio/128/ar.alafasy/6230.mp3", "text": "وَمِن شَرِّ حَاسِدٍ إِذَا حَسَدَ", "numberInSurah": 5 }
  ],
  114: [
    { "number": 6231, "audio": "https://cdn.islamic.network/quran/audio/128/ar.alafasy/6231.mp3", "text": "قُلۡ أَعُوذُ بِرَبِّ ٱلنَّاسِ", "numberInSurah": 1 },
    { "number": 6232, "audio": "https://cdn.islamic.network/quran/audio/128/ar.alafasy/6232.mp3", "text": "مَلِكِ ٱلنَّاسِ", "numberInSurah": 2 },
    { "number": 6233, "audio": "https://cdn.islamic.network/quran/audio/128/ar.alafasy/6233.mp3", "text": "إِلَـٰهِ ٱلنَّاسِ", "numberInSurah": 3 },
    { "number": 6234, "audio": "https://cdn.islamic.network/quran/audio/128/ar.alafasy/6234.mp3", "text": "مِن شَرِّ ٱلۡوَسۡوَاسِ ٱلۡخَنَّاسِ", "numberInSurah": 4 },
    { "number": 6235, "audio": "https://cdn.islamic.network/quran/audio/128/ar.alafasy/6235.mp3", "text": "ٱلَّذِي يُوَسۡوِسُ فِي صُدُورِ ٱلنَّاسِ", "numberInSurah": 5 },
    { "number": 6236, "audio": "https://cdn.islamic.network/quran/audio/128/ar.alafasy/6236.mp3", "text": "مِنَ ٱلۡجِنَّةِ وَٱلنَّاسِ", "numberInSurah": 6 }
  ]
};
