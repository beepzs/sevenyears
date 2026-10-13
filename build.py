#!/usr/bin/env python3
"""
The First Seven Years — static site generator (prototype).

One content model -> every page, so header/footer/schema never drift.
The model mirrors the Shopify build in the proposal: episodes and answers
become blog articles, topics and experts become metaobjects, the book a product.

    python3 build.py        # writes ./site
"""
import json, re, html, os, datetime
from pathlib import Path

ROOT = Path(os.environ.get("OUT") or Path(__file__).parent / "site").resolve()
SITE = "https://thefirstsevenyears.com"   # TODO: confirm production domain
YT = "https://www.youtube.com/@thefirstsevenyears"
TODAY = datetime.date(2026, 9, 30)
STAGING = os.environ.get("STAGING") == "1"   # review builds: noindex everywhere
esc = html.escape

# --------------------------------------------------------------------------
# ICONS (Lucide-style strokes, inline so there is no icon font request)
# --------------------------------------------------------------------------
def icon(name, label=None):
    p = {
        "search": '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',
        "arrow": '<path d="M5 12h14"/><path d="m13 6 6 6-6 6"/>',
        "menu": '<path d="M4 7h16M4 12h16M4 17h10"/>',
        "close": '<path d="M6 6l12 12M18 6 6 18"/>',
        "play": '<path d="M7 4.5v15l13-7.5z" fill="currentColor" stroke="none"/>',
        "youtube": '<rect x="2.5" y="5.5" width="19" height="13" rx="4"/><path d="m10 9.5 5 2.5-5 2.5z" fill="currentColor"/>',
        "mail": '<rect x="3" y="5" width="18" height="14" rx="3"/><path d="m4 7 8 6 8-6"/>',
        "chat": '<path d="M20 12a8 8 0 0 1-11.6 7.1L4 20l1-4.1A8 8 0 1 1 20 12z"/>',
        "check": '<path d="m5 12.5 4.5 4.5L19 7.5"/>',
        "shield": '<path d="M12 3 4.5 6v5.5c0 4.6 3.2 8.2 7.5 9.5 4.3-1.3 7.5-4.9 7.5-9.5V6z"/><path d="m9 12 2 2 4-4"/>',
        "calendar": '<rect x="3.5" y="5" width="17" height="15" rx="3"/><path d="M8 3v4M16 3v4M3.5 10h17"/>',
        "book": '<path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15H6.5A2.5 2.5 0 0 0 4 20.5z"/><path d="M4 20.5A2.5 2.5 0 0 1 6.5 18H20v3H6.5"/>',
        "link": '<path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1"/><path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"/>',
        "alert": '<path d="M12 3 2 20h20z"/><path d="M12 10v4M12 17.5v.01"/>',
        "users": '<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0 1 13 0"/><path d="M16 4.5a3.5 3.5 0 0 1 0 7M18 14.5a6.5 6.5 0 0 1 3.5 5.5"/>',
        "sparkle": '<path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M6 18l2.5-2.5M15.5 8.5 18 6"/>',
    }[name]
    a11y = f'role="img" aria-label="{esc(label)}"' if label else 'aria-hidden="true" focusable="false"'
    return f'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" {a11y}>{p}</svg>'

def logo(cls="", size=None):
    style = f' style="--logo:{size}px"' if size else ""
<<<<<<< HEAD
    return f'<img class="logo {cls}"{style} src="/assets/img/logo.jpg" alt="The First Seven Years" width="160" height="160">'
=======
    return (f'<span class="logo {cls}"{style} aria-hidden="true"><span class="l-sm">The First</span>'
            f'<span>Seven</span><span>Years</span><span class="l-sq">{"<i></i>" * 7}</span></span>')
>>>>>>> fe0bcab547943f6d16a1d6afc96becba158800f2

# --------------------------------------------------------------------------
# CONTENT MODEL
# --------------------------------------------------------------------------
TOPICS = [
    # slug, name, short description, swatch, hub intro
    ("gut-health", "Gut health & microbiome", "Tummies, probiotics and the gut–brain link", "#bfe4c6",
     "Much of your child’s immune system lives in the gut, and the microbes that settle there in the first years shape far more than digestion. Start here for the plain-English basics."),
    ("first-foods", "Nutrition & first foods", "Starting solids, balanced plates, real food", "#fbe7ac",
     "From first spoonfuls to lunchbox years — how to build a varied diet without turning mealtimes into a project."),
    ("picky-eating", "Picky eating", "When they won’t eat, or only eat beige", "#fad7c4",
     "Selective eating is one of the most common worries we hear. What is normal, what helps, and when to look closer."),
    ("skin-eczema", "Skin & eczema", "Rashes, dry patches and the gut–skin link", "#f6d2c9",
     "Eczema is about more than skin. Our experts explain barrier care, triggers, and where the gut fits in."),
    ("allergies", "Allergies", "Food allergy, hay fever and early prevention", "#ddd6f5",
     "What research now says about early exposure, and how to tell an allergy from an intolerance."),
    ("immunity", "Immunity & everyday illness", "Colds, fevers, antibiotics and bouncing back", "#cfe6f2",
     "Coughs, colds and the endless nursery bugs — building resilience, and knowing when to call the doctor."),
    ("brain-focus", "Brain, focus & ADHD", "Attention, learning and the gut–brain axis", "#e3dcf7",
     "Why attention differences are being diagnosed more often, and the daily habits that support a developing brain."),
    ("autism-development", "Autism & development", "Milestones, differences and support", "#d6ecdf",
     "Understanding developmental differences early, and the range of support families are exploring."),
    ("sleep", "Sleep", "Bedtimes, night waking and routines", "#d9dff3",
     "Sleep drives mood, growth and immunity. Gentle, realistic approaches for tired families."),
    ("emotions", "Emotions & behaviour", "Big feelings, tantrums and resilience", "#fde2c8",
     "Meltdowns are normal — here is what is happening in the brain, and how to help a child find calm."),
    ("pregnancy", "Pregnancy & preconception", "Setting up the first seven years before day one", "#f7d9e3",
     "A child’s health story starts before birth. What matters in preconception and pregnancy — without the guilt."),
    ("supplements", "Supplements", "What kids actually need, and what they don’t", "#f3ecdf",
     "Food first — then an honest look at where vitamin D, omega-3s, probiotics and others may fit."),
    ("emerging-therapies", "New & emerging therapies", "Light therapy, brain mapping and the research", "#e6ecd0",
     "Clear-eyed conversations about newer approaches families are asking about — what the evidence says, and what it doesn’t yet."),
]
TOPIC = {t[0]: t for t in TOPICS}

EXPERTS = {
    "dr-murray-clarke": dict(
        name="Dr. Murray Clarke", role="Host · The First Seven Years", img="/assets/img/dr-murray-clarke.jpg", c="#a6d6b0",
        short="Host of The First Seven Years and the doctor who answers your questions.",
        bio=["Dr. Murray Clarke has spent decades focused on one question: what gives a child the strongest possible start? His work sits where nutrition, the gut and a child’s developing brain meet — and he has a knack for explaining it in the language parents actually use.",
             "On The First Seven Years he hosts long-form conversations with pediatricians, researchers and practitioners, then distils them into short, practical answers. Through Ask the Doctor, he answers parents’ questions directly — the most common become new answers in this library."],
        creds=["Host of The First Seven Years podcast and video series", "Answers parent questions through Ask the Doctor", "Focus: children’s nutrition, gut health and integrative care"],
        same=[YT]),
    "bryce-wylde": dict(
        name="Bryce Wylde", role="Co-host · Functional medicine", img=None, c="#fbe7ac",
        short="Co-host, and a functional medicine expert with a researcher’s eye.",
        bio=["Bryce Wylde co-hosts The First Seven Years, bringing a functional medicine lens to each conversation — asking the follow-up questions a curious parent would, and pressing guests on the evidence."],
        creds=["Co-host of The First Seven Years", "Functional medicine expert"], same=[]),
    "dr-dan-sullivan": dict(
        name="Dr. Dan Sullivan", role="Guest · Episode 27", img=None, c="#ddd6f5",
        short="Guest on Episode 27 — ADHD, stress and the gut.",
        bio=["Dr. Dan Sullivan joined the show to talk about why ADHD diagnoses are rising, how stress in pregnancy may shape a baby’s brain, and what he does to manage his own ADHD."],
        creds=["Guest, Episode 27"], same=[]),
    "dr-elisa-song": dict(
        name="Dr. Elisa Song", role="Guest · Episode 26 · Integrative pediatrician", img=None, c="#bfe4c6",
        short="Integrative pediatrician; guest on Episode 26 — the gut behind allergies, anxiety and ADHD.",
        bio=["Dr. Elisa Song is an integrative pediatrician. On Episode 26 she explains the microbiome in terms any parent can use — from prebiotics versus probiotics to restoring the gut after antibiotics."],
        creds=["Integrative pediatrician", "Guest, Episode 26"], same=[]),
    "erinn-askin": dict(
        name="Erinn Askin", role="Guest · Episode 25", img=None, c="#e6ecd0",
        short="Guest on Episode 25 — brain mapping and light therapy for autism and ADHD.",
        bio=["Erinn Askin joined the show to talk about brain mapping, light-based therapies and the routines families use alongside them."],
        creds=["Guest, Episode 25"], same=[]),
    "joy-mccarthy": dict(
        name="Joy McCarthy", role="Guest · Holistic nutritionist", img=None, c="#fad7c4",
        short="Holistic nutritionist; guest on eczema and the gut–skin connection.",
        bio=["Joy McCarthy is a holistic nutritionist. Her conversation with the show focuses on children’s eczema — why it is so often a gut story, and gentle ways to care for skin."],
        creds=["Holistic nutritionist", "Guest on eczema and skin health"], same=[]),
}

# Real videos from the channel (most recent 30). kind: ep|clip
_V = [
 ("sJsNza0_zRQ","7 Things One Doctor Does to Manage His Own ADHD","dr-dan-sullivan","clip",["brain-focus"],27),
 ("eeuP3KRgQg4","What Actually Starts Leaky Gut?","dr-dan-sullivan","clip",["gut-health"],27),
 ("jrIRvStKeqk","Can Stress in Pregnancy Affect Baby’s Brain?","dr-dan-sullivan","clip",["pregnancy","brain-focus"],27),
 ("W1VViQ8goFk","ADHD Hit 11% of Kids. What Changed?","dr-dan-sullivan","clip",["brain-focus"],27),
 ("NiYwg17ahYo","The One Probiotic Strain Backed by Decades of Research","dr-elisa-song","clip",["gut-health","supplements"],26),
 ("wHrPcQPYiaE","Could Your Child’s ADHD Start in the Gut?","dr-dan-sullivan","ep",["brain-focus","gut-health","pregnancy"],27),
 ("g4ejtsJj9y8","What Is Leaky Gut, Really? A Pediatrician Explains","dr-elisa-song","clip",["gut-health"],26),
 ("4ddstm2d_Y4","Should You Still Be Kissing Your Kids? A Pediatrician Weighs In","dr-elisa-song","clip",["immunity"],26),
 ("Yr5B77Yp9HE","Prebiotics vs. Probiotics vs. Postbiotics, Finally Explained Simply","dr-elisa-song","clip",["gut-health","supplements","first-foods"],26),
 ("s5lyhtu2aXc","Why Pets and Dirt Actually Build Your Child’s Immune System","dr-elisa-song","clip",["immunity","allergies"],26),
 ("VBfOpGRcS2M","This Study Cut Eczema Risk by 83% in C-Section Babies","dr-elisa-song","clip",["skin-eczema","pregnancy","gut-health"],26),
 ("hqC4jyz4ZvQ","How to Restore Your Child’s Gut Microbiome After Antibiotics","dr-elisa-song","clip",["gut-health","immunity"],26),
 ("bmkNG6J4YT0","The Microbiome Before Conception Is Shaping Your Child’s Health","dr-elisa-song","clip",["pregnancy","gut-health"],26),
 ("maCarlEllC4","Why Nearly 1 in 2 Kids Now Have a Chronic Illness","dr-elisa-song","clip",["immunity"],26),
 ("p6zHpTHi1bY","Is Brain Laser Therapy Safe for a 3-Year-Old With Autism?","erinn-askin","clip",["emerging-therapies","autism-development"],25),
 ("w_HZCxmnNi4","Why Your Child’s Allergies, Anxiety and ADHD Might Start in the Gut","dr-elisa-song","ep",["gut-health","allergies","emotions","brain-focus"],26),
 ("_V-l7iVzZII","How Laser Therapy Helped Him Become a Student for the First Time","erinn-askin","clip",["emerging-therapies","brain-focus"],25),
 ("2GnkeYKhoH0","This Laser Therapy Compresses 6 Months of Progress Into 2 Weeks","erinn-askin","clip",["emerging-therapies"],25),
 ("vfC7sUx5d6M","What’s the Youngest Age for Laser Brain Therapy?","erinn-askin","clip",["emerging-therapies","autism-development"],25),
 ("GHztowhZtAw","This 6-Minute Brain Scan Found What No One Else Could","erinn-askin","clip",["emerging-therapies","autism-development"],25),
 ("K6fQ5S67huk","The Study That Turned Lasers Into Brain Therapy","erinn-askin","clip",["emerging-therapies"],25),
 ("ICUVBCs9ejk","The Science of How Light Therapy Rewires a Child’s Brain","erinn-askin","clip",["emerging-therapies","brain-focus"],25),
 ("HvaWCG7fPzk","The 12-Minute Nightly Routine That Changed Her Daughter’s Severe ADHD","erinn-askin","clip",["brain-focus","sleep"],25),
 ("esmbFJNha9c","Why 1 in 31 Kids Now Have Autism","erinn-askin","clip",["autism-development"],25),
 ("WtRxQB2KYNk","Why Traditional Therapy Isn’t Reaching the Root Cause of Autism and ADHD","erinn-askin","ep",["autism-development","brain-focus","emerging-therapies"],25),
 ("E1clSMEAwNk","The Real Reason Your Child’s Eczema Gets Worse After Every Antibiotic","joy-mccarthy","clip",["skin-eczema","immunity"],None),
 ("HHG5bOnx6IU","The Supplements & Foods That Can Help Clear Eczema in Children","joy-mccarthy","clip",["skin-eczema","supplements"],None),
 ("7HRqTlUyXdI","The Tests Your Doctor Isn’t Running for Eczema","joy-mccarthy","clip",["skin-eczema"],None),
 ("wP5-4Pu094s","Why Cortisone Cream Backfires & What to Use on Your Baby’s Skin","joy-mccarthy","clip",["skin-eczema"],None),
 ("I90rSaFzuak","Why Your Child’s Eczema Is a Gut Problem, Not a Skin Problem","joy-mccarthy","clip",["skin-eczema","gut-health"],None),
]

