import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

// Ensure the API key is available
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
  console.error("GEMINI_API_KEY is not set. Please set it in your .env.local file.");
  // Exit or throw an error in a real app, for dev, just log.
}

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY || "");

export async function POST(req: Request) {
  if (!GEMINI_API_KEY) {
    return NextResponse.json({ message: 'Server configured incorrectly: Gemini API key missing.' }, { status: 500 });
  }

  try {
    const { latitude, longitude, selectedLayers } = await req.json();

    if (latitude === null || longitude === null || !selectedLayers || !Array.isArray(selectedLayers)) {
      return NextResponse.json({ message: 'Missing required parameters: latitude, longitude, or selectedLayers.' }, { status: 400 });
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' }); // Or 'gemini-1.5-pro' for more advanced features if available

    const prompt = `Given the location with Latitude: ${latitude} and Longitude: ${longitude}, and the active data layers: ${selectedLayers.join(', ')}. Please predict the groundwater levels and explain the influencing factors based on these data points. If no specific data is provided for these layers at this exact point, give a general educated prediction based on common geographical knowledge and highlight what data would improve accuracy. Keep the response concise and informative.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({ prediction: text });

  } catch (error: any) {
    console.error('Gemini API call failed:', error);
    // Provide more specific error messages if possible
    let errorMessage = 'An unexpected error occurred during AI prediction.';
    if (error.response && error.response.statusText) {
      errorMessage = `Gemini API Error: ${error.response.statusText}`;
    } else if (error.message) {
      errorMessage = `AI Error: ${error.message}`;
    }
    return NextResponse.json({ message: errorMessage }, { status: 500 });
  }
}