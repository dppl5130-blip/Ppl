const $ = (id) => document.getElementById(id);
const configuredApi = localStorage.getItem('genesis_api_url');
const API = (configuredApi || '/api').replace(/\/$/, '');
const demoProviders = [
  {id:'openai', name:'OpenAI', model:'gpt-6-astra'},
  {id:'google', name:'Google Gemini', model:'gemini'},
  {id:'anthropic', name:'Anthropic', model:'claude'},
  {id:'groq', name:'Groq', model:'configured'},
  {id:'mistral', name:'Mistral', model:'configured'},
  {id:'deepseek', name:'DeepSeek', model:'configured'}
];
let activity = [];
let online = false;

function setService(ok, detail='') {
  online = ok;
  $('serviceDot').className = `dot ${ok ? 'ok' : 'bad'}`;
  $('serviceStatus').textContent = ok ? 'Genesis online' : 'API offline';
  $('serviceDetail').textContent = detail || (ok ? 'Connected to router' : 'Using dashboard demo state');
  $('apiState').textContent = ok ? 'ONLINE' : 'OFFLINE';
  $('apiState').style.color = ok ? 'var(--accent)' : 'var(--danger)';
  $('modePill').textContent = ok ? 'LIVE' : 'DEMO';
}

function renderProviders(items, health={}) {
  const list = items?.length ? items : demoProviders;
  $('providerCount').textContent = list.length;
  const healthy = list.filter(p => health[p.id]?.status === 'healthy').length;
  $('healthyCount').textContent = online ? healthy : '—';
  $('providerList').innerHTML = list.map(p => {
    const h = health[p.id];
    const status = h?.status || (online ? 'unknown' : 'unknown');
    return `<div class="provider"><div><div class="provider-name">${escapeHtml(p.name || p.id)}</div><div class="provider-model">${escapeHtml(p.model || 'model available')}</div></div><span class="provider-status ${status}">${status.toUpperCase()}</span></div>`;
  }).join('');
}

async function getJson(path, options) {
  const started = performance.now();
  const res = await fetch(`${API}${path}`, {headers:{'content-type':'application/json'}, ...options});
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || data.message || `HTTP ${res.status}`);
  return {data, latency: Math.round(performance.now()-started)};
}

async function refresh() {
  try {
    const [{data:health, latency}, {data:providers}] = await Promise.all([getJson('/health'), getJson('/providers')]);
    setService(true, `${providers.length} providers · ${latency}ms`);
    $('apiLatency').textContent = `${latency}ms response`;
    renderProviders(providers, health.providerHealth || {});
  } catch (e) {
    setService(false, 'Start apps/api to connect');
    $('apiLatency').textContent = 'not reachable';
    renderProviders(demoProviders);
  }
}

async function runTask() {
  const task = $('taskInput').value.trim();
  if (!task) { $('taskInput').focus(); return; }
  const btn = $('runBtn');
  btn.disabled = true; btn.innerHTML = 'Routing… <span>◌</span>';
  $('routeBadge').textContent = 'RUNNING'; $('routeBadge').className = 'badge';
  $('resultTitle').textContent = 'Genesis is working';
  $('resultMeta').textContent = 'Selecting provider and executing task…';
  $('resultText').textContent = 'Routing request…';
  const started = performance.now();
  try {
    const capability = $('capability').value;
    const max_attempts = Number($('maxAttempts').value || 6);
    const {data, latency} = await getJson('/route', {method:'POST', body:JSON.stringify({task, ...(capability ? {capability}:{}) , max_attempts})});
    $('routeBadge').textContent = data.status === 'ok' ? 'SUCCESS' : 'FAILED';
    $('routeBadge').className = `badge ${data.status === 'ok' ? 'ok' : 'fail'}`;
    $('resultTitle').textContent = data.status === 'ok' ? 'Task completed' : 'Task failed';
    $('resultMeta').textContent = `${data.provider || '—'} · ${data.model || '—'} · ${data.latencyMs ?? latency}ms · ${data.fallbackUsed ? 'fallback used' : 'primary route'}`;
    $('resultText').textContent = data.result || data.message || JSON.stringify(data, null, 2);
    $('lastProvider').textContent = data.provider || 'FAILED';
    $('lastLatency').textContent = `${data.latencyMs ?? latency}ms`;
    activity.unshift({time:new Date(), provider:data.provider || 'none', text:task, ok:data.status === 'ok', latency:data.latencyMs ?? latency});
    activity = activity.slice(0, 8); renderActivity();
    if (!online) setService(true, 'Router responded');
  } catch (e) {
    $('routeBadge').textContent = 'ERROR'; $('routeBadge').className = 'badge fail';
    $('resultTitle').textContent = 'Genesis could not reach the API';
    $('resultMeta').textContent = `Endpoint: ${API}`;
    $('resultText').textContent = `${e.message}\n\nTip: run the API with “npm start” inside apps/api, then set the dashboard API endpoint if it is hosted separately.`;
  } finally {
    btn.disabled = false; btn.innerHTML = 'Run with Genesis <span>→</span>';
  }
}

function renderActivity() {
  $('activityList').innerHTML = activity.length ? activity.map(a => `<div class="activity"><span class="time">${a.time.toLocaleTimeString()}</span><span>${escapeHtml(a.text.slice(0,100))}</span><span class="route">${escapeHtml(a.provider)} · ${a.latency}ms ${a.ok?'✓':'×'}</span></div>`).join('') : '<div class="empty">No executions yet.</div>';
}
function escapeHtml(value) { return String(value).replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c])); }

$('runBtn').addEventListener('click', runTask);
$('refreshBtn').addEventListener('click', refresh);
$('taskInput').addEventListener('keydown', e => { if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') runTask(); });
document.querySelectorAll('.quick button').forEach(b => b.addEventListener('click', () => { $('taskInput').value = b.dataset.task; $('taskInput').focus(); }));
$('apiSettings').addEventListener('click', () => {
  const value = prompt('Genesis API base URL', API);
  if (value !== null) { localStorage.setItem('genesis_api_url', value.trim() || '/api'); location.reload(); }
});
setInterval(() => $('clock').textContent = new Date().toLocaleString(), 1000);
renderActivity();
refresh();