def slugify(s):
    s = s.lower().replace("’", "").replace("'", "").replace("&", "and").replace("%", "-percent")
    return re.sub(r"[^a-z0-9]+", "-", s).strip("-")[:70].rstrip("-")

EPISODES = []
# Upload dates: indicative, one clip every two days back from the latest.
# TODO: replace with the dates from the client's YouTube export at draft load.
for i, (vid, title, guest, kind, tags, epno) in enumerate(_V):
    EPISODES.append(dict(id=vid, title=title, guest=guest, kind=kind, tags=tags, ep=epno,
                         slug=slugify(title), date=TODAY - datetime.timedelta(days=4 + i * 2)))
EP_FULL = {e["ep"]: e for e in EPISODES if e["kind"] == "ep"}

# Parent answers. Each answer = a real question + the expert clip that answers it.
# Copy is written conservatively and flagged as awaiting clinical review.
ANSWERS = [
 dict(slug="is-my-childs-eczema-a-gut-problem", q="Is my child’s eczema really a gut problem?", topic="skin-eczema", also=["gut-health"],
      video="I90rSaFzuak", expert="joy-mccarthy", ages=[0,1,2,3],
      quick="Partly — and it is worth knowing why. Eczema happens when the skin barrier is leaky and the immune system over-reacts. Research increasingly links both to the gut microbiome, especially in the first years of life. Good skin care still comes first; supporting the gut can sit alongside it.",
      body="""
<h2>What eczema actually is</h2>
<p>Eczema (atopic dermatitis) is a combination of two things: skin that does not hold moisture well, and an immune system that reacts strongly to everyday triggers. The result is the dry, itchy, inflamed patches most parents recognise — often in the creases of elbows and knees, or on the cheeks in babies.</p>
<h2>Where the gut comes in</h2>
<p>Most of the immune system is trained in the gut during the first years of life. Studies have found differences in the gut bacteria of babies who go on to develop eczema, and early-life factors that shape the microbiome — such as birth by C-section or early antibiotics — are associated with a higher chance of eczema. This is what people mean by the <em>gut–skin axis</em>.</p>
<p>That does not mean eczema is <em>only</em> a gut problem, or that changing diet alone will clear it. It means the gut is one lever among several.</p>
<h2>What parents can reasonably do</h2>
<ul>
  <li><strong>Protect the skin barrier every day.</strong> Short lukewarm baths, then a thick fragrance-free moisturiser within a few minutes.</li>
  <li><strong>Notice triggers.</strong> Heat, sweat, scratchy fabrics, soaps and sometimes specific foods can all flare skin.</li>
  <li><strong>Feed the microbiome.</strong> A varied diet with fibre from fruit, vegetables, oats and beans, plus fermented foods such as plain yogurt if your child tolerates them.</li>
  <li><strong>Ask before you add.</strong> Probiotics have mixed evidence for eczema — talk to your pediatrician about whether a specific product makes sense for your child.</li>
</ul>
<h2>When to see your doctor</h2>
<p>Book an appointment if the skin is weeping, crusting or very red (it may be infected), if your child has a fever alongside a flare, if eczema is disturbing sleep, or if it is not improving with good daily care. Never stop a prescribed treatment without speaking to your doctor first.</p>"""),
 dict(slug="what-is-leaky-gut", q="What is “leaky gut”, really?", topic="gut-health", also=["allergies"],
      video="g4ejtsJj9y8", expert="dr-elisa-song", ages=[2,3,4,5],
      quick="“Leaky gut” describes a gut lining that lets more through than it should — researchers call it increased intestinal permeability. It is measurable in studies, but it is not a diagnosis on its own. Think of it as one way gut health may connect to allergies, skin and mood."),
 dict(slug="prebiotics-vs-probiotics-vs-postbiotics", q="Prebiotics, probiotics, postbiotics — what’s the difference?", topic="gut-health", also=["supplements","first-foods"],
      video="Yr5B77Yp9HE", expert="dr-elisa-song", ages=[1,2,3,4,5,6,7],
      quick="Probiotics are live, helpful microbes. Prebiotics are the fibres that feed them. Postbiotics are the useful compounds those microbes make. For most children, foods are the easiest place to start: yogurt or kefir, oats, bananas, beans and a wide variety of plants."),
 dict(slug="restoring-the-gut-after-antibiotics", q="How do I help my child’s gut recover after antibiotics?", topic="gut-health", also=["immunity"],
      video="hqC4jyz4ZvQ", expert="dr-elisa-song", ages=[1,2,3,4,5,6,7],
      quick="First, antibiotics are sometimes essential — always finish the course you were prescribed. Afterwards, a varied, fibre-rich diet, fermented foods if tolerated, plenty of water and time all help the microbiome rebuild. Ask your pediatrician whether a probiotic is worth adding for your child."),
 dict(slug="are-pets-and-dirt-good-for-immunity", q="Are pets and a bit of dirt actually good for my child?", topic="immunity", also=["allergies"],
      video="s5lyhtu2aXc", expert="dr-elisa-song", ages=[0,1,2,3,4],
      quick="Often, yes. Many studies link early, everyday exposure — pets, outdoor play, older siblings — to lower rates of allergy and asthma. It is sometimes called the “old friends” idea. It does not replace handwashing before meals and after the toilet."),
 dict(slug="is-it-okay-to-kiss-my-baby", q="Is it okay to kiss my baby on the face?", topic="immunity", also=[],
      video="4ddstm2d_Y4", expert="dr-elisa-song", ages=[0,1],
      quick="For healthy parents, affectionate contact is part of normal bonding and shares friendly microbes. The exceptions: if you have a cold sore, a cold or flu, or your newborn is very young or unwell, keep kisses away from the face and hands until you are better."),
 dict(slug="can-stress-in-pregnancy-affect-my-baby", q="Can stress in pregnancy affect my baby?", topic="pregnancy", also=["brain-focus"],
      video="jrIRvStKeqk", expert="dr-dan-sullivan", ages=[0],
      quick="Research links ongoing, severe stress in pregnancy with differences in a baby’s development — but everyday worry is normal and nothing to feel guilty about. Sleep, support, gentle movement and asking for help are protective for both of you."),
 dict(slug="does-my-gut-health-before-pregnancy-matter", q="Does my own gut health before pregnancy matter?", topic="pregnancy", also=["gut-health"],
      video="bmkNG6J4YT0", expert="dr-elisa-song", ages=[0],
      quick="It is part of the story. Babies pick up their first microbes from their mother — through birth, feeding and close contact. Eating a varied, fibre-rich diet and looking after your own health before and during pregnancy all count."),
 dict(slug="why-are-adhd-diagnoses-rising", q="Why are ADHD diagnoses rising?", topic="brain-focus", also=[],
      video="W1VViQ8goFk", expert="dr-dan-sullivan", ages=[4,5,6,7],
      quick="Partly because awareness and screening have improved. Researchers are also looking at sleep, screens, diet and the gut–brain axis. In this clip, Dr. Dan Sullivan shares his view on what has changed — and what parents can do day to day."),
 dict(slug="is-cortisone-cream-safe-for-babies", q="Is cortisone cream okay for my baby’s eczema?", topic="skin-eczema", also=[],
      video="wP5-4Pu094s", expert="joy-mccarthy", ages=[0,1,2],
      quick="Low-strength steroid creams are widely prescribed and can be appropriate for short flares. In this clip, Joy McCarthy explains why she also looks at gentle skin care and gut support. Talk to your pediatrician before stopping or changing anything prescribed."),
]
for i, a in enumerate(ANSWERS):
    a["published"] = TODAY - datetime.timedelta(days=12 + i * 3)
    a["reviewed"] = TODAY - datetime.timedelta(days=5 + i)

DATA_FILE = Path(__file__).parent / "data" / "content.json"
BRAND_COLORS = {}
FAQS = []
TOPIC_META = {}
CUSTOM_NAV = []
NAV_BADGES = {}
CUSTOM_FOOTER_MENUS = []
SETTINGS_CFG = {}
ORG_SETTINGS = {}
CUSTOM_PAGES = []
DEFAULT_YT_DISCLAIMER = "The information provided in The First Seven Years is for educational and informational purposes only and is not intended as a substitute for advice from your pediatrician or other healthcare professional. Always consult with your doctor regarding any medical concerns or health conditions. The views expressed by our guests are their own and do not necessarily reflect the official policy or position of The First Seven Years."

if DATA_FILE.exists():
    try:
        raw_data = json.loads(DATA_FILE.read_text(encoding="utf-8"))
        settings_cfg = raw_data.get("settings", {})
        if "canonical_domain" in settings_cfg:
            SITE = settings_cfg["canonical_domain"]
        if "youtube_channel" in settings_cfg:
            YT = settings_cfg["youtube_channel"]
        BRAND_COLORS = settings_cfg.get("brand_colors", {})

        loaded_topics = [t for t in raw_data.get("topics", []) if t.get("published", True)]
        if loaded_topics:
            TOPICS = [(t["slug"], t["name"], t["short"], t["swatch"], t["intro"]) for t in sorted(loaded_topics, key=lambda x: x.get("order", 0))]
            TOPIC = {t[0]: t for t in TOPICS}
            TOPIC_META = {t["slug"]: t for t in loaded_topics}

        loaded_experts = {}
        for k, v in raw_data.get("experts", {}).items():
            if v.get("published", True):
                item = dict(v)
                item["c"] = v.get("c") or v.get("swatch", "#a6d6b0")
                loaded_experts[k] = item
        if loaded_experts:
            EXPERTS = loaded_experts

        loaded_eps = [e for e in raw_data.get("episodes", []) if e.get("published", True)]
        if loaded_eps:
            EPISODES = []
            for e in loaded_eps:
                d_val = TODAY
                if isinstance(e.get("date"), str) and len(e["date"]) >= 10:
                    try: d_val = datetime.date.fromisoformat(e["date"][:10])
                    except Exception: pass
                EPISODES.append(dict(
                    id=e["id"], title=e["title"], guest=e.get("guest", "dr-murray-clarke"), kind=e.get("kind", "clip"),
                    tags=e.get("tags", []), ep=e.get("ep"), slug=e.get("slug", slugify(e["title"])),
                    date=d_val, caption=e.get("caption", ""),
                    youtube_full_url=e.get("youtube_full_url", ""), youtube_short_url=e.get("youtube_short_url", ""),
                    seo_title=e.get("seo_title", ""), meta_desc=e.get("meta_desc", ""),
                    focus_keyword=e.get("focus_keyword", ""), canonical_url=e.get("canonical_url", ""),
                    robots_index=e.get("robots_index", "index"), robots_follow=e.get("robots_follow", "follow"),
                    og_title=e.get("og_title", ""), og_type=e.get("og_type", "video.episode"),
                    og_desc=e.get("og_desc", ""), og_image=e.get("og_image", ""),
                    schema_type=e.get("schema_type", "VideoObject"), twitter_card=e.get("twitter_card", "player"),
                    youtube_disclaimer=e.get("youtube_disclaimer", "") or e.get("disclaimer", "")
                ))
            EP_FULL = {e["ep"]: e for e in EPISODES if e.get("kind") == "ep" and e.get("ep")}

        loaded_ans = [a for a in raw_data.get("answers", []) if a.get("published", True)]
        if loaded_ans:
            ANSWERS = []
            for a in loaded_ans:
                p_val = TODAY
                if isinstance(a.get("published"), str) and len(a["published"]) >= 10:
                    try: p_val = datetime.date.fromisoformat(a["published"][:10])
                    except Exception: pass
                r_val = TODAY
                if isinstance(a.get("reviewed"), str) and len(a["reviewed"]) >= 10:
                    try: r_val = datetime.date.fromisoformat(a["reviewed"][:10])
                    except Exception: pass
                ANSWERS.append(dict(
                    slug=a["slug"], q=a["q"], topic=a["topic"], also=a.get("also", []),
                    video=a.get("video"), expert=a.get("expert", "dr-murray-clarke"),
                    ages=a.get("ages", [0, 1, 2, 3]), quick=a.get("quick", ""),
                    body=a.get("body", ""), published=p_val, reviewed=r_val
                ))

        FAQS = [f for f in raw_data.get("faqs", []) if f.get("published", True)]
        
        SETTINGS_CFG = settings_cfg
        ORG_SETTINGS = settings_cfg.get("organization", {})
        
        loaded_menus = raw_data.get("menus", {})
        if loaded_menus:
            h_items = [m for m in loaded_menus.get("header", []) if m.get("published", True)]
            if h_items:
                CUSTOM_NAV = [(m["label"], m["url"]) for m in sorted(h_items, key=lambda x: x.get("order", 0))]
                NAV_BADGES = {m["url"]: m.get("badge", "") for m in h_items}
            f_items = [m for m in loaded_menus.get("footer", []) if m.get("published", True)]
            if f_items:
                CUSTOM_FOOTER_MENUS = sorted(f_items, key=lambda x: x.get("order", 0))

        CUSTOM_PAGES = [p for p in raw_data.get("pages", []) if p.get("published", True)]
    except Exception as err:
        print(f"Notice: Failed to load data/content.json: {err}")

ANS = {a["slug"]: a for a in ANSWERS}
EPV = {e["id"]: e for e in EPISODES}

