// Talks to Groq's chat completion API (OpenAI-compatible endpoint) to rank
// properties against a buyer's stated preferences. Groq only ever sees IDs
// and structured fields from our own sample dataset - it picks which ones
// fit best, it doesn't invent listings. We then look the real objects up
// by id ourselves, so nothing shown to the user is AI-hallucinated data.

const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions'
const GROQ_MODEL = 'llama-3.3-70b-versatile'

export async function getGroqRecommendations(preferences, properties) {
  const apiKey = process.env.GROQ_API_KEY
  if (!apiKey) {
    throw new Error('GROQ_API_KEY is not set.')
  }

  const systemPrompt = `You are a real estate recommendation engine. You will be given a buyer's preferences and a JSON list of available properties (each with an "id"). Pick the properties that best match the preferences, best match first.

Respond with ONLY valid JSON in this exact shape, nothing else:
{"matches": [{"id": "<property id from the list>", "reason": "<one short sentence, under 15 words>"}]}

Rules:
- Only use "id" values that exist in the property list you were given. Never invent an id.
- Return at most 5 matches.
- If nothing reasonably matches (e.g. no properties in the requested city, or everything is far over budget), return {"matches": []} - do not force weak matches.`

  const userPrompt = JSON.stringify({ preferences, properties })

  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 15000)

  let response
  try {
    response = await fetch(GROQ_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: GROQ_MODEL,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        response_format: { type: 'json_object' },
        temperature: 0.2,
      }),
      signal: controller.signal,
    })
  } finally {
    clearTimeout(timeout)
  }

  if (!response.ok) {
    const text = await response.text().catch(() => '')
    throw new Error(`Groq API error (${response.status}): ${text}`)
  }

  const data = await response.json()
  const content = data.choices?.[0]?.message?.content
  if (!content) {
    throw new Error('Groq API returned no content.')
  }

  let parsed
  try {
    parsed = JSON.parse(content)
  } catch {
    throw new Error('Groq API returned invalid JSON.')
  }

  const matches = Array.isArray(parsed.matches) ? parsed.matches : []
  const byId = new Map(properties.map((p) => [p.id, p]))

  return matches
    .filter((m) => byId.has(m.id))
    .slice(0, 5)
    .map((m) => ({ ...byId.get(m.id), matchReason: m.reason }))
}
