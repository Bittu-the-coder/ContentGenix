
document.addEventListener("DOMContentLoaded", function () {
  // DOM Elements
  const themeToggle = document.getElementById("themeToggle");
  const platformTabs = document.querySelectorAll(".platform-tab");
  const generateBtn = document.getElementById("generateBtn");
  const outputSection = document.getElementById("outputSection");
  const toast = document.getElementById("toast");
  const historySection = document.getElementById("historySection");
  const historyItems = document.getElementById("historyItems");
  const toggleHistory = document.getElementById("toggleHistory");

  // Current platform
  let currentPlatform = "instagram";

  // Theme toggle functionality
  themeToggle.addEventListener("click", function () {
    document.body.classList.toggle("dark-mode");
    const icon = themeToggle.querySelector("i");
    if (document.body.classList.contains("dark-mode")) {
      icon.classList.remove("fa-moon");
      icon.classList.add("fa-sun");
    } else {
      icon.classList.remove("fa-sun");
      icon.classList.add("fa-moon");
    }
  });

  // Platform tab switching
  platformTabs.forEach((tab) => {
    tab.addEventListener("click", function () {
      platformTabs.forEach((t) => t.classList.remove("active"));
      this.classList.add("active");
      currentPlatform = this.dataset.platform;
    });
  });

  // Generate content
  generateBtn.addEventListener('click', async function () {
    const contentType = document.getElementById('contentType').value;
    const topic = document.getElementById('topic').value.trim();
    const prompt = document.getElementById('prompt').value.trim();
    const tone = document.getElementById('tone').value;

    if (!topic) {
      showToast('Please enter a topic', 'error');
      return;
    }

    // Show loading state
    outputSection.innerHTML = `
        <div class="loading">
            <div class="loading-dot"></div>
            <div class="loading-dot"></div>
            <div class="loading-dot"></div>
        </div>
    `;

    try {
      await generateContent(currentPlatform, contentType, topic, prompt, tone);
    } catch (error) {
      console.error("Error:", error);
      showToast("Failed to generate content", "error");
    }
  });

  // Generate mock content based on inputs
  async function generateContent(platform, type, topic, prompt, tone) {
    try {
      // Initialize the Gemini API
      const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

      // Create a system prompt based on user inputs
      const systemPrompt = createSystemPrompt(platform, type, topic, prompt, tone);

      // Call the Gemini API
      const result = await model.generateContent(systemPrompt);
      const response = await result.response;
      const generatedText = response.text();

      // Parse the response (assuming it returns JSON)
      let content;
      try {
        content = JSON.parse(generatedText);
      } catch (e) {
        // If not JSON, create a simple response object
        content = {
          main: generatedText,
          hashtags: await generateHashtagsWithAI(topic, platform, model),
          title: await generateTitleWithAI(topic, type, tone, model),
          joke: type === 'joke' ? generatedText : await generateJokeWithAI(topic, model),
          quote: type === 'quote' ? generatedText : await generateQuoteWithAI(topic, tone, model)
        };
      }

      // Save to history
      saveToHistory(platform, type, topic, content);

      // Display results
      displayResults(platform, type, content);

    } catch (error) {
      console.error("Error calling Gemini API:", error);
      showToast("Failed to generate content. Please try again.", "error");
      // Fallback to mock data
      displayResults(platform, type, {
        main: "Error: Couldn't connect to Gemini API. Showing sample content instead.\n\n" +
          generateMainContent(type, topic, prompt, tone),
        hashtags: generateHashtags(topic),
        title: generateTitle(type, topic, tone),
        joke: generateJoke(topic),
        quote: generateQuote(topic, tone)
      });
    }
  }

  function createSystemPrompt(platform, type, topic, prompt, tone) {
    const platformNames = {
      instagram: "Instagram post",
      youtube: "YouTube video",
      linkedin: "LinkedIn article",
      twitter: "Twitter thread",
      tiktok: "TikTok video",
      blog: "blog post"
    };

    const toneDescriptions = {
      professional: "professional and polished",
      casual: "casual and conversational",
      funny: "humorous and entertaining",
      inspirational: "inspirational and motivational",
      educational: "educational and informative"
    };

    return `
        You are a professional content creator specializing in ${platformNames[platform] || 'social media'} content.
        Generate a ${type} about ${topic} with a ${toneDescriptions[tone]} tone.
        ${prompt ? "Additional requirements: " + prompt : ""}
        
        Please return your response in JSON format with these fields:
        - main: The primary content
        - hashtags: 5-10 relevant hashtags
        - title: A compelling title
        - joke: A related joke (if appropriate)
        - quote: An inspirational quote (if appropriate)
        
        Make the content engaging and platform-appropriate for ${platform}.
    `;
  }

  async function generateHashtagsWithAI(topic, platform, model) {
    const prompt = `Generate 5-10 relevant hashtags for ${topic} on ${platform}. Return as a space-separated string.`;
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  }

  async function generateTitleWithAI(topic, type, tone, model) {
    const prompt = `Generate a ${tone} ${type} title about ${topic}.`;
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  }

  async function generateJokeWithAI(topic, model) {
    const prompt = `Tell me a funny joke about ${topic}.`;
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  }

  async function generateQuoteWithAI(topic, tone, model) {
    const prompt = `Generate an ${tone} quote about ${topic}. Include attribution to "ContentGenix AI" at the end.`;
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  }

  function generateMainContent(type, topic, prompt, tone) {
    const tones = {
      professional:
        "This professional content about " +
        topic +
        " is designed to engage your audience while maintaining a polished tone." +
        (prompt ? " Specifically addressing: " + prompt : ""),
      casual:
        "Hey there! Here's some casual content about " +
        topic +
        " that'll resonate with your followers." +
        (prompt ? " You wanted: " + prompt : ""),
      funny:
        "Get ready to laugh! Here's a hilarious take on " +
        topic +
        "." +
        (prompt ? " As requested: " + prompt : ""),
      inspirational:
        "Let this uplifting content about " +
        topic +
        " inspire your audience to greatness!" +
        (prompt ? " Focusing on: " + prompt : ""),
      educational:
        "Learn all about " +
        topic +
        " with this informative content." +
        (prompt ? " Covering: " + prompt : ""),
    };

    const contentTypes = {
      post:
        "Here's a great social media post about " +
        topic +
        ":\n\n" +
        tones[tone] +
        "\n\n" +
        getPlatformSpecificTips(currentPlatform),
      caption:
        "Perfect caption for your " +
        topic +
        " content:\n\n" +
        tones[tone] +
        " #" +
        topic.replace(/\s+/g, ""),
      hashtags: "", // Handled separately
      title: "", // Handled separately
      script:
        "Video script for your " +
        topic +
        " content:\n\n[Opening Scene]\nHost: \"Hey everyone! Today we're talking about " +
        topic +
        '."\n\n[Main Content]\n' +
        tones[tone] +
        '\n\n[Closing]\nHost: "Thanks for watching! Don\'t forget to like and subscribe!"',
      joke: "", // Handled separately
      quote: "", // Handled separately
    };

    return contentTypes[type] || tones[tone];
  }

  function generateHashtags(topic) {
    const baseTags = topic
      .toLowerCase()
      .split(" ")
      .filter((word) => word.length > 3)
      .join("");
    const popularTags = {
      instagram: [
        "instagood",
        "photooftheday",
        "love",
        "fashion",
        "beautiful",
      ],
      youtube: ["youtube", "video", "vlog", "subscribe", "youtuber"],
      linkedin: [
        "networking",
        "career",
        "business",
        "leadership",
        "success",
      ],
      twitter: ["trending", "viral", "thread", "tweeting", "follow"],
      tiktok: ["viral", "fyp", "foryou", "trending", "tiktoker"],
      blog: ["blogger", "writing", "content", "read", "article"],
    };

    const tags = [
      "#" + baseTags,
      "#" + baseTags + "lover",
      "#" + baseTags + "life",
      ...popularTags[currentPlatform].slice(0, 5),
      "#digital",
      "#contentcreator",
    ];

    return tags.join(" ");
  }

  function generateTitle(type, topic, tone) {
    const tones = {
      professional: `Professional ${type} about ${topic}`,
      casual: `Awesome ${type} on ${topic}`,
      funny: `LOL: ${topic} Like Never Before`,
      inspirational: `The ${topic} That Will Change Your Life`,
      educational: `Learn ${topic} in 5 Minutes`,
    };

    return tones[tone] || `Great ${type} about ${topic}`;
  }

  function generateJoke(topic) {
    const jokes = [
      `Why did the ${topic} cross the road? To get to the other slide!`,
      `How many ${topic} experts does it take to change a lightbulb? None, they just wait for the dark mode toggle!`,
      `I told a joke about ${topic}... but it's too niche to be funny.`,
      `What do you call a ${topic} that tells jokes? A stand-up ${topic.split(" ")[0]
      }!`,
      `Why was the ${topic} bad at comedy? It couldn't deliver its punchline!`,
    ];

    return jokes[Math.floor(Math.random() * jokes.length)];
  }

  function generateQuote(topic, tone) {
    const quotes = {
      professional: `"In the realm of ${topic}, excellence is not an act but a habit." - ContentGenix AI`,
      casual: `"You know what they say about ${topic}... actually, I don't either, but it's probably important!"`,
      funny: `"${topic.charAt(0).toUpperCase() + topic.slice(1)
        }: because adulting is hard and we all need distractions."`,
      inspirational: `"Let your passion for ${topic} light the way to your dreams."`,
      educational: `"Understanding ${topic} is the first step toward mastering it."`,
    };

    return (
      quotes[tone] ||
      `"${topic.charAt(0).toUpperCase() + topic.slice(1)
      } matters more than you think."`
    );
  }

  function getPlatformSpecificTips(platform) {
    const tips = {
      instagram:
        "Tip: Use high-quality images and short, engaging captions for maximum impact on Instagram.",
      youtube:
        "Tip: Hook viewers in the first 10 seconds and use cards/end screens to boost watch time on YouTube.",
      linkedin:
        "Tip: Professional tone works best on LinkedIn. Use bullet points for readability.",
      twitter:
        "Tip: Keep it concise and use relevant hashtags. Threads perform well for longer content.",
      tiktok:
        "Tip: Jump right into the action and use trending sounds/music for better reach on TikTok.",
      blog: "Tip: Structure your content with headings, subheadings, and images for better readability.",
    };

    return tips[platform] || "";
  }

  function displayResults(platform, type, content) {
    let outputHTML = "";

    // Main content card
    if (content.main) {
      outputHTML += `
                        <div class="output-card">
                            <h3>Your ${type.charAt(0).toUpperCase() + type.slice(1)
        }</h3>
                            <p>${content.main.replace(/\n/g, "<br>")}</p>
                            <button class="copy-btn" data-content="${escapeHtml(
          content.main
        )}">
                                <i class="fas fa-copy"></i>
                            </button>
                            <button class="save-btn">
                                <i class="fas fa-bookmark"></i> Save
                            </button>
                        </div>
                    `;
    }

    // Additional cards based on content type
    if (type !== "hashtags" && content.hashtags) {
      outputHTML += `
                        <div class="output-card">
                            <h3>Hashtag Suggestions</h3>
                            <p>${content.hashtags}</p>
                            <button class="copy-btn" data-content="${escapeHtml(
        content.hashtags
      )}">
                                <i class="fas fa-copy"></i>
                            </button>
                        </div>
                    `;
    }

    if (type !== "title" && content.title) {
      outputHTML += `
                        <div class="output-card">
                            <h3>Title Ideas</h3>
                            <p>${content.title}</p>
                            <button class="copy-btn" data-content="${escapeHtml(
        content.title
      )}">
                                <i class="fas fa-copy"></i>
                            </button>
                        </div>
                    `;
    }

    if (type !== "joke" && content.joke) {
      outputHTML += `
                        <div class="output-card">
                            <h3>Related Joke</h3>
                            <p>${content.joke}</p>
                            <button class="copy-btn" data-content="${escapeHtml(
        content.joke
      )}">
                                <i class="fas fa-copy"></i>
                            </button>
                        </div>
                    `;
    }

    if (type !== "quote" && content.quote) {
      outputHTML += `
                        <div class="output-card">
                            <h3>Inspirational Quote</h3>
                            <p>${content.quote}</p>
                            <button class="copy-btn" data-content="${escapeHtml(
        content.quote
      )}">
                                <i class="fas fa-copy"></i>
                            </button>
                        </div>
                    `;
    }

    outputSection.innerHTML = outputHTML;

    // Add event listeners to new copy buttons
    document.querySelectorAll(".copy-btn").forEach((btn) => {
      btn.addEventListener("click", function () {
        const content = this.dataset.content;
        copyToClipboard(content);
        showToast("Content copied to clipboard!");
      });
    });

    // Add event listeners to save buttons
    document.querySelectorAll(".save-btn").forEach((btn) => {
      btn.addEventListener("click", function () {
        const card = this.closest(".output-card");
        const title = card.querySelector("h3").textContent;
        const content = card.querySelector("p").textContent;
        saveToHistory(platform, type, title, { main: content });
        showToast("Content saved to history!");
      });
    });
  }

  function escapeHtml(unsafe) {
    return unsafe
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function copyToClipboard(text) {
    navigator.clipboard.writeText(text);
  }

  function showToast(message, type = "success") {
    toast.textContent = message;
    toast.className = "toast show";
    if (type === "error") {
      toast.style.background = "var(--error)";
    } else if (type === "warning") {
      toast.style.background = "var(--warning)";
      toast.style.color = "var(--dark)";
    } else {
      toast.style.background = "var(--success)";
    }

    setTimeout(() => {
      toast.className = "toast";
    }, 3000);
  }

  function saveToHistory(platform, type, topic, content) {
    let history =
      JSON.parse(localStorage.getItem("contentGenixHistory")) || [];

    history.unshift({
      platform,
      type,
      topic,
      content,
      timestamp: new Date().toISOString(),
    });

    // Keep only the last 20 items
    if (history.length > 20) {
      history = history.slice(0, 20);
    }

    localStorage.setItem("contentGenixHistory", JSON.stringify(history));
    loadHistory();
  }

  function loadHistory() {
    const history =
      JSON.parse(localStorage.getItem("contentGenixHistory")) || [];
    historyItems.innerHTML = "";

    if (history.length === 0) {
      historyItems.innerHTML =
        "<p>No history yet. Generate some content to see it here.</p>";
      return;
    }

    history.forEach((item, index) => {
      const historyItem = document.createElement("div");
      historyItem.className = "history-item";
      historyItem.innerHTML = `
                        <h4>${item.topic}</h4>
                        <p>${item.platform.charAt(0).toUpperCase() +
        item.platform.slice(1)
        } ${item.type} • ${new Date(
          item.timestamp
        ).toLocaleString()}</p>
                    `;

      historyItem.addEventListener("click", () => {
        displayResults(item.platform, item.type, item.content);
        window.scrollTo({ top: 0, behavior: "smooth" });
      });

      historyItems.appendChild(historyItem);
    });
  }

  // Toggle history section
  toggleHistory.addEventListener("click", function () {
    const icon = this.querySelector("i");
    if (historySection.style.display === "none") {
      historySection.style.display = "block";
      icon.classList.remove("fa-chevron-down");
      icon.classList.add("fa-chevron-up");
      this.textContent = " Hide History";
    } else {
      historySection.style.display = "none";
      icon.classList.remove("fa-chevron-up");
      icon.classList.add("fa-chevron-down");
      this.textContent = " Show History";
    }
  });

  // Load history on page load
  loadHistory();

  // Show history section if there are items
  if (
    JSON.parse(localStorage.getItem("contentGenixHistory"))?.length > 0
  ) {
    historySection.style.display = "block";
  }
});
