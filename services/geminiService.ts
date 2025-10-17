import { GoogleGenAI, Type } from "@google/genai";
import { StudentProfile, MatchedStudent, StudyPlan } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function findMatches(
  userProfile: StudentProfile,
  allProfiles: StudentProfile[]
): Promise<MatchedStudent[]> {
  const model = "gemini-2.5-flash";
  const prompt = `
    Based on the user's profile below, find the top 3 most compatible study partners from the provided list of available students.

    User Profile:
    - Name: ${userProfile.name}
    - Needs help in: ${userProfile.subjectsHelpNeeded.join(', ')}
    - Can help in: ${userProfile.subjectsCanHelp.join(', ')}
    - Availability: ${userProfile.availability.join(', ')}
    - Preferred Study Method: ${userProfile.studyMethod}

    Available Students:
    ${JSON.stringify(allProfiles, null, 2)}

    Prioritize matches where the user's "needs help" subjects align with a student's "can help" subjects. Also, consider overlapping availability and compatible study methods. For each match, provide a concise, friendly reason explaining why they are a good fit.
  `;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            matches: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.INTEGER },
                  matchReason: { type: Type.STRING }
                },
                required: ["id", "matchReason"]
              }
            }
          },
          required: ["matches"]
        }
      }
    });

    const jsonResponse = JSON.parse(response.text);
    const matchData: { id: number; matchReason: string }[] = jsonResponse.matches;

    // Map the IDs from Gemini's response to the full profile data
    const matchedStudents = matchData.map(match => {
      const studentProfile = allProfiles.find(p => p.id === match.id);
      if (!studentProfile) {
        // This case should ideally not happen if the prompt is followed correctly
        return null;
      }
      return {
        ...studentProfile,
        matchReason: match.matchReason,
      };
    }).filter((p): p is MatchedStudent => p !== null);

    return matchedStudents;

  } catch (error) {
    console.error("Gemini API call failed for findMatches:", error);
    throw new Error("Failed to fetch matches from AI service.");
  }
}


export async function generateStudyPlan(subject: string): Promise<StudyPlan> {
  const model = "gemini-2.5-flash";
  const prompt = `Generate a brief, actionable study plan for a collaborative session on the topic: "${subject}". The plan should be suitable for two students studying together. Provide key topics for discussion, engaging questions to kickstart the conversation, and a practice problem with a solution.`;
  
  try {
    const response = await ai.models.generateContent({
        model: model,
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    keyTopics: {
                        type: Type.ARRAY,
                        items: { type: Type.STRING },
                        description: "A list of 3-5 core concepts or topics to review."
                    },
                    discussionQuestions: {
                        type: Type.ARRAY,
                        items: { type: Type.STRING },
                        description: "A list of 2-3 thought-provoking questions to discuss."
                    },
                    practiceProblem: {
                        type: Type.OBJECT,
                        properties: {
                            problem: { type: Type.STRING },
                            solution: { type: Type.STRING }
                        },
                        required: ["problem", "solution"],
                        description: "A relevant practice problem and its detailed solution."
                    }
                },
                required: ["keyTopics", "discussionQuestions", "practiceProblem"]
            }
        }
    });

    return JSON.parse(response.text);
  } catch (error) {
      console.error("Gemini API call failed for generateStudyPlan:", error);
      throw new Error("Failed to generate study plan.");
  }
}

export async function generatePracticeProblem(subject: string): Promise<StudyPlan['practiceProblem']> {
  const model = "gemini-2.5-flash";
  const prompt = `Generate a single, new practice problem with a solution for the topic: "${subject}". The problem should be different from a typical textbook example and suitable for collaborative solving.`;
  
  try {
    const response = await ai.models.generateContent({
        model: model,
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    problem: { type: Type.STRING },
                    solution: { type: Type.STRING }
                },
                required: ["problem", "solution"],
                description: "A relevant practice problem and its detailed solution."
            }
        }
    });

    return JSON.parse(response.text);
  } catch (error) {
      console.error("Gemini API call failed for generatePracticeProblem:", error);
      throw new Error("Failed to generate a new practice problem.");
  }
}
