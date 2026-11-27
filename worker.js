// Alfred's Seed Library: Cloudflare Worker + D1 database (paste this whole file)
const HTML = String.raw`<!doctype html>
<html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>Alfred’s Seed Library</title>
<style>
:root{--ink:#3a2330;--bg:#fff;--leaf:#c94579;--soil:#a8527a;--mist:#fdeaf2;--line:#f2c6d8;--err:#fbeaea;--errl:#a33;
box-sizing:border-box;padding-top:env(safe-area-inset-top,0px);padding-bottom:env(safe-area-inset-bottom,0px)}
@media (prefers-color-scheme:dark){:root:not([data-theme="light"]){--ink:#f6e6ee;--bg:#2a1a23;--leaf:#d9558a;--soil:#c77aa3;--mist:#3a2430;--line:#5a3a4a;--err:#3a1c1c;--errl:#e08080}}
:root[data-theme="dark"]{--ink:#f6e6ee;--bg:#2a1a23;--leaf:#d9558a;--soil:#c77aa3;--mist:#3a2430;--line:#5a3a4a;--err:#3a1c1c;--errl:#e08080}
*{box-sizing:border-box}
html{scroll-padding-top:env(safe-area-inset-top,0px)}
body{margin:0;font:16px/1.5 Georgia,serif;color:var(--ink);background:#fbd3e3 url(data:image/jpeg;base64,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) center/cover fixed no-repeat;min-height:100vh}
header{background:var(--leaf);color:#fff;padding:16px 18px}
header h1{margin:0;font-size:1.25rem}
.bar{display:flex;justify-content:space-between;align-items:center;gap:8px;flex-wrap:wrap}
nav{margin-top:8px;display:flex;gap:16px;flex-wrap:wrap}
nav button{background:none;border:0;border-bottom:2px solid transparent;color:#ffe6f0;font:inherit;padding:2px 0;cursor:pointer;border-radius:0}
nav button.on{border-color:#fff;color:#fff}
main{max-width:900px;margin:16px auto;padding:18px;background:rgba(255,255,255,.88);border-radius:14px}
@media (prefers-color-scheme:dark){:root:not([data-theme="light"]) main{background:rgba(42,26,35,.88)}}
:root[data-theme="dark"] main{background:rgba(42,26,35,.88)}
@media (max-width:640px){main{margin:10px;padding:14px}}
h2{margin-top:0}
.msg{background:var(--mist);border-left:4px solid var(--leaf);padding:8px 12px;margin-bottom:12px}
.msg.err{background:var(--err);border-color:var(--errl)}
form{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:18px}
input,select,button{font:inherit;padding:8px 10px;border:1px solid var(--line);border-radius:6px;background:var(--bg);color:var(--ink)}
form button,button.sm{background:var(--leaf);color:#fff;border-color:var(--leaf);cursor:pointer}
button.sm{padding:3px 8px;font-size:.85rem;background:var(--soil);border-color:var(--soil)}
header button.out{background:none;color:#fff;border-color:#fff;padding:3px 10px;cursor:pointer}
.login{max-width:360px;margin:30px auto}
.login form{flex-direction:column}
.link{background:none;border:0;color:var(--leaf);text-decoration:underline;cursor:pointer;padding:0}
.wrap{overflow-x:auto}
table{border-collapse:collapse;width:100%}
th,td{text-align:left;padding:8px;border-bottom:1px solid var(--line);white-space:nowrap}
th{background:var(--mist)}
.note{font-size:.85rem;opacity:.8}
</style>
</head><body>
<header><div class="bar"><h1>Alfred’s Seed Library</h1><div id="who"></div></div><nav id="nav"></nav></header>
<main><div id="msg"></div><div id="view">Loading…</div></main>
<script>
var user=null, hasStaff=true, tab='loans', data={member:[],seed:[],loan:[],staff:[]};
function esc(x){return String(x==null?'':x).replace(/[&<>"]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
function val(id){return document.getElementById(id).value.trim()}
function flash(t,err){document.getElementById('msg').innerHTML=t?'<div class="msg'+(err?' err':'')+'">'+esc(t)+'</div>':''}
async function api(path,method,body){
  var r=await fetch(path,{method:method||'GET',headers:{'Content-Type':'application/json'},body:body?JSON.stringify(body):undefined});
  var j={};try{j=await r.json()}catch(e){}
  if(!r.ok)throw new Error(j.error||'Something went wrong.');
  return j;
}
async function load(){data=await api('/api/data')}
async function act(fn){try{await fn()}catch(e){flash(e.message,true)}}
function nav(){
  var T={members:'Members',seeds:'Seed varieties',loans:'Seed loans',staff:'Librarians'};
  document.getElementById('nav').innerHTML=user?Object.keys(T).map(function(k){return '<button class="'+(k==tab?'on':'')+'" onclick="go(\''+k+'\')">'+T[k]+'</button>'}).join(''):'';
  document.getElementById('who').innerHTML=user?esc(user)+' <button class="out" onclick="logout()">Log out</button>':'';
}
function go(t){tab=t;flash('');render()}
function logout(){act(async function(){await api('/api/logout','POST');user=null;flash('');render()})}
function doLogin(e){e.preventDefault();act(async function(){
  var j=await api('/api/login','POST',{username:val('u'),password:document.getElementById('p').value});
  user=j.user;await load();flash('');render()})}
function doFirst(e){e.preventDefault();act(async function(){
  var j=await api('/api/register','POST',{username:val('u'),password:document.getElementById('p').value});
  user=j.user;hasStaff=true;await load();flash('Account created.');render()})}
function addStaff(e){e.preventDefault();act(async function(){
  await api('/api/register','POST',{username:val('u'),password:document.getElementById('p').value});
  await load();flash('Librarian account added.');render()})}
function addMember(e){e.preventDefault();act(async function(){
  await api('/api/members','POST',{name:val('n'),contact:val('c')});await load();flash('Member added.');render()})}
function addSeed(e){e.preventDefault();act(async function(){
  await api('/api/seeds','POST',{seed_name:val('n'),seed_type:val('t'),qty:val('q')});await load();flash('Seed variety added.');render()})}
function addLoan(e){e.preventDefault();act(async function(){
  await api('/api/loans','POST',{member_id:val('m'),seed_id:val('s'),quantity:val('q')});await load();flash('Loan recorded.');render()})}
function ret(id){act(async function(){await api('/api/loans/'+id+'/return','POST');await load();flash('Loan marked as returned.');render()})}
function table(h,rows,empty){return '<div class="wrap"><table><tr>'+h.map(function(x){return '<th>'+x+'</th>'}).join('')+'</tr>'+(rows||'<tr><td colspan="'+h.length+'">'+empty+'</td></tr>')+'</table></div>'}
function render(){
  nav();var el=document.getElementById('view'),v='';
  if(!user){
    v='<div class="login"><h2>'+(hasStaff?'Log in':'Create account')+'</h2>'+
      (hasStaff?'':'<p class="note">No accounts yet. The first account you create will be the librarian.</p>')+
      '<form onsubmit="'+(hasStaff?'doLogin':'doFirst')+'(event)"><input id="u" placeholder="Username" autocomplete="username" required>'+
      '<input id="p" type="password" placeholder="Password" autocomplete="current-password" required><button>'+(hasStaff?'Log in':'Create account')+'</button></form></div>';
  } else if(tab=='members'){
    v='<h2>Members</h2><form onsubmit="addMember(event)"><input id="n" placeholder="Full name" required><input id="c" placeholder="Phone or email"><button>Add member</button></form>'+
      table(['ID','Name','Contact'],data.member.map(function(r){return '<tr><td>'+r.member_id+'</td><td>'+esc(r.name)+'</td><td>'+esc(r.contact)+'</td></tr>'}).join(''),'No members yet. Add the first one above.');
  } else if(tab=='seeds'){
    v='<h2>Seed varieties</h2><form onsubmit="addSeed(event)"><input id="n" placeholder="Seed name" required><input id="t" placeholder="Type (vegetable, herb…)"><input id="q" type="number" min="0" placeholder="Quantity" required><button>Add seed</button></form>'+
      table(['ID','Name','Type','Available'],data.seed.map(function(r){return '<tr><td>'+r.seed_id+'</td><td>'+esc(r.seed_name)+'</td><td>'+esc(r.seed_type)+'</td><td>'+r.available_quantity+'</td></tr>'}).join(''),'No seeds yet. Add the first variety above.');
  } else if(tab=='staff'){
    v='<h2>Librarians</h2><form onsubmit="addStaff(event)"><input id="u" placeholder="New username" required><input id="p" type="password" placeholder="Password (6+ characters)" required><button>Add librarian</button></form>'+
      table(['Username'],data.staff.map(function(r){return '<tr><td>'+esc(r.username)+'</td></tr>'}).join(''),'');
  } else {
    var mo=data.member.map(function(m){return '<option value="'+m.member_id+'">'+esc(m.name)+'</option>'}).join('');
    var so=data.seed.filter(function(s){return s.available_quantity>0}).map(function(s){return '<option value="'+s.seed_id+'">'+esc(s.seed_name)+' ('+s.available_quantity+' left)</option>'}).join('');
    var rows=data.loan.map(function(l){
      return '<tr><td>'+l.loan_id+'</td><td>'+esc(l.member_name)+'</td><td>'+esc(l.seed_name)+'</td><td>'+l.quantity+'</td><td>'+l.loan_date+'</td><td>'+(l.return_date||'Out')+'</td><td>'+(l.return_date?'':'<button class="sm" onclick="ret('+l.loan_id+')">Mark returned</button>')+'</td></tr>'}).join('');
    v='<h2>Seed loans</h2><form onsubmit="addLoan(event)"><select id="m" required><option value="">Member</option>'+mo+'</select><select id="s" required><option value="">Seed</option>'+so+'</select><input id="q" type="number" min="1" placeholder="Quantity" required><button>Record loan</button></form>'+
      table(['Loan','Member','Seed','Qty','Loaned','Returned',''],rows,'No loans yet. Add a member and a seed first, then record a loan.');
  }
  if(el.dataset.last!==v){el.innerHTML=v;el.dataset.last=v}
}
(async function(){
  try{var j=await api('/api/me');user=j.user;hasStaff=j.hasStaff;if(user)await load()}catch(e){}
  render();
  setInterval(function(){var a=document.activeElement&&document.activeElement.tagName;
    if(user&&a!='INPUT'&&a!='SELECT'){load().then(render).catch(function(){})}},10000);
})();
</script></body></html>`;

