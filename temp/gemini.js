// Gemini API Integration for ContentGenix

// Replace this with your actual Gemini API key
const GEMINI_API_KEY = "AIzaSyBFjIIxhkvWk35f3vOKCtO3IDklvOme3Q4";
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent";

// This function will replace the simulateAIResponse function in your script.js
async function generateWithGeminiAPI(platform, type, topic, prompt, tone) {
  try {
    // Construct the proper prompt for Gemini
    const systemPrompt = `
      You are ContentGenix, an AI assistant specialized in creating engaging content for social media platforms.
      
      Please generate content for ${platform} with the following specifications:
      - Content Type: ${type}
      - Topic/Theme: ${topic}
      - Additional Details: ${prompt || "None provided"}
      - Tone: ${tone}
      
      Your response should be in JSON format with the following keys:
      - main: The primary content suitable for the platform
      - hashtags: Relevant hashtags (no # symbol needed, just space-separated words)
      - title: A catchy title for the content
      - joke: A relevant joke about the topic (optional)
      - quote: An inspirational quote related to the topic (optional)
      
      Please format the content appropriately for ${platform}.
    `;

    // Build request body for Gemini API
    const requestBody = {
      contents: [
        {
          parts: [{ text: systemPrompt }]
        }
      ],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 1024
      }
    };

    // Make the API request
    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Gemini API error:", errorData);
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();

    // Extract the text response from Gemini
    const textResponse = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!textResponse) {
      throw new Error("Invalid response format from Gemini API");
    }

    // Parse the JSON response - the API should return properly formatted JSON
    // If it doesn't, we need to extract it
    let contentObj;
    try {
      // Try to parse the entire response as JSON
      contentObj = JSON.parse(textResponse);
    } catch (e) {
      // If that fails, try to extract JSON using regex
      const jsonMatch = textResponse.match(/```json\n([\s\S]*?)\n```/) ||
        textResponse.match(/{[\s\S]*?}/);

      if (jsonMatch) {
        try {
          contentObj = JSON.parse(jsonMatch[1] || jsonMatch[0]);
        } catch (e2) {
          console.error("Failed to parse JSON from API response", e2);
          throw new Error("Failed to parse content from AI");
        }
      } else {
        // If all parsing fails, create a fallback structure
        contentObj = {
          main: textResponse,
          hashtags: generateHashtags(topic, platform),
          title: generateTitle(type, topic, tone),
          joke: generateJoke(topic),
          quote: generateQuote(topic, tone)
        };
      }
    }

    return contentObj;
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw error;
  }
}

// Helper functions from your existing code, kept for fallback
function generateHashtags(topic, platform) {
  const topicTags = topic.toLowerCase().split(' ').filter(word => word.length > 2).map(word => word);

  const platformTags = {
    instagram: ["instagood", "photooftheday", "love", "fashion", "beautiful"],
    youtube: ["youtube", "video", "creator", "subscribe", "content"],
    linkedin: ["networking", "career", "business", "leadership", "professional"],
    twitter: ["trending", "twittertalks", "tweetit", "viral", "twitterverse"],
    tiktok: ["fyp", "foryou", "trending", "viral", "tiktoktrend"],
    blog: ["blogger", "writing", "content", "blogging", "article"]
  };

  // Combine topic-specific and platform-specific tags
  let allTags = [
    ...topicTags.map(tag => tag),
    ...topicTags.map(tag => `${tag}tips`),
    topic.replace(/\s+/g, ''),
    `${topic.replace(/\s+/g, '')}advice`,
    ...platformTags[platform]
  ];

  // Remove duplicates and limit to 10
  const uniqueTags = [...new Set(allTags)].slice(0, 10);

  return uniqueTags.join(' ');
}

function generateTitle(type, topic, tone) {
  const titles = {
    professional: `The Ultimate ${topic} Guide for Professionals`,
    casual: `Hey! Check Out This Amazing ${topic} Content`,
    funny: `${topic}? More Like ${topic.split(' ')[0]}mazing!`,
    inspirational: `Transform Your Life with ${topic}: A Journey`,
    educational: `Everything You Need to Know About ${topic}`
  };

  return titles[tone] || `${topic.charAt(0).toUpperCase() + topic.slice(1)} - Must-See Content`;
}

function generateJoke(topic) {
  const topicWord = topic.split(' ')[0].toLowerCase();

  const jokes = [
    `Why don't ${topicWord}s ever get lost? Because they always take the right path!`,
    `What do you call a ${topicWord} that won't share? Shellfish!`,
    `I was going to make a joke about ${topic}, but all the good ones argon.`,
    `What's a ${topicWord}'s favorite day of the week? Fryday!`,
    `I told my friend about ${topic}, but they didn't believe me. I said, "That's the ${topicWord} truth!"`
  ];

  return jokes[Math.floor(Math.random() * jokes.length)];
}

function generateQuote(topic, tone) {
  const quotes = {
    professional: `"Success in ${topic} is not the key to happiness. Happiness is the key to success." - ContentGenix AI`,
    casual: `"Life is too short for boring ${topic} content." - ContentGenix AI`,
    funny: `"Behind every successful ${topic}, there is a lot of caffeine." - ContentGenix AI`,
    inspirational: `"Your ${topic} journey is uniquely yours. Embrace it with passion and purpose." - ContentGenix AI`,
    educational: `"Knowledge about ${topic} is power, but enthusiasm for it pulls the switch." - ContentGenix AI`
  };

  return quotes[tone] || `"The best way to predict the future of ${topic} is to create it." - ContentGenix AI`;
}

// To implement this in your application, replace the simulateAIResponse function call in the generateContent function with:
// response = await generateWithGeminiAPI(platform, type, topic, prompt, tone);