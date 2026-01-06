require("dotenv").config({ path: './config/.env'});
const express = require("express");
const fetch = require("node-fetch");
const cors = require("cors");
const app = express();
const port = 3000;
app.use(cors());
app.use(express.json());
app.use(express.static("public"));
const API_KEY = process.env.api_KEY;

app.post("/api/generate-image", async(req, res) => {
    const { model, prompt, width, height } = req.body;

    try {
        const response = await fetch(`https://api-inference.huggingface.co/models/${model}`, {
            method: "post",
            headers: {
                Authorization: `Bearer ${API_KEY}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                input: prompt,
                parameters: {width, height},
                options: {wait_for_model: true},

            })
        });
        
        if (!response.ok) {
            const errorText = await response.text();
            console.log("API Error:", response.status, errorText);
            return res.status(response.status).json({ error: errorText || "Image generation failed" });
        }
        
        const data = await response.arrayBuffer();
        res.set("Content-Type", "image/png");
        res.send(Buffer.from(data));
    } catch (error) {
        console.log(error);

        res.status(500).json({ error: "Image generation failed"});
    }
});

app.listen(port, () => { console.log(`Server running on http://localhost:${port}`)})