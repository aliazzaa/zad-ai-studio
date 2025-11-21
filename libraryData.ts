import { ContentType, LibraryHadith, CommunityProject, BackgroundAsset, MarketplaceItem } from './types';

export const hadithLibrary: LibraryHadith[] = [
  // Hadith Qudsi
  {
    type: ContentType.HadithQudsi,
    title: 'رحمة الله تغلب غضبه',
    script: 'عَنْ أَبِي هُرَيْرَةَ رضي الله عنه، عَنِ النَّبِيِّ صلى الله عليه وسلم قَالَ: "لَمَّا قَضَى اللَّهُ الْخَلْقَ، كَتَبَ فِي كِتَابِهِ، فَهُوَ عِنْدَهُ فَوْقَ الْعَرْشِ: إِنَّ رَحْمَتِي غَلَبَتْ غَضَبِي".',
    explanation: 'هذا الحديث القدسي العظيم يفتح باب الأمل واسعًا، حيث يخبرنا الله عز وجل أن رحمته سبقت غضبه وعلته. فمهما بلغت ذنوب العبد، فإن رحمة الله أوسع، وعفوه أعظم، وهذا يدفع المؤمن إلى حسن الظن بالله والرجوع إليه دائمًا بالتوبة والاستغفار.',
  },
  {
    type: ContentType.HadithQudsi,
    title: 'محبة الله لعبده',
    script: 'عَنْ أَبِي هُرَيْرَةَ رضي الله عنه قَالَ: قَالَ رَسُولُ اللَّهِ صلى الله عليه وسلم: "إِنَّ اللَّهَ قَالَ: مَنْ عَادَى لِي وَلِيًّا فَقَدْ آذَنْتُهُ بِالْحَرْبِ، وَمَا تَقَرَّبَ إِلَيَّ عَبْدِي بِشَيْءٍ أَحَبَّ إِلَيَّ مِمَّا افْتَرَضْتُ عَلَيْهِ، وَمَا يَزَالُ عَبْدِي يَتَقَرَّبُ إِلَيَّ بِالنَّوَافِلِ حَتَّى أُحِبَّهُ..."',
    explanation: 'يُظهر هذا الحديث كيف يصل العبد إلى محبة الله تعالى. الطريق يبدأ بأداء الفرائض التي هي أحب الأعمال إلى الله، ثم الاستزادة من النوافل والطاعات. وجزاء ذلك أن يحبه الله، فإذا أحبه كان سمعه الذي يسمع به، وبصره الذي يبصر به، فيوفقه ويسدده في كل أموره.',
  },
  // Riyad as-Salihin
  {
    type: ContentType.RiyadSalihin,
    title: 'فضل الصدق',
    script: 'عَنْ عَبْدِ اللَّهِ بْنِ مَسْعُودٍ رضي الله عنه، عَنِ النَّبِيِّ صلى الله عليه وسلم قَالَ: "إِنَّ الصِّدْقَ يَهْدِي إِلَى الْبِرِّ، وَإِنَّ الْبِرَّ يَهْدِي إِلَى الْجَنَّةِ، وَإِنَّ الرَّجُلَ لَيَصْدُقُ حَتَّى يَكُونَ صِدِّيقًا. وَإِنَّ الْكَذِبَ يَهْدِي إِلَى الْفُجُورِ، وَإِنَّ الْفُجُورَ يَهْدِي إِلَى النَّارِ، وَإِنَّ الرَّجُلَ لَيَكْذِبُ حَتَّى يُكْتَبَ عِنْدَ اللَّهِ كَذَّابًا".',
    explanation: 'يرسم هذا الحديث طريقين واضحين: طريق الصدق الذي يقود إلى كل أنواع الخير (البر) ومن ثم إلى الجنة، وطريق الكذب الذي يقود إلى الشر والفساد (الفجور) ومن ثم إلى النار. فالصدق ليس مجرد قول، بل هو سلوك ومنهج حياة يرفع صاحبه إلى أعلى المراتب.',
  },
  {
    type: ContentType.RiyadSalihin,
    title: 'النهي عن الغضب',
    script: 'عَنْ أَبِي هُرَيْرَةَ رضي الله عنه أَنَّ رَجُلًا قَالَ لِلنَّبِيِّ صلى الله عليه وسلم: أَوْصِنِي. قَالَ: "لَا تَغْضَبْ". فَرَدَّدَ مِرَارًا، قَالَ: "لَا تَغْضَبْ".',
    explanation: 'هذه الوصية النبوية الجامعة "لا تغضب" تدل على أهمية التحكم في النفس عند الغضب. فالغضب مفتاح لكثير من الشرور، من قول الفحش إلى إيذاء الآخرين. والوصية بتركه تعني التدرب على الحلم والصبر وتجنب أسباب الغضب، مما يجلب الطمأنينة ويحفظ العلاقات.',
  },
  // Prophetic Manners
  {
    type: ContentType.PropheticManners,
    title: 'الرفق واللين',
    script: 'عَنْ عَائِشَةَ رضي الله عنها، أَنَّ النَّبِيَّ صلى الله عليه وسلم قَالَ: "إِنَّ الرِّفْقَ لَا يَكُونُ فِي شَيْءٍ إِلَّا زَانَهُ، وَلَا يُنْزَعُ مِنْ شَيْءٍ إِلَّا شَانَهُ".',
    explanation: 'يعلمنا هذا الحديث قيمة الرفق واللين في كل أمورنا. فالتعامل بلطف وسهولة يجمل الأفعال والأقوال ويجعلها مقبولة ومحبوبة، بينما القسوة والشدة تفسدها وتجعلها منفرة. وهو خلق نبوي عظيم يجب أن يتحلى به المسلم في تعامله مع الناس جميعًا.',
  },
  // Adhkar
  {
    type: ContentType.Adhkar,
    title: 'سيد الاستغفار',
    script: 'اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَهَ إِلَّا أَنْتَ، خَلَقْتَنِي وَأَنَا عَبْدُكَ، وَأَنَا عَلَى عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ، أَعُوذُ بِكَ مِنْ شَرِّ مَا صَنَعْتُ، أَبُوءُ لَكَ بِنِعْمَتِكَ عَلَيَّ، وَأَبُوءُ لَكَ بِذَنْبِي فَاغْفِرْ لِي، فَإِنَّهُ لَا يَغْفِرُ الذُّنُوبَ إِلَّا أَنْتَ.',
    explanation: 'يُسمى هذا الدعاء "سيد الاستغفار" لأنه يجمع كل معاني التوبة والافتقار إلى الله. يبدأ بتوحيد الله والاعتراف بعبوديته، ثم يقر العبد بنعم الله عليه وبتقصيره وذنبه، ويطلب المغفرة. من قاله موقنًا به في المساء فمات دخل الجنة، وكذلك في الصباح.',
  },
  {
    type: ContentType.Adhkar,
    title: 'دعاء الكرب',
    script: 'لَا إِلَهَ إِلَّا اللَّهُ الْعَظِيمُ الْحَلِيمُ، لَا إِلَهَ إِلَّا اللَّهُ رَبُّ الْعَرْشِ الْعَظِيمِ، لَا إِلَهَ إِلَّا اللَّهُ رَبُّ السَّمَاوَاتِ وَرَبُّ الْأَرْضِ وَرَبُّ الْعَرْشِ الْكَرِيمِ.',
    explanation: 'هذا الذكر العظيم هو ملجأ المسلم عند الشدائد والمصائب. ففيه تعظيم لله وتوحيده بأسمائه وصفاته الدالة على العظمة والحلم والربوبية الكاملة. اللجوء إلى الله بهذه الكلمات يملأ القلب يقينًا بأن من بيده ملكوت كل شيء قادر على كشف الكرب وتفريج الهم.',
  },
];

