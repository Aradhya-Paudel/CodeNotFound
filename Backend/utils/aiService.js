const axios = require('axios');

/**
 * AI Service for Emergency Reasoning
 * Uses OpenRouter (google/gemma-3-27b-it:free)
 */

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const MODEL = "google/gemma-3-27b-it:free";

const analyzeEmergencyImage = async (base64Image) => {
    try {
        if (!OPENROUTER_API_KEY) {
            throw new Error("OPENROUTER_API_KEY is missing from environment variables");
        }

        const response = await axios.post(
            "https://openrouter.ai/api/v1/chat/completions",
            {
                model: MODEL,
                messages: [
                    {
                        role: "system",
                        content: `You are an Emergency Response AI. Your job is to analyze images and determine if there is a real medical or traffic emergency.
                        
                        PERSONA GUIDELINES:
                        1. REAL EMERGENCY: If you see an accident, casualty, or medical crisis:
                           - Provide a concise assessment of the situation.
                           - Mention specific casualties if visible.
                           - Recommend the ambulance type: "ALS" (Advanced Life Support) for critical injuries or "BLS" (Basic Life Support) for non-life-threatening ones.
                           - End with: "Note: This is AI-generated knowledge and can be wrong. Please verify on site."
                        
                        2. TROLL/FAKE/GARBAGE: If the image is NOT an emergency (e.g., a selfie, a wall, food, person messing around):
                           - Detect that it's a prank or unrelated photo.
                           - Respond with a funny, comedy-vibe warning message. Be witty but firm about not wasting emergency resources.
                        
                        FORMAT:
                        Return your response in JSON format:
                        {
                          "is_emergency": boolean,
                          "severity": "low" | "medium" | "high" | "none",
                          "analysis": "string (the actual reasoning or funny message)",
                          "recommended_ambulance": "ALS" | "BLS" | "none"
                        }`
                    },
                    {
                        role: "user",
                        content: [
                            {
                                type: "text",
                                text: "Analyze this image for an emergency response system."
                            },
                            {
                                type: "image_url",
                                image_url: {
                                    url: base64Image.startsWith('data:') ? base64Image : `data:image/jpeg;base64,${base64Image}`
                                }
                            }
                        ]
                    }
                ],
                response_format: { type: "json_object" }
            },
            {
                headers: {
                    "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
                    "HTTP-Referer": "https://hackathon-emergency.com", // Optional for OpenRouter
                    "X-Title": "Emergency Response System",
                    "Content-Type": "application/json"
                }
            }
        );

        const aiOutput = response.data.choices[0].message.content;
        return typeof aiOutput === 'string' ? JSON.parse(aiOutput) : aiOutput;

    } catch (error) {
        console.error("AI Analysis Error:", error.response?.data || error.message);
        return {
            is_emergency: true, // Fail-safe: assume emergency if AI fails
            severity: "unknown",
            analysis: "AI analysis server is temporarily busy. Proceeding with standard emergency logic. (Manual verification required)",
            recommended_ambulance: "BLS"
        };
    }
};

module.exports = { analyzeEmergencyImage };
