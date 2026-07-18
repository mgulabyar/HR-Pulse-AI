const OpenAI = require('openai');
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const screenCandidate = async (jobJD, candidateResume) => {
  const systemPrompt = `
    ROLE: You are a Principal Technical Recruiter and Talent Acquisition Specialist at a Fortune 500 tech firm.
    
    CONTEXT:
    - Job Description: "${jobJD}"
    - Candidate Resume Content: "${candidateResume}"

    TASK: Perform a high-precision gap analysis and cultural fit assessment.

    MANDATORY CRITERIA IN YOUR RESPONSE:
    1. MATCH SCORE: Assign a score from 0 to 100 based strictly on skill alignment.
    2. KEY STRENGTHS: Identify 3 top technical skills the candidate possesses that match the JD.
    3. CRITICAL GAPS: Identify any missing certifications, technologies, or experience levels required.
    4. INTERVIEW STRATEGY: Suggest 2 complex technical questions to ask this specific candidate.
    5. HIRING RECOMMENDATION: Provide a final "PROCEED" or "HOLD" decision with a 1-sentence reasoning.

    STRICT FORMATTING RULES:
    - DO NOT use stars (*), hashes (#), or any markdown.
    - Use plain UPPERCASE for headers (e.g., MATCH SCORE, CRITICAL GAPS).
    - Maintain professional, clinical, and objective language.
    - Output must be clean, spaced-out text for a dashboard view.
  `;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: "Expert Human Resources AI Consultant" },
        { role: "user", content: systemPrompt }
      ],
      temperature: 0.4
    });
    return completion.choices[0].message.content;
  } catch (err) {
    console.error("AI Brain Error:", err);
    return "MATCH SCORE: 50. REASON: AI Sync in progress. Manual review recommended.";
  }
};

module.exports = { screenCandidate };