AGES = [
    ("0", "Newborn", "The first year", "Feeding, skin, sleep and settling in — and looking after yourself too.",
     ["is-it-okay-to-kiss-my-baby", "is-cortisone-cream-safe-for-babies", "can-stress-in-pregnancy-affect-my-baby"]),
    ("1", "One", "First foods, first steps", "Starting solids, the first colds from nursery, and a microbiome that is taking shape.",
     ["prebiotics-vs-probiotics-vs-postbiotics", "are-pets-and-dirt-good-for-immunity", "is-my-childs-eczema-a-gut-problem"]),
    ("2", "Two", "Big feelings, small appetites", "The age of “no” — at the table and everywhere else.",
     ["topic:picky-eating", "restoring-the-gut-after-antibiotics", "topic:emotions"]),
    ("3", "Three", "Playground years", "More friends, more germs, more questions than ever.",
     ["are-pets-and-dirt-good-for-immunity", "what-is-leaky-gut", "topic:sleep"]),
    ("4", "Four", "Getting ready to learn", "Attention, language and the habits that support a growing brain.",
     ["why-are-adhd-diagnoses-rising", "what-is-leaky-gut", "topic:autism-development"]),
    ("5", "Five", "Starting school", "New routines, lunchboxes and a whole new set of bugs.",
     ["restoring-the-gut-after-antibiotics", "why-are-adhd-diagnoses-rising", "topic:first-foods"]),
    ("6", "Six", "Growing independence", "Friendships, focus and food choices they make themselves.",
     ["topic:brain-focus", "prebiotics-vs-probiotics-vs-postbiotics", "topic:supplements"]),
    ("7", "Seven", "Foundations set", "What the first seven years have built, and how to keep it going.",
     ["topic:brain-focus", "topic:emotions", "restoring-the-gut-after-antibiotics"]),
]

# --------------------------------------------------------------------------
# HELPERS
# --------------------------------------------------------------------------
def thumb(vid, q="hqdefault"): return f"https://i.ytimg.com/vi/{vid}/{q}.jpg"
def ep_url(e): return f"/episodes/{e['slug']}/"
def ans_url(a): return f"/answers/{a['slug']}/"
def topic_url(s): return f"/topics/{s}/"
def expert_url(s): return f"/experts/{s}/"
def fmt(d): return f"{d.day} {d.strftime('%b %Y')}"

def eps_for(topic): return [e for e in EPISODES if topic in e["tags"]]
def ans_for(topic): return [a for a in ANSWERS if a["topic"] == topic or topic in a["also"]]

def topic_count(s):
    a, v = len(ans_for(s)), len(eps_for(s))
    if not a and not v: return "New answers soon"
    return " · ".join(x for x in [f"{a} answer{'s' * (a != 1)}" if a else "", f"{v} video{'s' * (v != 1)}" if v else ""] if x)

def ep_label(e):
    return f"EP {e['ep']}" if e["kind"] == "ep" else "Clip"

def ep_card(e, lazy=True):
    g = EXPERTS[e["guest"]]["name"]
    badge_cls = "ep-card__badge" + ("" if e["kind"] == "ep" else " ep-card__badge--clip")
    return f"""<a class="ep-card" href="{ep_url(e)}">
  <div class="ep-card__thumb"><img src="{thumb(e['id'])}" alt="" width="480" height="270" {'loading="lazy"' if lazy else ''} decoding="async">
    <span class="{badge_cls}">{ep_label(e)}</span><span class="ep-card__play">{icon('play')}</span></div>
  <h3>{esc(e['title'])}</h3>
  <div class="ep-card__meta"><span>{esc(g)}</span><span>{TOPIC[e['tags'][0]][1]}</span></div>
</a>"""

def answer_card(a):
    return f"""<a class="answer-card" href="{ans_url(a)}"><span class="q">{esc(a['q'])}</span>
  <span class="who"><i style="background:{TOPIC[a['topic']][3]}"></i>{EXPERTS[a['expert']]['name']} · {TOPIC[a['topic']][1]}</span></a>"""

def yt_facade(vid, title, label="Watch"):
    return f"""<button class="yt" type="button" data-id="{vid}" aria-label="Play video: {esc(title)}">
  <img src="{thumb(vid, 'maxresdefault')}" onerror="this.onerror=null;this.src='{thumb(vid)}'" alt="" width="1280" height="720" loading="lazy" decoding="async">
  <span class="yt__btn">{icon('play')}</span><span class="yt__label">{label}</span></button>"""

def crumbs(items):
    lis = "".join(f'<li><a href="{u}">{esc(n)}</a></li>' if u else f'<li aria-current="page">{esc(n)}</li>' for n, u in items)
    return f'<nav aria-label="Breadcrumb"><ol class="crumbs">{lis}</ol></nav>'

def ld_crumbs(items):
    return {"@type": "BreadcrumbList", "itemListElement": [
        {"@type": "ListItem", "position": i + 1, "name": n, **({"item": SITE + u} if u else {})} for i, (n, u) in enumerate(items)]}

ORG = {"@type": "Organization", "@id": SITE + "/#org", "name": "The First Seven Years", "url": SITE + "/",
       "logo": {"@type": "ImageObject", "url": SITE + "/assets/img/logo.jpg", "width": 160, "height": 160},
       "sameAs": [YT], "founder": {"@id": SITE + "/experts/dr-murray-clarke/#person"}}
WEBSITE = {"@type": "WebSite", "@id": SITE + "/#website", "name": "The First Seven Years", "url": SITE + "/",
           "publisher": {"@id": SITE + "/#org"}, "inLanguage": "en",
           "potentialAction": {"@type": "SearchAction", "target": SITE + "/search/?q={search_term_string}",
                               "query-input": "required name=search_term_string"}}

def person_ld(slug):
    x = EXPERTS[slug]
    schema_type = x.get("schema_type") or ("Physician" if "dr-" in slug else "Person")
    d = {"@type": schema_type, "@id": f"{SITE}/experts/{slug}/#person", "name": x["name"], "url": f"{SITE}/experts/{slug}/",
         "description": x.get("meta_desc") or x["short"], "jobTitle": x["role"].split("·")[-1].strip()}
    if x["img"]: d["image"] = SITE + x["img"]
    if x["same"]: d["sameAs"] = x["same"]
    return d

def video_ld(e):
    return {"@type": "VideoObject", "name": e["title"], "description": ep_desc(e),
            "thumbnailUrl": [thumb(e["id"], "maxresdefault"), thumb(e["id"])],
            "uploadDate": e["date"].isoformat(), "embedUrl": f"https://www.youtube-nocookie.com/embed/{e['id']}",
            "contentUrl": f"https://www.youtube.com/watch?v={e['id']}"}

def ep_desc(e):
    g = EXPERTS[e["guest"]]["name"]
    if e["kind"] == "ep":
        return f"Episode {e['ep']} of The First Seven Years: Dr. Murray Clarke and Bryce Wylde talk with {g} — {e['title'].rstrip('?')}."
    src = f" from Episode {e['ep']}" if e["ep"] else ""
    return f"A short clip{src} of The First Seven Years with {g}: {e['title']}"

# --------------------------------------------------------------------------
# PAGE SHELL
# --------------------------------------------------------------------------
DEFAULT_NAV = [("Topics", "/topics/"), ("Episodes", "/episodes/"), ("Experts", "/experts/"), ("The book", "/book/"), ("FAQ", "/faq/"), ("About", "/about/")]
NAV = CUSTOM_NAV if CUSTOM_NAV else DEFAULT_NAV

def header(active, home):
    links = "".join(f'<li><a href="{u}"{" aria-current=page" if active == u else ""}>{n}</a></li>' for n, u in NAV)
    d_list = NAV if any(u == "/ask-the-doctor/" for _, u in NAV) else (NAV + [("Ask the Doctor", "/ask-the-doctor/")])
    dlinks = "".join(f'<li><a href="{u}">{n}<span>{NAV_BADGES.get(u, "")}</span></a></li>' for n, u in d_list)
    return f"""<header class="bar{' bar--home' if home else ''}">
  <div class="wrap bar__in">
    <a class="bar__brand" href="/" aria-label="The First Seven Years — home">{logo()}<span class="bar__name">The First Seven Years<small>with Dr. Murray Clarke</small></span></a>
    <nav class="nav" aria-label="Main"><ul>{links}</ul></nav>
    <button class="bar__search" type="button" data-focus-search aria-label="Search questions">{icon('search')}</button>
    <a class="btn btn--mint bar__cta" href="/ask-the-doctor/">{icon('chat')}Ask the Doctor</a>
    <button class="menu-btn" type="button" data-open-menu aria-controls="drawer" aria-expanded="false" aria-label="Open menu">{icon('menu')}</button>
  </div>
</header>
<div class="drawer" id="drawer" aria-hidden="true" role="dialog" aria-label="Menu">
  <div class="drawer__top">{logo(size=52)}<button class="drawer__close" type="button" data-close-menu aria-label="Close menu">{icon('close')}</button></div>
  <nav aria-label="Mobile"><ul>{dlinks}</ul></nav>
  <a class="btn btn--mint" href="/ask-the-doctor/">Ask Dr. Murray a question</a>
</div>"""

def footer():
    tl = "".join(f'<li><a href="{topic_url(t[0])}">{t[1]}</a></li>' for t in TOPICS[:7])
    
    if CUSTOM_FOOTER_MENUS:
        cols = {}
        for it in CUSTOM_FOOTER_MENUS:
            c = it.get("col", "Topics")
            cols.setdefault(c, []).append(it)
        col_htmls = []
        for cname, citems in cols.items():
<<<<<<< HEAD
            links = "".join(f'<li><a href="{esc(x["url"])}"{' target="_blank" rel="noopener"' if x.get("target") == "_blank" else ""}>{esc(x["label"])}</a></li>' for x in citems)
=======
            links = "".join(f'<li><a href="{esc(x["url"])}"' + (' target="_blank" rel="noopener"' if x.get("target") == "_blank" else '') + f'>{esc(x["label"])}</a></li>' for x in citems)
>>>>>>> fe0bcab547943f6d16a1d6afc96becba158800f2
            col_htmls.append(f'<div><h2>{esc(cname)}</h2><ul>{links}</ul></div>')
        cols_rendered = "".join(col_htmls)
    else:
        cols_rendered = f"""<div><h2>Topics</h2><ul>{tl}<li><a href="/topics/">All 13 topics →</a></li></ul></div>
      <div><h2>Library</h2><ul><li><a href="/episodes/">All episodes</a></li><li><a href="{ep_url(EPISODES[0]) if EPISODES else '/episodes/'}">Latest video</a></li><li><a href="/experts/">Experts</a></li><li><a href="/search/">Search answers</a></li><li><a href="/ask-the-doctor/">Ask the Doctor</a></li></ul></div>
      <div><h2>About &amp; Admin</h2><ul><li><a href="/about/">Our story</a></li><li><a href="/about/#standards">Editorial standards</a></li><li><a href="/faq/">FAQ</a></li><li><a href="/book/">The book</a></li><li><a href="/privacy/">Privacy</a></li><li><a href="/admin/" style="opacity:0.85">Admin CMS ⚙️</a></li></ul></div>"""

    disclaimer = SETTINGS_CFG.get("medical_disclaimer", "Educational content only. Not individual medical advice. Consult your pediatrician.")
    copyright_str = ORG_SETTINGS.get("copyright_notice", f"© {TODAY.year} The First Seven Years. All rights reserved.")

    return f"""<footer class="footer">
  <div class="wrap">
    <div class="footer__grid">
      <div class="footer__brand">{logo()}
        <p>Honest, expert answers for parents of children aged 0 to 7 — from the doctors and researchers on The First Seven Years.</p>
        <ul class="socials" aria-label="Follow">
          <li><a href="{YT}" rel="me noopener" target="_blank" aria-label="YouTube (opens in a new tab)">{icon('youtube')}</a></li>
          <li><a href="/#newsletter" aria-label="Newsletter">{icon('mail')}</a></li>
          <li><a href="/ask-the-doctor/" aria-label="Ask the Doctor">{icon('chat')}</a></li>
        </ul>
      </div>
      {cols_rendered}
    </div>
    <div class="footer__legal">
      <p><strong>Educational content, not medical advice.</strong> {esc(disclaimer)}</p>
      <p>{esc(copyright_str)}</p>
    </div>
    <div class="wordmark" aria-hidden="true">First Seven Years</div>
  </div>
</footer>"""

def page(path, title, desc, body, ld=None, active=None, home=False, og_img=None, noindex=False):
    graph = [ORG, WEBSITE] + (ld or [])
    canonical = SITE + path
    og = og_img or SITE + "/assets/img/logo.jpg"
    
    color_override = ""
    if BRAND_COLORS:
        c_lines = []
        if "navy" in BRAND_COLORS:
            c_lines.append(f"--navy: {BRAND_COLORS['navy']};")
        if "mint" in BRAND_COLORS:
            c_lines.append(f"--mint: {BRAND_COLORS['mint']};")
        if "cream" in BRAND_COLORS:
            c_lines.append(f"--cream: {BRAND_COLORS['cream']}; --bg: {BRAND_COLORS['cream']};")
        if "peach" in BRAND_COLORS:
            c_lines.append(f"--peach: {BRAND_COLORS['peach']};")
        if "butter" in BRAND_COLORS:
            c_lines.append(f"--butter: {BRAND_COLORS['butter']};")
        if "lilac" in BRAND_COLORS:
            c_lines.append(f"--lilac: {BRAND_COLORS['lilac']};")
        if c_lines:
            color_override = f"<style>:root {{ {' '.join(c_lines)} }}</style>"

    doc = f"""<!doctype html>
<html lang="en" class="no-js">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{esc(title)}</title>
<meta name="description" content="{esc(desc)}">
<link rel="canonical" href="{canonical}">
<meta name="robots" content="noindex, nofollow">
<meta name="theme-color" content="{BRAND_COLORS.get('navy', '#2b3c56')}">
<meta property="og:type" content="{'website' if home else 'article'}">
<meta property="og:site_name" content="The First Seven Years">
<meta property="og:title" content="{esc(title)}">
<meta property="og:description" content="{esc(desc)}">
<meta property="og:url" content="{canonical}">
<meta property="og:image" content="{og}">
<meta property="og:locale" content="en_US">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="{esc(title)}">
<meta name="twitter:description" content="{esc(desc)}">
<meta name="twitter:image" content="{og}">
<link rel="icon" href="/assets/img/favicon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="/assets/img/logo.jpg">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="preconnect" href="https://i.ytimg.com">
<link href="https://fonts.googleapis.com/css2?family=Figtree:ital,wght@0,400..800;1,400..600&family=Fraunces:ital,opsz,wght,SOFT,WONK@0,9..144,400..700,0..100,0..1;1,9..144,400..600,0..100,0..1&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/assets/css/main.css">
<<<<<<< HEAD
<script src="https://www.google.com/recaptcha/api.js" async defer></script>
=======
>>>>>>> fe0bcab547943f6d16a1d6afc96becba158800f2
{color_override}
<link rel="alternate" type="text/plain" href="/llms.txt" title="LLM summary">
<script type="application/ld+json">{json.dumps({"@context": "https://schema.org", "@graph": graph}, ensure_ascii=False)}</script>
</head>
<body class="{'home' if home else 'inner'}">
<a class="skip-link" href="#main">Skip to content</a>
{header(active, home)}
<main id="main">
{body}
</main>
{footer()}
<script src="/assets/js/search-index.js" defer></script>
<script src="/assets/js/main.js" defer></script>
</body>
</html>"""
    out = ROOT / path.lstrip("/") / "index.html"
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text(doc, encoding="utf-8")
    SITEMAP.append((path, noindex))