export const communityProjects: CommunityProject[] = [
    {
        id: 'comm_global_01',
        title: 'تناغم الأرواح (Harmony of Souls)',
        authorName: 'Zad Official',
        likes: 950,
        views: 15000,
        contentType: ContentType.GlobalCultureBridge,
        description: 'شرح مفهوم "الأمة" كشبكة تواصل اجتماعي إنسانية عالمية، مترجم للإنجليزية.',
        generatedContent: {
            title: 'Harmony of Souls: The Global Village',
            youtubeTips: 'Focus on visual diversity and connection. Use soft, uplifting background music.',
            hashtags: ['#GlobalUnity', '#OneHumanity', '#IslamicValues', '#Peace'],
            scenes: [
                { 
                    id: 's1', 
                    text: 'In a world of hyper-individualism, Islam proposes a radical idea: We are one body.', 
                    visualSuggestion: 'Cinematic shot of a lonely figure in a glass city transitioning to a warm, diverse gathering of people holding glowing lights.' 
                },
                { 
                    id: 's2', 
                    text: 'Like bricks in a solid wall, we hold each other up. When one part hurts, the whole body responds.', 
                    visualSuggestion: 'Abstract 3D animation of golden geometric bricks interlocking perfectly to form a bridge over a dark canyon.' 
                },
                { 
                    id: 's3', 
                    text: 'Service to others is not a burden, but the highest form of connection to the Divine.', 
                    visualSuggestion: 'A close-up montage of diverse hands planting a sapling into the earth, bathed in warm sunlight.' 
                }
            ]
        }
    },
    {
        id: 'comm_001',
        title: 'قصة أصحاب الكهف بأسلوب عصري',
        authorName: 'أحمد محمد',
        likes: 154,
        views: 1200,
        contentType: ContentType.QuranicStories,
        description: 'سرد قصصي ممتع لقصة أصحاب الكهف مع التركيز على درس الثبات.',
        generatedContent: {
            title: 'فتية آمنوا بربهم',
            youtubeTips: 'استخدم صور كهوف غامضة، وركز على المؤثرات الصوتية الهادئة.',
            hashtags: ['#القرآن', '#قصص', '#أصحاب_الكهف'],
            scenes: [
                { id: 's1', text: 'في زمن بعيد، وفي مدينة يحكمها ظالم...', visualSuggestion: 'مشهد لمدينة قديمة مزدحمة يطغى عليها الظلام' },
                { id: 's2', text: 'قرر فتية من أشراف القوم الهروب بدينهم.', visualSuggestion: 'مجموعة من الشباب يركضون نحو الجبال وقت الغروب' }
            ]
        }
    },
    {
        id: 'comm_002',
        title: 'تعليم الصلاة للأطفال',
        authorName: 'سارة التعليمية',
        likes: 340,
        views: 5600,
        contentType: ContentType.EducationalVideoScript,
        description: 'سيناريو مبسط وجذاب لتعليم الأطفال كيفية الوضوء والصلاة.',
        generatedContent: {
            title: 'هيا نصلي!',
            youtubeTips: 'اجعل النبرة حماسية ومرحة.',
            hashtags: ['#تعليم_الصلاة', '#أطفال', '#إسلاميات'],
            scenes: [
                { id: 's1', text: 'أهلاً يا أصدقاء! هل أنتم مستعدون للقاء الله؟', visualSuggestion: 'شخصية كرتونية تلوح بيدها بابتسامة عريضة في غرفة ملونة' },
                { id: 's2', text: 'أول خطوة هي الوضوء، لنكن نظيفين ومستعدين.', visualSuggestion: 'صنبور ماء يجري وطفل يغسل وجهه بسعادة' }
            ]
        }
    },
    {
        id: 'comm_003',
        title: 'عظمة الكون: التفكر',
        authorName: 'مبدع رقمي',
        likes: 89,
        views: 450,
        contentType: ContentType.SpiritualExhortations,
        description: 'فيديو تأملي في خلق السماوات والأرض.',
        generatedContent: {
            title: 'انظر إلى السماء',
            youtubeTips: 'استخدم لقطات حقيقية للفضاء (Stock footage).',
            hashtags: ['#تأمل', '#فضاء', '#إيمان'],
            scenes: [
                { id: 's1', text: 'هل نظرت يوماً إلى السماء وتساءلت؟', visualSuggestion: 'سماء ليلية مليئة بالنجوم الساطعة جداً' },
                { id: 's2', text: 'من رفعها بلا عمد؟ ومن زينها بالنجوم؟', visualSuggestion: 'حركة سريعة (Time-lapse) للمجرات' }
            ]
        }
    }
];

