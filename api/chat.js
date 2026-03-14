export default async function handler(req, res) {
    try {
        let body = {};
        if (req.body) {
            body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
        }
        
        const prompt = body.prompt || "Hello!";
        
        // NEW 2026 STANDARD: Use the 'v1' chat completions path
        // Defaulting to a very reliable, small model for testing
        let modelId = "Qwen/Qwen2.5-0.5B-Instruct"; 
        
        // If you pasted a full URL in the box, we'll try to extract just the ID
        let targetUrl = body.modelUrl || "";
        if (targetUrl.includes("models/")) {
            modelId = targetUrl.split("models/")[1];
        }

        const routerUrl = `https://router.huggingface.co/hf-inference/models/${modelId}`;

        const response = await fetch(routerUrl, {
            headers: { 
                "Authorization": `Bearer ${process.env.HF_TOKEN}`,
                "Content-Type": "application/json"
            },
            method: "POST",
            body: JSON.stringify({ 
                inputs: prompt,
                parameters: { max_new_tokens: 50 } 
            }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            return res.status(response.status).json([{ generated_text: `HF Error ${response.status}: ${errorText}` }]);
        }

        const data = await response.json();
        res.status(200).json(data);

    } catch (err) {
        res.status(500).json([{ generated_text: "Worker Crash: " + err.message }]);
    }
}