SITEMAP = []

def qsearch(prompts, placeholder=None, scope=None, prefill=False, uid="qs"):
    ph = placeholder or prompts[0]
    return f"""<div class="qsearch" data-prompts="{esc('|'.join(prompts))}"{f' data-scope="{scope}"' if scope else ''}{' data-prefill' if prefill else ''}>
  <form role="search" action="/search/" method="get">
    <div class="qsearch__field">{icon('search')}
      <label class="sr-only" for="{uid}">Ask a question or search</label>
      <input id="{uid}" name="q" type="search" autocomplete="off" placeholder="{esc(ph)}" role="combobox" aria-autocomplete="list" aria-expanded="false" aria-controls="{uid}-list">
      <button class="btn" type="submit">{icon('arrow')}<span>Find answers</span></button>
    </div>
  </form>
  <ul class="qsearch__results" id="{uid}-list" role="listbox" aria-label="Suggestions" hidden></ul>
</div>"""

PROMPTS = ["Why won’t my toddler eat vegetables?", "Is my child’s eczema a gut problem?", "How do I help their gut after antibiotics?",
           "Are pets good for my baby’s immune system?", "Why are ADHD diagnoses rising?", "What’s the difference between probiotics and prebiotics?"]

# --------------------------------------------------------------------------
# HOME
# --------------------------------------------------------------------------
def build_home():
    blocks = [  # (label, color, left in u, bottom in u, tilt)
        ("1", "mint", 0.0, 0, -3), ("2", "peach", 1.1, 0, 2), ("3", "butter", 2.2, 0, -1), ("4", "lilac", 3.3, 0, 3),
        ("5", "oat", 0.62, 1.04, 4), ("6", "navy", 1.72, 1.04, -3), ("7", "", 2.7, 1.04, 2),
    ]
    b_html = ""
    for i, (n, c, x, y, t) in enumerate(blocks):
        if n == "7":
            continue
        b_html += f'<span class="block block--{c}" style="--i:{i};--tilt:{t}deg;left:calc(var(--u)*{x});bottom:calc(var(--u)*{y})">{n}</span>'
    buddy = f"""<span class="block block--mint buddy" style="--i:7;--tilt:-2deg;left:calc(var(--u)*1.52);bottom:calc(var(--u)*2.04)">
      <span class="buddy__face"><i class="brow brow--l"></i><i class="brow brow--r"></i>
        <span class="eye eye--l"><span class="pupil"></span></span><span class="eye eye--r"><span class="pupil"></span></span>
        <i class="cheek cheek--l"></i><i class="cheek cheek--r"></i><i class="smile"></i></span></span>
    <span class="block block--butter" style="--i:6;--tilt:5deg;left:calc(var(--u)*2.95);bottom:calc(var(--u)*1.04);width:calc(var(--u)*.8);height:calc(var(--u)*.8)">7</span>"""

    tabs = "".join(f'<button class="age-tab" role="tab" id="age-t{a[0]}" aria-controls="age-p{a[0]}" aria-selected="{"true" if a[0]=="2" else "false"}" tabindex="{0 if a[0]=="2" else -1}"><b>{a[0]}</b><span>{a[1]}</span></button>' for a in AGES)
    panels = ""
    for a in AGES:
        items = ""
        for ref in a[4]:
            if ref.startswith("topic:"):
                t = TOPIC[ref[6:]]; items += f'<li><a href="{topic_url(t[0])}"><span>{t[1]} — the essentials</span>{icon("arrow")}</a></li>'
            else:
                x = ANS[ref]; items += f'<li><a href="{ans_url(x)}"><span>{esc(x["q"])}</span>{icon("arrow")}</a></li>'
        panels += f"""<div class="ages__panel" role="tabpanel" id="age-p{a[0]}" aria-labelledby="age-t{a[0]}" tabindex="0"{'' if a[0]=="2" else ' hidden'}>
  <div><h3>{a[2]}</h3><p>{a[3]}</p></div><ul class="ages__qs">{items}</ul></div>"""

    rows = "".join(f"""<li><a class="topic-row" href="{topic_url(t[0])}" style="--sw:{t[3]}">
  <span class="n">{i+1:02d}</span><span class="name">{t[1]}</span><span class="desc">{t[2]}</span>
  <span class="count">{topic_count(t[0])}</span><span class="go">{icon('arrow')}</span></a></li>""" for i, t in enumerate(TOPICS))

    latest = "".join(ep_card(e) for e in EPISODES[:8])
    recent = "".join(f"<li>{answer_card(a)}</li>" for a in ANSWERS[:6])

    body = f"""
<section class="hero" aria-labelledby="hero-title">
  <div class="wrap masthead">
    <div class="masthead__left">
      <span class="pill">for parents of little ones</span>
      <h2>calm answers<br>for curious parents</h2>
      <ul class="masthead__nav">
        <li><a href="/topics/">Topics</a></li><li><a href="/episodes/">Episodes</a></li>
        <li><a href="/experts/">Our experts</a></li><li><a href="/book/">The book</a></li>
      </ul>
    </div>
    <a href="/" class="masthead__brand" aria-label="The First Seven Years — home">{logo('masthead__logo')}</a>
    <div class="masthead__right">
      <span class="pill">ask the doctor</span>
      <h2>got a question?<br>Dr. Murray reads them all*</h2>
      <p class="masthead__note">*the most-asked become new answers in the library. <a href="/ask-the-doctor/">Send yours</a>.</p>
      <ul class="socials" aria-label="Follow">
        <li><a href="{YT}" target="_blank" rel="me noopener" aria-label="YouTube (opens in a new tab)">{icon('youtube')}</a></li>
        <li><a href="#newsletter" aria-label="Newsletter">{icon('mail')}</a></li>
        <li><a href="/ask-the-doctor/" aria-label="Ask the Doctor">{icon('chat')}</a></li>
      </ul>
    </div>
  </div>
  <div class="stage" aria-hidden="true">
    <div class="stack"><span class="shadow-floor"></span>{b_html}{buddy}</div>
  </div>
  <div class="wrap hero-ask">
    <h1 id="hero-title">Every question about the <em class="accent">first seven years</em>, answered by people who know.</h1>
    {qsearch(PROMPTS, uid="hero-q")}
    <div class="qsearch__chips" aria-label="Popular questions">
      <a class="chip" href="{ans_url(ANS['is-my-childs-eczema-a-gut-problem'])}">Eczema &amp; the gut</a>
      <a class="chip" href="/topics/picky-eating/">Picky eating</a>
      <a class="chip" href="{ans_url(ANS['restoring-the-gut-after-antibiotics'])}">After antibiotics</a>
      <a class="chip" href="/topics/brain-focus/">Focus &amp; ADHD</a>
      <a class="chip" href="/topics/sleep/">Sleep</a>
    </div>
  </div>
</section>

<section class="section--tight" aria-labelledby="ages-title">
  <div class="wrap">
    <div class="ages reveal">
      <div class="ages__head">
        <div><span class="eyebrow" style="color:var(--mint)">Start with their age</span><h2 id="ages-title" style="margin-top:.6rem">How old is your little one?</h2></div>
        <p class="lede">Seven years, seven squares. Pick an age for the questions parents ask most at that stage.</p>
      </div>
      <div class="ages__tabs" role="tablist" aria-label="Child’s age in years">{tabs}</div>
      {panels}
    </div>
  </div>
</section>

<section class="section" aria-labelledby="topics-title">
  <div class="wrap">
    <div class="section-head reveal">
      <h2 id="topics-title">Thirteen topics. <em class="accent">Zero</em> judgement.</h2>
      <p class="lede">Each topic brings together short answers, full episodes and the experts behind them — so you can go as deep as you have time for tonight.</p>
    </div>
    <ul class="topic-index reveal">{rows}</ul>
  </div>
</section>

<section class="section--tight" aria-labelledby="doc-title">
  <div class="wrap doctor">
    <div class="doctor__photo reveal">
      <span class="blob"></span>
      <img src="/assets/img/dr-murray-clarke.jpg" alt="Dr. Murray Clarke, smiling, in a navy blazer" width="800" height="875" loading="lazy">
      <div class="doctor__tag"><b>Dr. Murray Clarke</b><span>Host · answers Ask the Doctor</span></div>
    </div>
    <div class="reveal" style="--d:120ms">
      <span class="eyebrow">Meet your doctor</span>
      <h2 id="doc-title" class="h1" style="margin-top:.8rem">The doctor in your corner.</h2>
      <blockquote>Parents don’t need more rules. They need to understand <em>why</em> — then they make brilliant decisions on their own.</blockquote>
      <div class="doctor__facts">
        <div><b>116+</b><span>episodes &amp; clips</span></div>
        <div><b>13</b><span>topic hubs</span></div>
        <div><b>0–7</b><span>every age covered</span></div>
      </div>
      <a class="btn" href="/experts/dr-murray-clarke/">About Dr. Murray {icon('arrow')}</a>
      <a class="link-arrow" style="margin-left:1rem" href="/about/#standards">How answers are reviewed {icon('arrow')}</a>
    </div>
  </div>
</section>

<section class="section" aria-labelledby="eps-title">
  <div class="wrap">
    <div class="section-head reveal">
      <h2 id="eps-title">New on the show</h2>
      <a class="link-arrow" href="/episodes/">Browse all episodes {icon('arrow')}</a>
    </div>
    <div class="ep-row reveal" tabindex="0" aria-label="Latest episodes, scrollable">{latest}</div>
  </div>
</section>

<section class="section--tight" aria-labelledby="ask-title">
  <div class="wrap">
    <div class="ask-band reveal">
      <div>
        <span class="eyebrow">Ask the Doctor</span>
        <h2 id="ask-title" style="margin-top:.8rem">Can’t find it? <em class="accent">Ask Dr. Murray.</em></h2>
        <p class="lede">Send your question — no account, no fuss. The questions parents ask most become new video answers in the library, and we’ll email you when yours is live.</p>
        <p style="margin-top:1.75rem"><a class="btn" href="/ask-the-doctor/">{icon('chat')}Ask a question</a></p>
      </div>
      <div class="ask-band__card" aria-hidden="true">
        <span class="from">Asked by a parent of a 2-year-old</span>
        <span class="q">“Every time she has antibiotics her tummy is upset for weeks. Is there anything we can do to help her bounce back?”</span>
        <div class="ans"><img src="/assets/img/dr-murray-clarke.jpg" alt=""><p><strong>Answered on video</strong> · 4 min<br>Gut health &amp; microbiome</p></div>
      </div>
    </div>
  </div>
</section>

<section class="section" aria-labelledby="recent-title">
  <div class="wrap">
    <div class="section-head reveal">
      <h2 id="recent-title">Recently answered</h2>
      <p class="lede">Short, practical answers — each one with the expert video it came from.</p>
    </div>
    <ul class="answers reveal">{recent}</ul>
  </div>
</section>

<section class="section--tight" aria-labelledby="book-title">
  <div class="wrap book">
    <div class="book__cover-wrap reveal">
      <div class="book__cover" aria-hidden="true"><span class="t1">The First</span><span class="t2">Seven<br>Years</span><span class="sq">{'<i></i>'*7}</span>
        <span class="sub">What every parent should know about the years that shape a lifetime</span><span class="by">Dr. Murray Clarke</span></div>
    </div>
    <div class="reveal" style="--d:120ms">
      <span class="eyebrow">Coming soon</span>
      <h2 id="book-title" class="h1" style="margin-top:.8rem">The book.</h2>
      <p class="lede" style="margin-top:1rem">Everything from the show, organised year by year — so you can find what matters for the age your child is right now.</p>
      <form class="inline-form" data-email-form data-success="You’re on the list — we’ll email you the moment it’s available.">
        <label class="sr-only" for="book-email">Email address</label>
        <input id="book-email" type="email" required placeholder="you@example.com" autocomplete="email">
        <button class="btn" type="submit">Notify me</button>
      </form>
      <div class="recaptcha-badge-inline">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="#4285F4"><path d="M12 2a10 10 0 0 0-7.07 2.93l-1.42-1.42A1 1 0 0 0 2 4.22V9a1 1 0 0 0 1 1h4.78a1 1 0 0 0 .71-1.71L7.07 6.87A8 8 0 1 1 4 12a1 1 0 0 0-2 0 10 10 0 1 0 10-10z"/></svg>
        <span>Protected by <strong>reCAPTCHA</strong> · <a href="https://policies.google.com/privacy" target="_blank" rel="noopener">Privacy</a> · <a href="https://policies.google.com/terms" target="_blank" rel="noopener">Terms</a></span>
      </div>
      <p class="form-msg" role="status"></p>
      <a class="link-arrow" href="/book/">About the book {icon('arrow')}</a>
    </div>
  </div>
</section>

<section class="section" aria-labelledby="trust-title">
  <div class="wrap">
    <h2 id="trust-title" class="sr-only">Why you can trust this library</h2>
    <div class="trust reveal">
      <div>{icon('shield')}<h3>Reviewed, then published</h3><p>Every answer is reviewed before it goes live, and shows the date it was last checked.</p></div>
      <div>{icon('users')}<h3>Named experts</h3><p>You always know who is speaking, what their background is, and where the answer came from.</p></div>
      <div>{icon('link')}<h3>Relationships disclosed</h3><p>Sponsors and commercial relationships are labelled clearly — never hidden in small print.</p></div>
      <div>{icon('alert')}<h3>Education, not diagnosis</h3><p>We explain the why. Your own pediatrician is always the right person for your child’s care.</p></div>
    </div>
  </div>
</section>

<section class="section--tight" id="newsletter" aria-labelledby="nl-title">
  <div class="wrap">
    <div class="newsletter reveal">
      <div><h2 id="nl-title">One good answer, every Sunday.</h2><p style="margin-top:.8rem">A single question, answered well — plus the week’s new episode. Unsubscribe any time.</p></div>
      <div>
        <form class="inline-form" data-email-form data-success="Welcome — your first Sunday answer is on its way.">
          <label class="sr-only" for="nl-email">Email address</label>
          <input id="nl-email" type="email" required placeholder="you@example.com" autocomplete="email">
          <button class="btn" type="submit">Subscribe</button>
        </form>
        <div class="recaptcha-badge-inline">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="#4285F4"><path d="M12 2a10 10 0 0 0-7.07 2.93l-1.42-1.42A1 1 0 0 0 2 4.22V9a1 1 0 0 0 1 1h4.78a1 1 0 0 0 .71-1.71L7.07 6.87A8 8 0 1 1 4 12a1 1 0 0 0-2 0 10 10 0 1 0 10-10z"/></svg>
          <span>Protected by <strong>reCAPTCHA</strong> · <a href="https://policies.google.com/privacy" target="_blank" rel="noopener">Privacy</a> · <a href="https://policies.google.com/terms" target="_blank" rel="noopener">Terms</a></span>
        </div>
        <p class="form-msg" role="status"></p>
      </div>
    </div>
  </div>
</section>"""
    ld = [{"@type": "WebPage", "@id": SITE + "/#webpage", "url": SITE + "/", "name": "The First Seven Years",
           "isPartOf": {"@id": SITE + "/#website"}, "about": {"@id": SITE + "/#org"},
           "audience": {"@type": "PeopleAudience", "audienceType": "Parents of children aged 0–7"}},
          {"@type": "PodcastSeries", "name": "The First Seven Years", "url": SITE + "/episodes/", "webFeed": YT,
           "author": {"@id": SITE + "/experts/dr-murray-clarke/#person"}},
          person_ld("dr-murray-clarke")]
    page("/", "The First Seven Years — Expert answers for parents of kids 0–7",
         "Calm, expert answers to the questions parents of young children ask most — nutrition, gut health, eczema, sleep, focus and more — with Dr. Murray Clarke.",
         body, ld, home=True)

