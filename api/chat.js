export default async function handler(req, res) {
    const body = JSON.parse(req.body || "{}");
    const userPrompt = body.text || "Hello!";

    const response = await fetch(
        "https://api-inference.huggingface.co/models/gpt2",
        {
            headers: { Authorization: `Bearer ${process.env.HF_TOKEN}` },
            method: "POST",
            body: JSON.stringify({ inputs: userPrompt }),
        }
    );
    const data = await response.json();
    res.status(200).json(data);
}