const enc = new TextEncoder();
const hex = (u8) => Array.from(u8).map((b) => b.toString(16).padStart(2, '0')).join('');
const unhex = (s) => new Uint8Array(s.match(/../g).map((h) => parseInt(h, 16)));
const json = (obj, status = 200, headers = {}) =>
  new Response(JSON.stringify(obj), { status, headers: { 'content-type': 'application/json', ...headers } });
const fail = (msg, status = 400) => json({ error: msg }, status);

async function hashPw(pw, saltHex) {
  const key = await crypto.subtle.importKey('raw', enc.encode(pw), 'PBKDF2', false, ['deriveBits']);
  const bits = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', salt: unhex(saltHex), iterations: 100000, hash: 'SHA-256' }, key, 256);
  return hex(new Uint8Array(bits));
}

let ready = false;
async function init(db) {
  if (ready) return;
  await db.batch([
    db.prepare('CREATE TABLE IF NOT EXISTS staff (username TEXT PRIMARY KEY, salt TEXT NOT NULL, hash TEXT NOT NULL)'),
    db.prepare('CREATE TABLE IF NOT EXISTS sessions (sid TEXT PRIMARY KEY, username TEXT NOT NULL, created TEXT NOT NULL DEFAULT (datetime(\'now\')))'),
    db.prepare('CREATE TABLE IF NOT EXISTS member (member_id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, contact TEXT)'),
    db.prepare('CREATE TABLE IF NOT EXISTS seed_variety (seed_id INTEGER PRIMARY KEY AUTOINCREMENT, seed_name TEXT NOT NULL, seed_type TEXT, available_quantity INTEGER NOT NULL DEFAULT 0 CHECK (available_quantity >= 0))'),
    db.prepare('CREATE TABLE IF NOT EXISTS seed_loan (loan_id INTEGER PRIMARY KEY AUTOINCREMENT, member_id INTEGER NOT NULL REFERENCES member(member_id), seed_id INTEGER NOT NULL REFERENCES seed_variety(seed_id), loan_date TEXT NOT NULL DEFAULT (date(\'now\')), return_date TEXT, quantity INTEGER NOT NULL CHECK (quantity > 0))'),
  ]);
  ready = true;
}

