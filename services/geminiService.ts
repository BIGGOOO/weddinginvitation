import { GoogleGenAI, Type } from "@google/genai";

// Story generation service for the wedding couple's history
export const generateStory = async (style: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const model = 'gemini-3-flash-preview';
  const prompt = `Rewrite the romantic story of two AI engineers, Muhammad Danial Siddiqui and Noor Fatima Memon, who are getting married in February 2026. 
  They met during an AI hackathon. Danial was working on computer vision and Noor was working on LLMs. 
  They bonded over fine-tuning models and coffee. Write it in a ${style} style. 
  Keep it under 150 words. Focus on the merging of their lives like a successful model merge.`;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        temperature: 0.8,
        topP: 0.9,
      }
    });
    return response.text || "Love is the ultimate heuristic.";
  } catch (error) {
    console.error("Story generation failed:", error);
    return "Our story is being re-indexed. Please check back soon.";
  }
};

// Maps grounding service for venue location information
export const getVenueGrounding = async (venueName: string, userLat?: number, userLng?: number) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const model = 'gemini-2.5-flash';
  const contents = `Where is ${venueName}? Provide an elegant description and details for a wedding invitation.`;
  
  const config: any = {
    tools: [{ googleMaps: {} }],
  };

  if (userLat !== undefined && userLng !== undefined) {
    config.toolConfig = {
      retrievalConfig: {
        latLng: {
          latitude: userLat,
          longitude: userLng
        }
      }
    };
  }

  try {
    const response = await ai.models.generateContent({
      model,
      contents,
      config
    });
    
    const text = response.text;
    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    const mapsUri = chunks.find((c: any) => c.maps)?.maps?.uri;

    return {
      description: text,
      uri: mapsUri
    };
  } catch (error) {
    console.error("Venue grounding failed:", error);
    throw error;
  }
};

/**
 * Generates a personalized RSVP acknowledgment message
 */
export const generateRSVPAcknowledgment = async (data: { name: string; attending: boolean; message: string }) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const model = 'gemini-3-flash-preview';
  const prompt = `Generate a short, warm, and tech-witty wedding RSVP acknowledgment for a guest named ${data.name} who is ${data.attending ? 'attending' : 'not attending'}. 
  Their message to us was: "${data.message}". 
  We are two AI engineers, Muhammad Danial Siddiqui and Noor Fatima Memon getting married in Feb 2026. Keep it under 50 words.`;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
    });
    return response.text || "RSVP Received. Synchronizing data...";
  } catch (error) {
    console.error("RSVP acknowledgment failed:", error);
    return "RSVP Received. Neural link stable.";
  }
};

/**
 * AI-powered face search in the photo gallery
 */
export const searchPhotosByFace = async (base64Image: string, galleryItems: any[]) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const model = 'gemini-3-flash-preview';

  const prompt = `Look at this person's face. We want to find which wedding event galleries they are likely in.
  The available galleries are: ${JSON.stringify(galleryItems.map(item => item.title))}.
  
  Please analyze the person's expression and style in the image, then return a JSON array containing the titles of the most relevant 2 or 3 event galleries where this person might be appearing (e.g., formal events vs celebratory ones).
  
  Respond ONLY with a JSON array of strings.`;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: [
        {
          inlineData: {
            mimeType: "image/jpeg",
            data: base64Image
          }
        },
        { text: prompt }
      ],
      config: {
        responseMimeType: "application/json"
      }
    });

    const resultText = response.text;
    if (resultText) {
      return JSON.parse(resultText);
    }
    return [];
  } catch (error) {
    console.error("Face search failed:", error);
    return [];
  }
};