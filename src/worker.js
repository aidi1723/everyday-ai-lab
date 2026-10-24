// src/worker.js - Everyday AI Lab Cloudflare Worker Entrypoint
// Production-hardened with secure auth, CORS preflight, and privacy-preserving analytics

const ALLOWED_ORIGIN_PATTERNS = [
  /^https:\/\/(www\.)?0500005\.xyz$/,
  /^https:\/\/[a-z0-9-]+\.workers\.dev$/,
  /^http:\/\/localhost(:[0-9]+)?$/,
  /^http:\/\/127\.0\.0\.1(:[0-9]+)?$/
];

function getCorsHeaders(request) {
  const origin = request.headers.get('Origin') || '';
  const isAllowed = ALLOWED_ORIGIN_PATTERNS.some(pattern => pattern.test(origin));
  
  return {
    'Access-Control-Allow-Origin': isAllowed ? origin : 'https://0500005.xyz',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Max-Age': '86400',
    'Vary': 'Origin'
  };
}

function verifyAdminAuth(request, env) {
  // Support both Cloudflare Worker secret and env configuration
  const expectedSecret = env.ADMIN_SECRET || env.API_SECRET;
  if (!expectedSecret) {
    // If not configured, reject for security
    return false;
  }

  // 1. Check Authorization header: Bearer <secret>
  const authHeader = request.headers.get('Authorization') || '';
  if (authHeader.startsWith('Bearer ')) {
    const token = authHeader.slice(7).trim();
    if (token === expectedSecret) return true;
  }

  // 2. Check query parameter ?secret=
  const url = new URL(request.url);
  const secretParam = url.searchParams.get('secret');
  if (secretParam && secretParam === expectedSecret) {
    return true;
  }

  return false;
}

// Anonymize IP address for privacy compliance (GDPR/CCPA)
function anonymizeIp(ip) {
  if (!ip || ip === 'unknown') return 'unknown';
  if (ip.includes('.')) {
    // IPv4: mask the last octet, e.g. 192.168.1.xxx
    const parts = ip.split('.');
    if (parts.length === 4) return `${parts[0]}.${parts[1]}.${parts[2]}.0`;
  } else if (ip.includes(':')) {
    // IPv6: keep first 3 groups
    const parts = ip.split(':');
    return `${parts.slice(0, 3).join(':')}::`;
  }
  return 'masked';
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const corsHeaders = getCorsHeaders(request);

    // Global OPTIONS preflight handler for all API routes
    if (request.method === 'OPTIONS' && url.pathname.startsWith('/api/')) {
      return new Response(null, {
        status: 204,
        headers: corsHeaders
      });
    }

    // 1. Subscription API Endpoint
    if (url.pathname === '/api/subscribe' && request.method === 'POST') {
      try {
        let body;
        try {
          body = await request.json();
        } catch (_) {
          return new Response(JSON.stringify({ error: 'Malformed JSON payload' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store', ...corsHeaders }
          });
        }

        const email = String(body.email || '').trim().toLowerCase();
        
        // Strict email validation (RFC 5322 compliant length and format)
        if (!email || email.length > 120 || !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
          return new Response(JSON.stringify({ error: 'Invalid email address' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store', ...corsHeaders }
          });
        }

        const rawIp = request.headers.get('cf-connecting-ip') || 'unknown';
        const data = {
          email,
          createdAt: new Date().toISOString(),
          lang: body.lang === 'en' ? 'en' : 'zh',
          source: String(body.source || 'website_newsletter').slice(0, 64),
          maskedIp: anonymizeIp(rawIp),
          country: String(request.headers.get('cf-ipcountry') || 'unknown').slice(0, 8)
        };

        if (env.SUBSCRIBERS) {
          // Save individual subscriber key in KV
          await env.SUBSCRIBERS.put(`sub:${email}`, JSON.stringify(data));

          // Maintain master index of emails
          let index = [];
          try {
            const rawIndex = await env.SUBSCRIBERS.get('master_subscriber_index');
            if (rawIndex) index = JSON.parse(rawIndex);
          } catch (_) {}

          if (!index.includes(email)) {
            index.push(email);
            await env.SUBSCRIBERS.put('master_subscriber_index', JSON.stringify(index));
          }
        }

        return new Response(JSON.stringify({ success: true, email }), {
          status: 200,
          headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store', ...corsHeaders }
        });
      } catch (err) {
        return new Response(JSON.stringify({ error: 'Internal server error' }), {
          status: 500,
          headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store', ...corsHeaders }
        });
      }
    }

    // 2. Founder Subscribers Export API (Secure query)
    if (url.pathname === '/api/subscribers' && request.method === 'GET') {
      if (!verifyAdminAuth(request, env)) {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), { 
          status: 401,
          headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store', ...corsHeaders }
        });
      }

      let index = [];
      if (env.SUBSCRIBERS) {
        try {
          const rawIndex = await env.SUBSCRIBERS.get('master_subscriber_index');
          if (rawIndex) index = JSON.parse(rawIndex);
        } catch (_) {}
      }

      const subscribers = [];
      if (env.SUBSCRIBERS) {
        for (const email of index) {
          const item = await env.SUBSCRIBERS.get(`sub:${email}`);
          if (item) subscribers.push(JSON.parse(item));
        }
      }

      return new Response(JSON.stringify({ count: subscribers.length, subscribers }, null, 2), {
        status: 200,
        headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store', ...corsHeaders }
      });
    }

    // 3. Privacy-Friendly Pageview Beacon (Zero cookies / GDPR compliant)
    if (url.pathname === '/api/pageview' && request.method === 'POST') {
      try {
        let body = {};
        try { body = await request.json(); } catch (_) {}
        const rawPath = String(body.path || url.pathname || '/').slice(0, 120);
        // Sanitize path
        const path = rawPath.replace(/[^\w\-\/\.@]/g, '');
        const today = new Date().toISOString().slice(0, 10);

        if (env.SUBSCRIBERS) {
          // Daily page-specific counter
          const pvKey = `pv:${today}:${path}`;
          const current = parseInt(await env.SUBSCRIBERS.get(pvKey) || '0', 10);
          await env.SUBSCRIBERS.put(pvKey, String(current + 1), { expirationTtl: 86400 * 90 });

          // Daily total counter
          const totalKey = `pv_total:${today}`;
          const currentTotal = parseInt(await env.SUBSCRIBERS.get(totalKey) || '0', 10);
          await env.SUBSCRIBERS.put(totalKey, String(currentTotal + 1), { expirationTtl: 86400 * 90 });
        }

        return new Response(JSON.stringify({ ok: true }), {
          status: 200,
          headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store', ...corsHeaders }
        });
      } catch (_) {
        return new Response(JSON.stringify({ ok: false }), { 
          status: 200,
          headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store', ...corsHeaders }
        });
      }
    }

    // 4. Founder Analytics Summary API
    if (url.pathname === '/api/stats' && request.method === 'GET') {
      if (!verifyAdminAuth(request, env)) {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), { 
          status: 401,
          headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store', ...corsHeaders }
        });
      }

      const today = new Date().toISOString().slice(0, 10);
      let totalToday = '0';
      if (env.SUBSCRIBERS) {
        totalToday = await env.SUBSCRIBERS.get(`pv_total:${today}`) || '0';
      }

      return new Response(JSON.stringify({ 
        date: today, 
        pageviews_today: parseInt(totalToday, 10),
        note: "Privacy-first analytics powered by Cloudflare KV"
      }, null, 2), {
        status: 200,
        headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store', ...corsHeaders }
      });
    }

    // Fallback to static assets
    return env.ASSETS.fetch(request);
  }
};
