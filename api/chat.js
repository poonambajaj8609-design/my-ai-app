export default async function handler(req, res) {
    try {
        const response = await fetch(
            "https://api-inference.huggingface.co/models/gpt2",
            {
                headers: { 
                    Authorization: `Bearer ${process.env.HF_TOKEN}`,
                    "Content-Type": "application/json"
                },
                method: "POST",
                body: JSON.stringify({ inputs: "In the world of Minecraft," }),
            }
        );
        const data = await response.json();
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: "Failed to talk to AI" });
    }
}
