(function (root) {
  const STEMS = ['갑','을','병','정','무','기','경','신','임','계'];
  const BRANCHES = ['자','축','인','묘','진','사','오','미','신','유','술','해'];
  const ELEM = ['목','화','토','금','수'];
  const ANIMAL = { '자':'쥐','축':'소','인':'호랑이','묘':'토끼','진':'용','사':'뱀',
                   '오':'말','미':'양','신':'원숭이','유':'닭','술':'개','해':'돼지' };
  // 천간 물상 (이름 규칙: '{물상}의 기운을 가진 {동물}')
  const MULSANG = { '갑':'큰나무','을':'꽃','병':'태양','정':'촛불','무':'산',
                    '기':'흙','경':'강철','신':'보석','임':'바다','계':'이슬비' };
  const SIPSUNG = [['비견','겁재'],['식신','상관'],['편재','정재'],['편관','정관'],['편인','정인']];

  // 60갑자 목록 (갑자, 을축, ...)
  const GAPJA = [];
  for (let i = 0; i < 60; i++) GAPJA.push(STEMS[i % 10] + BRANCHES[i % 12]);

  // 날짜 → 일진 (1949-10-01 = 갑자일 기준)
  function dayPillar(date) {
    const d = date || new Date();
    const utc = Date.UTC(d.getFullYear(), d.getMonth(), d.getDate());
    const base = Date.UTC(1949, 9, 1);
    const idx = (((Math.round((utc - base) / 86400000)) % 60) + 60) % 60;
    return { idx, name: GAPJA[idx], stem: STEMS[idx % 10], branch: BRANCHES[idx % 12] };
  }

  // 일간 기준 오늘 천간의 십성
  function sipsung(myStem, otherStem) {
    const a = STEMS.indexOf(myStem), b = STEMS.indexOf(otherStem);
    const ea = Math.floor(a / 2), eb = Math.floor(b / 2);
    const rel = ((eb - ea) % 5 + 5) % 5;
    const same = (a % 2) === (b % 2);
    return SIPSUNG[rel][same ? 0 : 1];
  }

  function elementOf(stem) { return ELEM[Math.floor(STEMS.indexOf(stem) / 2)]; }

  function title(ilju) {
    return `${MULSANG[ilju[0]]}의 기운을 가진 ${ANIMAL[ilju[1]]}`;
  }

  root.SAJU = { STEMS, BRANCHES, GAPJA, ANIMAL, MULSANG, dayPillar, sipsung, elementOf, title };
  if (typeof module !== 'undefined') module.exports = root.SAJU;
})(typeof window !== 'undefined' ? window : globalThis);
