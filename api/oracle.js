// /api/oracle.js
export default async function handler(req, res){
    if(req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  
    try{
      const { question } = req.body || {};
      if(!question || typeof question !== "string"){
        return res.status(400).json({ error: "Missing question" });
      }
  
      const sys = `You are The Oracle: a cryptic yet precise voice.
  - Tone: mystical, concise, a touch of poetry; never cheesy.
  - Style: 2–5 short paragraphs, vivid but readable, no emoji.
  - Always end with a single-line omen starting with "Omen:".
  - Avoid financial/medical/legal advice.`;
  
      const user = `Question: ${question}
  Respond in English.`;
  
      // Call OpenAI (fetch-based; no SDK needed)
      const r = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: "gpt-5", // or the latest GPT-5 chat model name in your account
          messages: [
            { role: "system", content: sys },
            { role: "user", content: user }
          ],
          temperature: 0.8,
          max_tokens: 500
        })
      });
  
      if(!r.ok){
        const t = await r.text();
        return res.status(500).json({ error: "OpenAI error", detail: t });
      }
  
      const j = await r.json();
      const answer = j.choices?.[0]?.message?.content?.trim() || "";
      return res.status(200).json({ answer });
    }catch(e){
      console.error(e);
      return res.status(500).json({ error: "Server error" });
    }
  }
  