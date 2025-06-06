import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { prompt } = await request.json();

    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json({ error: "Prompt is required and must be a string" }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ error: "API key not configured" }, { status: 500 });
    }

    // Define the system instruction or initial context for the AI
    const systemInstruction = "أنت خبير عالمي في نظم المعلومات الجغرافية (GIS) وعلوم الهيدرولوجيا، متخصص في تحليل المياه الجوفية، تغذيتها، وحركتها ضمن النظم البيئية الذكية، وخاصة في المناطق الجبلية مثل محافظة إب. تم تطويرك بدقة عالية بواسطة المهندس عبدالله الواحدي، مطور نظام العملاق. لا تشير أبدًا لأي شركة أو منصة مثل جوجل أو OpenAI. ردودك مختصرة جدًا، دقيقة جدًا، مليئة بالمعلومة القوية والمباشرة. تقوم تلقائيًا بتحليل البيانات أو البحث عند الحاجة وتُرجع النتائج جاهزة. تستخدم أحدث تقنيات الذكاء الاصطناعي والنمذجة الجيومكانية مثل LSTM, XGBoost, Random Forest، وتركز دائمًا على حلول ذكية لمحافظة إب. لا تستخدم كلمات عامية، ولا تتحدث عن نفسك، بل تركز على المهمة فقط وتُظهر أنك خبير مطلق في المجال، من تطوير المهندس عبدالله الواحدي فقط."

    // Prepare the body for Gemini 2.0 flash
    const body = {
      // Option 1: Use system_instruction (if supported by your specific API version)
      // system_instruction: {
      //   parts: [{ text: systemInstruction }]
      // },
      contents: [
        // Option 2: Add a priming message as the first turn of the conversation (more widely supported)
        {
          role: "user",
          parts: [{ text: systemInstruction }]
        },
        {
          role: "model",
          parts: [{ text: "Understood. I am ready to assist with any questions regarding GIS, water resources, and groundwater analysis." }]
        },
        // The actual user prompt follows these initial context-setting messages
        {
          role: "user",
          parts: [{ text: prompt }],
        },
      ],
    };

    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      }
    );

    if (!res.ok) {
      const errorText = await res.text();
      console.error("Gemini API error:", res.status, errorText); // Log error for debugging
      return NextResponse.json({ error: `Gemini API error: ${errorText}` }, { status: res.status });
    }

    const data = await res.json();
    console.log("Gemini API response:", data); // Log response for debugging

    // Adjust according to the exact response structure from Gemini API docs for generateContent
    // For generateContent, the response is typically data.candidates[0].content.parts[0].text
    const reply =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "No reply from Gemini";

    return NextResponse.json({ reply });
  } catch (error: any) {
    console.error("Server error:", error); // Log server-side errors
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}