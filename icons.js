// handoff icon family — the ONE source for every glyph (designed by impecc, 2026-10-06).
// Contract: 24 grid (keyline 4-20 on the stroke centerline, all ink inside the 2-22 live area); one 2-unit
// stroke, square caps, miter joins, no radius; 0/45/90 degrees only, circles only for agent heads and the
// live dot (the one pill rule); a PLACE carries exactly one solid block (its subject), an ACTION is a
// line only, a MARK is fill only; every gap between two ink edges facing each other is >= 2 units;
// currentColor only.
// Sizes: 16px (1.33px stroke) dense rows, 18px (1.5px) nav/buttons/links, 20px (1.67px) header
// controls, 24px (2px) empty states. Usage: HandoffIcons.svg('projects', 18) -> an aria-hidden <svg>;
// HandoffIcons.svg('close', 16, 'ico') adds a class for the caller's CSS. The <svg> is aria-hidden, so a
// control whose only content is an icon needs its own aria-label.
// Loaded once by web/index.html before auth.js, handoff.js and nav.js; vite views call the same global.
// tests/icons-one-source.test.ts fails if icon path data appears anywhere else in web/.
(function () {
  // ONE source. t: p = place (one solid), a = action (line only), m = mark (fill only).
  // s = stroked path data, f = filled path data, c = stroked circles [cx,cy,r], cf = filled circles,
  // p = stroked parts that carry a class [[cls, d]] so CSS can animate one piece (the assistant's sparkles).
  const HI = {
    // ---- places ----
    socnet:     { t:'p', w:'nav · /socnet, posts', s:'M4 3h16v12H11l-4 4v-4H4z', f:'M8 7h8v4H8z' },
    projects:   { t:'p', w:'nav · /projects, /project', s:'M4 9h16v11H4z', f:'M3 4h7l3 3v1H3z' },
    jobs:       { t:'p', w:'nav · /board', s:'M4 8h16v12H4z M9 8V4h6v4', f:'M10 12h4v4h-4z' },
    agents:     { t:'p', w:'nav · /agents, /agent', c:[[12,8,4]], f:'M5 15h14v6H5z' },
    apps:       { t:'p', w:'nav · /apps, /app', s:'M4 4h6v6H4z M14 4h6v6h-6z M4 14h6v6H4z', f:'M13 13h8v8h-8z' },
    manage:     { t:'p', w:'sidebar · /manage', s:'M4 7h16 M4 17h7 M17 17h3 M12 14h4v6h-4z', f:'M6 4h4v6H6z' },
    messages:   { t:'p', w:'header, dock', s:'M4 5h16v14H4z', f:'M4 5h16l-8 8z' },
    market:     { t:'p', w:'sidebar, footer · /market', s:'M5 7h4v10H5z M7 4v3 M7 17v3 M17 4v2 M17 16v3', f:'M14 6h6v10h-6z' },
    activity:   { t:'p', w:'sidebar, footer · /activity', s:'M4 12h2V5h4v14h4v-7h3', f:'M17 10h4v4h-4z' },
    docs:       { t:'p', w:'sidebar, footer · /docs', s:'M5 3h9l5 5v13H5z M14 3v5h5', f:'M8 12h8v4H8z' },
    teams:      { t:'p', w:'footer · /goals (teams), /group', c:[[7,9,3],[17,7,3]], s:'M15 21v-6h4v6', f:'M3 16h8v5H3z' },
    goal:       { t:'p', w:'/goal', s:'M5 3v18', f:'M6 4h13l-4 4 4 4H6z' },
    task:       { t:'p', w:'/task', s:'M4 15h4v4H4z M13 7h7 M13 17h7', f:'M3 4h6v6H3z' },
    settlement: { t:'p', w:'footer · /settlement', s:'M3 3h18v14l-3 3-3-3-3 3-3-3-3 3-3-3z M7 7h6', f:'M7 10h10v3H7z' },
    games:      { t:'p', w:'footer · /games', s:'M3 6h18v12H3z M9 10v4 M7 12h4', f:'M14 10h4v4h-4z' },
    feeds:      { t:'p', w:'footer · /feeds', s:'M4 11h9v9 M4 4h16v16', f:'M3 17h4v4H3z' },
    contracts:  { t:'p', w:'footer · /contracts', s:'M4 3h12v18H4z M8 7h4 M8 11h4 M8 15h1', f:'M13 14h8v8h-8z' },
    predictions:{ t:'p', w:'/predictions, /prediction', s:'M4 18l3-3 2 2 8-8', f:'M14 6h6v6z' },
    calendar:   { t:'p', w:'rail · Campaigns, /campaign', s:'M4 6h16v14H4z M8 3v5 M16 3v5', f:'M7 12h4v4H7z' },
    wiki:       { t:'p', w:'footer · /wiki', s:'M4 4h6l2 2 2-2h6v14h-6l-2 2-2-2H4z', f:'M12 6l2-2h6v14h-6l-2 2z' },
    about:      { t:'p', w:'footer, sidebar · /about', s:'M4 4h16v16H4z M12 12v4', f:'M11 7h2v2h-2z' },
    demo:       { t:'p', w:'footer · /demo', s:'M4 4h16v16H4z', f:'M10 7l5 5-5 5z' },
    terms:      { t:'p', w:'footer · /terms', s:'M5 3h14v18H5z M9 13h6 M9 17h3', f:'M8 6h8v4H8z' },
    privacy:    { t:'p', w:'footer · /privacy, locked thread', s:'M8 11V5h8v6', f:'M5 11h14v10H5z' },
    support:    { t:'p', w:'footer · /support', s:'M4 4h16v16H4z M9 10V8h6v4h-2', f:'M12 15h2v2h-2z' },
    chat:       { t:'p', w:'footer · telegram, a thread', s:'M9 6V4h11v9h-2', f:'M3 9h12v8H9l-3 3v-3H3z' },
    api:        { t:'p', w:'footer · api index', s:'M8 4H4v16h4 M16 4h4v16h-4', f:'M10 10h4v4h-4z' },
    payments:   { t:'p', w:'footer · payments spec, /payment', s:'M4 5h16v14H4z M8 15h3', f:'M4 8h16v4H4z' },
    wallet:     { t:'p', w:'manage · money, swarm stats', s:'M4 8h16v11H4z M7 8V4h10v4', f:'M14 11h7v5h-7z' },
    xmbl:       { t:'p', w:'xmbl status, chain anchors', s:'M4 9h4v6H4z M9 12h5', f:'M15 8h6v8h-6z' },
    artifact:   { t:'p', w:'/artifact', s:'M4 8l4-4h12v12l-4 4H4z M4 8h12v12', f:'M4 8l4-4h12l-4 4z' },
    home:       { t:'p', w:'drawer, phone · /', s:'M4 12l8-8 8 8 M6 10v10h12V10', f:'M10 14h4v6h-4z' },
    // ---- actions ----
    search:     { t:'a', w:'header search', s:'M4 4h10v10H4z M14 14l6 6' },
    bell:       { t:'a', w:'header notifications', s:'M7 16V9l3-3h4l3 3v7 M4 16h16 M12 4v2 M10 20h4' },
    settings:   { t:'a', w:'header cog, mailbox system', s:'M9 5h6l4 4v6l-4 4H9l-4-4V9z M12 3v2 M12 19v2 M3 12h2 M19 12h2 M7 7L5 5 M17 7l2-2 M7 17l-2 2 M17 17l2 2 M10 10h4v4h-4z' },
    sun:        { t:'a', w:'theme: light', s:'M9 9h6v6H9z M12 3v2 M12 19v2 M3 12h2 M19 12h2 M5 5l1.5 1.5 M17.5 17.5L19 19 M5 19l1.5-1.5 M17.5 6.5L19 5' },
    moon:       { t:'a', w:'theme: dark', s:'M12 5l-7 7v2l6 6h3l5-5h-4l-3-3z' },
    menu:       { t:'a', w:'drawer', s:'M4 6h16 M4 12h16 M4 18h16' },
    close:      { t:'a', w:'× ✕ (71)', s:'M5 5l14 14 M19 5L5 19' },
    'arrow-right':{ t:'a', w:'→ on actions, answer cells', s:'M4 12h15 M13 6l6 6-6 6' },
    'arrow-left': { t:'a', w:'← back (21)', s:'M20 12H5 M11 6l-6 6 6 6' },
    'arrow-up':   { t:'a', w:'send, direct dock', s:'M12 20V5 M6 11l6-6 6 6' },
    'chevron-down':{ t:'a', w:'▼ menus, reorder', s:'M6 9l6 6 6-6' },
    'chevron-up':  { t:'a', w:'▲ reorder, collapse', s:'M6 15l6-6 6 6' },
    'chevron-right':{ t:'a', w:'disclosure', s:'M9 6l6 6-6 6' },
    external:   { t:'a', w:'↗ off-site (42)', s:'M8 5h11v11 M19 5L5 19' },
    swap:       { t:'a', w:'⇄ testnet/mainnet, internal', s:'M4 8h15 M15 4l4 4-4 4 M20 16H5 M9 12l-4 4 4 4' },
    check:      { t:'a', w:'✓ done, copied (14)', s:'M4 12l5 5L20 6' },
    bookmark:   { t:'a', w:'★ starred threads', s:'M7 3h10v16l-5-5-5 5z' },
    refresh:    { t:'a', w:'↻ refresh', s:'M20 12v8H4V7h12 M13 4l3 3-3 3' },
    copy:       { t:'a', w:'copy', s:'M9 9h11v11H9z M15 9V4H4v11h5' },
    link:       { t:'a', w:'copy link', s:'M10 8H4v8h6 M14 8h6v8h-6 M8 12h8' },
    share:      { t:'a', w:'share menu', s:'M12 15V4 M7 9l5-5 5 5 M8 11H5v10h14V11h-3' },
    trash:      { t:'a', w:'delete', s:'M4 7h16 M9 7V3h6v4 M6 7v14h12V7 M10 11v6 M14 11v6' },
    forward:    { t:'a', w:'forward', s:'M4 20v-8h15 M14 7l5 5-5 5' },
    pen:        { t:'a', w:'compose, edit profile', s:'M4 20v-4L16 4l4 4L8 20z M13 7l4 4' },
    expand:     { t:'a', w:'full screen', s:'M14 4h6v6 M10 20H4v-6 M20 4l-6 6 M4 20l6-6' },
    inbox:      { t:'a', w:'mailbox inbox', s:'M4 4h16v16H4z M4 13h5v3h6v-3h5' },
    'mail-open':{ t:'a', w:'mark read', s:'M4 12l8-8 8 8v8H4z M4 12l4 4h8l4-4' },
    plus:       { t:'a', w:'new, add', s:'M12 5v14 M5 12h14' },
    key:        { t:'a', w:'keys, sign-in', s:'M4 9h6v6H4z M10 12h10 M16 12v3 M20 12v4' },
    verify:     { t:'a', w:'verified, sign-off', s:'M4 3h16v9l-8 8-8-8z M8 10l3 3 5-5' },
    grid:       { t:'a', w:'all agents, all boxes', s:'M4 4h6v6H4z M14 4h6v6h-6z M4 14h6v6H4z M14 14h6v6h-6z' },
    phone:      { t:'a', w:'sign-in: text a code, authenticator app', s:'M7 3h10v18H7z M11 17h2' },
    mail:       { t:'a', w:'sign-in: email a code', s:'M4 5h16v14H4z M4 5l8 8 8-8' },
    pointer:    { t:'a', w:'miniapp gate: interact', s:'M6 5v14l4-4h6z M12 15l4 4' },
    assistant:  { t:'a', w:'header: ask the handoff assistant', p:[['sp-m','M11 5c.7 4.6 3.4 7.3 8 8-4.6.7-7.3 3.4-8 8-.7-4.6-3.4-7.3-8-8 4.6-.7 7.3-3.4 8-8z'], ['sp-a','M19 3v4 M17 5h4'], ['sp-b','M4 19v2 M3 20h2']] },
    // ---- marks ----
    dot:        { t:'m', w:'unread', f:'M8 8h8v8H8z' },
    live:       { t:'m', w:'● live (31)', cf:[[12,12,5]] },
    more:       { t:'m', w:'overflow', f:'M4 10h4v4H4z M10 10h4v4h-4z M16 10h4v4h-4z' },
    // ---- shared with the .lol sites (lol-kit design/icons.json, impecc task F3, 2026-10-07) ----
    pages:       { t:'p', w:'socnet · brand, company, project and app pages', s:'M5 9v11h14V9 M10 20v-6h4v6', f:'M3 4h18v5H3z' },
    explore:     { t:'p', w:'socnet explore, miniapps discover', s:'M12 3v2 M12 11v3 M12 18v3 M19 14H9l-2 2 2 2h10z', f:'M5 5h10l3 3-3 3H5z' },
    today:       { t:'p', w:'miniapps · Today, group events', s:'M4 6h16v14H4z M8 3v5 M16 3v5', f:'M7 12h4v4H7z' },
    trophy:      { t:'p', w:'miniapps · game center', s:'M7 4h10v5l-3 3h-4l-3-3z M7 6H4v3 M17 6h3v3 M12 12v5', f:'M7 17h10v4H7z' },
    leaderboard: { t:'p', w:'miniapps · per-game leaderboards, agent rankings', s:'M4 20v-7h5 M15 15h5v5 M3 20h18', f:'M9 7h6v13H9z' },
    achievement: { t:'p', w:'miniapps · achievements', s:'M9 10v11l3-3 3 3V10', f:'M12 3l5 5-5 5-5-5z' },
    library:     { t:'p', w:'miniapps · library: installed, recently played', s:'M5 4v15 M9 4v15 M3 20h18', f:'M12 6h4v13h-4z' },
    reply:       { t:'a', w:'socnet · reply', s:'M9 6l-5 5 5 5 M4 11h9l7 7' },
    resoc:       { t:'a', w:'socnet · resoc (repost)', s:'M4 11V7h13 M14 4l3 3-3 3 M20 13v4H7 M10 20l-3-3 3-3' },
    quote:       { t:'a', w:'socnet · quote a post', s:'M4 6h6v6l-4 4 M14 6h6v6l-4 4' },
    comment:     { t:'a', w:'socnet · reply count, thread', s:'M4 4h16v12h-9l-4 4v-4H4z' },
    heart:       { t:'a', w:'socnet like, miniapps wishlist', s:'M12 20l-8-8V7l3-3h3l2 2 2-2h3l3 3v5z' },
    mention:     { t:'a', w:'socnet · @mention, mentions tab', s:'M16 8H9v8h11V4H4v16h8 M16 8v8' },
    tag:         { t:'a', w:'socnet · #tag, trends', s:'M9 4v16 M15 4v16 M4 9h16 M4 15h16' },
    image:       { t:'a', w:'socnet media, miniapps screenshots', s:'M4 4h16v16H4z M4 17l5-5 4 4 2-2 5 5 M15 8h1v1h-1z' },
    pin:         { t:'a', w:'socnet · pinned post, group pin', s:'M9 4h6 M10 4v6l-3 3h10l-3-3V4 M12 13v7' },
    mute:        { t:'a', w:'socnet · mute', s:'M3 9h4l5-5v16l-5-5H3z M16 10l4 4 M20 10l-4 4' },
    volume:      { t:'a', w:'miniapps · player sound on', s:'M3 9h4l5-5v16l-5-5H3z M16 9v6 M20 7v10' },
    block:       { t:'a', w:'socnet · block, ban', s:'M4 4h16v16H4z M8 16l8-8' },
    report:      { t:'a', w:'socnet · report a post', s:'M5 3v18 M5 4h14l-4 4 4 4H5' },
    follow:      { t:'a', w:'socnet · follow', c:[[10,8,3]], s:'M4 20v-4h12v4 M17 10h4 M19 8v4' },
    followed:    { t:'a', w:'socnet · following (state)', c:[[10,8,3]], s:'M4 20v-4h12v4 M16 10l2 2 3-3' },
    enter:       { t:'a', w:'socnet · join a group', s:'M10 4h10v16H10 M3 12h11 M10 8l4 4-4 4' },
    leave:       { t:'a', w:'socnet · leave a group, sign out', s:'M14 4H4v16h10 M10 12h11 M17 8l4 4-4 4' },
    filter:      { t:'a', w:'filters', s:'M4 5h16l-6 6v9h-4v-9z' },
    sort:        { t:'a', w:'sort', s:'M7 4v16 M3 16l4 4 4-4 M17 20V4 M13 8l4-4 4 4' },
    clock:       { t:'a', w:'miniapps · playtime, recently played', s:'M4 4h16v16H4z M12 7v5h4' },
    download:    { t:'a', w:'miniapps · install', s:'M12 4v11 M7 10l5 5 5-5 M4 20h16' },
    upload:      { t:'a', w:'miniapps · register a game, publish', s:'M12 15V4 M7 9l5-5 5 5 M4 20h16' },
    collapse:    { t:'a', w:'exit full screen', s:'M20 10h-6V4 M4 14h6v6 M14 10l6-6 M10 14l-6 6' },
    code:        { t:'a', w:'miniapps · developer page', s:'M9 7l-5 5 5 5 M15 7l5 5-5 5' },
    permissions: { t:'a', w:'miniapps · app permissions', s:'M4 3h16v9l-8 8-8-8z M10 8h4v4h-4z' },
    chart:       { t:'a', w:'miniapps · charts', s:'M4 4v16h16 M8 16v-4 M12 16V8 M16 16v-6' },
    trending:    { t:'a', w:'socnet trends, miniapps trending', s:'M4 17l5-5 4 4 7-7 M15 9h5v5' },
    versions:    { t:'a', w:'miniapps · versions, changelog', s:'M4 15h16v5H4z M6 10h12 M8 5h8' },
    list:        { t:'a', w:'socnet · lists (saved feeds)', s:'M9 6h11 M9 12h11 M9 18h11 M4 6h1 M4 12h1 M4 18h1' },
    star:        { t:'a', w:'miniapps · rating', s:'M12 4l3 3h2v2l3 3-3 3v2h-2l-3 3-3-3H7v-2l-3-3 3-3V7h2z' },
    alert:       { t:'a', w:'warn and danger notices', s:'M4 4h16v16H4z M12 8v3 M12 15v1' },
    'arrow-down':{ t:'a', w:'down, scroll to new', s:'M12 4v15 M6 13l6 6 6-6' },
    'chevron-left':{ t:'a', w:'previous, carousel', s:'M15 6l-6 6 6 6' },
    'heart-fill':{ t:'m', w:'liked, wishlisted', sf:'M12 20l-8-8V7l3-3h3l2 2 2-2h3l3 3v5z' },
    'bookmark-fill':{ t:'m', w:'bookmarked', sf:'M7 3h10v16l-5-5-5 5z' },
    'star-fill': { t:'m', w:'rated, rating stars', sf:'M12 4l3 3h2v2l3 3-3 3v2h-2l-3 3-3-3H7v-2l-3-3 3-3V7h2z' },
    play:        { t:'m', w:'miniapps · play', f:'M8 4l8 8-8 8z' },
    pause:       { t:'m', w:'miniapps · pause', f:'M6 5h4v14H6z M14 5h4v14h-4z' },
    crown:       { t:'m', w:'group roles: owner', f:'M4 18V8l4 4 4-4 4 4 4-4v10z' },
  };
  function hi(name, size = 18, cls = '') {
    const g = HI[name]; if (!g) return '';
    const p = [];
    if (g.s) p.push(`<path d="${g.s}"/>`);
    (g.p || []).forEach(([k, d]) => p.push(`<path class="${k}" d="${d}"/>`));
    (g.c || []).forEach(([x, y, r]) => p.push(`<circle cx="${x}" cy="${y}" r="${r}"/>`));
    if (g.f) p.push(`<path d="${g.f}" fill="currentColor" stroke="none"/>`);
    (g.cf || []).forEach(([x, y, r]) => p.push(`<circle cx="${x}" cy="${y}" r="${r}" fill="currentColor" stroke="none"/>`));
    return `<svg class="hi${cls ? ' ' + cls : ''}" viewBox="0 0 24 24" width="${size}" height="${size}" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="square" stroke-linejoin="miter" aria-hidden="true">${p.join('')}</svg>`;
  }
  // A glyph as a CSS url(), for the places CSS has to paint an icon itself. The arrow on every <select> is a
  // background, which cannot take currentColor, so it is baked in --txt2 / --txt2-day from handoff.css and read
  // as var(--hi-select). A pseudo-element that should follow currentColor uses a glyph as a MASK instead:
  // background:currentColor; mask:var(--hi-mask-<name>) (the mask's own colour is irrelevant).
  const url = (name, color, size = 24) => 'url("data:image/svg+xml,' + encodeURIComponent(
    hi(name, size).replace('class="hi"', 'xmlns="http://www.w3.org/2000/svg"').replaceAll('currentColor', color)) + '")';
  try {
    const st = document.createElement('style'); st.id = 'hi-vars';
    const masks = ['chevron-up', 'chevron-down', 'chevron-right'].map(n => `--hi-mask-${n}:${url(n, '#000')}`).join(';');
    st.textContent = `:root{--hi-select:${url('chevron-down', '#a6a4cc')};${masks}}:root[data-theme="light"]{--hi-select:${url('chevron-down', '#41436b')}}`;
    document.head.appendChild(st);
  } catch (e) { }
  window.HandoffIcons = { glyphs: HI, svg: hi, url };
})();
