export default async function handler(req, res) {
    const body = req.body ? JSON.parse(req.body) : { prompt: "Hello" };
    
    const response = await fetch("https://api-inference.huggingface.co/models/gpt2", {
        headers: { Authorization: `Bearer ${process.env.HF_TOKEN}` },
        method: "POST",
        body: JSON.stringify({ inputs: body.prompt }),
    });
    const data = await response.json();
    res.status(200).json(data);
}
