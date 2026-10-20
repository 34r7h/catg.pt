// Shared handoff auth — one implementation used by every page (was duplicated + divergent before).
// Holds the token in localStorage, resolves the account via /auth/me, and provides ONE sign-in panel
// offering password, email-code (OTP), phone-code (SMS), passkey, token paste, pairing-via-agent —
// plus create-account (OTP-verified), forgot-password, and the multi-factor step-up ladder.
// Notifies onChange listeners (the nav re-renders) so sign in/out is consistent everywhere.
//
// THE SIGN-IN MODEL. A login is a CEREMONY, not a call: each factor you prove is posted against a
// `login_session`, and the server hands back a token only once the account's own M-of-N policy is met.
// So every factor entry point below funnels into ONE handler (`progress`) — if the answer carries a token
// we are done, and if it carries a session we render whatever is still required. That is why adding
// passkeys or a 4-of-4 policy needed no new branch in any individual tab.
//
// STYLING: this used to ship its own hardcoded palette (#12161f, #4ea1ff, …) in an injected <style> —
// the one auth surface that didn't move when the redesign (handoff.css tokens, light/dark via
// [data-theme]) landed everywhere else. It now builds on the SAME classes every other modal/card/button
// in the app uses (.hf-modal/.hf-box, .tabs/.tab, .row, .btn/.ghost, .ok/.err/.muted) and carries no
// colors of its own — light/dark and the depth system apply automatically, with no local <style> tag.
window.HandoffAuth = (function () {
  const AUTH_BASE = (typeof location !== 'undefined' && (location.hostname === 'handoff.lol' || location.hostname.endsWith('.handoff.lol')))
    ? ''
    : 'https://handoff.lol';
  const KEY = 'handoff_token';          // the ACTIVE token — every existing caller uses token()/authHeaders(), unchanged
  const POOL = 'handoff_accounts';      // JSON [{token, handle, id}] — ALL currently logged-in accounts (multi-user)
  const listeners = [];
  const notify = () => listeners.forEach(f => { try { f(); } catch (e) {} });
  // STORAGE CAN THROW, AND THIS FILE RUNS WHERE IT DOES. Every published miniapp bundle carries
  // <script src="/auth.js">, and the store, the feed and the homepage all render those bundles inside
  // sandbox="allow-scripts" iframes with NO allow-same-origin — an opaque origin, where merely READING
  // localStorage raises SecurityError. token() was unguarded and migrate() calls it at load, so every
  // preview threw "Uncaught SecurityError" into the host page's console before the file finished parsing.
  // Same story for a third-party cookie/site-data block. Storage is a convenience here, never a
  // correctness requirement: with none available this simply behaves as a signed-out visitor.
  const ls = {
    get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch (e) {} },
    del(k) { try { localStorage.removeItem(k); } catch (e) {} },
  };
  function token() { return ls.get(KEY) || ''; }
  function readPool() { try { const p = JSON.parse(ls.get(POOL) || '[]'); return Array.isArray(p) ? p.filter(a => a && a.token) : []; } catch (e) { return []; } }
  function writePool(p) { ls.set(POOL, JSON.stringify(p)); }
  // ONE ROW PER ACCOUNT, NOT PER TOKEN. Every sign-in mints a fresh session token and the pool was keyed by
  // token alone, so signing in as the same user N times listed that user N times in the header's USER list
  // (operator screenshot 2026-10-02: four "architect" rows). Two entries are the same account when they share
  // an id OR a handle (handles are unique; older entries may have cached only the handle). The pool keeps ONE
  // token per account — `keep` (the active / just-signed-in one) when it is among them, otherwise the newest.
  // Entries not yet identified are left alone until /auth/me names them.
  function dedupe(p, keep) {
    const by = (list, field) => {
      const pick = new Map();
      list.forEach((a, i) => { const k = a[field] ? String(a[field]) : ''; if (!k) return; const cur = pick.get(k); if (cur === undefined || list[cur].token !== keep) pick.set(k, i); });
      return list.filter((a, i) => !a[field] || pick.get(String(a[field])) === i);
    };
    return by(by(p, 'id'), 'handle');
  }
  // seamless upgrade: fold a pre-existing lone token into the pool, and collapse duplicates already stored
  (function migrate() { const t = token(); const was = readPool(); let p = was.slice(); if (t && !p.some(a => a.token === t)) p.unshift({ token: t }); p = dedupe(p, t); if (JSON.stringify(p) !== JSON.stringify(was)) writePool(p); })();
  function cacheInfo(t, info) { if (!t || !info) return; const p = readPool(); const i = p.findIndex(a => a.token === t); if (i >= 0) { p[i] = Object.assign(p[i], info); writePool(dedupe(p, t)); } }
  // setToken upserts into the pool AND makes it active, so a login ALWAYS adds a user (never wipes the others)
  function setToken(t, info) {
    if (t) { ls.set(KEY, t); const p = readPool(); const i = p.findIndex(a => a.token === t); if (i < 0) p.push(Object.assign({ token: t }, info || {})); else if (info) p[i] = Object.assign(p[i], info); writePool(dedupe(p, t)); }
    else ls.del(KEY);
    notify();
  }
  function onChange(f) { listeners.push(f); }
  function authHeaders(extra) { return Object.assign({ 'Content-Type': 'application/json' }, token() ? { Authorization: 'Bearer ' + token() } : {}, extra || {}); }
  // every logged-in account, with `active` set on the current one (drives the user list + switching in the header)
  function accounts() { const a = token(); return readPool().map(x => Object.assign({}, x, { active: x.token === a })); }
  function switchTo(t) { if (!t || t === token() || !readPool().some(a => a.token === t)) return; ls.set(KEY, t); notify(); }
  // A 401 means the server definitively does not know this token (wiped dev store, rotated account) — it
  // will 401 on every poll forever. Prune it from the pool and fall back to the next account (or signed
  // out) instead of hammering /auth/me with a dead token every page cycle. Network errors / 5xx do NOT
  // prune — they're transient, not a verdict on the token.
  function pruneToken(t) {
    const p = readPool().filter(a => a.token !== t); writePool(p);
    if (token() === t) { if (p.length) ls.set(KEY, p[0].token); else ls.del(KEY); notify(); }
  }
  // ONE SESSION PROBE PER MOMENT, NOT ONE PER CALLER. The nav, the actionboard and every view that asks
  // "am I signed in" call this on the same load; it was a fresh round trip each time, and each answer
  // carried the user's whole receipt history. Concurrent callers now share the in-flight request and a
  // 3s answer, which is shorter than any interaction and long enough to cover one page's boot.
  // The cached answer and the in-flight request each carry THEIR OWN token. One shared token field let the
  // first call after an account switch relabel the previous account's cached answer as the new one's, so for
  // up to 3s every other caller (the manage page, the board) was handed the old account under the new token.
  let _meP = null, _mePTok = '', _me = null, _meAt = 0, _meFor = '';
  async function me(force) {
    const t = token(); if (!t) return null;
    if (!force && _me && _meFor === t && Date.now() - _meAt < 3000) return _me;
    if (_meP && _mePTok === t && !force) return _meP;
    _mePTok = t;
    const p = _fetchMe(t).then(v => { _me = v; _meFor = t; _meAt = Date.now(); if (_meP === p) _meP = null; return v; },
      e => { if (_meP === p) _meP = null; throw e; });
    _meP = p;
    return p;
  }
  async function _fetchMe(t) {
    try {
      // The shell may already have this in flight from t=0 (the PREBOOT block in web/index.html), which is
      // the difference between /auth/me starting before any script has downloaded and starting after all
      // of them have. Only for the SAME token, and a failed preboot resolves null and falls through here.
      let r = null;
      if (typeof window !== 'undefined' && window.__prebootTakeRes && window.__prebootTok === t) {
        try { r = await window.__prebootTakeRes('/auth/me'); } catch (e) { r = null; }
      }
      if (!r) r = await fetch(AUTH_BASE + '/api/v1/auth/me', { headers: { Authorization: 'Bearer ' + t }, cache: 'no-cache' });
      if (r.status === 401) { pruneToken(t); return null; }
      const j = await r.json();
      if (j.success) { cacheInfo(t, { handle: (j.user && (j.user.handle || j.user.username || j.user.id)) || '', id: j.user && j.user.id }); return j; } return null; } catch (e) { return null; }
  }
  // "Logout current user": remove the active account from the pool and fall back to the next one if any remain
  function signOut() { const cur = token(); const p = readPool().filter(a => a.token !== cur); writePool(p); if (p.length) ls.set(KEY, p[0].token); else ls.del(KEY); notify(); }

  async function post(path, body) {
    try { const r = await fetch(AUTH_BASE + '/api/v1' + path, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body || {}) });
      return await r.json(); } catch (e) { return { success: false, error: 'network error' }; }
  }
  // As a SPECIFIC token rather than the active one — the recovery flow's last step runs against the token the
  // ceremony just minted, which is deliberately not signed in anywhere yet.
  async function postAs(t, path, body) {
    try { const r = await fetch(AUTH_BASE + '/api/v1' + path, { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + t }, body: JSON.stringify(body || {}) });
      return await r.json(); } catch (e) { return { success: false, error: 'network error' }; }
  }
  // Same, but as the signed-in account — used by enrolment (passkeys, password, policy) which is always
  // done from a session you already hold, never anonymously.
  async function authed(path, body, method) {
    try { const r = await fetch(AUTH_BASE + '/api/v1' + path, { method: method || 'POST', headers: authHeaders(), body: method === 'DELETE' ? undefined : JSON.stringify(body || {}) });
      return await r.json(); } catch (e) { return { success: false, error: 'network error' }; }
  }

  // ---- ICONS. Drawn, not typed, and drawn by the one source (web/static/icons.js): the 🔐/📱 emoji these
  // replaced rendered as a different picture on every platform, and the private table that replaced THEM was
  // a fourth geometry. These names are this file's vocabulary, mapped onto the family. ----
  const ICON = { key: 'key', phone: 'phone', mail: 'mail', shield: 'verify', link: 'link', chev: 'chevron-right', x: 'close', back: 'arrow-left' };
  const ico = (name, cls) => (window.HandoffIcons ? HandoffIcons.svg(ICON[name], 16, cls || 'btn-ico') : '');

  // A control that is waiting on the network is neither pressable nor a live surface. Without this the
  // Enter key on a code field could fire three verifications against the same one-shot OTP.
  async function busy(btn, fn) {
    if (!btn) return fn();
    const was = btn.disabled; btn.disabled = true;
    try { return await fn(); } finally { btn.disabled = was; }
  }

  // A PHONE NUMBER AS TYPED IS NOT A PHONE NUMBER AS STORED. The server keys accounts by strict E.164 and
  // refused "+1 (415) 555-1234" — spaces, brackets and dashes are what a human puts in a phone field, and
  // "E.164 format required" is not a sentence most people can act on. Strip the punctuation here (the server
  // does the same, so the two always agree on the key), turn a 00 prefix into +, and if what is left still
  // is not a number with a country code, say what is missing before spending a send on it.
  const normPhone = (raw) => { let s = String(raw || '').trim().replace(/[\s().\-\u00a0\u2010-\u2015]/g, ''); if (s.startsWith('00')) s = '+' + s.slice(2); return s; };
  const phoneOk = (s) => /^\+[1-9]\d{7,14}$/.test(s);
  const PHONE_HINT = 'enter the number with its country code, e.g. +14155551234';
  // ⛔ TEXT-MESSAGE CODES ARE NOT LIVE YET — the same switch as SMS_LIVE in src/sms.ts, and it flips with it.
  // The toll-free number is still in carrier review (registration-2ccdada8d0e9473ab2343e87c45d68f0); until
  // that completes no text leaves AWS. A "Phone code" that looks live is a code field waiting on a text that
  // never comes, so the phone option stays ON SCREEN (people should know it is coming) and OFF (its field and
  // button are disabled, and it says why). The server refuses the send whatever this says; this only keeps
  // the screen honest before the click.
  const SMS_LIVE = false;
  const SMS_PENDING = 'Text-message codes aren\u2019t available yet \u2014 our number is waiting on carrier approval. Use an email code or a password for now.';
  const soonAttrs = SMS_LIVE ? '' : ' aria-disabled="true" title="text-message codes are pending carrier approval"';
  const soonNote = (id) => SMS_LIVE ? '' : `<div class="muted hf-soon" id="${id}">${SMS_PENDING}</div>`;
  const dis = SMS_LIVE ? '' : ' disabled';
  // Read a phone field, normalise it in place, and return '' (with the hint shown) if it is not usable.
  function takePhone(inp, msg) {
    const v = normPhone(inp.value); inp.value = v;
    if (phoneOk(v)) return v;
    msg.className = 'err'; msg.textContent = PHONE_HINT; inp.focus();
    return '';
  }

  // Dialog manners the modal never had: Escape closes it, focus starts inside it instead of behind it, and
  // Tab stays in it. A sign-in box the keyboard can fall out of is a sign-in box some people cannot use.
  function dialogManners(m, box, close) {
    box.setAttribute('role', 'dialog'); box.setAttribute('aria-modal', 'true');
    const focusables = () => [...box.querySelectorAll('button,[href],input,select,textarea,summary,[tabindex]:not([tabindex="-1"])')].filter(el => !el.disabled && shown(el));
    m.onkeydown = (e) => {
      if (e.key === 'Escape') { close(); return; }
      if (e.key !== 'Tab') return;
      const f = focusables(); if (!f.length) return;
      const first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    };
  }
  // Rendered, as the keyboard sees it. Chrome gives the fields inside a closed <details> an offsetParent, so the trap
  // took the recovery code's hidden button for the last stop, never saw Tab leave the summary, and let it walk out
  // of the dialog into the app behind; checkVisibility says they are not shown. offsetParent is the fallback.
  const shown = el => el.checkVisibility ? el.checkVisibility() : el.offsetParent !== null;
  // Close the modal and put focus back where it was when the modal opened, if that control is still on the page —
  // otherwise the keyboard lands on <body> and a screen-reader user is dropped at the top of the document.
  function hideModal(m) {
    m.style.display = 'none';
    const o = m.__opener;
    if (o && o.isConnected && o !== document.body) { try { o.focus(); } catch (e) {} }
  }
  // Put the cursor where the screen expects the first keystroke — every re-render, since each one replaces
  // the box's whole contents and would otherwise leave focus on a detached node.
  // The first VISIBLE one: the box holds both flows and every method's fields at once, and a focus()
  // on a display:none input is a silent no-op that leaves the keyboard nowhere.
  function focusFirst(box) {
    const el = [...box.querySelectorAll('input:not([type=hidden])')].find(shown) || [...box.querySelectorAll('button:not(.hf-x)')].find(shown);
    if (el) setTimeout(() => { try { el.focus(); } catch (e) {} }, 0);
  }

  // Every screen below replaces its container wholesale — a deliberate teardown, not a poll refresh. The
  // global anti-flicker guard at the top of handoff.js DROPS an innerHTML write when the string is
  // unchanged, and also when focus is sitting in an input inside the target (it is there to stop a
  // background poll clobbering a half-typed field). Both fire on a modal the user has just typed into:
  // the write silently vanishes and the next screen never arrives. replaceChildren() goes around the
  // setter entirely, taking the focused field out of the document with it; the guard's cache is stale
  // afterwards, so clear it by hand before writing.
  function paint(el, html) { el.replaceChildren(); el.__lastHtml = null; el.innerHTML = html; }

  // ---- WebAuthn plumbing. The wire format is base64url both ways; the browser wants ArrayBuffers. ----
  const passkeysAvailable = () => !!(window.PublicKeyCredential && navigator.credentials && navigator.credentials.create);
  function b64uToBuf(s) { const b = atob(String(s || '').replace(/-/g, '+').replace(/_/g, '/')); const u = new Uint8Array(b.length); for (let i = 0; i < b.length; i++) u[i] = b.charCodeAt(i); return u.buffer; }
  function bufToB64u(b) { const u = new Uint8Array(b); let s = ''; for (let i = 0; i < u.length; i++) s += String.fromCharCode(u[i]); return btoa(s).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, ''); }

  // WEBAUTHN TELLS YOU ALMOST NOTHING, AND WHAT IT TELLS YOU IS NOT "CANCELLED". Both ceremonies used to
  // map every NotAllowedError to the single word `cancelled` — but that one name is what a browser raises
  // for a cancel, a timeout, an unfocused tab, a rpId this page may not claim (Safari), a key already
  // enrolled here (Safari/Firefox), and "no authenticator I am willing to use". Someone who pressed the
  // button, touched nothing, and was told they cancelled has been handed a dead end: there is nothing to
  // stop doing. So say the name the browser gave and repeat its own words, and name the cases that have a
  // way out. The full error also goes to the console, because that is where the next person will look.
  function webauthnError(e, what) {
    const name = (e && e.name) || 'Error';
    const said = (e && e.message) ? String(e.message).trim().replace(/[.\s]+$/, '') : '';
    try { console.warn('[handoff-auth] passkey ' + what + ' failed:', name, said, e); } catch (_) {}
    if (name === 'InvalidStateError') return 'this device already holds a passkey for this account, so there is nothing to add — a synced passkey (iCloud Keychain, Google Password Manager) is already on every device signed in to the same account. Sign in with it, or remove it in Manage first';
    if (name === 'SecurityError') return 'this page is not allowed to claim that domain for passkeys' + (said ? ' — ' + said : '');
    if (name === 'NotSupportedError') return 'no authenticator here can do what the server asked for';
    if (name === 'AbortError') return 'the passkey prompt closed before it finished';
    if (name === 'NotAllowedError') {
      // A password-manager extension that has taken over navigator.credentials answers instead of the
      // browser — and when its own popup cannot open (a hidden toolbar, a locked vault) it rejects with this
      // same name and shows nothing at all. Its takeover is visible: the function is no longer native code.
      const hijacked = !/\[native code\]/.test(String(navigator.credentials && navigator.credentials.create));
      return 'NotAllowedError — the browser would not run the prompt. That is a cancel, a timeout, a tab that was not focused, a passkey already enrolled here, or no authenticator it would use'
        + (hijacked ? '. A browser extension has replaced the passkey API on this page — disable it for this site and try again' : '')
        + (said ? ' · ' + said : '');
    }
    return name + (said ? ' — ' + said : '');
  }

  // Enrol a passkey on the CURRENT account. `getPublicKey()` hands us SPKI DER directly, which is exactly
  // what the server verifies assertions against — so no attestation object is ever parsed on either side.
  async function enrollPasskey(label) {
    if (!passkeysAvailable()) return { success: false, error: 'this browser has no passkey support' };
    const o = await authed('/auth/webauthn/register/options', {});
    if (!o.success) return o;
    try {
      const cred = await navigator.credentials.create({ publicKey: {
        challenge: b64uToBuf(o.challenge),
        rp: { id: o.rp_id, name: 'Handoff' },
        user: { id: b64uToBuf(o.user.id), name: o.user.name, displayName: o.user.displayName },
        pubKeyCredParams: (o.pub_key_cred_params || []).map(p => ({ type: 'public-key', alg: p.alg })),
        authenticatorSelection: o.authenticator_selection,
        attestation: 'none',
        excludeCredentials: (o.exclude_credentials || []).map(c => ({ type: 'public-key', id: b64uToBuf(c.id) })),
        timeout: 120000,
      } });
      const resp = cred.response;
      if (!resp.getPublicKey) return { success: false, error: 'this browser is too old for passkey enrolment' };
      return await authed('/auth/webauthn/register', {
        challenge_id: o.challenge_id, id: cred.id,
        public_key: bufToB64u(resp.getPublicKey()),
        alg: resp.getPublicKeyAlgorithm(),
        client_data_json: bufToB64u(resp.clientDataJSON),
        authenticator_data: resp.getAuthenticatorData ? bufToB64u(resp.getAuthenticatorData()) : undefined,
        transports: resp.getTransports ? resp.getTransports() : undefined,
        label: label || undefined,
      });
    } catch (e) { return { success: false, error: webauthnError(e, 'enrolment') }; }
  }
  // Sign in (or step up) with a passkey. With no session id this is DISCOVERABLE: nothing is typed, the
  // authenticator names the account, and the server is never asked "does this identifier exist".
  async function passkeyAssert(loginSession) {
    if (!passkeysAvailable()) return { success: false, error: 'this browser has no passkey support' };
    const o = await post('/auth/webauthn/login/options', loginSession ? { login_session: loginSession } : {});
    if (!o.success) return o;
    try {
      const a = await navigator.credentials.get({ publicKey: {
        challenge: b64uToBuf(o.challenge), rpId: o.rp_id,
        allowCredentials: (o.allow_credentials || []).map(c => ({ type: 'public-key', id: b64uToBuf(c.id), transports: c.transports })),
        userVerification: o.user_verification || 'required', timeout: 120000,
      } });
      return await post('/auth/webauthn/login', {
        challenge_id: o.challenge_id, id: a.id,
        client_data_json: bufToB64u(a.response.clientDataJSON),
        authenticator_data: bufToB64u(a.response.authenticatorData),
        signature: bufToB64u(a.response.signature),
      });
    } catch (e) { return { success: false, error: webauthnError(e, 'sign-in') }; }
  }

  // ---- the ceremony ----
  const FACTOR_LABEL = { password: 'Password', email_otp: 'Email code', sms_otp: 'Text message code', totp: 'Authenticator app', webauthn: 'Passkey / biometrics', backup: 'Recovery code' };

  // THE one place a login response is interpreted. A token finishes; anything else is a ceremony still
  // in progress and gets rendered as the remaining ladder. Every tab and every factor calls this.
  function progress(m, r, finish, msgEl) {
    if (r && r.token) { finish(r.token); return true; }
    if (r && r.login_session) { renderFactorStep(m, r, finish); return true; }
    if (msgEl) { msgEl.className = 'err'; msgEl.textContent = (r && r.error) || 'sign-in failed'; }
    return false;
  }

  // The step-up screen: what has been proven, what is still required, and one control per factor the
  // account can still offer. Under a 1-factor policy this screen is never shown at all.
  function renderFactorStep(m, state, finish) {
    const box = m.querySelector('.hf-box');
    const sid = state.login_session;
    const opts = state.options || [];
    const need = state.factors_remaining != null ? state.factors_remaining : 1;
    const done = (state.satisfied || []).map(f => FACTOR_LABEL[f] || f).join(', ');
    const mand = (state.mandatory_missing || []);
    // A recovery is the same ladder, but the password is the thing being forgotten, so it is not among the
    // factors offered — and the new one is chosen only once the ladder ends. Say so, or the user reads
    // "one more step" as the reset having failed and tries to reset again.
    const pend = !!state.recovery;
    const req = state.factors_required || ((state.satisfied || []).length + need);
    const proven = (state.satisfied || []).length;
    paint(box, `<button class="hf-x" aria-label="Close">${ico('x', 'ico')}</button>
      <h3>${pend ? 'Confirm it\u2019s you' : 'One more step'}</h3>
      <p class="hf-sub">${pend
        ? 'Your emailed code checked out. This account asks for more than one factor, so prove the rest — then you\u2019ll pick a new password. A reset can\u2019t be a way around your own settings.'
        : 'This account asks for more than one factor, so one more proof and you\u2019re in.'}</p>
      <div class="hf-steps" role="img" aria-label="${proven} of ${req} factors proven">${Array.from({ length: Math.max(req, proven) }, (_, i) => `<i class="${i < proven ? 'on' : ''}"></i>`).join('')}</div>
      <p class="muted" style="margin:0 0 14px;font-size:12.5px">Proven: <b>${done || 'nothing yet'}</b> — <b>${need}</b> of ${req} still needed${mand.length ? `, and it must include ${mand.map(f => FACTOR_LABEL[f] || f).join(' + ')}` : ''}.</p>
      <div class="tabs" id="ha-f-tabs" role="tablist">${opts.map((f, i) => `<button class="tab${i === 0 ? ' active' : ''}" data-f="${f}" role="tab" aria-selected="${i === 0}">${FACTOR_LABEL[f] || f}</button>`).join('')}</div>
      <div id="ha-f-body" style="margin-top:10px"></div>
      <div class="muted" id="ha-f-msg" style="margin-top:6px" aria-live="polite"></div>
      <details class="hf-more">
        <summary>${ico('chev', 'ico chev')}Lost every factor? Use a recovery code</summary>
        <div>
          <label for="ha-f-backup">A recovery code signs you in on its own, and each one works once.</label>
          <div class="row"><input id="ha-f-backup" placeholder="12345-67890" autocomplete="one-time-code"/><button id="ha-f-backup-go" class="ghost">Use recovery code</button></div>
        </div>
      </details>`);
    box.querySelector('.hf-x').onclick = () => hideModal(m);
    const msg = box.querySelector('#ha-f-msg');
    const body = box.querySelector('#ha-f-body');

    const showFactor = (f) => {
      msg.className = 'muted'; msg.textContent = '';
      if (f === 'totp') {
        paint(body, `<label for="ha-f-totp">6-digit code from your authenticator app</label>
          <div class="row"><input id="ha-f-totp" class="otp" placeholder="000000" inputmode="numeric" maxlength="6" autocomplete="one-time-code"/><button id="ha-f-totp-go">Verify</button></div>`);
        const go = () => busy(body.querySelector('#ha-f-totp-go'), async () => {
          msg.className = 'muted'; msg.textContent = 'verifying…';
          progress(m, await post('/auth/2fa/verify-login', { login_session: sid, code: body.querySelector('#ha-f-totp').value.trim() }), finish, msg);
        });
        body.querySelector('#ha-f-totp-go').onclick = go;
        body.querySelector('#ha-f-totp').onkeydown = e => { if (e.key === 'Enter') go(); };
      } else if (f === 'sms_otp' && !SMS_LIVE) {
        paint(body, `${soonNote('ha-f-soon')}<div class="row"><button id="ha-f-send" class="ghost" disabled>${ico('phone')}Send code</button></div>`);
      } else if (f === 'email_otp' || f === 'sms_otp') {
        paint(body, `<div class="row"><button id="ha-f-send" class="ghost">${ico(f === 'email_otp' ? 'mail' : 'phone')}Send code</button></div>
          <div class="row" id="ha-f-code-row" style="display:none"><input id="ha-f-code" class="otp" placeholder="000000" inputmode="numeric" maxlength="6" autocomplete="one-time-code"/><button id="ha-f-code-go">Verify</button></div>`);
        const sendBtn = body.querySelector('#ha-f-send');
        sendBtn.onclick = () => busy(sendBtn, async () => {
          msg.className = 'muted'; msg.textContent = 'sending…';
          const r = await post('/auth/login/otp', { login_session: sid, channel: f });
          if (r.success) { msg.textContent = 'sent to ' + r.sent_to; body.querySelector('#ha-f-code-row').style.display = ''; body.querySelector('#ha-f-code').focus();
            sendBtn.textContent = 'Resend'; }
          else { msg.className = 'err'; msg.textContent = r.error || 'could not send'; }
        });
        const go = () => busy(body.querySelector('#ha-f-code-go'), async () => {
          msg.className = 'muted'; msg.textContent = 'verifying…';
          progress(m, await post('/auth/login/otp/verify', { login_session: sid, code: body.querySelector('#ha-f-code').value.trim() }), finish, msg);
        });
        body.querySelector('#ha-f-code-go').onclick = go;
        body.querySelector('#ha-f-code').onkeydown = e => { if (e.key === 'Enter') go(); };
      } else if (f === 'webauthn') {
        paint(body, `<div class="row"><button id="ha-f-pk">${ico('key')}Use passkey / biometrics</button></div>`);
        body.querySelector('#ha-f-pk').onclick = (e) => busy(e.currentTarget, async () => {
          msg.className = 'muted'; msg.textContent = 'waiting for your device…';
          progress(m, await passkeyAssert(sid), finish, msg);
        });
      } else if (f === 'password') {
        paint(body, `<label for="ha-f-pw-id">The identifier you started with</label>
          <div class="row"><input id="ha-f-pw-id" placeholder="username, email, phone or usr_…" autocomplete="username"/></div>
          <label for="ha-f-pw">Account password</label>
          <div class="row"><input id="ha-f-pw" type="password" placeholder="password" autocomplete="current-password"/><button id="ha-f-pw-go">Verify</button></div>`);
        const go = () => busy(body.querySelector('#ha-f-pw-go'), async () => {
          msg.className = 'muted'; msg.textContent = 'verifying…';
          progress(m, await post('/auth/login', { identifier: body.querySelector('#ha-f-pw-id').value.trim(), password: body.querySelector('#ha-f-pw').value, login_session: sid }), finish, msg);
        });
        body.querySelector('#ha-f-pw-go').onclick = go;
        body.querySelector('#ha-f-pw').onkeydown = e => { if (e.key === 'Enter') go(); };
      } else { paint(body, `<div class="muted">No client for factor “${f}”.</div>`); }
    };

    const tabs = [...box.querySelectorAll('#ha-f-tabs .tab')];
    tabs.forEach(b => b.onclick = () => { tabs.forEach(x => { const on = x === b; x.classList.toggle('active', on); x.setAttribute('aria-selected', String(on)); }); showFactor(b.dataset.f); });
    if (opts.length) showFactor(opts[0]);
    else { paint(body, `<div class="muted">No further factors are enrolled on this account — use a recovery code below.</div>`); box.querySelector('.hf-more').open = true; }
    // after showFactor, not before: until it paints, the factor's field does not exist and focus fell on a tab
    focusFirst(box);

    box.querySelector('#ha-f-backup-go').onclick = (e) => busy(e.currentTarget, async () => {
      msg.className = 'muted'; msg.textContent = 'checking…';
      progress(m, await post('/auth/2fa/verify-login', { login_session: sid, code: box.querySelector('#ha-f-backup').value.trim() }), finish, msg);
    });
  }

  // SIGN IN and CREATE ACCOUNT are the two tabs at the top of the one modal, each with its own flow
  // underneath. They used to be a screen and a link under it: create-an-account replaced the whole box,
  // "← Back to sign in" was the only way out, and a visitor who picked wrong had to find that link.
  // Now picking wrong is one click sideways, and the first-time visitor and the returning one arrive at
  // the same place. `opts.create` lands on the Create tab — the workbench gate's "create account" button.
  // The method pickers inside each tab step down to the segmented control so the box carries ONE tab strip.
  function openSignIn(opts) {
    opts = opts || {};
    // A modal left over from a previous open is NOT reusable: every screen in here (create an account, the
    // step-up ladder, forgot-password) replaces the box wholesale, so re-showing it would put the user back
    // on whatever half-finished screen they walked away from — with its stale token and dead login session.
    // Pressing "Sign in" means "show me the sign-in screen", so the modal is always rebuilt from scratch.
    const stale = document.getElementById('ha-modal'), act = document.activeElement;
    const opener = opts.opener || (stale && stale.contains(act) ? stale.__opener : act);
    if (stale) stale.remove();
    let m = document.createElement('div'); m.id = 'ha-modal'; m.className = 'hf-modal';
    m.__opener = opener;
    const origin = location.origin;
    // ONE acid plate per screen. The fill means "this is the live thing"; when Log in and Use token both
    // wore it, the modal had two primary actions and therefore none. Everything that is not the sign-in
    // itself is a ghost, and the two ways in almost nobody uses are folded behind a summary.
    paint(m, `<div class="hf-box">
      <button class="hf-x" id="ha-close" aria-label="Close sign-in">${ico('x', 'ico')}</button>
      <div class="tabs hf-authtabs" id="ha-mode" role="tablist" aria-label="Sign in or create an account">
        <button class="tab active" id="ha-mode-in-tab" data-mode="in" role="tab" aria-selected="true" aria-controls="ha-mode-in">Sign in</button>
        <button class="tab" id="ha-mode-up-tab" data-mode="up" role="tab" aria-selected="false" aria-controls="ha-mode-up">Create account</button>
      </div>

      <div class="tabpanel active" id="ha-mode-in" role="tabpanel" aria-labelledby="ha-mode-in-tab">
      <h3 id="ha-title">Sign in to handoff</h3>
      <p class="hf-sub">Your account carries every agent, project and payment on the network.</p>
      <div class="seg" id="ha-tabs" role="tablist" aria-label="Sign-in method">
        <button class="segb active" data-tab="pw" role="tab" aria-selected="true">Password</button>
        <button class="segb" data-tab="em" role="tab" aria-selected="false">Email code</button>
        <button class="segb" data-tab="ph" role="tab" aria-selected="false"${soonAttrs}>Phone code</button>
      </div>

      <div class="tabpanel active" id="ha-panel-pw" data-panel="pw" role="tabpanel">
        <label for="ha-email">Username, email, phone or account id</label>
        <div class="row"><input id="ha-email" type="text" placeholder="username, email, phone or usr_…" autocomplete="username"/></div>
        <label for="ha-pass">Password</label>
        <div class="row"><input id="ha-pass" type="password" placeholder="password" autocomplete="current-password"/><button id="ha-login">Sign in</button></div>
        <div class="row" style="margin-top:10px"><button type="button" class="linkish" id="ha-forgot">Forgot your password?</button></div>
        <div class="muted" id="ha-login-msg" aria-live="polite"></div>
      </div>

      <div class="tabpanel" id="ha-panel-em" data-panel="em" role="tabpanel" style="display:none">
        <label for="ha-em-email">We'll email you a one-time 6-digit code</label>
        <div class="row"><input id="ha-em-email" type="email" placeholder="email" autocomplete="username"/><button id="ha-em-send">Send code</button></div>
        <div class="row" id="ha-em-code-row" style="display:none"><input id="ha-em-code" class="otp" placeholder="000000" inputmode="numeric" maxlength="6" autocomplete="one-time-code" aria-label="6-digit email code"/><button id="ha-em-verify">Verify</button></div>
        <div class="muted" id="ha-em-msg" aria-live="polite"></div>
      </div>

      <div class="tabpanel" id="ha-panel-ph" data-panel="ph" role="tabpanel" style="display:none">
        ${soonNote('ha-ph-soon')}
        <label for="ha-ph-phone">We'll text you a one-time 6-digit code — the number has to be verified on your account already</label>
        <div class="row"><input id="ha-ph-phone" type="tel" placeholder="+14155551234" autocomplete="tel"${dis}/><button id="ha-ph-send"${dis}>Send code</button></div>
        <div class="muted" id="ha-ph-consent" style="font-size:12px;margin-top:4px">By tapping Send code you agree to receive one text with a one-time code from XMBL, the operator of Handoff, at this number. One message per request, no marketing. Msg &amp; data rates may apply. Reply STOP to opt out, HELP for help. <a href="/legal/privacy.html" target="_blank" rel="noopener">Privacy</a> · <a href="/legal/terms.html" target="_blank" rel="noopener">Terms</a></div>
        <div class="row" id="ha-ph-code-row" style="display:none"><input id="ha-ph-code" class="otp" placeholder="000000" inputmode="numeric" maxlength="6" autocomplete="one-time-code" aria-label="6-digit text-message code"/><button id="ha-ph-verify">Verify</button></div>
        <div class="muted" id="ha-ph-msg" aria-live="polite"></div>
      </div>

      <div class="row" id="ha-pk-row" style="display:none;margin-top:12px"><button id="ha-pk" class="ghost">${ico('key')}Use a passkey instead</button></div>
      <div class="muted" id="ha-pk-msg" aria-live="polite"></div>

      <details class="hf-more">
        <summary>${ico('chev', 'ico chev')}Other ways in — paste a token, or pair an agent</summary>
        <div>
          <label for="ha-token">Paste a token</label>
          <div class="row"><input id="ha-token" placeholder="hot_…"/><button id="ha-usetoken" class="ghost">Use token</button></div>
          <label>Sign in from an agent already running on your machine</label>
          <div class="row"><button id="ha-pair" class="ghost">${ico('link')}Pair via agent or link</button></div>
          <div class="muted" id="ha-pair-msg" aria-live="polite"></div>
        </div>
      </details>
      </div>

      <div class="tabpanel" id="ha-mode-up" role="tabpanel" aria-labelledby="ha-mode-up-tab" style="display:none">
      <h3 id="ha-su-title">Create an account</h3>
      <p class="hf-sub">Three steps: a code to your email or phone, then a password, then you are in. The account is created already carrying the address it was proven on.</p>
      <div class="seg" id="ha-su-tabs" role="tablist" aria-label="Where to send the code">
        <button class="segb active" data-c="email" role="tab" aria-selected="true">Email</button>
        <button class="segb" data-c="phone" role="tab" aria-selected="false"${soonAttrs}>Phone</button>
      </div>
      ${soonNote('ha-su-soon')}
      <label for="ha-su-id">Where should we send your code?</label>
      <div class="row"><input id="ha-su-id" type="email" placeholder="you@example.com" autocomplete="username"/><button id="ha-su-send">Send code</button></div>
      <div class="muted" id="ha-su-sms-consent" style="font-size:12px;margin-top:4px;display:none">By tapping Send code you agree to receive one text with a one-time code from XMBL, the operator of Handoff, at this number. One message per request, no marketing. Msg &amp; data rates may apply. Reply STOP to opt out, HELP for help. <a href="/legal/privacy.html" target="_blank" rel="noopener">Privacy</a> · <a href="/legal/terms.html" target="_blank" rel="noopener">Terms</a></div>
      <div class="muted" id="ha-su-msg1" aria-live="polite"></div>
      <div id="ha-su-step2" style="display:none">
        <label for="ha-su-code">Enter the 6-digit code we just sent</label>
        <div class="row"><input id="ha-su-code" class="otp" placeholder="000000" inputmode="numeric" maxlength="6" autocomplete="one-time-code"/><button id="ha-su-verify">Verify</button></div>
        <div class="muted" id="ha-su-msg2" aria-live="polite"></div>
      </div>
      </div>`);
    document.body.appendChild(m);
    const box = m.querySelector('.hf-box');
    const close = () => hideModal(m);
    m.querySelector('.hf-x').onclick = close;
    m.onclick = (e) => { if (e.target === m) close(); };
    dialogManners(m, box, close);

    // THE TWO FLOWS. Both panels stay in the DOM and the strip shows one. Hidden with display:none, not
    // opacity, so the focus trap in dialogManners (shown()) and focusFirst see exactly the
    // visible flow. The dialog is named by whichever heading is showing.
    const modeBtns = [...m.querySelectorAll('#ha-mode .tab')];
    const modePanels = { in: m.querySelector('#ha-mode-in'), up: m.querySelector('#ha-mode-up') };
    const setMode = (k) => {
      modeBtns.forEach(b => { const on = b.dataset.mode === k; b.classList.toggle('active', on); b.setAttribute('aria-selected', String(on)); });
      Object.entries(modePanels).forEach(([n, p]) => { const on = n === k; p.style.display = on ? '' : 'none'; p.classList.toggle('active', on); });
      box.setAttribute('aria-labelledby', k === 'up' ? 'ha-su-title' : 'ha-title');
      focusFirst(modePanels[k]);
    };
    modeBtns.forEach(b => b.onclick = () => setMode(b.dataset.mode));

    // method picker inside Sign in (self-contained — doesn't depend on H.tabs / handoff.js being loaded on this page)
    const tabBtns = [...m.querySelectorAll('#ha-tabs .segb')];
    const panels = { pw: m.querySelector('#ha-panel-pw'), em: m.querySelector('#ha-panel-em'), ph: m.querySelector('#ha-panel-ph') };
    tabBtns.forEach(b => b.onclick = () => {
      tabBtns.forEach(x => { const on = x === b; x.classList.toggle('active', on); x.setAttribute('aria-selected', String(on)); });
      Object.entries(panels).forEach(([k, p]) => { const on = k === b.dataset.tab; p.style.display = on ? '' : 'none'; p.classList.toggle('active', on); });
      const f = panels[b.dataset.tab].querySelector('input'); if (f) f.focus();
    });

    const finish = (tok) => { setToken(tok); close(); };

    // ---- password (identifier is ANY of user id / username / email / phone) ----
    const doLogin = () => busy(m.querySelector('#ha-login'), async () => {
      const identifier = m.querySelector('#ha-email').value.trim(), password = m.querySelector('#ha-pass').value;
      const msg = m.querySelector('#ha-login-msg'); msg.className = 'muted'; msg.textContent = 'signing in…';
      progress(m, await post('/auth/login', { identifier, password }), finish, msg);
    });
    m.querySelector('#ha-login').onclick = doLogin;
    m.querySelector('#ha-pass').onkeydown = e => { if (e.key === 'Enter') doLogin(); };
    m.querySelector('#ha-forgot').onclick = () => renderForgotPassword(m, finish);

    // ---- email OTP ----
    m.querySelector('#ha-em-send').onclick = (e) => busy(e.currentTarget, async () => {
      const email = m.querySelector('#ha-em-email').value.trim();
      const msg = m.querySelector('#ha-em-msg'); msg.className = 'muted'; msg.textContent = 'sending…';
      const r = await post('/auth/otp/request', { email });
      msg.textContent = r.message || r.error || 'sent — check your email';
      if (r.success) { m.querySelector('#ha-em-code-row').style.display = ''; m.querySelector('#ha-em-code').focus();
        const sb = m.querySelector('#ha-em-send'); sb.classList.add('ghost'); sb.textContent = 'Resend'; }
    });
    const doEmailVerify = () => busy(m.querySelector('#ha-em-verify'), async () => {
      const email = m.querySelector('#ha-em-email').value.trim(), code = m.querySelector('#ha-em-code').value.trim();
      const msg = m.querySelector('#ha-em-msg'); msg.className = 'muted'; msg.textContent = 'verifying…';
      progress(m, await post('/auth/otp/verify', { email, code }), finish, msg);
    });
    m.querySelector('#ha-em-verify').onclick = doEmailVerify;
    m.querySelector('#ha-em-code').onkeydown = e => { if (e.key === 'Enter') doEmailVerify(); };

    // ---- SMS OTP ----
    m.querySelector('#ha-ph-send').onclick = (e) => busy(e.currentTarget, async () => {
      const msg = m.querySelector('#ha-ph-msg');
      const phone = takePhone(m.querySelector('#ha-ph-phone'), msg); if (!phone) return;
      msg.className = 'muted'; msg.textContent = 'sending…';
      const r = await post('/auth/sms/request', { phone });
      // `sms_sent:false` is the server saying it has no SMS provider — a 200 with nothing delivered. Showing
      // the code field then would be asking for a code that is not coming.
      const sent = !!r.success && r.sms_sent !== false;
      msg.className = sent ? 'muted' : 'err';
      msg.textContent = r.message || r.error || (sent ? 'sent — check your phone' : 'could not send');
      if (sent) { m.querySelector('#ha-ph-code-row').style.display = ''; m.querySelector('#ha-ph-code').focus();
        const sb = m.querySelector('#ha-ph-send'); sb.classList.add('ghost'); sb.textContent = 'Resend'; }
    });
    const doPhoneVerify = () => busy(m.querySelector('#ha-ph-verify'), async () => {
      const msg = m.querySelector('#ha-ph-msg');
      const phone = takePhone(m.querySelector('#ha-ph-phone'), msg); if (!phone) return;
      const code = m.querySelector('#ha-ph-code').value.trim();
      msg.className = 'muted'; msg.textContent = 'verifying…';
      progress(m, await post('/auth/sms/verify', { phone, code }), finish, msg);
    });
    m.querySelector('#ha-ph-verify').onclick = doPhoneVerify;
    m.querySelector('#ha-ph-code').onkeydown = e => { if (e.key === 'Enter') doPhoneVerify(); };

    // ---- passkey: no identifier typed, the authenticator names the account ----
    if (passkeysAvailable()) {
      m.querySelector('#ha-pk-row').style.display = '';
      m.querySelector('#ha-pk').onclick = (e) => busy(e.currentTarget, async () => {
        const msg = m.querySelector('#ha-pk-msg'); msg.className = 'muted'; msg.textContent = 'waiting for your device…';
        progress(m, await passkeyAssert(), finish, msg);
      });
    }

    // ---- token / pair ----
    m.querySelector('#ha-usetoken').onclick = () => { const v = m.querySelector('#ha-token').value.trim(); if (v) finish(v); };
    m.querySelector('#ha-pair').onclick = async () => {
      const r = await post('/auth/pair/start', {});
      const code = r.pair_code;
      const pairBase = AUTH_BASE || origin;
      const pairUrl = `${pairBase}/pair.html?code=${code}`;
      const curlCmd = `curl -s -X POST ${pairBase}/api/v1/auth/pair/claim -H "Content-Type: application/json" -d '{"pair_code":"${code}","machine_id":"YOUR_MACHINE_ID"}'`;
      const pm = m.querySelector('#ha-pair-msg');
      paint(pm, `<div style="margin-top:8px">Have an agent on your machine call:</div><code>${curlCmd}</code>
        <div style="margin-top:10px">Or open this link there: <a href="${pairUrl}" target="_blank" rel="noopener">${pairUrl}</a></div>
        <div style="margin-top:10px"><span>waiting for pairing to complete…</span></div>`);
      const t0 = Date.now(); const iv = setInterval(async () => {
        if (Date.now() - t0 > 600000) { clearInterval(iv); pm.querySelector('span').textContent = 'pairing expired'; return; }
        try { const p = await (await fetch(AUTH_BASE + '/api/v1/auth/pair/poll?code=' + encodeURIComponent(code), { cache: 'no-cache' })).json();
          if (p.token) { clearInterval(iv); finish(p.token); } } catch (e) {}
      }, 2000);
    };

    bindSignUp(m, finish);
    setMode(opts.create ? 'up' : 'in');
    // A sign-in begun in a form on the page (signIn() below) continues here only for the parts that need the
    // whole ceremony: the rest of a multi-factor ladder, or a forgotten password.
    if (opts.step) renderFactorStep(m, opts.step, finish);
    else if (opts.forgot) renderForgotPassword(m, finish);
  }

  // Sign-in without the modal, for a form that lives on a page (the homepage intake). finishLogin reads a login
  // response the way progress() does: a token finishes here; an account that asks for more than one factor
  // continues in the modal at its next factor; anything else comes back as the server's error for the form.
  function finishLogin(r) {
    if (r && r.token) { setToken(r.token); return { success: true }; }
    if (r && r.login_session) { openSignIn({ step: r }); return { success: false, step: true }; }
    return { success: false, error: (r && r.error) || 'sign-in failed' };
  }
  async function signInWith(path, body) { return finishLogin(await post(path, body)); }
  async function signIn(identifier, password) { return signInWith('/auth/login', { identifier, password }); }

  // ---- CREATE AN ACCOUNT: identifier -> one-time code -> password -> second factor ----
  // The identifier is proven BEFORE the account exists, so a new account is never sitting on an unverified
  // address. Step 1's response is deliberately identical whether or not the address is already registered —
  // it is the same non-enumerating shape as the sign-in code routes, so this screen can't be used to ask
  // "who has an account here". Someone who already has one simply signs in instead.
  // Steps 1–2 are the Create-account TAB PANEL, painted by openSignIn beside the sign-in flow rather than
  // over it, so the strip at the top survives and "I meant to sign in" is a tab click. Step 3 (renderSetup)
  // takes the whole box: by then the account exists and the choice the tabs offered has been made.
  function bindSignUp(m, finish) {
    const box = m.querySelector('#ha-mode-up');
    let channel = 'email';
    const tabs = [...box.querySelectorAll('#ha-su-tabs .segb')];
    tabs.forEach(b => b.onclick = () => {
      tabs.forEach(x => { const on = x === b; x.classList.toggle('active', on); x.setAttribute('aria-selected', String(on)); });
      channel = b.dataset.c;
      const inp = box.querySelector('#ha-su-id');
      inp.type = channel === 'email' ? 'email' : 'tel';
      inp.placeholder = channel === 'email' ? 'you@example.com' : '+14155551234';
      inp.value = '';
      // The SMS consent line is what the carriers registered our toll-free number against — it must be on
      // screen whenever a phone number is being asked for, and only then.
      box.querySelector('#ha-su-sms-consent').style.display = channel === 'phone' ? '' : 'none';
      // Phone is on the picker but not live: the field and the button go dead and the note above says why.
      const off = channel === 'phone' && !SMS_LIVE;
      inp.disabled = off; box.querySelector('#ha-su-send').disabled = off;
      const note = box.querySelector('#ha-su-soon'); if (note) note.style.display = channel === 'phone' ? '' : 'none';
    });
    const suNote = box.querySelector('#ha-su-soon'); if (suNote) suNote.style.display = 'none';
    // One reader for the identifier field, for both steps: an email is taken as typed, a phone is normalised
    // and checked first so a badly-formed number is explained here rather than by a 400 from the server.
    const takeId = (msg) => channel === 'email' ? box.querySelector('#ha-su-id').value.trim() : takePhone(box.querySelector('#ha-su-id'), msg);
    box.querySelector('#ha-su-send').onclick = (e) => busy(e.currentTarget, async () => {
      const msg = box.querySelector('#ha-su-msg1');
      const v = takeId(msg); if (!v) return;
      msg.className = 'muted'; msg.textContent = 'sending…';
      const r = await post('/auth/signup/request', channel === 'email' ? { email: v } : { phone: v });
      if (!r.success || r.sms_sent === false) { msg.className = 'err'; msg.textContent = r.error || r.message || 'could not send'; return; }
      msg.textContent = r.message;
      box.querySelector('#ha-su-step2').style.display = '';
      const sb = box.querySelector('#ha-su-send'); sb.classList.add('ghost'); sb.textContent = 'Resend';
      box.querySelector('#ha-su-code').focus();
    });
    const verify = () => busy(box.querySelector('#ha-su-verify'), async () => {
      const msg = box.querySelector('#ha-su-msg2');
      const v = takeId(msg); if (!v) return;
      const code = box.querySelector('#ha-su-code').value.trim();
      msg.className = 'muted'; msg.textContent = 'verifying…';
      const r = await post('/auth/signup/verify', Object.assign({ code }, channel === 'email' ? { email: v } : { phone: v }));
      if (!r.token) { msg.className = 'err'; msg.textContent = r.error || 'invalid code'; return; }
      // The account exists and we hold its token — but it has no password and no second factor yet, which
      // is exactly what the next screen is for. Set it active first so enrolment calls are authenticated.
      setToken(r.token);
      renderSetup(m, r.token, finish, channel);
    });
    box.querySelector('#ha-su-verify').onclick = verify;
    box.querySelector('#ha-su-code').onkeydown = e => { if (e.key === 'Enter') verify(); };
  }

  // Step 3+4 of signup: a password, then the second factors. Nothing here is forced — an account may run on
  // its verified email code alone — but the ladder is put in front of the user once, at the only moment
  // they are guaranteed to be paying attention to their own security settings.
  function renderSetup(m, tok, finish, channel) {
    const box = m.querySelector('.hf-box');
    paint(box, `<button class="hf-x" aria-label="Close">${ico('x', 'ico')}</button>
      <h3>Secure your account</h3>
      <p class="hf-sub">Your ${channel === 'phone' ? 'phone number' : 'email address'} is verified, so you can already sign in with a code. Everything below is optional — and every one you add is a factor your sign-in rules can require.</p>
      <label for="ha-sp-pass">Create a password</label>
      <div class="row"><input id="ha-sp-pass" type="password" placeholder="password" autocomplete="new-password"/><button id="ha-sp-go">Set password</button></div>
      <div class="muted" style="font-size:12px;margin-top:4px">At least 10 characters. Length beats punctuation.</div>
      <div class="muted" id="ha-sp-msg" aria-live="polite"></div>
      <hr>
      <label>Add a second factor — you can add or change these any time in Manage</label>
      <div class="row">
        <button id="ha-sp-pk" class="ghost">${ico('key')}Passkey / biometrics</button>
        <button id="ha-sp-totp" class="ghost">${ico('phone')}Authenticator app</button>
      </div>
      <div class="muted" id="ha-sp-2fa" aria-live="polite"></div>
      <hr>
      <div class="row"><button id="ha-sp-done">Done — take me in</button></div>`);
    box.querySelector('.hf-x').onclick = () => hideModal(m);
    focusFirst(box);
    // ONE live plate on the screen, and it moves with the work: whatever is being asked for right now is
    // the filled button, and everything else steps back to an outline. Two plates at once is two answers
    // to "what do I press", which on a security screen is the difference between enrolling a factor and
    // skipping past it.
    const plate = (el) => {
      for (const b of box.querySelectorAll('button')) if (!b.classList.contains('hf-x') && !b.classList.contains('tab') && !b.classList.contains('linkish')) b.classList.add('ghost');
      if (el) el.classList.remove('ghost');
    };
    plate(box.querySelector('#ha-sp-go'));
    box.querySelector('#ha-sp-done').onclick = () => finish(tok);
    const pwMsg = box.querySelector('#ha-sp-msg');
    const go = () => busy(box.querySelector('#ha-sp-go'), async () => {
      pwMsg.className = 'muted'; pwMsg.textContent = 'saving…';
      const r = await authed('/auth/password', { password: box.querySelector('#ha-sp-pass').value });
      if (r.success) { pwMsg.className = 'ok'; pwMsg.textContent = 'password set'; plate(box.querySelector('#ha-sp-done')); }
      else { pwMsg.className = 'err'; pwMsg.textContent = r.error || 'could not set password'; }
    });
    box.querySelector('#ha-sp-go').onclick = go;
    box.querySelector('#ha-sp-pass').onkeydown = e => { if (e.key === 'Enter') go(); };

    const twoMsg = box.querySelector('#ha-sp-2fa');
    const pkBtn = box.querySelector('#ha-sp-pk');
    if (!passkeysAvailable()) { pkBtn.disabled = true; pkBtn.title = 'this browser has no passkey support'; }
    pkBtn.onclick = (e) => busy(e.currentTarget, async () => {
      twoMsg.className = 'muted'; twoMsg.textContent = 'waiting for your device…';
      const r = await enrollPasskey('This device');
      if (r.success) { twoMsg.className = 'ok'; twoMsg.textContent = 'passkey enrolled'; plate(box.querySelector('#ha-sp-done')); }
      else { twoMsg.className = 'err'; twoMsg.textContent = r.error || 'could not enrol'; }
    });
    box.querySelector('#ha-sp-totp').onclick = (e) => busy(e.currentTarget, async () => {
      twoMsg.className = 'muted'; twoMsg.textContent = 'setting up…';
      const s = await authed('/auth/2fa/totp/setup', {});
      if (!s.success) { twoMsg.className = 'err'; twoMsg.textContent = s.error || 'setup failed'; return; }
      twoMsg.className = 'muted';
      paint(twoMsg, `<div style="max-width:184px;margin:8px 0;background:#fff;padding:8px;line-height:0">${s.qr_svg || ''}</div>
        <div style="margin-bottom:6px">Scan it, or type this secret into your app: <code>${s.secret}</code></div>
        <div class="row"><input id="ha-sp-totp-code" class="otp" placeholder="000000" inputmode="numeric" maxlength="6" autocomplete="one-time-code" aria-label="6-digit code from your authenticator"/><button id="ha-sp-totp-go">Confirm</button></div>
        <div id="ha-sp-totp-msg" aria-live="polite"></div>`);
      const confirmTotp = (ev) => busy(ev && ev.currentTarget, async () => {
        const cm = twoMsg.querySelector('#ha-sp-totp-msg');
        const r = await authed('/auth/2fa/totp/confirm', { code: twoMsg.querySelector('#ha-sp-totp-code').value.trim() });
        if (r.success) { plate(box.querySelector('#ha-sp-done')); paint(cm, `<div class="ok">authenticator enabled</div><div style="margin-top:8px"><b>Save these recovery codes now — each is shown once and works once:</b></div><code style="display:block;margin-top:4px">${(r.backup_codes || []).join('  ')}</code>`); }
        else { cm.className = 'err'; cm.textContent = r.error || 'code did not match'; }
      });
      plate(twoMsg.querySelector('#ha-sp-totp-go'));
      twoMsg.querySelector('#ha-sp-totp-go').onclick = confirmTotp;
      twoMsg.querySelector('#ha-sp-totp-code').onkeydown = e => { if (e.key === 'Enter') confirmTotp(); };
      twoMsg.querySelector('#ha-sp-totp-code').focus();
    });
  }

  // Going "back" restores the sign-in markup verbatim, which leaves it with no listeners — rebind them by
  // dropping the modal and reopening, which is the one path that is guaranteed to stay in step with it.
  function openSignInHandlers(m, finish) {
    const opener = m.__opener;
    m.remove();
    openSignIn({ opener });
  }

  // Forgot-password: takes over the whole box (same pattern as the step-up screen). PROVE FIRST, THEN CHOOSE
  // — request a code by email, redeem it (that is one factor), climb whatever else the account's policy asks
  // for, and only then type a new password. Nothing is sent to the server until it has proven who is asking,
  // so there is no moment where a password sits half-applied waiting on a ladder.
  function renderForgotPassword(m, finish) {
    const box = m.querySelector('.hf-box');
    const prevHtml = box.innerHTML;
    paint(box, `<button class="hf-x" aria-label="Close">${ico('x', 'ico')}</button>
      <h3>Reset your password</h3>
      <p class="hf-sub">We'll prove the account is yours first, then you pick the new password. Nothing changes until you do.</p>
      <label for="ha-fp-email">The email on your account</label>
      <div class="row"><input id="ha-fp-email" type="email" placeholder="you@example.com" autocomplete="username"/><button id="ha-fp-send">Send reset code</button></div>
      <div class="muted" id="ha-fp-msg1" aria-live="polite"></div>
      <div id="ha-fp-step2" style="display:none">
        <label for="ha-fp-code">Code from that email</label>
        <div class="row"><input id="ha-fp-code" class="otp" placeholder="000000" inputmode="numeric" maxlength="6" autocomplete="one-time-code"/><button id="ha-fp-go">Continue</button></div>
        <div class="muted" id="ha-fp-msg2" aria-live="polite">You'll choose the new password once this account is proven.</div>
      </div>
      <hr>
      <div class="row"><button class="linkish" id="ha-fp-back">${ico('back')}Back to sign in</button></div>`);
    box.querySelector('.hf-x').onclick = () => hideModal(m);
    focusFirst(box);
    box.querySelector('#ha-fp-back').onclick = () => { paint(box, prevHtml); openSignInHandlers(m, finish); };
    box.querySelector('#ha-fp-send').onclick = (e) => busy(e.currentTarget, async () => {
      const email = box.querySelector('#ha-fp-email').value.trim();
      const msg = box.querySelector('#ha-fp-msg1'); msg.className = 'muted'; msg.textContent = 'sending…';
      const r = await post('/auth/password/forgot', { email });
      msg.textContent = r.message || r.error || 'sent — check your email';
      // The live action moves to Continue; sending the code again is now the secondary thing to do here,
      // and two acid plates on one screen means neither of them is the one to press.
      if (r.success) {
        box.querySelector('#ha-fp-step2').style.display = '';
        box.querySelector('#ha-fp-send').classList.add('ghost');
        box.querySelector('#ha-fp-send').textContent = 'Resend';
        box.querySelector('#ha-fp-code').focus();
      }
    });
    box.querySelector('#ha-fp-go').onclick = (e) => busy(e.currentTarget, async () => {
      const email = box.querySelector('#ha-fp-email').value.trim(), code = box.querySelector('#ha-fp-code').value.trim();
      const msg = box.querySelector('#ha-fp-msg2'); msg.className = 'muted'; msg.textContent = 'checking…';
      // The reset IS a login ceremony: the emailed code counts as one factor, and no password is sent with
      // it. One call for a single-factor account, a ladder for anything stricter — either way progress()
      // reads the same shape it reads everywhere else, and the password screen comes after the token.
      progress(m, await post('/auth/password/reset', { email, code }), t => renderNewPassword(m, t, finish), msg);
    });
  }

  // The LAST step of a recovery, never the first: the account has already met its own factor policy and the
  // token below carries a one-shot credential grant. Setting the password here also ends every other session
  // — which is the point, if the reason for the reset was that someone else had one.
  function renderNewPassword(m, tok, finish) {
    const box = m.querySelector('.hf-box');
    paint(box, `<button class="hf-x" aria-label="Close">${ico('x', 'ico')}</button>
      <h3>Choose a new password</h3>
      <p class="hf-sub">${ico('shield', 'ico')} The account is proven and you're back in. Setting a password here also closes every other session signed in to it.</p>
      <label for="ha-np-pass">New password</label>
      <div class="row"><input id="ha-np-pass" type="password" placeholder="password" autocomplete="new-password"/><button id="ha-np-go">Set password</button></div>
      <div class="muted" style="font-size:12px;margin-top:4px">At least 10 characters. Length beats punctuation.</div>
      <div class="muted" id="ha-np-msg" aria-live="polite"></div>
      <hr>
      <div class="row"><button class="linkish" id="ha-np-skip">Skip — just sign me in</button></div>`);
    box.querySelector('.hf-x').onclick = () => hideModal(m);
    box.querySelector('#ha-np-skip').onclick = () => finish(tok);
    focusFirst(box);
    const msg = box.querySelector('#ha-np-msg');
    const go = () => busy(box.querySelector('#ha-np-go'), async () => {
      const password = box.querySelector('#ha-np-pass').value;
      msg.className = 'muted'; msg.textContent = 'saving…';
      const r = await postAs(tok, '/auth/password', { password });
      if (!r.success) { msg.className = 'err'; msg.textContent = r.error || 'could not set password'; return; }
      msg.className = 'ok'; msg.textContent = 'password set — signing you in…';
      finish(tok);
    });
    box.querySelector('#ha-np-go').onclick = go;
    box.querySelector('#ha-np-pass').onkeydown = e => { if (e.key === 'Enter') go(); };
  }

  // SIGN IN WITH HANDOFF ON socnet.lol AND miniapps.lol. Those are handoff's own sites on their own origins: their
  // storage holds no handoff.lol session, and the panel above is styled by /handoff.css, which they do not load. There,
  // signing in is the OAuth code flow of src/oauth.ts — handoff.lol's account chooser and consent, then back to this
  // site's root with a code that this page trades at its OWN /oauth/token (the broker answers it on these hosts) for an
  // ordinary session token. Same list as isProductDomain (src/domains.ts). Never active on handoff.lol: its
  // /oauth/authorize page loads this file and calls openSignIn when nobody is signed in, so a redirect there would loop.
  const PRODUCT = typeof location !== 'undefined' ? /^(?:www\.)?(socnet\.lol|miniapps\.lol)$/.exec(location.hostname || '') : null;
  const SITE = PRODUCT ? PRODUCT[1] : '';
  const PENDING = 'handoff_signin_pending';     // sessionStorage: {state, verifier, back} for the one sign-in in flight
  const ss = {
    get(k) { try { return sessionStorage.getItem(k); } catch (e) { return null; } },
    set(k, v) { try { sessionStorage.setItem(k, v); } catch (e) {} },
    del(k) { try { sessionStorage.removeItem(k); } catch (e) {} },
  };
  const b64url = bytes => btoa(String.fromCharCode.apply(null, new Uint8Array(bytes))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  async function signInWithHandoff() {
    const rnd = n => { const a = new Uint8Array(n); crypto.getRandomValues(a); return b64url(a); };
    const verifier = rnd(32), state = rnd(16);
    const challenge = b64url(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(verifier)));
    ss.set(PENDING, JSON.stringify({ state, verifier, back: location.pathname + location.search + location.hash }));
    const q = new URLSearchParams({ response_type: 'code', client_id: SITE, redirect_uri: 'https://' + SITE + '/', code_challenge: challenge, code_challenge_method: 'S256', state, scope: 'mcp' });
    location.assign('https://handoff.lol/oauth/authorize?' + q.toString());
  }
  // The return leg. Runs as this file loads, before the app reads the address: the code and state leave the URL at
  // once (the visitor lands back where they pressed Sign in), then the exchange signs them in and onChange fires.
  // A state this tab did not start is not ours, and the URL is left to the app.
  let signInReturn = Promise.resolve(false);
  if (SITE) {
    const q = new URLSearchParams(location.search);
    let p = null; try { p = JSON.parse(ss.get(PENDING) || 'null'); } catch (e) { p = null; }
    if (p && q.get('state') && q.get('state') === p.state && (q.has('code') || q.has('error'))) {
      ss.del(PENDING);
      try { history.replaceState(history.state, '', p.back || '/'); } catch (e) {}
      const code = q.get('code');
      if (code) {
        const body = new URLSearchParams({ grant_type: 'authorization_code', code, redirect_uri: 'https://' + SITE + '/', client_id: SITE, code_verifier: p.verifier });
        signInReturn = fetch(AUTH_BASE + '/oauth/token', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: body.toString() })
          .then(r => r.json())
          .then(j => {
            if (j && j.access_token) { setToken(j.access_token); return true; }
            console.warn('handoff sign-in refused:', (j && (j.error_description || j.error)) || 'no token');
            return false;
          }, e => { console.warn('handoff sign-in failed:', e); return false; });
      }
    }
  }

  // THE DOOR, until the site draws its own. A product site whose bundle has no Sign in control (socnet-lol 1.0 and
  // miniapps-lol 1.0 had none) still gets one: a "Sign in with handoff" button in the corner while nobody is signed in.
  // A bundle that draws its own declares <meta name="handoff-signin" content="app"> and this one never appears.
  if (SITE && typeof document !== 'undefined' && document.addEventListener) {
    const door = () => {
      if (!document.body || document.querySelector('meta[name="handoff-signin"][content="app"]')) return;
      const b = document.createElement('button');
      b.type = 'button'; b.id = 'handoff-signin'; b.textContent = 'Sign in with handoff';
      b.style.cssText = 'position:fixed;top:12px;right:12px;z-index:2147483000;padding:9px 16px;border:0;border-radius:999px;'
        + 'background:#fff;color:#14161f;font:600 14px/1.2 system-ui,-apple-system,Segoe UI,sans-serif;cursor:pointer;'
        + 'box-shadow:0 0 0 1px rgba(20,22,31,.18),0 2px 10px rgba(0,0,0,.28)';
      b.onclick = () => { b.disabled = true; b.textContent = 'Opening handoff…'; signInWithHandoff(); };
      const paint = () => { b.hidden = !!token(); };
      paint(); onChange(paint);
      document.body.appendChild(b);
    };
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', door); else door();
  }

  // A page's own small settings (lol-kit keeps the agent a site acts as under "actor:<site>"): published bundles may not
  // name localStorage, so they keep them here. pref(k) reads, pref(k, '') forgets, pref(k, v) stores a string.
  function pref(k, v) {
    const key = 'handoff_pref:' + String(k);
    if (v === undefined) return ls.get(key);
    if (v === '' || v === null) { ls.del(key); return null; }
    ls.set(key, String(v)); return String(v);
  }

  // The page that frames this one, when it is the same origin and carries the session library (src/host-router.ts
  // ONE FRAME). Sign in has to happen at the top: handoff.lol's authorize page will not render inside a frame.
  function framedBy() { try { return window.top !== window && window.top.HandoffAuth ? window.top.HandoffAuth : null; } catch (_) { return null; } }

  return { token, setToken, onChange, me, signOut, signIn, signInWith, finishLogin, authPost: post, authHeaders, accounts, switchTo, pref,
           // on a product site "Sign in" IS Sign in with handoff; the step-up ladder (opts.step) still needs the panel
           // ...and inside the ONE FRAME (a site's miniapp framed under the handoff header) it is the header's own
           openSignIn: SITE ? (opts => { const top = framedBy(); if (top) return top.openSignIn(opts); return (opts && opts.step) ? openSignIn(opts) : signInWithHandoff(); }) : openSignIn,
           signInWithHandoff: SITE ? signInWithHandoff : null, signInReturn,
           enrollPasskey, passkeyAssert, passkeysAvailable, smsLive: SMS_LIVE, smsPending: SMS_PENDING };
})();
