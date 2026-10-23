/* =========================================================
   공고 (누구나 조회 / 관리자만 작성·수정·삭제) · 수정하지 않아도 돼요
   ========================================================= */
(function () {
  const CFG = window.MATSPACE_CONFIG || {};
  const ADMIN = (CFG.adminEmail || "").toLowerCase();
  const PAGE_SIZE = 10;
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const list = $("#discList");
  if (!list) return;

  const T = (ko, en) => (window.MATSPACE_LANG && window.MATSPACE_LANG() === "en" ? en : ko);
  // 한/영 두 가지 문구를 가진 요소의 내용 바꾸기
  const setBoth = (el, ko, en) => { if (!el) return; el.dataset.ko = ko; el.dataset.en = en; el.innerHTML = T(ko, en); };

  const toast = msg => {
    const t = $("#toast");
    t.textContent = msg;
    t.classList.add("show");
    clearTimeout(t._timer);
    t._timer = setTimeout(() => t.classList.remove("show"), 2600);
  };
  const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const today = () => { const d = new Date(); return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10); };
  const openModal = m => { m.hidden = false; const f = $("input:not([type=hidden])", m); if (f) setTimeout(() => f.focus(), 50); };
  const closeModal = m => { m.hidden = true; };
  $$(".modal").forEach(m => m.addEventListener("click", e => { if (e.target === m || e.target.closest("[data-close]")) closeModal(m); }));
  document.addEventListener("keydown", e => { if (e.key === "Escape") $$(".modal").forEach(closeModal); });

  const loginModal = $("#loginModal");
  const editModal = $("#editModal");
  const empty = (ko, en) => `<p class="disc-empty" data-ko="${esc(ko)}" data-en="${esc(en)}">${T(ko, en)}</p>`;

  const configured = CFG.supabaseUrl && /^https:\/\//.test(CFG.supabaseUrl) && CFG.supabaseAnonKey && !/여기에/.test(CFG.supabaseAnonKey);
  if (!configured || !window.supabase) {
    list.innerHTML = empty("등록된 공고가 없어요.", "There are no notices yet.");
    window.openAdminLogin = () => toast(T("Supabase 설정(config.js)을 먼저 완료해 주세요.", "Please finish the Supabase setup in config.js first."));
    if (location.hash === "#admin") window.openAdminLogin();
    return;
  }

  const sb = window.supabase.createClient(CFG.supabaseUrl, CFG.supabaseAnonKey);
  let items = [], shown = PAGE_SIZE, isAdmin = false;

  async function load() {
    const { data, error } = await sb.from("notices").select("*")
      .order("posted_at", { ascending: false }).order("id", { ascending: false });
    if (error) {
      console.error(error);
      list.innerHTML = empty("공고를 불러오지 못했어요. 잠시 후 다시 시도해 주세요.", "Couldn't load notices. Please try again later.");
      return;
    }
    items = data || [];
    render();
  }

  function render() {
    if (!items.length) {
      list.innerHTML = empty("등록된 공고가 없어요.", "There are no notices yet.");
      $("#btnMore").hidden = true;
      return;
    }
    list.innerHTML = items.slice(0, shown).map(it => `
      <details class="disc-item">
        <summary>
          <span class="disc-date">${esc(it.posted_at)}</span>
          <span class="disc-title">${esc(it.title)}</span>
          <span class="disc-arrow" aria-hidden="true">▼</span>
        </summary>
        <div class="disc-body">${esc(it.content)}${
          isAdmin ? `<div class="disc-actions">
              <button class="btn btn-line btn-sm" data-edit="${it.id}">${T("수정", "Edit")}</button>
              <button class="btn btn-line btn-sm" data-del="${it.id}">${T("삭제", "Delete")}</button>
            </div>` : ""
        }</div>
      </details>`).join("");
    $("#btnMore").hidden = items.length <= shown;
  }
  $("#btnMore").addEventListener("click", () => { shown += PAGE_SIZE; render(); });
  window.addEventListener("langchange", render);

  /* ---------- 관리자 로그인 ---------- */
  function setSession(session) {
    const email = (session?.user?.email || "").toLowerCase();
    isAdmin = !!email && email === ADMIN;
    $("#adminBar").hidden = !isAdmin;
    setBoth($("#btnAdmin"), isAdmin ? "관리자 로그아웃" : "관리자", isAdmin ? "Admin log out" : "Admin");
    if (session && !isAdmin) { sb.auth.signOut(); toast(T("관리자 계정이 아니에요.", "This is not an admin account.")); }
    render();
  }

  window.openAdminLogin = () => {
    if (isAdmin) return;
    $("#loginMsg").textContent = "";
    openModal(loginModal);
  };

  document.addEventListener("click", async e => {
    if (!e.target.closest("#btnAdmin")) return;
    e.preventDefault();
    if (isAdmin) { await sb.auth.signOut(); toast(T("로그아웃했어요.", "Logged out.")); }
    else window.openAdminLogin();
  });
  if (location.hash === "#admin") setTimeout(window.openAdminLogin, 300);

  $("#loginForm").addEventListener("submit", async e => {
    e.preventDefault();
    const email = $("#loginEmail").value.trim().toLowerCase();
    const msg = $("#loginMsg");
    if (email !== ADMIN) { msg.textContent = T("관리자 이메일만 로그인할 수 있어요.", "Only the admin email can log in."); return; }
    msg.textContent = T("메일을 보내는 중이에요…", "Sending email…");
    const { error } = await sb.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: window.location.origin + window.location.pathname }
    });
    msg.textContent = error
      ? T("메일 발송에 실패했어요. 잠시 후 다시 시도해 주세요. ", "Couldn't send the email. Please try again later. ") + "(" + error.message + ")"
      : T("메일함을 확인해 주세요! 링크를 누르면 로그인돼요.", "Check your inbox! Click the link to log in.");
  });

  $("#btnLogout").addEventListener("click", async () => { await sb.auth.signOut(); toast(T("로그아웃했어요.", "Logged out.")); });
  sb.auth.onAuthStateChange((_event, session) => setSession(session));

  /* ---------- 작성 / 수정 / 삭제 ---------- */
  function openEditor(item) {
    setBoth($("#editTitle"), item ? "공고 수정" : "공고 등록", item ? "Edit notice" : "New notice");
    $("#editId").value = item?.id || "";
    $("#editTitleInput").value = item?.title || "";
    $("#editDate").value = item?.posted_at || today();
    $("#editContent").value = item?.content || "";
    openModal(editModal);
  }
  $("#btnNew").addEventListener("click", () => openEditor(null));

  list.addEventListener("click", async e => {
    const editId = e.target.closest("[data-edit]")?.dataset.edit;
    const delId = e.target.closest("[data-del]")?.dataset.del;
    if (editId) openEditor(items.find(x => String(x.id) === editId));
    if (delId) {
      const it = items.find(x => String(x.id) === delId);
      if (!confirm(T(`'${it.title}' 공고를 삭제할까요?\n삭제하면 되돌릴 수 없어요.`, `Delete '${it.title}'?\nThis cannot be undone.`))) return;
      const { error } = await sb.from("notices").delete().eq("id", delId);
      if (error) return toast(T("삭제하지 못했어요: ", "Couldn't delete: ") + error.message);
      toast(T("삭제했어요.", "Deleted."));
      load();
    }
  });

  $("#editForm").addEventListener("submit", async e => {
    e.preventDefault();
    const id = $("#editId").value;
    const row = {
      title: $("#editTitleInput").value.trim(),
      posted_at: $("#editDate").value,
      content: $("#editContent").value.trim(),
      updated_at: new Date().toISOString()
    };
    const btn = $("#btnSave");
    btn.disabled = true;
    const { error } = id ? await sb.from("notices").update(row).eq("id", id) : await sb.from("notices").insert(row);
    btn.disabled = false;
    if (error) return toast(T("저장하지 못했어요: ", "Couldn't save: ") + error.message);
    closeModal(editModal);
    toast(id ? T("수정했어요.", "Updated.") : T("등록했어요.", "Posted."));
    load();
  });

  load();
})();
