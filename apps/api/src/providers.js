const jsonHeaders = { 'content-type': 'application/json' };

function requireKey(envName) {
  const key = process.env[envName];
  if (!key) throw new Error(`missing ${envName}`);
  return key;
}

async function fetchJson(url, options = {}, timeoutMs = 30000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, { ...options, signal: controller.signal });
    const text = await response.text();
    let data;
    try { data = text ? JSON.parse(text) : {}; } catch { data = { raw: text }; }
    if (!response.ok) {
      const error = new Error(`HTTP ${response.status}`);
      error.status = response.status;
      error.data = data;
      throw error;
    }
    return data;
  } finally {
    clearTimeout(timer);
  }
}

export const adapters = {
  openai: {
    env: 'OPENAI_API_KEY',
    defaultModel: process.env.OPENAI_MODEL || 'gpt-4o-mini',
    async chat({ task, model }) {
      const key = requireKey('OPENAI_API_KEY');
      const chosen = model || this.defaultModel;
      const data = await fetchJson('https://api.openai.com/v1/chat/completions', {
        method: 'POST', headers: { ...jsonHeaders, authorization: `Bearer ${key}` },
        body: JSON.stringify({ model: chosen, messages: [{ role: 'user', content: task }] })
      });
      return { text: data.choices?.[0]?.message?.content ?? '', model: chosen, raw: data };
    }
  },
  google: {
    env: 'GOOGLE_AI_API_KEY',
    defaultModel: process.env.GOOGLE_AI_MODEL || 'gemini-2.0-flash',
    async chat({ task, model }) {
      const key = requireKey('GOOGLE_AI_API_KEY');
      const chosen = model || this.defaultModel;
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(chosen)}:generateContent?key=${encodeURIComponent(key)}`;
      const data = await fetchJson(url, {
        method: 'POST', headers: jsonHeaders,
        body: JSON.stringify({ contents: [{ parts: [{ text: task }] }] })
      });
      const text = data.candidates?.[0]?.content?.parts?.map(p => p.text || '').join('') || '';
      return { text, model: chosen, raw: data };
    }
  },
  anthropic: {
    env: 'ANTHROPIC_API_KEY',
    defaultModel: process.env.ANTHROPIC_MODEL || 'claude-3-5-haiku-latest',
    async chat({ task, model }) {
      const key = requireKey('ANTHROPIC_API_KEY');
      const chosen = model || this.defaultModel;
      const data = await fetchJson('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { ...jsonHeaders, 'x-api-key': key, 'anthropic-version': '2023-06-01' },
        body: JSON.stringify({ model: chosen, max_tokens: 1024, messages: [{ role: 'user', content: task }] })
      });
      const text = data.content?.filter(x => x.type === 'text').map(x => x.text).join('') || '';
      return { text, model: chosen, raw: data };
    }
  },
  groq: {
    env: 'GROQ_API_KEY',
    defaultModel: process.env.GROQ_MODEL || 'llama-3.3-70b-versatile',
    async chat({ task, model }) {
      const key = requireKey('GROQ_API_KEY');
      const chosen = model || this.defaultModel;
      const data = await fetchJson('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST', headers: { ...jsonHeaders, authorization: `Bearer ${key}` },
        body: JSON.stringify({ model: chosen, messages: [{ role: 'user', content: task }] })
      });
      return { text: data.choices?.[0]?.message?.content ?? '', model: chosen, raw: data };
    }
  },
  mistral: {
    env: 'MISTRAL_API_KEY',
    defaultModel: process.env.MISTRAL_MODEL || 'mistral-small-latest',
    async chat({ task, model }) {
      const key = requireKey('MISTRAL_API_KEY');
      const chosen = model || this.defaultModel;
      const data = await fetchJson('https://api.mistral.ai/v1/chat/completions', {
        method: 'POST', headers: { ...jsonHeaders, authorization: `Bearer ${key}` },
        body: JSON.stringify({ model: chosen, messages: [{ role: 'user', content: task }] })
      });
      return { text: data.choices?.[0]?.message?.content ?? '', model: chosen, raw: data };
    }
  },
  deepseek: {
    env: 'DEEPSEEK_API_KEY',
    defaultModel: process.env.DEEPSEEK_MODEL || 'deepseek-chat',
    async chat({ task, model }) {
      const key = requireKey('DEEPSEEK_API_KEY');
      const chosen = model || this.defaultModel;
      const data = await fetchJson('https://api.deepseek.com/chat/completions', {
        method: 'POST', headers: { ...jsonHeaders, authorization: `Bearer ${key}` },
        body: JSON.stringify({ model: chosen, messages: [{ role: 'user', content: task }] })
      });
      return { text: data.choices?.[0]?.message?.content ?? '', model: chosen, raw: data };
    }
  }
};

export function configuredProviders() {
  return Object.entries(adapters)
    .filter(([, adapter]) => Boolean(process.env[adapter.env]))
    .map(([id, adapter]) => ({ id, model: adapter.defaultModel }));
}
