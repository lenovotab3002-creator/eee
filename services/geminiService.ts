import { GoogleGenAI, Type } from "@google/genai";
import { StudentProfile, MatchedStudent, StudyPlan, ChatMessage } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const handleGeminiError = (error: any, functionName: string): never => {
  console.error(`Gemini API call failed for ${functionName}:`, error);
  let message = `An error occurred with the AI service. Please try again later.`;
  
  const errorMessage = error.toString();
  if (errorMessage.includes('429') || errorMessage.includes('RESOURCE_EXHAUSTED')) {
      message = "You're making requests too quickly! Please wait a moment and try again.";
  } else if (errorMessage.includes('API_KEY_INVALID')) {
      message = "The API key is invalid. Please check your configuration.";
  }
  
  throw new Error(message);
};

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
    handleGeminiError(error, 'findMatches');
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
    handleGeminiError(error, 'generateStudyPlan');
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
    handleGeminiError(error, 'generatePracticeProblem');
  }
}

export async function generateChatResponse(
  chatHistory: ChatMessage[],
  participants: StudentProfile[],
  subject: string,
  userName: string
): Promise<{sender: string, text: string}> {
  const model = "gemini-2.5-flash";
  const participantNames = participants.map(p => p.name).join(', ');
  
  const formattedHistory = chatHistory.map(msg => `${msg.sender}: ${msg.text}`).join('\n');

  const prompt = `
    You are role-playing as a group of students in a study session.
    The topic is "${subject}".
    The students in the group are: ${participantNames}.
    The user you are talking to is named "${userName}". When you see the sender "You", that is "${userName}".

    Below is the recent chat history. Your task is to generate the next response in the conversation.
    Choose one of the students (${participantNames}) to speak. The response should be natural, on-topic, and in character for a student.
    Keep the response concise and conversational.

    Chat History:
    ${formattedHistory}

    Now, generate the next message.
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
            sender: { 
              type: Type.STRING,
              description: `The name of the student who is speaking. Must be one of: ${participantNames}.`
            },
            text: { 
              type: Type.STRING,
              description: "The content of the message."
            }
          },
          required: ["sender", "text"]
        }
      }
    });

    return JSON.parse(response.text);

  } catch (error) {
    handleGeminiError(error, 'generateChatResponse');
    // Return a fallback response on error
    return {
        sender: participants[0]?.name || "Alex",
        text: "Sorry, I got a bit distracted. What were we saying?"
    };
  }
}

export async function generateGroupChatSnippet(
  participants: StudentProfile[],
  subject: string,
  chatHistory: ChatMessage[]
): Promise<{sender: string, text: string}> {
  const model = "gemini-2.5-flash";
  const participantNames = participants.map(p => p.name).join(', ');
  
  const formattedHistory = chatHistory.map(msg => `${msg.sender}: ${msg.text}`).join('\n');

  const prompt = `
    You are observing a study group session.
    The topic is "${subject}".
    The students in the group are: ${participantNames}.

    Below is their recent chat history. Your task is to generate the very next message in the conversation.
    Choose one of the students (${participantNames}) to speak. The response should be natural, on-topic, and in character for a student.
    Keep the response concise and conversational.

    Chat History:
    ${formattedHistory}

    Generate the next single message from one of the participants.
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
            sender: { 
              type: Type.STRING,
              description: `The name of the student who is speaking. Must be one of: ${participantNames}.`
            },
            text: { 
              type: Type.STRING,
              description: "The content of the message."
            }
          },
          required: ["sender", "text"]
        }
      }
    });

    return JSON.parse(response.text);

  } catch (error) {
    handleGeminiError(error, 'generateGroupChatSnippet');
    // Return a fallback response on error
    return {
        sender: participants[Math.floor(Math.random() * participants.length)]?.name || "Student",
        text: "Interesting point. What does everyone else think?"
    };
  }
}