# --------------------------------------------------------------------------
# TOPICS
# --------------------------------------------------------------------------
def build_topics():
    rows = "".join(f"""<li><a class="topic-row" href="{topic_url(t[0])}" style="--sw:{t[3]}">
  <span class="n">{i+1:02d}</span><span class="name">{t[1]}</span><span class="desc">{t[2]}</span>
  <span class="count">{topic_count(t[0])}</span><span class="go">{icon('arrow')}</span></a></li>""" for i, t in enumerate(TOPICS))
    cr = [("Home", "/"), ("Topics", None)]
    body = f"""<div class="page-head page-head--tint"><div class="wrap">{crumbs(cr)}
<h1>All topics</h1><p class="lede">Thirteen areas parents ask about most. Each hub collects the short answers, full episodes and experts for that topic.</p>
<div style="margin-top:2rem">{qsearch(PROMPTS, uid="t-q")}</div></div></div>
<section class="section--tight"><div class="wrap"><ul class="topic-index">{rows}</ul></div></section>"""
    ld = [ld_crumbs(cr), {"@type": "CollectionPage", "name": "Topics", "url": SITE + "/topics/",
          "mainEntity": {"@type": "ItemList", "itemListElement": [{"@type": "ListItem", "position": i + 1, "url": SITE + topic_url(t[0]), "name": t[1]} for i, t in enumerate(TOPICS)]}}]
    page("/topics/", "Topics — The First Seven Years", "Browse 13 topic hubs for parents of children aged 0–7: gut health, nutrition, picky eating, eczema, allergies, immunity, sleep, ADHD and more.", body, ld, active="/topics/")

    for t in TOPICS:
        slug, name, short, sw, intro = t
        meta = TOPIC_META.get(slug, {})

        # 1. Parent Answers: assigned or derived
        assigned_ans = meta.get("answers")
        if assigned_ans:
            ans = [ANS[s] for s in assigned_ans if s in ANS]
        else:
            ans = ans_for(slug)

        # 2. Episodes: assigned or derived
        assigned_eps = meta.get("episodes")
        if assigned_eps:
            eps = [EPV[vid] for vid in assigned_eps if vid in EPV]
        else:
            eps = eps_for(slug)

        # 3. Main Video: assigned or derived
        main_vid = meta.get("main_video")
        if main_vid:
            m = re.search(r'(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))([\w-]{11})', main_vid)
            if m: main_vid = m.group(1)
        if main_vid and main_vid in EPV:
            orient = EPV[main_vid]
        else:
            orient = next((e for e in eps if e["kind"] == "ep"), eps[0] if eps else None)

        # 4. Assigned Experts: assigned or derived
        assigned_exps = meta.get("experts")
        if assigned_exps:
            experts = [s for s in assigned_exps if s in EXPERTS]
        else:
            experts = []
            for e in eps + [{"guest": a["expert"]} for a in ans]:
                if e["guest"] not in experts and e["guest"] in EXPERTS:
                    experts.append(e["guest"])

        # 5. Selected Ages 0–7
        ages_list = meta.get("ages")
        if not ages_list or set(ages_list) == set(range(8)):
            age_label = "Ages 0–7"
        elif len(ages_list) > 1 and max(ages_list) - min(ages_list) == len(ages_list) - 1:
            age_label = f"Ages {min(ages_list)}–{max(ages_list)}"
        elif ages_list:
            age_label = f"Ages {', '.join(str(x) for x in sorted(ages_list))}"
        else:
            age_label = "Ages 0–7"

        cr = [("Home", "/"), ("Topics", "/topics/"), (name, None)]
        ans_html = f'<ul class="answers">{"".join(f"<li>{answer_card(a)}</li>" for a in ans)}</ul>' if ans else \
            f'<div class="card"><p>We’re writing the first answers for this topic now. <a class="link-arrow" href="/ask-the-doctor/">Ask Dr. Murray about {name.lower()} {icon("arrow")}</a></p></div>'
        eps_html = f'<div class="ep-grid">{"".join(ep_card(e) for e in eps[:9])}</div>' if eps else \
            '<p class="muted">Episodes on this topic are in production. Subscribe on YouTube to hear first.</p>'
        exp_html = "".join(expert_tile(s) for s in experts[:4])
        others = [x for x in TOPICS if x[0] != slug][:6]
        body = f"""<div class="page-head page-head--tint" style="--tint:{sw}"><div class="wrap">{crumbs(cr)}
<span class="eyebrow">Topic hub</span>
<h1 style="margin-top:.6rem">{name}</h1><p class="lede">{intro}</p>
<div class="hub-meta"><span class="pill">{len(ans)} answers</span><span class="pill">{len(eps)} videos</span><span class="pill">{age_label}</span></div></div></div>
<section class="section--tight"><div class="wrap layout-2">
<div>
  {f'<h2 class="h3" style="margin-bottom:1rem">Start here</h2>{yt_facade(orient["id"], orient["title"], "Start here · " + ep_label(orient))}<p class="muted" style="margin-top:.8rem">{esc(orient["title"])}</p>' if orient else ''}
  <h2 class="h2" style="margin:3rem 0 1.25rem">Parent questions</h2>
  {ans_html}
  <h2 class="h2" style="margin:3.5rem 0 1.25rem">Episodes &amp; clips</h2>
  {eps_html}
  {f'<p style="margin-top:2rem"><a class="link-arrow" href="/episodes/?topic={slug}">All {name.lower()} videos {icon("arrow")}</a></p>' if len(eps) > 9 else ''}
</div>
<aside class="aside" aria-label="About this topic">
  <div class="card"><h2>Experts on this topic</h2><ul class="related" style="margin-top:.5rem">{"".join(f'<li><a href="{expert_url(s)}">{EXPERTS[s]["name"]}<small>{EXPERTS[s]["role"]}</small></a></li>' for s in experts[:5]) or '<li class="muted">Dr. Murray Clarke</li>'}</ul></div>
  <div class="card" style="background:var(--peach-soft);border-color:transparent"><h2>Still wondering?</h2><p style="margin:.5rem 0 1rem;font-size:.95rem">Send Dr. Murray your {name.lower()} question.</p><a class="btn" href="/ask-the-doctor/">Ask the Doctor</a></div>
  <div class="card"><h2>Other topics</h2><ul class="tags" style="margin-top:.8rem">{"".join(f'<li><a href="{topic_url(x[0])}">{x[1]}</a></li>' for x in others)}</ul></div>
</aside></div></section>"""
        ld = [ld_crumbs(cr), {"@type": "CollectionPage", "name": name, "description": intro, "url": SITE + topic_url(slug),
              "about": {"@type": "Thing", "name": name}, "audience": {"@type": "PeopleAudience", "audienceType": "Parents"},
              "mainEntity": {"@type": "ItemList", "itemListElement":
                  [{"@type": "ListItem", "position": i + 1, "url": SITE + u} for i, u in enumerate([ans_url(a) for a in ans] + [ep_url(e) for e in eps])]}}]
        if orient: ld.append(video_ld(orient))
        page(topic_url(slug), f"{name} for kids 0–7 — The First Seven Years", f"{intro} Expert answers and videos for parents.", body, ld, active="/topics/")

def expert_tile(s):
    x = EXPERTS[s]
    img = f'<img src="{x["img"]}" alt="" loading="lazy" width="800" height="875">' if x["img"] else f'<span class="ini">{"".join(w[0] for w in x["name"].replace("Dr. ","").split()[:2])}</span>'
    return f'<a class="expert-card" href="{expert_url(s)}"><span class="expert-card__img" style="--c:{x["c"]}">{img}</span><span><b>{x["name"]}</b><span>{x["role"]}</span></span></a>'

# --------------------------------------------------------------------------
# ANSWERS
# --------------------------------------------------------------------------
def build_answers():
    for a in ANSWERS:
        t = TOPIC[a["topic"]]; x = EXPERTS[a["expert"]]; v = EPV[a["video"]]
        cr = [("Home", "/"), ("Topics", "/topics/"), (t[1], topic_url(t[0])), (a["q"], None)]
        related = [r for r in ANSWERS if r is not a and (r["topic"] == a["topic"] or a["topic"] in r["also"] or r["topic"] in a["also"])][:4]
        rel_eps = [e for e in EPISODES if a["topic"] in e["tags"] and e["id"] != a["video"]][:3]
        full = EP_FULL.get(v["ep"])
        avatar = f'<img src="{x["img"]}" alt="" width="44" height="44">' if x["img"] else f'<span style="width:44px;height:44px;border-radius:50%;background:{x["c"]};display:grid;place-items:center;font-family:var(--font-display);font-weight:600">{x["name"].replace("Dr. ","")[0]}</span>'
        body_extra = a.get("body") or f"""
<h2>Watch the full answer</h2>
<p>{EXPERTS[a['expert']]['name']} answers this in the video above, drawn from {'Episode ' + str(v['ep']) if v['ep'] else 'our conversation'} of The First Seven Years.{f' For the whole discussion, <a href="{ep_url(full)}">watch the full episode</a>.' if full else ''}</p>
<h2>When to talk to your doctor</h2>
<p>If you are worried about your child, if symptoms are getting worse, or if something just doesn’t feel right, speak to your pediatrician. Trust your instincts — you know your child best.</p>"""
        body = f"""<div class="page-head" style="padding-bottom:0"><div class="wrap">{crumbs(cr)}</div></div>
<article class="section--tight" style="padding-top:0"><div class="wrap layout-2">
<div>
  <span class="eyebrow">{t[1]}</span>
  <h1 class="h1" style="margin-top:.7rem;max-width:22ch">{esc(a['q'])}</h1>
  <div class="byline">
    <div class="byline__who">{avatar}<div><a href="{expert_url(a['expert'])}">{x['name']}</a><small>{x['role']}</small></div></div>
    <div class="byline__dates"><span>Published <b><time datetime="{a['published']}">{fmt(a['published'])}</time></b></span>
      <span class="badge-review">{icon('check')}Reviewed <time datetime="{a['reviewed']}">{fmt(a['reviewed'])}</time></span>
      <span class="badge-draft" title="Prototype copy — replace with client-supplied, compliance-cleared text">Pending clinical review</span></div>
  </div>
  <section class="quick" aria-labelledby="qa"><h2 id="qa">The short answer</h2><p class="speakable">{esc(a['quick'])}</p></section>
  {yt_facade(v['id'], v['title'], 'Watch the answer · ' + x['name'])}
  <div class="prose" style="margin-top:2.5rem">{body_extra}</div>
  <div class="disclosure" style="margin-top:2.5rem"><b>Please note</b><span>This answer is general education, not medical advice for your child. Guests share their own clinical views. <a href="/about/#disclosure">How we handle relationships and sponsors</a>.</span></div>
</div>
<aside class="aside" aria-label="Related">
  <div class="card"><h2>More in {t[1]}</h2><ul class="related">{"".join(f'<li><a href="{ans_url(r)}">{esc(r["q"])}<small>{EXPERTS[r["expert"]]["name"]}</small></a></li>' for r in related) or '<li class="muted">More answers coming soon.</li>'}</ul>
  <p style="margin-top:1rem"><a class="link-arrow" href="{topic_url(t[0])}">Topic hub {icon('arrow')}</a></p></div>
  {f'<div class="card"><h2>Related videos</h2><ul class="related">' + "".join(f'<li><a href="{ep_url(e)}">{esc(e["title"])}<small>{ep_label(e)} · {EXPERTS[e["guest"]]["name"]}</small></a></li>' for e in rel_eps) + '</ul></div>' if rel_eps else ''}
  <div class="card" style="background:var(--mint-soft);border-color:transparent"><h2>Different question?</h2><p style="margin:.5rem 0 1rem;font-size:.95rem">Dr. Murray answers the questions parents ask most.</p><a class="btn" href="/ask-the-doctor/">Ask the Doctor</a></div>
</aside></div></article>"""
        url = SITE + ans_url(a)
        ld = [ld_crumbs(cr),
              {"@type": "MedicalWebPage", "@id": url + "#webpage", "url": url, "name": a["q"], "lastReviewed": a["reviewed"].isoformat(),
               "reviewedBy": {"@id": SITE + "/experts/dr-murray-clarke/#person"}, "audience": {"@type": "PeopleAudience", "audienceType": "Parents"},
               "about": {"@type": "MedicalCondition" if a["topic"] in ("skin-eczema", "allergies") else "Thing", "name": t[1]},
               "speakable": {"@type": "SpeakableSpecification", "cssSelector": [".speakable"]},
               "mainEntity": {"@id": url + "#article"}, "isPartOf": {"@id": SITE + "/#website"}},
              {"@type": "Article", "@id": url + "#article", "headline": a["q"], "description": a["quick"],
               "datePublished": a["published"].isoformat(), "dateModified": a["reviewed"].isoformat(),
               "author": {"@id": f"{SITE}/experts/{a['expert']}/#person"}, "publisher": {"@id": SITE + "/#org"},
               "image": thumb(v["id"], "maxresdefault"), "articleSection": t[1], "video": video_ld(v)},
              person_ld(a["expert"]), person_ld("dr-murray-clarke")]
        page(ans_url(a), f"{a['q']} — The First Seven Years", a["quick"][:155].rsplit(" ", 1)[0] + "…", body, ld, active="/topics/", og_img=thumb(v["id"], "maxresdefault"))

