// 한국어 / English 공통 문구
(function (root) {
  const STEM_ROMA = { '갑':'Gap','을':'Eul','병':'Byeong','정':'Jeong','무':'Mu','기':'Gi','경':'Gyeong','신':'Sin','임':'Im','계':'Gye' };
  const BRANCH_ROMA = { '자':'ja','축':'chuk','인':'in','묘':'myo','진':'jin','사':'sa','오':'o','미':'mi','신':'sin','유':'yu','술':'sul','해':'hae' };
  const STEM_HANJA = { '갑':'甲','을':'乙','병':'丙','정':'丁','무':'戊','기':'己','경':'庚','신':'辛','임':'壬','계':'癸' };
  const BRANCH_HANJA = { '자':'子','축':'丑','인':'寅','묘':'卯','진':'辰','사':'巳','오':'午','미':'未','신':'申','유':'酉','술':'戌','해':'亥' };
  const MULSANG_EN = { '갑':'the Big Tree','을':'the Flower','병':'the Sun','정':'the Candle','무':'the Mountain','기':'the Soil','경':'Steel','신':'the Jewel','임':'the Ocean','계':'the Drizzle' };
  const MULSANG_SHORT_EN = { '갑':'tree','을':'flower','병':'sun','정':'candle','무':'mountain','기':'garden','경':'knife','신':'jewelry','임':'ocean','계':'rain' };
  const ANIMAL_EN = { '자':'Rat','축':'Ox','인':'Tiger','묘':'Rabbit','진':'Dragon','사':'Snake','오':'Horse','미':'Sheep','신':'Monkey','유':'Rooster','술':'Dog','해':'Pig' };
  const SIPSUNG_EN = { '비견':'Friend','겁재':'Rob Wealth','식신':'Eating God','상관':'Hurting Officer','편재':'Indirect Wealth','정재':'Direct Wealth','편관':'Seven Killings','정관':'Direct Officer','편인':'Indirect Resource','정인':'Direct Resource' };
  const ELEM_EN = { '목':'Wood','화':'Fire','토':'Earth','금':'Metal','수':'Water' };
  const SOUND = {
    ko: { '자':'찍찍','축':'음매','인':'어흥','묘':'깡총','진':'노라','사':'쉬익','오':'다그닥','미':'메에','신':'우끼끼','유':'꼬꼬','술':'멍','해':'꿀꿀' },
    en: { '자':'Squeak','축':'Moo','인':'Rawr','묘':'Hop','진':'','사':'Hiss','오':'Neigh','미':'Baa','신':'Ook ook','유':'Cluck','술':'Woof','해':'Oink' }
  };

  const TYPES = {"갑자": {"code": "TM", "name": "Tree Mouse", "desc": "You carry the 'Seed of Wisdom'—an adaptable energy that leads toward new beginnings."}, "갑인": {"code": "TT", "name": "Tree Tiger", "desc": "You carry 'Majestic Vitality'—a powerful energy of a leader destined to command the forest."}, "갑진": {"code": "TD", "name": "Tree Dragon", "desc": "You carry 'Visionary Growth'—a soul that manifests ambitious dreams into reality."}, "갑오": {"code": "TH", "name": "Tree Horse", "desc": "You carry 'Solar Passion'—a vibrant energy that spreads warmth and light wherever you run."}, "갑신": {"code": "TY", "name": "Tree Monkey", "desc": "You carry 'Ingenious Resilience'—a sharp soul that masters any craft and innovates new paths."}, "갑술": {"code": "TG", "name": "Tree Dog", "desc": "You carry 'Protective Strength'—a loyal energy that builds lasting empires through trust."}, "을축": {"code": "FC", "name": "Flower Cow", "desc": "You carry 'Graceful Resilience'—a soul that blooms beautifully in the toughest conditions."}, "을묘": {"code": "FR", "name": "Flower Rabbit", "desc": "You carry 'Pure Life Force'—a vibrant energy that brings harmony to the world like a lush garden."}, "을사": {"code": "FE", "name": "Flower Snake", "desc": "You carry 'Magnetic Charm'—an artistic presence that dazzles the world with unique talent."}, "을미": {"code": "FS", "name": "Flower Sheep", "desc": "You carry 'Enduring Beauty'—a soul that thrives and finds hidden treasures in any landscape."}, "을유": {"code": "FN", "name": "Flower Chicken", "desc": "You carry 'Refined Precision'—a soul that values elegance and polishes itself until it shines."}, "을해": {"code": "FP", "name": "Flower Pig", "desc": "You carry 'Oceanic Compassion'—a deep, wise soul that heals the world with its gentle spirit."}, "병자": {"code": "SM", "name": "Sun Mouse", "desc": "You carry 'Radiant Clarity'—a soul that shines in the dark, bringing hope and brilliance."}, "병인": {"code": "ST", "name": "Sun Tiger", "desc": "You carry the 'Magnetic Glow'—a natural 'Main Character Energy' that attracts success like a magnet."}, "병진": {"code": "SD", "name": "Sun Dragon", "desc": "You carry 'Empire Builder' energy—a soul destined for greatness and abundance."}, "병오": {"code": "SH", "name": "Sun Horse", "desc": "You carry 'The Peak of Passion'—an unstoppable force that dominates any stage with its presence."}, "병신": {"code": "SY", "name": "Sun Monkey", "desc": "You carry 'Brilliant Alchemy'—a genius energy that transforms ideas into golden opportunities."}, "병술": {"code": "SG", "name": "Sun Dog", "desc": "You carry 'Guardian Light'—a loyal energy that preserves value and truth with courage."}, "정축": {"code": "CC", "name": "Candle Cow", "desc": "You carry 'Hidden Warmth'—a soul that holds creative secrets, waiting for the perfect moment to glow."}, "정묘": {"code": "CR", "name": "Candle Rabbit", "desc": "You carry 'Mystic Sensitivity'—a soul with deep artistic intuition and a connection to dreams."}, "정사": {"code": "CE", "name": "Candle Snake", "desc": "You carry 'Intense Brilliance'—a charismatic presence that commands absolute attention."}, "정미": {"code": "CS", "name": "Candle Sheep", "desc": "You carry 'Comforting Warmth'—a soul that provides stability through deep kindness."}, "정유": {"code": "CN", "name": "Candle Chicken", "desc": "You carry 'Elegant Glow'—a soul that attracts wealth and refined opportunities."}, "정해": {"code": "CP", "name": "Candle Pig", "desc": "You carry 'Oceanic Wisdom'—a deeply wise soul that flows with peace and intuition."}, "무자": {"code": "MM", "name": "Mountain Mouse", "desc": "You carry 'Vast Potential'—a soul that naturally attracts and preserves wealth."}, "무인": {"code": "MT", "name": "Mountain Tiger", "desc": "You carry 'Majestic Authority'—a powerful presence that stands tall like a mountain peak."}, "무진": {"code": "MD", "name": "Mountain Dragon", "desc": "You carry 'Infinite Endurance'—a soul capable of moving mountains for its goals."}, "무오": {"code": "MH", "name": "Mountain Horse", "desc": "You carry 'Volcanic Passion'—a soul that burns with intensity and charisma."}, "무신": {"code": "MY", "name": "Mountain Monkey", "desc": "You carry 'Unshakable Talent'—a soul that masters technology with stability."}, "무술": {"code": "MG", "name": "Mountain Dog", "desc": "You carry 'The Eternal Guardian'—a powerful soul that protects its kingdom."}, "기축": {"code": "GC", "name": "Garden Cow", "desc": "You carry 'Patient Harvest'—a soul that turns labor into a lush garden of abundance."}, "기묘": {"code": "GR", "name": "Garden Rabbit", "desc": "You carry 'Gentle Harmony'—a soul that brings beauty and peace wherever it goes."}, "기사": {"code": "GE", "name": "Garden Snake", "desc": "You carry 'Elegant Insight'—a brilliant mind that achieves fame with refined talent."}, "기미": {"code": "GS", "name": "Garden Sheep", "desc": "You carry 'Grounded Comfort'—providing stability through deep kindness."}, "기유": {"code": "GN", "name": "Garden Chicken", "desc": "You carry 'Pure Perfection'—shining with an elegant and clean light."}, "기해": {"code": "GP", "name": "Garden Pig", "desc": "You carry 'Flowing Abundance'—a wise soul that naturally attracts wealth and peace."}, "경자": {"code": "KM", "name": "Knife Mouse", "desc": "You carry 'Sharp Intellect'—a razor-sharp mind with a flow of wisdom."}, "경인": {"code": "KT", "name": "Knife Tiger", "desc": "You carry 'Sovereign Authority'—a fierce and noble soul that commands respect."}, "경진": {"code": "KD", "name": "Knife Dragon", "desc": "You carry 'Invincible Will'—destined for legendary success through unyielding strength."}, "경오": {"code": "KH", "name": "Knife Horse", "desc": "You carry 'Noble Spirit'—an elegant soul driven by justice and beauty."}, "경신": {"code": "KY", "name": "Knife Monkey", "desc": "You carry 'Absolute Power'—dominating any field with its razor edge."}, "경술": {"code": "KG", "name": "Knife Dog", "desc": "You carry 'Loyal Steel'—fierce, honest, and building trust."}, "신축": {"code": "JC", "name": "Jewelry Cow", "desc": "You carry 'Frozen Treasure'—holding immense value and blooming through persistence."}, "신묘": {"code": "JR", "name": "Jewelry Rabbit", "desc": "You carry 'Elegant Edge'—sharp artistic intuition and a resilient nature."}, "신사": {"code": "JE", "name": "Jewelry Snake", "desc": "You carry 'Refined Charisma'—shining bright on any social or creative stage."}, "신미": {"code": "JS", "name": "Jewelry Sheep", "desc": "You carry 'Grounded Elegance'—shining with a warm and refined light."}, "신유": {"code": "JN", "name": "Jewelry Chicken", "desc": "You carry 'The Purest Gem'—attracting beauty and status with clarity."}, "신해": {"code": "JP", "name": "Jewelry Pig", "desc": "You carry 'Mystic Reflection'—artistic genius glowing with profound light."}, "임자": {"code": "OM", "name": "Ocean Mouse", "desc": "You carry 'Primal Wisdom'—flowing with the force of the deep sea."}, "임인": {"code": "OT", "name": "Ocean Tiger", "desc": "You carry 'Global Vision'—adventurous, traveling oceans to lead and innovate."}, "임진": {"code": "OD", "name": "Ocean Dragon", "desc": "You carry 'Abyssal Power'—manifesting vast luck from the depths."}, "임오": {"code": "OH", "name": "Ocean Horse", "desc": "You carry 'Passionate Flow'—achieving goals with dynamic energy."}, "임신": {"code": "OY", "name": "Ocean Monkey", "desc": "You carry 'Infinite Mind'—mastering the secrets of the universe."}, "임술": {"code": "OG", "name": "Ocean Dog", "desc": "You carry 'Steadfast Depth'—protective within its calm nature."}, "계축": {"code": "RC", "name": "Rain Cow", "desc": "You carry 'Quiet Resilience'—waiting for the perfect time to shine."}, "계묘": {"code": "RR", "name": "Rain Rabbit", "desc": "You carry 'Purest Grace'—bringing luck and beauty like morning rain."}, "계사": {"code": "RE", "name": "Rain Snake", "desc": "You carry 'Radiant Insight'—uncovering secrets with noble light."}, "계미": {"code": "RS", "name": "Rain Sheep", "desc": "You carry 'Patient Growth'—nurturing others through kindness."}, "계유": {"code": "RN", "name": "Rain Chicken", "desc": "You carry 'Refined Intuition'—shining with a clean spiritual light."}, "계해": {"code": "RP", "name": "Rain Pig", "desc": "You carry 'Infinite Ocean'—flowing with life's deepest mysteries."}};
  const COMMON = {
    ko: ['다 잘될거야', '잘하고 있어. 오늘도 힘내', '행운 부르기!!'],
    en: ["Everything's gonna be okay", "You're doing great. Keep it up today!", 'Summoning good luck!!']
  };

  function iljuName(ilju, lang) {
    return lang === 'en' ? `${STEM_ROMA[ilju[0]]}-${BRANCH_ROMA[ilju[1]]}` : ilju;
  }
  function avatarName(ilju, lang) { return lang === 'en' ? `${TYPES[ilju].code} Type` : ilju; }
  function typeDesc(ilju) { return TYPES[ilju].desc; }
  function iljuHanja(ilju) { return STEM_HANJA[ilju[0]] + BRANCH_HANJA[ilju[1]]; }
  function title(ilju, lang) {
    if (lang === 'en') return TYPES[ilju].name;
    return root.SAJU.title(ilju);
  }
  function sip(name, lang) { return lang === 'en' ? SIPSUNG_EN[name] : name; }
  function elem(name, lang) { return lang === 'en' ? ELEM_EN[name] : name; }
  function dayName(day, lang) { return lang === 'en' ? `${iljuName(day.name, 'en')} day` : `${day.name}일`; }

  function reactions(ilju, lang) {
    const s = SOUND[lang][ilju[1]];
    let r;
    if (ilju[1] === '진') {
      r = lang === 'en'
        ? ['That tickles, We decree!', 'Do not poke Us so lightly.', 'We grant you today\'s energy.', 'Staring at Us instead of working?']
        : ['간지럽노라!', '짐을 함부로 누르지 말라', '오늘의 기운을 하사하노라', '일은 안 하고 짐만 보는구나'];
    } else if (lang === 'en') {
      r = [`That tickles! ${s}!`, `You poked me again… ${s}`, `Sharing today's energy with you. ${s}`, `Not working? ${s}`, `Hands off my ${MULSANG_SHORT_EN[ilju[0]]}! ${s}!`];
    } else {
      r = [`간지럽다 ${s}!`, `또 눌렀다 ${s}…`, `오늘 기운 나눠줄게 ${s}`, `일 안 하고 뭐함? ${s}`, `${root.SAJU.MULSANG[ilju[0]]} 만지지 마라 ${s}!`];
    }
    return r.concat(COMMON[lang]);
  }

  const UI = {
    ko: {
      loading: '오늘의 기운을 모으는 중…',
      dayTag: (d, day, s, e) => `${d.getMonth()+1}/${d.getDate()} ${day.name}일 · <b>${s}</b>(${e}) 날`,
      seasonEnd: (season, snd) => `${season} 끝! 다음 시즌은 인스타에서 받아가라 ${snd}~`,
      seasonNotice: (app) => `${app} 공지`,
      seasonCta: '인스타그램에서 다음 시즌 받기 →',
      // 일주 선택 창
      setupTitle: '나의 일주를 골라주세요',
      setupSub: '나의 일주 아바타가 바탕화면에 살면서 매일 그날의 기운을 알려줘요. 내 일주를 모르면?',
      setupFind: '사이트에서 찾아보기',
      search: '일주 검색 (예: 병인)',
      all: '전체',
      stemGroup: (s) => ({ '갑':'갑목','을':'을목','병':'병화','정':'정화','무':'무토','기':'기토','경':'경금','신':'신금','임':'임수','계':'계수' })[s] + ' 일간',
      stemTab: (s) => ({ '갑':'갑목','을':'을목','병':'병화','정':'정화','무':'무토','기':'기토','경':'경금','신':'신금','임':'임수','계':'계수' })[s] + ' 일간',
      noPick: '아직 고르지 않았어요',
      picked: (g, t) => `선택한 일주 <b>${g}</b> · ${t}`,
      autostart: '컴퓨터 켤 때 자동 실행',
      start: '시작하기',
      empty: '찾는 일주가 없어요. 두 글자로 입력해 보세요 (예: 병인)'
    },
    en: {
      loading: "Gathering today's energy…",
      dayTag: (d, day, s, e) => `${d.getMonth()+1}/${d.getDate()} ${iljuName(day.name, 'en')} day · <b>${s}</b> (${e})`,
      seasonEnd: (season, snd) => `${season === '시즌1' ? 'Season 1' : season} is over! Get the next season on Instagram ${snd}~`,
      seasonNotice: () => 'Mat Space Ilju Avatar notice',
      seasonCta: 'Get the next season on Instagram →',
      setupTitle: 'Choose your Ilju (Day Pillar)',
      setupSub: 'Your Ilju avatar lives on your desktop and tells you the energy of each day. Don\'t know your Ilju?',
      setupFind: 'Find it on our site',
      search: 'Search (e.g. ST, Sun Tiger, Tiger)',
      all: 'All',
      stemGroup: (s) => ({ '갑':'T · Tree','을':'F · Flower','병':'S · Sun','정':'C · Candle','무':'M · Mountain','기':'G · Garden','경':'K · Knife','신':'J · Jewelry','임':'O · Ocean','계':'R · Rain' })[s] + ` (${STEM_ROMA[s]} ${STEM_HANJA[s]})`,
      stemTab: (s) => ({ '갑':'Tree','을':'Flower','병':'Sun','정':'Candle','무':'Mountain','기':'Garden','경':'Knife','신':'Jewelry','임':'Ocean','계':'Rain' })[s],
      noPick: 'Nothing chosen yet',
      picked: (g, t) => `Your Ilju <b>${g}</b> · ${t}`,
      autostart: 'Launch at startup',
      start: 'Start',
      empty: 'No match. Try a type like ST or an animal like Tiger.'
    }
  };

  root.I18N = { TYPES, avatarName, typeDesc, UI, SOUND, COMMON, iljuName, iljuHanja, title, sip, elem, dayName, reactions, ANIMAL_EN, MULSANG_EN, SIPSUNG_EN, ELEM_EN };
})(typeof window !== 'undefined' ? window : globalThis);
