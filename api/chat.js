export default async function handler(req, res) {
    try {
        let body = {};
        if (req.body) {
            body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
        }
        
        const prompt = body.prompt || "Hello!";
        // Use the model provided by the user, or default to GPT-2
        const modelUrl = body.modelUrl || "https://api-inference.huggingface.co/models/gpt2";

        const response = await fetch(modelUrl, {
            headers: { 
                "Authorization": `Bearer ${process.env.HF_TOKEN}`,
                "Content-Type": "application/json"
            },
            method: "POST",
            body: JSON.stringify({ inputs: prompt }),
        });

        const data = await response.json();
        res.status(200).json(data);
    } catch (err) {
        res.status(500).json([{ generated_text: "Worker Error: " + err.message }]);
    }
}
 