# --------------------------------------------------------------------------
# EPISODES — library (crawlable pagination) + episode pages
# --------------------------------------------------------------------------
PER = 24
def build_episodes():
    total = len(EPISODES); pages = (total + PER - 1) // PER
    topic_counts = [(t, len(eps_for(t[0]))) for t in TOPICS if eps_for(t[0])]
    guests = []
    for e in EPISODES:
        if e["guest"] not in guests: guests.append(e["guest"])
    for p in range(1, pages + 1):
        chunk = EPISODES[(p - 1) * PER: p * PER]
        path = "/episodes/" if p == 1 else f"/episodes/page/{p}/"
        cr = [("Home", "/"), ("Episodes", None if p == 1 else "/episodes/")] + ([] if p == 1 else [(f"Page {p}", None)])
        tchips = "".join(f'<a class="fchip" href="{topic_url(t[0])}">{t[1]} <small>{n}</small></a>' for t, n in topic_counts)
        gchips = "".join(f'<a class="fchip" href="{expert_url(g)}">{EXPERTS[g]["name"]} <small>{sum(1 for e in EPISODES if e["guest"]==g)}</small></a>' for g in guests)
        def purl(i): return "/episodes/" if i == 1 else f"/episodes/page/{i}/"
        pager = "".join(("<li><span aria-current=page>%d</span></li>" % i) if i == p else ('<li><a href="%s">%d</a></li>' % (purl(i), i)) for i in range(1, pages + 1))
        if p < pages: pager += f'<li><a href="/episodes/page/{p+1}/" rel="next" aria-label="Next page">{icon("arrow")}</a></li>'
        body = f"""<div class="page-head page-head--tint" style="--tint:var(--lilac-soft)"><div class="wrap">{crumbs(cr)}
<h1>Episodes</h1><p class="lede">116 conversations and counting — full episodes with pediatricians, researchers and practitioners, plus short clips that get straight to the answer.</p>
<div style="margin-top:2rem">{qsearch(["Search episodes — try “eczema” or “ADHD”", "Search by guest — try “Elisa Song”", "Search by topic — try “antibiotics”"], scope="episode", uid="ep-q")}</div></div></div>
<section class="section--tight"><div class="wrap">
  <div class="disclosure" style="margin-bottom:1.5rem"><b>Disclaimer</b><span>{esc(SETTINGS_CFG.get("youtube_disclaimer") or DEFAULT_YT_DISCLAIMER)}</span></div>
  <div class="filters" aria-label="Filter episodes">
    <div class="filters__row"><span class="filters__label">Show</span><a class="fchip" href="/episodes/" aria-current="true">All <small>{total}</small></a>{"".join(f'<a class="fchip" href="{ep_url(e)}">Episode {e["ep"]}</a>' for e in EP_FULL.values())}</div>
    <div class="filters__row"><span class="filters__label">Topic</span>{tchips}</div>
    <div class="filters__row"><span class="filters__label">Guest</span>{gchips}</div>
  </div>
  <p class="muted" style="margin-bottom:1.25rem">Newest first · showing {(p-1)*PER+1}–{(p-1)*PER+len(chunk)} of {total} published on this site</p>
  <div class="ep-grid">{"".join(ep_card(e, lazy=i > 5) for i, e in enumerate(chunk))}</div>
  <nav aria-label="Episode pages"><ul class="pager">{pager}</ul></nav>
</div></section>"""
        ld = [ld_crumbs(cr), {"@type": "CollectionPage", "name": "Episodes", "url": SITE + path,
              "mainEntity": {"@type": "ItemList", "itemListElement": [{"@type": "ListItem", "position": (p-1)*PER + i + 1, "url": SITE + ep_url(e), "name": e["title"]} for i, e in enumerate(chunk)]}}]
        page(path, "Episodes — The First Seven Years podcast" + ("" if p == 1 else f" (page {p})"),
             "Every episode and clip of The First Seven Years: expert conversations on children’s nutrition, gut health, eczema, ADHD, autism and more.", body, ld, active="/episodes/")

    for e in EPISODES:
        g = EXPERTS[e["guest"]]; full = EP_FULL.get(e["ep"])
        ep_disclaimer = e.get("youtube_disclaimer") or SETTINGS_CFG.get("youtube_disclaimer") or DEFAULT_YT_DISCLAIMER
        cr = [("Home", "/"), ("Episodes", "/episodes/"), (e["title"], None)]
        related_ans = [a for a in ANSWERS if set([a["topic"]] + a["also"]) & set(e["tags"])][:4]
        more = [x for x in EPISODES if x is not e and (x["guest"] == e["guest"] or set(x["tags"]) & set(e["tags"]))][:3]
        hosts = '<a href="/experts/dr-murray-clarke/">Dr. Murray Clarke</a> and <a href="/experts/bryce-wylde/">Bryce Wylde</a>'
        if e["kind"] == "ep":
            gl = '<a href="%s">%s</a>' % (expert_url(e['guest']), g['name'])
            summary = f"<p>In Episode {e['ep']}, {hosts} sit down with {gl} to ask: <em>{esc(e['title'])}</em></p><p>Below you’ll find the short clips from this conversation, the parent answers it informs, and the full transcript.</p>"
        else:
            gl = '<a href="%s">%s</a>' % (expert_url(e['guest']), g['name'])
            fl = (' from <a href="%s">Episode %s</a>' % (ep_url(full), e['ep'])) if full else ''
            tail = 'Watch the full conversation for the context behind it.' if full else ''
            summary = f"<p>A short clip{fl} with {gl}. {tail}</p>"
        clips = [x for x in EPISODES if x["kind"] == "clip" and x["ep"] == e["ep"] and e["kind"] == "ep"]
        body = f"""<div class="page-head" style="padding-bottom:1.5rem"><div class="wrap">{crumbs(cr)}
<div class="hub-meta" style="margin:0 0 1rem"><span class="pill">{('Episode ' + str(e['ep'])) if e['kind']=='ep' else 'Clip'}</span><span class="pill"><time datetime="{e['date']}">{fmt(e['date'])}</time></span></div>
<h1 class="h1" style="max-width:24ch">{esc(e['title'])}</h1></div></div>
<article class="section--tight" style="padding-top:0"><div class="wrap layout-2">
<div>
  {yt_facade(e['id'], e['title'], ep_label(e) + ' · ' + g['name'])}
  <div class="byline"><div class="byline__who"><span style="width:44px;height:44px;border-radius:50%;background:{g['c']};display:grid;place-items:center;font-family:var(--font-display);font-weight:600">{g['name'].replace('Dr. ','')[0]}</span><div>Guest: <a href="{expert_url(e['guest'])}">{g['name']}</a><small>{g['role']}</small></div></div>
    <div class="byline__dates"><span>Hosted by <b>Dr. Murray Clarke</b> &amp; <b>Bryce Wylde</b></span></div></div>
  <div class="prose">{summary}</div>
  <ul class="tags" style="margin-top:1.5rem" aria-label="Topics">{"".join(f'<li><a href="{topic_url(t)}">{TOPIC[t][1]}</a></li>' for t in e['tags'])}</ul>
  {f'<h2 class="h3" style="margin:2.5rem 0 1rem">Clips from this episode</h2><div class="ep-grid">' + "".join(ep_card(c) for c in clips[:6]) + '</div>' if clips else ''}
  <details class="transcript" style="margin-top:2.5rem"><summary>Full transcript</summary><div><p>The transcript for this {'episode' if e['kind']=='ep' else 'clip'} is loaded from the episode export at build time. It is published in full on the page so every word spoken can be found by search engines and AI assistants.</p></div></details>
  <div class="disclosure" style="margin-top:1.5rem"><b>Disclaimer</b><span>{esc(ep_disclaimer)}</span></div>
</div>
<aside class="aside" aria-label="Related">
  {'<div class="card"><h2>Answers from this conversation</h2><ul class="related">' + "".join(f'<li><a href="{ans_url(a)}">{esc(a["q"])}<small>{TOPIC[a["topic"]][1]}</small></a></li>' for a in related_ans) + '</ul></div>' if related_ans else ''}
  {f'<div class="card"><h2>Full episode</h2><ul class="related"><li><a href="{ep_url(full)}">{esc(full["title"])}<small>Episode {full["ep"]} · {g["name"]}</small></a></li></ul></div>' if full and e['kind'] == 'clip' else ''}
  <div class="card"><h2>Watch next</h2><ul class="related">{"".join(f'<li><a href="{ep_url(x)}">{esc(x["title"])}<small>{ep_label(x)} · {EXPERTS[x["guest"]]["name"]}</small></a></li>' for x in more)}</ul></div>
</aside></div></article>"""
        url = SITE + ep_url(e)
        ld = [ld_crumbs(cr), dict(video_ld(e), **{"@id": url + "#video"}),
              {"@type": "PodcastEpisode" if e["kind"] == "ep" else "WebPage", "@id": url + "#page", "url": url, "name": e["title"],
               "description": ep_desc(e), "datePublished": e["date"].isoformat(),
               **({"episodeNumber": e["ep"], "partOfSeries": {"@type": "PodcastSeries", "name": "The First Seven Years", "url": SITE + "/episodes/"},
                   "actor": [{"@id": SITE + "/experts/dr-murray-clarke/#person"}, {"@id": f"{SITE}/experts/bryce-wylde/#person"}, {"@id": f"{SITE}/experts/{e['guest']}/#person"}]}
                  if e["kind"] == "ep" else {"mainEntity": {"@id": url + "#video"}})},
               person_ld(e["guest"])]
        page_title = e.get("seo_title") or f"{e['title']} — The First Seven Years"
        page_desc = e.get("meta_desc") or ep_desc(e)[:158]
        page_og_img = e.get("og_image") or thumb(e["id"], "maxresdefault")
        page(ep_url(e), page_title, page_desc, body, ld, active="/episodes/", og_img=page_og_img)

# --------------------------------------------------------------------------
# EXPERTS
# --------------------------------------------------------------------------
def build_experts():
    cr = [("Home", "/"), ("Experts", None)]
    body = f"""<div class="page-head page-head--tint" style="--tint:var(--peach-soft)"><div class="wrap">{crumbs(cr)}
<h1>The experts</h1><p class="lede">You always know who is speaking. Our hosts, and the pediatricians, researchers and practitioners who join them.</p></div></div>
<section class="section--tight"><div class="wrap"><ul class="experts">{"".join(f"<li>{expert_tile(s)}</li>" for s in EXPERTS)}</ul></div></section>"""
    page("/experts/", "Experts — The First Seven Years", "Meet Dr. Murray Clarke, co-host Bryce Wylde and the pediatricians and practitioners who join The First Seven Years.",
         body, [ld_crumbs(cr)] + [person_ld(s) for s in EXPERTS], active="/experts/")
    for s, x in EXPERTS.items():
        cr = [("Home", "/"), ("Experts", "/experts/"), (x["name"], None)]
        eps = [e for e in EPISODES if e["guest"] == s] if s not in ("dr-murray-clarke", "bryce-wylde") else EPISODES[:6]
        ans = [a for a in ANSWERS if a["expert"] == s] if s != "dr-murray-clarke" else ANSWERS[:6]
        img = f'<img src="{x["img"]}" alt="Portrait of {x["name"]}" width="800" height="875">' if x["img"] else f'<div style="height:100%;display:grid;place-items:center;background:{x["c"]};font-family:var(--font-display);font-size:6rem;color:var(--navy)">{"".join(w[0] for w in x["name"].replace("Dr. ","").split()[:2])}</div>'
        body = f"""<div class="page-head" style="padding-bottom:1rem"><div class="wrap">{crumbs(cr)}</div></div>
<section class="section--tight" style="padding-top:0"><div class="wrap profile">
  <div class="profile__img" style="background:{x['c']}">{img}</div>
  <div>
    <span class="eyebrow">{x['role']}</span>
    <h1 class="display" style="margin-top:.6rem">{x['name']}</h1>
    <div class="prose" style="margin-top:1.5rem">{"".join(f"<p{' class=lede' if i==0 else ''}>{p}</p>" for i, p in enumerate(x['bio']))}</div>
    <ul class="creds">{"".join(f"<li>{icon('check')}<span>{c}</span></li>" for c in x['creds'])}</ul>
    {'<p style="margin-top:2rem"><a class="btn" href="/ask-the-doctor/">' + icon('chat') + 'Ask Dr. Murray a question</a></p>' if s == 'dr-murray-clarke' else ''}
    {f'<h2 class="h3" style="margin:3rem 0 1rem">Answers</h2><ul class="answers">' + "".join(f"<li>{answer_card(a)}</li>" for a in ans) + '</ul>' if ans else ''}
    {f'<h2 class="h3" style="margin:3rem 0 1rem">{"Latest episodes" if s in ("dr-murray-clarke","bryce-wylde") else "Episodes & clips"}</h2><div class="ep-grid">' + "".join(ep_card(e) for e in eps[:6]) + '</div>' if eps else ''}
    <p class="muted" style="margin-top:2rem;font-size:.85rem">Profile last reviewed <time datetime="{TODAY}">{fmt(TODAY)}</time>. Credentials are supplied and confirmed by the expert.</p>
  </div>
</div></section>"""
        ld = [ld_crumbs(cr), {"@type": "ProfilePage", "url": SITE + expert_url(s), "mainEntity": {"@id": f"{SITE}/experts/{s}/#person"}}, person_ld(s)]
        exp_seo_title = x.get("seo_title") or f"{x['name']} — {x['role'].split('·')[0].strip()} | The First Seven Years"
        exp_meta_desc = x.get("meta_desc") or x["short"]
        exp_og_img = x.get("og_image") or (SITE + x["img"] if x.get("img") else None)
        page(expert_url(s), exp_seo_title, exp_meta_desc, body, ld, active="/experts/",
             og_img=exp_og_img)

