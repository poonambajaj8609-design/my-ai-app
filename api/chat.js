export default async function handler(req, res) {
    try {
        let body = {};
        if (req.body) {
            body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
        }
        
        const prompt = body.prompt || "Hello!";
        
        // NEW 2026 ROUTER URL FORMAT
        // If the user didn't paste a URL, we use the new router path for GPT-2
        let modelUrl = body.modelUrl || "https://router.huggingface.co/hf-inference/models/gpt2";

        // Safety check: if they pasted the OLD URL, we force it to the NEW one
        if (modelUrl.includes("api-inference.huggingface.co")) {
            modelUrl = modelUrl.replace("api-inference.huggingface.co", "router.huggingface.co/hf-inference");
        }

        const response = await fetch(modelUrl, {
            headers: { 
                "Authorization": `Bearer ${process.env.HF_TOKEN}`,
                "Content-Type": "application/json"
            },
            method: "POST",
            body: JSON.stringify({ inputs: prompt }),
        });

        const data = await response.json();
        
        // Sometimes the router returns a slightly different structure, so we send it back safely
        res.status(200).json(data);
    } catch (err) {
        res.status(500).json([{ generated_text: "System Update Error: " + err.message }]);
    }
}
