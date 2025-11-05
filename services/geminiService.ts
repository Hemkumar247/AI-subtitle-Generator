import { GoogleGenAI } from "@google/genai";

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function generateSrtFromAudio(base64Audio: string, mimeType: string, targetLanguage: 'original' | 'english'): Promise<string> {
    const model = 'gemini-2.5-flash';

    const audioPart = {
        inlineData: {
            data: base64Audio,
            mimeType: mimeType,
        },
    };

    let instruction = `You are an expert audio transcriber. Your task is to transcribe the given audio and format the output as a standard SubRip (.srt) file. The transcription must be in the original language spoken in the audio.`;

    if (targetLanguage === 'english') {
        instruction = `You are an expert audio transcriber and translator. Your primary task is to generate ENGLISH subtitles for the provided audio. The audio's original language may not be English. You must first transcribe the audio and then accurately translate it into English. Format the final translated English text as a standard SubRip (.srt) file.`;
    }

    const textPart = {
        text: `${instruction}
- Ensure timestamps are accurate (HH:MM:SS,ms) and correspond to the original audio's timing.
- The format must be strictly SRT.
- Do not include any additional explanatory text, greetings, apologies, or markdown formatting. Only the raw SRT content is allowed.

Example of the required format:
1
00:00:01,234 --> 00:00:03,456
This is the first subtitle.

2
00:00:04,567 --> 00:00:06,789
This is the second subtitle.
`
    };
    
    try {
        const response = await ai.models.generateContent({
            model: model,
            contents: { parts: [textPart, audioPart] },
        });

        // The .text accessor can throw if the response is blocked
        let srtContent = response.text.trim();
        
        // Robust SRT parsing:
        // 1. Attempt to extract content from a markdown block if one exists.
        const markdownMatch = srtContent.match(/```(?:srt)?\s*\n([\s\S]+?)\n```/);
        if (markdownMatch && markdownMatch[1]) {
            srtContent = markdownMatch[1].trim();
        }
        
        // 2. Find the first valid SRT entry and extract from there to ignore any preamble.
        //    Regex is updated to handle both comma and period for milliseconds.
        const srtBlockMatch = srtContent.match(/\d+\s*\n\d{2}:\d{2}:\d{2}[,.]\d{3} --> \d{2}:\d{2}:\d{2}[,.]\d{3}/m);
        
        if (srtBlockMatch && srtBlockMatch.index !== undefined) {
            // Return the content starting from the first valid SRT block found.
            return srtContent.substring(srtBlockMatch.index);
        }

        // If no valid SRT block was found after parsing, handle as an error.
        if (response.candidates?.[0]?.finishReason === 'SAFETY') {
            throw new Error("The request was blocked due to safety concerns. The audio may contain sensitive content.");
        }
        throw new Error("The model did not return a valid SRT format. It might have refused the request or failed to process the audio.");

    } catch (error) {
        console.error("Error calling Gemini API:", error);
        if (error instanceof Error) {
            // Propagate a more informative error
            throw new Error(`Gemini API Error: ${error.message}`);
        }
        throw new Error("An unknown error occurred while communicating with the AI model.");
    }
}