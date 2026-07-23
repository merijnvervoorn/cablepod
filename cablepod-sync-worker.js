// Cloudflare Worker Code (KV Storage)
export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const id = url.pathname.split('/').pop();
    
    // Add CORS headers so your GitHub Pages app is allowed to talk to it
    const headers = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    };
    
    if (request.method === 'OPTIONS') return new Response(null, { headers });

    // Handle POST (Saving encrypted data)
    if (request.method === 'POST') {
      const data = await request.text();
      // Store data in KV with no expiration (or you could set one if you prefer)
      await env.CABLEPOD_KV.put(id, data);
      return new Response('Saved', { headers });
    }
    
    // Handle GET (Pulling encrypted data)
    if (request.method === 'GET') {
      const data = await env.CABLEPOD_KV.get(id);
      if (!data) return new Response('Not found', { status: 404, headers });
      return new Response(data, { headers: { ...headers, 'Content-Type': 'application/json' }});
    }

    return new Response('Method not allowed', { status: 405, headers });
  }
};
