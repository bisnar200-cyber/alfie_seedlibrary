// Alfred's Seed Library: Cloudflare Worker + D1 database (paste this whole file)
const HTML = String.raw`<!doctype html>
<html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>Alfred’s Seed Library</title>
<style>
:root{--ink:#1f2a1f;--bg:#fff;--leaf:#2f6b3f;--soil:#6b4a2f;--mist:#eef3ec;--line:#cfd9cb;--err:#fbeaea;--errl:#a33;
box-sizing:border-box;padding-top:env(safe-area-inset-top,0px);padding-bottom:env(safe-area-inset-bottom,0px)}
@media (prefers-color-scheme:dark){:root:not([data-theme="light"]){--ink:#e6efe4;--bg:#141a14;--leaf:#3f8a53;--soil:#a07650;--mist:#1f2a1f;--line:#34443a;--err:#3a1c1c;--errl:#e08080}}
:root[data-theme="dark"]{--ink:#e6efe4;--bg:#141a14;--leaf:#3f8a53;--soil:#a07650;--mist:#1f2a1f;--line:#34443a;--err:#3a1c1c;--errl:#e08080}
*{box-sizing:border-box}
html{scroll-padding-top:env(safe-area-inset-top,0px)}
body{margin:0;font:16px/1.5 Georgia,serif;color:var(--ink);background:var(--bg)}
header{background:var(--leaf);color:#fff;padding:16px 18px}
header h1{margin:0;font-size:1.25rem}
.bar{display:flex;justify-content:space-between;align-items:center;gap:8px;flex-wrap:wrap}
nav{margin-top:8px;display:flex;gap:16px;flex-wrap:wrap}
nav button{background:none;border:0;border-bottom:2px solid transparent;color:#e4f1e0;font:inherit;padding:2px 0;cursor:pointer;border-radius:0}
nav button.on{border-color:#fff;color:#fff}
main{max-width:900px;margin:0 auto;padding:18px}
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