function getCookie(req, name) {
  const m = (req.headers.get('cookie') || '').match(new RegExp('(?:^|; )' + name + '=([^;]*)'));
  return m ? m[1] : null;
}
async function currentUser(req, db) {
  const sid = getCookie(req, 'sid');
  if (!sid) return null;
  const row = await db.prepare('SELECT username FROM sessions WHERE sid = ?').bind(sid).first();
  return row ? row.username : null;
}
async function newSession(db, username) {
  const sid = hex(crypto.getRandomValues(new Uint8Array(24)));
  await db.prepare('INSERT INTO sessions (sid, username) VALUES (?, ?)').bind(sid, username).run();
  return { 'set-cookie': 'sid=' + sid + '; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=2592000' };
}

async function handleApi(req, env, url) {
  const db = env.DB;
  if (!db) return fail('Database not connected. Add the D1 binding named DB in Settings > Bindings.', 500);
  await init(db);
  const path = url.pathname;
  const user = await currentUser(req, db);
  const body = req.method === 'POST' ? await req.json().catch(() => ({})) : {};
  const staffCount = (await db.prepare('SELECT COUNT(*) AS n FROM staff').first()).n;

  if (path === '/api/me') return json({ user, hasStaff: staffCount > 0 });

  if (path === '/api/login' && req.method === 'POST') {
    const u = String(body.username || '').trim().toLowerCase();
    const row = await db.prepare('SELECT * FROM staff WHERE username = ?').bind(u).first();
    if (!row || (await hashPw(String(body.password || ''), row.salt)) !== row.hash) return fail('Wrong username or password.', 401);
    return json({ user: u }, 200, await newSession(db, u));
  }
  if (path === '/api/logout' && req.method === 'POST') {
    const sid = getCookie(req, 'sid');
    if (sid) await db.prepare('DELETE FROM sessions WHERE sid = ?').bind(sid).run();
    return json({ ok: true }, 200, { 'set-cookie': 'sid=; Path=/; Max-Age=0' });
  }
  if (path === '/api/register' && req.method === 'POST') {
    if (staffCount > 0 && !user) return fail('Only a logged-in librarian can add accounts.', 403);
    const u = String(body.username || '').trim().toLowerCase().slice(0, 50);
    const p = String(body.password || '');
    if (!u || p.length < 6) return fail('Enter a username and a password of at least 6 characters.');
    if (await db.prepare('SELECT 1 FROM staff WHERE username = ?').bind(u).first()) return fail('That username is taken.');
    const salt = hex(crypto.getRandomValues(new Uint8Array(16)));
    await db.prepare('INSERT INTO staff (username, salt, hash) VALUES (?, ?, ?)').bind(u, salt, await hashPw(p, salt)).run();
    return json({ user: user || u }, 200, user ? {} : await newSession(db, u));
  }

  if (!user) return fail('Please log in.', 401);

  if (path === '/api/data') {
    const [member, seed, loan, staff] = await Promise.all([
      db.prepare('SELECT * FROM member ORDER BY member_id').all(),
      db.prepare('SELECT * FROM seed_variety ORDER BY seed_id').all(),
      db.prepare('SELECT l.*, m.name AS member_name, s.seed_name FROM seed_loan l JOIN member m ON m.member_id = l.member_id JOIN seed_variety s ON s.seed_id = l.seed_id ORDER BY (l.return_date IS NOT NULL), l.loan_id DESC').all(),
      db.prepare('SELECT username FROM staff ORDER BY username').all(),
    ]);
    return json({ member: member.results, seed: seed.results, loan: loan.results, staff: staff.results });
  }
  if (path === '/api/members' && req.method === 'POST') {
    const name = String(body.name || '').trim().slice(0, 100);
    if (!name) return fail('Name is required.');
    await db.prepare('INSERT INTO member (name, contact) VALUES (?, ?)').bind(name, String(body.contact || '').trim().slice(0, 100)).run();
    return json({ ok: true });
  }
  if (path === '/api/seeds' && req.method === 'POST') {
    const name = String(body.seed_name || '').trim().slice(0, 100);
    if (!name) return fail('Seed name is required.');
    const qty = Math.max(0, parseInt(body.qty, 10) || 0);
    await db.prepare('INSERT INTO seed_variety (seed_name, seed_type, available_quantity) VALUES (?, ?, ?)')
      .bind(name, String(body.seed_type || '').trim().slice(0, 50), qty).run();
    return json({ ok: true });
  }
  if (path === '/api/loans' && req.method === 'POST') {
    const m = parseInt(body.member_id, 10), s = parseInt(body.seed_id, 10), q = parseInt(body.quantity, 10);
    if (!m || !s || !(q >= 1)) return fail('Choose a member, a seed, and a quantity.');
    const upd = await db.prepare('UPDATE seed_variety SET available_quantity = available_quantity - ? WHERE seed_id = ? AND available_quantity >= ?').bind(q, s, q).run();
    if (!upd.meta.changes) return fail('Not enough seeds available for that loan.');
    try {
      await db.prepare('INSERT INTO seed_loan (member_id, seed_id, quantity) VALUES (?, ?, ?)').bind(m, s, q).run();
    } catch (e) {
      await db.prepare('UPDATE seed_variety SET available_quantity = available_quantity + ? WHERE seed_id = ?').bind(q, s).run();
      return fail('Could not record the loan.');
    }
    return json({ ok: true });
  }
  const r = path.match(/^\/api\/loans\/(\d+)\/return$/);
  if (r && req.method === 'POST') {
    const id = parseInt(r[1], 10);
    const loan = await db.prepare('SELECT * FROM seed_loan WHERE loan_id = ? AND return_date IS NULL').bind(id).first();
    if (loan) {
      const done = await db.prepare("UPDATE seed_loan SET return_date = date('now') WHERE loan_id = ? AND return_date IS NULL").bind(id).run();
      if (done.meta.changes) await db.prepare('UPDATE seed_variety SET available_quantity = available_quantity + ? WHERE seed_id = ?').bind(loan.quantity, loan.seed_id).run();
    }
    return json({ ok: true });
  }
  return fail('Not found.', 404);
}

export default {
  async fetch(req, env) {
    const url = new URL(req.url);
    if (url.pathname.startsWith('/api/')) {
      try { return await handleApi(req, env, url); }
      catch (e) { return fail('Server error: ' + e.message, 500); }
    }
    return new Response(HTML, { headers: { 'content-type': 'text/html; charset=utf-8' } });
  },
};
