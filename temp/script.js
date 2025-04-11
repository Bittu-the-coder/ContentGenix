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
      outputSection.innerHTML = `
        <div class="output-card error">
          <h3>Error Generating Content</h3>
          <p>Sorry, we couldn't generate your content. Please try again later.</p>
        </div>
      `;
    }
  });

  // Generate content based on inputs
  async function generateContent(platform, type, topic, prompt, tone) {
    try {
      // Create a system prompt based on user inputs
      const requestBody = createSystemPrompt(platform, type, topic, prompt, tone);

      // For demonstration purposes, we'll simulate an API call with mock data
      // In production, replace this with your actual API call
      let response = await generateWithGeminiAPI(platform, type, topic, prompt, tone);


      try {
        // Simulate API call
        response = await simulateAIResponse(platform, type, topic, prompt, tone);
      } catch (error) {
        console.error("API error:", error);
        throw new Error("API communication error");
      }

      // If response is valid JSON
      let content = response;

      // Save to history
      saveToHistory(platform, type, topic, content);

      // Display results
      displayResults(platform, type, content);

    } catch (error) {
      console.error("Error generating content:", error);
      throw error;
    }
  }

  // Simulate AI API response (in production, replace with actual API call)
  async function simulateAIResponse(platform, type, topic, prompt, tone) {
    // Return a Promise that resolves after a short delay to simulate network request
    return new Promise((resolve) => {
      setTimeout(() => {
        // Generate mock content based on inputs
        const mainContent = generateMainContent(platform, type, topic, prompt, tone);
        const hashtags = generateHashtags(topic, platform);
        const title = generateTitle(type, topic, tone);
        const joke = generateJoke(topic);
        const quote = generateQuote(topic, tone);

        // Return formatted JSON response
        resolve({
          main: mainContent,
          hashtags: hashtags,
          title: title,
          joke: joke,
          quote: quote
        });
      }, 1500); // Simulate 1.5s API delay
    });
  }

  function createSystemPrompt(platform, type, topic, prompt, tone) {
    // Detailed system prompt for the AI
    return {
      platform: platform,
      contentType: type,
      topic: topic,
      additionalDetails: prompt,
      tone: tone
    };
  }

  function generateMainContent(platform, type, topic, prompt, tone) {
    // Platform-specific content generation
    const platformContent = {
      instagram: `✨ Check out this amazing ${topic}! ${tone === 'professional' ? 'Our research indicates' : 'I\'ve discovered'} that ${topic} can transform your daily routine.\n\n${prompt ? prompt + "\n\n" : ""}${tone === 'funny' ? '😂 Who else has struggled with this?' : tone === 'inspirational' ? '🌟 Your journey starts now!' : tone === 'educational' ? '📚 Let\'s learn together:' : '👀 Double tap if you agree!'}`,

      youtube: `TITLE: ${topic.toUpperCase()} - Everything You Need To Know\n\nINTRO:\nHey everyone! Welcome back to the channel. Today we're diving deep into ${topic}.\n\nMAIN CONTENT:\n${prompt ? prompt + "\n" : ""}${tone === 'educational' ? `First, let's understand what ${topic} really means...\nSecond, we'll explore how it affects your daily life...\nFinally, I'll share some practical tips you can use today.` : `Let's talk about why ${topic} matters to you and how it can change everything.`}\n\nCLOSING:\nIf you found this valuable, smash that like button and subscribe for more content like this!`,

      linkedin: `# The Impact of ${topic} in Today's Professional Landscape\n\n${tone === 'professional' ? `I've been researching ${topic} extensively, and the data shows fascinating trends.` : `I wanted to share some thoughts on ${topic} that might benefit my network.`}\n\n${prompt ? prompt + "\n\n" : ""}${tone === 'educational' ? `Three key takeaways:\n1. Understanding the fundamentals of ${topic}\n2. How industry leaders are leveraging ${topic}\n3. Future predictions for ${topic} development` : `What are your experiences with ${topic}? I'd love to hear your thoughts in the comments.`}\n\n#${topic.replace(/\s+/g, '')} #Professional #Growth`,

      twitter: `${topic} is changing everything we thought we knew. ${tone === 'funny' ? '😂' : tone === 'inspirational' ? '✨' : '🧵'}\n\n${prompt ? prompt + "\n\n" : ""}${tone === 'professional' ? `The data suggests that ${topic} will continue to evolve. Here's why it matters:` : `I can't believe more people aren't talking about this!`}\n\nWhat's your take?`,

      tiktok: `@contentgenix ##${topic.replace(/\s+/g, '')}\n\nDid you know about ${topic}? ${tone === 'funny' ? 'I was today years old when I found out! 😱' : tone === 'educational' ? 'Let me explain in 60 seconds:' : 'You NEED to know this!'}\n\n${prompt ? prompt + "\n\n" : ""}${tone === 'inspirational' ? 'Don\'t let anyone tell you it\'s impossible!' : 'Tag someone who needs to see this! 👇'}`,

      blog: `# ${topic}: A Comprehensive Guide\n\n## Introduction\n${tone === 'professional' ? `In the realm of ${topic}, professionals are constantly seeking new insights and methodologies.` : `Today, we're exploring everything you need to know about ${topic}.`}\n\n${prompt ? `## Background\n${prompt}\n\n` : ""}## Main Points\n1. The evolution of ${topic}\n2. Current trends in ${topic}\n3. How to implement ${topic} in your strategy\n4. Future projections\n\n## Conclusion\n${tone === 'inspirational' ? `The journey of mastering ${topic} begins with a single step. Start today!` : `Continue to explore ${topic} and its applications to stay ahead of the curve.`}`
    };

    return platformContent[platform] || `Content about ${topic}`;
  }

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

  function displayResults(platform, type, content) {
    // Format the results into cards
    let outputHTML = "";

    // Main content card
    if (content.main) {
      outputHTML += `
        <div class="output-card">
          <div class="card-header">
            <h3>${content.title || `Your ${type.charAt(0).toUpperCase() + type.slice(1)}`}</h3>
            <div class="card-actions">
              <button class="copy-btn" data-content="${escapeHtml(content.main)}">
                <i class="fas fa-copy"></i>
              </button>
              <button class="save-btn">
                <i class="fas fa-bookmark"></i>
              </button>
            </div>
          </div>
          <div class="card-content">
            <p>${content.main.replace(/\n/g, "<br>")}</p>
          </div>
          <div class="card-platform">
            <i class="fab fa-${getPlatformIcon(platform)}"></i> ${platform.charAt(0).toUpperCase() + platform.slice(1)}
          </div>
        </div>
      `;
    }

    // Hashtags card
    if (content.hashtags && type !== "hashtags") {
      outputHTML += `
        <div class="output-card hashtags-card">
          <div class="card-header">
            <h3>Hashtags</h3>
            <div class="card-actions">
              <button class="copy-btn" data-content="${escapeHtml(content.hashtags)}">
                <i class="fas fa-copy"></i>
              </button>
            </div>
          </div>
          <div class="card-content hashtags">
            ${content.hashtags.split(' ').map(tag => `<span class="hashtag">#${tag}</span>`).join(' ')}
          </div>
        </div>
      `;
    }

    // Additional elements
    if (type !== "joke" && content.joke) {
      outputHTML += `
        <div class="output-card joke-card">
          <div class="card-header">
            <h3>Related Joke</h3>
            <div class="card-actions">
              <button class="copy-btn" data-content="${escapeHtml(content.joke)}">
                <i class="fas fa-copy"></i>
              </button>
            </div>
          </div>
          <div class="card-content">
            <p><i class="fas fa-laugh-squint"></i> ${content.joke}</p>
          </div>
        </div>
      `;
    }

    if (type !== "quote" && content.quote) {
      outputHTML += `
        <div class="output-card quote-card">
          <div class="card-header">
            <h3>Inspirational Quote</h3>
            <div class="card-actions">
              <button class="copy-btn" data-content="${escapeHtml(content.quote)}">
                <i class="fas fa-copy"></i>
              </button>
            </div>
          </div>
          <div class="card-content">
            <blockquote>
              ${content.quote}
            </blockquote>
          </div>
        </div>
      `;
    }

    outputSection.innerHTML = outputHTML;

    // Add event listeners to new buttons
    addCopyButtonListeners();
    addSaveButtonListeners();
  }

  function getPlatformIcon(platform) {
    const icons = {
      instagram: "instagram",
      youtube: "youtube",
      linkedin: "linkedin",
      twitter: "twitter",
      tiktok: "tiktok",
      blog: "wordpress"
    };

    return icons[platform] || "globe";
  }

  function addCopyButtonListeners() {
    document.querySelectorAll(".copy-btn").forEach((btn) => {
      btn.addEventListener("click", function () {
        const content = this.dataset.content;
        copyToClipboard(content);
        showToast("Content copied to clipboard!");
      });
    });
  }

  function addSaveButtonListeners() {
    document.querySelectorAll(".save-btn").forEach((btn) => {
      btn.addEventListener("click", function () {
        const card = this.closest(".output-card");
        const title = card.querySelector("h3").textContent;
        const content = card.querySelector(".card-content p").innerHTML.replace(/<br>/g, "\n");

        // Add to favorites or perform another save action
        showToast(`"${title}" saved successfully!`);
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
    navigator.clipboard.writeText(text).then(
      function () {
        // Success
      },
      function () {
        showToast("Failed to copy. Please try again.", "error");
      }
    );
  }

  function showToast(message, type = "success") {
    toast.textContent = message;
    toast.className = `toast show ${type}`;

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
    let history = JSON.parse(localStorage.getItem("contentGenixHistory")) || [];

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
    const history = JSON.parse(localStorage.getItem("contentGenixHistory")) || [];
    historyItems.innerHTML = "";

    if (history.length === 0) {
      historyItems.innerHTML = "<p class='no-history'>No history yet. Generate some content to see it here.</p>";
      return;
    }

    history.forEach((item) => {
      const historyItem = document.createElement("div");
      historyItem.className = "history-item";
      historyItem.innerHTML = `
        <div class="history-icon">
          <i class="fab fa-${getPlatformIcon(item.platform)}"></i>
        </div>
        <div class="history-details">
          <h4>${item.topic}</h4>
          <p>${item.platform.charAt(0).toUpperCase() + item.platform.slice(1)} ${item.type} • ${formatDate(item.timestamp)}</p>
        </div>
      `;

      historyItem.addEventListener("click", () => {
        displayResults(item.platform, item.type, item.content);
        window.scrollTo({ top: outputSection.offsetTop - 20, behavior: "smooth" });
      });

      historyItems.appendChild(historyItem);
    });
  }

  function formatDate(timestamp) {
    const date = new Date(timestamp);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return "Today";
    } else if (diffDays === 1) {
      return "Yesterday";
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else {
      return date.toLocaleDateString();
    }
  }

  // Toggle history section
  toggleHistory.addEventListener("click", function () {
    historySection.classList.toggle("collapsed");
    const icon = this.querySelector("i");

    if (historySection.classList.contains("collapsed")) {
      icon.classList.remove("fa-chevron-up");
      icon.classList.add("fa-chevron-down");
      this.querySelector("span").textContent = "Show History";
    } else {
      icon.classList.remove("fa-chevron-down");
      icon.classList.add("fa-chevron-up");
      this.querySelector("span").textContent = "Hide History";
    }
  });

  // Load history on page load
  loadHistory();
});