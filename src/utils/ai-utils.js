/**
 * WorkFlow3 AI Arkkitehtuuri - Keskistetty API-palvelu
 */

// Standardisivun rakenneohje (Template-generointia varten)
export const WF3_PAGE_STANDARD = `
JOKAINEN UUSI SIVU TULEE RAKENTAA TÄMÄN STANDARDIN MUKAAN:
1. Frontmatter (title, sidebar_position).
2. :::info [ROOLI | KESTO | VAIKEUSASTE] :::
3. ⚠️ TURVALLISUUS: Listaa pakolliset suojavarusteet ja riskit.
4. OHJEET: Selkeät numeroidut vaiheet.
5. :::tip [ASIAKASPALVELU] Miten tästä kerrotaan asiakkaalle. :::
6. AI-KYSYMYKSET: 3 esimerkkiä, mitä tältä sivulta voi kysyä AI:lta.
`;

export async function callGeminiAPI(apiKey, prompt, systemInstruction) {
  const url = `https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash-001:generateContent?key=${apiKey}`;
  
  const body = {
    contents: [{ 
      parts: [{ text: `${systemInstruction}\n\nKäyttäjän viesti: ${prompt}` }] 
    }],
    // Lisätään asetuksia, jotka säästävät resursseja
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 2048,
    }
  };

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });

  if (response.status === 429) {
    throw new Error("KIINTIÖ TÄYNNÄ: Gemini tarvitsee pienen tauon (1-2 min). Yritä kohta uudelleen.");
  }

  const data = await response.json();
  if (data.error) throw new Error(data.error.message);

  return data.candidates[0].content.parts[0].text;
}