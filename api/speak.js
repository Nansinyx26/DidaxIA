export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const { text, voiceId } = req.body;
    const apiKey = process.env.ELEVENLABS_KEY;

    if (!apiKey) {
        return res.status(500).json({ error: 'ELEVENLABS_KEY not configured on Vercel' });
    }

    const url = `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`;

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'xi-api-key': apiKey
            },
            body: JSON.stringify({
                text,
                model_id: "eleven_multilingual_v2",
                voice_settings: { stability: 0.5, similarity_boost: 0.75 }
            })
        });

        if (!response.ok) {
            const err = await response.json().catch(() => ({}));
            return res.status(response.status).json(err);
        }

        const arrayBuffer = await response.arrayBuffer();
        res.setHeader('Content-Type', 'audio/mpeg');
        res.send(Buffer.from(arrayBuffer));
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch ElevenLabs API' });
    }
}
