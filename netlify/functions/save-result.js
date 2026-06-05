// Netlify serverless function — saves quiz results to Notion
// Env vars required: NOTION_TOKEN, NOTION_DATABASE_ID

exports.handler = async (event) => {
  // CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
      },
      body: '',
    };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  // Parse body
  let data;
  try {
    data = JSON.parse(event.body);
  } catch {
    return { statusCode: 400, body: JSON.stringify({ error: 'Invalid JSON' }) };
  }

  // Basic validation — don't save obviously empty submissions
  const { childName, childAge, parentName, whatsapp, profile, planet, topStrengths, language } = data;
  if (!childName || !parentName || !whatsapp) {
    return { statusCode: 400, body: JSON.stringify({ error: 'Missing required fields' }) };
  }

  // Read secrets from environment (never exposed to browser)
  const NOTION_TOKEN = process.env.NOTION_TOKEN;
  const NOTION_DB    = process.env.NOTION_DATABASE_ID;

  if (!NOTION_TOKEN || !NOTION_DB) {
    console.error('Notion env vars not set');
    return { statusCode: 500, body: JSON.stringify({ error: 'Server not configured' }) };
  }

  try {
    const res = await fetch('https://api.notion.com/v1/pages', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${NOTION_TOKEN}`,
        'Content-Type': 'application/json',
        'Notion-Version': '2022-06-28',
      },
      body: JSON.stringify({
        parent: { database_id: NOTION_DB },
        properties: {
          // Title column (required by Notion — must be "title" type)
          'Child Name': {
            title: [{ text: { content: childName } }],
          },
          'Age': {
            number: parseInt(childAge) || 0,
          },
          'Parent Name': {
            rich_text: [{ text: { content: parentName } }],
          },
          'WhatsApp': {
            phone_number: whatsapp,
          },
          'Profile': {
            select: { name: profile },
          },
          'Planet': {
            rich_text: [{ text: { content: planet } }],
          },
          'Top Strengths': {
            rich_text: [{ text: { content: topStrengths } }],
          },
          'Language': {
            select: { name: language },
          },
        },
      }),
    });

    if (!res.ok) {
      const err = await res.json();
      console.error('Notion API error:', JSON.stringify(err));
      return { statusCode: 500, body: JSON.stringify({ error: 'Notion API error', detail: err.message }) };
    }

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ok: true }),
    };
  } catch (err) {
    console.error('Function error:', err);
    return { statusCode: 500, body: JSON.stringify({ error: 'Internal server error' }) };
  }
};
