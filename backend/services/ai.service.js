import axios from "axios";

export const generateSmartReplies = async (message) => {

    const prompt = `
Generate exactly 3 short replies.

Rules:

Reply should be less than 8 words.

Reply naturally.

Return ONLY a JSON array.
 Do NOT use markdown.
Do NOT explain anything.

Example:

[
"Sure!",
"Sounds good.",
"I'll let you know."
]

Message:

${message}
`;

    const response = await axios.post(

        "https://openrouter.ai/api/v1/chat/completions",

        {

            model: "google/gemma-3-27b-it",

            messages: [

                {

                    role: "user",

                    content: prompt

                }

            ]

        },

        {

            headers: {

                Authorization:
`Bearer ${process.env.OPENROUTER_API_KEY}`,

                "Content-Type":"application/json"

            }

        }

    );

    const content = response.data.choices[0].message.content;

const cleaned = content
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();

return JSON.parse(cleaned);
};


export const generateSummary = async (messages) => {

    const conversation = messages
        .map((message) => {

            const sender =
                message.senderId === messages[0].senderId
                    ? "Person A"
                    : "Person B";

            return `${sender}: ${message.text || "[Image]"}`;

        })
        .join("\n");

    const prompt = `

Summarize the following conversation.

Rules:

• Maximum 5 bullet points.

• Do not mention names.

• Mention important decisions.

• Mention pending tasks.

• Keep it under 100 words.

Conversation:

${conversation}

`;

    const response = await axios.post(

        "https://openrouter.ai/api/v1/chat/completions",

        {

            model: "google/gemma-3-27b-it",

            messages: [

                {

                    role: "user",

                    content: prompt

                }

            ]

        },

        {

            headers: {

                Authorization:
                    `Bearer ${process.env.OPENROUTER_API_KEY}`,

                "Content-Type": "application/json"

            }

        }

    );

    return response.data.choices[0].message.content.trim();

};