// Curated Royalty-Free Backgrounds (SVG Data URIs for lightness & scaling)
export const backgroundLibrary: BackgroundAsset[] = [
    {
        id: 'bg_geom_teal',
        titleKey: 'backgrounds.geometricTeal',
        category: 'geometric',
        url: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100' fill-opacity='0.15'%3E%3Cpath fill='%230f766e' d='M50 0 L100 50 L50 100 L0 50 Z M50 20 L80 50 L50 80 L20 50 Z'/%3E%3Cpath fill='%23d4af37' d='M0 0 L25 25 L0 50 L-25 25 Z M100 0 L125 25 L100 50 L75 25 Z M0 100 L25 125 L0 150 L-25 125 Z M100 100 L125 125 L100 150 L75 125 Z'/%3E%3C/svg%3E"
    },
    {
        id: 'bg_geom_gold_dark',
        titleKey: 'backgrounds.geometricGold',
        category: 'geometric',
        url: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60' viewBox='0 0 60 60'%3E%3Crect width='60' height='60' fill='%230f172a'/%3E%3Cpath d='M30 0L60 30L30 60L0 30Z' fill='none' stroke='%23d4af37' stroke-width='1' opacity='0.2'/%3E%3Ccircle cx='30' cy='30' r='10' fill='%230f766e' opacity='0.1'/%3E%3C/svg%3E"
    },
    {
        id: 'bg_geom_blue_gold',
        titleKey: 'backgrounds.geometricBlueGold',
        category: 'geometric',
        url: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80' viewBox='0 0 80 80'%3E%3Crect width='80' height='80' fill='%231e293b'/%3E%3Cpath d='M40 0 L80 40 L40 80 L0 40 Z' fill='none' stroke='%23fbbf24' stroke-width='0.5' opacity='0.3'/%3E%3Ccircle cx='40' cy='40' r='15' fill='%233b82f6' opacity='0.1'/%3E%3C/svg%3E"
    },
    {
        id: 'bg_arch_mosque',
        titleKey: 'backgrounds.archMosque',
        category: 'architecture',
        // Royalty free from Unsplash (Credits: Mourizal Zativa)
        url: "https://images.unsplash.com/photo-1564121211835-e88c852648ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=1080&q=80"
    },
    {
        id: 'bg_arch_courtyard',
        titleKey: 'backgrounds.archCourtyard',
        category: 'architecture',
         // Royalty free from Unsplash (Credits: David Rodrigo)
        url: "https://images.unsplash.com/photo-1580803374695-51a75e4b8551?ixlib=rb-4.0.3&auto=format&fit=crop&w=1080&q=80"
    },
    {
        id: 'bg_arch_minaret',
        titleKey: 'backgrounds.archMinaret',
        category: 'architecture',
        url: "https://images.unsplash.com/photo-1542046081-931610be3814?ixlib=rb-4.0.3&auto=format&fit=crop&w=1080&q=80"
    },
    {
        id: 'bg_cal_abstract',
        titleKey: 'backgrounds.calligraphyAbstract',
        category: 'calligraphy',
        // Abstract ink flow
        url: "https://images.unsplash.com/photo-1519817914152-22d216bb9170?ixlib=rb-4.0.3&auto=format&fit=crop&w=1080&q=80"
    },
    {
        id: 'bg_nature_serene',
        titleKey: 'backgrounds.natureSerene',
        category: 'nature',
         // Royalty free from Unsplash
        url: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1080&q=80"
    },
    {
        id: 'bg_nature_mountains',
        titleKey: 'backgrounds.natureMountains',
        category: 'nature',
        url: "https://images.unsplash.com/photo-1454496522488-7a8e488e8606?ixlib=rb-4.0.3&auto=format&fit=crop&w=1080&q=80"
    },
    {
        id: 'bg_lantern_ramadan',
        titleKey: 'backgrounds.lanternRamadan',
        category: 'architecture',
        url: "https://images.unsplash.com/photo-1556538777-52eb2f525f22?ixlib=rb-4.0.3&auto=format&fit=crop&w=1080&q=80"
    },
    {
        id: 'bg_quran_open',
        titleKey: 'backgrounds.quranOpen',
        category: 'calligraphy',
        url: "https://images.unsplash.com/photo-1609599006353-e629aaabfeae?ixlib=rb-4.0.3&auto=format&fit=crop&w=1080&q=80"
    },
    {
        id: 'bg_arabesque_pattern',
        titleKey: 'backgrounds.arabesque',
        category: 'geometric',
        url: "data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.08'%3E%3Cpath d='M40 40c0-8.8-7.2-16-16-16s-16 7.2-16 16 7.2 16 16 16 16-7.2 16-16zM0 40c0-8.8 7.2-16 16-16s16 7.2 16 16-7.2 16-16 16S0 48.8 0 40zm40 40c0-8.8 7.2-16 16-16s16 7.2 16 16-7.2 16-16 16S40 88.8 40 80zm40-40c0-8.8-7.2-16-16-16s-16 7.2-16 16 7.2 16 16 16 16-7.2 16-16z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E"
    }
];