# --------------------------------------------------------------------------
# ASK THE DOCTOR, ABOUT, BOOK, SEARCH, PRIVACY
# --------------------------------------------------------------------------
def build_ask():
    cr = [("Home", "/"), ("Ask the Doctor", None)]
    ages = "".join(f'<input type="radio" name="age" id="age{i}" value="{i}"{" aria-describedby=age-err" if i==0 else ""}><label for="age{i}">{i if i else "<1"}</label>' for i in range(8))
    topic_pills = "".join(f'<input type="checkbox" name="topics" id="top-{t[0]}" value="{t[0]}"><label for="top-{t[0]}">{t[1]}</label>' for t in TOPICS)
<<<<<<< HEAD
    topic_pills += '<input type="checkbox" name="topics" id="top-other" value="other"><label for="top-other">Something else</label>'
=======
>>>>>>> fe0bcab547943f6d16a1d6afc96becba158800f2
    body = f"""<div class="page-head page-head--tint" style="--tint:var(--peach-soft)"><div class="wrap">{crumbs(cr)}
<span class="eyebrow">Free · no account needed</span>
<h1 style="margin-top:.6rem">Ask the Doctor</h1>
<p class="lede">Send Dr. Murray your question about your child’s health, nutrition or development. The questions parents ask most become new video answers in the library.</p></div></div>
<section class="section--tight" style="padding-top:0"><div class="wrap layout-2">
<div class="card" style="padding:clamp(1.25rem,4vw,2.5rem)">
  <div class="notice notice--urgent" style="margin-bottom:1.5rem">{icon('alert')}<span><strong>Not for emergencies.</strong> If your child is struggling to breathe, is unusually drowsy, has a seizure, or you are worried right now — call your local emergency number or go to the nearest emergency department.</span></div>
  <form id="ask-form" class="form" novalidate>
    <fieldset class="field"><legend>How old is your child?</legend><div class="age-pick">{ages}</div><span class="err" id="age-err" aria-live="polite"></span></fieldset>
    <fieldset class="field"><legend>Topics <span class="muted">(select all that apply)</span></legend>
      <div class="topic-pick">{topic_pills}</div>
      <span class="err" id="topic-err" aria-live="polite"></span></fieldset>
<<<<<<< HEAD
    <div class="field" id="topic-other-wrap" hidden>
      <label for="topic-other">Please specify your topic</label>
      <input type="text" id="topic-other" name="topic_other" placeholder="What topic does your question relate to?" aria-describedby="topic-other-err">
      <span class="err" id="topic-other-err" aria-live="polite"></span>
    </div>
=======
>>>>>>> fe0bcab547943f6d16a1d6afc96becba158800f2
    <div class="field"><label for="q">Your question</label>
      <span class="hint" id="q-hint">Share what you’ve noticed and what you’ve tried. Please don’t include your child’s full name.</span>
      <textarea id="q" name="question" maxlength="1200" aria-describedby="q-hint q-err"></textarea>
      <span class="counter" id="q-count" aria-live="off">0 / 1200</span>
      <div class="notice notice--urgent" id="urgent" hidden role="alert">{icon('alert')}<span>Some of what you’ve described can need urgent care. Please contact your doctor or emergency services now rather than waiting for an answer here.</span></div>
      <span class="err" id="q-err" aria-live="polite"></span></div>
    <div class="field-row">
      <div class="field"><label for="fname">First name <span class="muted">(optional)</span></label><input id="fname" name="first_name" autocomplete="given-name"></div>
      <div class="field"><label for="email">Email</label><input id="email" name="email" type="email" autocomplete="email" aria-describedby="email-hint email-err"><span class="hint" id="email-hint">Only used to tell you when it’s answered.</span><span class="err" id="email-err" aria-live="polite"></span></div>
    </div>
    <label class="check"><input type="checkbox" id="consent" aria-describedby="consent-err"><span>I understand answers are general education — not a diagnosis or personal medical advice — and my question may be answered publicly without my name.</span></label>
    <span class="err" id="consent-err" aria-live="polite"></span>
    <label class="check"><input type="checkbox" name="newsletter"><span>Also send me one good answer every Sunday.</span></label>
    <div class="g-recaptcha-card">
<<<<<<< HEAD
      <div class="g-recaptcha" data-sitekey="6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI"></div>
      <div class="g-recaptcha-box" id="g-recaptcha-fallback">
=======
      <div class="g-recaptcha-box">
>>>>>>> fe0bcab547943f6d16a1d6afc96becba158800f2
        <label class="g-recaptcha-label" for="g-recaptcha-check">
          <input type="checkbox" id="g-recaptcha-check" name="recaptcha">
          <span class="g-recaptcha-checkbox" aria-hidden="true"></span>
          <span>I'm not a robot</span>
        </label>
        <div class="g-recaptcha-brand">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="#4285F4"><path d="M12 2a10 10 0 0 0-7.07 2.93l-1.42-1.42A1 1 0 0 0 2 4.22V9a1 1 0 0 0 1 1h4.78a1 1 0 0 0 .71-1.71L7.07 6.87A8 8 0 1 1 4 12a1 1 0 0 0-2 0 10 10 0 1 0 10-10z"/></svg>
          <span class="g-recaptcha-brand-title">reCAPTCHA</span>
          <span class="g-recaptcha-links"><a href="https://policies.google.com/privacy" target="_blank" rel="noopener">Privacy</a> - <a href="https://policies.google.com/terms" target="_blank" rel="noopener">Terms</a></span>
        </div>
      </div>
      <span class="err" id="captcha-err" aria-live="polite"></span>
    </div>
    <div><button class="btn" type="submit">{icon('chat')}Send my question</button></div>
  </form>
  <div id="ask-success" class="success" hidden tabindex="-1">
    <span class="tick">{icon('check')}</span>
    <h2 class="h2">Thank you — it’s with Dr. Murray.</h2>
    <p class="lede" style="margin:0 auto">We read every question. If yours is chosen for an answer, we’ll email you a link. In the meantime, search the library — someone may have asked already.</p>
    <a class="btn btn--ghost" href="/search/">Search answers</a>
  </div>
</div>
<aside class="aside">
  <div class="card"><h2>How it works</h2><ol class="steps" style="margin-top:1rem">
    <li><div><b>You ask</b><p>Takes two minutes. No account.</p></div></li>
    <li><div><b>We group questions</b><p>Similar questions are answered together, so more parents benefit.</p></div></li>
    <li><div><b>Dr. Murray answers</b><p>On video, reviewed before it’s published.</p></div></li>
    <li><div><b>You get the link</b><p>We email you when your answer is live.</p></div></li></ol></div>
  <div class="card"><h2>Asked recently</h2><ul class="related">{"".join(f'<li><a href="{ans_url(a)}">{esc(a["q"])}</a></li>' for a in ANSWERS[:4])}</ul></div>
</aside></div></section>"""
    ld = [ld_crumbs(cr), {"@type": "ContactPage", "name": "Ask the Doctor", "url": SITE + "/ask-the-doctor/",
          "description": "Send Dr. Murray Clarke a question about your child’s health, nutrition or development."}]
    page("/ask-the-doctor/", "Ask the Doctor — send Dr. Murray your question | The First Seven Years",
         "Free: ask Dr. Murray Clarke a question about your child aged 0–7. The most common questions become new video answers.", body, ld)

def build_about():
    cr = [("Home", "/"), ("About", None)]
    body = f"""<div class="page-head page-head--tint"><div class="wrap">{crumbs(cr)}
<h1>Why the <em class="accent">first seven</em> years?</h1>
<p class="lede">Because so much is set in motion before a child turns seven — the microbiome, the immune system, sleep, appetite and the brain’s wiring for focus and feelings. Parents deserve clear, honest explanations of all of it.</p></div></div>
<section class="section--tight"><div class="wrap-narrow prose">
<p class="lede">The First Seven Years began as a podcast and video series, hosted by Dr. Murray Clarke and co-host Bryce Wylde. Over more than a hundred conversations with pediatricians, researchers and practitioners, one thing kept coming up: parents didn’t want another hour-long episode at 11pm. They wanted the answer to <em>their</em> question.</p>
<p>So we built this library. Every conversation is broken into short, searchable answers, organised by topic and by your child’s age — with the full episode always one click away when you want the depth.</p>
</div></section>
<section class="section--tight" id="standards"><div class="wrap">
<div class="section-head"><h2>Editorial standards</h2><p class="lede">How an answer gets from a conversation to this site.</p></div>
<ul class="principles">
  <li><h3>Named, qualified voices</h3><p>Every answer names the expert speaking and links to their profile and credentials.</p></li>
  <li><h3>Reviewed before publishing</h3><p>Answers are reviewed before they go live. Nothing publishes as a draft.</p></li>
  <li><h3>Dated and re-checked</h3><p>Each page shows when it was published and when it was last reviewed. We revisit answers as evidence changes.</p></li>
  <li><h3>Education, not diagnosis</h3><p>We explain the why and share expert views. We never diagnose, and we always point you back to your own doctor.</p></li>
  <li><h3>Clear on uncertainty</h3><p>Where evidence is early or mixed — especially for newer therapies — we say so plainly.</p></li>
  <li><h3>Corrections welcome</h3><p>Spotted something out of date? Tell us and we’ll review it, and note the change on the page.</p></li>
</ul></div></section>
<section class="section--tight" id="disclosure"><div class="wrap-narrow prose">
<h2>Relationships &amp; disclosure</h2>
<p>Trust is the whole point of this library, so here is how we handle money and relationships:</p>
<ul>
  <li><strong>Our hosts.</strong> Dr. Murray Clarke has a commercial interest in the children’s nutrition sector. Where an answer touches a category in which he has an interest, the page says so.</li>
  <li><strong>Sponsors.</strong> Some episodes are supported by sponsors. Sponsor messages are always labelled, and sponsors have no input into which questions we answer or what the answers say.</li>
  <li><strong>Guests.</strong> Guests share their own clinical views and experience. Appearing on the show is not an endorsement of any product or service they offer.</li>
  <li><strong>No product recommendations in answers.</strong> Answers explain nutrients, foods and approaches — not brands.</li>
</ul>
<h2>Accessibility</h2>
<p>This site is built to WCAG 2.1 AA: readable contrast, full keyboard navigation, captions on video, and transcripts on every episode. If anything gets in your way, please tell us.</p>
</div></section>"""
    about_pg = next((p for p in CUSTOM_PAGES if p.get("slug") == "about"), {})
    page_title = about_pg.get("seo_title") or "About & editorial standards — The First Seven Years"
    page_desc = about_pg.get("meta_desc") or "Why The First Seven Years exists, how answers are reviewed, and how we disclose sponsors and relationships."
    ld = [ld_crumbs(cr), {"@type": about_pg.get("schema_type", "AboutPage"), "name": about_pg.get("title", "About The First Seven Years"), "url": SITE + "/about/", "about": {"@id": SITE + "/#org"}}]
    page("/about/", page_title, page_desc, body, ld, active="/about/", og_img=about_pg.get("og_image") or None)

def build_book():
    cr = [("Home", "/"), ("The book", None)]
    body = f"""<div class="page-head" style="padding-bottom:0"><div class="wrap">{crumbs(cr)}</div></div>
<section class="section--tight" style="padding-top:0"><div class="wrap book">
  <div class="book__cover-wrap"><div class="book__cover" role="img" aria-label="Cover of The First Seven Years book by Dr. Murray Clarke"><span class="t1">The First</span><span class="t2">Seven<br>Years</span><span class="sq">{'<i></i>'*7}</span>
    <span class="sub">What every parent should know about the years that shape a lifetime</span><span class="by">Dr. Murray Clarke</span></div></div>
  <div>
    <span class="eyebrow">Coming soon</span>
    <h1 class="display" style="margin-top:.6rem">The First Seven Years</h1>
    <p class="lede" style="margin-top:1rem">The book of the show — the best of more than a hundred expert conversations, organised year by year, so you can open it at the age your child is right now.</p>
    <div class="book__meta"><span class="pill">Hardback &amp; ebook</span><span class="pill">By Dr. Murray Clarke</span><span class="pill">Publication date to be announced</span></div>
    <form class="inline-form" data-email-form data-success="You’re on the list — we’ll email you the moment it’s available.">
      <label class="sr-only" for="bk-email">Email address</label>
      <input id="bk-email" type="email" required placeholder="you@example.com" autocomplete="email">
      <button class="btn" type="submit">Notify me at launch</button>
    </form>
    <div class="recaptcha-badge-inline">
      <svg width="15" height="15" viewBox="0 0 24 24" fill="#4285F4"><path d="M12 2a10 10 0 0 0-7.07 2.93l-1.42-1.42A1 1 0 0 0 2 4.22V9a1 1 0 0 0 1 1h4.78a1 1 0 0 0 .71-1.71L7.07 6.87A8 8 0 1 1 4 12a1 1 0 0 0-2 0 10 10 0 1 0 10-10z"/></svg>
      <span>Protected by <strong>reCAPTCHA</strong> · <a href="https://policies.google.com/privacy" target="_blank" rel="noopener">Privacy</a> · <a href="https://policies.google.com/terms" target="_blank" rel="noopener">Terms</a></span>
    </div>
    <p class="form-msg" role="status"></p>
  </div>
</div></section>
<section class="section--tight"><div class="wrap">
<div class="section-head"><h2>Inside the book</h2><p class="lede">Seven chapters, one for each year — plus a chapter for before day one.</p></div>
<ul class="principles">
  <li><h3>Before day one</h3><p>Preconception, pregnancy and the microbiome your baby inherits.</p></li>
  <li><h3>Year one</h3><p>Feeding, skin, sleep and an immune system learning fast.</p></li>
  <li><h3>Years two and three</h3><p>First foods become picky eating; first colds become nursery bugs.</p></li>
  <li><h3>Years four to seven</h3><p>Focus, feelings, school-day food and a foundation for life.</p></li>
</ul></div></section>"""
    ld = [ld_crumbs(cr), {"@type": "Book", "name": "The First Seven Years", "author": {"@id": SITE + "/experts/dr-murray-clarke/#person"},
          "url": SITE + "/book/", "bookFormat": ["https://schema.org/Hardcover", "https://schema.org/EBook"], "inLanguage": "en",
          "description": "The book of The First Seven Years — expert answers for parents, organised year by year."}]
    page("/book/", "The First Seven Years — the book by Dr. Murray Clarke (coming soon)",
         "The book of the show, organised year by year. Join the list to hear first when The First Seven Years is published.", body, ld, active="/book/")

