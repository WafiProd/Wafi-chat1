export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    const { message } = req.body;
    const userMessage = message || "";

    const instructions = `
You are Wafi Production’s website assistant.
Tone: corporate, confident, concise.
Services: Corporate videography, Event videography.
Service areas: Washington DC, Maryland, Virginia, New York.
Primary CTA: https://book.titan.email/wafiproduction/discoverycall
Ask short qualifying questions and drive users to book a call.
`;

    const r = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-5",
        input: [
          { role: "system", content: instructions },
          { role: "user", content: userMessage }
        ],
        max_output_tokens: 200
      })
    });

    const data = await r.json();
    res.status(200).json({ reply: data.output_text });
  } catch (e) {
    res.status(500).json({ reply: "Something went wrong." });
  }
}
