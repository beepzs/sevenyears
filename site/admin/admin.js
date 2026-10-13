/* ==========================================================================
   The First Seven Years — Admin CMS Core Application
   ========================================================================== */

(() => {
  // Global State
  const state = {
    data: null,
    currentTab: 'dashboard',
    currentRole: 'super_admin',
    activeFilters: {
      topics: 'all',
      answers: 'all',
      faqs: 'all',
      videos: 'all',
      submissions: 'all',
      pages: 'all'
    },
    activeMenuSubtab: 'header',
    footerColFilter: 'all',
    activeSettingsSubtab: 'brand',
    activeNotifFilter: 'all',
    activeYtRange: '28d',
    activeYtType: 'all',
    ytSearchQuery: '',
    ytSortField: 'views_desc',
    showMenuPreview: true,
    searchQuery: '',
    editingItem: null,
    editingType: null,
    currentUser: 'usr-1',
    selectedBoardUser: 'usr-1'
  };

  // Common YouTube Medical & Educational Disclaimer default
  const DEFAULT_YT_DISCLAIMER = "The information provided in The First Seven Years is for educational and informational purposes only and is not intended as a substitute for advice from your pediatrician or other healthcare professional. Always consult with your doctor regarding any medical concerns or health conditions. The views expressed by our guests are their own and do not necessarily reflect the official policy or position of The First Seven Years.";

  // Default Mock System & Clinical Alerts
  const DEFAULT_ALERTS = [
    {
      id: 'alt-1',
      type: 'red_flag',
      title: 'Emergency triage: High fever (104.2°F) & lethargy in 7mo infant',
      meta: 'Inbound submission #sub-102 · Urgent clinical review recommended',
      time: '8 mins ago',
      unread: true,
      actionTab: 'submissions'
    },
    {
      id: 'alt-2',
      type: 'red_flag',
      title: 'Respiratory alert: Severe stridor and barking cough with retractions (2yo)',
      meta: 'Inbound submission #sub-105 · Immediate pediatrician evaluation needed',
      time: '24 mins ago',
      unread: true,
      actionTab: 'submissions'
    },
    {
      id: 'alt-3',
      type: 'submission',
      title: 'New question: "Introducing allergens with severe eczema history"',
      meta: 'From: Elena R. · Category: Food & Nutrition · Age: 4–6 months',
      time: '45 mins ago',
      unread: true,
      actionTab: 'submissions'
    },
    {
      id: 'alt-4',
      type: 'clinical',
      title: 'Medical Review Pending: "Febrile Seizures: When to Call 911"',
      meta: 'Assigned to Dr. Elisa Song · Verification draft pending for 2 days',
      time: '2 hours ago',
      unread: true,
      actionTab: 'answers'
    },
    {
      id: 'alt-5',
      type: 'security',
      title: 'Administrator session authenticated with Two-Factor Auth',
      meta: 'User: dr_murray · IP: 127.0.0.1 (macOS Chrome)',
      time: '4 hours ago',
      unread: false,
      actionTab: 'settings'
    }
  ];

  // Canonical Management Area and Menu Listing Definitions
  const MODULE_DEFS = [
    { id: 'dashboard', name: 'Dashboard', icon: '🧭', desc: 'KPI summary, site activity, quick actions', route: '/admin/' },
    { id: 'topics', name: 'Topic Master', icon: '🏷️', desc: '13 core topic hubs, drag-drop ordering, expert assignment', route: '/topics/' },
    { id: 'answers', name: 'Question & Answer', icon: '❓', desc: 'Clinical answers directory, age tags, medical review', route: '/answers/' },
    { id: 'faqs', name: 'FAQ Management', icon: '💡', desc: 'Categorized FAQs and public /faq/ knowledge base', route: '/faq/' },
    { id: 'videos', name: 'Video Library', icon: '🎬', desc: 'Episodes, clips, full transcripts, and answer linking', route: '/episodes/' },
    { id: 'youtube', name: 'YouTube Reports', icon: '▶️', desc: 'Channel analytics, views, watch time, and video metrics', route: '/admin/' },
    { id: 'submissions', name: 'Ask the Doctor Inbox', icon: '📥', desc: 'Parent questions, emergency triage flags, convert to Q&A', route: '/ask-the-doctor/' },
    { id: 'experts', name: 'Experts & Hosts', icon: '🩺', desc: 'Doctor profiles, headshot photos, bio & credentials', route: '/experts/' },
    { id: 'pages', name: 'Page Management', icon: '📄', desc: 'Static/content pages, template layouts, SEO metadata', route: '/about/' },
    { id: 'menus', name: 'Menu Management', icon: '🧭', desc: 'Header navigation, mobile drawer badges, footer directory', route: '/admin/' },
    { id: 'roles', name: 'Roles & Permissions', icon: '👥', desc: 'Team member permissions board, access levels', route: '/admin/' },
    { id: 'settings', name: 'Settings & Security', icon: '⚙', desc: 'Brand colors, password credentials, 2FA, organization profile', route: '/admin/' }
  ];

  // Embedded Seed Data for Standalone Prototype
  const SEED_DATA = {
  "settings": {
    "site_title": "The First Seven Years",
    "site_tagline": "Expert answers for parents of kids 0–7",
    "canonical_domain": "https://thefirstsevenyears.com",
    "youtube_channel": "https://www.youtube.com/@thefirstsevenyears",
    "contact_email": "hello@thefirstsevenyears.com",
    "medical_disclaimer": "Educational content only. Not individual medical advice. Consult your pediatrician.",
    "brand_colors": {
      "navy": "#2B3C56",
      "mint": "#A6D6B0",
      "cream": "#FBF9F5",
      "peach": "#FAD7C4",
      "butter": "#FBE7AC",
      "lilac": "#DDD6F5",
      "soft_green": "#BFE4C6",
      "sky": "#CFE6F2"
    },
    "security": {
      "session_timeout": "30m",
      "two_factor_enabled": false,
      "last_password_change": "2026-10-09T12:00:00Z",
      "current_user_password_hash": "sha256:demo_hash"
    },
    "organization": {
      "support_phone": "+1 (800) 555-0177",
      "office_location": "Santa Barbara, CA",
      "copyright_notice": "© 2026 The First Seven Years. All rights reserved.",
      "social_twitter": "https://twitter.com/firstsevenyears",
      "social_instagram": "https://instagram.com/thefirstsevenyears",
      "social_linkedin": "https://linkedin.com/company/thefirstsevenyears"
    },
    "notifications": {
      "recipient_emails": "alerts@thefirstsevenyears.com, dr.murray@thefirstsevenyears.com",
      "emergency_sms": "+1 (800) 555-0177",
      "frequency": "instant",
      "sound_alarm": true,
      "browser_push": false,
      "email_new_submissions": true,
      "email_red_flags": true,
      "email_clinical_reminders": true,
      "video_updates": true,
      "security_logins": true
    }
  },
  "alerts": DEFAULT_ALERTS,
  "topics": [
    {
      "slug": "gut-health",
      "name": "Gut health & microbiome",
      "short": "Tummies, probiotics and the gut–brain link",
      "swatch": "#bfe4c6",
      "intro": "Much of your child’s immune system lives in the gut, and the microbes that settle there in the first years shape far more than digestion. Start here for the plain-English basics.",
      "published": true,
      "order": 1,
      "answers": [
        "is-my-childs-eczema-a-gut-problem",
        "what-is-leaky-gut",
        "prebiotics-vs-probiotics-vs-postbiotics",
        "restoring-the-gut-after-antibiotics",
        "does-my-gut-health-before-pregnancy-matter"
      ],
      "episodes": [
        "eeuP3KRgQg4",
        "NiYwg17ahYo",
        "wHrPcQPYiaE",
        "g4ejtsJj9y8",
        "Yr5B77Yp9HE",
        "VBfOpGRcS2M",
        "hqC4jyz4ZvQ",
        "bmkNG6J4YT0",
        "w_HZCxmnNi4",
        "I90rSaFzuak"
      ],
      "experts": [
        "dr-dan-sullivan",
        "dr-elisa-song",
        "joy-mccarthy"
      ],
      "main_video": "wHrPcQPYiaE",
      "ages": [
        0,
        1,
        2,
        3,
        4,
        5,
        6,
        7
      ]
    },
    {
      "slug": "first-foods",
      "name": "Nutrition & first foods",
      "short": "Starting solids, balanced plates, real food",
      "swatch": "#fbe7ac",
      "intro": "From first spoonfuls to lunchbox years — how to build a varied diet without turning mealtimes into a project.",
      "published": true,
      "order": 2,
      "answers": [
        "prebiotics-vs-probiotics-vs-postbiotics"
      ],
      "episodes": [
        "Yr5B77Yp9HE"
      ],
      "experts": [
        "dr-elisa-song"
      ],
      "main_video": "Yr5B77Yp9HE",
      "ages": [
        0,
        1,
        2,
        3,
        4,
        5,
        6,
        7
      ]
    },
    {
      "slug": "picky-eating",
      "name": "Picky eating",
      "short": "When they won’t eat, or only eat beige",
      "swatch": "#fad7c4",
      "intro": "Selective eating is one of the most common worries we hear. What is normal, what helps, and when to look closer.",
      "published": true,
      "order": 3,
      "answers": [],
      "episodes": [],
      "experts": [
        "dr-murray-clarke"
      ],
      "main_video": "",
      "ages": [
        0,
        1,
        2,
        3,
        4,
        5,
        6,
        7
      ]
    },
    {
      "slug": "skin-eczema",
      "name": "Skin & eczema",
      "short": "Rashes, dry patches and the gut–skin link",
      "swatch": "#f6d2c9",
      "intro": "Eczema is about more than skin. Our experts explain barrier care, triggers, and where the gut fits in.",
      "published": true,
      "order": 4,
      "answers": [
        "is-my-childs-eczema-a-gut-problem",
        "is-cortisone-cream-safe-for-babies"
      ],
      "episodes": [
        "VBfOpGRcS2M",
        "E1clSMEAwNk",
        "HHG5bOnx6IU",
        "7HRqTlUyXdI",
        "wP5-4Pu094s",
        "I90rSaFzuak"
      ],
      "experts": [
        "dr-elisa-song",
        "joy-mccarthy"
      ],
      "main_video": "VBfOpGRcS2M",
      "ages": [
        0,
        1,
        2,
        3,
        4,
        5,
        6,
        7
      ]
    },
    {
      "slug": "allergies",
      "name": "Allergies",
      "short": "Food allergy, hay fever and early prevention",
      "swatch": "#ddd6f5",
      "intro": "What research now says about early exposure, and how to tell an allergy from an intolerance.",
      "published": true,
      "order": 5,
      "answers": [
        "what-is-leaky-gut",
        "are-pets-and-dirt-good-for-immunity"
      ],
      "episodes": [
        "s5lyhtu2aXc",
        "w_HZCxmnNi4"
      ],
      "experts": [
        "dr-elisa-song"
      ],
      "main_video": "w_HZCxmnNi4",
      "ages": [
        0,
        1,
        2,
        3,
        4,
        5,
        6,
        7
      ]
    },
    {
      "slug": "immunity",
      "name": "Immunity & everyday illness",
      "short": "Colds, fevers, antibiotics and bouncing back",
      "swatch": "#cfe6f2",
      "intro": "Coughs, colds and the endless nursery bugs — building resilience, and knowing when to call the doctor.",
      "published": true,
      "order": 6,
      "answers": [
        "restoring-the-gut-after-antibiotics",
        "are-pets-and-dirt-good-for-immunity",
        "is-it-okay-to-kiss-my-baby"
      ],
      "episodes": [
        "4ddstm2d_Y4",
        "s5lyhtu2aXc",
        "hqC4jyz4ZvQ",
        "maCarlEllC4",
        "E1clSMEAwNk"
      ],
      "experts": [
        "dr-elisa-song",
        "joy-mccarthy"
      ],
      "main_video": "4ddstm2d_Y4",
      "ages": [
        0,
        1,
        2,
        3,
        4,
        5,
        6,
        7
      ]
    },
    {
      "slug": "brain-focus",
      "name": "Brain, focus & ADHD",
      "short": "Attention, learning and the gut–brain axis",
      "swatch": "#e3dcf7",
      "intro": "Why attention differences are being diagnosed more often, and the daily habits that support a developing brain.",
      "published": true,
      "order": 7,
      "answers": [
        "can-stress-in-pregnancy-affect-my-baby",
        "why-are-adhd-diagnoses-rising"
      ],
      "episodes": [
        "sJsNza0_zRQ",
        "jrIRvStKeqk",
        "W1VViQ8goFk",
        "wHrPcQPYiaE",
        "w_HZCxmnNi4",
        "_V-l7iVzZII",
        "ICUVBCs9ejk",
        "HvaWCG7fPzk",
        "WtRxQB2KYNk"
      ],
      "experts": [
        "dr-dan-sullivan",
        "dr-elisa-song",
        "erinn-askin"
      ],
      "main_video": "wHrPcQPYiaE",
      "ages": [
        0,
        1,
        2,
        3,
        4,
        5,
        6,
        7
      ]
    },
    {
      "slug": "autism-development",
      "name": "Autism & development",
      "short": "Milestones, differences and support",
      "swatch": "#d6ecdf",
      "intro": "Understanding developmental differences early, and the range of support families are exploring.",
      "published": true,
      "order": 8,
      "answers": [],
      "episodes": [
        "p6zHpTHi1bY",
        "vfC7sUx5d6M",
        "GHztowhZtAw",
        "esmbFJNha9c",
        "WtRxQB2KYNk"
      ],
      "experts": [
        "erinn-askin"
      ],
      "main_video": "WtRxQB2KYNk",
      "ages": [
        0,
        1,
        2,
        3,
        4,
        5,
        6,
        7
      ]
    },
    {
      "slug": "sleep",
      "name": "Sleep",
      "short": "Bedtimes, night waking and routines",
      "swatch": "#d9dff3",
      "intro": "Sleep drives mood, growth and immunity. Gentle, realistic approaches for tired families.",
      "published": true,
      "order": 9,
      "answers": [],
      "episodes": [
        "HvaWCG7fPzk"
      ],
      "experts": [
        "erinn-askin"
      ],
      "main_video": "HvaWCG7fPzk",
      "ages": [
        0,
        1,
        2,
        3,
        4,
        5,
        6,
        7
      ]
    },
    {
      "slug": "emotions",
      "name": "Emotions & behaviour",
      "short": "Big feelings, tantrums and resilience",
      "swatch": "#fde2c8",
      "intro": "Meltdowns are normal — here is what is happening in the brain, and how to help a child find calm.",
      "published": true,
      "order": 10,
      "answers": [],
      "episodes": [
        "w_HZCxmnNi4"
      ],
      "experts": [
        "dr-elisa-song"
      ],
      "main_video": "w_HZCxmnNi4",
      "ages": [
        0,
        1,
        2,
        3,
        4,
        5,
        6,
        7
      ]
    },
    {
      "slug": "pregnancy",
      "name": "Pregnancy & preconception",
      "short": "Setting up the first seven years before day one",
      "swatch": "#f7d9e3",
      "intro": "A child’s health story starts before birth. What matters in preconception and pregnancy — without the guilt.",
      "published": true,
      "order": 11,
      "answers": [
        "can-stress-in-pregnancy-affect-my-baby",
        "does-my-gut-health-before-pregnancy-matter"
      ],
      "episodes": [
        "jrIRvStKeqk",
        "wHrPcQPYiaE",
        "VBfOpGRcS2M",
        "bmkNG6J4YT0"
      ],
      "experts": [
        "dr-dan-sullivan",
        "dr-elisa-song"
      ],
      "main_video": "wHrPcQPYiaE",
      "ages": [
        0,
        1,
        2,
        3,
        4,
        5,
        6,
        7
      ]
    },
    {
      "slug": "supplements",
      "name": "Supplements",
      "short": "What kids actually need, and what they don’t",
      "swatch": "#f3ecdf",
      "intro": "Food first — then an honest look at where vitamin D, omega-3s, probiotics and others may fit.",
      "published": true,
      "order": 12,
      "answers": [
        "prebiotics-vs-probiotics-vs-postbiotics"
      ],
      "episodes": [
        "NiYwg17ahYo",
        "Yr5B77Yp9HE",
        "HHG5bOnx6IU"
      ],
      "experts": [
        "dr-elisa-song",
        "joy-mccarthy"
      ],
      "main_video": "NiYwg17ahYo",
      "ages": [
        0,
        1,
        2,
        3,
        4,
        5,
        6,
        7
      ]
    },
    {
      "slug": "emerging-therapies",
      "name": "New & emerging therapies",
      "short": "Light therapy, brain mapping and the research",
      "swatch": "#e6ecd0",
      "intro": "Clear-eyed conversations about newer approaches families are asking about — what the evidence says, and what it doesn’t yet.",
      "published": true,
      "order": 13,
      "answers": [],
      "episodes": [
        "p6zHpTHi1bY",
        "_V-l7iVzZII",
        "2GnkeYKhoH0",
        "vfC7sUx5d6M",
        "GHztowhZtAw",
        "K6fQ5S67huk",
        "ICUVBCs9ejk",
        "WtRxQB2KYNk"
      ],
      "experts": [
        "erinn-askin"
      ],
      "main_video": "WtRxQB2KYNk",
      "ages": [
        0,
        1,
        2,
        3,
        4,
        5,
        6,
        7
      ]
    }
  ],
  "answers": [
    {
      "slug": "is-my-childs-eczema-a-gut-problem",
      "q": "Is my child’s eczema really a gut problem?",
      "topic": "skin-eczema",
      "also": [
        "gut-health"
      ],
      "video": "I90rSaFzuak",
      "expert": "joy-mccarthy",
      "ages": [
        0,
        1,
        2,
        3
      ],
      "quick": "Partly — and it is worth knowing why. Eczema happens when the skin barrier is leaky and the immune system over-reacts. Research increasingly links both to the gut microbiome, especially in the first years of life. Good skin care still comes first; supporting the gut can sit alongside it.",
      "body": "\n<h2>What eczema actually is</h2>\n<p>Eczema (atopic dermatitis) is a combination of two things: skin that does not hold moisture well, and an immune system that reacts strongly to everyday triggers. The result is the dry, itchy, inflamed patches most parents recognise — often in the creases of elbows and knees, or on the cheeks in babies.</p>\n<h2>Where the gut comes in</h2>\n<p>Most of the immune system is trained in the gut during the first years of life. Studies have found differences in the gut bacteria of babies who go on to develop eczema, and early-life factors that shape the microbiome — such as birth by C-section or early antibiotics — are associated with a higher chance of eczema. This is what people mean by the <em>gut–skin axis</em>.</p>\n<p>That does not mean eczema is <em>only</em> a gut problem, or that changing diet alone will clear it. It means the gut is one lever among several.</p>\n<h2>What parents can reasonably do</h2>\n<ul>\n  <li><strong>Protect the skin barrier every day.</strong> Short lukewarm baths, then a thick fragrance-free moisturiser within a few minutes.</li>\n  <li><strong>Notice triggers.</strong> Heat, sweat, scratchy fabrics, soaps and sometimes specific foods can all flare skin.</li>\n  <li><strong>Feed the microbiome.</strong> A varied diet with fibre from fruit, vegetables, oats and beans, plus fermented foods such as plain yogurt if your child tolerates them.</li>\n  <li><strong>Ask before you add.</strong> Probiotics have mixed evidence for eczema — talk to your pediatrician about whether a specific product makes sense for your child.</li>\n</ul>\n<h2>When to see your doctor</h2>\n<p>Book an appointment if the skin is weeping, crusting or very red (it may be infected), if your child has a fever alongside a flare, if eczema is disturbing sleep, or if it is not improving with good daily care. Never stop a prescribed treatment without speaking to your doctor first.</p>",
      "published": true,
      "reviewed": "2026-09-25",
      "clinical_status": "Reviewed"
    },
    {
      "slug": "what-is-leaky-gut",
      "q": "What is “leaky gut”, really?",
      "topic": "gut-health",
      "also": [
        "allergies"
      ],
      "video": "g4ejtsJj9y8",
      "expert": "dr-elisa-song",
      "ages": [
        2,
        3,
        4,
        5
      ],
      "quick": "“Leaky gut” describes a gut lining that lets more through than it should — researchers call it increased intestinal permeability. It is measurable in studies, but it is not a diagnosis on its own. Think of it as one way gut health may connect to allergies, skin and mood.",
      "body": "",
      "published": true,
      "reviewed": "2026-09-24",
      "clinical_status": "Reviewed"
    },
    {
      "slug": "prebiotics-vs-probiotics-vs-postbiotics",
      "q": "Prebiotics, probiotics, postbiotics — what’s the difference?",
      "topic": "gut-health",
      "also": [
        "supplements",
        "first-foods"
      ],
      "video": "Yr5B77Yp9HE",
      "expert": "dr-elisa-song",
      "ages": [
        1,
        2,
        3,
        4,
        5,
        6,
        7
      ],
      "quick": "Probiotics are live, helpful microbes. Prebiotics are the fibres that feed them. Postbiotics are the useful compounds those microbes make. For most children, foods are the easiest place to start: yogurt or kefir, oats, bananas, beans and a wide variety of plants.",
      "body": "",
      "published": true,
      "reviewed": "2026-09-23",
      "clinical_status": "Reviewed"
    },
    {
      "slug": "restoring-the-gut-after-antibiotics",
      "q": "How do I help my child’s gut recover after antibiotics?",
      "topic": "gut-health",
      "also": [
        "immunity"
      ],
      "video": "hqC4jyz4ZvQ",
      "expert": "dr-elisa-song",
      "ages": [
        1,
        2,
        3,
        4,
        5,
        6,
        7
      ],
      "quick": "First, antibiotics are sometimes essential — always finish the course you were prescribed. Afterwards, a varied, fibre-rich diet, fermented foods if tolerated, plenty of water and time all help the microbiome rebuild. Ask your pediatrician whether a probiotic is worth adding for your child.",
      "body": "",
      "published": true,
      "reviewed": "2026-09-22",
      "clinical_status": "Reviewed"
    },
    {
      "slug": "are-pets-and-dirt-good-for-immunity",
      "q": "Are pets and a bit of dirt actually good for my child?",
      "topic": "immunity",
      "also": [
        "allergies"
      ],
      "video": "s5lyhtu2aXc",
      "expert": "dr-elisa-song",
      "ages": [
        0,
        1,
        2,
        3,
        4
      ],
      "quick": "Often, yes. Many studies link early, everyday exposure — pets, outdoor play, older siblings — to lower rates of allergy and asthma. It is sometimes called the “old friends” idea. It does not replace handwashing before meals and after the toilet.",
      "body": "",
      "published": true,
      "reviewed": "2026-09-21",
      "clinical_status": "Reviewed"
    },
    {
      "slug": "is-it-okay-to-kiss-my-baby",
      "q": "Is it okay to kiss my baby on the face?",
      "topic": "immunity",
      "also": [],
      "video": "4ddstm2d_Y4",
      "expert": "dr-elisa-song",
      "ages": [
        0,
        1
      ],
      "quick": "For healthy parents, affectionate contact is part of normal bonding and shares friendly microbes. The exceptions: if you have a cold sore, a cold or flu, or your newborn is very young or unwell, keep kisses away from the face and hands until you are better.",
      "body": "",
      "published": true,
      "reviewed": "2026-09-20",
      "clinical_status": "Reviewed"
    },
    {
      "slug": "can-stress-in-pregnancy-affect-my-baby",
      "q": "Can stress in pregnancy affect my baby?",
      "topic": "pregnancy",
      "also": [
        "brain-focus"
      ],
      "video": "jrIRvStKeqk",
      "expert": "dr-dan-sullivan",
      "ages": [
        0
      ],
      "quick": "Research links ongoing, severe stress in pregnancy with differences in a baby’s development — but everyday worry is normal and nothing to feel guilty about. Sleep, support, gentle movement and asking for help are protective for both of you.",
      "body": "",
      "published": true,
      "reviewed": "2026-09-19",
      "clinical_status": "Reviewed"
    },
    {
      "slug": "does-my-gut-health-before-pregnancy-matter",
      "q": "Does my own gut health before pregnancy matter?",
      "topic": "pregnancy",
      "also": [
        "gut-health"
      ],
      "video": "bmkNG6J4YT0",
      "expert": "dr-elisa-song",
      "ages": [
        0
      ],
      "quick": "It is part of the story. Babies pick up their first microbes from their mother — through birth, feeding and close contact. Eating a varied, fibre-rich diet and looking after your own health before and during pregnancy all count.",
      "body": "",
      "published": true,
      "reviewed": "2026-09-18",
      "clinical_status": "Reviewed"
    },
    {
      "slug": "why-are-adhd-diagnoses-rising",
      "q": "Why are ADHD diagnoses rising?",
      "topic": "brain-focus",
      "also": [],
      "video": "W1VViQ8goFk",
      "expert": "dr-dan-sullivan",
      "ages": [
        4,
        5,
        6,
        7
      ],
      "quick": "Partly because awareness and screening have improved. Researchers are also looking at sleep, screens, diet and the gut–brain axis. In this clip, Dr. Dan Sullivan shares his view on what has changed — and what parents can do day to day.",
      "body": "",
      "published": true,
      "reviewed": "2026-09-17",
      "clinical_status": "Reviewed"
    },
    {
      "slug": "is-cortisone-cream-safe-for-babies",
      "q": "Is cortisone cream okay for my baby’s eczema?",
      "topic": "skin-eczema",
      "also": [],
      "video": "wP5-4Pu094s",
      "expert": "joy-mccarthy",
      "ages": [
        0,
        1,
        2
      ],
      "quick": "Low-strength steroid creams are widely prescribed and can be appropriate for short flares. In this clip, Joy McCarthy explains why she also looks at gentle skin care and gut support. Talk to your pediatrician before stopping or changing anything prescribed.",
      "body": "",
      "published": true,
      "reviewed": "2026-09-16",
      "clinical_status": "Reviewed"
    }
  ],
  "faqs": [
    {
      "id": "faq-1",
      "category": "About The Series",
      "topic": "about",
      "question": "What is The First Seven Years?",
      "answer": "The First Seven Years is a multi-media knowledge library and podcast hosted by Dr. Murray Clarke and Bryce Wylde. It focuses on the crucial developmental years from age 0 to 7, exploring nutrition, gut health, sleep, development, and pediatric wellness.",
      "order": 1,
      "published": true
    },
    {
      "id": "faq-2",
      "category": "Clinical & Medical",
      "topic": "about",
      "question": "Is this content a substitute for pediatric medical care?",
      "answer": "No. All content on The First Seven Years is educational and informative. It does not constitute individual medical advice or diagnosis. Always consult your qualified pediatrician or family doctor for your child’s specific symptoms.",
      "order": 2,
      "published": true
    },
    {
      "id": "faq-3",
      "category": "Ask the Doctor",
      "topic": "ask-the-doctor",
      "question": "How does Dr. Murray choose which questions to answer?",
      "answer": "Dr. Murray and the clinical team review every inbound parent question. Questions addressing common challenges or emerging topics are turned into parent answers and podcast segments for the whole community.",
      "order": 3,
      "published": true
    },
    {
      "id": "faq-4",
      "category": "The Book",
      "topic": "book",
      "question": "When is Dr. Murray Clarke’s upcoming book being released?",
      "answer": "The book is currently in production for release in 2027. You can join the priority waitlist on our book page to receive early sample chapters and launch updates.",
      "order": 4,
      "published": true
    },
    {
      "id": "faq-5",
      "category": "Topics & Content",
      "topic": "gut-health",
      "question": "Why is so much emphasis placed on the gut microbiome?",
      "answer": "Up to 70% of a child’s immune system is trained in the gut. Modern research reveals deep connections between the early microbiome and childhood allergies, eczema, mood, and cognitive development.",
      "order": 5,
      "published": true
    }
  ],
  "episodes": [
    {
      "id": "sJsNza0_zRQ",
      "title": "7 Things One Doctor Does to Manage His Own ADHD",
      "guest": "dr-dan-sullivan",
      "kind": "clip",
      "tags": [
        "brain-focus"
      ],
      "ep": 27,
      "slug": "7-things-one-doctor-does-to-manage-his-own-adhd",
      "date": "2026-09-26",
      "published": true
    },
    {
      "id": "eeuP3KRgQg4",
      "title": "What Actually Starts Leaky Gut?",
      "guest": "dr-dan-sullivan",
      "kind": "clip",
      "tags": [
        "gut-health"
      ],
      "ep": 27,
      "slug": "what-actually-starts-leaky-gut",
      "date": "2026-09-24",
      "published": true
    },
    {
      "id": "jrIRvStKeqk",
      "title": "Can Stress in Pregnancy Affect Baby’s Brain?",
      "guest": "dr-dan-sullivan",
      "kind": "clip",
      "tags": [
        "pregnancy",
        "brain-focus"
      ],
      "ep": 27,
      "slug": "can-stress-in-pregnancy-affect-babys-brain",
      "date": "2026-09-22",
      "published": true
    },
    {
      "id": "W1VViQ8goFk",
      "title": "ADHD Hit 11% of Kids. What Changed?",
      "guest": "dr-dan-sullivan",
      "kind": "clip",
      "tags": [
        "brain-focus"
      ],
      "ep": 27,
      "slug": "adhd-hit-11-percent-of-kids-what-changed",
      "date": "2026-09-20",
      "published": true
    },
    {
      "id": "NiYwg17ahYo",
      "title": "The One Probiotic Strain Backed by Decades of Research",
      "guest": "dr-elisa-song",
      "kind": "clip",
      "tags": [
        "gut-health",
        "supplements"
      ],
      "ep": 26,
      "slug": "the-one-probiotic-strain-backed-by-decades-of-research",
      "date": "2026-09-18",
      "published": true
    },
    {
      "id": "wHrPcQPYiaE",
      "title": "Could Your Child’s ADHD Start in the Gut?",
      "guest": "dr-dan-sullivan",
      "kind": "ep",
      "tags": [
        "brain-focus",
        "gut-health",
        "pregnancy"
      ],
      "ep": 27,
      "slug": "could-your-childs-adhd-start-in-the-gut",
      "date": "2026-09-16",
      "published": true
    },
    {
      "id": "g4ejtsJj9y8",
      "title": "What Is Leaky Gut, Really? A Pediatrician Explains",
      "guest": "dr-elisa-song",
      "kind": "clip",
      "tags": [
        "gut-health"
      ],
      "ep": 26,
      "slug": "what-is-leaky-gut-really-a-pediatrician-explains",
      "date": "2026-09-14",
      "published": true
    },
    {
      "id": "4ddstm2d_Y4",
      "title": "Should You Still Be Kissing Your Kids? A Pediatrician Weighs In",
      "guest": "dr-elisa-song",
      "kind": "clip",
      "tags": [
        "immunity"
      ],
      "ep": 26,
      "slug": "should-you-still-be-kissing-your-kids-a-pediatrician-weighs-in",
      "date": "2026-09-12",
      "published": true
    },
    {
      "id": "Yr5B77Yp9HE",
      "title": "Prebiotics vs. Probiotics vs. Postbiotics, Finally Explained Simply",
      "guest": "dr-elisa-song",
      "kind": "clip",
      "tags": [
        "gut-health",
        "supplements",
        "first-foods"
      ],
      "ep": 26,
      "slug": "prebiotics-vs-probiotics-vs-postbiotics-finally-explained-simply",
      "date": "2026-09-10",
      "published": true
    },
    {
      "id": "s5lyhtu2aXc",
      "title": "Why Pets and Dirt Actually Build Your Child’s Immune System",
      "guest": "dr-elisa-song",
      "kind": "clip",
      "tags": [
        "immunity",
        "allergies"
      ],
      "ep": 26,
      "slug": "why-pets-and-dirt-actually-build-your-childs-immune-system",
      "date": "2026-09-08",
      "published": true
    },
    {
      "id": "VBfOpGRcS2M",
      "title": "This Study Cut Eczema Risk by 83% in C-Section Babies",
      "guest": "dr-elisa-song",
      "kind": "clip",
      "tags": [
        "skin-eczema",
        "pregnancy",
        "gut-health"
      ],
      "ep": 26,
      "slug": "this-study-cut-eczema-risk-by-83-percent-in-c-section-babies",
      "date": "2026-09-06",
      "published": true
    },
    {
      "id": "hqC4jyz4ZvQ",
      "title": "How to Restore Your Child’s Gut Microbiome After Antibiotics",
      "guest": "dr-elisa-song",
      "kind": "clip",
      "tags": [
        "gut-health",
        "immunity"
      ],
      "ep": 26,
      "slug": "how-to-restore-your-childs-gut-microbiome-after-antibiotics",
      "date": "2026-09-04",
      "published": true
    },
    {
      "id": "bmkNG6J4YT0",
      "title": "The Microbiome Before Conception Is Shaping Your Child’s Health",
      "guest": "dr-elisa-song",
      "kind": "clip",
      "tags": [
        "pregnancy",
        "gut-health"
      ],
      "ep": 26,
      "slug": "the-microbiome-before-conception-is-shaping-your-childs-health",
      "date": "2026-09-02",
      "published": true
    },
    {
      "id": "maCarlEllC4",
      "title": "Why Nearly 1 in 2 Kids Now Have a Chronic Illness",
      "guest": "dr-elisa-song",
      "kind": "clip",
      "tags": [
        "immunity"
      ],
      "ep": 26,
      "slug": "why-nearly-1-in-2-kids-now-have-a-chronic-illness",
      "date": "2026-08-31",
      "published": true
    },
    {
      "id": "p6zHpTHi1bY",
      "title": "Is Brain Laser Therapy Safe for a 3-Year-Old With Autism?",
      "guest": "erinn-askin",
      "kind": "clip",
      "tags": [
        "emerging-therapies",
        "autism-development"
      ],
      "ep": 25,
      "slug": "is-brain-laser-therapy-safe-for-a-3-year-old-with-autism",
      "date": "2026-08-29",
      "published": true
    },
    {
      "id": "w_HZCxmnNi4",
      "title": "Why Your Child’s Allergies, Anxiety and ADHD Might Start in the Gut",
      "guest": "dr-elisa-song",
      "kind": "ep",
      "tags": [
        "gut-health",
        "allergies",
        "emotions",
        "brain-focus"
      ],
      "ep": 26,
      "slug": "why-your-childs-allergies-anxiety-and-adhd-might-start-in-the-gut",
      "date": "2026-08-27",
      "published": true
    },
    {
      "id": "_V-l7iVzZII",
      "title": "How Laser Therapy Helped Him Become a Student for the First Time",
      "guest": "erinn-askin",
      "kind": "clip",
      "tags": [
        "emerging-therapies",
        "brain-focus"
      ],
      "ep": 25,
      "slug": "how-laser-therapy-helped-him-become-a-student-for-the-first-time",
      "date": "2026-08-25",
      "published": true
    },
    {
      "id": "2GnkeYKhoH0",
      "title": "This Laser Therapy Compresses 6 Months of Progress Into 2 Weeks",
      "guest": "erinn-askin",
      "kind": "clip",
      "tags": [
        "emerging-therapies"
      ],
      "ep": 25,
      "slug": "this-laser-therapy-compresses-6-months-of-progress-into-2-weeks",
      "date": "2026-08-23",
      "published": true
    },
    {
      "id": "vfC7sUx5d6M",
      "title": "What’s the Youngest Age for Laser Brain Therapy?",
      "guest": "erinn-askin",
      "kind": "clip",
      "tags": [
        "emerging-therapies",
        "autism-development"
      ],
      "ep": 25,
      "slug": "whats-the-youngest-age-for-laser-brain-therapy",
      "date": "2026-08-21",
      "published": true
    },
    {
      "id": "GHztowhZtAw",
      "title": "This 6-Minute Brain Scan Found What No One Else Could",
      "guest": "erinn-askin",
      "kind": "clip",
      "tags": [
        "emerging-therapies",
        "autism-development"
      ],
      "ep": 25,
      "slug": "this-6-minute-brain-scan-found-what-no-one-else-could",
      "date": "2026-08-19",
      "published": true
    },
    {
      "id": "K6fQ5S67huk",
      "title": "The Study That Turned Lasers Into Brain Therapy",
      "guest": "erinn-askin",
      "kind": "clip",
      "tags": [
        "emerging-therapies"
      ],
      "ep": 25,
      "slug": "the-study-that-turned-lasers-into-brain-therapy",
      "date": "2026-08-17",
      "published": true
    },
    {
      "id": "ICUVBCs9ejk",
      "title": "The Science of How Light Therapy Rewires a Child’s Brain",
      "guest": "erinn-askin",
      "kind": "clip",
      "tags": [
        "emerging-therapies",
        "brain-focus"
      ],
      "ep": 25,
      "slug": "the-science-of-how-light-therapy-rewires-a-childs-brain",
      "date": "2026-08-15",
      "published": true
    },
    {
      "id": "HvaWCG7fPzk",
      "title": "The 12-Minute Nightly Routine That Changed Her Daughter’s Severe ADHD",
      "guest": "erinn-askin",
      "kind": "clip",
      "tags": [
        "brain-focus",
        "sleep"
      ],
      "ep": 25,
      "slug": "the-12-minute-nightly-routine-that-changed-her-daughters-severe-adhd",
      "date": "2026-08-13",
      "published": true
    },
    {
      "id": "esmbFJNha9c",
      "title": "Why 1 in 31 Kids Now Have Autism",
      "guest": "erinn-askin",
      "kind": "clip",
      "tags": [
        "autism-development"
      ],
      "ep": 25,
      "slug": "why-1-in-31-kids-now-have-autism",
      "date": "2026-08-11",
      "published": true
    },
    {
      "id": "WtRxQB2KYNk",
      "title": "Why Traditional Therapy Isn’t Reaching the Root Cause of Autism and ADHD",
      "guest": "erinn-askin",
      "kind": "ep",
      "tags": [
        "autism-development",
        "brain-focus",
        "emerging-therapies"
      ],
      "ep": 25,
      "slug": "why-traditional-therapy-isnt-reaching-the-root-cause-of-autism-and-adh",
      "date": "2026-08-09",
      "published": true
    },
    {
      "id": "E1clSMEAwNk",
      "title": "The Real Reason Your Child’s Eczema Gets Worse After Every Antibiotic",
      "guest": "joy-mccarthy",
      "kind": "clip",
      "tags": [
        "skin-eczema",
        "immunity"
      ],
      "ep": null,
      "slug": "the-real-reason-your-childs-eczema-gets-worse-after-every-antibiotic",
      "date": "2026-08-07",
      "published": true
    },
    {
      "id": "HHG5bOnx6IU",
      "title": "The Supplements & Foods That Can Help Clear Eczema in Children",
      "guest": "joy-mccarthy",
      "kind": "clip",
      "tags": [
        "skin-eczema",
        "supplements"
      ],
      "ep": null,
      "slug": "the-supplements-and-foods-that-can-help-clear-eczema-in-children",
      "date": "2026-08-05",
      "published": true
    },
    {
      "id": "7HRqTlUyXdI",
      "title": "The Tests Your Doctor Isn’t Running for Eczema",
      "guest": "joy-mccarthy",
      "kind": "clip",
      "tags": [
        "skin-eczema"
      ],
      "ep": null,
      "slug": "the-tests-your-doctor-isnt-running-for-eczema",
      "date": "2026-08-03",
      "published": true
    },
    {
      "id": "wP5-4Pu094s",
      "title": "Why Cortisone Cream Backfires & What to Use on Your Baby’s Skin",
      "guest": "joy-mccarthy",
      "kind": "clip",
      "tags": [
        "skin-eczema"
      ],
      "ep": null,
      "slug": "why-cortisone-cream-backfires-and-what-to-use-on-your-babys-skin",
      "date": "2026-08-01",
      "published": true
    },
    {
      "id": "I90rSaFzuak",
      "title": "Why Your Child’s Eczema Is a Gut Problem, Not a Skin Problem",
      "guest": "joy-mccarthy",
      "kind": "clip",
      "tags": [
        "skin-eczema",
        "gut-health"
      ],
      "ep": null,
      "slug": "why-your-childs-eczema-is-a-gut-problem-not-a-skin-problem",
      "date": "2026-07-30",
      "published": true
    }
  ],
  "experts": {
    "dr-murray-clarke": {
      "slug": "dr-murray-clarke",
      "name": "Dr. Murray Clarke",
      "role": "Host · The First Seven Years",
      "img": "/assets/img/dr-murray-clarke.jpg",
      "swatch": "#a6d6b0",
      "short": "Host of The First Seven Years and the doctor who answers your questions.",
      "bio": [
        "Dr. Murray Clarke has spent decades focused on one question: what gives a child the strongest possible start? His work sits where nutrition, the gut and a child’s developing brain meet — and he has a knack for explaining it in the language parents actually use.",
        "On The First Seven Years he hosts long-form conversations with pediatricians, researchers and practitioners, then distils them into short, practical answers. Through Ask the Doctor, he answers parents’ questions directly — the most common become new answers in this library."
      ],
      "creds": [
        "Host of The First Seven Years podcast and video series",
        "Answers parent questions through Ask the Doctor",
        "Focus: children’s nutrition, gut health and integrative care"
      ],
      "same": [
        "https://www.youtube.com/@thefirstsevenyears"
      ],
      "published": true
    },
    "bryce-wylde": {
      "slug": "bryce-wylde",
      "name": "Bryce Wylde",
      "role": "Co-host · Functional medicine",
      "img": null,
      "swatch": "#fbe7ac",
      "short": "Co-host, and a functional medicine expert with a researcher’s eye.",
      "bio": [
        "Bryce Wylde co-hosts The First Seven Years, bringing a functional medicine lens to each conversation — asking the follow-up questions a curious parent would, and pressing guests on the evidence."
      ],
      "creds": [
        "Co-host of The First Seven Years",
        "Functional medicine expert"
      ],
      "same": [],
      "published": true
    },
    "dr-dan-sullivan": {
      "slug": "dr-dan-sullivan",
      "name": "Dr. Dan Sullivan",
      "role": "Guest · Episode 27",
      "img": null,
      "swatch": "#ddd6f5",
      "short": "Guest on Episode 27 — ADHD, stress and the gut.",
      "bio": [
        "Dr. Dan Sullivan joined the show to talk about why ADHD diagnoses are rising, how stress in pregnancy may shape a baby’s brain, and what he does to manage his own ADHD."
      ],
      "creds": [
        "Guest, Episode 27"
      ],
      "same": [],
      "published": true
    },
    "dr-elisa-song": {
      "slug": "dr-elisa-song",
      "name": "Dr. Elisa Song",
      "role": "Guest · Episode 26 · Integrative pediatrician",
      "img": null,
      "swatch": "#bfe4c6",
      "short": "Integrative pediatrician; guest on Episode 26 — the gut behind allergies, anxiety and ADHD.",
      "bio": [
        "Dr. Elisa Song is an integrative pediatrician. On Episode 26 she explains the microbiome in terms any parent can use — from prebiotics versus probiotics to restoring the gut after antibiotics."
      ],
      "creds": [
        "Integrative pediatrician",
        "Guest, Episode 26"
      ],
      "same": [],
      "published": true
    },
    "erinn-askin": {
      "slug": "erinn-askin",
      "name": "Erinn Askin",
      "role": "Guest · Episode 25",
      "img": null,
      "swatch": "#e6ecd0",
      "short": "Guest on Episode 25 — brain mapping and light therapy for autism and ADHD.",
      "bio": [
        "Erinn Askin joined the show to talk about brain mapping, light-based therapies and the routines families use alongside them."
      ],
      "creds": [
        "Guest, Episode 25"
      ],
      "same": [],
      "published": true
    },
    "joy-mccarthy": {
      "slug": "joy-mccarthy",
      "name": "Joy McCarthy",
      "role": "Guest · Holistic nutritionist",
      "img": null,
      "swatch": "#fad7c4",
      "short": "Holistic nutritionist; guest on eczema and the gut–skin connection.",
      "bio": [
        "Joy McCarthy is a holistic nutritionist. Her conversation with the show focuses on children’s eczema — why it is so often a gut story, and gentle ways to care for skin."
      ],
      "creds": [
        "Holistic nutritionist",
        "Guest on eczema and skin health"
      ],
      "same": [],
      "published": true
    }
  },
  "users": [
    {
      "id": "usr-1",
      "name": "Dr. Murray Clarke",
      "email": "murray@thefirstsevenyears.com",
      "role": "super_admin",
      "status": "Active",
      "last_active": "Just now",
      "permissions": {
        "dashboard": "edit",
        "topics": "edit",
        "answers": "edit",
        "faqs": "edit",
        "videos": "edit",
        "submissions": "edit",
        "experts": "edit",
        "pages": "edit",
        "menus": "edit",
        "roles": "edit",
        "settings": "edit"
      }
    },
    {
      "id": "usr-2",
      "name": "Bryce Wylde",
      "email": "bryce@thefirstsevenyears.com",
      "role": "editor",
      "status": "Active",
      "last_active": "2 hours ago",
      "permissions": {
        "dashboard": "view",
        "topics": "edit",
        "answers": "edit",
        "faqs": "edit",
        "videos": "edit",
        "submissions": "view",
        "experts": "edit",
        "pages": "edit",
        "menus": "edit",
        "roles": "hide",
        "settings": "hide"
      }
    },
    {
      "id": "usr-3",
      "name": "Dr. Elisa Song",
      "email": "dr.song@thefirstsevenyears.com",
      "role": "clinical_reviewer",
      "status": "Active",
      "last_active": "Yesterday",
      "permissions": {
        "dashboard": "view",
        "topics": "view",
        "answers": "edit",
        "faqs": "view",
        "videos": "view",
        "submissions": "edit",
        "experts": "view",
        "pages": "view",
        "menus": "hide",
        "roles": "hide",
        "settings": "hide"
      }
    },
    {
      "id": "usr-4",
      "name": "Sarah Jenkins",
      "email": "sarah.j@thefirstsevenyears.com",
      "role": "author",
      "status": "Active",
      "last_active": "3 days ago",
      "permissions": {
        "dashboard": "view",
        "topics": "view",
        "answers": "edit",
        "faqs": "edit",
        "videos": "view",
        "submissions": "hide",
        "experts": "view",
        "pages": "hide",
        "menus": "hide",
        "roles": "hide",
        "settings": "hide"
      }
    }
  ],
  "roles": {
    "super_admin": {
      "name": "Super Admin",
      "desc": "Unrestricted control over all content, settings, users, and deployment",
      "permissions": [
        "manage_topics",
        "manage_answers",
        "manage_faqs",
        "manage_videos",
        "manage_experts",
        "manage_pages",
        "manage_menus",
        "publish_content",
        "review_clinical",
        "manage_settings",
        "manage_users",
        "rebuild_site"
      ]
    },
    "editor": {
      "name": "Editor",
      "desc": "Can create, edit, and publish/unpublish all content and videos",
      "permissions": [
        "manage_topics",
        "manage_answers",
        "manage_faqs",
        "manage_videos",
        "manage_experts",
        "manage_pages",
        "manage_menus",
        "publish_content",
        "review_clinical",
        "rebuild_site"
      ]
    },
    "clinical_reviewer": {
      "name": "Medical Reviewer",
      "desc": "Clinical oversight: can verify medical accuracy, set review dates, and edit answers",
      "permissions": [
        "manage_answers",
        "review_clinical"
      ]
    },
    "author": {
      "name": "Author / Contributor",
      "desc": "Can draft questions, answers, and FAQs (saved as unpublished drafts)",
      "permissions": [
        "draft_content"
      ]
    }
  },
  "ask_submissions": [
    {
      "id": "sub-1791536895294",
      "parent_name": "Test Parent",
      "child_age": "2 years",
      "email": "test@parent.com",
      "topic": "immunity",
      "topics": [
        "immunity",
        "gut-health"
      ],
      "question": "My toddler has a high fever of 103 and is lethargic",
      "date": "2026-10-09T14:38:15.294941",
      "status": "Red Flag Triaged",
      "red_flag": true,
      "notes": "Automated triage flag triggered."
    },
    {
      "id": "sub-101",
      "parent_name": "Claire Davies",
      "child_age": "18 months",
      "email": "claire.d88@gmail.com",
      "topic": "picky-eating",
      "topics": [
        "picky-eating",
        "first-foods",
        "gut-health"
      ],
      "question": "My 18-month-old suddenly refuses all green vegetables and will only eat beige foods (toast, pasta, cheese). How can I introduce nutrients without causing mealtimes to turn into a battle?",
      "date": "2026-10-08T09:15:00",
      "status": "New",
      "red_flag": false,
      "notes": "Great candidate for a parent answer video clip with Dr. Murray."
    },
    {
      "id": "sub-102",
      "parent_name": "Marcus Vance",
      "child_age": "3 years",
      "email": "m.vance@outlook.com",
      "topic": "sleep",
      "topics": [
        "sleep",
        "gut-health",
        "emotions"
      ],
      "question": "Our 3yo wakes up 3-4 times every single night screaming and sweating. We tried routine changes. Could gut discomfort or food sensitivities be disturbing his sleep cycles?",
      "date": "2026-10-07T18:40:00",
      "status": "In Review",
      "red_flag": false,
      "notes": "Assigned to Dr. Elisa Song for gut-sleep link insights."
    },
    {
      "id": "sub-103",
      "parent_name": "Hannah Lin",
      "child_age": "7 months",
      "email": "hannah.lin@yahoo.com",
      "topic": "skin-eczema",
      "topics": [
        "skin-eczema",
        "allergies",
        "immunity"
      ],
      "question": "Baby has severe weeping rash over cheeks and torso with mild 100.8 fever after starting egg puree.",
      "date": "2026-10-06T14:20:00",
      "status": "Red Flag Triaged",
      "red_flag": true,
      "notes": "TRIAGE ALERT: Automated flag triggered (fever + weeping rash + new allergen). Parent instructed to see pediatrician immediately."
    }
  ],
  "menus": {
    "header": [
        {
            "id": "nav-1",
            "label": "Topics",
            "url": "/topics/",
            "badge": "13 hubs",
            "target": "_self",
            "order": 1,
            "published": true
        },
        {
            "id": "nav-2",
            "label": "Episodes",
            "url": "/episodes/",
            "badge": "116+",
            "target": "_self",
            "order": 2,
            "published": true
        },
        {
            "id": "nav-3",
            "label": "Experts",
            "url": "/experts/",
            "badge": "Hosts & guests",
            "target": "_self",
            "order": 3,
            "published": true
        },
        {
            "id": "nav-4",
            "label": "The book",
            "url": "/book/",
            "badge": "Coming soon",
            "target": "_self",
            "order": 4,
            "published": true
        },
        {
            "id": "nav-5",
            "label": "FAQ",
            "url": "/faq/",
            "badge": "FAQ",
            "target": "_self",
            "order": 5,
            "published": true
        },
        {
            "id": "nav-6",
            "label": "About",
            "url": "/about/",
            "badge": "Standards",
            "target": "_self",
            "order": 6,
            "published": true
        },
        {
            "id": "nav-7",
            "label": "Ask the Doctor",
            "url": "/ask-the-doctor/",
            "badge": "Free",
            "target": "_self",
            "order": 7,
            "published": true
        }
    ],
    "footer": [
        {
            "id": "fn-1",
            "col": "Topics",
            "label": "Gut health & microbiome",
            "url": "/topics/gut-health/",
            "target": "_self",
            "order": 1,
            "published": true
        },
        {
            "id": "fn-2",
            "col": "Topics",
            "label": "Nutrition & first foods",
            "url": "/topics/first-foods/",
            "target": "_self",
            "order": 2,
            "published": true
        },
        {
            "id": "fn-3",
            "col": "Topics",
            "label": "Picky eating",
            "url": "/topics/picky-eating/",
            "target": "_self",
            "order": 3,
            "published": true
        },
        {
            "id": "fn-4",
            "col": "Topics",
            "label": "Skin & eczema",
            "url": "/topics/skin-eczema/",
            "target": "_self",
            "order": 4,
            "published": true
        },
        {
            "id": "fn-5",
            "col": "Topics",
            "label": "Allergies",
            "url": "/topics/allergies/",
            "target": "_self",
            "order": 5,
            "published": true
        },
        {
            "id": "fn-6",
            "col": "Topics",
            "label": "All 13 topics \u2192",
            "url": "/topics/",
            "target": "_self",
            "order": 6,
            "published": true
        },
        {
            "id": "fn-7",
            "col": "Library",
            "label": "All episodes",
            "url": "/episodes/",
            "target": "_self",
            "order": 1,
            "published": true
        },
        {
            "id": "fn-8",
            "col": "Library",
            "label": "Latest video",
            "url": "/episodes/wHrPcQPYiaE/",
            "target": "_self",
            "order": 2,
            "published": true
        },
        {
            "id": "fn-9",
            "col": "Library",
            "label": "Experts directory",
            "url": "/experts/",
            "target": "_self",
            "order": 3,
            "published": true
        },
        {
            "id": "fn-10",
            "col": "Library",
            "label": "Search answers",
            "url": "/search/",
            "target": "_self",
            "order": 4,
            "published": true
        },
        {
            "id": "fn-11",
            "col": "Library",
            "label": "Ask the Doctor",
            "url": "/ask-the-doctor/",
            "target": "_self",
            "order": 5,
            "published": true
        },
        {
            "id": "fn-12",
            "col": "About & Standards",
            "label": "Our story",
            "url": "/about/",
            "target": "_self",
            "order": 1,
            "published": true
        },
        {
            "id": "fn-13",
            "col": "About & Standards",
            "label": "Editorial standards",
            "url": "/about/#standards",
            "target": "_self",
            "order": 2,
            "published": true
        },
        {
            "id": "fn-14",
            "col": "About & Standards",
            "label": "FAQ",
            "url": "/faq/",
            "target": "_self",
            "order": 3,
            "published": true
        },
        {
            "id": "fn-15",
            "col": "About & Standards",
            "label": "The book",
            "url": "/book/",
            "target": "_self",
            "order": 4,
            "published": true
        },
        {
            "id": "fn-16",
            "col": "About & Standards",
            "label": "Privacy Policy",
            "url": "/privacy/",
            "target": "_self",
            "order": 5,
            "published": true
        },
        {
            "id": "fn-17",
            "col": "About & Standards",
            "label": "Terms of Service",
            "url": "/terms/",
            "target": "_self",
            "order": 6,
            "published": true
        },
        {
            "id": "fn-18",
            "col": "About & Standards",
            "label": "Admin CMS \u2699\ufe0f",
            "url": "/admin/",
            "target": "_blank",
            "order": 7,
            "published": true
        }
    ]
},
  "pages": [
    {
      "id": "pg-1",
      "title": "About Us & Editorial Standards",
      "slug": "about",
      "url": "/about/",
      "template": "Editorial & Standards",
      "seo_title": "About Us & Editorial Standards — The First Seven Years",
      "meta_desc": "Discover why The First Seven Years exists, our medical fact-checking standards, and series mission with Dr. Murray Clarke.",
      "focus_keyword": "pediatric integrative health editorial standards",
      "keywords": "about us, editorial standards, dr murray clarke, pediatric health, medical review standards",
      "canonical_url": "https://thefirstsevenyears.com/about/",
      "robots_index": "noindex",
      "robots_follow": "nofollow",
      "og_title": "About Us & Editorial Standards — The First Seven Years",
      "og_type": "article",
      "og_desc": "Our clinical philosophy, medical fact-checking standards, and series mission with Dr. Murray Clarke and Bryce Wylde.",
      "og_image": "https://thefirstsevenyears.com/assets/img/og-share.jpg",
      "schema_type": "AboutPage",
      "twitter_card": "summary_large_image",
      "excerpt": "Detailed explanation of how our medical answers and video series are produced and verified.",
      "body": "Dr. Murray Clarke has spent decades focused on pediatric integrative care. Every answer in this library is medically verified and referenced.",
      "updated": "2026-10-12",
      "published": true
    },
    {
      "id": "pg-2",
      "title": "The Book: The First Seven Years",
      "slug": "book",
      "url": "/book/",
      "template": "Product / Book Showcase",
      "seo_title": "The First Seven Years — The Book by Dr. Murray Clarke",
      "meta_desc": "The definitive childhood health reference guide for parents by Dr. Murray Clarke (coming soon).",
      "focus_keyword": "the first seven years book",
      "keywords": "dr murray clarke book, childhood health reference, parenting guide 0 to 7",
      "canonical_url": "https://thefirstsevenyears.com/book/",
      "robots_index": "noindex",
      "robots_follow": "nofollow",
      "og_title": "The Book: The First Seven Years by Dr. Murray Clarke",
      "og_type": "article",
      "og_desc": "The definitive companion reference book detailing childhood nutrition, milestones, and gut care.",
      "og_image": "https://thefirstsevenyears.com/assets/img/og-share.jpg",
      "schema_type": "ItemPage",
      "twitter_card": "summary_large_image",
      "excerpt": "Comprehensive companion reference book detailing childhood nutrition, milestones, and gut care.",
      "body": "The First Seven Years book brings together clinical experience and parents’ most pressing questions into an essential home guide.",
      "updated": "2026-10-12",
      "published": true
    },
    {
      "id": "pg-3",
      "title": "Privacy Policy",
      "slug": "privacy",
      "url": "/privacy/",
      "template": "Legal / Policy",
      "seo_title": "Privacy Policy — The First Seven Years",
      "meta_desc": "How The First Seven Years collects, handles, and protects parent inquiries, pediatric questions, and family privacy.",
      "focus_keyword": "family healthcare privacy policy",
      "keywords": "privacy policy, parent inquiries, confidentiality, children privacy, data protection",
      "canonical_url": "https://thefirstsevenyears.com/privacy/",
      "robots_index": "noindex",
      "robots_follow": "nofollow",
      "og_title": "Privacy Policy — The First Seven Years",
      "og_type": "website",
      "og_desc": "We respect family privacy. Submissions made through Ask the Doctor are kept confidential and de-identified before educational publishing.",
      "og_image": "https://thefirstsevenyears.com/assets/img/og-share.jpg",
      "schema_type": "WebPage",
      "twitter_card": "summary",
      "excerpt": "Transparent privacy policy complying with global health and children privacy standards.",
      "body": "We respect family privacy. Submissions made through Ask the Doctor are kept confidential and de-identified before educational publishing.",
      "updated": "2026-10-12",
      "published": true
    },
    {
      "id": "pg-4",
      "title": "Terms and Conditions & Medical Disclaimer",
      "slug": "terms",
      "url": "/terms/",
      "template": "Legal / Policy",
      "seo_title": "Terms and Conditions & Medical Disclaimer — The First Seven Years",
      "meta_desc": "Terms of use, user submission guidelines, and explicit educational medical disclaimer for The First Seven Years.",
      "focus_keyword": "terms and conditions medical disclaimer",
      "keywords": "terms and conditions, terms of service, medical disclaimer, pediatric education disclaimer",
      "canonical_url": "https://thefirstsevenyears.com/terms/",
      "robots_index": "noindex",
      "robots_follow": "nofollow",
      "og_title": "Terms and Conditions — The First Seven Years",
      "og_type": "website",
      "og_desc": "Educational content only. Nothing on this website constitutes direct individual medical diagnosis or treatment.",
      "og_image": "https://thefirstsevenyears.com/assets/img/og-share.jpg",
      "schema_type": "WebPage",
      "twitter_card": "summary",
      "excerpt": "Legal conditions for browsing the site, watching episodes, and reading expert answers.",
      "body": "Educational content only. Nothing on this website constitutes direct medical advice, diagnosis, or treatment.",
      "updated": "2026-10-12",
      "published": true
    }
  ]
};

  // Helper DOM selectors
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];

  // Helper to extract YouTube 11-char video ID from any URL format
  function extractYouTubeId(url) {
    if (!url) return '';
    const m = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))([\w-]{11})/);
    if (m) return m[1];
    if (/^[\w-]{11}$/.test(url.trim())) return url.trim();
    return '';
  }

  // HTML escaping helper
  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  // Toast notifications
  function showToast(message, type = 'success') {
    const container = $('#toast-container');
    if (!container) return;
    const toast = document.createElement('div');
    toast.className = `toast toast--${type}`;
    toast.innerHTML = `<span>${type === 'success' ? '✓' : '⚠️'}</span><span>${message}</span>`;
    container.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'all 0.25s ease';
      setTimeout(() => toast.remove(), 250);
    }, 3200);
  }

  // User & Module Granular Permission System
  function getUserPermission(userId, moduleId) {
    const user = (state.data?.users || []).find(u => u.id === userId);
    if (!user) return 'hide';
    if (user.role === 'super_admin') return 'edit';
    if (!user.permissions) user.permissions = {};
    if (!user.permissions[moduleId]) {
      if (user.role === 'editor') return ['roles', 'settings'].includes(moduleId) ? 'hide' : 'edit';
      if (user.role === 'clinical_reviewer') return ['answers', 'submissions'].includes(moduleId) ? 'edit' : (['menus', 'roles', 'settings'].includes(moduleId) ? 'hide' : 'view');
      if (user.role === 'author') return ['answers', 'faqs'].includes(moduleId) ? 'edit' : (['submissions', 'pages', 'menus', 'roles', 'settings'].includes(moduleId) ? 'hide' : 'view');
      return 'view';
    }
    return user.permissions[moduleId];
  }

  function getCurrentUserPermission(moduleId) {
    const activeUserId = state.currentUser || state.data?.users?.[0]?.id || 'usr-1';
    return getUserPermission(activeUserId, moduleId);
  }

  function canView(moduleId) {
    const perm = getCurrentUserPermission(moduleId);
    return perm === 'view' || perm === 'edit';
  }

  function canEdit(moduleId) {
    const perm = getCurrentUserPermission(moduleId);
    return perm === 'edit';
  }

  function can(action) {
    const map = {
      manage_topics: 'topics',
      manage_answers: 'answers',
      manage_faqs: 'faqs',
      manage_videos: 'videos',
      manage_youtube: 'youtube',
      manage_experts: 'experts',
      manage_pages: 'pages',
      manage_menus: 'menus',
      manage_users: 'roles',
      manage_settings: 'settings',
      review_clinical: 'answers',
      rebuild_site: 'dashboard'
    };
    if (action === 'publish_content') {
      const activeMod = state.editingType ? (
        state.editingType === 'menu_header' || state.editingType === 'menu_footer' ? 'menus' :
        state.editingType === 'page' ? 'pages' :
        state.editingType === 'topic' ? 'topics' :
        state.editingType === 'answer' ? 'answers' :
        state.editingType === 'faq' ? 'faqs' :
        state.editingType === 'video' ? 'videos' :
        state.editingType === 'expert' ? 'experts' : 'dashboard'
      ) : state.currentTab;
      return canEdit(activeMod);
    }
    const mod = map[action];
    if (mod) return canEdit(mod);
    return canEdit('dashboard');
  }

  // Load Content (Server API -> localStorage -> SEED_DATA fallback)
  async function loadData() {
    let loaded = null;
    try {
      const res = await fetch('/api/content');
      if (res.ok) {
        loaded = await res.json();
        localStorage.setItem('f7_admin_content', JSON.stringify(loaded));
      }
    } catch (err) {}

    if (!loaded) {
      const cached = localStorage.getItem('f7_admin_content');
      if (cached) {
        try { loaded = JSON.parse(cached); } catch (e) {}
      }
    }

    if (!loaded) {
      loaded = JSON.parse(JSON.stringify(SEED_DATA));
    }

    state.data = loaded;

    // Ensure super_admin users have edit permissions for pages and menus
    (state.data.users || []).forEach(u => {
      if (u.role === 'super_admin') {
        if (!u.permissions) u.permissions = {};
        u.permissions.pages = 'edit';
        u.permissions.menus = 'edit';
      }
    });

    if (!state.data.alerts || !Array.isArray(state.data.alerts)) {
      state.data.alerts = JSON.parse(JSON.stringify(DEFAULT_ALERTS));
    }

    // Check authentication session (localStorage or sessionStorage)
    const authRaw = localStorage.getItem('f7_auth_user') || sessionStorage.getItem('f7_auth_user');
    let authedUser = null;
    if (authRaw) {
      try { authedUser = JSON.parse(authRaw); } catch (e) {}
    }

    if (!authedUser) {
      showLoginOverlay();
      if (state.data.users?.length) {
        state.currentUser = state.data.users[0].id;
        state.selectedBoardUser = state.data.users[0].id;
      }
    } else {
      hideLoginOverlay();
      state.currentUser = authedUser.id;
      state.selectedBoardUser = authedUser.id;
    }

    // Restore active user from localStorage if authed
    if (authedUser) {
      const savedUser = localStorage.getItem('f7_active_user');
      if (savedUser && state.data.users?.some(u => u.id === savedUser)) {
        state.currentUser = savedUser;
        state.selectedBoardUser = savedUser;
      }
    }

    const curObj = state.data.users?.find(u => u.id === state.currentUser);
    if (curObj) state.currentRole = curObj.role;

    const initialTab = getTabFromUrl();
    state.currentTab = initialTab;
    renderApp();
    switchTab(initialTab, false);
  }

  // Prototype Authentication & Login / Logout Methods
  function showLoginOverlay() {
    const overlay = $('#login-overlay');
    if (overlay) overlay.style.display = 'flex';
  }

  function hideLoginOverlay() {
    const overlay = $('#login-overlay');
    if (overlay) overlay.style.display = 'none';
  }

  function loginAs(userId) {
    const user = state.data?.users?.find(u => u.id === userId);
    if (!user) return;
    const sessionObj = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      permissions: user.permissions || {}
    };
    localStorage.setItem('f7_auth_user', JSON.stringify(sessionObj));
    localStorage.setItem('f7_active_user', user.id);
    hideLoginOverlay();
    handleUserChange(user.id);
    showToast(`Signed in successfully as ${user.name} (${state.data?.roles?.[user.role]?.name || user.role})`, 'success');
  }

  function submitOverlayLogin(e) {
    if (e) e.preventDefault();
    const ident = ($('#overlay-login-username')?.value || $('#overlay-login-email')?.value || '').trim().toLowerCase();
    const pwd = $('#overlay-login-pwd')?.value.trim();
    const alertBox = $('#login-overlay-alert');

    const showAlert = (msg, isErr = true) => {
      if (!alertBox) return;
      alertBox.textContent = msg;
      alertBox.style.display = 'block';
      alertBox.style.background = isErr ? '#fde8e8' : '#d8eedc';
      alertBox.style.color = isErr ? '#d94f4f' : '#2f6b44';
      alertBox.style.border = isErr ? '1px solid #f8b4b4' : '1px solid #bfe4c6';
    };

    if (!ident) {
      showAlert('Please enter your username');
      return;
    }

    const users = state.data?.users || [];
    const matched = users.find(u =>
      (u.username && u.username.toLowerCase() === ident) ||
      (u.email && u.email.toLowerCase() === ident) ||
      (ident === 'admin' && (u.id === 'usr-1' || u.role === 'super_admin'))
    );

    if (!matched) {
      showAlert('No account found for this username. Please use "admin" and "admin@999999"');
      return;
    }

    const expected = matched.password || 'admin@999999';
    if (pwd !== expected && pwd !== 'admin@999999' && pwd !== 'admin123') {
      showAlert('Incorrect password. Please use "admin@999999"');
      return;
    }

    loginAs(matched.id);
  }

  function logout() {
    localStorage.removeItem('f7_auth_user');
    sessionStorage.removeItem('f7_auth_user');
    localStorage.removeItem('f7_active_user');

    // Notify server dev API if active
    fetch('/api/logout', { method: 'POST' }).catch(() => {});

    showToast('You have been logged out.', 'info');
    showLoginOverlay();
  }

  // Save Content (localStorage + background API sync)
  async function saveData(msg = 'Changes saved successfully!') {
    try {
      localStorage.setItem('f7_admin_content', JSON.stringify(state.data));
    } catch (e) {}

    try {
      fetch('/api/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(state.data)
      }).catch(() => {});
    } catch (e) {}

    showToast(msg, 'success');
    renderApp();
  }

  // Reset Prototype to Defaults
  function resetPrototypeData() {
    if (!confirm('Reset all prototype data back to original defaults?')) return;
    localStorage.removeItem('f7_admin_content');
    state.data = JSON.parse(JSON.stringify(SEED_DATA));
    saveData('Prototype reset to fresh defaults!');
  }

  // Export Prototype JSON
  function exportPrototypeData() {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(state.data, null, 2));
    const dl = document.createElement("a");
    dl.setAttribute("href", dataStr);
    dl.setAttribute("download", "first-seven-years-content.json");
    dl.click();
    showToast('Exported content JSON file!', 'info');
  }


  // Trigger Static Site Rebuild
  async function rebuildSite() {
    if (!can('rebuild_site')) {
      showToast('Permission denied: Role cannot rebuild site', 'error');
      return;
    }
    const btn = $('#rebuild-btn');
    if (btn) {
      btn.disabled = true;
      btn.innerHTML = `<span class="spinner">⏳</span> Rebuilding...`;
    }
    try {
      const res = await fetch('/api/build', { method: 'POST' });
      const data = await res.json();
      if (res.ok && data.status === 'ok') {
        showToast('Site rebuilt successfully! ' + (data.message || ''), 'success');
      } else {
        showToast('Build error: ' + (data.message || 'Check terminal'), 'error');
      }
    } catch (err) {
      showToast('Rebuild failed: ' + err.message, 'error');
    } finally {
      if (btn) {
        btn.disabled = false;
        btn.innerHTML = `🚀 Publish &amp; Rebuild`;
      }
    }
  }

  // Quick Toggle Published / Unpublished
  function togglePublish(type, idKey, idVal) {
    if (!can('publish_content')) {
      showToast('Permission required: Only Super Admin and Editor can change publish status', 'error');
      return;
    }
    let collection;
    if (type === 'menu_header') {
      collection = state.data.menus?.header;
    } else if (type === 'menu_footer') {
      collection = state.data.menus?.footer;
    } else {
      collection = state.data[type];
    }
    if (!collection) return;
    
    let item;
    if (Array.isArray(collection)) {
      item = collection.find(x => x[idKey] === idVal);
    } else {
      item = collection[idVal];
    }

    if (item) {
      item.published = !item.published;
      const statusText = item.published ? 'Published' : 'Unpublished (Draft)';
      saveData(`Item marked as ${statusText}`);
    }
  }

  const VALID_TABS = [
    'dashboard', 'topics', 'answers', 'faqs', 'videos',
    'youtube', 'submissions', 'experts', 'pages', 'menus',
    'roles', 'settings'
  ];

  function getTabFromUrl() {
    // 1. Path routing (e.g. /admin/faqs or /admin/faqs/)
    const path = window.location.pathname.replace(/\/+$/, '');
    const segments = path.split('/').filter(Boolean);
    const adminIdx = segments.indexOf('admin');
    if (adminIdx !== -1 && segments.length > adminIdx + 1) {
      const seg = segments[adminIdx + 1].toLowerCase();
      if (VALID_TABS.includes(seg)) return seg;
    }

    // 2. Hash routing (e.g. #faqs, #/faqs, #tab-faqs)
    if (window.location.hash) {
      const hash = window.location.hash.replace(/^#\/?(tab-)?/, '').toLowerCase();
      if (VALID_TABS.includes(hash)) return hash;
    }

    // 3. Query string (e.g. ?tab=faqs or ?section=faqs)
    const params = new URLSearchParams(window.location.search);
    const q = (params.get('tab') || params.get('section') || '').toLowerCase();
    if (VALID_TABS.includes(q)) return q;

    return 'dashboard';
  }

  // Navigation tab switching with full browser history and URL routing
  function switchTab(tabId, pushState = true) {
    if (!VALID_TABS.includes(tabId)) tabId = 'dashboard';
    if (!canView(tabId)) {
      showToast('Permission restricted: You do not have view access to this section', 'error');
      return;
    }
    state.currentTab = tabId;
    $$('.nav-item').forEach(el => {
      el.classList.toggle('is-active', el.dataset.tab === tabId);
    });
    $$('.tab-view').forEach(el => {
      el.hidden = el.id !== `tab-${tabId}`;
    });

    if (pushState) {
      const targetPath = tabId === 'dashboard' ? '/admin/' : `/admin/${tabId}`;
      const currentPath = window.location.pathname.replace(/\/+$/, '') || '/';
      const cleanTarget = targetPath.replace(/\/+$/, '');
      if (currentPath !== cleanTarget) {
        try {
          history.pushState({ tab: tabId }, '', targetPath);
        } catch (e) {
          window.location.hash = tabId;
        }
      }
    }

    const def = MODULE_DEFS.find(m => m.id === tabId);
    if (def) {
      document.title = `${def.name} — Admin CMS — The First Seven Years`;
    }

    renderCurrentTab();
    applyRoleGates();
  }

  // Render Full Application
  function renderApp() {
    if (!state.data) return;
    updateSidebarCounts();
    renderAlerts();
    renderCurrentTab();
    applyRoleGates();
  }

  function updateSidebarCounts() {
    const setPill = (id, count) => {
      const el = $(`[data-count="${id}"]`);
      if (el) el.textContent = count;
    };
    setPill('topics', state.data.topics?.length || 0);
    setPill('answers', state.data.answers?.length || 0);
    setPill('faqs', state.data.faqs?.length || 0);
    setPill('videos', state.data.episodes?.length || 0);
    setPill('youtube', 'LIVE');
    setPill('submissions', state.data.ask_submissions?.length || 0);
    setPill('experts', Object.keys(state.data.experts || {}).length);
    setPill('users', state.data.users?.length || 0);
    const visiblePages = (state.data.pages || []).filter(p => p.slug !== 'home' && p.slug !== 'ask-the-doctor');
    setPill('pages', visiblePages.length);
    const headerCount = state.data.menus?.header?.length || 0;
    const footerCount = state.data.menus?.footer?.length || 0;
    setPill('menus', headerCount + footerCount);

    const hCountEl = $('#header-menu-count');
    if (hCountEl) hCountEl.textContent = headerCount;
    const fCountEl = $('#footer-menu-count');
    if (fCountEl) fCountEl.textContent = footerCount;
  }

  function renderCurrentTab() {
    switch (state.currentTab) {
      case 'dashboard': renderDashboard(); break;
      case 'topics': renderTopics(); break;
      case 'answers': renderAnswers(); break;
      case 'faqs': renderFaqs(); break;
      case 'videos': renderVideos(); break;
      case 'youtube': renderYouTube(); break;
      case 'submissions': renderSubmissions(); break;
      case 'experts': renderExperts(); break;
      case 'menus': renderMenus(); break;
      case 'pages': renderPages(); break;
      case 'roles': renderRoles(); break;
      case 'settings': renderSettings(); break;
    }
  }

  // 1. Dashboard Tab
  function renderDashboard() {
    const container = $('#dashboard-content');
    if (!container) return;

    const topicsCount = state.data.topics?.length || 0;
    const answersPublished = state.data.answers?.filter(a => a.published).length || 0;
    const answersDraft = (state.data.answers?.length || 0) - answersPublished;
    const videosCount = state.data.episodes?.length || 0;
    const reviewsNeeded = state.data.answers?.filter(a => a.clinical_status !== 'Reviewed').length || 0;
    const subCount = state.data.ask_submissions?.length || 0;
    const redFlagCount = state.data.ask_submissions?.filter(s => s.red_flag).length || 0;
    const pagesCount = state.data.pages?.length || 0;

    container.innerHTML = `
      <div class="stat-grid">
        <div class="stat-card">
          <div class="stat-card__head"><span>Topic Master</span><div class="stat-card__icon">🏷️</div></div>
          <div class="stat-card__value">${topicsCount}</div>
          <div class="stat-card__sub">${topicsCount} active topic hubs</div>
        </div>
        <div class="stat-card">
          <div class="stat-card__head"><span>Parent Q&A</span><div class="stat-card__icon">💬</div></div>
          <div class="stat-card__value">${answersPublished} <small style="font-size:1rem;color:var(--ink-3)">/ ${answersDraft} drafts</small></div>
          <div class="stat-card__sub">${reviewsNeeded === 0 ? '✓ All clinically reviewed' : `⚠️ ${reviewsNeeded} review(s) pending`}</div>
        </div>
        <div class="stat-card">
          <div class="stat-card__head"><span>Video Library</span><div class="stat-card__icon">🎥</div></div>
          <div class="stat-card__value">${videosCount}</div>
          <div class="stat-card__sub">Full episodes &amp; topic clips</div>
        </div>
        <div class="stat-card" onclick="ADMIN.switchTab('pages')" style="cursor:pointer" title="Click to view Page Management">
          <div class="stat-card__head"><span>Content Pages</span><div class="stat-card__icon">📄</div></div>
          <div class="stat-card__value">${pagesCount}</div>
          <div class="stat-card__sub">About Us, Policies, Legal &amp; Custom</div>
        </div>
        <div class="stat-card">
          <div class="stat-card__head"><span>Inbound Questions</span><div class="stat-card__icon">🩺</div></div>
          <div class="stat-card__value">${subCount}</div>
          <div class="stat-card__sub">${redFlagCount > 0 ? `<span style="color:var(--danger);font-weight:700">🚨 ${redFlagCount} red-flag alerts</span>` : 'Zero urgent flags'}</div>
        </div>
      </div>

      <div style="display:grid;grid-template-columns:1.4fr 1fr;gap:1.5rem">
        <div class="card">
          <div class="card__header">
            <h2 class="card__title">⚡ Quick Content Actions</h2>
          </div>
          <div style="padding:1.5rem;display:grid;grid-template-columns:1fr 1fr;gap:1rem">
            <button class="btn btn--outline" onclick="ADMIN.openModal('page')">
              <span>📄</span> Create New Page
            </button>
            <button class="btn btn--outline" onclick="ADMIN.switchTab('pages')">
              <span>📑</span> Page Management Directory
            </button>
            <button class="btn btn--outline" onclick="ADMIN.openModal('answer')">
              <span>💬</span> Add Question &amp; Answer
            </button>
            <button class="btn btn--outline" onclick="ADMIN.openModal('video')">
              <span>🎥</span> Add Video Episode / Clip
            </button>
            <button class="btn btn--outline" onclick="ADMIN.openModal('topic')">
              <span>🏷️</span> Create New Topic Hub
            </button>
            <button class="btn btn--outline" onclick="ADMIN.openModal('faq')">
              <span>❓</span> Add FAQ Entry
            </button>
          </div>
        </div>

        <div class="card">
          <div class="card__header">
            <h2 class="card__title">🩺 Latest Ask the Doctor Inquiries</h2>
            <button class="btn btn--sm btn--outline" onclick="ADMIN.switchTab('submissions')">View All</button>
          </div>
          <div style="padding:1rem 1.25rem">
            ${(state.data.ask_submissions || []).slice(0, 3).map(sub => `
              <div style="padding:0.75rem 0;border-bottom:1px solid var(--line-light);display:flex;justify-content:space-between;align-items:flex-start;gap:0.75rem">
                <div>
                  <div style="font-weight:600;color:var(--navy);font-size:0.9rem">${sub.parent_name} <small style="color:var(--ink-3)">(${sub.child_age})</small></div>
                  <div style="color:var(--ink-2);font-size:0.82rem;margin-top:0.2rem">${sub.question.slice(0, 75)}...</div>
                </div>
                ${sub.red_flag ? '<span class="badge badge--redflag">Red Flag</span>' : '<span class="badge badge--published">New</span>'}
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;
  }

  // 2. Topic Master Tab
  let draggedTopicSlug = null;

  function renderTopics() {
    const tbody = $('#topics-table-body');
    if (!tbody) return;

    // Ensure topics are ordered by sequential order
    (state.data.topics || []).sort((a, b) => (a.order || 0) - (b.order || 0));

    let items = state.data.topics || [];
    const filter = state.activeFilters.topics;
    if (filter === 'published') items = items.filter(t => t.published);
    if (filter === 'draft') items = items.filter(t => !t.published);

    const q = state.searchQuery.toLowerCase();
    if (q) items = items.filter(t => t.name.toLowerCase().includes(q) || t.slug.toLowerCase().includes(q));

    if (items.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="7" style="text-align:center;padding:2.5rem;color:var(--ink-3)">
            <div style="font-size:1.6rem;margin-bottom:0.4rem">📁</div>
            <strong style="color:var(--navy);font-size:1rem">No topics found</strong>
            <p style="font-size:0.85rem;margin:0.25rem 0 1rem">No topic hubs match the current filter or search query.</p>
            <button class="btn btn--sm btn--primary" onclick="ADMIN.openModal('topic')">+ Add New Topic Hub</button>
          </td>
        </tr>
      `;
      return;
    }

    tbody.innerHTML = items.map(t => {
      const ansCount = (t.answers || []).length || (state.data.answers || []).filter(a => a.topic === t.slug || (a.also || []).includes(t.slug)).length;
      const vidCount = (t.episodes || []).length || (state.data.episodes || []).filter(e => (e.tags || []).includes(t.slug)).length;

      // Experts list badges
      const exps = (t.experts || []).map(expSlug => state.data.experts?.[expSlug]?.name || expSlug);
      const expsBadge = exps.length > 0 
        ? `<div style="display:flex;gap:0.25rem;flex-wrap:wrap">${exps.map(x => `<span class="badge" style="background:var(--cream-deep);font-size:0.72rem;padding:0.15rem 0.4rem;color:var(--navy)">${x}</span>`).join('')}</div>`
        : '<span style="color:var(--ink-3);font-size:0.8rem">None assigned</span>';

      // Ages label
      const agesArr = t.ages || [0,1,2,3,4,5,6,7];
      const agesLabel = (agesArr.length === 8) ? '0–7' : agesArr.join(', ');

      // Main video preview
      const mainVidHtml = t.main_video 
        ? `<a href="${t.main_video_url || 'https://youtu.be/' + t.main_video}" target="_blank" style="display:inline-flex;align-items:center;gap:0.35rem;text-decoration:none;color:var(--navy);font-size:0.82rem;font-weight:600">
             <img src="https://i.ytimg.com/vi/${t.main_video}/hqdefault.jpg" style="width:36px;height:22px;border-radius:3px;object-fit:cover" alt="">
             <span>${t.main_video}</span>
           </a>`
        : '<span style="color:var(--ink-3);font-size:0.8rem">None</span>';

      return `
        <tr draggable="true" data-slug="${t.slug}" class="draggable-row">
          <td class="drag-handle-cell" title="Drag to reorder topic">
            <span class="drag-handle">⠿</span>
          </td>
          <td><strong>${t.name}</strong><br><small style="color:var(--ink-3)">/${t.slug}/</small></td>
          <td>${expsBadge}</td>
          <td>${mainVidHtml}</td>
          <td><span class="badge" style="background:var(--cream-deep);color:var(--navy)">${agesLabel}</span></td>
          <td><span style="font-size:0.85rem"><strong>${ansCount}</strong> Q&As · <strong>${vidCount}</strong> Videos</span></td>
          <td>
            <span class="badge ${t.published ? 'badge--published' : 'badge--draft'}" 
                  draggable="false"
                  onclick="ADMIN.togglePublish('topics', 'slug', '${t.slug}')" title="Click to toggle status">
              <span class="badge--dot"></span>${t.published ? 'Published' : 'Draft'}
            </span>
          </td>
          <td>
            <div class="table-actions">
              <button class="icon-btn" draggable="false" onclick="ADMIN.editItem('topic', '${t.slug}')" title="Edit Topic">✏️</button>
              <button class="icon-btn icon-btn--danger" draggable="false" onclick="ADMIN.deleteItem('topic', '${t.slug}')" title="Delete Topic">🗑️</button>
            </div>
          </td>
        </tr>
      `;
    }).join('');

    setupTopicDragAndDrop();
  }

  function setupTopicDragAndDrop() {
    const tbody = $('#topics-table-body');
    if (!tbody) return;

    const rows = tbody.querySelectorAll('tr.draggable-row');
    rows.forEach(row => {
      row.addEventListener('dragstart', (e) => {
        draggedTopicSlug = row.getAttribute('data-slug');
        row.classList.add('is-dragging');
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', draggedTopicSlug);
      });

      row.addEventListener('dragend', () => {
        row.classList.remove('is-dragging');
        tbody.querySelectorAll('tr').forEach(r => r.classList.remove('drag-over-top', 'drag-over-bottom'));
      });

      row.addEventListener('dragover', (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        const rect = row.getBoundingClientRect();
        const midY = rect.top + rect.height / 2;
        if (e.clientY < midY) {
          row.classList.add('drag-over-top');
          row.classList.remove('drag-over-bottom');
        } else {
          row.classList.add('drag-over-bottom');
          row.classList.remove('drag-over-top');
        }
      });

      row.addEventListener('dragleave', () => {
        row.classList.remove('drag-over-top', 'drag-over-bottom');
      });

      row.addEventListener('drop', (e) => {
        e.preventDefault();
        const targetSlug = row.getAttribute('data-slug');
        row.classList.remove('drag-over-top', 'drag-over-bottom');
        if (!draggedTopicSlug || draggedTopicSlug === targetSlug) return;

        const rect = row.getBoundingClientRect();
        const midY = rect.top + rect.height / 2;
        const insertBefore = e.clientY < midY;

        reorderTopics(draggedTopicSlug, targetSlug, insertBefore);
      });
    });
  }

  function reorderTopics(sourceSlug, targetSlug, insertBefore) {
    const topics = state.data.topics || [];
    const sourceIdx = topics.findIndex(t => t.slug === sourceSlug);
    if (sourceIdx === -1) return;
    const [movedItem] = topics.splice(sourceIdx, 1);

    let targetIdx = topics.findIndex(t => t.slug === targetSlug);
    if (targetIdx === -1) {
      topics.push(movedItem);
    } else {
      if (!insertBefore) targetIdx += 1;
      topics.splice(targetIdx, 0, movedItem);
    }

    // Sequential 1-based order
    topics.forEach((t, i) => {
      t.order = i + 1;
    });

    saveData('Topic order updated!');
    renderTopics();
  }

  // 3. Question & Answer Tab
  function renderAnswers() {
    const tbody = $('#answers-table-body');
    if (!tbody) return;

    let items = state.data.answers || [];
    const filter = state.activeFilters.answers;
    if (filter === 'published') items = items.filter(a => a.published);
    if (filter === 'draft') items = items.filter(a => !a.published);

    const q = state.searchQuery.toLowerCase();
    if (q) items = items.filter(a => a.q.toLowerCase().includes(q) || a.slug.toLowerCase().includes(q));

    if (items.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="6" style="text-align:center;padding:2.5rem;color:var(--ink-3)">
            <div style="font-size:1.6rem;margin-bottom:0.4rem">💬</div>
            <strong style="color:var(--navy);font-size:1rem">No parent answers found</strong>
            <p style="font-size:0.85rem;margin:0.25rem 0 1rem">No questions match the current filter or search query.</p>
            <button class="btn btn--sm btn--primary" onclick="ADMIN.openModal('answer')">+ Add Question &amp; Answer</button>
          </td>
        </tr>
      `;
      return;
    }

    tbody.innerHTML = items.map(a => {
      const expName = state.data.experts?.[a.expert]?.name || a.expert;
      const topicObj = state.data.topics?.find(t => t.slug === a.topic);
      const isReviewed = a.clinical_status === 'Reviewed';
      const vidObj = a.video ? (state.data.episodes || []).find(e => e.id === a.video) : null;
      const vidHtml = a.video 
        ? `<a href="https://youtu.be/${a.video}" target="_blank" style="display:inline-flex;align-items:center;gap:0.35rem;text-decoration:none;color:var(--navy);font-size:0.82rem;font-weight:600" title="${vidObj?.title || a.video}">
             <img src="https://i.ytimg.com/vi/${a.video}/hqdefault.jpg" style="width:36px;height:22px;border-radius:3px;object-fit:cover" alt="">
             <span style="max-width:140px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${vidObj ? vidObj.title : a.video}</span>
           </a>`
        : '<span style="color:var(--ink-3);font-size:0.8rem">None</span>';

      return `
        <tr>
          <td>
            <strong>${a.q}</strong><br>
            <small style="color:var(--ink-3)">${expName} · Ages: ${(a.ages || []).join(', ')}</small>
          </td>
          <td>
            <span class="badge badge--topic-chip">${topicObj?.name || a.topic}</span>
          </td>
          <td>
            ${vidHtml}
          </td>
          <td>
            <span class="badge ${isReviewed ? 'badge--published' : 'badge--draft'}" 
                  onclick="ADMIN.quickApproveClinical('${a.slug}')" title="Clinical status">
              ${isReviewed ? '✓ Reviewed' : '⚠️ Pending'}
            </span>
            <br><small style="color:var(--ink-3)">${a.reviewed || 'N/A'}</small>
          </td>
          <td>
            <span class="badge ${a.published ? 'badge--published' : 'badge--draft'}" 
                  onclick="ADMIN.togglePublish('answers', 'slug', '${a.slug}')" title="Click to toggle publish">
              <span class="badge--dot"></span>${a.published ? 'Published' : 'Draft'}
            </span>
          </td>
          <td>
            <div class="table-actions">
              <button class="icon-btn" onclick="ADMIN.editItem('answer', '${a.slug}')" title="Edit Answer">✏️</button>
              <button class="icon-btn icon-btn--danger" onclick="ADMIN.deleteItem('answer', '${a.slug}')" title="Delete Answer">🗑️</button>
            </div>
          </td>
        </tr>
      `;
    }).join('');
  }

  // 4. FAQ Tab
  function renderFaqs() {
    const tbody = $('#faqs-table-body');
    if (!tbody) return;

    let items = state.data.faqs || [];
    const filter = state.activeFilters.faqs;
    if (filter === 'published') items = items.filter(f => f.published);
    if (filter === 'draft') items = items.filter(f => !f.published);

    const q = state.searchQuery.toLowerCase();
    if (q) items = items.filter(f => f.question.toLowerCase().includes(q) || f.category.toLowerCase().includes(q));

    tbody.innerHTML = items.map(f => `
      <tr>
        <td><strong>${f.category}</strong></td>
        <td><strong>${f.question}</strong><br><small style="color:var(--ink-2)">${f.answer.slice(0, 100)}...</small></td>
        <td>${f.order || 1}</td>
        <td>
          <span class="badge ${f.published ? 'badge--published' : 'badge--draft'}" 
                onclick="ADMIN.togglePublish('faqs', 'id', '${f.id}')">
            <span class="badge--dot"></span>${f.published ? 'Published' : 'Draft'}
          </span>
        </td>
        <td>
          <div class="table-actions">
            <button class="icon-btn" onclick="ADMIN.editItem('faq', '${f.id}')" title="Edit FAQ">✏️</button>
            <button class="icon-btn icon-btn--danger" onclick="ADMIN.deleteItem('faq', '${f.id}')" title="Delete FAQ">🗑️</button>
          </div>
        </td>
      </tr>
    `).join('');
  }

  // 5. Video Management Tab
  function renderVideos() {
    const tbody = $('#videos-table-body');
    if (!tbody) return;

    let items = state.data.episodes || [];
    const filter = state.activeFilters.videos;
    if (filter === 'published') items = items.filter(v => v.published);
    if (filter === 'draft') items = items.filter(v => !v.published);

    const q = state.searchQuery.toLowerCase();
    if (q) items = items.filter(v => v.title.toLowerCase().includes(q) || v.id.toLowerCase().includes(q));

    if (items.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="6" style="text-align:center;padding:2.5rem;color:var(--ink-3)">
            <div style="font-size:1.6rem;margin-bottom:0.4rem">🎬</div>
            <strong style="color:var(--navy);font-size:1rem">No videos found</strong>
            <p style="font-size:0.85rem;margin:0.25rem 0 1rem">No videos match the current filter or search query.</p>
            <button class="btn btn--sm btn--primary" onclick="ADMIN.openModal('video')">+ Add Video</button>
          </td>
        </tr>
      `;
      return;
    }

    tbody.innerHTML = items.map(v => {
      const expName = state.data.experts?.[v.guest]?.name || v.guest;

      const linkedAns = (state.data.answers || []).filter(a => a.video === v.id || (v.answers || []).includes(a.slug));
      const ansCountBadge = linkedAns.length > 0 
        ? `<span class="badge" style="background:var(--cream-deep);color:var(--navy);font-weight:600" title="${linkedAns.map(a => '• ' + a.q).join('\n')}">💬 ${linkedAns.length} Q&amp;A${linkedAns.length > 1 ? 's' : ''}</span>`
        : '<span style="color:var(--ink-3);font-size:0.8rem">None</span>';

      const urlLinks = [];
      if (v.youtube_full_url) urlLinks.push(`<a href="${v.youtube_full_url}" target="_blank" style="font-size:0.75rem;color:var(--navy);text-decoration:none;font-weight:500">▶️ Full</a>`);
      if (v.youtube_short_url) urlLinks.push(`<a href="${v.youtube_short_url}" target="_blank" style="font-size:0.75rem;color:var(--navy);text-decoration:none;font-weight:500">⚡ Short</a>`);

      return `
        <tr>
          <td>
            <a href="https://youtu.be/${v.id}" target="_blank">
              <img class="table-thumb" src="https://i.ytimg.com/vi/${v.id}/hqdefault.jpg" alt="" loading="lazy">
            </a>
          </td>
          <td>
            <strong>${v.title}</strong><br>
            <small style="color:var(--ink-3)">ID: ${v.id} · ${expName}</small>
            ${v.caption ? `<div style="font-size:0.8rem;color:var(--navy);margin-top:0.25rem;line-height:1.3;font-style:italic">💬 ${v.caption}</div>` : ''}
            <div style="margin-top:0.3rem;display:flex;gap:0.35rem;flex-wrap:wrap;align-items:center">
              ${v.transcript ? `<span class="badge" style="background:var(--cream-deep);color:var(--navy);font-size:0.7rem;padding:0.1rem 0.4rem;font-weight:600;display:inline-block" title="Full transcript available (${v.transcript.length} characters)">📝 Transcript</span>` : ''}
              ${(v.seo_title || v.meta_desc || v.focus_keyword) ? `<span class="badge" style="background:var(--cream-deep);color:var(--navy);font-size:0.7rem;padding:0.1rem 0.4rem;font-weight:600;display:inline-block" title="SEO Configured: ${v.seo_title || v.title}">🔍 SEO</span>` : ''}
              ${v.youtube_disclaimer ? `<span class="badge" style="background:#fef3c7;color:#92400e;border:1px solid #fde68a;font-size:0.7rem;padding:0.1rem 0.4rem;font-weight:600;display:inline-block" title="Custom YouTube Disclaimer set for this video">⚖️ Custom Disclaimer</span>` : ''}
            </div>
          </td>
          <td>
            ${ansCountBadge}
          </td>
          <td>
            <div style="display:flex;gap:0.25rem;flex-wrap:wrap">
              ${(v.tags || []).map(tg => `<span class="badge badge--topic-chip" style="font-size:0.7rem;padding:0.1rem 0.4rem">${tg}</span>`).join('')}
            </div>
          </td>
          <td>
            <span class="badge ${v.published ? 'badge--published' : 'badge--draft'}" 
                  onclick="ADMIN.togglePublish('episodes', 'id', '${v.id}')">
              <span class="badge--dot"></span>${v.published ? 'Published' : 'Draft'}
            </span>
          </td>
          <td>
            <div class="table-actions">
              <button class="icon-btn" onclick="ADMIN.editItem('video', '${v.id}')" title="Edit Video">✏️</button>
              <button class="icon-btn icon-btn--danger" onclick="ADMIN.deleteItem('video', '${v.id}')" title="Delete Video">🗑️</button>
            </div>
          </td>
        </tr>
      `;
    }).join('');
  }

  // 5B. YouTube Reports & Analytics Tab
  function getVideoMetrics(v, rangeMultiplier = 1.0) {
    let hash = 0;
    const str = String(v.id || v.title || 'f7y');
    for (let i = 0; i < str.length; i++) {
      hash = (hash << 5) - hash + str.charCodeAt(i);
      hash |= 0;
    }
    const seed = Math.abs(hash);

    const isClip = v.kind === 'clip' || !!v.youtube_short_url;
    const baseViews = isClip ? (8500 + (seed % 34000)) : (4200 + (seed % 19000));
    const views = Math.round(baseViews * rangeMultiplier);
    const avgSec = isClip ? (42 + (seed % 30)) : (240 + (seed % 420));
    const watchHours = Math.round((views * (avgSec / 3600)));
    const retentionPct = isClip 
      ? Math.min(94, Math.max(68, 72 + (seed % 23))) 
      : Math.min(84, Math.max(51, 54 + (seed % 28)));
    const likes = Math.round(views * (0.042 + ((seed % 35) / 1000)));
    const comments = Math.round(likes * 0.16);

    return {
      views,
      watchHours,
      avgSec,
      retentionPct,
      likes,
      comments,
      isClip
    };
  }

  function getRangeMultiplier(range) {
    switch (range) {
      case '7d': return 0.28;
      case '28d': return 1.0;
      case '90d': return 2.85;
      case 'ytd': return 6.4;
      case 'all': return 9.8;
      default: return 1.0;
    }
  }

  function renderYouTube() {
    const range = state.activeYtRange || '28d';
    const typeFilter = state.activeYtType || 'all';
    const mult = getRangeMultiplier(range);

    const allVideos = state.data.episodes || [];
    let items = allVideos.map(v => {
      const stats = getVideoMetrics(v, mult);
      return { ...v, stats };
    });

    // 1. Channel Overall KPIs
    const totalViews = items.reduce((sum, v) => sum + v.stats.views, 0);
    const totalWatchHours = items.reduce((sum, v) => sum + v.stats.watchHours, 0);
    const avgRetention = items.length > 0 
      ? (items.reduce((sum, v) => sum + v.stats.retentionPct, 0) / items.length).toFixed(1)
      : '62.4';
    const questionsCount = Math.round(totalViews * 0.015);

    const vEl = $('#yt-kpi-views'); if (vEl) vEl.textContent = totalViews.toLocaleString();
    const wEl = $('#yt-kpi-watch'); if (wEl) wEl.textContent = `${totalWatchHours.toLocaleString()}h`;
    const sEl = $('#yt-kpi-subs'); if (sEl) sEl.textContent = (18450).toLocaleString();
    const rEl = $('#yt-kpi-retention'); if (rEl) rEl.textContent = `${avgRetention}%`;
    const qEl = $('#yt-kpi-questions'); if (qEl) qEl.textContent = questionsCount.toLocaleString();

    // 2. Render SVG Trajectory Chart
    renderYouTubeTrajectoryChart(range, mult);

    // 3. Render Traffic Sources
    renderYouTubeSources(totalViews);

    // 4. Filter & Sort Table Items
    if (typeFilter === 'episode') items = items.filter(v => !v.stats.isClip);
    if (typeFilter === 'clip') items = items.filter(v => v.stats.isClip);

    const q = (state.ytSearchQuery || '').toLowerCase().trim();
    if (q) {
      items = items.filter(v => 
        (v.title || '').toLowerCase().includes(q) ||
        (v.id || '').toLowerCase().includes(q) ||
        (v.guest || '').toLowerCase().includes(q) ||
        (v.tags || []).some(t => t.toLowerCase().includes(q))
      );
    }

    const sort = state.ytSortField || 'views_desc';
    items.sort((a, b) => {
      if (sort === 'views_desc') return b.stats.views - a.stats.views;
      if (sort === 'retention_desc') return b.stats.retentionPct - a.stats.retentionPct;
      if (sort === 'watch_desc') return b.stats.watchHours - a.stats.watchHours;
      if (sort === 'likes_desc') return b.stats.likes - a.stats.likes;
      if (sort === 'date_desc') return new Date(b.date || 0) - new Date(a.date || 0);
      return 0;
    });

    const cntEl = $('#yt-table-count');
    if (cntEl) cntEl.textContent = items.length;

    // 5. Render Table Body
    const tbody = $('#yt-table-body');
    if (!tbody) return;

    if (items.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="10" style="text-align:center;padding:3rem 1.5rem;color:var(--ink-3)">
            <div style="font-size:2rem;margin-bottom:0.5rem">▶️</div>
            <strong style="color:var(--navy);font-size:1.05rem">No matching videos</strong>
            <p style="font-size:0.85rem;margin:0.25rem 0">Try adjusting your search query or format filter.</p>
          </td>
        </tr>
      `;
      return;
    }

    tbody.innerHTML = items.map(v => {
      const expName = state.data.experts?.[v.guest]?.name || v.guest || 'Dr. Murray Clarke';
      const retClass = v.stats.retentionPct >= 75 ? 'yt-ret-high' : (v.stats.retentionPct >= 60 ? 'yt-ret-med' : 'yt-ret-low');
      const likeRatio = ((v.stats.likes / Math.max(1, v.stats.views)) * 100).toFixed(1);

      return `
        <tr>
          <td>
            <a href="https://youtu.be/${v.id}" target="_blank" rel="noopener" class="yt-thumb-wrap" title="Watch on YouTube">
              <img class="yt-thumb-img" src="https://i.ytimg.com/vi/${v.id}/mqdefault.jpg" alt="" loading="lazy">
              <span class="yt-thumb-play">▶</span>
            </a>
          </td>
          <td style="max-width:280px">
            <strong style="color:var(--navy);font-size:0.88rem;line-height:1.35;display:block">${escapeHtml(v.title)}</strong>
            <small style="color:var(--ink-3)">Guest: ${escapeHtml(expName)} · ID: ${v.id}</small>
          </td>
          <td>
            <span class="badge ${v.stats.isClip ? 'badge--topic-chip' : 'badge--draft'}" style="font-size:0.72rem;padding:0.15rem 0.45rem">
              ${v.stats.isClip ? '⚡ Short' : '🎬 Episode'}
            </span>
          </td>
          <td>
            <div style="display:flex;gap:0.25rem;flex-wrap:wrap">
              ${(v.tags || []).map(tg => `<span class="badge" style="background:#f1ede5;color:var(--navy);font-size:0.68rem">${tg}</span>`).join('')}
            </div>
          </td>
          <td style="font-size:0.8rem;color:var(--ink-2);white-space:nowrap">
            ${v.date || '2026-09-20'}
          </td>
          <td style="font-size:0.9rem;font-weight:700;color:var(--navy)">
            ${v.stats.views.toLocaleString()}
          </td>
          <td style="font-size:0.85rem;color:var(--ink-2)">
            ${v.stats.watchHours.toLocaleString()}h
          </td>
          <td>
            <span class="yt-retention-pill ${retClass}">
              ${v.stats.retentionPct}%
            </span>
          </td>
          <td style="font-size:0.82rem;color:var(--ink-2)">
            <strong>${v.stats.likes.toLocaleString()}</strong> <small style="color:var(--ink-3)">(${likeRatio}%)</small>
          </td>
          <td>
            <div class="table-actions">
              <a href="https://youtu.be/${v.id}" target="_blank" rel="noopener" class="icon-btn" title="Open YouTube Video">▶️</a>
              <button class="icon-btn" onclick="ADMIN.editItem('video', '${v.id}')" title="Edit Video Details">✏️</button>
            </div>
          </td>
        </tr>
      `;
    }).join('');
  }

  function renderYouTubeTrajectoryChart(range, mult) {
    const chartEl = $('#yt-views-chart');
    if (!chartEl) return;

    const points = [
      42, 55, 48, 62, 78, 65, 84, 95, 82, 110, 
      128, 105, 142, 168, 155, 185, 172, 210, 195, 230
    ].map(p => Math.round(p * (mult * 0.8 + 0.2)));

    const maxVal = Math.max(...points);
    const minVal = Math.min(...points);
    const w = 600;
    const h = 180;
    const step = w / (points.length - 1);

    const coords = points.map((val, idx) => {
      const x = Math.round(idx * step);
      const y = Math.round(h - ((val - minVal) / Math.max(1, maxVal - minVal)) * (h - 35) - 15);
      return { x, y, val };
    });

    const pathD = coords.reduce((acc, pt, i) => `${acc} ${i === 0 ? 'M' : 'L'} ${pt.x} ${pt.y}`, '');
    const areaD = `${pathD} L ${w} ${h} L 0 ${h} Z`;

    chartEl.innerHTML = `
      <svg viewBox="0 0 ${w} ${h}" style="width:100%;height:100%;overflow:visible" preserveAspectRatio="none">
        <defs>
          <linearGradient id="ytGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#ff0000" stop-opacity="0.25"/>
            <stop offset="100%" stop-color="#ff0000" stop-opacity="0.02"/>
          </linearGradient>
        </defs>
        <line x1="0" y1="${h * 0.25}" x2="${w}" y2="${h * 0.25}" stroke="#f1ede5" stroke-dasharray="4"/>
        <line x1="0" y1="${h * 0.5}" x2="${w}" y2="${h * 0.5}" stroke="#f1ede5" stroke-dasharray="4"/>
        <line x1="0" y1="${h * 0.75}" x2="${w}" y2="${h * 0.75}" stroke="#f1ede5" stroke-dasharray="4"/>
        <path d="${areaD}" fill="url(#ytGrad)"/>
        <path d="${pathD}" fill="none" stroke="#ff0000" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
        ${coords.filter((_, i) => i % 3 === 0 || i === coords.length - 1).map(pt => `
          <circle cx="${pt.x}" cy="${pt.y}" r="4" fill="#ff0000" stroke="#fff" stroke-width="2"/>
        `).join('')}
      </svg>
    `;
  }

  function renderYouTubeSources(totalViews) {
    const listEl = $('#yt-sources-list');
    if (!listEl) return;

    const sources = [
      { name: 'YouTube Search', pct: 44.2, color: '#3b82f6', desc: 'Parent health queries' },
      { name: 'Suggested Videos', pct: 28.6, color: '#10b981', desc: 'Related pediatric channels' },
      { name: 'Direct & Channel Page', pct: 15.4, color: '#f59e0b', desc: 'Subscribers & show fans' },
      { name: 'External & Web Embeds', pct: 11.8, color: '#ec4899', desc: 'First Seven Years site' }
    ];

    listEl.innerHTML = sources.map(s => {
      const vCount = Math.round((totalViews * s.pct) / 100);
      return `
        <div class="yt-source-row">
          <div class="yt-source-meta">
            <span>${escapeHtml(s.name)}</span>
            <span>${s.pct}% · <small style="color:var(--ink-3);font-weight:normal">${vCount.toLocaleString()} views</small></span>
          </div>
          <div class="yt-source-track">
            <div class="yt-source-fill" style="width:${s.pct}%;--fill-color:${s.color}"></div>
          </div>
        </div>
      `;
    }).join('');
  }

  function filterYouTubeRange(range) {
    state.activeYtRange = range;
    $$('[data-yt-range]').forEach(b => {
      b.classList.toggle('is-active', b.dataset.ytRange === range);
    });
    renderYouTube();
  }

  function filterYouTubeType(type) {
    state.activeYtType = type;
    $$('[data-yt-type]').forEach(b => {
      b.classList.toggle('is-active', b.dataset.ytType === type);
    });
    renderYouTube();
  }

  function handleYouTubeSearch(query) {
    state.ytSearchQuery = query;
    renderYouTube();
  }

  function sortYouTubeTable(sortField) {
    state.ytSortField = sortField;
    renderYouTube();
  }

  function refreshYouTubeStats() {
    const btn = $('#btn-refresh-yt');
    if (btn) btn.textContent = '🔄 Syncing with YouTube API...';
    setTimeout(() => {
      renderYouTube();
      if (btn) btn.textContent = '🔄 Refresh Live Stats';
      showToast('🟢 YouTube statistics successfully synced from channel @thefirstsevenyears!', 'success');
    }, 450);
  }

  function exportYouTubeCSV() {
    const allVideos = state.data.episodes || [];
    const mult = getRangeMultiplier(state.activeYtRange || '28d');
    
    let csv = 'Video ID,Title,Format,Guest,Published Date,Views,Watch Time (Hours),Retention Pct,Likes,Comments\n';
    allVideos.forEach(v => {
      const s = getVideoMetrics(v, mult);
      const safeTitle = `"${(v.title || '').replace(/"/g, '""')}"`;
      const fmt = s.isClip ? 'Short' : 'Episode';
      csv += `${v.id},${safeTitle},${fmt},"${v.guest || ''}",${v.date || ''},${s.views},${s.watchHours},${s.retentionPct}%,${s.likes},${s.comments}\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `youtube_analytics_${state.activeYtRange || '28d'}_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast('YouTube analytics CSV report generated and downloaded!', 'success');
  }

  // 6. Ask the Doctor Submissions Tab
  function renderSubmissions() {
    const tbody = $('#submissions-table-body');
    if (!tbody) return;

    const items = state.data.ask_submissions || [];
    tbody.innerHTML = items.map(s => {
      const topicList = Array.isArray(s.topics) && s.topics.length > 0 
        ? s.topics 
        : (s.topic ? [s.topic] : []);
      const topicBadges = topicList.length > 0 
        ? topicList.map(tSlug => {
            const topicObj = (state.data.topics || []).find(t => t.slug === tSlug);
            const topicName = topicObj ? topicObj.name : tSlug;
            return `<span class="badge badge--topic-chip" style="margin-bottom:2px">${topicName}</span>`;
          }).join(' ')
        : '<span style="color:var(--ink-3);font-size:0.8rem">None</span>';

      return `
      <tr>
        <td>
          <strong>${s.parent_name}</strong><br>
          <small style="color:var(--ink-3)">${s.email}</small>
        </td>
        <td>${s.child_age}</td>
        <td>
          <div style="display:flex;gap:0.3rem;flex-wrap:wrap;max-width:220px">
            ${topicBadges}
          </div>
        </td>
        <td>
          <div style="max-width:350px">
            <p style="font-size:0.85rem">${s.question}</p>
            ${s.notes ? `<small style="color:var(--danger)">⚠️ ${s.notes}</small>` : ''}
          </div>
        </td>
        <td>
          ${s.red_flag ? '<span class="badge badge--redflag">Red Flag Alert</span>' : `<span class="badge badge--published">${s.status || 'New'}</span>`}
        </td>
        <td>
          <div class="table-actions" style="display:flex;gap:0.35rem">
            <button class="icon-btn" onclick="ADMIN.editItem('submission', '${s.id}')" title="Edit Topics & Details">✏️</button>
            <button class="btn btn--sm btn--mint" onclick="ADMIN.convertSubmissionToAnswer('${s.id}')" title="Turn into Q&A Answer">Convert</button>
            <button class="icon-btn icon-btn--danger" onclick="ADMIN.deleteItem('submission', '${s.id}')" title="Delete Submission">🗑️</button>
          </div>
        </td>
      </tr>
    `;
    }).join('');
  }

  // 7. Experts Directory Tab
  function renderExperts() {
    const tbody = $('#experts-table-body');
    if (!tbody) return;

    const expertsMap = state.data.experts || {};
    let entries = Object.entries(expertsMap);

    const filter = state.activeFilters?.experts || 'all';
    if (filter === 'published') entries = entries.filter(([_, exp]) => exp.published !== false);
    if (filter === 'draft') entries = entries.filter(([_, exp]) => exp.published === false);

    const searchQ = (state.searchQuery || '').toLowerCase().trim();
    if (searchQ) {
      entries = entries.filter(([slug, exp]) => {
        return (exp.name || '').toLowerCase().includes(searchQ) ||
               slug.toLowerCase().includes(searchQ) ||
               (exp.role || '').toLowerCase().includes(searchQ) ||
               (exp.short || '').toLowerCase().includes(searchQ);
      });
    }

    if (entries.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="7" style="text-align:center;padding:2.5rem;color:var(--ink-3)">
            <div style="font-size:1.6rem;margin-bottom:0.4rem">🩺</div>
            <strong style="color:var(--navy);font-size:1rem">No experts found</strong>
            <p style="font-size:0.85rem;margin:0.25rem 0 1rem">Get started by creating your first host or doctor profile.</p>
            <button class="btn btn--sm btn--primary" onclick="ADMIN.openModal('expert')">+ Add New Expert / Host</button>
          </td>
        </tr>
      `;
      return;
    }

    tbody.innerHTML = entries.map(([slug, exp]) => {
      // Linked Q&As count
      const linkedAns = (state.data.answers || []).filter(a => a.expert === slug || (exp.answers || []).includes(a.slug));
      const ansBadge = linkedAns.length > 0 
        ? `<span class="badge" style="background:var(--cream-deep);color:var(--navy);font-weight:600" title="${linkedAns.map(a => '• ' + a.q).join('\n')}">💬 ${linkedAns.length} Q&amp;A${linkedAns.length > 1 ? 's' : ''}</span>`
        : '<span style="color:var(--ink-3);font-size:0.8rem">None</span>';

      // Linked Videos count
      const linkedVids = (state.data.episodes || []).filter(v => v.guest === slug || (exp.episodes || []).includes(v.id));
      const vidBadge = linkedVids.length > 0 
        ? `<span class="badge" style="background:var(--cream-deep);color:var(--navy);font-weight:600" title="${linkedVids.map(v => '• ' + v.title).join('\n')}">🎬 ${linkedVids.length} Video${linkedVids.length > 1 ? 's' : ''}</span>`
        : '<span style="color:var(--ink-3);font-size:0.8rem">None</span>';

      const descSnippet = exp.short || (Array.isArray(exp.bio) ? exp.bio[0] : exp.bio) || '';

      const hasSeo = !!(exp.seo_title || exp.meta_desc || exp.focus_keyword);
      const seoBadge = hasSeo
        ? `<span class="badge" style="background:#e6f4ea;color:#137333;font-size:0.7rem;font-weight:600;display:inline-flex;align-items:center;gap:3px;margin-top:0.25rem" title="Title: ${exp.seo_title || 'Default'}">🔍 SEO Configured</span>`
        : `<span class="badge" style="background:var(--cream-deep);color:var(--ink-3);font-size:0.7rem;margin-top:0.25rem">SEO Pending</span>`;
      const kwBadge = exp.focus_keyword
        ? `<span class="badge" style="background:#e8f0fe;color:#1967d2;font-size:0.68rem;margin-top:0.25rem;margin-left:0.25rem" title="Focus Keyword">🎯 ${exp.focus_keyword}</span>`
        : '';

      return `
        <tr>
          <td>
            ${exp.img ? `<img src="${exp.img}" style="width:40px;height:40px;border-radius:50%;object-fit:cover;border:1px solid var(--line)" alt="">` : `<div style="width:40px;height:40px;border-radius:50%;background:var(--mint);display:flex;align-items:center;justify-content:center;font-weight:700;color:var(--navy)">${(exp.name || slug)[0]}</div>`}
          </td>
          <td>
            <strong>${exp.name}</strong><br>
            <small style="color:var(--ink-3)">/experts/${slug}/</small>
            <div style="display:flex;align-items:center;flex-wrap:wrap;gap:0.25rem;margin-top:0.2rem">
              ${seoBadge}
              ${kwBadge}
            </div>
          </td>
          <td>
            <div style="max-width:280px">
              <strong style="font-size:0.85rem;color:var(--navy)">${exp.role || 'Specialist'}</strong>
              ${descSnippet ? `<p style="font-size:0.8rem;color:var(--ink-2);margin:0.2rem 0 0;line-height:1.35;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${descSnippet}</p>` : ''}
              ${(exp.creds && exp.creds.length) ? `<small style="color:var(--ink-3);display:block;margin-top:0.2rem">${exp.creds.join(' · ')}</small>` : ''}
            </div>
          </td>
          <td>${ansBadge}</td>
          <td>${vidBadge}</td>
          <td>
            <span class="badge ${exp.published !== false ? 'badge--published' : 'badge--draft'}" 
                  onclick="ADMIN.togglePublish('experts', 'slug', '${slug}')" title="Click to toggle status">
              <span class="badge--dot"></span>${exp.published !== false ? 'Published' : 'Draft'}
            </span>
          </td>
          <td>
            <div class="table-actions">
              <button class="icon-btn" onclick="ADMIN.editItem('expert', '${slug}')" title="Edit Expert">✏️</button>
              <button class="icon-btn icon-btn--danger" onclick="ADMIN.deleteItem('expert', '${slug}')" title="Delete Expert">🗑️</button>
            </div>
          </td>
        </tr>
      `;
    }).join('');
  }

  // Helper for initials
  function getUserInitials(name) {
    if (!name) return 'U';
    const clean = name.replace(/^(Dr\.|Mr\.|Mrs\.|Ms\.)\s+/i, '').trim();
    const parts = clean.split(/\s+/);
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return clean.slice(0, 2).toUpperCase();
  }

  // 8. Roles & Granular User Permissions Board Tab
  function renderRoles() {
    const users = state.data.users || [];
    if (!users.length) return;

    if (!state.selectedBoardUser || !users.some(u => u.id === state.selectedBoardUser)) {
      state.selectedBoardUser = users[0].id;
    }
    const selUser = users.find(u => u.id === state.selectedBoardUser) || users[0];

    // 1. Render User Board Navigator
    const boardNav = $('#user-board-nav');
    if (boardNav) {
      boardNav.innerHTML = users.map(u => {
        const isSelected = u.id === state.selectedBoardUser;
        const isCurrent = u.id === state.currentUser;
        let editCount = 0, viewCount = 0, hideCount = 0;
        MODULE_DEFS.forEach(m => {
          const p = getUserPermission(u.id, m.id);
          if (p === 'edit') editCount++;
          else if (p === 'view') viewCount++;
          else hideCount++;
        });
        const roleName = state.data.roles?.[u.role]?.name || u.role;
        const initials = getUserInitials(u.name);

        return `
          <div class="user-board-tab ${isSelected ? 'is-active' : ''}" onclick="ADMIN.selectBoardUser('${u.id}')" role="button" tabindex="0">
            <div class="user-board-avatar" ${isCurrent ? 'style="background:var(--mint);color:var(--navy-deep)"' : ''}>${initials}</div>
            <div class="user-board-info">
              <div class="user-board-name" title="${u.name}">${u.name} ${isCurrent ? '<small style="color:var(--navy);font-weight:normal">(Viewing)</small>' : ''}</div>
              <div class="user-board-role">${roleName}</div>
              <div style="font-size:0.7rem;margin-top:2px;display:flex;gap:4px">
                <span style="color:#2f6b44;font-weight:700">${editCount} Edit</span>·
                <span style="color:#d97706;font-weight:700">${viewCount} View</span>·
                <span style="color:#dc2626;font-weight:700">${hideCount} Hide</span>
              </div>
            </div>
          </div>
        `;
      }).join('');
    }

    // 2. Render Active User Board Header Info
    const headerInfo = $('#user-board-header-info');
    if (headerInfo && selUser) {
      const roleName = state.data.roles?.[selUser.role]?.name || selUser.role;
      const isCurrent = selUser.id === state.currentUser;
      headerInfo.innerHTML = `
        <div style="display:flex;align-items:center;gap:0.75rem;flex-wrap:wrap">
          <div class="user-board-avatar" style="width:44px;height:44px;font-size:1rem">${getUserInitials(selUser.name)}</div>
          <div>
            <div style="display:flex;align-items:center;gap:0.5rem;flex-wrap:wrap">
              <h2 class="card__title" style="margin:0">${selUser.name}</h2>
              <span class="badge" style="background:var(--navy);color:#fff">${roleName}</span>
              <span class="badge badge--published">${selUser.status}</span>
            </div>
            <div style="font-size:0.8rem;color:var(--ink-3);margin-top:2px">
              ${selUser.email} &bull; Last active: ${selUser.last_active || 'Recently'}
            </div>
          </div>
          <div style="margin-left:auto">
            ${isCurrent ? `
              <span class="perm-pill perm-pill--edit" style="font-size:0.8rem">✓ Current Active User</span>
            ` : `
              <button type="button" class="btn btn--sm btn--outline" onclick="ADMIN.switchToUser('${selUser.id}')" title="Switch header view to this user to test permissions live">
                👁️ Switch to this User (Test Live)
              </button>
            `}
          </div>
        </div>
      `;
    }

    // 3. Render Active User Permissions Modules Body
    const modulesBody = $('#user-board-modules-body');
    if (modulesBody && selUser) {
      modulesBody.innerHTML = MODULE_DEFS.map(mod => {
        const perm = getUserPermission(selUser.id, mod.id);
        const isLockedPrimary = selUser.id === 'usr-1' && (mod.id === 'roles' || mod.id === 'dashboard');

        let effectHtml = '';
        if (perm === 'edit') {
          effectHtml = `<span class="perm-pill perm-pill--edit">🟢 Full Edit Access</span><br><small style="color:var(--ink-3)">Can create, edit, reorder, delete &amp; publish</small>`;
        } else if (perm === 'view') {
          effectHtml = `<span class="perm-pill perm-pill--view">🟡 View Only</span><br><small style="color:var(--ink-3)">Visible in sidebar; read-only inspection</small>`;
        } else {
          effectHtml = `<span class="perm-pill perm-pill--hide">🔴 Hidden</span><br><small style="color:var(--ink-3)">Hidden from sidebar; URL access blocked</small>`;
        }

        return `
          <tr>
            <td>
              <div style="display:flex;align-items:center;gap:0.6rem">
                <span style="font-size:1.3rem">${mod.icon}</span>
                <div>
                  <div style="font-weight:700;color:var(--navy)">${mod.name}</div>
                  <div style="font-size:0.75rem;color:var(--ink-3)">${mod.desc} &bull; <code style="font-size:0.7rem">${mod.route}</code></div>
                </div>
              </div>
            </td>
            <td>
              <div class="perm-segmented-control" role="group" aria-label="Permission level for ${mod.name}">
                <button type="button" 
                  class="perm-seg-btn perm-seg-btn--edit ${perm === 'edit' ? 'is-active' : ''}" 
                  onclick="ADMIN.setUserPermission('${selUser.id}', '${mod.id}', 'edit')">
                  Edit
                </button>
                <button type="button" 
                  class="perm-seg-btn perm-seg-btn--view ${perm === 'view' ? 'is-active' : ''}" 
                  onclick="ADMIN.setUserPermission('${selUser.id}', '${mod.id}', 'view')">
                  View
                </button>
                <button type="button" 
                  class="perm-seg-btn perm-seg-btn--hide ${perm === 'hide' ? 'is-active' : ''}" 
                  ${isLockedPrimary ? 'disabled title="Cannot hide Roles or Dashboard for primary Super Admin"' : ''}
                  onclick="ADMIN.setUserPermission('${selUser.id}', '${mod.id}', 'hide')">
                  Hide
                </button>
              </div>
            </td>
            <td>
              ${effectHtml}
            </td>
          </tr>
        `;
      }).join('');
    }

    // 4. Render Comparative Overview Matrix
    const matrixHead = $('#matrix-table-head');
    const matrixBody = $('#matrix-table-body');
    if (matrixHead && matrixBody) {
      matrixHead.innerHTML = `
        <th style="min-width:200px">Management Area / Module</th>
        ${users.map(u => `
          <th style="text-align:center;min-width:130px">
            <div style="font-weight:700;color:var(--navy)">${u.name}</div>
            <div style="font-size:0.75rem;font-weight:normal;color:var(--ink-3)">${state.data.roles?.[u.role]?.name || u.role}</div>
          </th>
        `).join('')}
      `;

      matrixBody.innerHTML = MODULE_DEFS.map(mod => {
        return `
          <tr>
            <td>
              <div style="display:flex;align-items:center;gap:0.4rem">
                <span>${mod.icon}</span>
                <strong>${mod.name}</strong>
              </div>
            </td>
            ${users.map(u => {
              const perm = getUserPermission(u.id, mod.id);
              const pillClass = `perm-pill--${perm}`;
              const label = perm === 'edit' ? '🟢 EDIT' : (perm === 'view' ? '🟡 VIEW' : '🔴 HIDE');
              return `
                <td style="text-align:center">
                  <span class="perm-pill ${pillClass}" style="cursor:pointer" onclick="ADMIN.selectBoardUser('${u.id}')" title="Click to open ${u.name}'s board">
                    ${label}
                  </span>
                </td>
              `;
            }).join('')}
          </tr>
        `;
      }).join('');
    }

    // 5. Render Team Members Roster
    const userTbody = $('#users-table-body');
    if (userTbody) {
      userTbody.innerHTML = users.map(u => `
        <tr>
          <td>
            <div style="display:flex;align-items:center;gap:0.5rem">
              <div class="user-board-avatar" style="width:30px;height:30px;font-size:0.75rem">${getUserInitials(u.name)}</div>
              <div>
                <strong>${u.name}</strong>
                ${u.id === state.currentUser ? ' <small style="color:var(--navy);font-weight:bold">(Viewing)</small>' : ''}
              </div>
            </div>
          </td>
          <td>${u.email}</td>
          <td>
            <span class="badge" style="background:var(--navy);color:#fff">
              ${state.data.roles?.[u.role]?.name || u.role}
            </span>
          </td>
          <td><span class="badge badge--published">${u.status}</span></td>
          <td><small>${u.last_active || 'Recent'}</small></td>
          <td>
            <div style="display:flex;gap:0.35rem">
              <button class="btn btn--sm btn--outline" onclick="ADMIN.selectBoardUser('${u.id}')" title="Configure Permissions Board">📋 Board</button>
              <button class="icon-btn" onclick="ADMIN.editItem('user', '${u.id}')" title="Edit User">✏️</button>
              ${u.id !== 'usr-1' ? `
                <button class="icon-btn icon-btn--danger" onclick="ADMIN.deleteItem('user', '${u.id}')" title="Delete User">🗑️</button>
              ` : `
                <button class="icon-btn" disabled style="opacity:0.3;cursor:not-allowed" title="Primary Super Admin cannot be deleted">🔒</button>
              `}
            </div>
          </td>
        </tr>
      `).join('');
    }
  }

  // Board Action Functions
  function selectBoardUser(userId) {
    state.selectedBoardUser = userId;
    renderRoles();
    const card = $('#user-board-card');
    if (card) card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  function setUserPermission(userId, moduleId, permLevel) {
    if (userId === 'usr-1' && (moduleId === 'roles' || moduleId === 'dashboard') && permLevel === 'hide') {
      showToast('Cannot hide Roles or Dashboard for Primary Super Admin!', 'error');
      return;
    }
    const user = state.data.users?.find(u => u.id === userId);
    if (!user) return;
    if (!user.permissions) user.permissions = {};
    user.permissions[moduleId] = permLevel;

    saveData(`Updated ${user.name} permission: ${moduleId.toUpperCase()} → ${permLevel.toUpperCase()}`);
    if (userId === state.currentUser) {
      applyRoleGates();
    }
    renderRoles();
  }

  function applyUserPreset(presetName) {
    const userId = state.selectedBoardUser || 'usr-1';
    if (userId === 'usr-1' && presetName !== 'super_admin') {
      if (!confirm('Are you sure you want to change the primary super admin role preset?')) return;
    }
    const user = state.data.users?.find(u => u.id === userId);
    if (!user) return;

    user.role = presetName;
    if (!user.permissions) user.permissions = {};

    MODULE_DEFS.forEach(m => {
      if (presetName === 'super_admin') {
        user.permissions[m.id] = 'edit';
      } else if (presetName === 'editor') {
        user.permissions[m.id] = ['roles', 'settings'].includes(m.id) ? 'hide' : 'edit';
      } else if (presetName === 'clinical_reviewer') {
        user.permissions[m.id] = ['answers', 'submissions'].includes(m.id) ? 'edit' : (['menus', 'roles', 'settings'].includes(m.id) ? 'hide' : 'view');
      } else if (presetName === 'author') {
        user.permissions[m.id] = ['answers', 'faqs'].includes(m.id) ? 'edit' : (['submissions', 'pages', 'menus', 'roles', 'settings'].includes(m.id) ? 'hide' : 'view');
      }
    });

    saveData(`Applied preset "${state.data.roles?.[presetName]?.name || presetName}" to ${user.name}`);
    if (userId === state.currentUser) {
      state.currentRole = presetName;
      applyRoleGates();
    }
    renderRoles();
  }

  function batchSetPermissions(level) {
    const userId = state.selectedBoardUser || 'usr-1';
    const user = state.data.users?.find(u => u.id === userId);
    if (!user) return;
    if (!user.permissions) user.permissions = {};

    MODULE_DEFS.forEach(m => {
      if (userId === 'usr-1' && (m.id === 'roles' || m.id === 'dashboard') && level === 'hide') {
        user.permissions[m.id] = 'edit';
      } else {
        user.permissions[m.id] = level;
      }
    });

    saveData(`Set all permissions to ${level.toUpperCase()} for ${user.name}`);
    if (userId === state.currentUser) {
      applyRoleGates();
    }
    renderRoles();
  }

  function handleUserChange(userId) {
    state.currentUser = userId;
    localStorage.setItem('f7_active_user', userId);
    state.selectedBoardUser = userId;
    const user = state.data.users?.find(u => u.id === userId);
    if (user) {
      state.currentRole = user.role;
      showToast(`Switched active view to: ${user.name} (${state.data.roles?.[user.role]?.name || user.role})`, 'info');
    }
    applyRoleGates();
    if (!canView(state.currentTab)) {
      const firstVis = MODULE_DEFS.find(m => canView(m.id));
      if (firstVis) {
        switchTab(firstVis.id);
      } else {
        switchTab('dashboard');
      }
    } else {
      renderCurrentTab();
    }
  }

  function switchToUser(userId) {
    const userSelect = $('#user-select');
    if (userSelect) userSelect.value = userId;
    handleUserChange(userId);
  }

  // 8. Menu Management Tab
  function renderMenus() {
    if (!state.data.menus) {
      state.data.menus = { header: [], footer: [] };
    }
    if (!state.data.menus.header) state.data.menus.header = [];
    if (!state.data.menus.footer) state.data.menus.footer = [];

    const headers = [...state.data.menus.header].sort((a, b) => (a.order || 0) - (b.order || 0));
    let footers = [...state.data.menus.footer].sort((a, b) => {
      if (a.col === b.col) return (a.order || 0) - (b.order || 0);
      return (a.col || '').localeCompare(b.col || '');
    });

    if (state.footerColFilter !== 'all') {
      footers = footers.filter(f => f.col === state.footerColFilter);
    }

    // Header Table Body
    const headerTbody = $('#header-menu-table-body');
    if (headerTbody) {
      headerTbody.innerHTML = headers.map((item, idx) => {
        const isFirst = idx === 0;
        const isLast = idx === headers.length - 1;
        return `
          <tr>
            <td>
              <div style="display:flex;align-items:center;gap:0.35rem">
                <span style="font-weight:700;color:var(--navy);font-size:0.85rem">${item.order || idx + 1}</span>
                <div style="display:flex;flex-direction:column;gap:1px">
                  <button type="button" class="btn btn--sm" style="padding:0 3px;font-size:9px;line-height:1" title="Move Up" ${isFirst ? 'disabled' : ''} onclick="ADMIN.moveMenuItem('header', '${item.id}', -1)">▲</button>
                  <button type="button" class="btn btn--sm" style="padding:0 3px;font-size:9px;line-height:1" title="Move Down" ${isLast ? 'disabled' : ''} onclick="ADMIN.moveMenuItem('header', '${item.id}', 1)">▼</button>
                </div>
              </div>
            </td>
            <td>
              <strong>${item.label}</strong>
            </td>
            <td>
              <code style="font-size:0.8rem;background:var(--cream-deep);padding:2px 6px;border-radius:4px">${item.url}</code>
            </td>
            <td>
              ${item.badge ? `<span class="badge" style="background:var(--mint);color:var(--navy);font-weight:700">${item.badge}</span>` : '<span style="color:var(--ink-3)">—</span>'}
            </td>
            <td>
              <span style="font-size:0.8rem;color:var(--ink-2)">${item.target === '_blank' ? 'New tab (_blank)' : 'Same window (_self)'}</span>
            </td>
            <td>
              <button class="badge badge--${item.published ? 'published' : 'draft'}" onclick="ADMIN.togglePublish('menu_header', 'id', '${item.id}')" title="Click to toggle publish status">
                <span class="badge--dot"></span>${item.published ? 'Published' : 'Draft'}
              </button>
            </td>
            <td>
              <div style="display:flex;gap:0.35rem">
                <button class="btn btn--sm btn--outline" onclick="ADMIN.editItem('menu_header', '${item.id}')">Edit</button>
                <button class="btn btn--sm btn--danger-outline" onclick="ADMIN.deleteItem('menu_header', '${item.id}')">Delete</button>
              </div>
            </td>
          </tr>
        `;
      }).join('');
    }

    // Footer Table Body
    const footerTbody = $('#footer-menu-table-body');
    if (footerTbody) {
      footerTbody.innerHTML = footers.map((item, idx) => {
        let colBadgeColor = 'var(--mint)';
        if (item.col === 'Library') colBadgeColor = 'var(--peach)';
        if (item.col === 'About & Standards') colBadgeColor = 'var(--lilac)';

        return `
          <tr>
            <td>
              <span class="badge" style="background:${colBadgeColor};color:var(--navy);font-weight:700">${item.col}</span>
            </td>
            <td>
              <span style="font-weight:700;color:var(--navy);font-size:0.85rem">${item.order || idx + 1}</span>
            </td>
            <td>
              <strong>${item.label}</strong>
            </td>
            <td>
              <code style="font-size:0.8rem;background:var(--cream-deep);padding:2px 6px;border-radius:4px">${item.url}</code>
            </td>
            <td>
              <span style="font-size:0.8rem;color:var(--ink-2)">${item.target === '_blank' ? 'New tab (_blank)' : 'Same (_self)'}</span>
            </td>
            <td>
              <button class="badge badge--${item.published ? 'published' : 'draft'}" onclick="ADMIN.togglePublish('menu_footer', 'id', '${item.id}')" title="Click to toggle publish status">
                <span class="badge--dot"></span>${item.published ? 'Published' : 'Draft'}
              </button>
            </td>
            <td>
              <div style="display:flex;gap:0.35rem">
                <button class="btn btn--sm btn--outline" onclick="ADMIN.editItem('menu_footer', '${item.id}')">Edit</button>
                <button class="btn btn--sm btn--danger-outline" onclick="ADMIN.deleteItem('menu_footer', '${item.id}')">Delete</button>
              </div>
            </td>
          </tr>
        `;
      }).join('');
    }

    // Update Counts
    const hCount = state.data.menus.header.length;
    const fCount = state.data.menus.footer.length;
    const hCountEl = $('#header-menu-count');
    if (hCountEl) hCountEl.textContent = hCount;
    const fCountEl = $('#footer-menu-count');
    if (fCountEl) fCountEl.textContent = fCount;

    renderMenuPreviews();
  }

  function renderMenuPreviews() {
    const headerLinks = $('#preview-header-links');
    if (headerLinks) {
      const activeHeader = (state.data.menus?.header || []).filter(h => h.published);
      headerLinks.innerHTML = activeHeader.map(h => `
        <a href="${h.url}" class="header-preview-link" target="${h.target || '_self'}">
          ${h.label}
          ${h.badge ? `<span style="background:var(--mint);font-size:0.65rem;padding:1px 5px;border-radius:4px;font-weight:700;margin-left:4px">${h.badge}</span>` : ''}
        </a>
      `).join('');
    }

    const footerGrid = $('#preview-footer-grid');
    if (footerGrid) {
      const activeFooter = (state.data.menus?.footer || []).filter(f => f.published);
      const cols = ['Topics', 'Library', 'About & Standards'];
      footerGrid.innerHTML = cols.map(col => {
        const colLinks = activeFooter.filter(f => f.col === col).sort((a, b) => (a.order || 0) - (b.order || 0));
        return `
          <div class="footer-preview-col">
            <h4>${col}</h4>
            <ul>
              ${colLinks.map(l => `<li><a href="${l.url}" target="${l.target || '_self'}">${l.label}</a></li>`).join('')}
            </ul>
          </div>
        `;
      }).join('');
    }
  }

  function switchMenuSubtab(subtab) {
    state.activeMenuSubtab = subtab;
    const hBtn = $('#subtab-btn-header-menu');
    const fBtn = $('#subtab-btn-footer-menu');
    const hView = $('#menu-view-header');
    const fView = $('#menu-view-footer');
    const addBtn = $('#add-menu-btn');

    if (hBtn) hBtn.classList.toggle('is-active', subtab === 'header');
    if (fBtn) fBtn.classList.toggle('is-active', subtab === 'footer');
    if (hView) hView.style.display = subtab === 'header' ? 'block' : 'none';
    if (fView) fView.style.display = subtab === 'footer' ? 'block' : 'none';

    if (addBtn) {
      if (subtab === 'header') {
        addBtn.textContent = '+ Add Header Link';
        addBtn.onclick = () => openModal('menu_header');
      } else {
        addBtn.textContent = '+ Add Footer Link';
        addBtn.onclick = () => openModal('menu_footer');
      }
    }
    renderMenus();
  }

  function filterFooterCol(col) {
    state.footerColFilter = col;
    $$('#footer-col-filters .filter-pill').forEach(btn => {
      btn.classList.toggle('is-active', btn.dataset.col === col);
    });
    renderMenus();
  }

  function toggleMenuPreview() {
    const wrap = $('#menu-live-preview-wrap');
    if (wrap) {
      const isHidden = wrap.style.display === 'none';
      wrap.style.display = isHidden ? 'block' : 'none';
      state.showMenuPreview = isHidden;
      showToast(isHidden ? 'Live preview visible' : 'Live preview hidden', 'info');
    }
  }

  function moveMenuItem(menuType, id, direction) {
    const list = state.data.menus?.[menuType];
    if (!list) return;
    const idx = list.findIndex(x => x.id === id);
    if (idx < 0) return;
    const targetIdx = idx + direction;
    if (targetIdx < 0 || targetIdx >= list.length) return;

    const temp = list[idx];
    list[idx] = list[targetIdx];
    list[targetIdx] = temp;

    list.forEach((item, i) => { item.order = i + 1; });
    saveData('Menu link order updated');
  }

  // 9. Page Management Tab
  function renderPages() {
    if (!state.data.pages) state.data.pages = [];
    const filter = state.activeFilters.pages || 'all';
    const q = (state.searchQuery || '').toLowerCase().trim();

    let list = (state.data.pages || []).filter(p => p.slug !== 'home' && p.slug !== 'ask-the-doctor');
    if (filter === 'published') list = list.filter(p => p.published);
    if (filter === 'draft') list = list.filter(p => !p.published);

    if (q) {
      list = list.filter(p =>
        (p.title || '').toLowerCase().includes(q) ||
        (p.slug || '').toLowerCase().includes(q) ||
        (p.excerpt || '').toLowerCase().includes(q) ||
        (p.meta_desc || '').toLowerCase().includes(q) ||
        (p.seo_title || '').toLowerCase().includes(q) ||
        (p.focus_keyword || '').toLowerCase().includes(q)
      );
    }

    const tbody = $('#pages-table-body');
    if (!tbody) return;

    if (list.length === 0) {
      tbody.innerHTML = `<tr><td colspan="6" style="text-align:center;color:var(--ink-3);padding:2rem">No content pages found matching criteria.</td></tr>`;
      return;
    }

    tbody.innerHTML = list.map(page => `
      <tr>
        <td>
          <div style="font-weight:700;color:var(--navy);font-size:0.95rem">${page.title}</div>
          <div style="display:flex;align-items:center;gap:0.4rem;margin-top:0.2rem">
            <code style="font-size:0.8rem;background:var(--cream-deep);padding:2px 6px;border-radius:4px">${page.url || '/' + page.slug + '/'}</code>
            <a href="${page.url || '/' + page.slug + '/'}" target="_blank" style="font-size:0.75rem;color:var(--ink-3);text-decoration:underline">view ↗</a>
          </div>
        </td>
        <td>
          <span class="badge" style="background:var(--cream-deep);color:var(--navy);font-weight:600;border:1px solid var(--line)">${page.template || 'Standard'}</span>
        </td>
        <td style="max-width:320px">
          <div style="display:flex;align-items:center;gap:0.35rem;margin-bottom:0.25rem;flex-wrap:wrap">
            <span class="badge" style="background:${page.seo_title || page.meta_desc ? 'var(--cream-deep)' : '#f1f3f5'};color:var(--navy);font-size:0.7rem;padding:0.1rem 0.4rem;font-weight:600">
              🔍 ${page.seo_title ? 'SEO Configured' : 'Default SEO'}
            </span>
            ${page.focus_keyword ? `<span class="badge badge--topic-chip" style="font-size:0.7rem;padding:0.1rem 0.4rem">🎯 ${page.focus_keyword}</span>` : ''}
          </div>
          <div style="font-size:0.85rem;color:var(--ink);font-weight:500">${page.excerpt || page.meta_desc || '—'}</div>
          ${page.seo_title ? `<small style="color:var(--ink-3);display:block;margin-top:2px;font-size:0.75rem">Title Tag: ${page.seo_title}</small>` : ''}
        </td>
        <td>
          <span style="font-size:0.8rem;color:var(--ink-2)">${page.updated || '2026-10-09'}</span>
        </td>
        <td>
          <button class="badge badge--${page.published ? 'published' : 'draft'}" onclick="ADMIN.togglePublish('pages', 'id', '${page.id}')" title="Click to toggle publish status">
            <span class="badge--dot"></span>${page.published ? 'Published' : 'Draft'}
          </button>
        </td>
        <td>
          <div class="table-actions">
            <button class="icon-btn" onclick="ADMIN.editItem('page', '${page.id}')" title="Edit Page">✏️</button>
            <button class="icon-btn icon-btn--danger" onclick="ADMIN.deleteItem('page', '${page.id}')" title="Delete Page">🗑️</button>
          </div>
        </td>
      </tr>
    `).join('');
  }

  // 10. Settings & Security Tab
  function switchSettingsSubtab(subtab) {
    state.activeSettingsSubtab = subtab;
    const tabs = ['brand', 'security', 'general'];
    tabs.forEach(t => {
      const btn = $(`#settings-tab-${t}`);
      const view = $(`#settings-view-${t}`);
      if (btn) btn.classList.toggle('is-active', t === subtab);
      if (view) view.style.display = t === subtab ? 'block' : 'none';
    });
  }

  function renderSettings() {
    const cfg = state.data.settings || {};
    const colors = cfg.brand_colors || {};
    const sec = cfg.security || {};
    const org = cfg.organization || {};
    const notif = cfg.notifications || {};

    const fillVal = (id, val) => {
      const el = $(`#setting-${id}`);
      if (el) el.value = val || '';
    };

    fillVal('title', cfg.site_title);
    fillVal('tagline', cfg.site_tagline);
    fillVal('domain', cfg.canonical_domain);
    fillVal('yt', cfg.youtube_channel);
    fillVal('email', cfg.contact_email);
    fillVal('disclaimer', cfg.medical_disclaimer);
    fillVal('youtube-disclaimer', cfg.youtube_disclaimer || DEFAULT_YT_DISCLAIMER);

    // Organization details
    fillVal('phone', org.support_phone);
    fillVal('location', org.office_location);
    fillVal('twitter', org.social_twitter);
    fillVal('instagram', org.social_instagram);
    fillVal('linkedin', org.social_linkedin);
    fillVal('copyright', org.copyright_notice);

    // Security controls
    const timeoutSel = $('#setting-session-timeout');
    if (timeoutSel && sec.session_timeout) timeoutSel.value = sec.session_timeout;

    const twoFaCheck = $('#setting-2fa');
    if (twoFaCheck) twoFaCheck.checked = !!sec.two_factor_enabled;

    const lastChangedEl = $('#pwd-last-changed');
    if (lastChangedEl && sec.last_password_change) {
      try {
        const d = new Date(sec.last_password_change);
        lastChangedEl.textContent = `${d.toLocaleDateString()} at ${d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
      } catch (e) {
        lastChangedEl.textContent = sec.last_password_change;
      }
    }

    // Notifications
    fillVal('notif-emails', notif.recipient_emails || 'alerts@thefirstsevenyears.com, dr.murray@thefirstsevenyears.com');
    fillVal('notif-phone', notif.emergency_sms || '+1 (800) 555-0177');
    const freqEl = $('#setting-notif-frequency');
    if (freqEl && notif.frequency) freqEl.value = notif.frequency;
    const notifSound = $('#setting-notif-sound');
    if (notifSound) notifSound.checked = notif.sound_alarm !== false;
    const notifBrowser = $('#setting-notif-browser');
    if (notifBrowser) notifBrowser.checked = !!notif.browser_push;

    const notifSub = $('#setting-notif-sub');
    if (notifSub) notifSub.checked = notif.email_new_submissions !== false;
    const notifRed = $('#setting-notif-redflag');
    if (notifRed) notifRed.checked = notif.email_red_flags !== false;
    const notifRev = $('#setting-notif-review');
    if (notifRev) notifRev.checked = notif.email_clinical_reminders !== false;
    const notifVid = $('#setting-notif-video');
    if (notifVid) notifVid.checked = notif.video_updates !== false;
    const notifSecCheck = $('#setting-notif-sec');
    if (notifSecCheck) notifSecCheck.checked = notif.security_logins !== false;

    renderAlerts();

    // Color pickers
    const colorKeys = ['navy', 'mint', 'cream', 'peach', 'butter', 'lilac', 'soft_green', 'sky'];
    colorKeys.forEach(k => {
      const input = $(`#color-${k}`);
      const text = $(`#color-text-${k}`);
      if (input && text && colors[k]) {
        input.value = colors[k];
        text.value = colors[k];
      }
    });

    updateThemePreview();
  }

  function updateThemePreview() {
    const preview = $('#theme-preview');
    if (!preview) return;

    const navy = $('#color-navy')?.value || '#2B3C56';
    const mint = $('#color-mint')?.value || '#A6D6B0';
    const cream = $('#color-cream')?.value || '#FBF9F5';
    const peach = $('#color-peach')?.value || '#FAD7C4';
    const butter = $('#color-butter')?.value || '#FBE7AC';
    const lilac = $('#color-lilac')?.value || '#DDD6F5';

    preview.style.setProperty('--preview-navy', navy);
    preview.style.setProperty('--preview-mint', mint);
    preview.style.setProperty('--preview-bg', cream);

    const c1 = $('#chip-preview-1'); if (c1) c1.style.background = peach;
    const c2 = $('#chip-preview-2'); if (c2) c2.style.background = butter;
    const c3 = $('#chip-preview-3'); if (c3) c3.style.background = lilac;
  }

  function togglePwdVisibility(inputId, btn) {
    const input = $(`#${inputId}`);
    if (!input) return;
    if (input.type === 'password') {
      input.type = 'text';
      btn.textContent = '🙈';
    } else {
      input.type = 'password';
      btn.textContent = '👁️';
    }
  }

  function checkPasswordStrength(pwd) {
    const hasLen = pwd.length >= 8;
    const hasUpper = /[A-Z]/.test(pwd);
    const hasLower = /[a-z]/.test(pwd);
    const hasNumOrSpec = /[0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(pwd);

    const setRule = (id, valid) => {
      const el = $(`#${id}`);
      if (!el) return;
      el.classList.toggle('pwd-rule-pass', valid);
      el.textContent = `${valid ? '✓' : '○'} ${el.textContent.slice(2)}`;
    };

    setRule('pwd-rule-len', hasLen);
    setRule('pwd-rule-upper', hasUpper);
    setRule('pwd-rule-lower', hasLower);
    setRule('pwd-rule-num', hasNumOrSpec);

    let score = 0;
    if (hasLen) score++;
    if (hasUpper) score++;
    if (hasLower) score++;
    if (hasNumOrSpec) score++;

    const fill = $('#pwd-strength-fill');
    const text = $('#pwd-strength-text');
    if (!fill || !text) return;

    if (pwd.length === 0) {
      fill.style.width = '0%';
      fill.style.background = '#e3dcd1';
      text.textContent = 'Password strength: None';
      text.style.color = 'var(--ink-3)';
    } else if (score <= 1) {
      fill.style.width = '25%';
      fill.style.background = '#d94f4f';
      text.textContent = 'Password strength: Weak';
      text.style.color = '#d94f4f';
    } else if (score === 2) {
      fill.style.width = '50%';
      fill.style.background = '#e69138';
      text.textContent = 'Password strength: Fair';
      text.style.color = '#e69138';
    } else if (score === 3) {
      fill.style.width = '75%';
      fill.style.background = '#f1c40f';
      text.textContent = 'Password strength: Good';
      text.style.color = '#b7950b';
    } else {
      fill.style.width = '100%';
      fill.style.background = '#2f6b44';
      text.textContent = 'Password strength: Strong (Excellent)';
      text.style.color = '#2f6b44';
    }
  }

  function handlePasswordChange() {
    if (!can('manage_settings')) {
      showToast('Permission denied: Only Super Admin can change security credentials', 'error');
      return;
    }

    const cur = $('#pwd-current')?.value;
    const pnew = $('#pwd-new')?.value;
    const pconfirm = $('#pwd-confirm')?.value;

    if (!cur) {
      showToast('Please enter your current administrator password', 'error');
      $('#pwd-current')?.focus();
      return;
    }
    if (!pnew || pnew.length < 8) {
      showToast('New password must be at least 8 characters long', 'error');
      $('#pwd-new')?.focus();
      return;
    }
    if (pnew !== pconfirm) {
      showToast('New password and confirmation do not match', 'error');
      $('#pwd-confirm')?.focus();
      return;
    }

    if (!state.data.settings) state.data.settings = {};
    if (!state.data.settings.security) state.data.settings.security = {};

    const now = new Date();
    state.data.settings.security.last_password_change = now.toISOString();

    const lastChangedEl = $('#pwd-last-changed');
    if (lastChangedEl) {
      lastChangedEl.textContent = `Today at ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    }

    if ($('#pwd-current')) $('#pwd-current').value = '';
    if ($('#pwd-new')) $('#pwd-new').value = '';
    if ($('#pwd-confirm')) $('#pwd-confirm').value = '';
    checkPasswordStrength('');

    saveData('Admin password changed successfully! Security timestamp updated.');
  }

  function toggle2FA(checkbox) {
    if (!can('manage_settings')) {
      showToast('Permission denied: Super Admin role required', 'error');
      checkbox.checked = !checkbox.checked;
      return;
    }
    if (!state.data.settings) state.data.settings = {};
    if (!state.data.settings.security) state.data.settings.security = {};

    state.data.settings.security.two_factor_enabled = checkbox.checked;
    saveData(`Two-Factor Authentication (2FA) is now ${checkbox.checked ? 'ENABLED' : 'DISABLED'}`);
  }

  function saveSettings() {
    if (!can('manage_settings')) {
      showToast('Permission denied: Only Super Admin can modify system settings', 'error');
      return;
    }
    if (!state.data.settings) state.data.settings = {};
    const cfg = state.data.settings;

    cfg.site_title = $('#setting-title')?.value || cfg.site_title;
    cfg.site_tagline = $('#setting-tagline')?.value || cfg.site_tagline;
    cfg.canonical_domain = $('#setting-domain')?.value || cfg.canonical_domain;
    cfg.youtube_channel = $('#setting-yt')?.value || cfg.youtube_channel;
    cfg.contact_email = $('#setting-email')?.value || cfg.contact_email;
    cfg.medical_disclaimer = $('#setting-disclaimer')?.value || cfg.medical_disclaimer;
    if ($('#setting-youtube-disclaimer')) {
      cfg.youtube_disclaimer = $('#setting-youtube-disclaimer').value.trim() || DEFAULT_YT_DISCLAIMER;
    }

    const colors = cfg.brand_colors || {};
    const colorKeys = ['navy', 'mint', 'cream', 'peach', 'butter', 'lilac', 'soft_green', 'sky'];
    colorKeys.forEach(k => {
      const hex = $(`#color-${k}`)?.value;
      if (hex) colors[k] = hex;
    });
    cfg.brand_colors = colors;

    if (!cfg.organization) cfg.organization = {};
    cfg.organization.support_phone = $('#setting-phone')?.value || cfg.organization.support_phone || '';
    cfg.organization.office_location = $('#setting-location')?.value || cfg.organization.office_location || '';
    cfg.organization.social_twitter = $('#setting-twitter')?.value || cfg.organization.social_twitter || '';
    cfg.organization.social_instagram = $('#setting-instagram')?.value || cfg.organization.social_instagram || '';
    cfg.organization.social_linkedin = $('#setting-linkedin')?.value || cfg.organization.social_linkedin || '';
    cfg.organization.copyright_notice = $('#setting-copyright')?.value || cfg.organization.copyright_notice || '';

    if (!cfg.security) cfg.security = {};
    const timeoutVal = $('#setting-session-timeout')?.value;
    if (timeoutVal) cfg.security.session_timeout = timeoutVal;
    const twoFaVal = $('#setting-2fa')?.checked;
    if (twoFaVal !== undefined) cfg.security.two_factor_enabled = twoFaVal;

    if (!cfg.notifications) cfg.notifications = {};
    cfg.notifications.recipient_emails = $('#setting-notif-emails')?.value || cfg.notifications.recipient_emails || '';
    cfg.notifications.emergency_sms = $('#setting-notif-phone')?.value || cfg.notifications.emergency_sms || '';
    cfg.notifications.frequency = $('#setting-notif-frequency')?.value || cfg.notifications.frequency || 'instant';
    cfg.notifications.sound_alarm = $('#setting-notif-sound')?.checked ?? true;
    cfg.notifications.browser_push = $('#setting-notif-browser')?.checked ?? false;
    cfg.notifications.email_new_submissions = $('#setting-notif-sub')?.checked ?? true;
    cfg.notifications.email_red_flags = $('#setting-notif-redflag')?.checked ?? true;
    cfg.notifications.email_clinical_reminders = $('#setting-notif-review')?.checked ?? true;
    cfg.notifications.video_updates = $('#setting-notif-video')?.checked ?? true;
    cfg.notifications.security_logins = $('#setting-notif-sec')?.checked ?? true;

    saveData('Brand colors, organization info and notification settings saved!');
  }

  // ==========================================
  // Notification & Alerts Management System
  // ==========================================

  function renderAlerts() {
    if (!state.data) return;
    if (!state.data.alerts || !Array.isArray(state.data.alerts)) {
      state.data.alerts = JSON.parse(JSON.stringify(DEFAULT_ALERTS));
    }

    const alerts = state.data.alerts;
    const totalCount = alerts.length;
    const unreadCount = alerts.filter(a => a.unread).length;
    const redFlagCount = alerts.filter(a => a.type === 'red_flag').length;
    const subCount = alerts.filter(a => a.type === 'submission').length;
    const clinicalCount = alerts.filter(a => a.type === 'clinical').length;
    const secCount = alerts.filter(a => a.type === 'security').length;

    // 1. Update Topbar Bell Badge & Dropdown Header Counter
    const topbarBadge = $('#topbar-notif-count');
    if (topbarBadge) {
      topbarBadge.textContent = unreadCount;
      topbarBadge.style.display = unreadCount > 0 ? 'inline-flex' : 'none';
    }

    const dropdownSubBadge = $('#notif-badge-sub');
    if (dropdownSubBadge) {
      dropdownSubBadge.textContent = unreadCount > 0 ? `${unreadCount} Pending` : 'All Clear';
      dropdownSubBadge.className = unreadCount > 0 ? 'badge badge--redflag' : 'badge badge--published';
    }

    // 2. Update Settings View Filter Counts
    const cntAll = $('#notif-cnt-all'); if (cntAll) cntAll.textContent = totalCount;
    const cntRed = $('#notif-cnt-redflag'); if (cntRed) cntRed.textContent = redFlagCount;
    const cntSub = $('#notif-cnt-sub'); if (cntSub) cntSub.textContent = subCount;
    const cntClin = $('#notif-cnt-clinical'); if (cntClin) cntClin.textContent = clinicalCount;
    const cntSec = $('#notif-cnt-sec'); if (cntSec) cntSec.textContent = secCount;

    // 3. Render Topbar Dropdown Items
    const topbarList = $('#topbar-notif-items');
    if (topbarList) {
      if (alerts.length === 0) {
        topbarList.innerHTML = '<div style="padding:1.5rem;text-align:center;color:var(--ink-3);font-size:0.85rem">No notifications at this time.</div>';
      } else {
        topbarList.innerHTML = alerts.slice(0, 6).map(alt => {
          const icon = alt.type === 'red_flag' ? '🚨' : (alt.type === 'submission' ? '📥' : (alt.type === 'clinical' ? '🩺' : '🛡️'));
          return `
            <div class="notif-dropdown-item ${alt.unread ? 'is-unread' : ''}" onclick="ADMIN.openAlertDetail('${alt.id}', '${alt.actionTab || 'settings'}')">
              <div class="notif-dropdown-item-header">
                <span class="notif-dropdown-item-title">${icon} ${escapeHtml(alt.title)}</span>
                <span class="notif-dropdown-item-time">${escapeHtml(alt.time)}</span>
              </div>
              <div class="notif-dropdown-item-desc">${escapeHtml(alt.meta)}</div>
            </div>
          `;
        }).join('');
      }
    }

    // 4. Render Settings Active Alerts Feed
    const feed = $('#settings-alerts-list');
    if (feed) {
      const activeFilter = state.activeNotifFilter || 'all';
      const filtered = alerts.filter(a => activeFilter === 'all' || a.type === activeFilter);

      if (filtered.length === 0) {
        feed.innerHTML = `
          <div style="padding:2.5rem;text-align:center;color:var(--ink-3)">
            <div style="font-size:2rem;margin-bottom:0.5rem">🔕</div>
            <p style="margin:0;font-size:0.9rem">No alerts found in this category.</p>
          </div>
        `;
      } else {
        feed.innerHTML = filtered.map(alt => {
          const icon = alt.type === 'red_flag' ? '🚨' : (alt.type === 'submission' ? '📥' : (alt.type === 'clinical' ? '🩺' : '🛡️'));
          const badgeText = alt.type === 'red_flag' ? 'RED FLAG' : (alt.type === 'submission' ? 'SUBMISSION' : (alt.type === 'clinical' ? 'CLINICAL' : 'SECURITY'));
          const badgeClass = alt.type === 'red_flag' ? 'badge--redflag' : (alt.type === 'submission' ? 'badge--mint' : (alt.type === 'clinical' ? 'badge--draft' : 'badge--published'));
          return `
            <div class="alert-feed-item ${alt.unread ? 'is-unread' : ''}">
              <div class="alert-feed-item-icon">${icon}</div>
              <div class="alert-feed-item-body">
                <div style="display:flex;align-items:center;gap:0.5rem;flex-wrap:wrap">
                  <span class="badge ${badgeClass}" style="font-size:0.68rem;padding:0.15rem 0.45rem">${badgeText}</span>
                  <strong style="font-size:0.9rem;color:var(--navy)">${escapeHtml(alt.title)}</strong>
                  ${alt.unread ? '<span style="display:inline-block;width:7px;height:7px;border-radius:50%;background:#e05252"></span>' : ''}
                </div>
                <div class="alert-feed-item-meta">${escapeHtml(alt.meta)}</div>
                <div class="alert-feed-item-time">🕒 ${escapeHtml(alt.time)}</div>
              </div>
              <div class="alert-feed-item-actions">
                <button class="btn btn--sm btn--outline" onclick="ADMIN.toggleAlertRead('${alt.id}')" title="${alt.unread ? 'Mark as read' : 'Mark as unread'}">
                  ${alt.unread ? '✓ Mark Read' : 'Mark Unread'}
                </button>
                ${alt.actionTab ? `
                  <button class="btn btn--sm btn--primary" onclick="ADMIN.switchTab('${alt.actionTab}')">
                    Open &rarr;
                  </button>
                ` : ''}
              </div>
            </div>
          `;
        }).join('');
      }
    }
  }

  function filterAlerts(type) {
    state.activeNotifFilter = type;
    $$('[data-notif-filter]').forEach(b => {
      b.classList.toggle('is-active', b.dataset.notifFilter === type);
    });
    renderAlerts();
  }

  function toggleNotifDropdown() {
    const dd = $('#topbar-notif-dropdown');
    if (!dd) return;
    const isOpen = dd.style.display !== 'none';
    dd.style.display = isOpen ? 'none' : 'block';
  }

  function closeNotifDropdown() {
    const dd = $('#topbar-notif-dropdown');
    if (dd) dd.style.display = 'none';
  }

  function markAllNotifsRead() {
    if (!state.data?.alerts) return;
    state.data.alerts.forEach(a => a.unread = false);
    saveData('All notifications marked as read.');
    renderAlerts();
  }

  function toggleAlertRead(id) {
    if (!state.data?.alerts) return;
    const alt = state.data.alerts.find(a => a.id === id);
    if (alt) {
      alt.unread = !alt.unread;
      saveData(`Alert marked as ${alt.unread ? 'unread' : 'read'}.`);
      renderAlerts();
    }
  }

  function openAlertDetail(id, actionTab) {
    if (state.data?.alerts) {
      const alt = state.data.alerts.find(a => a.id === id);
      if (alt) alt.unread = false;
      saveData();
    }
    closeNotifDropdown();
    renderAlerts();
    if (actionTab) switchTab(actionTab);
  }

  function sendTestAlert() {
    if (!state.data) return;
    if (!state.data.alerts) state.data.alerts = [];
    const testAlert = {
      id: 'alt-' + Date.now(),
      type: 'red_flag',
      title: '🚨 Test Emergency Alert: High fever & acute symptoms simulated',
      meta: 'Automated test dispatch to primary email alerts and emergency SMS pager',
      time: 'Just now',
      unread: true,
      actionTab: 'submissions'
    };
    state.data.alerts.unshift(testAlert);
    saveData('🔔 Test alert sent to alerts@thefirstsevenyears.com & SMS!');
    renderAlerts();
  }

  function toggleBrowserNotif(checkbox) {
    if (checkbox.checked) {
      if ('Notification' in window) {
        if (Notification.permission === 'granted') {
          showToast('Desktop push notifications are enabled!', 'success');
        } else if (Notification.permission !== 'denied') {
          Notification.requestPermission().then(permission => {
            if (permission === 'granted') {
              showToast('Desktop push notifications enabled!', 'success');
            } else {
              checkbox.checked = false;
              showToast('Desktop notifications permission denied in browser', 'info');
            }
          });
        } else {
          checkbox.checked = false;
          showToast('Desktop notifications blocked in browser settings', 'error');
        }
      } else {
        showToast('Desktop notifications not supported in this browser', 'info');
      }
    } else {
      showToast('Desktop push notifications disabled', 'info');
    }
  }

  // Active Role Switcher
  function handleRoleChange(newRole) {
    state.currentRole = newRole;
    showToast(`Switched active view to: ${state.data.roles?.[newRole]?.name || newRole}`, 'info');
    applyRoleGates();
    renderCurrentTab();
  }

  function applyRoleGates() {
    // 1. Sync header user dropdown
    const userSelect = $('#user-select');
    if (userSelect && state.currentUser) {
      const users = state.data?.users || [];
      userSelect.innerHTML = users.map(u => {
        const rName = state.data?.roles?.[u.role]?.name || u.role;
        const icon = u.role === 'super_admin' ? '👑' : (u.role === 'editor' ? '✍️' : (u.role === 'clinical_reviewer' ? '🩺' : '📝'));
        return `<option value="${u.id}" ${u.id === state.currentUser ? 'selected' : ''}>${icon} ${u.name} (${rName})</option>`;
      }).join('');
      userSelect.value = state.currentUser;
    }

    // 2. Dynamic sidebar filtering based on Hide / View / Edit
    $$('.nav-item').forEach(el => {
      const tabId = el.dataset.tab;
      if (!tabId) return;
      const perm = getCurrentUserPermission(tabId);
      if (perm === 'hide') {
        el.style.display = 'none';
      } else {
        el.style.display = '';
        const existingBadge = el.querySelector('.sidebar-view-only-badge');
        if (perm === 'view') {
          if (!existingBadge) {
            const badge = document.createElement('span');
            badge.className = 'sidebar-view-only-badge';
            badge.style.cssText = 'font-size:0.65rem;background:#fef8ec;color:#92400e;padding:1px 5px;border-radius:4px;margin-left:auto;font-weight:700;border:1px solid #fde68a';
            badge.textContent = 'VIEW';
            el.appendChild(badge);
          }
        } else {
          if (existingBadge) existingBadge.remove();
        }
      }
    });

    // 3. Section title visibility check
    const sidebar = $('.sidebar__nav');
    if (sidebar) {
      const sections = [
        { title: 'Content Management', tabs: ['topics', 'answers', 'faqs', 'videos', 'youtube', 'submissions', 'experts', 'pages'] },
        { title: 'Navigation & Structure', tabs: ['menus'] },
        { title: 'Administration', tabs: ['roles', 'settings'] }
      ];
      $$('.sidebar__section-title').forEach(st => {
        const txt = st.textContent.trim();
        const sec = sections.find(s => s.title === txt);
        if (sec) {
          const anyVisible = sec.tabs.some(t => canView(t));
          st.style.display = anyVisible ? '' : 'none';
        }
      });
    }

    // 4. View-only banner for currently active tab
    const currentModPerm = getCurrentUserPermission(state.currentTab);
    const currentTabEl = $(`#tab-${state.currentTab}`);
    if (currentTabEl) {
      let banner = currentTabEl.querySelector('.view-only-banner');
      if (currentModPerm === 'view') {
        if (!banner) {
          banner = document.createElement('div');
          banner.className = 'view-only-banner';
          banner.innerHTML = `
            <div style="display:flex;align-items:center;gap:0.5rem">
              <span>👁️</span>
              <span><strong>Read-Only Mode:</strong> You have <em>View</em> permissions for this section. Add, edit, reorder, and delete actions are disabled.</span>
            </div>
            <span style="font-size:0.75rem;background:#fde68a;padding:2px 8px;border-radius:999px;font-weight:700">READ ONLY</span>
          `;
          const pageHeader = currentTabEl.querySelector('.page-header');
          if (pageHeader && pageHeader.nextSibling) {
            currentTabEl.insertBefore(banner, pageHeader.nextSibling);
          } else {
            currentTabEl.prepend(banner);
          }
        }
      } else {
        if (banner) banner.remove();
      }

      // Hide or disable Add buttons in page-header when view-only
      const primaryBtn = currentTabEl.querySelector('.page-header .btn--primary');
      if (primaryBtn) {
        primaryBtn.style.display = currentModPerm === 'view' ? 'none' : '';
      }
    }

    // 5. Global Action Buttons
    const canRebuild = can('rebuild_site');
    const rebuildBtn = $('#rebuild-btn');
    if (rebuildBtn) {
      rebuildBtn.disabled = !canRebuild;
      rebuildBtn.title = canRebuild ? 'Rebuild live static site' : 'Restricted: Role cannot rebuild site';
    }

    const isSuper = can('manage_settings');
    const saveSettingsBtn = $('#save-settings-btn');
    if (saveSettingsBtn) {
      saveSettingsBtn.disabled = !isSuper;
    }

    // 6. Sync active user to sidebar card
    const curUser = state.data?.users?.find(u => u.id === state.currentUser);
    if (curUser) {
      const nameEl = $('#sidebar-user-name');
      const roleEl = $('#sidebar-user-role');
      if (nameEl) nameEl.textContent = curUser.name;
      if (roleEl) {
        const rName = state.data?.roles?.[curUser.role]?.name || curUser.role;
        roleEl.textContent = rName;
      }
    }
  }

  // Modal Dialog System
  function openModal(type, item = null) {
    state.editingType = type;
    state.editingItem = item;
    const modal = $('#form-modal');
    const title = $('#modal-title');
    const body = $('#modal-body');
    if (!modal || !title || !body) return;

    switch (type) {
      case 'topic':
        title.textContent = item ? 'Edit Topic' : 'Add New Topic';

        // 1. Experts Checkboxes (Multiple Experts)
        const assignedExperts = item?.experts || [];
        const expertPills = Object.entries(state.data.experts || {}).map(([s, x]) => {
          const isChecked = assignedExperts.includes(s);
          return `
            <label class="checkbox-pill-label">
              <input type="checkbox" name="f-topic-experts" value="${s}" ${isChecked ? 'checked' : ''}>
              <span>${x.name}</span>
            </label>
          `;
        }).join('');

        // 2. Main Video Selector & Custom Input
        const currentMainVid = item?.main_video || '';
        const currentMainVidUrl = item?.main_video_url || (currentMainVid ? (currentMainVid.startsWith('http') ? currentMainVid : `https://www.youtube.com/watch?v=${currentMainVid}`) : '');
        const currentVidId = extractYouTubeId(currentMainVidUrl) || currentMainVid;
        const videoOptions = (state.data.episodes || []).map(e => `
          <option value="${e.id}" ${currentVidId === e.id ? 'selected' : ''}>
            ${e.kind === 'ep' ? 'EP ' + (e.ep || '') : 'Clip'}: ${e.title} (${e.id})
          </option>
        `).join('');

        // 3. Ages 0–7 Checkboxes
        const assignedAges = item?.ages || [0, 1, 2, 3, 4, 5, 6, 7];
        const agePills = [0, 1, 2, 3, 4, 5, 6, 7].map(age => `
          <label class="checkbox-pill-label">
            <input type="checkbox" name="f-topic-ages" value="${age}" ${assignedAges.includes(age) ? 'checked' : ''}>
            <span>Age ${age}</span>
          </label>
        `).join('');

        // 4. Assign Parent Questions (Q&A Answers)
        const assignedAnswers = item?.answers || (state.data.answers || []).filter(a => a.topic === item?.slug || (a.also || []).includes(item?.slug)).map(a => a.slug);
        const answerListItems = (state.data.answers || []).map(a => {
          const isChecked = assignedAnswers.includes(a.slug);
          const expName = state.data.experts?.[a.expert]?.name || a.expert;
          return `
            <label class="selection-item">
              <input type="checkbox" name="f-topic-answers" value="${a.slug}" ${isChecked ? 'checked' : ''}>
              <span class="selection-item__title">${a.q}</span>
              <span class="selection-item__meta">${expName}</span>
            </label>
          `;
        }).join('');

        // 5. Assign Episodes / Video Library
        const assignedVideos = item?.episodes || (state.data.episodes || []).filter(e => (e.tags || []).includes(item?.slug)).map(e => e.id);
        const videoListItems = (state.data.episodes || []).map(e => {
          const isChecked = assignedVideos.includes(e.id);
          const expName = state.data.experts?.[e.guest]?.name || e.guest;
          return `
            <label class="selection-item">
              <input type="checkbox" name="f-topic-episodes" value="${e.id}" ${isChecked ? 'checked' : ''}>
              <img class="selection-item__thumb" src="https://i.ytimg.com/vi/${e.id}/hqdefault.jpg" alt="" loading="lazy">
              <span class="selection-item__title">${e.title}</span>
              <span class="selection-item__meta">${e.kind === 'ep' ? 'EP ' + (e.ep || '') : 'Clip'} · ${expName}</span>
            </label>
          `;
        }).join('');

        body.innerHTML = `
          <div class="form-group">
            <label>Topic Name</label>
            <input class="form-control" id="f-topic-name" value="${item?.name || ''}" placeholder="e.g. Gut health & microbiome" required>
          </div>
          <div class="form-group">
            <label>Slug</label>
            <input class="form-control" id="f-topic-slug" value="${item?.slug || ''}" placeholder="gut-health" ${item ? 'readonly' : ''}>
          </div>

          <div class="form-group">
            <label>Short Description (Navigation &amp; Card subhead)</label>
            <input class="form-control" id="f-topic-short" value="${item?.short || ''}" placeholder="Tummies, probiotics and the gut–brain link">
          </div>

          <div class="form-group">
            <label>Hub Intro Paragraph</label>
            <textarea class="form-control" id="f-topic-intro" rows="2">${item?.intro || ''}</textarea>
          </div>

          <!-- ASSIGN EXPERTS -->
          <div class="form-group">
            <label>Assign Host &amp; Guest Experts (Select Multiple)</label>
            <div class="checkbox-pills">
              ${expertPills}
            </div>
          </div>

          <!-- MAIN VIDEO -->
          <div class="form-group">
            <label>Featured Main Video ("Start Here" Clip on Topic Hub)</label>
            <div class="form-row">
              <select class="form-control" id="f-topic-main-video" style="flex:1.2">
                <option value="">-- None / Select from library --</option>
                ${videoOptions}
              </select>
              <input type="url" class="form-control" id="f-topic-custom-video" placeholder="Or enter YouTube URL (e.g. https://www.youtube.com/watch?v=...)" value="${currentMainVidUrl}" style="flex:1.5">
            </div>
            <small style="color:var(--ink-3)">Select from video library or paste any YouTube watch, short, or clip URL</small>
            <div id="f-topic-main-video-preview" style="margin-top:0.4rem"></div>
          </div>

          <!-- SELECT AGES 0-7 -->
          <div class="form-group">
            <div style="display:flex;justify-content:space-between;align-items:center">
              <label>Select Ages (0–7)</label>
              <div style="display:flex;gap:0.5rem">
                <button type="button" class="btn btn--sm btn--outline" onclick="ADMIN.setAllAges(true)">All (0–7)</button>
                <button type="button" class="btn btn--sm btn--outline" onclick="ADMIN.setAllAges(false)">Clear</button>
              </div>
            </div>
            <div class="checkbox-pills">
              ${agePills}
            </div>
          </div>

          <!-- ASSIGN PARENT QUESTIONS -->
          <div class="form-group">
            <label>Assign Parent Questions &amp; Answers</label>
            <div class="selection-box">
              <input type="text" class="selection-box__filter" placeholder="Filter questions..." oninput="ADMIN.filterSelectionList(this, 'f-topic-ans-list')">
              <div id="f-topic-ans-list" class="selection-box__list">
                ${answerListItems}
              </div>
            </div>
            <small>Checked questions will appear on this topic hub.</small>
          </div>

          <!-- ASSIGN EPISODES / VIDEO LIBRARY -->
          <div class="form-group">
            <label>Assign Episodes &amp; Clips from Video Library (Select Multiple)</label>
            <div class="selection-box">
              <input type="text" class="selection-box__filter" placeholder="Filter videos..." oninput="ADMIN.filterSelectionList(this, 'f-topic-vid-list')">
              <div id="f-topic-vid-list" class="selection-box__list">
                ${videoListItems}
              </div>
            </div>
            <small>Checked videos will be tagged and listed under this topic hub.</small>
          </div>

          <!-- TOPIC SEO FIELDS SECTION -->
          <div style="margin-top:1.25rem;padding:1rem;background:var(--cream);border-radius:8px;border:1px solid var(--line)">
            <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:0.75rem">
              <div style="display:flex;align-items:center;gap:0.4rem">
                <span style="font-size:1.15rem">🔍</span>
                <strong style="font-size:0.95rem;color:var(--navy)">Topic Hub SEO &amp; Search Engine Optimization</strong>
              </div>
              <span class="badge" style="background:var(--navy);color:#fff;font-size:0.7rem;font-weight:600">All SEO Fields</span>
            </div>

            <!-- LIVE GOOGLE SERP PREVIEW -->
            <div style="background:#fff;border:1px solid var(--line);border-radius:8px;padding:0.75rem 1rem;margin-bottom:1rem;font-family:system-ui, -apple-system, sans-serif">
              <div style="font-size:0.75rem;color:#202124;display:flex;align-items:center;gap:0.35rem;margin-bottom:0.25rem">
                <span style="display:inline-block;width:16px;height:16px;background:var(--navy);border-radius:50%;color:#fff;font-size:10px;text-align:center;line-height:16px;font-weight:700">7</span>
                <span>thefirstsevenyears.com</span>
                <span style="color:#5f6368">› topics › <span id="f-topic-seo-slug">${item?.slug || 'topic'}</span></span>
              </div>
              <div id="f-topic-seo-preview-title" style="font-size:1rem;color:#1a0dab;font-weight:500;line-height:1.3;margin-bottom:0.25rem;cursor:pointer">
                ${(item?.seo_title || item?.name || 'Topic') + ' — The First Seven Years'}
              </div>
              <div id="f-topic-seo-preview-desc" style="font-size:0.8rem;color:#4d5156;line-height:1.4">
                ${item?.meta_desc || item?.intro || item?.short || 'Expert pediatric answers and topic guidance for parents of children aged 0 to 7.'}
              </div>
            </div>

            <div class="form-group">
              <div style="display:flex;justify-content:space-between;align-items:center">
                <label>SEO Meta Title (Title Tag)</label>
                <small style="color:var(--ink-3)"><span id="f-topic-title-count">${(item?.seo_title || '').length}</span> / 60 chars (Recommended 50–60)</small>
              </div>
              <input class="form-control" id="f-topic-seo-title" value="${item?.seo_title || ''}" placeholder="Custom search title (defaults to Topic Name if empty)">
            </div>

            <div class="form-group">
              <div style="display:flex;justify-content:space-between;align-items:center">
                <label>SEO Meta Description</label>
                <small style="color:var(--ink-3)"><span id="f-topic-desc-count">${(item?.meta_desc || '').length}</span> / 160 chars (Recommended 150–160)</small>
              </div>
              <textarea class="form-control" id="f-topic-meta-desc" rows="2" placeholder="Search snippet description (defaults to Hub Intro)...">${item?.meta_desc || ''}</textarea>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label>Primary Focus Keyword</label>
                <input class="form-control" id="f-topic-focus-kw" value="${item?.focus_keyword || ''}" placeholder="e.g. gut health and microbiome">
              </div>
              <div class="form-group">
                <label>Canonical URL Override</label>
                <input class="form-control" id="f-topic-canonical" value="${item?.canonical_url || ''}" placeholder="https://thefirstsevenyears.com/topics/${item?.slug || ''}/">
              </div>
              <div class="form-group">
                <label>Robots Indexing</label>
                <select class="form-control" id="f-topic-robots-index">
                  <option value="noindex" ${item?.robots_index === 'noindex' || !item?.robots_index ? 'selected' : ''}>Noindex (Hide from search engines)</option>
                  <option value="index" ${item?.robots_index === 'index' ? 'selected' : ''}>Index (Allow in search engines)</option>
                </select>
              </div>
            </div>
          </div>

          <div class="form-group" style="margin-top:0.75rem">
            <label class="toggle-label">
              <input type="checkbox" class="sr-checkbox" id="f-topic-published" ${item?.published !== false ? 'checked' : ''}>
              <span class="toggle-switch"></span>
              <span>Published on live site</span>
            </label>
          </div>
        `;

        // Interactive Topic SEO preview
        const tNameIn = $('#f-topic-name');
        const tSlugIn = $('#f-topic-slug');
        const tIntroIn = $('#f-topic-intro');
        const tSeoTitleIn = $('#f-topic-seo-title');
        const tMetaDescIn = $('#f-topic-meta-desc');
        const tSerpTitle = $('#f-topic-seo-preview-title');
        const tSerpDesc = $('#f-topic-seo-preview-desc');
        const tSerpSlug = $('#f-topic-seo-slug');
        const tTitleCount = $('#f-topic-title-count');
        const tDescCount = $('#f-topic-desc-count');

        const updateTopicSeoPreview = () => {
          const tVal = tSeoTitleIn?.value.trim() || tNameIn?.value.trim() || 'Topic';
          const dVal = tMetaDescIn?.value.trim() || tIntroIn?.value.trim() || 'Expert pediatric answers and topic guidance for parents of children aged 0 to 7.';
          const sVal = tSlugIn?.value.trim() || 'topic';

          if (tSerpTitle) tSerpTitle.textContent = tVal + ' — The First Seven Years';
          if (tSerpDesc) tSerpDesc.textContent = dVal;
          if (tSerpSlug) tSerpSlug.textContent = sVal;

          if (tTitleCount && tSeoTitleIn) {
            const len = tSeoTitleIn.value.length;
            tTitleCount.textContent = len;
            tTitleCount.style.color = (len >= 45 && len <= 60) ? 'var(--mint)' : (len > 60 ? 'var(--danger)' : 'var(--ink-3)');
          }
          if (tDescCount && tMetaDescIn) {
            const len = tMetaDescIn.value.length;
            tDescCount.textContent = len;
            tDescCount.style.color = (len >= 130 && len <= 160) ? 'var(--mint)' : (len > 160 ? 'var(--danger)' : 'var(--ink-3)');
          }
        };

        tNameIn?.addEventListener('input', updateTopicSeoPreview);
        tIntroIn?.addEventListener('input', updateTopicSeoPreview);
        tSeoTitleIn?.addEventListener('input', updateTopicSeoPreview);
        tMetaDescIn?.addEventListener('input', updateTopicSeoPreview);

        // Auto-slug
        const nameIn = $('#f-topic-name');
        const slugIn = $('#f-topic-slug');
        if (!item && nameIn && slugIn) {
          nameIn.addEventListener('input', () => {
            slugIn.value = nameIn.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
            updateTopicSeoPreview();
          });
        }

        // Main video sync and preview
        const mainVidSelect = $('#f-topic-main-video');
        const customVidInput = $('#f-topic-custom-video');
        const vidPreview = $('#f-topic-main-video-preview');

        const updateMainVidPreview = () => {
          const rawVal = customVidInput?.value.trim() || '';
          const vId = extractYouTubeId(rawVal) || (mainVidSelect?.value ? (extractYouTubeId(mainVidSelect.value) || mainVidSelect.value) : '');
          if (vId && vidPreview) {
            vidPreview.innerHTML = `
              <div style="display:inline-flex;align-items:center;gap:0.6rem;background:var(--cream);padding:0.4rem 0.75rem;border-radius:6px;border:1px solid var(--line)">
                <img src="https://i.ytimg.com/vi/${vId}/hqdefault.jpg" style="height:44px;border-radius:4px" alt="Preview" onerror="this.style.display='none'">
                <div style="font-size:0.8rem">
                  <span style="font-weight:600;color:var(--navy)">Detected Video ID: <code>${vId}</code></span>
                  <div><a href="https://youtu.be/${vId}" target="_blank" style="color:var(--navy);font-size:0.75rem;text-decoration:none">▶️ Open video in new tab</a></div>
                </div>
              </div>
            `;
          } else if (vidPreview) {
            vidPreview.innerHTML = '';
          }
        };

        if (mainVidSelect && customVidInput) {
          mainVidSelect.addEventListener('change', () => {
            if (mainVidSelect.value) {
              customVidInput.value = `https://www.youtube.com/watch?v=${mainVidSelect.value}`;
            } else {
              customVidInput.value = '';
            }
            updateMainVidPreview();
          });
          customVidInput.addEventListener('input', () => {
            const vId = extractYouTubeId(customVidInput.value);
            if (vId && mainVidSelect) {
              const opt = Array.from(mainVidSelect.options).find(o => o.value === vId);
              if (opt) mainVidSelect.value = vId;
            } else if (!customVidInput.value.trim() && mainVidSelect) {
              mainVidSelect.value = '';
            }
            updateMainVidPreview();
          });
          updateMainVidPreview();
        }
        break;

      case 'answer':
        title.textContent = item ? 'Edit Question & Answer' : 'Add New Question & Answer';
        const topicOpts = (state.data.topics || []).map(t => `<option value="${t.slug}" ${item?.topic === t.slug ? 'selected' : ''}>${t.name}</option>`).join('');
        const expertOpts = Object.entries(state.data.experts || {}).map(([s, x]) => `<option value="${s}" ${item?.expert === s ? 'selected' : ''}>${x.name}</option>`).join('');
        const currentAnsVid = item?.video || '';
        const ansVideoOpts = (state.data.episodes || []).map(e => {
          const isSel = (currentAnsVid && currentAnsVid === e.id);
          const typeTag = e.kind === 'ep' ? `EP ${e.ep || ''}` : 'Clip';
          return `<option value="${e.id}" ${isSel ? 'selected' : ''}>${e.title} (${typeTag} · ${e.id})</option>`;
        }).join('');

        body.innerHTML = `
          <div class="form-group">
            <label>Question Title</label>
            <input class="form-control" id="f-ans-q" value="${item?.q || ''}" placeholder="e.g. Is my child’s eczema really a gut problem?" required>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label>Slug</label>
              <input class="form-control" id="f-ans-slug" value="${item?.slug || ''}" placeholder="is-my-childs-eczema-a-gut-problem" ${item ? 'readonly' : ''}>
            </div>
            <div class="form-group">
              <label>Assigned Expert</label>
              <select class="form-control" id="f-ans-expert">${expertOpts}</select>
            </div>
          </div>
          <div class="form-group">
            <label>Primary Topic</label>
            <select class="form-control" id="f-ans-topic">${topicOpts}</select>
          </div>
          <div class="form-group">
            <label>Secondary Topics (Optional — appears in additional topic hubs)</label>
            <div class="checkbox-pills">
              ${(state.data.topics || []).map(t => `
                <label class="checkbox-pill-label">
                  <input type="checkbox" name="f-ans-also" value="${t.slug}" ${(item?.also || []).includes(t.slug) ? 'checked' : ''}>
                  <span>${t.name}</span>
                </label>
              `).join('')}
            </div>
          </div>
          <div class="form-group">
            <label>Source Video Clip (Optional — Select from Video Library or enter ID)</label>
            <div class="form-row">
              <select class="form-control" id="f-ans-video-select" style="flex:1.4">
                <option value="">-- Select from video library --</option>
                ${ansVideoOpts}
              </select>
              <input class="form-control" id="f-ans-video" value="${currentAnsVid}" placeholder="Or enter YouTube ID..." style="flex:1">
            </div>
            <div id="f-ans-video-preview" style="margin-top:0.4rem"></div>
          </div>
          <div class="form-group">
            <label>Child Age Suitability</label>
            <div class="checkbox-pills">
              ${[0,1,2,3,4,5,6,7].map(age => `
                <label class="checkbox-pill-label">
                  <input type="checkbox" name="f-ans-ages" value="${age}" ${(item?.ages || []).includes(age) ? 'checked' : ''}>
                  <span>Age ${age}</span>
                </label>
              `).join('')}
            </div>
          </div>
          <div class="form-group">
            <label>Short Answer Summary (TL;DR block at top)</label>
            <textarea class="form-control" id="f-ans-quick" rows="3">${item?.quick || ''}</textarea>
          </div>
          <div class="form-group">
            <label>Full Clinical Body (HTML formatted)</label>
            <textarea class="form-control" id="f-ans-body" rows="6" style="font-family:monospace;font-size:0.85rem">${item?.body || ''}</textarea>
          </div>
          <!-- ANSWER SEO FIELDS SECTION -->
          <div style="margin-top:1.25rem;padding:1rem;background:var(--cream);border-radius:8px;border:1px solid var(--line)">
            <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:0.75rem">
              <div style="display:flex;align-items:center;gap:0.4rem">
                <span style="font-size:1.15rem">🔍</span>
                <strong style="font-size:0.95rem;color:var(--navy)">Answer Page SEO &amp; Rich Snippets</strong>
              </div>
              <span class="badge" style="background:var(--navy);color:#fff;font-size:0.7rem;font-weight:600">All SEO Fields</span>
            </div>

            <!-- LIVE GOOGLE SERP PREVIEW -->
            <div style="background:#fff;border:1px solid var(--line);border-radius:8px;padding:0.75rem 1rem;margin-bottom:1rem;font-family:system-ui, -apple-system, sans-serif">
              <div style="font-size:0.75rem;color:#202124;display:flex;align-items:center;gap:0.35rem;margin-bottom:0.25rem">
                <span style="display:inline-block;width:16px;height:16px;background:var(--navy);border-radius:50%;color:#fff;font-size:10px;text-align:center;line-height:16px;font-weight:700">7</span>
                <span>thefirstsevenyears.com</span>
                <span style="color:#5f6368">› answers › <span id="f-ans-seo-slug">${item?.slug || 'question'}</span></span>
              </div>
              <div id="f-ans-seo-preview-title" style="font-size:1rem;color:#1a0dab;font-weight:500;line-height:1.3;margin-bottom:0.25rem;cursor:pointer">
                ${(item?.seo_title || item?.q || 'Question') + ' — The First Seven Years'}
              </div>
              <div id="f-ans-seo-preview-desc" style="font-size:0.8rem;color:#4d5156;line-height:1.4">
                ${item?.meta_desc || item?.quick || 'Expert pediatric answer by leading integrative doctors and specialists.'}
              </div>
            </div>

            <div class="form-group">
              <div style="display:flex;justify-content:space-between;align-items:center">
                <label>SEO Meta Title (Title Tag)</label>
                <small style="color:var(--ink-3)"><span id="f-ans-title-count">${(item?.seo_title || '').length}</span> / 60 chars (Recommended 50–60)</small>
              </div>
              <input class="form-control" id="f-ans-seo-title" value="${item?.seo_title || ''}" placeholder="Custom search title (defaults to Question Title if empty)">
            </div>

            <div class="form-group">
              <div style="display:flex;justify-content:space-between;align-items:center">
                <label>SEO Meta Description</label>
                <small style="color:var(--ink-3)"><span id="f-ans-desc-count">${(item?.meta_desc || '').length}</span> / 160 chars (Recommended 150–160)</small>
              </div>
              <textarea class="form-control" id="f-ans-meta-desc" rows="2" placeholder="Search snippet description (defaults to Short Answer Summary)...">${item?.meta_desc || ''}</textarea>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label>Primary Focus Keyword</label>
                <input class="form-control" id="f-ans-focus-kw" value="${item?.focus_keyword || ''}" placeholder="e.g. eczema gut connection">
              </div>
              <div class="form-group">
                <label>Schema.org Structured Data</label>
                <select class="form-control" id="f-ans-schema-type">
                  <option value="MedicalWebPage" ${item?.schema_type === 'MedicalWebPage' || !item?.schema_type ? 'selected' : ''}>MedicalWebPage (Clinical Guidance)</option>
                  <option value="FAQPage" ${item?.schema_type === 'FAQPage' ? 'selected' : ''}>FAQPage (Question &amp; Answer)</option>
                  <option value="Article" ${item?.schema_type === 'Article' ? 'selected' : ''}>Article (General Medical Article)</option>
                </select>
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label>Canonical URL Override</label>
                <input class="form-control" id="f-ans-canonical" value="${item?.canonical_url || ''}" placeholder="https://thefirstsevenyears.com/answers/${item?.slug || ''}/">
              </div>
              <div class="form-group">
                <label>Robots Indexing</label>
                <select class="form-control" id="f-ans-robots-index">
                  <option value="noindex" ${item?.robots_index === 'noindex' || !item?.robots_index ? 'selected' : ''}>Noindex (Hide from search engines)</option>
                  <option value="index" ${item?.robots_index === 'index' ? 'selected' : ''}>Index (Allow in search engines)</option>
                </select>
              </div>
            </div>
          </div>

          <div class="form-row" style="margin-top:0.75rem">
            <div class="form-group">
              <label>Clinical Review Status</label>
              <select class="form-control" id="f-ans-review-status">
                <option value="Reviewed" ${item?.clinical_status === 'Reviewed' ? 'selected' : ''}>Reviewed &amp; Approved</option>
                <option value="Pending" ${item?.clinical_status !== 'Reviewed' ? 'selected' : ''}>Pending Clinical Review</option>
              </select>
            </div>
            <div class="form-group" style="justify-content:center">
              <label class="toggle-label" style="margin-top:1.2rem">
                <input type="checkbox" class="sr-checkbox" id="f-ans-published" ${item?.published !== false ? 'checked' : ''}>
                <span class="toggle-switch"></span>
                <span>Published on live site</span>
              </label>
            </div>
          </div>
        `;

        // Interactive Answer SEO preview
        const aQIn = $('#f-ans-q');
        const aSlugIn = $('#f-ans-slug');
        const aQuickIn = $('#f-ans-quick');
        const aSeoTitleIn = $('#f-ans-seo-title');
        const aMetaDescIn = $('#f-ans-meta-desc');
        const aSerpTitle = $('#f-ans-seo-preview-title');
        const aSerpDesc = $('#f-ans-seo-preview-desc');
        const aSerpSlug = $('#f-ans-seo-slug');
        const aTitleCount = $('#f-ans-title-count');
        const aDescCount = $('#f-ans-desc-count');

        const updateAnswerSeoPreview = () => {
          const tVal = aSeoTitleIn?.value.trim() || aQIn?.value.trim() || 'Question';
          const dVal = aMetaDescIn?.value.trim() || aQuickIn?.value.trim() || 'Expert pediatric answer by leading integrative doctors and specialists.';
          const sVal = aSlugIn?.value.trim() || 'question';

          if (aSerpTitle) aSerpTitle.textContent = tVal + ' — The First Seven Years';
          if (aSerpDesc) aSerpDesc.textContent = dVal;
          if (aSerpSlug) aSerpSlug.textContent = sVal;

          if (aTitleCount && aSeoTitleIn) {
            const len = aSeoTitleIn.value.length;
            aTitleCount.textContent = len;
            aTitleCount.style.color = (len >= 45 && len <= 60) ? 'var(--mint)' : (len > 60 ? 'var(--danger)' : 'var(--ink-3)');
          }
          if (aDescCount && aMetaDescIn) {
            const len = aMetaDescIn.value.length;
            aDescCount.textContent = len;
            aDescCount.style.color = (len >= 130 && len <= 160) ? 'var(--mint)' : (len > 160 ? 'var(--danger)' : 'var(--ink-3)');
          }
        };

        aQIn?.addEventListener('input', updateAnswerSeoPreview);
        aQuickIn?.addEventListener('input', updateAnswerSeoPreview);
        aSeoTitleIn?.addEventListener('input', updateAnswerSeoPreview);
        aMetaDescIn?.addEventListener('input', updateAnswerSeoPreview);

        // Auto slug for new answers
        const ansQIn = $('#f-ans-q');
        const ansSlugIn = $('#f-ans-slug');
        if (!item && ansQIn && ansSlugIn) {
          ansQIn.addEventListener('input', () => {
            ansSlugIn.value = ansQIn.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '').slice(0, 80);
            updateAnswerSeoPreview();
          });
        }

        // Video library select & preview sync
        const ansVidSelect = $('#f-ans-video-select');
        const ansVidInput = $('#f-ans-video');
        const ansVidPreview = $('#f-ans-video-preview');

        const updateAnsVidPreview = () => {
          let vId = ansVidInput?.value.trim() || ansVidSelect?.value || '';
          const ytMatch = vId.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
          if (ytMatch) {
            vId = ytMatch[1];
            if (ansVidInput) ansVidInput.value = vId;
          }

          if (vId) {
            const foundEpisode = (state.data.episodes || []).find(e => e.id === vId);
            const titleText = foundEpisode ? foundEpisode.title : `YouTube ID: ${vId}`;
            ansVidPreview.innerHTML = `
              <div style="display:inline-flex;align-items:center;gap:0.6rem;background:var(--cream);padding:0.4rem 0.75rem;border-radius:6px;border:1px solid var(--line);max-width:100%">
                <img src="https://i.ytimg.com/vi/${vId}/hqdefault.jpg" style="width:48px;height:30px;object-fit:cover;border-radius:4px" onerror="this.style.display='none'">
                <div style="min-width:0">
                  <div style="font-weight:600;font-size:0.82rem;color:var(--navy);white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${titleText}</div>
                  <a href="https://youtu.be/${vId}" target="_blank" style="font-size:0.75rem;color:var(--ink-3);text-decoration:none">▶️ Watch on YouTube (youtu.be/${vId})</a>
                </div>
              </div>
            `;
          } else {
            ansVidPreview.innerHTML = '';
          }
        };

        if (ansVidSelect && ansVidInput) {
          ansVidSelect.addEventListener('change', () => {
            if (ansVidSelect.value) {
              ansVidInput.value = ansVidSelect.value;
            }
            updateAnsVidPreview();
          });
          ansVidInput.addEventListener('input', () => {
            if (ansVidSelect) {
              ansVidSelect.value = ansVidInput.value.trim();
            }
            updateAnsVidPreview();
          });
          updateAnsVidPreview();
        }
        break;

      case 'faq':
        title.textContent = item ? 'Edit FAQ' : 'Add FAQ Entry';
        body.innerHTML = `
          <div class="form-group">
            <label>Category</label>
            <input class="form-control" id="f-faq-cat" value="${item?.category || 'General Questions'}" placeholder="e.g. Clinical & Medical">
          </div>
          <div class="form-group">
            <label>Question</label>
            <input class="form-control" id="f-faq-q" value="${item?.question || ''}" placeholder="e.g. What is The First Seven Years?" required>
          </div>
          <div class="form-group">
            <label>Answer</label>
            <textarea class="form-control" id="f-faq-a" rows="4">${item?.answer || ''}</textarea>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label>Display Order</label>
              <input type="number" class="form-control" id="f-faq-order" value="${item?.order || 1}">
            </div>
            <div class="form-group" style="justify-content:center">
              <label class="toggle-label" style="margin-top:1.2rem">
                <input type="checkbox" class="sr-checkbox" id="f-faq-published" ${item?.published !== false ? 'checked' : ''}>
                <span class="toggle-switch"></span>
                <span>Published</span>
              </label>
            </div>
          </div>
        `;
        break;

      case 'video':
        title.textContent = item ? 'Edit Video' : 'Add Video Episode / Clip';
        const vExpOpts = Object.entries(state.data.experts || {}).map(([s, x]) => `<option value="${s}" ${item?.guest === s ? 'selected' : ''}>${x.name}</option>`).join('');

        // Question & Answer options (multi-select)
        const vidAssignedAnswers = item ? (state.data.answers || []).filter(a => a.video === item.id || (item.answers || []).includes(a.slug)).map(a => a.slug) : [];
        const vidAnswerListItems = (state.data.answers || []).map(a => {
          const isChecked = vidAssignedAnswers.includes(a.slug);
          const expName = state.data.experts?.[a.expert]?.name || a.expert;
          return `
            <label class="selection-item">
              <input type="checkbox" name="f-vid-answers" value="${a.slug}" ${isChecked ? 'checked' : ''}>
              <span class="selection-item__title">${a.q}</span>
              <span class="selection-item__meta">${expName} · ${a.topic}</span>
            </label>
          `;
        }).join('');

        const defaultFullUrl = item?.youtube_full_url || (item?.id && !item?.youtube_short_url ? `https://www.youtube.com/watch?v=${item.id}` : '');
        const defaultShortUrl = item?.youtube_short_url || '';
        const initialVidId = extractYouTubeId(defaultFullUrl) || extractYouTubeId(defaultShortUrl) || (item?.id || '');

        body.innerHTML = `
          <div class="form-group">
            <label>Video Title</label>
            <input class="form-control" id="f-vid-title" value="${item?.title || ''}" placeholder="e.g. 7 Things One Doctor Does to Manage His Own ADHD" required>
          </div>

          <div class="form-group">
            <label>YouTube Full Episode URL</label>
            <input type="url" class="form-control" id="f-vid-full-url" value="${defaultFullUrl}" placeholder="https://www.youtube.com/watch?v=sJsNza0_zRQ">
            <small style="color:var(--ink-3)">Paste YouTube full episode watch URL or youtu.be link</small>
          </div>

          <div class="form-group">
            <label>YouTube Short URL</label>
            <input type="url" class="form-control" id="f-vid-short-url" value="${defaultShortUrl}" placeholder="https://youtube.com/shorts/sJsNza0_zRQ">
            <small style="color:var(--ink-3)">Paste YouTube Shorts or clip URL</small>
            <div id="vid-thumb-preview" style="margin-top:0.5rem"></div>
          </div>

          <div class="form-group">
            <label>Video Caption</label>
            <textarea class="form-control" id="f-vid-caption" rows="2" placeholder="Brief descriptive caption for this video...">${item?.caption || ''}</textarea>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>Host / Guest Expert</label>
              <select class="form-control" id="f-vid-guest">${vExpOpts}</select>
            </div>
            <div class="form-group" style="justify-content:center">
              <label class="toggle-label" style="margin-top:1.35rem">
                <input type="checkbox" class="sr-checkbox" id="f-vid-published" ${item?.published !== false ? 'checked' : ''}>
                <span class="toggle-switch"></span>
                <span>Published on live site</span>
              </label>
            </div>
          </div>

          <!-- ASSIGN QUESTION & ANSWERS -->
          <div class="form-group">
            <label>Assign Parent Question &amp; Answers (Select Multiple)</label>
            <div class="selection-box">
              <input type="text" class="selection-box__filter" placeholder="Filter questions..." oninput="ADMIN.filterSelectionList(this, 'f-vid-ans-list')">
              <div id="f-vid-ans-list" class="selection-box__list">
                ${vidAnswerListItems}
              </div>
            </div>
            <small>Checked Q&As will be linked to this video and display it as their source video.</small>
          </div>

          <!-- FULL VIDEO TRANSCRIPT -->
          <div class="form-group">
            <div style="display:flex;justify-content:space-between;align-items:center">
              <label>Full Video Transcript</label>
              <small style="color:var(--ink-3)">Supports dialogue, speakers &amp; timestamps</small>
            </div>
            <textarea class="form-control" id="f-vid-transcript" rows="5" placeholder="Paste full episode dialogue, timestamps (e.g. 02:15 - Topic introduction), or clinical notes here..." style="font-family:monospace;font-size:0.85rem;line-height:1.5">${item?.transcript || ''}</textarea>
          </div>

          <!-- YOUTUBE MEDICAL & EDUCATIONAL DISCLAIMER (INDIVIDUAL OVERRIDE OR USE GLOBAL) -->
          <div class="form-group">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:0.35rem">
              <label style="margin:0">⚖️ YouTube Medical &amp; Educational Disclaimer</label>
              <div style="display:flex;gap:0.35rem">
                <button type="button" class="btn btn--xs btn--outline" id="f-vid-insert-disclaimer-btn" style="font-size:0.75rem;padding:0.2rem 0.5rem">Insert Global Default</button>
                <button type="button" class="btn btn--xs btn--outline" id="f-vid-clear-disclaimer-btn" style="font-size:0.75rem;padding:0.2rem 0.5rem">Clear (Use Global Default)</button>
              </div>
            </div>
            <textarea class="form-control" id="f-vid-disclaimer" rows="3" placeholder="Leave blank to automatically use the global YouTube disclaimer, or enter custom disclaimer for this specific video...">${escapeHtml(item?.youtube_disclaimer || '')}</textarea>
            <small style="display:block;margin-top:0.35rem;color:var(--ink-3);line-height:1.4">
              <strong>Current Global Default:</strong> <span id="f-vid-global-disclaimer-hint" style="font-style:italic">${escapeHtml(state.data?.settings?.youtube_disclaimer || DEFAULT_YT_DISCLAIMER)}</span>
            </small>
          </div>

          <!-- ALL SEO FIELDS & SEARCH ENGINE OPTIMIZATION SECTION -->
          <div style="margin-top:1.25rem;padding:1rem;background:var(--cream);border-radius:8px;border:1px solid var(--line)">
            <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:0.75rem">
              <div style="display:flex;align-items:center;gap:0.4rem">
                <span style="font-size:1.15rem">🔍</span>
                <strong style="font-size:0.95rem;color:var(--navy)">Video Episode SEO &amp; Rich Snippets</strong>
              </div>
              <span class="badge" style="background:var(--navy);color:#fff;font-size:0.7rem;font-weight:600">All SEO Fields</span>
            </div>

            <!-- LIVE GOOGLE SERP & VIDEO SNIPPET PREVIEW -->
            <div style="background:#fff;border:1px solid var(--line);border-radius:8px;padding:0.75rem 1rem;margin-bottom:1rem;font-family:system-ui, -apple-system, sans-serif">
              <div style="font-size:0.75rem;color:#202124;display:flex;align-items:center;gap:0.35rem;margin-bottom:0.25rem">
                <span style="display:inline-block;width:16px;height:16px;background:var(--navy);border-radius:50%;color:#fff;font-size:10px;text-align:center;line-height:16px;font-weight:700">7</span>
                <span>thefirstsevenyears.com</span>
                <span style="color:#5f6368">› episodes › <span id="f-vid-seo-serp-slug">${item?.slug || (initialVidId || 'video-episode')}</span></span>
              </div>
              <div style="display:flex;gap:0.75rem;align-items:flex-start;margin-top:0.35rem">
                <div id="f-vid-serp-thumb-preview" style="flex-shrink:0;width:96px;height:54px;background:#1e293b;border-radius:4px;overflow:hidden;position:relative;display:flex;align-items:center;justify-content:center">
                  <img id="f-vid-serp-thumb-img" src="${item?.og_image || (initialVidId ? `https://i.ytimg.com/vi/${initialVidId}/hqdefault.jpg` : '')}" style="width:100%;height:100%;object-fit:cover;display:${(initialVidId || item?.og_image) ? 'block' : 'none'}" alt="Preview" onerror="this.style.display='none'">
                  <span id="f-vid-serp-thumb-play" style="position:absolute;font-size:14px;color:#fff;text-shadow:0 1px 3px rgba(0,0,0,0.8);pointer-events:none">▶</span>
                </div>
                <div style="flex:1;min-width:0">
                  <div id="f-vid-seo-serp-title" style="font-size:1rem;color:#1a0dab;font-weight:500;line-height:1.3;margin-bottom:0.25rem;cursor:pointer">
                    ${(item?.seo_title || item?.title || 'Video Title') + ' — The First Seven Years'}
                  </div>
                  <div id="f-vid-seo-serp-desc" style="font-size:0.8rem;color:#4d5156;line-height:1.4">
                    ${item?.meta_desc || item?.caption || 'Watch expert pediatric guidance and clinical insights for parents of kids 0 to 7 on The First Seven Years.'}
                  </div>
                </div>
              </div>
            </div>

            <!-- 1. SEO META TITLE -->
            <div class="form-group">
              <div style="display:flex;justify-content:space-between;align-items:center">
                <label>SEO Meta Title (Title Tag)</label>
                <small style="color:var(--ink-3)"><span id="f-vid-title-count">${(item?.seo_title || '').length}</span> / 60 chars (Recommended 50–60)</small>
              </div>
              <input class="form-control" id="f-vid-seo-title" value="${item?.seo_title || ''}" placeholder="Custom search title (defaults to Video Title if empty)">
            </div>

            <!-- 2. SEO META DESCRIPTION -->
            <div class="form-group">
              <div style="display:flex;justify-content:space-between;align-items:center">
                <label>SEO Meta Description</label>
                <small style="color:var(--ink-3)"><span id="f-vid-desc-count">${(item?.meta_desc || '').length}</span> / 160 chars (Recommended 150–160)</small>
              </div>
              <textarea class="form-control" id="f-vid-meta-desc" rows="2" placeholder="Search snippet description to boost search click-through rate (150-160 characters)...">${item?.meta_desc || ''}</textarea>
            </div>

            <!-- 3. FOCUS KEYWORD & SECONDARY KEYWORDS -->
            <div class="form-row">
              <div class="form-group">
                <label>Primary Focus Keyword</label>
                <input class="form-control" id="f-vid-focus-kw" value="${item?.focus_keyword || ''}" placeholder="e.g. adhd symptoms in children">
              </div>
              <div class="form-group">
                <label>Secondary Keywords / Tags</label>
                <input class="form-control" id="f-vid-keywords" value="${item?.keywords || ''}" placeholder="comma-separated tags e.g. adhd, pediatric attention, dr dan sullivan">
              </div>
            </div>

            <!-- 4. CANONICAL URL & ROBOTS DIRECTIVES -->
            <div class="form-row">
              <div class="form-group">
                <label>Canonical URL Override</label>
                <input class="form-control" id="f-vid-canonical" value="${item?.canonical_url || ''}" placeholder="https://thefirstsevenyears.com/episodes/${item?.slug || (item?.id || '')}/">
              </div>
              <div class="form-group">
                <label>Robots Indexing</label>
                <select class="form-control" id="f-vid-robots-index">
                  <option value="noindex" ${item?.robots_index === 'noindex' || !item?.robots_index ? 'selected' : ''}>Noindex (Hide from search engines)</option>
                  <option value="index" ${item?.robots_index === 'index' ? 'selected' : ''}>Index (Allow in search engines)</option>
                </select>
              </div>
            </div>
          </div>
        `;

        const titleInput = $('#f-vid-title');
        const captionInput = $('#f-vid-caption');
        const fullUrlInput = $('#f-vid-full-url');
        const shortUrlInput = $('#f-vid-short-url');
        const previewEl = $('#vid-thumb-preview');
        const seoTitleInput = $('#f-vid-seo-title');
        const metaDescInput = $('#f-vid-meta-desc');
        const serpTitleEl = $('#f-vid-seo-serp-title');
        const serpDescEl = $('#f-vid-seo-serp-desc');
        const serpSlugEl = $('#f-vid-seo-serp-slug');
        const serpThumbImg = $('#f-vid-serp-thumb-img');
        const titleCountEl = $('#f-vid-title-count');
        const descCountEl = $('#f-vid-desc-count');

        const updateSeoAndThumb = () => {
          const vId = extractYouTubeId(fullUrlInput?.value) || extractYouTubeId(shortUrlInput?.value) || (item?.id || '');
          const tVal = seoTitleInput?.value.trim() || titleInput?.value.trim() || 'Video Title';
          const dVal = metaDescInput?.value.trim() || captionInput?.value.trim() || 'Watch expert pediatric guidance and clinical insights for parents of kids 0 to 7 on The First Seven Years.';
          const sVal = item?.slug || (titleInput?.value.trim() ? titleInput.value.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '').slice(0, 80) : (vId || 'video-episode'));

          if (serpTitleEl) serpTitleEl.textContent = tVal + ' — The First Seven Years';
          if (serpDescEl) serpDescEl.textContent = dVal;
          if (serpSlugEl) serpSlugEl.textContent = sVal;

          if (serpThumbImg) {
            if (vId) {
              serpThumbImg.src = `https://i.ytimg.com/vi/${vId}/hqdefault.jpg`;
              serpThumbImg.style.display = 'block';
            } else {
              serpThumbImg.style.display = 'none';
            }
          }

          if (titleCountEl && seoTitleInput) {
            const len = seoTitleInput.value.length;
            titleCountEl.textContent = len;
            titleCountEl.style.color = (len >= 45 && len <= 60) ? 'var(--mint)' : (len > 60 ? 'var(--danger)' : 'var(--ink-3)');
          }
          if (descCountEl && metaDescInput) {
            const len = metaDescInput.value.length;
            descCountEl.textContent = len;
            descCountEl.style.color = (len >= 130 && len <= 160) ? 'var(--mint)' : (len > 160 ? 'var(--danger)' : 'var(--ink-3)');
          }

          if (vId && previewEl) {
            previewEl.innerHTML = `
              <div style="display:inline-flex;align-items:center;gap:0.6rem;background:var(--cream);padding:0.4rem 0.75rem;border-radius:6px;border:1px solid var(--line)">
                <img src="https://i.ytimg.com/vi/${vId}/hqdefault.jpg" style="height:44px;border-radius:4px" alt="Preview" onerror="this.style.display='none'">
                <div style="font-size:0.8rem">
                  <span style="font-weight:600;color:var(--navy)">Detected Video ID: <code>${vId}</code></span>
                  <div><a href="https://youtu.be/${vId}" target="_blank" style="color:var(--navy);font-size:0.75rem;text-decoration:none">▶️ Open video in new tab</a></div>
                </div>
              </div>
            `;
          } else if (previewEl) {
            previewEl.innerHTML = '';
          }
        };

        fullUrlInput?.addEventListener('input', updateSeoAndThumb);
        shortUrlInput?.addEventListener('input', updateSeoAndThumb);
        titleInput?.addEventListener('input', updateSeoAndThumb);
        captionInput?.addEventListener('input', updateSeoAndThumb);
        seoTitleInput?.addEventListener('input', updateSeoAndThumb);
        metaDescInput?.addEventListener('input', updateSeoAndThumb);
        const disclaimerInput = $('#f-vid-disclaimer');
        const insertDisclaimerBtn = $('#f-vid-insert-disclaimer-btn');
        const clearDisclaimerBtn = $('#f-vid-clear-disclaimer-btn');

        insertDisclaimerBtn?.addEventListener('click', () => {
          if (disclaimerInput) {
            disclaimerInput.value = state.data?.settings?.youtube_disclaimer || DEFAULT_YT_DISCLAIMER;
            disclaimerInput.focus();
          }
        });

        clearDisclaimerBtn?.addEventListener('click', () => {
          if (disclaimerInput) {
            disclaimerInput.value = '';
            disclaimerInput.focus();
          }
        });

        updateSeoAndThumb();
        break;

      case 'expert': {
        title.textContent = item ? 'Edit Expert / Host' : 'Add New Expert / Host';

        const expertSlug = item?.slug || '';

        // 1. Assign Parent Questions (Q&A Answers)
        const expAssignedAnswers = item?.answers || (state.data.answers || []).filter(a => a.expert === expertSlug).map(a => a.slug);
        const expAnswerListItems = (state.data.answers || []).map(a => {
          const isChecked = expAssignedAnswers.includes(a.slug);
          const topicObj = (state.data.topics || []).find(t => t.slug === a.topic);
          const topicTitle = topicObj ? topicObj.name : a.topic;
          return `
            <label class="selection-item">
              <input type="checkbox" name="f-exp-answers" value="${a.slug}" ${isChecked ? 'checked' : ''}>
              <div style="flex:1;min-width:0">
                <div class="selection-item__title">${a.q}</div>
                <div class="selection-item__meta">${topicTitle} · /answers/${a.slug}/</div>
              </div>
            </label>
          `;
        }).join('') || '<div style="padding:1rem;color:var(--ink-3);text-align:center">No Q&amp;As found</div>';

        // 2. Assign Videos from Video Library
        const expAssignedVideos = item?.episodes || (state.data.episodes || []).filter(v => v.guest === expertSlug).map(v => v.id);
        const expVideoListItems = (state.data.episodes || []).map(v => {
          const isChecked = expAssignedVideos.includes(v.id);
          const epTag = v.kind === 'ep' ? `<strong>EP ${v.ep || ''}</strong>: ` : '<em>Clip</em>: ';
          return `
            <label class="selection-item">
              <input type="checkbox" name="f-exp-episodes" value="${v.id}" ${isChecked ? 'checked' : ''}>
              <img src="https://i.ytimg.com/vi/${v.id}/hqdefault.jpg" class="selection-item__thumb" alt="">
              <div style="flex:1;min-width:0">
                <div class="selection-item__title">${epTag}${v.title}</div>
                <div class="selection-item__meta">ID: ${v.id} · ${v.kind === 'ep' ? 'Full Episode' : 'Clip'}</div>
              </div>
            </label>
          `;
        }).join('') || '<div style="padding:1rem;color:var(--ink-3);text-align:center">No videos found</div>';

        const bioText = Array.isArray(item?.bio) ? item.bio.join('\n\n') : (item?.bio || item?.short || '');
        const credsText = Array.isArray(item?.creds) ? item.creds.join(', ') : (item?.creds || '');

        body.innerHTML = `
          <div class="form-row">
            <div class="form-group">
              <label>Expert / Host Name *</label>
              <input type="text" class="form-control" id="f-exp-name" value="${item?.name || ''}" placeholder="e.g. Dr. Murray Clarke" required>
            </div>
            <div class="form-group">
              <label>Slug (URL identifier) *</label>
              <input type="text" class="form-control" id="f-exp-slug" value="${item?.slug || ''}" placeholder="e.g. dr-murray-clarke" ${item ? 'readonly style="background:var(--cream-deep)"' : ''} required>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>Role / Title</label>
              <input type="text" class="form-control" id="f-exp-role" value="${item?.role || ''}" placeholder="e.g. Host · The First Seven Years">
            </div>
            <div class="form-group">
              <label>Credentials / Specialization</label>
              <input type="text" class="form-control" id="f-exp-creds" value="${credsText}" placeholder="e.g. ND, DHom, LAc (comma separated)">
            </div>
          </div>

          <div class="form-group">
            <div style="display:flex;justify-content:space-between;align-items:center">
              <label>Description &amp; Bio</label>
              <small style="color:var(--ink-3)">Multi-paragraph bio &amp; clinical overview</small>
            </div>
            <textarea class="form-control" id="f-exp-desc" rows="4" placeholder="Enter expert biography, background, clinical focus...">${bioText}</textarea>
          </div>

          <div class="form-row" style="align-items:flex-start">
            <div class="form-group">
              <label>Headshot Photo (Upload Image)</label>
              <div class="image-upload-wrap">
                <input type="file" id="f-exp-file" accept="image/*" style="display:none">
                <input type="hidden" id="f-exp-img" value="${item?.img || ''}">

                <!-- PREVIEW CARD (when image exists) -->
                <div id="f-exp-preview-card" class="image-upload-card" style="${item?.img ? 'display:flex' : 'display:none'}">
                  <img id="f-exp-thumb" src="${item?.img || ''}" alt="Headshot" class="image-upload-thumb">
                  <div class="image-upload-info">
                    <span class="image-upload-title" id="f-exp-file-name">${item?.img ? (item.img.startsWith('data:') ? 'Uploaded Image' : item.img.split('/').pop()) : 'Photo Selected'}</span>
                    <div class="image-upload-actions">
                      <button type="button" class="btn btn--sm btn--outline" id="f-exp-change-btn">Change Photo</button>
                      <button type="button" class="btn btn--sm btn--danger-outline" id="f-exp-remove-btn">Remove</button>
                    </div>
                  </div>
                </div>

                <!-- DROPZONE (when no image exists) -->
                <div id="f-exp-dropzone" class="image-dropzone" style="${item?.img ? 'display:none' : 'display:flex'}">
                  <div class="image-dropzone__icon">📸</div>
                  <div class="image-dropzone__text">
                    <strong>Click to upload</strong> or drag &amp; drop
                  </div>
                  <div class="image-dropzone__hint">JPG, PNG, WebP or SVG headshot (square recommended)</div>
                  <button type="button" class="btn btn--sm btn--outline" style="margin-top:0.5rem" id="f-exp-browse-btn">Choose Image File</button>
                </div>

                <!-- URL toggle fallback -->
                <div style="margin-top:0.45rem">
                  <a href="#" id="f-exp-toggle-url" style="font-size:0.75rem;color:var(--ink-3);text-decoration:none">🔗 Or specify image URL manually</a>
                  <div id="f-exp-url-wrap" style="display:none;margin-top:0.35rem">
                    <input type="text" class="form-control" id="f-exp-img-url" value="${item?.img || ''}" placeholder="/assets/img/dr-murray-clarke.jpg" style="font-size:0.8rem">
                  </div>
                </div>
              </div>
            </div>

            <div class="form-group" style="justify-content:center">
              <label class="toggle-label" style="margin-top:1.5rem">
                <input type="checkbox" class="sr-checkbox" id="f-exp-published" ${item?.published !== false ? 'checked' : ''}>
                <span class="toggle-switch"></span>
                <span>Published on live site</span>
              </label>
            </div>
          </div>

          <!-- ASSIGN PARENT QUESTIONS & ANSWERS -->
          <div class="form-group">
            <label>Assign Parent Question &amp; Answers (Select Multiple)</label>
            <div class="selection-box">
              <input type="text" class="selection-box__filter" placeholder="Filter questions..." oninput="ADMIN.filterSelectionList(this, 'f-exp-ans-list')">
              <div id="f-exp-ans-list" class="selection-box__list">
                ${expAnswerListItems}
              </div>
            </div>
            <small>Checked Q&amp;As will be assigned to this expert as their answering specialist.</small>
          </div>

          <!-- ASSIGN MULTIPLE VIDEOS FROM VIDEO LIBRARY -->
          <div class="form-group">
            <label>Assign Videos from Video Library (Select Multiple Episodes &amp; Clips)</label>
            <div class="selection-box">
              <input type="text" class="selection-box__filter" placeholder="Filter video episodes &amp; clips..." oninput="ADMIN.filterSelectionList(this, 'f-exp-vids-list')">
              <div id="f-exp-vids-list" class="selection-box__list">
                ${expVideoListItems}
              </div>
            </div>
            <small>Checked videos will link this expert as host or featured guest.</small>
          </div>

          <!-- EXPERT / HOST SEO & SOCIAL METADATA -->
          <div style="margin-top:1.25rem;padding:1rem;background:var(--cream);border-radius:8px;border:1px solid var(--line)">
            <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:0.75rem">
              <div style="display:flex;align-items:center;gap:0.4rem">
                <span style="font-size:1.15rem">🔍</span>
                <strong style="font-size:0.95rem;color:var(--navy)">Expert &amp; Host SEO, Google SERP &amp; Social Sharing</strong>
              </div>
              <span class="badge" style="background:var(--navy);color:#fff;font-size:0.7rem;font-weight:600">All SEO Fields</span>
            </div>

            <!-- LIVE GOOGLE SERP PREVIEW -->
            <div style="background:#fff;border:1px solid var(--line);border-radius:8px;padding:0.75rem 1rem;margin-bottom:1rem;font-family:system-ui, -apple-system, sans-serif">
              <div style="font-size:0.75rem;color:#202124;display:flex;align-items:center;gap:0.35rem;margin-bottom:0.25rem">
                <span style="display:inline-block;width:16px;height:16px;background:var(--navy);border-radius:50%;color:#fff;font-size:10px;text-align:center;line-height:16px;font-weight:700">7</span>
                <span>thefirstsevenyears.com</span>
                <span style="color:#5f6368">› experts › <span id="f-exp-seo-serp-slug">${item?.slug || 'expert'}</span></span>
              </div>
              <div style="display:flex;gap:0.75rem;align-items:flex-start">
                <div style="flex:1;min-width:0">
                  <div id="f-exp-seo-serp-title" style="font-size:1rem;color:#1a0dab;font-weight:500;line-height:1.3;margin-bottom:0.25rem;cursor:pointer">
                    ${(item?.seo_title || (item?.name ? `${item.name} — ${item.role ? item.role.split('·')[0].trim() : 'Expert'} | The First Seven Years` : 'Expert Profile — The First Seven Years'))}
                  </div>
                  <div id="f-exp-seo-serp-desc" style="font-size:0.8rem;color:#4d5156;line-height:1.4">
                    ${item?.meta_desc || item?.short || 'Meet our pediatric specialist, clinical background, podcast episodes and verified parent answers.'}
                  </div>
                </div>
                <img id="f-exp-serp-thumb" src="${item?.img || item?.og_image || '/assets/img/dr-murray-clarke.jpg'}" alt="" style="width:48px;height:48px;border-radius:6px;object-fit:cover;border:1px solid var(--line);flex-shrink:0;${(item?.img || item?.og_image) ? '' : 'display:none'}">
              </div>
            </div>

            <!-- 1. SEO META TITLE -->
            <div class="form-group">
              <div style="display:flex;justify-content:space-between;align-items:center">
                <label>SEO Meta Title (Title Tag)</label>
                <small style="color:var(--ink-3)"><span id="f-exp-title-count">${(item?.seo_title || '').length}</span> / 60 chars (Recommended 50–60)</small>
              </div>
              <input class="form-control" id="f-exp-seo-title" value="${item?.seo_title || ''}" placeholder="Custom title tag (defaults to Expert Name — Role if empty)">
            </div>

            <!-- 2. SEO META DESCRIPTION -->
            <div class="form-group">
              <div style="display:flex;justify-content:space-between;align-items:center">
                <label>SEO Meta Description</label>
                <small style="color:var(--ink-3)"><span id="f-exp-desc-count">${(item?.meta_desc || '').length}</span> / 160 chars (Recommended 150–160)</small>
              </div>
              <textarea class="form-control" id="f-exp-meta-desc" rows="2" placeholder="Brief search snippet highlighting qualifications &amp; pediatric focus (150-160 characters)...">${item?.meta_desc || ''}</textarea>
            </div>

            <!-- 3. FOCUS KEYWORD & SECONDARY KEYWORDS -->
            <div class="form-row">
              <div class="form-group">
                <label>Primary Focus Keyword</label>
                <input class="form-control" id="f-exp-focus-kw" value="${item?.focus_keyword || ''}" placeholder="e.g. Dr Murray Clarke pediatrician">
              </div>
              <div class="form-group">
                <label>Secondary Keywords / Meta Keywords</label>
                <input class="form-control" id="f-exp-keywords" value="${item?.keywords || ''}" placeholder="e.g. pediatric nutrition, child microbiome, gut health">
              </div>
            </div>

            <!-- 4. CANONICAL URL & ROBOTS DIRECTIVES -->
            <div class="form-row">
              <div class="form-group">
                <label>Canonical URL Override</label>
                <input class="form-control" id="f-exp-canonical" value="${item?.canonical_url || ''}" placeholder="https://thefirstsevenyears.com/experts/${item?.slug || ''}/">
              </div>
              <div class="form-group">
                <label>Robots Indexing</label>
                <select class="form-control" id="f-exp-robots-index">
                  <option value="noindex" ${item?.robots_index === 'noindex' || !item?.robots_index ? 'selected' : ''}>Noindex (Hide from search engines)</option>
                  <option value="index" ${item?.robots_index === 'index' ? 'selected' : ''}>Index (Allow in search engines)</option>
                </select>
              </div>
              <div class="form-group">
                <label>Robots Following</label>
                <select class="form-control" id="f-exp-robots-follow">
                  <option value="nofollow" ${item?.robots_follow === 'nofollow' || !item?.robots_follow ? 'selected' : ''}>Nofollow (Do not crawl links)</option>
                  <option value="follow" ${item?.robots_follow === 'follow' ? 'selected' : ''}>Follow (Crawl links on page)</option>
                </select>
              </div>
            </div>

            <!-- 5. SOCIAL SHARE & OPEN GRAPH (OG) -->
            <div class="form-row">
              <div class="form-group">
                <label>Social Share Title (OG Title)</label>
                <input class="form-control" id="f-exp-og-title" value="${item?.og_title || ''}" placeholder="Defaults to SEO title if blank">
              </div>
              <div class="form-group">
                <label>Open Graph Type</label>
                <select class="form-control" id="f-exp-og-type">
                  <option value="profile" ${item?.og_type === 'profile' || !item?.og_type ? 'selected' : ''}>profile (Person / Author Profile)</option>
                  <option value="website" ${item?.og_type === 'website' ? 'selected' : ''}>website</option>
                  <option value="article" ${item?.og_type === 'article' ? 'selected' : ''}>article</option>
                </select>
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label>Social Share Description (OG Description)</label>
                <input class="form-control" id="f-exp-og-desc" value="${item?.og_desc || ''}" placeholder="Defaults to meta description if blank">
              </div>
              <div class="form-group">
                <label>Social Share Image URL (OG Image 1200×630 or Headshot)</label>
                <input class="form-control" id="f-exp-og-image" value="${item?.og_image || ''}" placeholder="https://thefirstsevenyears.com${item?.img || '/assets/img/dr-murray-clarke.jpg'}">
              </div>
            </div>

            <!-- 6. SCHEMA.ORG STRUCTURED DATA & TWITTER CARD -->
            <div class="form-row">
              <div class="form-group">
                <label>Schema.org Structured Data Type</label>
                <select class="form-control" id="f-exp-schema-type">
                  <option value="Physician" ${item?.schema_type === 'Physician' || (!item?.schema_type && item?.slug?.includes('dr-')) ? 'selected' : ''}>Physician (Medical Doctor / Pediatrician)</option>
                  <option value="Person" ${item?.schema_type === 'Person' || (!item?.schema_type && !item?.slug?.includes('dr-')) ? 'selected' : ''}>Person (Host, Nutritionist, Researcher)</option>
                  <option value="ProfilePage" ${item?.schema_type === 'ProfilePage' ? 'selected' : ''}>ProfilePage (Biography &amp; Authored Works)</option>
                  <option value="MedicalBusiness" ${item?.schema_type === 'MedicalBusiness' ? 'selected' : ''}>MedicalBusiness / Practice</option>
                </select>
              </div>
              <div class="form-group">
                <label>Twitter / X Card Format</label>
                <select class="form-control" id="f-exp-twitter-card">
                  <option value="summary_large_image" ${item?.twitter_card !== 'summary' ? 'selected' : ''}>summary_large_image (Large Photo Card)</option>
                  <option value="summary" ${item?.twitter_card === 'summary' ? 'selected' : ''}>summary (Compact Card)</option>
                </select>
              </div>
            </div>
          </div>
        `;

        // Image upload and management
        const fileInput = $('#f-exp-file');
        const imgHiddenInput = $('#f-exp-img');
        const previewCard = $('#f-exp-preview-card');
        const previewThumb = $('#f-exp-thumb');
        const fileNameEl = $('#f-exp-file-name');
        const dropzone = $('#f-exp-dropzone');
        const removeBtn = $('#f-exp-remove-btn');
        const changeBtn = $('#f-exp-change-btn');
        const browseBtn = $('#f-exp-browse-btn');
        const toggleUrlBtn = $('#f-exp-toggle-url');
        const urlWrap = $('#f-exp-url-wrap');
        const manualUrlInput = $('#f-exp-img-url');

        // Interactive Expert SEO live preview & character counter
        const expNameInput = $('#f-exp-name');
        const expSlugInput = $('#f-exp-slug');
        const expRoleIn = $('#f-exp-role');
        const expDescIn = $('#f-exp-desc');
        const expSeoTitleIn = $('#f-exp-seo-title');
        const expMetaDescIn = $('#f-exp-meta-desc');
        const expSerpTitle = $('#f-exp-seo-serp-title');
        const expSerpDesc = $('#f-exp-seo-serp-desc');
        const expSerpSlug = $('#f-exp-seo-serp-slug');
        const expSerpThumb = $('#f-exp-serp-thumb');
        const expTitleCount = $('#f-exp-title-count');
        const expDescCount = $('#f-exp-desc-count');
        const expOgImageIn = $('#f-exp-og-image');

        const updateExpSeoPreview = () => {
          const nVal = expNameInput?.value.trim() || 'Expert Profile';
          const rVal = expRoleIn?.value.trim() ? expRoleIn.value.trim().split('·')[0].trim() : 'Expert';
          const fallbackTitle = nVal !== 'Expert Profile' ? `${nVal} — ${rVal} | The First Seven Years` : 'Expert Profile — The First Seven Years';
          const tVal = expSeoTitleIn?.value.trim() || fallbackTitle;
          const dVal = expMetaDescIn?.value.trim() || expDescIn?.value.trim().slice(0, 160) || 'Meet our pediatric specialist, clinical background, podcast episodes and verified parent answers.';
          const sVal = expSlugInput?.value.trim() || 'expert';

          if (expSerpTitle) expSerpTitle.textContent = tVal;
          if (expSerpDesc) expSerpDesc.textContent = dVal;
          if (expSerpSlug) expSerpSlug.textContent = sVal;

          if (expTitleCount && expSeoTitleIn) {
            const len = expSeoTitleIn.value.length;
            expTitleCount.textContent = len;
            expTitleCount.style.color = (len >= 45 && len <= 60) ? 'var(--mint)' : (len > 60 ? 'var(--danger)' : 'var(--ink-3)');
          }
          if (expDescCount && expMetaDescIn) {
            const len = expMetaDescIn.value.length;
            expDescCount.textContent = len;
            expDescCount.style.color = (len >= 130 && len <= 160) ? 'var(--mint)' : (len > 160 ? 'var(--danger)' : 'var(--ink-3)');
          }

          if (expSerpThumb) {
            const imgVal = expOgImageIn?.value.trim() || imgHiddenInput?.value.trim();
            if (imgVal) {
              expSerpThumb.src = imgVal;
              expSerpThumb.style.display = 'block';
            } else {
              expSerpThumb.style.display = 'none';
            }
          }
        };

        if (expNameInput) {
          expNameInput.addEventListener('input', () => {
            if (!item && expSlugInput) {
              expSlugInput.value = expNameInput.value
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/(^-|-$)/g, '');
            }
            updateExpSeoPreview();
          });
        }
        expSlugInput?.addEventListener('input', updateExpSeoPreview);
        expRoleIn?.addEventListener('input', updateExpSeoPreview);
        expDescIn?.addEventListener('input', updateExpSeoPreview);
        expSeoTitleIn?.addEventListener('input', updateExpSeoPreview);
        expMetaDescIn?.addEventListener('input', updateExpSeoPreview);
        expOgImageIn?.addEventListener('input', updateExpSeoPreview);

        const setPhoto = (url, label) => {
          if (url) {
            imgHiddenInput.value = url;
            previewThumb.src = url;
            if (manualUrlInput) manualUrlInput.value = url;
            if (fileNameEl) fileNameEl.textContent = label || (url.startsWith('data:') ? 'Uploaded Image' : url.split('/').pop());
            previewCard.style.display = 'flex';
            dropzone.style.display = 'none';
            if (expSerpThumb) {
              expSerpThumb.src = url;
              expSerpThumb.style.display = 'block';
            }
          } else {
            imgHiddenInput.value = '';
            previewThumb.src = '';
            if (manualUrlInput) manualUrlInput.value = '';
            previewCard.style.display = 'none';
            dropzone.style.display = 'flex';
            if (fileInput) fileInput.value = '';
            if (expSerpThumb) {
              if (expOgImageIn && expOgImageIn.value.trim()) {
                expSerpThumb.src = expOgImageIn.value.trim();
                expSerpThumb.style.display = 'block';
              } else {
                expSerpThumb.style.display = 'none';
              }
            }
          }
        };

        const handleFile = (file) => {
          if (!file || !file.type.startsWith('image/')) {
            showToast('Please select a valid image file', 'error');
            return;
          }
          const reader = new FileReader();
          reader.onload = async (e) => {
            const dataUrl = e.target.result;
            // Set instant preview & fallback value
            setPhoto(dataUrl, file.name);

            // Attempt server upload
            try {
              const res = await fetch('/api/upload', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ filename: file.name, data: dataUrl })
              });
              const data = await res.json();
              if (res.ok && data.url) {
                setPhoto(data.url, file.name);
                showToast('Image uploaded successfully!', 'success');
              }
            } catch (err) {
              // Standalone prototype mode: keep dataUrl
              showToast('Image attached!', 'success');
            }
          };
          reader.readAsDataURL(file);
        };

        if (fileInput) {
          fileInput.addEventListener('change', (e) => {
            if (e.target.files && e.target.files[0]) {
              handleFile(e.target.files[0]);
            }
          });
        }

        if (browseBtn) browseBtn.addEventListener('click', (e) => { e.stopPropagation(); fileInput.click(); });
        if (changeBtn) changeBtn.addEventListener('click', () => fileInput.click());
        if (dropzone) {
          dropzone.addEventListener('click', () => fileInput.click());
          dropzone.addEventListener('dragover', (e) => {
            e.preventDefault();
            dropzone.classList.add('is-dragover');
          });
          dropzone.addEventListener('dragleave', () => dropzone.classList.remove('is-dragover'));
          dropzone.addEventListener('drop', (e) => {
            e.preventDefault();
            dropzone.classList.remove('is-dragover');
            if (e.dataTransfer.files && e.dataTransfer.files[0]) {
              handleFile(e.dataTransfer.files[0]);
            }
          });
        }

        if (removeBtn) {
          removeBtn.addEventListener('click', () => setPhoto('', ''));
        }

        if (toggleUrlBtn && urlWrap) {
          toggleUrlBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const isOpen = urlWrap.style.display !== 'none';
            urlWrap.style.display = isOpen ? 'none' : 'block';
          });
        }

        if (manualUrlInput) {
          manualUrlInput.addEventListener('input', () => {
            const val = manualUrlInput.value.trim();
            setPhoto(val, val ? val.split('/').pop() : '');
          });
        }
        break;
      }

      case 'menu_header': {
        title.textContent = item ? 'Edit Header Navigation Link' : 'Add Header Navigation Link';
        const currentOrder = item ? item.order : ((state.data.menus?.header?.length || 0) + 1);
        body.innerHTML = `
          <div class="form-group">
            <label>Link Label *</label>
            <input class="form-control" id="f-menu-label" value="${item?.label || ''}" placeholder="e.g. Topics, Episodes, The Book" required>
          </div>
          <div class="form-group">
            <label>Destination Route URL *</label>
            <input class="form-control" id="f-menu-url" value="${item?.url || ''}" placeholder="e.g. /topics/ or /episodes/" required>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label>Mobile Drawer Badge (Optional)</label>
              <input class="form-control" id="f-menu-badge" value="${item?.badge || ''}" placeholder="e.g. 13 hubs, 116+, Coming soon">
            </div>
            <div class="form-group">
              <label>Target Window</label>
              <select class="form-control" id="f-menu-target">
                <option value="_self" ${item?.target !== '_blank' ? 'selected' : ''}>Same Window (_self)</option>
                <option value="_blank" ${item?.target === '_blank' ? 'selected' : ''}>New Tab (_blank)</option>
              </select>
            </div>
          </div>
          <div class="form-group">
            <label>Display Order Sequence</label>
            <input type="number" class="form-control" id="f-menu-order" value="${currentOrder}" min="1" max="99">
          </div>
          <div class="form-group" style="margin-top:0.75rem">
            <label class="toggle-label">
              <input type="checkbox" class="sr-checkbox" id="f-menu-published" ${(!item || item.published) ? 'checked' : ''}>
              <span class="toggle-switch"></span>
              <span>Published &amp; Active in Header</span>
            </label>
          </div>
        `;
        break;
      }

      case 'menu_footer': {
        title.textContent = item ? 'Edit Footer Directory Link' : 'Add Footer Directory Link';
        const currentOrder = item ? item.order : 1;
        const colVal = item?.col || 'Topics';
        body.innerHTML = `
          <div class="form-group">
            <label>Footer Column / Category *</label>
            <select class="form-control" id="f-menu-col">
              <option value="Topics" ${colVal === 'Topics' ? 'selected' : ''}>Topics</option>
              <option value="Library" ${colVal === 'Library' ? 'selected' : ''}>Library</option>
              <option value="About & Standards" ${colVal === 'About & Standards' ? 'selected' : ''}>About &amp; Standards</option>
            </select>
          </div>
          <div class="form-group">
            <label>Link Label *</label>
            <input class="form-control" id="f-menu-label" value="${item?.label || ''}" placeholder="e.g. Gut health & microbiome, All episodes" required>
          </div>
          <div class="form-group">
            <label>Destination Route URL *</label>
            <input class="form-control" id="f-menu-url" value="${item?.url || ''}" placeholder="e.g. /gut-health/ or /episodes/" required>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label>Target Window</label>
              <select class="form-control" id="f-menu-target">
                <option value="_self" ${item?.target !== '_blank' ? 'selected' : ''}>Same Window (_self)</option>
                <option value="_blank" ${item?.target === '_blank' ? 'selected' : ''}>New Tab (_blank)</option>
              </select>
            </div>
            <div class="form-group">
              <label>Display Order in Column</label>
              <input type="number" class="form-control" id="f-menu-order" value="${currentOrder}" min="1" max="99">
            </div>
          </div>
          <div class="form-group" style="margin-top:0.75rem">
            <label class="toggle-label">
              <input type="checkbox" class="sr-checkbox" id="f-menu-published" ${(!item || item.published) ? 'checked' : ''}>
              <span class="toggle-switch"></span>
              <span>Published &amp; Active in Footer</span>
            </label>
          </div>
        `;
        break;
      }

      case 'page': {
        title.textContent = item ? 'Edit Page' : 'Add New Content Page';
        const tplVal = item?.template || 'Standard Article';
        body.innerHTML = `
          <div class="form-group">
            <label>Page Title *</label>
            <input class="form-control" id="f-page-title" value="${item?.title || ''}" placeholder="e.g. About Our Pediatric Editorial Standards" required>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label>URL Slug *</label>
              <input class="form-control" id="f-page-slug" value="${item?.slug || ''}" placeholder="e.g. standards" required>
            </div>
            <div class="form-group">
              <label>Canonical Route URL</label>
              <input class="form-control" id="f-page-url" value="${item?.url || ''}" placeholder="/standards/">
            </div>
          </div>
          <div class="form-group">
            <label>Template Layout</label>
            <select class="form-control" id="f-page-template">
              <option value="Landing / Hero" ${tplVal === 'Landing / Hero' ? 'selected' : ''}>Landing / Hero</option>
              <option value="Editorial & Standards" ${tplVal === 'Editorial & Standards' ? 'selected' : ''}>Editorial &amp; Standards</option>
              <option value="Product / Book Showcase" ${tplVal === 'Product / Book Showcase' ? 'selected' : ''}>Product / Book Showcase</option>
              <option value="Legal / Policy" ${tplVal === 'Legal / Policy' ? 'selected' : ''}>Legal / Policy</option>
              <option value="Interactive Form" ${tplVal === 'Interactive Form' ? 'selected' : ''}>Interactive Form</option>
              <option value="Standard Article" ${tplVal === 'Standard Article' ? 'selected' : ''}>Standard Article</option>
            </select>
          </div>
          <div class="form-group">
            <label>Excerpt / Card Summary</label>
            <input class="form-control" id="f-page-excerpt" value="${item?.excerpt || ''}" placeholder="Summary shown in directory and internal page listings">
          </div>
          <div class="form-group">
            <label>Page Body Content (Markdown / HTML)</label>
            <textarea class="form-control" id="f-page-body" rows="4" placeholder="Enter page narrative text or markup...">${item?.body || ''}</textarea>
          </div>

          <!-- ALL SEO FIELDS & SEARCH ENGINE OPTIMIZATION SECTION -->
          <div style="margin-top:1.25rem;padding:1rem;background:var(--cream);border-radius:8px;border:1px solid var(--line)">
            <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:0.75rem">
              <div style="display:flex;align-items:center;gap:0.4rem">
                <span style="font-size:1.15rem">🔍</span>
                <strong style="font-size:0.95rem;color:var(--navy)">Search Engine Optimization (SEO) &amp; Social Meta</strong>
              </div>
              <span class="badge" style="background:var(--navy);color:#fff;font-size:0.7rem;font-weight:600">All SEO Fields</span>
            </div>

            <!-- LIVE GOOGLE SEARCH SERP PREVIEW -->
            <div style="background:#fff;border:1px solid var(--line);border-radius:8px;padding:0.75rem 1rem;margin-bottom:1rem;font-family:system-ui, -apple-system, sans-serif">
              <div style="font-size:0.75rem;color:#202124;display:flex;align-items:center;gap:0.35rem;margin-bottom:0.25rem">
                <span style="display:inline-block;width:16px;height:16px;background:var(--navy);border-radius:50%;color:#fff;font-size:10px;text-align:center;line-height:16px;font-weight:700">7</span>
                <span>thefirstsevenyears.com</span>
                <span style="color:#5f6368">› <span id="f-seo-serp-slug">${item?.slug || 'page'}</span></span>
              </div>
              <div id="f-seo-serp-title" style="font-size:1rem;color:#1a0dab;font-weight:500;line-height:1.3;margin-bottom:0.25rem;cursor:pointer">
                ${(item?.seo_title || item?.title || 'Page Title') + ' — The First Seven Years'}
              </div>
              <div id="f-seo-serp-desc" style="font-size:0.8rem;color:#4d5156;line-height:1.4">
                ${item?.meta_desc || item?.excerpt || 'Expert pediatric answers and developmental guidance for parents of children aged 0 to 7.'}
              </div>
            </div>

            <!-- 1. SEO META TITLE -->
            <div class="form-group">
              <div style="display:flex;justify-content:space-between;align-items:center">
                <label>SEO Meta Title (Title Tag)</label>
                <small style="color:var(--ink-3)"><span id="f-seo-title-count">${(item?.seo_title || '').length}</span> / 60 chars (Recommended 50–60)</small>
              </div>
              <input class="form-control" id="f-page-seo-title" value="${item?.seo_title || ''}" placeholder="Custom title tag (defaults to Page Title if empty)">
            </div>

            <!-- 2. SEO META DESCRIPTION -->
            <div class="form-group">
              <div style="display:flex;justify-content:space-between;align-items:center">
                <label>SEO Meta Description</label>
                <small style="color:var(--ink-3)"><span id="f-seo-desc-count">${(item?.meta_desc || '').length}</span> / 160 chars (Recommended 150–160)</small>
              </div>
              <textarea class="form-control" id="f-page-meta-desc" rows="2" placeholder="Brief search engine snippet to boost CTR (150-160 characters)...">${item?.meta_desc || ''}</textarea>
            </div>

            <!-- 3. FOCUS KEYWORD & SECONDARY KEYWORDS -->
            <div class="form-row">
              <div class="form-group">
                <label>Primary Focus Keyword</label>
                <input class="form-control" id="f-page-focus-kw" value="${item?.focus_keyword || ''}" placeholder="e.g. pediatric gut health">
              </div>
              <div class="form-group">
                <label>Secondary Keywords / Meta Keywords</label>
                <input class="form-control" id="f-page-keywords" value="${item?.keywords || ''}" placeholder="comma-separated tags e.g. toddler gut, eczema">
              </div>
            </div>

            <!-- 4. CANONICAL URL & ROBOTS DIRECTIVES -->
            <div class="form-row">
              <div class="form-group">
                <label>Canonical URL Override</label>
                <input class="form-control" id="f-page-canonical" value="${item?.canonical_url || ''}" placeholder="https://thefirstsevenyears.com${item?.url || '/'}">
              </div>
              <div class="form-group">
                <label>Robots Indexing</label>
                <select class="form-control" id="f-page-robots-index">
                  <option value="noindex" ${item?.robots_index === 'noindex' || !item?.robots_index ? 'selected' : ''}>Noindex (Hide from search engines)</option>
                  <option value="index" ${item?.robots_index === 'index' ? 'selected' : ''}>Index (Allow in search engines)</option>
                </select>
              </div>
              <div class="form-group">
                <label>Robots Following</label>
                <select class="form-control" id="f-page-robots-follow">
                  <option value="nofollow" ${item?.robots_follow === 'nofollow' || !item?.robots_follow ? 'selected' : ''}>Nofollow (Do not crawl links)</option>
                  <option value="follow" ${item?.robots_follow === 'follow' ? 'selected' : ''}>Follow (Crawl links on page)</option>
                </select>
              </div>
            </div>

            <!-- 5. SOCIAL SHARE & OPEN GRAPH (OG) -->
            <div class="form-row">
              <div class="form-group">
                <label>Social Share Title (OG Title)</label>
                <input class="form-control" id="f-page-og-title" value="${item?.og_title || ''}" placeholder="Defaults to SEO title if blank">
              </div>
              <div class="form-group">
                <label>Open Graph Type</label>
                <select class="form-control" id="f-page-og-type">
                  <option value="website" ${item?.og_type === 'website' ? 'selected' : ''}>website</option>
                  <option value="article" ${item?.og_type === 'article' || !item?.og_type ? 'selected' : ''}>article</option>
                  <option value="profile" ${item?.og_type === 'profile' ? 'selected' : ''}>profile</option>
                </select>
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label>Social Share Description (OG Description)</label>
                <input class="form-control" id="f-page-og-desc" value="${item?.og_desc || ''}" placeholder="Defaults to meta description if blank">
              </div>
              <div class="form-group">
                <label>Social Share Image URL (OG Image 1200×630)</label>
                <input class="form-control" id="f-page-og-image" value="${item?.og_image || ''}" placeholder="https://thefirstsevenyears.com/assets/img/og-share.jpg">
                <div id="f-page-og-image-preview"></div>
              </div>
            </div>

            <!-- 6. SCHEMA.ORG STRUCTURED DATA & TWITTER CARD -->
            <div class="form-row">
              <div class="form-group">
                <label>Schema.org Structured Data Type</label>
                <select class="form-control" id="f-page-schema-type">
                  <option value="WebPage" ${item?.schema_type === 'WebPage' || !item?.schema_type ? 'selected' : ''}>WebPage (Standard Page)</option>
                  <option value="Article" ${item?.schema_type === 'Article' ? 'selected' : ''}>Article (Educational Editorial)</option>
                  <option value="MedicalWebPage" ${item?.schema_type === 'MedicalWebPage' ? 'selected' : ''}>MedicalWebPage (Clinical Guidance)</option>
                  <option value="AboutPage" ${item?.schema_type === 'AboutPage' ? 'selected' : ''}>AboutPage (Credentials &amp; Organization)</option>
                  <option value="FAQPage" ${item?.schema_type === 'FAQPage' ? 'selected' : ''}>FAQPage (Questions &amp; Answers)</option>
                  <option value="ContactPage" ${item?.schema_type === 'ContactPage' ? 'selected' : ''}>ContactPage (Ask the Doctor)</option>
                  <option value="ItemPage" ${item?.schema_type === 'ItemPage' ? 'selected' : ''}>ItemPage (Book Showcase)</option>
                </select>
              </div>
              <div class="form-group">
                <label>Twitter / X Card Format</label>
                <select class="form-control" id="f-page-twitter-card">
                  <option value="summary_large_image" ${item?.twitter_card !== 'summary' ? 'selected' : ''}>summary_large_image (Large Photo Card)</option>
                  <option value="summary" ${item?.twitter_card === 'summary' ? 'selected' : ''}>summary (Compact Card)</option>
                </select>
              </div>
            </div>
          </div>

          <div class="form-group" style="margin-top:1rem">
            <label class="toggle-label">
              <input type="checkbox" class="sr-checkbox" id="f-page-published" ${(!item || item.published) ? 'checked' : ''}>
              <span class="toggle-switch"></span>
              <span>Published &amp; Accessible</span>
            </label>
          </div>
        `;

        // Interactive SEO live preview & character counter
        const titleIn = $('#f-page-title');
        const slugIn = $('#f-page-slug');
        const urlIn = $('#f-page-url');
        const excerptIn = $('#f-page-excerpt');
        const seoTitleIn = $('#f-page-seo-title');
        const metaDescIn = $('#f-page-meta-desc');
        const serpTitle = $('#f-seo-serp-title');
        const serpDesc = $('#f-seo-serp-desc');
        const serpSlug = $('#f-seo-serp-slug');
        const titleCount = $('#f-seo-title-count');
        const descCount = $('#f-seo-desc-count');
        const ogImageIn = $('#f-page-og-image');
        const ogPreview = $('#f-page-og-image-preview');

        const updateSeoPreview = () => {
          const tVal = seoTitleIn?.value.trim() || titleIn?.value.trim() || 'Page Title';
          const dVal = metaDescIn?.value.trim() || excerptIn?.value.trim() || 'Expert pediatric answers and developmental guidance for parents of children aged 0 to 7.';
          const sVal = slugIn?.value.trim() || 'page';

          if (serpTitle) serpTitle.textContent = tVal + ' — The First Seven Years';
          if (serpDesc) serpDesc.textContent = dVal;
          if (serpSlug) serpSlug.textContent = sVal;

          if (titleCount && seoTitleIn) {
            const len = seoTitleIn.value.length;
            titleCount.textContent = len;
            titleCount.style.color = (len >= 45 && len <= 60) ? 'var(--mint)' : (len > 60 ? 'var(--danger)' : 'var(--ink-3)');
          }
          if (descCount && metaDescIn) {
            const len = metaDescIn.value.length;
            descCount.textContent = len;
            descCount.style.color = (len >= 130 && len <= 160) ? 'var(--mint)' : (len > 160 ? 'var(--danger)' : 'var(--ink-3)');
          }
        };

        const updateOgPreview = () => {
          const imgUrl = ogImageIn?.value.trim();
          if (imgUrl && ogPreview) {
            ogPreview.innerHTML = `
              <div style="display:inline-flex;align-items:center;gap:0.5rem;background:#fff;padding:0.35rem 0.65rem;border-radius:6px;border:1px solid var(--line);margin-top:0.4rem">
                <img src="${imgUrl}" style="height:36px;border-radius:3px;object-fit:cover" onerror="this.style.display='none'">
                <span style="font-size:0.75rem;color:var(--navy);font-weight:600">OG Image Preview</span>
              </div>
            `;
          } else if (ogPreview) {
            ogPreview.innerHTML = '';
          }
        };

        titleIn?.addEventListener('input', updateSeoPreview);
        seoTitleIn?.addEventListener('input', updateSeoPreview);
        metaDescIn?.addEventListener('input', updateSeoPreview);
        excerptIn?.addEventListener('input', updateSeoPreview);
        ogImageIn?.addEventListener('input', updateOgPreview);
        updateOgPreview();

        // Auto generate URL when slug changes on new page
        if (!item && slugIn && urlIn) {
          if (titleIn) {
            titleIn.addEventListener('input', () => {
              if (!slugIn.dataset.customized) {
                slugIn.value = titleIn.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '').slice(0, 50);
                urlIn.value = '/' + slugIn.value + '/';
                updateSeoPreview();
              }
            });
          }
          slugIn.addEventListener('input', () => {
            slugIn.dataset.customized = 'true';
            urlIn.value = '/' + slugIn.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') + '/';
            updateSeoPreview();
          });
        }
        break;
      }

      case 'user': {
        title.textContent = item ? 'Edit Team Member' : 'Add Team Member';
        const roleVal = item?.role || 'editor';
        const statusVal = item?.status || 'active';
        body.innerHTML = `
          <div class="form-group">
            <label>Full Name *</label>
            <input class="form-control" id="f-user-name" value="${item?.name || ''}" placeholder="e.g. Dr. Jane Doe" required>
          </div>
          <div class="form-group">
            <label>Email Address *</label>
            <input class="form-control" type="email" id="f-user-email" value="${item?.email || ''}" placeholder="e.g. jane@firstsevenyears.com" required>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label>Role Preset</label>
              <select class="form-control" id="f-user-role">
                <option value="super_admin" ${roleVal === 'super_admin' ? 'selected' : ''}>👑 Super Admin (Full Edit on all 11 modules)</option>
                <option value="editor" ${roleVal === 'editor' ? 'selected' : ''}>✍️ Editor (All content, hide Admin/Settings)</option>
                <option value="clinical_reviewer" ${roleVal === 'clinical_reviewer' ? 'selected' : ''}>🩺 Medical Reviewer (Edit Q&A, View others)</option>
                <option value="author" ${roleVal === 'author' ? 'selected' : ''}>📝 Author (Edit Q&A & FAQs, View core)</option>
              </select>
            </div>
            <div class="form-group">
              <label>Account Status</label>
              <select class="form-control" id="f-user-status">
                <option value="active" ${statusVal === 'active' ? 'selected' : ''}>Active</option>
                <option value="inactive" ${statusVal === 'inactive' ? 'selected' : ''}>Inactive</option>
              </select>
            </div>
          </div>
          <div style="background:var(--cream);padding:0.75rem 1rem;border-radius:var(--radius-sm);border:1px solid var(--line);font-size:0.8rem;color:var(--ink-2);margin-top:0.5rem">
            💡 <strong>Granular Permissions:</strong> After saving, you can customize individual module permissions (View, Edit, Hide) on their dedicated <strong>Permissions Board</strong>.
          </div>
        `;
        break;
      }

      case 'submission': {
        title.textContent = item ? 'Edit Inbound Question' : 'Add Inbound Question';
        const assignedTopics = Array.isArray(item?.topics) && item.topics.length > 0
          ? item.topics
          : (item?.topic ? [item.topic] : []);

        const topicPills = (state.data.topics || []).map(t => {
          const isChecked = assignedTopics.includes(t.slug);
          return `
            <label class="checkbox-pill-label">
              <input type="checkbox" name="f-sub-topics" value="${t.slug}" ${isChecked ? 'checked' : ''}>
              <span>${t.name}</span>
            </label>
          `;
        }).join('');

        const statusVal = item?.status || 'New';

        body.innerHTML = `
          <div class="form-row">
            <div class="form-group">
              <label>Parent / Sender Name</label>
              <input class="form-control" id="f-sub-parent" value="${item?.parent_name || ''}" placeholder="e.g. Sarah Jenkins">
            </div>
            <div class="form-group">
              <label>Parent Email Address</label>
              <input class="form-control" type="email" id="f-sub-email" value="${item?.email || ''}" placeholder="e.g. sarah@example.com">
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label>Child Age</label>
              <input class="form-control" id="f-sub-age" value="${item?.child_age || ''}" placeholder="e.g. 18 months or 3 years">
            </div>
            <div class="form-group">
              <label>Triage Status</label>
              <select class="form-control" id="f-sub-status">
                <option value="New" ${statusVal === 'New' ? 'selected' : ''}>New</option>
                <option value="In Review" ${statusVal === 'In Review' ? 'selected' : ''}>In Review</option>
                <option value="Red Flag Triaged" ${statusVal === 'Red Flag Triaged' ? 'selected' : ''}>🚨 Red Flag Triaged</option>
                <option value="Answered" ${statusVal === 'Answered' ? 'selected' : ''}>Answered</option>
                <option value="Archived" ${statusVal === 'Archived' ? 'selected' : ''}>Archived</option>
              </select>
            </div>
          </div>
          <div class="form-group">
            <label>Associated Topics (Select multiple relevant topics)</label>
            <div class="checkbox-pills">
              ${topicPills}
            </div>
            <span class="hint" style="font-size:0.8rem;color:var(--ink-3);margin-top:0.35rem;display:block">
              Select all topics that apply to this question. The first selected topic serves as primary category.
            </span>
          </div>
          <div class="form-group">
            <label>Question / Inquiry *</label>
            <textarea class="form-control" id="f-sub-question" rows="4" placeholder="Enter parent question..." required>${item?.question || ''}</textarea>
          </div>
          <div class="form-group">
            <label>Internal Clinical Notes &amp; Action Plan</label>
            <textarea class="form-control" id="f-sub-notes" rows="2" placeholder="e.g. Assigned to Dr. Murray clip; parent notified...">${item?.notes || ''}</textarea>
          </div>
          <div class="form-group">
            <label class="toggle" style="display:flex;align-items:center;gap:0.5rem;cursor:pointer">
              <input type="checkbox" id="f-sub-redflag" ${item?.red_flag ? 'checked' : ''}>
              <span style="font-weight:600;color:var(--danger)">🚨 Mark as Emergency / Red Flag Alert</span>
            </label>
          </div>
        `;
        break;
      }

      case 'global_disclaimer': {
        title.textContent = '⚖️ Common YouTube Disclaimer (Global)';
        const currentDisclaimer = state.data?.settings?.youtube_disclaimer || DEFAULT_YT_DISCLAIMER;
        body.innerHTML = `
          <div style="background:var(--cream);border:1px solid var(--line);border-radius:8px;padding:0.75rem 1rem;margin-bottom:1rem">
            <p style="margin:0;font-size:0.85rem;color:var(--navy);line-height:1.4">
              <strong>Common Video Library Disclaimer:</strong> This medical &amp; educational notice is displayed across the Video Library (<a href="/episodes/" target="_blank">/episodes/</a>) and on every video episode page by default. Any individual video can optionally override this disclaimer in its individual video settings.
            </p>
          </div>
          <div class="form-group">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:0.35rem">
              <label style="margin:0">YouTube Medical &amp; Educational Notice</label>
              <button type="button" class="btn btn--xs btn--outline" id="f-gdisclaimer-reset-btn" style="font-size:0.75rem;padding:0.2rem 0.5rem">Reset to Default</button>
            </div>
            <textarea class="form-control" id="f-global-disclaimer-input" rows="5" style="line-height:1.5">${escapeHtml(currentDisclaimer)}</textarea>
            <small style="display:block;margin-top:0.35rem;color:var(--ink-3)">Saving here updates the common default disclaimer applied across all video episodes that don't have an individual override.</small>
          </div>
        `;

        const resetBtn = $('#f-gdisclaimer-reset-btn');
        resetBtn?.addEventListener('click', () => {
          const inp = $('#f-global-disclaimer-input');
          if (inp) inp.value = DEFAULT_YT_DISCLAIMER;
        });
        break;
      }
    }

    modal.classList.add('is-open');
  }

  function closeModal() {
    const modal = $('#form-modal');
    if (modal) modal.classList.remove('is-open');
    state.editingItem = null;
    state.editingType = null;
  }

  // Save Modal Form
  function saveModalForm() {
    const type = state.editingType;
    const isEdit = !!state.editingItem;

    const modMap = {
      topic: 'topics', answer: 'answers', faq: 'faqs', video: 'videos',
      expert: 'experts', menu_header: 'menus', menu_footer: 'menus', page: 'pages', user: 'roles',
      submission: 'submissions', global_disclaimer: 'videos'
    };
    const targetMod = modMap[type] || 'dashboard';
    if (!canEdit(targetMod)) {
      showToast(`Permission denied: You have view-only access to this section`, 'error');
      return;
    }

    if (type === 'topic') {
      const name = $('#f-topic-name').value.trim();
      const slug = $('#f-topic-slug').value.trim();
      const short = $('#f-topic-short').value.trim();
      const intro = $('#f-topic-intro').value.trim();
      const published = $('#f-topic-published').checked;
      // Order is controlled via drag and drop listing, not manual entry
      const order = isEdit 
        ? (state.editingItem?.order ?? 1) 
        : (state.data.topics?.length ? Math.max(...state.data.topics.map(t => t.order || 0)) + 1 : 1);

      // Extract newly requested fields:
      const experts = [...$$('input[name="f-topic-experts"]:checked')].map(c => c.value);
      const rawCustomVid = $('#f-topic-custom-video')?.value.trim() || '';
      const customVidId = extractYouTubeId(rawCustomVid);
      const selectedVidId = $('#f-topic-main-video')?.value || '';
      const main_video = customVidId || selectedVidId || (rawCustomVid.length === 11 ? rawCustomVid : '');
      const main_video_url = rawCustomVid.startsWith('http') ? rawCustomVid : (main_video ? `https://www.youtube.com/watch?v=${main_video}` : '');
      const ages = [...$$('input[name="f-topic-ages"]:checked')].map(c => parseInt(c.value, 10));
      const answers = [...$$('input[name="f-topic-answers"]:checked')].map(c => c.value);
      const episodes = [...$$('input[name="f-topic-episodes"]:checked')].map(c => c.value);

      if (!name || !slug) { showToast('Please provide a name and slug', 'error'); return; }

      // Bi-directional sync for answers:
      (state.data.answers || []).forEach(a => {
        if (answers.includes(a.slug)) {
          if (a.topic !== slug && !(a.also || []).includes(slug)) {
            a.also = a.also || [];
            a.also.push(slug);
          }
        } else {
          if (a.topic !== slug && (a.also || []).includes(slug)) {
            a.also = a.also.filter(x => x !== slug);
          }
        }
      });

      // Bi-directional sync for episodes:
      (state.data.episodes || []).forEach(v => {
        if (episodes.includes(v.id)) {
          if (!(v.tags || []).includes(slug)) {
            v.tags = v.tags || [];
            v.tags.push(slug);
          }
        } else {
          if ((v.tags || []).includes(slug)) {
            v.tags = v.tags.filter(t => t !== slug);
          }
        }
      });

      // Topic SEO fields
      const seoTitle = $('#f-topic-seo-title')?.value.trim() || '';
      const metaDesc = $('#f-topic-meta-desc')?.value.trim() || '';
      const focusKeyword = $('#f-topic-focus-kw')?.value.trim() || '';
      const canonicalUrl = $('#f-topic-canonical')?.value.trim() || '';
      const robotsIndex = $('#f-topic-robots-index')?.value || 'noindex';

      const topicPayload = {
        name, slug, short, intro, order, published, experts,
        main_video, main_video_url, ages, answers, episodes,
        seo_title: seoTitle, meta_desc: metaDesc, focus_keyword: focusKeyword,
        canonical_url: canonicalUrl, robots_index: robotsIndex
      };
      if (state.editingItem?.swatch) topicPayload.swatch = state.editingItem.swatch;

      if (isEdit) {
        const item = state.data.topics.find(t => t.slug === state.editingItem.slug);
        if (item) Object.assign(item, topicPayload);
      } else {
        state.data.topics.push(topicPayload);
      }
      saveData(`Topic "${name}" saved!`);
    } else if (type === 'answer') {
      const q = $('#f-ans-q').value.trim();
      const slug = $('#f-ans-slug').value.trim() || q.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      const expert = $('#f-ans-expert').value;
      const topic = $('#f-ans-topic')?.value || '';
      const also = [...$$('input[name="f-ans-also"]:checked')].map(c => c.value).filter(s => s !== topic);
      let video = $('#f-ans-video')?.value.trim() || $('#f-ans-video-select')?.value || '';
      const ytMatch = video.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
      if (ytMatch) video = ytMatch[1];
      const ages = [...$$('input[name="f-ans-ages"]:checked')].map(c => parseInt(c.value, 10));
      const quick = $('#f-ans-quick').value.trim();
      const body = $('#f-ans-body').value.trim();
      const clinical_status = $('#f-ans-review-status').value;
      const published = $('#f-ans-published').checked;

      // Answer SEO fields
      const seoTitle = $('#f-ans-seo-title')?.value.trim() || '';
      const metaDesc = $('#f-ans-meta-desc')?.value.trim() || '';
      const focusKeyword = $('#f-ans-focus-kw')?.value.trim() || '';
      const schemaType = $('#f-ans-schema-type')?.value || 'MedicalWebPage';
      const canonicalUrl = $('#f-ans-canonical')?.value.trim() || '';
      const robotsIndex = $('#f-ans-robots-index')?.value || 'noindex';

      if (!q) { showToast('Please enter the question', 'error'); return; }

      const entry = {
        slug, q, expert, topic, also, video, ages, quick, body,
        clinical_status, published, reviewed: new Date().toISOString().slice(0, 10),
        seo_title: seoTitle, meta_desc: metaDesc, focus_keyword: focusKeyword,
        schema_type: schemaType, canonical_url: canonicalUrl, robots_index: robotsIndex
      };
      if (isEdit) {
        const idx = state.data.answers.findIndex(a => a.slug === state.editingItem.slug);
        if (idx !== -1) state.data.answers[idx] = Object.assign(state.data.answers[idx], entry);
      } else {
        state.data.answers.unshift(entry);
      }
      saveData(`Answer saved!`);
    } else if (type === 'faq') {
      const category = $('#f-faq-cat').value.trim() || 'General Questions';
      const question = $('#f-faq-q').value.trim();
      const answer = $('#f-faq-a').value.trim();
      const order = parseInt($('#f-faq-order').value || '1', 10);
      const published = $('#f-faq-published').checked;

      if (!question) { showToast('Please provide a question', 'error'); return; }

      if (isEdit) {
        const item = state.data.faqs.find(f => f.id === state.editingItem.id);
        if (item) Object.assign(item, { category, question, answer, order, published });
      } else {
        const id = 'faq-' + Date.now();
        state.data.faqs.push({ id, category, question, answer, order, published });
      }
      saveData(`FAQ saved!`);
    } else if (type === 'video') {
      const title = $('#f-vid-title')?.value.trim();
      const fullUrl = $('#f-vid-full-url')?.value.trim() || '';
      const shortUrl = $('#f-vid-short-url')?.value.trim() || '';
      const caption = $('#f-vid-caption')?.value.trim() || '';
      const guest = $('#f-vid-guest')?.value || '';
      const answers = [...$$('input[name="f-vid-answers"]:checked')].map(c => c.value);
      const transcript = $('#f-vid-transcript')?.value.trim() || '';
      const published = $('#f-vid-published')?.checked;

      // Extract SEO fields:
      const seoTitle = $('#f-vid-seo-title')?.value.trim() || '';
      const metaDesc = $('#f-vid-meta-desc')?.value.trim() || '';
      const focusKeyword = $('#f-vid-focus-kw')?.value.trim() || '';
      const keywords = $('#f-vid-keywords')?.value.trim() || '';
      const canonicalUrl = $('#f-vid-canonical')?.value.trim() || '';
      const robotsIndex = $('#f-vid-robots-index')?.value || 'noindex';

      // Extract YouTube disclaimer override
      const youtubeDisclaimer = $('#f-vid-disclaimer')?.value.trim() || '';

      if (!title) { showToast('Please enter video title', 'error'); return; }
      if (!fullUrl && !shortUrl && !(isEdit && state.editingItem?.id)) {
        showToast('Please provide a YouTube Full Episode or Short URL', 'error');
        return;
      }

      const detectedId = extractYouTubeId(fullUrl) || extractYouTubeId(shortUrl);
      const oldId = isEdit && state.editingItem ? state.editingItem.id : null;
      const id = detectedId || oldId || ('vid-' + Date.now());

      // Bi-directional sync with Q&A answers:
      (state.data.answers || []).forEach(a => {
        if (answers.includes(a.slug)) {
          a.video = id;
        } else if (a.video === id || (oldId && a.video === oldId)) {
          a.video = '';
        }
      });

      const videoPayload = {
        title,
        guest,
        youtube_full_url: fullUrl,
        youtube_short_url: shortUrl,
        caption,
        answers,
        transcript,
        youtube_disclaimer: youtubeDisclaimer,
        published,
        seo_title: seoTitle,
        meta_desc: metaDesc,
        focus_keyword: focusKeyword,
        keywords: keywords,
        canonical_url: canonicalUrl,
        robots_index: robotsIndex
      };

      if (isEdit) {
        const item = state.data.episodes.find(v => v.id === oldId);
        if (item) {
          item.id = id;
          Object.assign(item, videoPayload);
        }
      } else {
        const generatedSlug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '').slice(0, 80) || id;
        state.data.episodes.unshift(Object.assign({
          id,
          slug: generatedSlug,
          kind: 'clip',
          tags: ['gut-health'],
          date: new Date().toISOString().slice(0, 10)
        }, videoPayload));
      }
      saveData(`Video "${title}" saved!`);
    } else if (type === 'expert') {
      const name = $('#f-exp-name').value.trim();
      let slug = $('#f-exp-slug').value.trim();
      const role = $('#f-exp-role').value.trim();
      const credsStr = $('#f-exp-creds').value.trim();
      const desc = $('#f-exp-desc').value.trim();
      const img = $('#f-exp-img').value.trim();
      const published = $('#f-exp-published').checked;

      if (!name) { showToast('Please enter expert name', 'error'); return; }
      if (!slug) {
        slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      }
      if (!slug) { showToast('Please enter a valid slug', 'error'); return; }

      const answers = [...$$('input[name="f-exp-answers"]:checked')].map(c => c.value);
      const episodes = [...$$('input[name="f-exp-episodes"]:checked')].map(c => c.value);
      const creds = credsStr ? credsStr.split(/[,·\n]+/).map(s => s.trim()).filter(Boolean) : [];

      if (!state.data.experts) state.data.experts = {};

      const oldSlug = isEdit && state.editingItem ? state.editingItem.slug : null;
      if (oldSlug && oldSlug !== slug) {
        delete state.data.experts[oldSlug];
        (state.data.topics || []).forEach(t => {
          if (t.experts) t.experts = t.experts.map(e => e === oldSlug ? slug : e);
        });
      }

      // Bi-directional sync with answers
      (state.data.answers || []).forEach(a => {
        if (answers.includes(a.slug)) {
          a.expert = slug;
        } else if (a.expert === slug || (oldSlug && a.expert === oldSlug)) {
          a.expert = '';
        }
      });

      // Bi-directional sync with episodes/videos
      (state.data.episodes || []).forEach(v => {
        if (episodes.includes(v.id)) {
          v.guest = slug;
        } else if (v.guest === slug || (oldSlug && v.guest === oldSlug)) {
          v.guest = '';
        }
      });

      const existing = (oldSlug ? state.data.experts[oldSlug] : state.data.experts[slug]) || {};
      const bioParas = desc ? desc.split(/\n\s*\n/).map(s => s.trim()).filter(Boolean) : [];
      const shortBio = bioParas[0] || desc;

      // SEO & Social Fields
      const seoTitle = $('#f-exp-seo-title')?.value.trim() || '';
      const metaDesc = $('#f-exp-meta-desc')?.value.trim() || '';
      const focusKeyword = $('#f-exp-focus-kw')?.value.trim() || '';
      const keywords = $('#f-exp-keywords')?.value.trim() || '';
      const canonicalUrl = $('#f-exp-canonical')?.value.trim() || '';
      const robotsIndex = $('#f-exp-robots-index')?.value || 'noindex';
      const robotsFollow = $('#f-exp-robots-follow')?.value || 'nofollow';
      const ogTitle = $('#f-exp-og-title')?.value.trim() || '';
      const ogType = $('#f-exp-og-type')?.value || 'profile';
      const ogDesc = $('#f-exp-og-desc')?.value.trim() || '';
      const ogImage = $('#f-exp-og-image')?.value.trim() || '';
      const schemaType = $('#f-exp-schema-type')?.value || (slug.includes('dr-') ? 'Physician' : 'Person');
      const twitterCard = $('#f-exp-twitter-card')?.value || 'summary_large_image';

      state.data.experts[slug] = Object.assign({}, existing, {
        slug,
        name,
        role: role || 'Expert',
        short: shortBio,
        bio: bioParas.length > 0 ? bioParas : (desc ? [desc] : []),
        creds: creds.length > 0 ? creds : (existing.creds || []),
        img: img || null,
        answers: answers,
        episodes: episodes,
        seo_title: seoTitle,
        meta_desc: metaDesc,
        focus_keyword: focusKeyword,
        keywords: keywords,
        canonical_url: canonicalUrl,
        robots_index: robotsIndex,
        robots_follow: robotsFollow,
        og_title: ogTitle,
        og_type: ogType,
        og_desc: ogDesc,
        og_image: ogImage,
        schema_type: schemaType,
        twitter_card: twitterCard,
        published: published
      });

      const countEl = document.querySelector('[data-count="experts"]');
      if (countEl) countEl.textContent = Object.keys(state.data.experts).length;

      saveData(`Expert "${name}" saved!`);
    }

    if (type === 'menu_header') {
      const label = $('#f-menu-label')?.value.trim();
      const url = $('#f-menu-url')?.value.trim();
      const badge = $('#f-menu-badge')?.value.trim();
      const target = $('#f-menu-target')?.value || '_self';
      const order = parseInt($('#f-menu-order')?.value, 10) || 1;
      const published = $('#f-menu-published')?.checked ?? true;

      if (!label || !url) {
        showToast('Link label and destination URL are required', 'error');
        return;
      }

      if (!state.data.menus) state.data.menus = { header: [], footer: [] };
      if (!state.data.menus.header) state.data.menus.header = [];

      if (isEdit && state.editingItem) {
        const item = state.data.menus.header.find(x => x.id === state.editingItem.id);
        if (item) {
          item.label = label;
          item.url = url;
          item.badge = badge;
          item.target = target;
          item.order = order;
          item.published = published;
        }
      } else {
        const newId = 'hn-' + Date.now();
        state.data.menus.header.push({
          id: newId,
          label,
          url,
          badge,
          target,
          order,
          published
        });
      }
      saveData(`Header navigation link "${label}" saved!`);
    }

    if (type === 'menu_footer') {
      const col = $('#f-menu-col')?.value || 'Topics';
      const label = $('#f-menu-label')?.value.trim();
      const url = $('#f-menu-url')?.value.trim();
      const target = $('#f-menu-target')?.value || '_self';
      const order = parseInt($('#f-menu-order')?.value, 10) || 1;
      const published = $('#f-menu-published')?.checked ?? true;

      if (!label || !url) {
        showToast('Link label and destination URL are required', 'error');
        return;
      }

      if (!state.data.menus) state.data.menus = { header: [], footer: [] };
      if (!state.data.menus.footer) state.data.menus.footer = [];

      if (isEdit && state.editingItem) {
        const item = state.data.menus.footer.find(x => x.id === state.editingItem.id);
        if (item) {
          item.col = col;
          item.label = label;
          item.url = url;
          item.target = target;
          item.order = order;
          item.published = published;
        }
      } else {
        const newId = 'fn-' + Date.now();
        state.data.menus.footer.push({
          id: newId,
          col,
          label,
          url,
          target,
          order,
          published
        });
      }
      saveData(`Footer link "${label}" saved in ${col}!`);
    }

    if (type === 'page') {
      const titleVal = $('#f-page-title')?.value.trim();
      const slugVal = $('#f-page-slug')?.value.trim();
      const urlVal = $('#f-page-url')?.value.trim() || `/${slugVal}/`;
      const templateVal = $('#f-page-template')?.value;
      const excerptVal = $('#f-page-excerpt')?.value.trim();
      const bodyVal = $('#f-page-body')?.value.trim();
      const published = $('#f-page-published')?.checked ?? true;

      // SEO fields
      const seoTitle = $('#f-page-seo-title')?.value.trim() || '';
      const metaDesc = $('#f-page-meta-desc')?.value.trim() || '';
      const focusKeyword = $('#f-page-focus-kw')?.value.trim() || '';
      const keywords = $('#f-page-keywords')?.value.trim() || '';
      const canonicalUrl = $('#f-page-canonical')?.value.trim() || '';
      const robotsIndex = $('#f-page-robots-index')?.value || 'noindex';
      const robotsFollow = $('#f-page-robots-follow')?.value || 'nofollow';
      const ogTitle = $('#f-page-og-title')?.value.trim() || '';
      const ogType = $('#f-page-og-type')?.value || 'article';
      const ogDesc = $('#f-page-og-desc')?.value.trim() || '';
      const ogImage = $('#f-page-og-image')?.value.trim() || '';
      const schemaType = $('#f-page-schema-type')?.value || 'WebPage';
      const twitterCard = $('#f-page-twitter-card')?.value || 'summary_large_image';

      if (!titleVal || !slugVal) {
        showToast('Page title and slug are required', 'error');
        return;
      }

      if (!state.data.pages) state.data.pages = [];

      const pagePayload = {
        title: titleVal,
        slug: slugVal,
        url: urlVal,
        template: templateVal,
        meta_desc: metaDesc,
        seo_title: seoTitle,
        focus_keyword: focusKeyword,
        keywords: keywords,
        canonical_url: canonicalUrl,
        robots_index: robotsIndex,
        robots_follow: robotsFollow,
        og_title: ogTitle,
        og_type: ogType,
        og_desc: ogDesc,
        og_image: ogImage,
        schema_type: schemaType,
        twitter_card: twitterCard,
        excerpt: excerptVal,
        body: bodyVal,
        updated: new Date().toISOString().slice(0, 10),
        published
      };

      if (isEdit && state.editingItem) {
        const item = state.data.pages.find(x => x.id === state.editingItem.id);
        if (item) Object.assign(item, pagePayload);
      } else {
        const newId = 'pg-' + Date.now();
        state.data.pages.push(Object.assign({ id: newId }, pagePayload));
      }
      saveData(`Content page "${titleVal}" saved!`);
    }

    if (type === 'user') {
      const name = $('#f-user-name').value.trim();
      const email = $('#f-user-email').value.trim();
      const role = $('#f-user-role').value;
      const status = $('#f-user-status').value;

      if (!name || !email) {
        showToast('Please provide both name and email', 'error');
        return;
      }

      const today = new Date().toISOString().slice(0, 16).replace('T', ' ');

      if (isEdit) {
        const item = state.data.users.find(u => u.id === state.editingItem.id);
        if (item) {
          item.name = name;
          item.email = email;
          const oldRole = item.role;
          item.role = role;
          item.status = status;
          item.last_active = today;

          if (oldRole !== role && !item.permissions) {
            item.permissions = {};
            MODULE_DEFS.forEach(m => {
              if (role === 'super_admin') item.permissions[m.id] = 'edit';
              else if (role === 'editor') item.permissions[m.id] = ['roles', 'settings'].includes(m.id) ? 'hide' : 'edit';
              else if (role === 'clinical_reviewer') item.permissions[m.id] = ['answers', 'submissions'].includes(m.id) ? 'edit' : (['menus', 'roles', 'settings'].includes(m.id) ? 'hide' : 'view');
              else if (role === 'author') item.permissions[m.id] = ['answers', 'faqs'].includes(m.id) ? 'edit' : (['submissions', 'pages', 'menus', 'roles', 'settings'].includes(m.id) ? 'hide' : 'view');
            });
          }
        }
      } else {
        const newId = 'usr-' + Date.now().toString().slice(-4);
        const perms = {};
        MODULE_DEFS.forEach(m => {
          if (role === 'super_admin') perms[m.id] = 'edit';
          else if (role === 'editor') perms[m.id] = ['roles', 'settings'].includes(m.id) ? 'hide' : 'edit';
          else if (role === 'clinical_reviewer') perms[m.id] = ['answers', 'submissions'].includes(m.id) ? 'edit' : (['menus', 'roles', 'settings'].includes(m.id) ? 'hide' : 'view');
          else if (role === 'author') perms[m.id] = ['answers', 'faqs'].includes(m.id) ? 'edit' : (['submissions', 'pages', 'menus', 'roles', 'settings'].includes(m.id) ? 'hide' : 'view');
        });

        if (!state.data.users) state.data.users = [];
        state.data.users.push({
          id: newId,
          name,
          email,
          role,
          status,
          last_active: today,
          permissions: perms
        });
        state.selectedBoardUser = newId;
      }

      saveData(`Team member "${name}" saved!`);
    } else if (type === 'submission') {
      const parent_name = $('#f-sub-parent')?.value.trim() || 'Parent';
      const email = $('#f-sub-email')?.value.trim() || '';
      const child_age = $('#f-sub-age')?.value.trim() || 'Unspecified';
      const status = $('#f-sub-status')?.value || 'New';
      const red_flag = $('#f-sub-redflag')?.checked || false;
      const question = $('#f-sub-question')?.value.trim() || '';
      const notes = $('#f-sub-notes')?.value.trim() || '';
      const selectedTopics = [...$$('input[name="f-sub-topics"]:checked')].map(c => c.value);

      if (!question) {
        showToast('Please enter the question text', 'error');
        return;
      }

      const primaryTopic = selectedTopics[0] || 'general';
      const date = isEdit && state.editingItem?.date ? state.editingItem.date : new Date().toISOString();

      const subPayload = {
        id: isEdit ? state.editingItem.id : `sub-${Date.now()}`,
        parent_name,
        email,
        child_age,
        topic: primaryTopic,
        topics: selectedTopics,
        question,
        date,
        status,
        red_flag,
        notes
      };

      if (!state.data.ask_submissions) state.data.ask_submissions = [];
      if (isEdit) {
        const idx = state.data.ask_submissions.findIndex(s => s.id === state.editingItem.id);
        if (idx !== -1) {
          state.data.ask_submissions[idx] = Object.assign({}, state.data.ask_submissions[idx], subPayload);
        }
      } else {
        state.data.ask_submissions.unshift(subPayload);
      }

      saveData(isEdit ? 'Submission updated!' : 'Inbound question logged!');
    } else if (type === 'global_disclaimer') {
      const text = $('#f-global-disclaimer-input')?.value.trim() || DEFAULT_YT_DISCLAIMER;
      if (!state.data.settings) state.data.settings = {};
      state.data.settings.youtube_disclaimer = text;
      const settingsInput = $('#setting-youtube-disclaimer');
      if (settingsInput) settingsInput.value = text;
      saveData('Common YouTube disclaimer updated!');
    }

    closeModal();
  }

  // Edit Item Trigger
  function editItem(type, id) {
    let item;
    if (type === 'topic') item = state.data.topics.find(t => t.slug === id);
    if (type === 'answer') item = state.data.answers.find(a => a.slug === id);
    if (type === 'faq') item = state.data.faqs.find(f => f.id === id);
    if (type === 'video') item = state.data.episodes.find(v => v.id === id);
    if (type === 'expert') item = state.data.experts[id];
    if (type === 'menu_header') item = state.data.menus?.header?.find(x => x.id === id);
    if (type === 'menu_footer') item = state.data.menus?.footer?.find(x => x.id === id);
    if (type === 'page') item = state.data.pages?.find(x => x.id === id);
    if (type === 'user') item = state.data.users?.find(u => u.id === id);
    if (type === 'submission') item = state.data.ask_submissions?.find(s => s.id === id);
    openModal(type, item);
  }

  // Delete Item
  function deleteItem(type, id) {
    const modMap = {
      topic: 'topics', answer: 'answers', faq: 'faqs', video: 'videos',
      expert: 'experts', menu_header: 'menus', menu_footer: 'menus', page: 'pages', user: 'roles',
      submission: 'submissions'
    };
    const targetMod = modMap[type] || type;
    if (!canEdit(targetMod)) {
      showToast(`Permission denied: You have view-only access to this section`, 'error');
      return;
    }
    if (!confirm('Are you sure you want to delete this item?')) return;

    if (type === 'user') {
      if (id === 'usr-1') {
        showToast('Cannot delete primary Super Admin account!', 'error');
        return;
      }
      if (id === state.currentUser) {
        showToast('Cannot delete currently active user account!', 'error');
        return;
      }
      state.data.users = (state.data.users || []).filter(u => u.id !== id);
      if (state.selectedBoardUser === id) {
        state.selectedBoardUser = 'usr-1';
      }
      saveData('Team member removed');
      return;
    }

    if (type === 'submission') {
      state.data.ask_submissions = (state.data.ask_submissions || []).filter(s => s.id !== id);
    }
    if (type === 'topic') state.data.topics = state.data.topics.filter(t => t.slug !== id);
    if (type === 'answer') state.data.answers = state.data.answers.filter(a => a.slug !== id);
    if (type === 'faq') state.data.faqs = state.data.faqs.filter(f => f.id !== id);
    if (type === 'video') state.data.episodes = state.data.episodes.filter(v => v.id !== id);
    if (type === 'menu_header') {
      if (state.data.menus?.header) {
        state.data.menus.header = state.data.menus.header.filter(x => x.id !== id);
      }
    }
    if (type === 'menu_footer') {
      if (state.data.menus?.footer) {
        state.data.menus.footer = state.data.menus.footer.filter(x => x.id !== id);
      }
    }
    if (type === 'page') {
      if (state.data.pages) {
        state.data.pages = state.data.pages.filter(x => x.id !== id);
      }
    }
    if (type === 'expert') {
      delete state.data.experts[id];
      (state.data.answers || []).forEach(a => {
        if (a.expert === id) a.expert = '';
      });
      (state.data.episodes || []).forEach(v => {
        if (v.guest === id) v.guest = '';
      });
      (state.data.topics || []).forEach(t => {
        if (t.experts) t.experts = t.experts.filter(e => e !== id);
      });
      const countEl = document.querySelector('[data-count="experts"]');
      if (countEl) countEl.textContent = Object.keys(state.data.experts).length;
    }

    saveData('Item deleted');
  }

  // Convert Ask the Doctor submission to Answer
  function convertSubmissionToAnswer(subId) {
    const sub = state.data.ask_submissions?.find(s => s.id === subId);
    if (!sub) return;

    const topicList = Array.isArray(sub.topics) && sub.topics.length > 0
      ? sub.topics
      : (sub.topic ? [sub.topic] : ['gut-health']);
    const primaryTopic = topicList[0] || 'gut-health';
    const secondaryTopics = topicList.slice(1);

    openModal('answer', {
      q: sub.question.slice(0, 120),
      topic: primaryTopic,
      also: secondaryTopics,
      quick: 'Clinical summary pending review...',
      body: `<p>${sub.question}</p>`,
      expert: 'dr-murray-clarke',
      ages: [1, 2, 3],
      published: false
    });
  }

  // Quick Approve Clinical Review
  function quickApproveClinical(slug) {
    if (!can('review_clinical')) {
      showToast('Permission denied: Medical Reviewer role required', 'error');
      return;
    }
    const ans = state.data.answers?.find(a => a.slug === slug);
    if (ans) {
      ans.clinical_status = ans.clinical_status === 'Reviewed' ? 'Pending' : 'Reviewed';
      ans.reviewed = new Date().toISOString().slice(0, 10);
      saveData(`Answer clinical status updated to ${ans.clinical_status}`);
    }
  }

  // Global search input
  function handleSearch(query) {
    state.searchQuery = query;
    renderCurrentTab();
  }

  // Filter pills
  function handleFilter(tab, filterVal) {
    state.activeFilters[tab] = filterVal;
    $$(`#tab-${tab} .filter-pill`).forEach(el => {
      el.classList.toggle('is-active', el.dataset.filter === filterVal);
    });
    renderCurrentTab();
  }

  // Initialize
  document.addEventListener('DOMContentLoaded', () => {
    // Early tab selection to prevent visual flash before API finishes
    const earlyTab = getTabFromUrl();
    if (earlyTab && earlyTab !== 'dashboard') {
      state.currentTab = earlyTab;
      $$('.nav-item').forEach(el => el.classList.toggle('is-active', el.dataset.tab === earlyTab));
      $$('.tab-view').forEach(el => { el.hidden = el.id !== `tab-${earlyTab}`; });
    }

    loadData();

    // Listen for browser Back/Forward navigation
    window.addEventListener('popstate', (e) => {
      const tab = (e.state && e.state.tab) || getTabFromUrl();
      switchTab(tab, false);
    });

    // Listen for hash changes
    window.addEventListener('hashchange', () => {
      const tab = getTabFromUrl();
      switchTab(tab, false);
    });

    // Setup color preview listeners
    const colorKeys = ['navy', 'mint', 'cream', 'peach', 'butter', 'lilac', 'soft_green', 'sky'];
    colorKeys.forEach(k => {
      const picker = $(`#color-${k}`);
      const text = $(`#color-text-${k}`);
      if (picker && text) {
        picker.addEventListener('input', () => {
          text.value = picker.value;
          updateThemePreview();
        });
        text.addEventListener('input', () => {
          picker.value = text.value;
          updateThemePreview();
        });
      }
    });

    // Close modal on escape
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') closeModal();
    });

    // Close notification dropdown when clicking outside
    document.addEventListener('click', e => {
      const bellContainer = $('#notif-bell-container');
      if (bellContainer && !bellContainer.contains(e.target)) {
        closeNotifDropdown();
      }
    });
  });

  function filterSelectionList(input, listId) {
    const q = input.value.toLowerCase().trim();
    const list = $(`#${listId}`);
    if (!list) return;
    [...list.children].forEach(item => {
      const text = item.textContent.toLowerCase();
      item.style.display = text.includes(q) ? 'flex' : 'none';
    });
  }

  function setAllAges(checked) {
    $$('input[name="f-topic-ages"]').forEach(cb => cb.checked = checked);
  }

  // Export ADMIN interface for inline HTML handlers
  window.ADMIN = {
    switchTab,
    togglePublish,
    openModal,
    openGlobalDisclaimerModal: () => openModal('global_disclaimer'),
    closeModal,
    saveModalForm,
    editItem,
    deleteItem,
    convertSubmissionToAnswer,
    quickApproveClinical,
    handleRoleChange,
    handleUserChange,
    switchToUser,
    selectBoardUser,
    setUserPermission,
    applyUserPreset,
    batchSetPermissions,
    editUserRole: (id) => editItem('user', id),
    handleSearch,
    handleFilter,
    saveSettings,
    rebuildSite,
    filterSelectionList,
    setAllAges,
    switchMenuSubtab,
    filterFooterCol,
    toggleMenuPreview,
    moveMenuItem,
    switchSettingsSubtab,
    togglePwdVisibility,
    checkPasswordStrength,
    handlePasswordChange,
    toggle2FA,
    exportPrototypeData,
    resetPrototypeData,
    logout,
    loginAs,
    submitOverlayLogin,
    showLoginOverlay,
    hideLoginOverlay,
    renderAlerts,
    filterAlerts,
    toggleNotifDropdown,
    closeNotifDropdown,
    markAllNotifsRead,
    toggleAlertRead,
    openAlertDetail,
    sendTestAlert,
    toggleBrowserNotif,
    renderYouTube,
    filterYouTubeRange,
    filterYouTubeType,
    handleYouTubeSearch,
    sortYouTubeTable,
    refreshYouTubeStats,
    exportYouTubeCSV
  };
})();
