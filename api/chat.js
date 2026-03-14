export default async function handler(req, res) {
    try {
        const body = req.body ? (typeof req.body === 'string' ? JSON.parse(req.body) : req.body) : {};
        const prompt = body.prompt || "Hello!";
        
        // We are using a 'serverless' friendly model that is almost always online
        // If you want to change it later, just change this string
        let modelId = "HuggingFaceH4/zephyr-7b-beta"; 

        // If you put a name in the box on the website, we use that instead
        if (body.modelUrl && body.modelUrl.length > 5) {
            // This part cleans the URL in case you pasted a full link
            modelId = body.modelUrl.replace("https://huggingface.co/", "")
                                   .replace("https://router.huggingface.co/hf-inference/models/", "");
        }

        const response = await fetch(`https://router.huggingface.co/hf-inference/models/${modelId}`, {
            headers: { 
                "Authorization": `Bearer ${process.env.HF_TOKEN}`,
                "Content-Type": "application/json"
            },
            method: "POST",
            body: JSON.stringify({ 
                inputs: prompt,
                parameters: { max_new_tokens: 100 } 
            }),
        });

        if (!response.ok) {
            const errData = await response.json().catch(() => ({}));
            return res.status(response.status).json([{ 
                generated_text: `Error ${response.status}: ${errData.error || "Model not found. Try 'gpt2' or 'facebook/opt-125m' instead."}` 
            }]);
        }

        const data = await response.json();
        res.status(200).json(data);

    } catch (err) {
        res.status(500).json([{ generated_text: "System Crash: " + err.message }]);
    }
}
