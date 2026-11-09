/* 아바타 포토부스 — 사진을 아바타 얼굴 프레임(동그라미)에 넣고 저장. 모든 처리는 브라우저 안에서만, 서버 전송 없음. */
(function () {
  const $ = s => document.querySelector(s);
  const lang = () => (window.MATSPACE_LANG ? window.MATSPACE_LANG() : "ko");
  const tr = (ko, en) => (lang() === "en" ? en : ko);
  const canvas = $("#stage"), ctx = canvas.getContext("2d"), grab = $("#grab");
  const temp = document.createElement("canvas");
  const video = document.createElement("video"); video.setAttribute("playsinline", ""); video.muted = true;
  const AV = window.PHOTO_AVATARS;
  const q0 = new URLSearchParams(location.search).get("ilju");
  const S = { key: AV[q0] ? q0 : Object.keys(AV)[0], avatar: null, base: [.5, .5, .15], face: { cx: .5, cy: .5, r: .15 },
    photo: null, live: false, stream: null, facing: "user", mirror: false, zoom: 1, rot: 0, ox: 0, oy: 0, mode: "photo", hintKey: null };

  const HINTS = {
    pick: ["사진을 찍거나 앨범에서 골라 주세요.", "Take a photo or choose one from your album."],
    adjust: ["사진을 드래그해서 얼굴을 맞추고, 두 손가락으로 크기·기울기를 조절하세요. (슬라이더도 가능)", "Drag to fit the face. Pinch to resize and twist to rotate (sliders work too)."],
    live: ["얼굴을 동그라미 안에 맞춘 뒤 ‘촬영하기’를 눌러 주세요.", "Fit the face inside the circle, then tap “Take photo”."],
    frame: ["프레임을 드래그해서 아바타 얼굴 위치에 맞춰 보세요.", "Drag the frame to match the avatar’s face."],
    nocam: ["카메라를 쓸 수 없어요. ‘앨범에서 고르기’로 사진을 선택해 주세요.", "Camera isn’t available. Please use “Choose from album”."],
    needPhoto: ["먼저 사진을 찍거나 골라 주세요.", "Please take or choose a photo first."]
  };
  const setHint = k => { S.hintKey = k; $("#hint").textContent = tr(...HINTS[k]); };

  function loadAvatar(k) {
    S.key = k; const info = AV[k], im = new Image();
    im.onload = () => {
      S.avatar = im; S.base = info.face.slice(); S.face = { cx: info.face[0], cy: info.face[1], r: info.face[2] };
      $("#frameSize").value = 1; $("#frameVal").textContent = "100%";
      canvas.width = 720; canvas.height = Math.round(720 * im.naturalHeight / im.naturalWidth);
      S.front = null; draw();
      if (info.front) { const fr = new Image(); fr.onload = () => { if (S.key === k) { S.front = fr; draw(); } }; fr.src = info.front; }
    };
    im.src = info.src;
  }

  const sizeOf = s => [s.videoWidth || s.naturalWidth || s.width, s.videoHeight || s.naturalHeight || s.height];
  function clampPan(W, f) {
    const src = S.live ? video : S.photo; if (!src) return; const [sw, sh] = sizeOf(src); if (!sw) return;
    const d = 2 * f.r * W, k = Math.max(d / sw, d / sh) * S.zoom;
    const mx = Math.max(0, (sw * k / 2 - d / 2) / d), my = Math.max(0, (sh * k / 2 - d / 2) / d);
    // 회전한 사진 기준(사진 좌표계)으로 이동 범위를 제한 → 돌려도 동그라미 안이 비지 않음
    const a = S.rot * Math.PI / 180, ca = Math.cos(a), sa = Math.sin(a);
    let lx = S.ox * ca + S.oy * sa, ly = -S.ox * sa + S.oy * ca;
    lx = Math.min(mx, Math.max(-mx, lx)); ly = Math.min(my, Math.max(-my, ly));
    S.ox = lx * ca - ly * sa; S.oy = lx * sa + ly * ca;
  }
  function render(c, W, H, editor, noPhoto) {
    c.fillStyle = "#fff"; c.fillRect(0, 0, W, H);
    if (S.avatar) c.drawImage(S.avatar, 0, 0, W, H);
    const f = S.face, cx = f.cx * W, cy = f.cy * H, r = f.r * W;
    const src = noPhoto ? null : (S.live ? video : S.photo), [sw, sh] = src ? sizeOf(src) : [0, 0];
    if (src && sw) {
      clampPan(W, f);
      if (temp.width !== W || temp.height !== H) { temp.width = W; temp.height = H; }
      const t = temp.getContext("2d"); t.setTransform(1, 0, 0, 1, 0, 0); t.globalCompositeOperation = "source-over"; t.clearRect(0, 0, W, H);
      const d = 2 * r, k = Math.max(d / sw, d / sh) * S.zoom, dw = sw * k, dh = sh * k;
      t.save(); t.translate(cx + S.ox * d, cy + S.oy * d); t.rotate(S.rot * Math.PI / 180); if (S.mirror) t.scale(-1, 1); t.drawImage(src, -dw / 2, -dh / 2, dw, dh); t.restore();
      t.globalCompositeOperation = "destination-in";
      const g = t.createRadialGradient(cx, cy, r * .93, cx, cy, r); g.addColorStop(0, "rgba(0,0,0,1)"); g.addColorStop(1, "rgba(0,0,0,0)");
      t.fillStyle = g; t.fillRect(0, 0, W, H); t.globalCompositeOperation = "source-over";
      c.drawImage(temp, 0, 0);
      c.beginPath(); c.arc(cx, cy, r * .985, 0, Math.PI * 2); c.strokeStyle = "rgba(80,60,45,.28)"; c.lineWidth = Math.max(1.5, r * .025); c.stroke();
    } else if (editor) {
      c.beginPath(); c.arc(cx, cy, r, 0, Math.PI * 2); c.fillStyle = "rgba(255,255,255,.82)"; c.fill();
      c.setLineDash([r * .12, r * .09]); c.lineWidth = Math.max(2, r * .05); c.strokeStyle = "#151515"; c.stroke(); c.setLineDash([]);
      c.fillStyle = "#151515"; c.font = "800 " + Math.round(r * .3) + "px NanumSquareRound, sans-serif"; c.textAlign = "center"; c.textBaseline = "middle";
      c.fillText(tr("얼굴 자리", "Face here"), cx, cy);
    }
    if (S.front) c.drawImage(S.front, 0, 0, W, H);   // 앞에 있는 물체(나무 기둥 등)는 사진 위로 다시 덮기
    if (editor && S.mode === "frame") {
      c.beginPath(); c.arc(cx, cy, r, 0, Math.PI * 2); c.setLineDash([r * .14, r * .1]);
      c.lineWidth = Math.max(2.5, r * .05); c.strokeStyle = "#151515"; c.stroke(); c.lineWidth = Math.max(1, r * .02); c.strokeStyle = "#FFFF00"; c.stroke(); c.setLineDash([]);
    }
  }
  function placeGrab() {
    const k = canvas.clientWidth / canvas.width, f = S.face, r = f.r * canvas.width * k;
    grab.style.left = (canvas.offsetLeft + f.cx * canvas.width * k - r) + "px";
    grab.style.top = (canvas.offsetTop + f.cy * canvas.height * k - r) + "px";
    grab.style.width = grab.style.height = (2 * r) + "px";
  }
  const draw = () => { render(ctx, canvas.width, canvas.height, true); placeGrab(); };
  window.addEventListener("resize", placeGrab);
  let raf = 0;
  function loop() { cancelAnimationFrame(raf); const step = () => { draw(); if (S.live) raf = requestAnimationFrame(step); }; step(); }
  function showButtons() { $("#btnsIdle").hidden = S.live || !!S.photo; $("#btnsLive").hidden = !S.live; $("#btnsDone").hidden = S.live || !S.photo; }
  const resetZoom = () => { S.zoom = 1; S.rot = 0; S.ox = 0; S.oy = 0; $("#zoom").value = 1; $("#zoomVal").textContent = "100%"; $("#rot").value = 0; $("#rotVal").textContent = "0°"; };

  function stopCam() { if (S.stream) S.stream.getTracks().forEach(t => t.stop()); S.stream = null; S.live = false; video.srcObject = null; }
  async function startCam() {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) { setHint("nocam"); $("#fileCam").click(); return; }
    stopCam();
    try {
      S.stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: S.facing, width: { ideal: 1280 }, height: { ideal: 1280 } }, audio: false });
      video.srcObject = S.stream; await video.play();
      S.live = true; S.photo = null; S.mirror = S.facing === "user"; resetZoom(); showButtons(); setHint("live"); loop();
    } catch (e) { stopCam(); showButtons(); setHint("nocam"); draw(); }
  }
  function shoot() {
    if (!S.live || !video.videoWidth) return;
    const c = document.createElement("canvas"); c.width = video.videoWidth; c.height = video.videoHeight; c.getContext("2d").drawImage(video, 0, 0);
    const m = S.mirror; stopCam(); S.photo = c; S.mirror = m; showButtons(); setHint("adjust"); draw();
  }
  async function useFile(file) {
    if (!file) return; stopCam(); let bmp = null;
    try { bmp = await createImageBitmap(file, { imageOrientation: "from-image" }); } catch (e) {}
    if (!bmp) bmp = await new Promise(res => { const im = new Image(); im.onload = () => res(im); im.onerror = () => res(null); im.src = URL.createObjectURL(file); });
    if (!bmp) return; S.photo = bmp; S.mirror = false; resetZoom(); showButtons(); setHint("adjust"); draw();
  }

  $("#btnCam").onclick = startCam;
  $("#btnFlip").onclick = () => { S.facing = S.facing === "user" ? "environment" : "user"; startCam(); };
  $("#btnOff").onclick = () => { stopCam(); showButtons(); setHint("pick"); draw(); };
  $("#btnShot").onclick = shoot;
  $("#btnFile").onclick = $("#btnFile2").onclick = () => $("#file").click();
  $("#btnRetake").onclick = () => { S.photo = null; showButtons(); startCam(); };
  $("#file").onchange = e => { useFile(e.target.files[0]); e.target.value = ""; };
  $("#fileCam").onchange = e => { useFile(e.target.files[0]); e.target.value = ""; };

  function setMode(m) {
    S.mode = m; $("#modePhoto").classList.toggle("on", m === "photo"); $("#modeFrame").classList.toggle("on", m === "frame");
    $("#rowZoom").hidden = m !== "photo"; $("#rowRot").hidden = m !== "photo"; $("#rowFrame").hidden = m !== "frame";
    setHint(m === "frame" ? "frame" : (S.photo ? "adjust" : S.live ? "live" : "pick")); draw();
  }
  $("#modePhoto").onclick = () => setMode("photo"); $("#modeFrame").onclick = () => setMode("frame");
  const setZoom = z => { S.zoom = Math.min(3, Math.max(1, z)); $("#zoom").value = S.zoom; $("#zoomVal").textContent = Math.round(S.zoom * 100) + "%"; };
  const setFrameScale = v => { v = Math.min(1.8, Math.max(.6, v)); S.face.r = S.base[2] * v; $("#frameSize").value = v; $("#frameVal").textContent = Math.round(v * 100) + "%"; };
  const setRot = v => { v = Math.round(Math.max(-180, Math.min(180, v))); S.rot = v; $("#rot").value = v; $("#rotVal").textContent = v + "°"; };
  const normRot = v => { v = ((v + 180) % 360 + 360) % 360 - 180; return v; };
  $("#rot").oninput = e => { setRot(+e.target.value); draw(); };
  $("#rotL").onclick = () => { setRot(normRot(S.rot - 90)); draw(); };
  $("#rotR").onclick = () => { setRot(normRot(S.rot + 90)); draw(); };
  $("#rotReset").onclick = () => { setRot(0); draw(); };
  $("#zoom").oninput = e => { setZoom(+e.target.value); draw(); };
  $("#frameSize").oninput = e => { setFrameScale(+e.target.value); draw(); };
  $("#frameReset").onclick = () => { S.face = { cx: S.base[0], cy: S.base[1], r: S.base[2] }; setFrameScale(1); draw(); };

  const ptrs = new Map(); let p0 = null;
  const dist = () => { const [a, b] = [...ptrs.values()]; return Math.hypot(a.x - b.x, a.y - b.y); };
  const ang = () => { const [a, b] = [...ptrs.values()]; return Math.atan2(b.y - a.y, b.x - a.x) * 180 / Math.PI; };
  grab.addEventListener("pointerdown", e => { grab.setPointerCapture(e.pointerId); ptrs.set(e.pointerId, { x: e.clientX, y: e.clientY }); if (ptrs.size === 2) p0 = { d: dist(), a: ang(), zoom: S.zoom, rot: S.rot, v: S.face.r / S.base[2] }; });
  grab.addEventListener("pointermove", e => {
    const p = ptrs.get(e.pointerId); if (!p) return;
    const k = canvas.width / canvas.getBoundingClientRect().width, dx = (e.clientX - p.x) * k, dy = (e.clientY - p.y) * k; p.x = e.clientX; p.y = e.clientY;
    if (ptrs.size === 2 && p0) { const s = dist() / p0.d; if (S.mode === "photo") { setZoom(p0.zoom * s); setRot(normRot(p0.rot + ang() - p0.a)); } else setFrameScale(p0.v * s); }
    else if (ptrs.size === 1) { if (S.mode === "photo") { const d = 2 * S.face.r * canvas.width; S.ox += dx / d; S.oy += dy / d; } else { S.face.cx += dx / canvas.width; S.face.cy += dy / canvas.height; } }
    if (!S.live) draw();
  });
  const up = e => { ptrs.delete(e.pointerId); if (ptrs.size < 2) p0 = null; };
  grab.addEventListener("pointerup", up); grab.addEventListener("pointercancel", up);
  grab.addEventListener("wheel", e => { e.preventDefault(); const f = e.deltaY < 0 ? 1.06 : .94; S.mode === "photo" ? setZoom(S.zoom * f) : setFrameScale(S.face.r / S.base[2] * f); if (!S.live) draw(); }, { passive: false });

  let url = null, blob = null, kind = "photo";
  const shareText = () => tr("내 사주 아바타로 사진 찍었어! 너도 해봐 🐾", "I made a photo with my Saju avatar! Try it too 🐾");
  const pageUrl = () => location.origin + "/photo/?ilju=" + encodeURIComponent(S.key) + (lang() === "en" ? "&lang=en" : "");
  function toast(msg) {
    const t = $("#toast"); t.textContent = msg; t.hidden = false; clearTimeout(toast.t); toast.t = setTimeout(() => { t.hidden = true; }, 2600);
  }
  function makeImage(withPhoto) {
    const aw = S.avatar.naturalWidth, ah = S.avatar.naturalHeight, k = Math.max(1, 1200 / Math.max(aw, ah));
    const W = Math.round(aw * k), H = Math.round(ah * k), out = document.createElement("canvas"); out.width = W; out.height = H;
    const o = out.getContext("2d"); o.imageSmoothingQuality = "high"; const m = S.mode; S.mode = "photo"; render(o, W, H, false, !withPhoto); S.mode = m;
    out.toBlob(b => {
      if (!b) return; blob = b; if (url) URL.revokeObjectURL(url); url = URL.createObjectURL(b); $("#resultImg").src = url; kind = withPhoto ? "photo" : "art";
      $("#modalTitle").textContent = withPhoto ? tr("완성! 아바타 사진이에요", "Your avatar photo is ready!") : tr("아바타 일러스트예요", "Here’s your avatar illustration");
      $("#modal").hidden = false; document.body.classList.add("no-scroll");
    }, "image/png");
  }
  function save() {
    if (S.live) shoot(); if (!S.photo) { setHint("needPhoto"); return; }
    makeImage(true);
  }
  function saveArt() { makeImage(false); }
  const fileName = () => "matspace-avatar-" + S.key + (kind === "art" ? "-illust" : "") + ".png";
  async function download() {
    if (!blob) return; const name = fileName(), file = new File([blob], name, { type: "image/png" });
    try { if (navigator.canShare && navigator.canShare({ files: [file] }) && /Android|iPhone|iPad|iPod/i.test(navigator.userAgent)) { await navigator.share({ files: [file], title: "Mat Space" }); return; } }
    catch (e) { if (e && e.name === "AbortError") return; }
    const a = document.createElement("a"); a.href = url; a.download = name; document.body.appendChild(a); a.click(); a.remove();
  }
  async function copyLink(u) {
    try { await navigator.clipboard.writeText(u); toast(tr("링크가 복사됐어요. 친구에게 붙여넣기 해주세요!", "Link copied. Paste it to your friend!")); }
    catch (e) { window.prompt(tr("링크를 복사해 친구에게 보내주세요", "Copy this link to share"), u); }
  }
  // 친구에게 공유: 결과 이미지가 있으면 이미지+링크, 없으면 링크만
  async function share(withImage) {
    const data = { title: tr("맛스페이스 사주 아바타 포토부스", "Mat Space Saju Avatar Photo Booth"), text: shareText(), url: pageUrl() };
    try {
      if (withImage && blob) {
        const file = new File([blob], fileName(), { type: "image/png" });
        if (navigator.canShare && navigator.canShare({ files: [file] })) { await navigator.share({ ...data, files: [file] }); return; }
      }
      if (navigator.share) { await navigator.share(data); return; }
    } catch (e) { if (e && e.name === "AbortError") return; }
    copyLink(data.url);
  }
  const closeModal = () => { $("#modal").hidden = true; document.body.classList.remove("no-scroll"); };
  $("#btnSave").onclick = save; $("#btnArt").onclick = saveArt; $("#btnShare").onclick = () => share(false); $("#btnShareImg").onclick = () => share(true); $("#btnDl").onclick = download; $("#btnClose").onclick = closeModal;
  $("#modal").addEventListener("click", e => { if (e.target.id === "modal") closeModal(); });

  /* ---------- 아바타 고르기 ---------- */
  const STEM_KO = { '갑':'갑목','을':'을목','병':'병화','정':'정화','무':'무토','기':'기토','경':'경금','신':'신금','임':'임수','계':'계수' };
  const STEM_EN = { '갑':'Yang Wood','을':'Yin Wood','병':'Yang Fire','정':'Yin Fire','무':'Yang Earth','기':'Yin Earth','경':'Yang Metal','신':'Yin Metal','임':'Yang Water','계':'Yin Water' };
  function stemLabel(s) { return (document.documentElement.lang === 'en' || /[?&]lang=en/.test(location.search)) ? STEM_EN[s] : STEM_KO[s]; }
  function buildPicker() {
    const cur = S.stemTab;
    $("#tabs").innerHTML = window.SAJU.STEMS.map(s => `<button class="pb-tab${s === cur ? " on" : ""}" data-s="${s}">${stemLabel(s)}</button>`).join("");
    const items = Object.keys(AV).filter(g => g[0] === cur).sort((a, b) => window.SAJU.BRANCHES.indexOf(a[1]) - window.SAJU.BRANCHES.indexOf(b[1]));
    $("#grid").innerHTML = items.map(g => `<button class="pb-av${g === S.key ? " on" : ""}" data-g="${g}"><img src="img/${g}.webp" alt="${window.I18N.avatarName(g, lang())}" loading="lazy"><b>${window.I18N.avatarName(g, lang())}</b></button>`).join("");
  }
  $("#tabs").addEventListener("click", e => { const b = e.target.closest(".pb-tab"); if (!b) return; S.stemTab = b.dataset.s; buildPicker(); });
  $("#grid").addEventListener("click", e => { const b = e.target.closest(".pb-av"); if (!b) return; loadAvatar(b.dataset.g); buildPicker(); });

  window.addEventListener("langchange", () => { buildPicker(); if (S.hintKey) $("#hint").textContent = tr(...HINTS[S.hintKey]); draw(); });
  window.addEventListener("pagehide", stopCam);
  S.stemTab = S.key[0]; buildPicker();
  loadAvatar(S.key); showButtons(); setHint("pick");
})();
