export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // 1. Subscription API Endpoint
    if (url.pathname === '/api/subscribe' && request.method === 'POST') {
      try {
        const body = await request.json();
        const email = (body.email || '').trim().toLowerCase();
        
        // Basic email validation regex
        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
          return new Response(JSON.stringify({ error: 'Invalid email address' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
          });
        }

        const data = {
          email,
          createdAt: new Date().toISOString(),
          lang: body.lang || 'zh',
          source: body.source || 'website_newsletter',
          ip: request.headers.get('cf-connecting-ip') || 'unknown',
          country: request.headers.get('cf-ipcountry') || 'unknown'
        };

        // Save individual subscriber key in KV
        await env.SUBSCRIBERS.put(`sub:${email}`, JSON.stringify(data));

        // Maintain master index of emails
        let index = [];
        try {
          const rawIndex = await env.SUBSCRIBERS.get('master_subscriber_index');
          if (rawIndex) index = JSON.parse(rawIndex);
        } catch (e) {}

        if (!index.includes(email)) {
          index.push(email);
          await env.SUBSCRIBERS.put('master_subscriber_index', JSON.stringify(index));
        }

        return new Response(JSON.stringify({ success: true, email }), {
          status: 200,
          headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
        });
      } catch (err) {
        return new Response(JSON.stringify({ error: 'Internal server error', details: err.message }), {
          status: 500,
          headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
        });
      }
    }

    // 2. Founder Subscribers Export API (Secure query)
    if (url.pathname === '/api/subscribers' && request.method === 'GET') {
      const secret = url.searchParams.get('secret');
      if (secret !== 'edailab_secret_2026') {
        return new Response(JSON.stringify({ error: 'Unauthorized. Use ?secret=edailab_secret_2026' }), { 
          status: 401,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      let index = [];
      try {
        const rawIndex = await env.SUBSCRIBERS.get('master_subscriber_index');
        if (rawIndex) index = JSON.parse(rawIndex);
      } catch (e) {}

      const subscribers = [];
      for (const email of index) {
        const item = await env.SUBSCRIBERS.get(`sub:${email}`);
        if (item) subscribers.push(JSON.parse(item));
      }

      return new Response(JSON.stringify({ count: subscribers.length, subscribers }, null, 2), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 3. Privacy-Friendly Pageview Beacon (Zero cookies / GDPR compliant)
    if (url.pathname === '/api/pageview' && request.method === 'POST') {
      try {
        let body = {};
        try { body = await request.json(); } catch (_) {}
        const path = (body.path || url.pathname || '/').slice(0, 120);
        const today = new Date().toISOString().slice(0, 10);

        // Daily page-specific counter
        const pvKey = `pv:${today}:${path}`;
        const current = parseInt(await env.SUBSCRIBERS.get(pvKey) || '0', 10);
        await env.SUBSCRIBERS.put(pvKey, String(current + 1), { expirationTtl: 86400 * 90 });

        // Daily total counter
        const totalKey = `pv_total:${today}`;
        const currentTotal = parseInt(await env.SUBSCRIBERS.get(totalKey) || '0', 10);
        await env.SUBSCRIBERS.put(totalKey, String(currentTotal + 1), { expirationTtl: 86400 * 90 });

        return new Response(JSON.stringify({ ok: true }), {
          status: 200,
          headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
        });
      } catch (e) {
        return new Response(JSON.stringify({ ok: false }), { status: 200 });
      }
    }

    // 4. Founder Analytics Summary API
    if (url.pathname === '/api/stats' && request.method === 'GET') {
      const secret = url.searchParams.get('secret');
      if (secret !== 'edailab_secret_2026') {
        return new Response(JSON.stringify({ error: 'Unauthorized. Use ?secret=edailab_secret_2026' }), { 
          status: 401,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      const today = new Date().toISOString().slice(0, 10);
      const totalToday = await env.SUBSCRIBERS.get(`pv_total:${today}`) || '0';

      return new Response(JSON.stringify({ 
        date: today, 
        pageviews_today: parseInt(totalToday, 10),
        note: "Privacy-first analytics powered by Cloudflare KV"
      }, null, 2), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Fallback to static assets
    return env.ASSETS.fetch(request);
  }
};
