// Copyright (C) 2026  Merijn Vervoorn
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.

// You should have received a copy of the GNU General Public License
// along with this program.  If not, see <https://www.gnu.org/licenses/>.

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
