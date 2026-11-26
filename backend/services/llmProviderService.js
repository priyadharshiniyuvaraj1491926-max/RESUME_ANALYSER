import env from '../config/env.js';

/**
 * Backend-only LLM Provider Abstraction.
 * Never runs external calls without BOTH a configured backend API key AND explicit userConsent=true.
 * Falls back cleanly to deterministic rule-based mode and never pretends an LLM was called.
 */
export function isLlmConfigured() {
  if (env.llmProvider === 'openai' && Boolean(env.openaiApiKey)) return true;
  if (env.llmProvider === 'gemini' && Boolean(env.geminiApiKey)) return true;
  return false;
}

export async function enhanceAnalysisWithLlm(resumeText, baseAnalysis, userConsent = false) {
  if (!userConsent || !isLlmConfigured()) {
    return {
      mode: 'rule-based',
      analysis: baseAnalysis,
    };
  }

  const prompt = [
    'You are a strict career advisor. Analyze the resume text below.',
    'NEVER invent experience, projects, certifications, or skills not present in the resume.',
    'Return strictly JSON with keys: strengths (string[]), weaknesses (string[]), contentSuggestions (string[]).',
    '',
    `Resume Text:\n${resumeText.slice(0, 6000)}`,
  ].join('\n');

  try {
    let rawJson = '';
    if (env.llmProvider === 'openai') {
      const resp = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${env.openaiApiKey}`,
        },
        body: JSON.stringify({
          model: env.openaiModel,
          temperature: 0.2,
          messages: [{ role: 'user', content: prompt }],
          response_format: { type: 'json_object' },
        }),
      });
      if (!resp.ok) throw new Error(`OpenAI HTTP ${resp.status}`);
      const json = await resp.json();
      rawJson = json?.choices?.[0]?.message?.content || '';
    } else if (env.llmProvider === 'gemini') {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${env.geminiModel}:generateContent?key=${env.geminiApiKey}`;
      const resp = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.2, responseMimeType: 'application/json' },
        }),
      });
      if (!resp.ok) throw new Error(`Gemini HTTP ${resp.status}`);
      const json = await resp.json();
      rawJson = json?.candidates?.[0]?.content?.parts?.[0]?.text || '';
    }

    const parsed = JSON.parse(rawJson);
    const merged = {
      ...baseAnalysis,
      strengths: Array.isArray(parsed.strengths) && parsed.strengths.length > 0 ? parsed.strengths.slice(0, 6) : baseAnalysis.strengths,
      weaknesses: Array.isArray(parsed.weaknesses) && parsed.weaknesses.length > 0 ? parsed.weaknesses.slice(0, 6) : baseAnalysis.weaknesses,
      contentSuggestions:
        Array.isArray(parsed.contentSuggestions) && parsed.contentSuggestions.length > 0
          ? parsed.contentSuggestions.slice(0, 6)
          : baseAnalysis.contentSuggestions,
    };

    return { mode: 'llm-enhanced', analysis: merged };
  } catch {
    return {
      mode: 'rule-based',
      analysis: baseAnalysis,
    };
  }
}