def build_search():
    cr = [("Home", "/"), ("Search", None)]
    body = f"""<div class="page-head page-head--tint" style="min-height:60vh"><div class="wrap">{crumbs(cr)}
<h1>What would you like to know?</h1><p class="lede">Ask in your own words — we’ll find the answers, episodes and experts that match.</p>
<div style="margin-top:2rem">{qsearch(PROMPTS, prefill=True, uid="s-q")}</div>
<div class="qsearch__chips" style="justify-content:flex-start">{"".join(f'<a class="chip" href="{topic_url(t[0])}">{t[1]}</a>' for t in TOPICS[:8])}</div></div></div>"""
    page("/search/", "Search — The First Seven Years", "Search expert answers and episodes for parents of children aged 0–7.", body, [ld_crumbs(cr)], noindex=True)

def build_pages():
    for p in CUSTOM_PAGES:
        if not p.get("published", True):
            continue
        slug = p.get("slug", "")
        if not slug or slug in ["home", "book", "ask-the-doctor"]:
            continue
        
        path = p.get("url") or f"/{slug}/"
        title = p.get("title", slug.title())
        seo_title = p.get("seo_title") or f"{title} — The First Seven Years"
        meta_desc = p.get("meta_desc") or p.get("excerpt", "")
        schema_type = p.get("schema_type", "WebPage")
        og_img = p.get("og_image") or thumb("wHrPcQPYiaE", "maxresdefault")
        noindex = (p.get("robots_index") == "noindex")
        
        cr = [("Home", "/"), (title, None)]
        body_text = p.get("body", "")
        
        if slug == "privacy":
            body = f"""<div class="page-head"><div class="wrap">{crumbs(cr)}<h1>{esc(title)}</h1>
<p class="lede">{esc(p.get("excerpt", "How The First Seven Years collects, handles and protects parent inquiries and user data."))}</p></div></div>
<section class="section--tight" style="padding-top:0"><div class="wrap-narrow prose">
<p class="lede">{esc(body_text or 'We respect family privacy. Submissions made through Ask the Doctor are kept confidential and de-identified before educational publishing.')}</p>
<h2>1. Information We Collect</h2>
<p>We believe in radical data minimization. When you interact with our platform, the only information collected is:</p>
<ul>
  <li><strong>Email Addresses:</strong> If you voluntarily subscribe to our newsletter or submit an inquiry via Ask the Doctor.</li>
  <li><strong>Parent Inquiries:</strong> Questions submitted to our pediatric clinical panel. All questions are de-identified before discussion.</li>
  <li><strong>Technical Analytics:</strong> Privacy-friendly aggregate usage metrics to understand which topics are most helpful.</li>
</ul>
<h2>2. Children’s Online Privacy (COPPA &amp; Health Regulations)</h2>
<p>Our service is designed exclusively for adult parents, guardians, and medical practitioners. We never knowingly collect personal contact information from children under the age of 13.</p>
<h2>3. Video Embedding &amp; YouTube Facade</h2>
<p>All videos on The First Seven Years load using an interactive privacy facade. No external tracking cookies or scripts are loaded from YouTube or third parties until you actively click the play button.</p>
<h2>4. Health Information Confidentiality</h2>
<p>Inquiries sent through Ask the Doctor are treated as confidential editorial research. They do not create an electronic health record (EHR) or patient chart. Please do not submit emergency medical information through online forms.</p>
<h2>5. Your Rights &amp; Data Deletion</h2>
<p>You may request removal of your email or submitted question at any time by contacting us at <a href="mailto:hello@thefirstsevenyears.com">hello@thefirstsevenyears.com</a>.</p>
</div></section>"""
            ld = [ld_crumbs(cr), {"@type": schema_type, "name": title, "url": SITE + path, "description": meta_desc}]
            page(path, seo_title, meta_desc[:158], body, ld, active="/privacy/", og_img=og_img, noindex=noindex)

        elif slug == "terms":
            disclaimer = SETTINGS_CFG.get("medical_disclaimer", "Educational content only. Not individual medical advice. Consult your pediatrician.")
            body = f"""<div class="page-head"><div class="wrap">{crumbs(cr)}<h1>{esc(title)}</h1>
<p class="lede">{esc(p.get("excerpt", "Terms of use, user submission guidelines, and our educational medical disclaimer."))}</p></div></div>
<section class="section--tight" style="padding-top:0"><div class="wrap-narrow prose">
<div class="card" style="background:var(--cream);border-left:4px solid var(--navy);padding:1.25rem;margin-bottom:2rem">
  <strong style="color:var(--navy);font-size:1.05rem;display:block;margin-bottom:0.35rem">⚠️ Critical Medical Disclaimer</strong>
  <p style="margin:0;font-size:0.95rem;line-height:1.5">{esc(disclaimer)}</p>
</div>
<h2>1. Educational Purpose Only — Not Medical Advice</h2>
<p>The First Seven Years provides digital educational content, podcast conversations, expert interviews, and topic guides. <strong>Nothing on this website constitutes individual pediatric medical advice, diagnosis, prescription, or clinical treatment.</strong></p>
<p>Always consult your primary care pediatrician, family physician, or qualified pediatric healthcare specialist regarding any medical condition or symptoms.</p>
<h2>2. Medical Emergencies</h2>
<p>If you believe your child is experiencing a medical emergency, acute allergic reaction (anaphylaxis), breathing difficulty, severe lethargy, or high infant fever, <strong>call 911 or your local emergency services immediately</strong>. Do not submit emergency inquiries through this website.</p>
<h2>3. Ask the Doctor Submissions</h2>
<p>Questions submitted through Ask the Doctor are submitted voluntarily for potential educational discussion on our podcast and video series. By submitting an inquiry, you grant The First Seven Years permission to summarize, de-identify, and address the medical topic publicly for the benefit of other parents.</p>
<h2>4. Intellectual Property &amp; Video Content</h2>
<p>All videos, dialogue transcripts, audio recordings, articles, illustrations, and brand assets are protected by copyright and intellectual property laws. Content may be shared using public social share links but may not be republished without written consent.</p>
<h2>5. Contact &amp; Legal Notices</h2>
<p>For legal inquiries, copyright notices, or editorial questions, please contact <a href="mailto:hello@thefirstsevenyears.com">hello@thefirstsevenyears.com</a>.</p>
</div></section>"""
            ld = [ld_crumbs(cr), {"@type": schema_type, "name": title, "url": SITE + path, "description": meta_desc}]
            page(path, seo_title, meta_desc[:158], body, ld, active="/terms/", og_img=og_img, noindex=noindex)

        elif slug == "about":
            pass

        else:
            body = f"""<div class="page-head"><div class="wrap">{crumbs(cr)}<h1>{esc(title)}</h1>
{f'<p class="lede">{esc(p["excerpt"])}</p>' if p.get("excerpt") else ''}</div></div>
<section class="section--tight" style="padding-top:0"><div class="wrap-narrow prose">
{p.get("body") or '<p class="muted">Content for this page is being finalized.</p>'}
</div></section>"""
            ld = [ld_crumbs(cr), {"@type": schema_type, "name": title, "url": SITE + path, "description": meta_desc}]
            page(path, seo_title, meta_desc[:158], body, ld, active=path, og_img=og_img, noindex=noindex)

def build_faqs():
    if not FAQS:
        return
    cr = [("Home", "/"), ("FAQ", None)]
    categories = {}
    for f in FAQS:
        cat = f.get("category", "General Questions")
        categories.setdefault(cat, []).append(f)

    sections = []
    for cat, items in categories.items():
        cards = []
        for it in sorted(items, key=lambda x: x.get("order", 1)):
            cards.append(f"""<details class="faq-item" style="margin-bottom:1rem;background:var(--surface);border:1px solid var(--line);border-radius:12px;padding:1.25rem 1.5rem">
  <summary style="font-family:var(--font-display);font-size:1.15rem;font-weight:600;color:var(--navy);cursor:pointer;list-style:none;display:flex;justify-content:space-between;align-items:center">
    <span>{esc(it['question'])}</span>
    <span style="font-size:1.2rem;color:var(--ink-3);margin-left:1rem">▾</span>
  </summary>
  <div style="margin-top:1rem;color:var(--ink-2);line-height:1.65;font-size:1rem;border-top:1px solid var(--line);padding-top:1rem">
    <p>{esc(it['answer'])}</p>
  </div>
</details>""")
        sections.append(f"""<div style="margin-bottom:2.5rem"><h2 style="font-family:var(--font-display);color:var(--navy);margin-bottom:1rem;font-size:1.45rem">{esc(cat)}</h2>{"".join(cards)}</div>""")

    body = f"""<div class="page-head page-head--tint"><div class="wrap">{crumbs(cr)}
<h1>Frequently Asked Questions</h1>
<p class="lede">Clear answers about The First Seven Years library, our clinical review standards, podcast episodes, and Dr. Murray Clarke’s upcoming book.</p>
</div></div>
<section class="section--tight" style="padding-top:2rem"><div class="wrap-narrow">
{"".join(sections)}
<div style="margin-top:3rem;background:var(--oat);padding:1.75rem 2rem;border-radius:16px;text-align:center">
  <h3 style="font-family:var(--font-display);color:var(--navy);margin-bottom:0.5rem;font-size:1.3rem">Have a specific question about your child?</h3>
  <p style="color:var(--ink-2);margin-bottom:1.2rem">Dr. Murray Clarke reads parent questions directly — the most common become new answers in this library.</p>
  <a class="btn btn--mint" href="/ask-the-doctor/">Ask Dr. Murray a question</a>
</div>
</div></section>"""
    ld = [ld_crumbs(cr), {
        "@type": "FAQPage",
        "mainEntity": [{"@type": "Question", "name": it["question"], "acceptedAnswer": {"@type": "Answer", "text": it["answer"]}} for it in FAQS]
    }]
    page("/faq/", "FAQ — The First Seven Years", "Frequently asked questions about The First Seven Years.", body, ld, active="/faq/")

# --------------------------------------------------------------------------
# SEARCH INDEX, SITEMAP, ROBOTS, LLMS.TXT, FAVICON
# --------------------------------------------------------------------------
def build_meta():
    idx = [{"k": "answer", "t": a["q"], "s": f"{EXPERTS[a['expert']]['name']} · {TOPIC[a['topic']][1]}", "u": ans_url(a), "x": a["quick"] + " " + " ".join(TOPIC[t][1] for t in [a["topic"]] + a["also"])} for a in ANSWERS]
    idx += [{"k": "topic", "t": t[1], "s": t[2], "u": topic_url(t[0]), "x": t[4]} for t in TOPICS]
    idx += [{"k": "episode", "t": e["title"], "s": f"{ep_label(e)} · {EXPERTS[e['guest']]['name']}", "u": ep_url(e), "x": EXPERTS[e["guest"]]["name"] + " " + " ".join(TOPIC[t][1] for t in e["tags"])} for e in EPISODES]
    idx += [{"k": "expert", "t": x["name"], "s": x["role"], "u": expert_url(s), "x": x["short"]} for s, x in EXPERTS.items()]
    idx += [{"k": "faq", "t": f["question"], "s": f"FAQ · {f.get('category', 'General')}", "u": "/faq/", "x": f["answer"]} for f in FAQS]
    (ROOT / "assets/js/search-index.js").write_text("window.F7_INDEX=" + json.dumps(idx, ensure_ascii=False) + ";", encoding="utf-8")

    urls = "".join(f"<url><loc>{SITE}{p}</loc><lastmod>{TODAY}</lastmod></url>" for p, ni in SITEMAP if not ni)
    (ROOT / "sitemap.xml").write_text(f'<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">{urls}</urlset>', encoding="utf-8")

    (ROOT / "robots.txt").write_text("User-agent: *\nDisallow: /\n", encoding="utf-8")

    llms = [f"# The First Seven Years", "",
            "> Expert answers for parents of children aged 0–7, from the podcast and video series hosted by Dr. Murray Clarke with co-host Bryce Wylde. Educational content, not medical advice. Each answer names the expert, shows publish and review dates, and links to the source video.", "",
            "## Parent answers"] + [f"- [{a['q']}]({SITE}{ans_url(a)}): {a['quick']}" for a in ANSWERS] + ["", "## Topics"] + \
           [f"- [{t[1]}]({SITE}{topic_url(t[0])}): {t[4]}" for t in TOPICS] + ["", "## Experts"] + \
           [f"- [{x['name']}]({SITE}{expert_url(s)}): {x['short']}" for s, x in EXPERTS.items()] + ["", "## Full episodes"] + \
           [f"- [{e['title']}]({SITE}{ep_url(e)}): {ep_desc(e)}" for e in EP_FULL.values()] + ["", "## Frequently Asked Questions"] + \
           [f"- [{f['question']}]({SITE}/faq/): {f['answer']}" for f in FAQS] + ["", "## About", f"- [Editorial standards & disclosure]({SITE}/about/)", f"- [Ask the Doctor]({SITE}/ask-the-doctor/)"]
    (ROOT / "llms.txt").write_text("\n".join(llms) + "\n", encoding="utf-8")

    fav = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="14" fill="#2b3c56"/>' + \
          "".join(f'<rect x="{9 + i*6.6:.1f}" y="44" width="4.6" height="4.6" rx="1" fill="#a6d6b0"/>' for i in range(7)) + \
          '<text x="32" y="37" font-family="Georgia,serif" font-weight="700" font-size="30" fill="#eaf8ef" text-anchor="middle">7</text></svg>'
    (ROOT / "assets/img/favicon.svg").write_text(fav, encoding="utf-8")

def build_login():
    login_src = ROOT.parent / "login-prototype.html"
    if not login_src.exists():
        login_src = ROOT / "admin" / "login" / "index.html"
    if login_src.exists():
        c = login_src.read_text(encoding="utf-8")
        out1 = ROOT / "login" / "index.html"
        out1.parent.mkdir(parents=True, exist_ok=True)
        out1.write_text(c, encoding="utf-8")
        out2 = ROOT / "admin" / "login" / "index.html"
        out2.parent.mkdir(parents=True, exist_ok=True)
        out2.write_text(c, encoding="utf-8")

if __name__ == "__main__":
    build_home(); build_topics(); build_answers(); build_episodes(); build_experts()
    build_ask(); build_about(); build_book(); build_faqs(); build_search(); build_pages(); build_meta(); build_login()
    print(f"Built {len(SITEMAP)} pages -> {ROOT}")

