// Vercel Serverless Function
// 클라이언트는 이 엔드포인트(/api/gemini)만 호출하고, 실제 Gemini API 키는
// Vercel 프로젝트의 환경 변수(GEMINI_API_KEY)에만 저장되어 브라우저에 노출되지 않습니다.
//
// 필요한 환경 변수 (Vercel 대시보드 > Settings > Environment Variables):
//   GEMINI_API_KEY  - Google AI Studio에서 발급받은 키
//   GEMINI_MODEL    - (선택) 사용할 모델명. 미설정 시 아래 기본값 사용.
//                      Google AI Studio(https://aistudio.google.com)에서 현재 사용 가능한
//                      모델명을 확인 후 필요하면 이 값을 바꿔주세요.

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "POST 요청만 지원합니다." });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "서버에 GEMINI_API_KEY가 설정되어 있지 않습니다." });
  }

  const model = process.env.GEMINI_MODEL || "gemini-2.0-flash";
  const { profile, recentWorkouts, ruleBasedRecommendation } = req.body || {};

  const prompt = `당신은 친절하고 전문적인 웨이트 트레이닝 코치입니다.
아래는 한 회원의 최근 7일 운동 기록과 규칙 기반 추천입니다. 이를 바탕으로
1) 최근 운동 패턴에 대한 간단한 총평
2) 부위별 밸런스나 과훈련/부족 부위에 대한 조언
3) 내일 운동에 대한 구체적인 제안
을 한국어로, 친근하지만 간결하게(4~6문장) 작성해주세요. 마크다운 기호(#, * 등)는 사용하지 마세요.

[회원 정보]
체중: ${profile?.weightKg ?? "미상"}kg / 키: ${profile?.heightCm ?? "미상"}cm

[규칙 기반 추천]
${ruleBasedRecommendation ?? "정보 없음"}

[최근 7일 운동 기록 (JSON)]
${JSON.stringify(recentWorkouts ?? [], null, 2)}`;

  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
    const geminiRes = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.7, maxOutputTokens: 500 },
      }),
    });

    if (!geminiRes.ok) {
      const errText = await geminiRes.text();
      return res.status(geminiRes.status).json({ error: "Gemini API 오류", detail: errText });
    }

    const data = await geminiRes.json();
    const text =
      data?.candidates?.[0]?.content?.parts?.map((p) => p.text).join("") ||
      "분석 결과를 생성하지 못했어요.";

    return res.status(200).json({ text });
  } catch (err) {
    return res.status(500).json({ error: "서버 오류", detail: String(err) });
  }
}