export const marketplaceItems: MarketplaceItem[] = [
    {
        id: 'mp_tpl_ramadan_2025',
        titleKey: 'marketplace.items.ramadan2025.title',
        descriptionKey: 'marketplace.items.ramadan2025.desc',
        category: 'template',
        price: 'free',
        isPro: false,
        rating: 4.9,
        downloads: 1200,
        thumbnailUrl: 'https://images.unsplash.com/photo-1617203442285-115c46655e59?auto=format&fit=crop&w=400&q=80'
    },
    {
        id: 'mp_tpl_news_opener',
        titleKey: 'marketplace.items.newsOpener.title',
        descriptionKey: 'marketplace.items.newsOpener.desc',
        category: 'template',
        price: 5,
        isPro: true,
        rating: 4.7,
        downloads: 450,
        thumbnailUrl: 'https://images.unsplash.com/photo-1495020686659-d4b86b7d6a5d?auto=format&fit=crop&w=400&q=80'
    },
    {
        id: 'mp_bg_4k_nature',
        titleKey: 'marketplace.items.4kNature.title',
        descriptionKey: 'marketplace.items.4kNature.desc',
        category: 'background',
        price: 2.99,
        isPro: true,
        rating: 4.8,
        downloads: 890,
        thumbnailUrl: 'https://images.unsplash.com/photo-1501854140884-074cf2b2c3af?auto=format&fit=crop&w=400&q=80'
    },
    {
        id: 'mp_av_wise_scholar',
        titleKey: 'marketplace.items.wiseScholar.title',
        descriptionKey: 'marketplace.items.wiseScholar.desc',
        category: 'avatar',
        price: 'free',
        isPro: false,
        rating: 4.6,
        downloads: 2100,
        thumbnailUrl: 'https://images.unsplash.com/photo-1566753323558-f4e0952af115?auto=format&fit=crop&w=400&q=80'
    },
    {
        id: 'mp_aud_cinematic_pack',
        titleKey: 'marketplace.items.cinematicPack.title',
        descriptionKey: 'marketplace.items.cinematicPack.desc',
        category: 'audio',
        price: 9.99,
        isPro: true,
        rating: 5.0,
        downloads: 300,
        thumbnailUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=400&q=80'
    }
];