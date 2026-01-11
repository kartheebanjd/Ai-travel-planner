// --- Start of .env loader ---
const fs_for_env = require('fs');
const path_for_env = require('path');
const envPath = path_for_env.resolve(process.cwd(), '.env');
if (fs_for_env.existsSync(envPath)) {
  const envFileContent = fs_for_env.readFileSync(envPath, 'utf8');
  const envLines = envFileContent.split('\n');
  for (const line of envLines) {
    const trimmedLine = line.trim();
    if (trimmedLine && !trimmedLine.startsWith('#')) {
      const [key, ...valueParts] = trimmedLine.split('=');
      const value = valueParts.join('=').trim();
      if (key && value) {
        // Overwrite existing env vars
        process.env[key.trim()] = value;
      }
    }
  }
}
// --- End of .env loader ---

// Minimal clean server (server_clean.js) — demo-mode if no Groq key
const http = require('http');
const fs = require('fs');
const path = require('path');
const https = require('https');

const GROQ_API_KEY = process.env.GROQ_API_KEY || '';
const USE_GROQ = GROQ_API_KEY && !GROQ_API_KEY.startsWith('gsk_your');

// Groq detection: use Groq key if present, otherwise demo mode
if (USE_GROQ) console.log('🔑 Groq key found — using Groq for responses');
else console.log('⚠️  DEMO mode: no AI key found — returning mock itineraries');


function mockResponse() {
  return [
    'Demo itinerary (mock)',
    'Day 1: Morning - Explore the city center; Afternoon - Local market; Evening - Dinner at a recommended spot',
    'Day 2: Morning - Museum visit; Afternoon - Scenic walk; Evening - Local show',
    'Day 3: Morning - Short trip to viewpoint; Afternoon - Relax and shopping; Evening - Farewell dinner',
    '\nTips: This is a demo response. Add your OpenAI key to .env to enable real AI responses.'
  ].join('\n');
}

function callGroq(prompt) {
  if (!USE_GROQ) return Promise.resolve(mockResponse());

  const data = JSON.stringify({ model: 'llama-3.1-8b-instant', messages: [{ role: 'user', content: prompt }], temperature: 0.7, max_tokens: 800 });
  const options = {
    hostname: 'api.groq.com', path: '/openai/v1/chat/completions', method: 'POST',
    headers: { 'Authorization': `Bearer ${GROQ_API_KEY}`, 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(data) }
  };

  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', c => body += c);
      res.on('end', () => {
        try {
          const j = JSON.parse(body);
          if (j.error) return reject(new Error(j.error.message || 'Groq error'));
          const text = j.choices && j.choices[0] && j.choices[0].message && j.choices[0].message.content;
          resolve(text || mockResponse());
        } catch (e) { reject(e); }
      });
    });
    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

// Gemini support removed — server uses Groq or mock responses only

function serveFile(filePath, res) {
  fs.readFile(filePath, (err, data) => {
    if (err) { res.writeHead(404, { 'Content-Type': 'text/html' }); res.end('<h1>404 - Not Found</h1>'); return; }
    const ext = path.extname(filePath).toLowerCase();
    const map = { '.html':'text/html', '.css':'text/css', '.js':'application/javascript', '.json':'application/json', '.svg':'image/svg+xml', '.png':'image/png', '.jpg':'image/jpeg', '.jpeg':'image/jpeg', '.gif':'image/gif' };
    res.writeHead(200, { 'Content-Type': map[ext] || 'text/plain' });
    res.end(data);
  });
}

function parseBody(req) { return new Promise((resolve) => { let b = ''; req.on('data', c => b += c); req.on('end', () => { try { resolve(JSON.parse(b)); } catch { resolve(null); } }); }); }

const server = http.createServer(async (req, res) => {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') { res.writeHead(200); res.end(); return; }

  // (Removed Gemini models endpoint)

  if (req.url === '/plan' && req.method === 'POST') {
    const body = await parseBody(req);
    if (!body || !body.destination) { res.writeHead(400, { 'Content-Type': 'application/json' }); res.end(JSON.stringify({ error: 'Missing destination' })); return; }
    const { destination, interests, budget = 'moderate', days = 3 } = body;
    const prompt = `Create a ${days}-day travel itinerary for ${destination}. Budget: ${budget}. Interests: ${interests || 'general'}. Format with DAY X: Morning/Afternoon/Evening.`;
    try {
      let plan = null;
      if (USE_GROQ) {
        plan = await callGroq(prompt);
      }
      if (!plan) plan = mockResponse();
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ plan }));
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: err.message }));
    }
    return;
  }

  // Serve static files from 'public' directory
  let safe = req.url.split('?')[0];
  if (safe === '/') {
    safe = '/index.html';
  }
  const filePath = path.join(__dirname, safe);
  serveFile(filePath, res);
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`✈️  AI Travel Planner (clean) running on http://localhost:${PORT}`));
