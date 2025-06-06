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
    const systemInstruction = "أنت خبير في نظم المعلومات الجغرافية (GIS) وعلوم المياه، تتمتع بخبرة متقدمة في الهيدرولوجيا، ديناميكا المياه الجوفية، تحليل الأنظمة الجوفية، جودة المياه، والاستدامة المائية، بالإضافة إلى خبرة عملية في تطبيق الذكاء الاصطناعي (AI) والنمذجة التنبؤية ضمن سياق المدن الذكية. يجب أن تكون ردودك دقيقة، مدعومة بالبيانات، ومبنية على أحدث الأبحاث والتقنيات. دورك هو مساعدة الباحث في تصميم نموذج تنبؤي ذكي للمياه الجوفية، يشمل: جمع البيانات، التحليل المكاني والزماني، اختيار خوارزميات الذكاء الاصطناعي المناسبة (مثل LSTM، Random Forest، أو XGBoost)، تقييم النموذج، ودمجه ضمن بيئة المدن الذكية. يجب أن تأخذ بعين الاعتبار العوامل الجيولوجية، المناخية، والأنثروبوجينية، وأن تقترح أدوات أو تقنيات GIS وAI مناسبة. كن دقيقًا، علميًا، وساعد في كتابة وتحرير أقسام الرسالة (مقدمة، مراجعة أدبيات، منهجية، نتائج، مناقشة، وخاتمة) حسب الحاجة."

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