/* 아바타 포토부스 스티커 그림 (오행 5색 × 아이템 6종 + 오행 아이콘 5종). 전부 코드로 그린 벡터라 이미지 파일이 없어요. */
(function () {
const EL={
 목:{n:'목',m:'#7ED36B',s:'#4FAE4F',d:'#2F7D3A',l:'#D7F7C2',h:'#F3FFE9',gem:'#FF8FB1'},
 화:{n:'화',m:'#FF7F5C',s:'#E6523A',d:'#A82B1C',l:'#FFD9B8',h:'#FFF0E3',gem:'#FFD65C'},
 토:{n:'토',m:'#FFE81A',s:'#FFCB00',d:'#D98A00',l:'#FFF87A',h:'#FFFEDC',gem:'#FF6FA3'},
 금:{n:'금',m:'#FFFFFF',s:'#EEF0F5',d:'#98A1B3',l:'#FFFFFF',h:'#FFFFFF',gem:'#FFD65C'},
 수:{n:'수',m:'#4A505C',s:'#2E323B',d:'#111216',l:'#8E95A5',h:'#D5D9E3',gem:'#7FD0FF'}};
const star=(cx,cy,R,r)=>{let p=[];for(let i=0;i<10;i++){const a=-Math.PI/2+i*Math.PI/5,k=i%2?r:R;p.push((cx+k*Math.cos(a)).toFixed(1)+','+(cy+k*Math.sin(a)).toFixed(1))}return p.join(' ')};
const LG=(id,st,x2=0,y2=1)=>`<linearGradient id="${id}" x1="0" y1="0" x2="${x2}" y2="${y2}">${st.map(([o,c])=>`<stop offset="${o}" stop-color="${c}"/>`).join('')}</linearGradient>`;
const RG=(id,st,cx=.35,cy=.3,r=.75)=>`<radialGradient id="${id}" cx="${cx}" cy="${cy}" r="${r}">${st.map(([o,c])=>`<stop offset="${o}" stop-color="${c}"/>`).join('')}</radialGradient>`;
const SP=(x,y,r,f='#fff',s='#F2C94C')=>`<path d="M${x} ${y-r}Q${x} ${y} ${x+r} ${y}Q${x} ${y} ${x} ${y+r}Q${x} ${y} ${x-r} ${y}Q${x} ${y} ${x} ${y-r}Z" fill="${f}" stroke="${s}" stroke-width="2.5" stroke-linejoin="round"/>`;
const GOLD=LG('gold',[[0,'#FFF1B0'],[.5,'#F2C94C'],[1,'#C48A1E']]);
const pearl=(x,y,r,c)=>`<circle cx="${x}" cy="${y}" r="${r}" fill="url(#pearl)" stroke="${c.d}" stroke-width="3"/><ellipse cx="${x-r*.3}" cy="${y-r*.35}" rx="${r*.28}" ry="${r*.18}" fill="#fff" opacity=".95"/>`;
const PEARL=c=>RG('pearl',[[0,'#fff'],[.6,c.l],[1,c.m]]);
const ART={
 hairpin:c=>`<defs>${GOLD}${LG('pt',[[0,c.h],[.45,c.l],[1,c.m]])}${PEARL(c)}${RG('ctr',[[0,'#FFF7C9'],[.7,c.gem==='#FFD65C'?'#F2C94C':'#FFD65C'],[1,'#C48A1E']])}</defs>
  <g transform="translate(0 -12)"><path d="M34 148Q34 140 42 140H158Q166 140 166 148Q166 156 158 156H42Q34 156 34 148Z" fill="url(#gold)" stroke="#A5761E" stroke-width="4"/>
  <path d="M46 146H154" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity=".7"/>
  <circle cx="52" cy="148" r="3" fill="#C48A1E"/><circle cx="148" cy="148" r="3" fill="#C48A1E"/></g>
  <path d="M100 116C84 120 66 112 62 98C80 92 98 102 100 116Z" fill="${c.s}" stroke="${c.d}" stroke-width="4" stroke-linejoin="round"/>
  <path d="M100 116C116 120 134 112 138 98C120 92 102 102 100 116Z" fill="${c.s}" stroke="${c.d}" stroke-width="4" stroke-linejoin="round"/>
  ${[0,72,144,216,288].map(a=>`<g transform="rotate(${a} 100 86)"><path d="M100 60C78 44 82 20 100 16C118 20 122 44 100 60Z" transform="translate(0 22)" fill="url(#pt)" stroke="${c.d}" stroke-width="4" stroke-linejoin="round"/><path d="M100 50C96 40 96 30 100 24" stroke="${c.s}" stroke-width="3" fill="none" stroke-linecap="round" opacity=".55" transform="translate(0 22)"/><ellipse cx="92" cy="36" rx="4" ry="9" fill="#fff" opacity=".65" transform="rotate(-18 92 36) translate(0 22)"/></g>`).join('')}
  <circle cx="100" cy="86" r="17" fill="url(#ctr)" stroke="#A5761E" stroke-width="4"/>
  <ellipse cx="94" cy="79" rx="6" ry="4" fill="#fff" opacity=".9"/>
  ${SP(30,60,9)}${SP(172,40,8)}${SP(176,118,6)}`,
 wand:c=>`<defs>${GOLD}${LG('sg',[[0,c.h],[.35,c.l],[.75,c.m],[1,c.s]])}${LG('sk',[[0,c.l],[1,c.s]],1,0)}${PEARL(c)}${RG('gm',[[0,'#fff'],[.45,c.gem],[1,c.d]])}</defs>
  <line x1="50" y1="168" x2="116" y2="92" stroke="${c.d}" stroke-width="14" stroke-linecap="round"/>
  <line x1="50" y1="168" x2="116" y2="92" stroke="url(#sk)" stroke-width="8" stroke-linecap="round"/>
  <line x1="50" y1="168" x2="116" y2="92" stroke="#fff" stroke-width="3.5" stroke-linecap="butt" stroke-dasharray="5 11" opacity=".9"/>
  ${pearl(44,174,12,c)}
  <path d="M108 100C92 96 84 110 90 120C98 112 104 108 108 100Z" fill="url(#gold)" stroke="#A5761E" stroke-width="3" stroke-linejoin="round"/>
  <path d="M112 98C128 104 138 116 130 124C122 118 114 108 112 98Z" fill="url(#gold)" stroke="#A5761E" stroke-width="3" stroke-linejoin="round"/>
  <polygon points="${star(136,60,48,22)}" fill="url(#sg)" stroke="${c.d}" stroke-width="5" stroke-linejoin="round"/>
  <polygon points="${star(136,60,28,13)}" fill="${c.h}" opacity=".85" stroke="${c.s}" stroke-width="2" stroke-linejoin="round"/>
  <circle cx="136" cy="62" r="9" fill="url(#gm)" stroke="${c.d}" stroke-width="3"/><ellipse cx="133" cy="58" rx="3.2" ry="2" fill="#fff"/>
  ${SP(176,112,12)}${SP(80,44,10)}${SP(178,22,8)}${SP(100,150,7)}`,
 beanie:c=>`<defs><clipPath id="dome"><path d="M40 128C34 56 166 56 160 128Z"/></clipPath>${LG('bd',[[0,c.l],[.5,c.m],[1,c.s]])}${LG('br',[[0,c.h],[.5,c.l],[1,c.m]])}${RG('pf',[[0,'#fff'],[.7,c.l],[1,c.m]])}</defs>
  <path d="M40 128C34 56 166 56 160 128Z" fill="url(#bd)" stroke="${c.d}" stroke-width="5" stroke-linejoin="round"/>
  <g clip-path="url(#dome)"><rect x="20" y="92" width="170" height="11" fill="${c.h}" opacity=".85"/><rect x="20" y="106" width="170" height="5" fill="${c.d}" opacity=".25"/>
  ${[[100,60,100,128],[100,60,78,128],[100,60,56,128],[100,60,122,128],[100,60,144,128]].map(([a,b,x,y])=>`<path d="M${a} ${b}C${a-(a-x)*.2} ${b+30} ${x+(a-x)*.1} ${y-30} ${x} ${y}" stroke="${c.d}" stroke-width="3.2" fill="none" opacity=".28"/>`).join('')}
  <path d="M56 96C60 78 72 68 90 64" stroke="#fff" stroke-width="6" fill="none" stroke-linecap="round" opacity=".5"/></g>
  <g fill="${c.h}" stroke="${c.d}" stroke-width="1.5">${[0,1,2,3].map(i=>`<polygon points="${star(66+i*23,98,6,2.6)}" fill="${c.s}" stroke="none"/>`).join('')}</g>
  <rect x="30" y="112" width="140" height="38" rx="17" fill="url(#br)" stroke="${c.d}" stroke-width="5"/>
  ${Array.from({length:9},(_,i)=>`<path d="M${46+i*13.5} 118V144" stroke="${c.s}" stroke-width="4" stroke-linecap="round" opacity=".45"/>`).join('')}
  <path d="M44 120H156" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity=".7"/>
  ${[[100,50,16],[85,54,11],[115,54,11],[92,38,11],[108,38,11],[92,64,10],[108,64,10]].map(([x,y,r])=>`<circle cx="${x}" cy="${y}" r="${r}" fill="${c.l}" stroke="${c.d}" stroke-width="4"/>`).join('')}
  ${[[100,50,16],[85,54,11],[115,54,11],[92,38,11],[108,38,11],[92,64,10],[108,64,10]].map(([x,y,r])=>`<circle cx="${x}" cy="${y}" r="${r-1.5}" fill="url(#pf)"/>`).join('')}
  ${SP(30,76,9)}${SP(172,70,8)}`,
 crown:c=>`<defs>${LG('cb',[[0,c.l],[.5,c.m],[1,c.s]])}${LG('cd',[[0,c.h],[.5,c.l],[1,c.m]])}${PEARL(c)}${RG('jw',[[0,'#fff'],[.4,c.gem],[1,c.d]])}</defs>
  <path d="M38 142V72L72 104L100 56L128 104L162 72V142Z" fill="url(#cb)" stroke="${c.d}" stroke-width="5" stroke-linejoin="round"/>
  <path d="M72 104V128M100 56V128M128 104V128" stroke="${c.d}" stroke-width="3.5" opacity=".3"/>
  <path d="M50 88L50 122M84 92L90 70" stroke="#fff" stroke-width="5" stroke-linecap="round" opacity=".55"/>
  <rect x="34" y="124" width="132" height="28" rx="8" fill="url(#cd)" stroke="${c.d}" stroke-width="5"/>
  <path d="M44 130H156" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity=".7"/>
  <path d="M100 129L110 138L100 147L90 138Z" fill="url(#jw)" stroke="${c.d}" stroke-width="3" stroke-linejoin="round"/>
  <circle cx="66" cy="138" r="5.5" fill="url(#jw)" stroke="${c.d}" stroke-width="2.5"/><circle cx="134" cy="138" r="5.5" fill="url(#jw)" stroke="${c.d}" stroke-width="2.5"/>
  ${pearl(38,70,10,c)}${pearl(162,70,10,c)}${pearl(100,52,11,c)}
  ${SP(18,100,8)}${SP(184,106,9)}${SP(136,40,7)}`,
 ribbon:c=>`<defs>${LG('rl',[[0,c.l],[.5,c.m],[1,c.s]])}${LG('rt',[[0,c.m],[1,c.d]])}${LG('rk',[[0,c.h],[.5,c.l],[1,c.m]])}</defs>
  <path d="M94 108L54 136L40 178L80 152L96 126Z" fill="url(#rt)" stroke="${c.d}" stroke-width="5" stroke-linejoin="round"/>
  <path d="M106 108L146 136L160 178L120 152L104 126Z" fill="url(#rt)" stroke="${c.d}" stroke-width="5" stroke-linejoin="round"/>
  <path d="M96 94C60 46 20 54 24 96C26 134 66 134 96 104Z" fill="url(#rl)" stroke="${c.d}" stroke-width="5" stroke-linejoin="round"/>
  <path d="M104 94C140 46 180 54 176 96C174 134 134 134 104 104Z" fill="url(#rl)" stroke="${c.d}" stroke-width="5" stroke-linejoin="round"/>
  <path d="M92 98C68 84 48 88 36 102M108 98C132 84 152 88 164 102" stroke="${c.d}" stroke-width="3" fill="none" opacity=".35" stroke-linecap="round"/>
  <path d="M36 80C50 66 70 66 84 80M164 80C150 66 130 66 116 80" stroke="#fff" stroke-width="5" fill="none" stroke-linecap="round" opacity=".8"/>
  <rect x="82" y="80" width="36" height="38" rx="13" fill="url(#rk)" stroke="${c.d}" stroke-width="5"/>
  <path d="M90 90Q100 84 110 90" stroke="#fff" stroke-width="4" fill="none" stroke-linecap="round" opacity=".85"/>
  ${SP(24,48,9)}${SP(178,50,8)}`,
 glasses:c=>`<defs>${LG('ln',[[0,c.h],[.5,c.l],[1,c.m]])}${LG('fr',[[0,c.l],[1,c.s]])}</defs>
  <path d="M16 80L38 66M184 80L162 66" stroke="${c.d}" stroke-width="9" stroke-linecap="round"/><path d="M16 80L38 66M184 80L162 66" stroke="${c.m}" stroke-width="4" stroke-linecap="round"/>
  <path d="M84 102Q100 86 116 102" stroke="${c.d}" stroke-width="9" fill="none" stroke-linecap="round"/><path d="M84 102Q100 86 116 102" stroke="${c.m}" stroke-width="4" fill="none" stroke-linecap="round"/>
  ${[58,142].map(x=>`<polygon points="${star(x,106,44,19)}" fill="none" stroke="${c.d}" stroke-width="15" stroke-linejoin="round"/><polygon points="${star(x,106,44,19)}" fill="none" stroke="url(#fr)" stroke-width="9" stroke-linejoin="round"/><polygon points="${star(x,106,40,17)}" fill="url(#ln)" fill-opacity=".8"/><path d="M${x-14} ${106-18}Q${x-6} ${106-30} ${x+2} ${106-26}" stroke="#fff" stroke-width="5" fill="none" stroke-linecap="round" opacity=".9"/><circle cx="${x+10}" cy="${106+6}" r="3" fill="#fff" opacity=".8"/>`).join('')}
  ${SP(100,40,10)}${SP(24,130,8)}${SP(178,138,8)}`
};
const ITEMS=[['hairpin','머리핀'],['wand','공주 마술봉'],['beanie','겨울 모자'],['crown','왕관'],['ribbon','리본'],['glasses','별 안경']];
const ICONS={
 목:`<defs>${LG('l1',[[0,'#D7F7C2'],[.5,'#7ED36B'],[1,'#3E9A47']])}${LG('l2',[[0,'#EAFBD8'],[.5,'#9BE184'],[1,'#4FAE4F']])}${LG('so',[[0,'#D9A86B'],[1,'#9B6532']])}</defs>
  <path d="M100 170V108" stroke="#2F7D3A" stroke-width="12" stroke-linecap="round"/><path d="M100 170V108" stroke="#5EBE5E" stroke-width="6" stroke-linecap="round"/>
  <path d="M100 112C58 116 32 90 36 50C80 46 104 72 100 112Z" fill="url(#l1)" stroke="#2F7D3A" stroke-width="5" stroke-linejoin="round"/>
  <path d="M100 98C102 60 128 34 170 38C172 80 144 104 100 98Z" fill="url(#l2)" stroke="#2F7D3A" stroke-width="5" stroke-linejoin="round"/>
  <path d="M48 56C68 66 88 84 98 108M160 48C142 62 122 78 104 96" stroke="#F3FFE9" stroke-width="4" fill="none" stroke-linecap="round" opacity=".85"/>
  <path d="M58 46C70 44 80 48 86 54" stroke="#fff" stroke-width="4" fill="none" stroke-linecap="round" opacity=".6"/>
  <path d="M52 168C52 156 148 156 148 168C148 182 52 182 52 168Z" fill="url(#so)" stroke="#6E4120" stroke-width="5"/><ellipse cx="82" cy="166" rx="6" ry="3" fill="#C99455"/><ellipse cx="120" cy="170" rx="5" ry="2.5" fill="#C99455"/>
  ${SP(172,90,9)}${SP(30,100,7)}`,
 화:`<defs>${LG('f1',[[0,'#FFC857'],[.45,'#FF7F3F'],[1,'#E5402B']])}${LG('f2',[[0,'#FFF3B0'],[.5,'#FFC857'],[1,'#FF8F3A']])}</defs>
  <path d="M100 18C108 56 154 74 152 126C150 158 128 180 100 180C72 180 48 158 48 126C48 100 64 88 72 64C84 80 88 88 96 92C100 70 90 44 100 18Z" fill="url(#f1)" stroke="#B4301E" stroke-width="5" stroke-linejoin="round"/>
  <path d="M100 84C108 106 130 116 130 142C130 160 116 172 100 172C84 172 70 160 70 142C70 124 90 116 100 84Z" fill="url(#f2)" stroke="#E08A1E" stroke-width="4" stroke-linejoin="round"/>
  <path d="M100 126C106 138 114 142 114 152C114 160 108 166 100 166C92 166 86 160 86 152C86 142 94 138 100 126Z" fill="#FFFBE0"/>
  <path d="M64 120C62 106 70 94 78 84" stroke="#fff" stroke-width="5" fill="none" stroke-linecap="round" opacity=".6"/>
  ${SP(158,50,10)}${SP(36,60,8)}${SP(168,150,7)}`,
 토:`<defs>${LG('m1',[[0,'#FFFA8F'],[.5,'#FFE81A'],[1,'#FFBE00']])}${LG('m2',[[0,'#FFFDD0'],[1,'#FFF05A']])}${LG('l3',[[0,'#D7F7C2'],[1,'#5EBE5E']])}</defs>
  <path d="M24 164C34 120 68 92 100 92C132 92 166 120 176 164C176 176 24 176 24 164Z" fill="url(#m1)" stroke="#D98A00" stroke-width="5" stroke-linejoin="round"/>
  <path d="M58 164C66 140 84 124 100 124C116 124 134 140 142 164Z" fill="url(#m2)" stroke="#D98A00" stroke-width="4" stroke-linejoin="round"/>
  <path d="M100 96V60" stroke="#2F7D3A" stroke-width="7" stroke-linecap="round"/>
  <path d="M100 74C84 76 74 66 76 52C92 52 102 62 100 74Z" fill="url(#l3)" stroke="#2F7D3A" stroke-width="4" stroke-linejoin="round"/>
  <path d="M100 68C112 70 124 60 122 46C108 46 98 56 100 68Z" fill="url(#l3)" stroke="#2F7D3A" stroke-width="4" stroke-linejoin="round"/>
  <ellipse cx="50" cy="156" rx="10" ry="6" fill="#FFF05A" stroke="#D98A00" stroke-width="2.5"/><ellipse cx="148" cy="152" rx="8" ry="5" fill="#FFF05A" stroke="#D98A00" stroke-width="2.5"/>
  <path d="M46 132C56 114 70 104 84 98" stroke="#fff" stroke-width="5" fill="none" stroke-linecap="round" opacity=".7"/>
  ${SP(160,84,9)}${SP(32,96,7)}`,
 금:`<defs>${LG('g1',[[0,'#FFFFFF'],[1,'#EEF1F7']])}${LG('g2',[[0,'#F4F6FA'],[1,'#D5DAE5']])}${LG('g3',[[0,'#E6EAF1'],[1,'#BFC6D4']])}</defs>
  <polygon points="100,40 150,40 178,80 100,170 22,80 50,40" fill="url(#g1)" stroke="#8A93A6" stroke-width="5" stroke-linejoin="round"/>
  <polygon points="50,40 100,40 76,80" fill="#FFFFFF"/><polygon points="100,40 150,40 124,80" fill="#F2F4F9"/>
  <polygon points="22,80 76,80 100,170" fill="url(#g3)"/><polygon points="178,80 124,80 100,170" fill="url(#g2)"/><polygon points="76,80 124,80 100,170" fill="#EAEDF4"/>
  <path d="M22 80H178M50 40L76 80L100 40L124 80L150 40M76 80L100 170L124 80" stroke="#8A93A6" stroke-width="3" fill="none" stroke-linejoin="round"/>
  <path d="M56 52L70 52" stroke="#fff" stroke-width="5" stroke-linecap="round"/>
  ${SP(158,32,13,'#fff','#F2C94C')}${SP(32,40,9,'#fff','#F2C94C')}${SP(176,128,8,'#fff','#F2C94C')}`,
 수:`<defs>${LG('w1',[[0,'#8E95A5'],[.45,'#3A3F4B'],[1,'#14151A']])}</defs>
  <ellipse cx="100" cy="176" rx="48" ry="9" fill="#5B6170" opacity=".6" stroke="#111216" stroke-width="3"/><ellipse cx="100" cy="176" rx="26" ry="4.5" fill="none" stroke="#fff" stroke-width="2.5" opacity=".8"/>
  <path d="M100 18C100 18 154 80 154 122C154 152 130 172 100 172C70 172 46 152 46 122C46 80 100 18 100 18Z" fill="url(#w1)" stroke="#0B0B0E" stroke-width="5" stroke-linejoin="round"/>
  <path d="M70 128C68 110 78 94 88 82" stroke="#fff" stroke-width="10" stroke-linecap="round" fill="none" opacity=".8"/>
  <circle cx="82" cy="148" r="6" fill="#fff" opacity=".7"/><circle cx="130" cy="118" r="4" fill="#fff" opacity=".45"/>
  ${SP(162,60,10,'#fff','#9AA3B8')}${SP(34,90,8,'#fff','#9AA3B8')}`
};
const svgURL=(inner)=>'data:image/svg+xml;charset=utf-8,'+encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="400" height="400"><defs><filter id="st" x="-20%" y="-20%" width="140%" height="140%"><feMorphology in="SourceAlpha" operator="dilate" radius="5" result="d"/><feFlood flood-color="#fff" result="wf"/><feComposite in="wf" in2="d" operator="in" result="w"/><feGaussianBlur in="d" stdDeviation="2.5" result="bl"/><feOffset in="bl" dy="3" result="of"/><feFlood flood-color="#000" flood-opacity=".28"/><feComposite in2="of" operator="in" result="sh"/><feMerge><feMergeNode in="sh"/><feMergeNode in="w"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs><g filter="url(#st)" transform="translate(100 100) scale(.82) translate(-100 -100)">${inner}</g></svg>`);

  window.PHOTO_STICKERS = { EL, ART, ITEMS, ICONS, svgURL, star };
})();
