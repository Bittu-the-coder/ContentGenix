
const GEMINI_API_KEY = "AIzaSyBFjIIxhkvWk35f3vOKCtO3IDklvOme3Q4";
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

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
    icon.classList.toggle("fa-moon");
    icon.classList.toggle("fa-sun");
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

    showLoadingState();

    try {
      const content = await generateWithGeminiAPI(currentPlatform, contentType, topic, prompt, tone);
      saveToHistory(currentPlatform, contentType, topic, content);
      displayResults(currentPlatform, contentType, content);
    } catch (error) {
      console.error("Error:", error);
      showToast("Failed to generate content", "error");
      displayFallbackContent(currentPlatform, contentType, topic, prompt, tone);
    }
  });

  function showLoadingState() {
    outputSection.innerHTML = `
      <div class="loading">
        <div class="loading-dot"></div>
        <div class="loading-dot"></div>
        <div class="loading-dot"></div>
      </div>`;
  }

  async function generateWithGeminiAPI(platform, type, topic, prompt, tone) {
    try {
      // Enhanced prompt to generate multiple items
      const systemPrompt = `
      You are ContentGenix, an AI assistant that creates social media content.
      
      Generate these items about "${topic}" (${tone} tone) for ${platform}:
      
      CAPTIONS (5 options, 1-2 sentences each):
      1. [First caption option]
      2. [Second caption option]
      ...
      
      TITLES (5 options, catchy and engaging):
      1. [First title option]
      2. [Second title option]
      ...
      
      JOKES (3 funny options):
      1. [First joke]
      2. [Second joke]
      ...
      
      QUOTES (3 inspirational options):
      1. "[First quote]" - ContentGenix
      2. "[Second quote]" - ContentGenix
      ...
      
      Return as JSON with these fields:
      {
        "captions": [array of 5 caption options],
        "titles": [array of 5 title options],
        "jokes": [array of 3 jokes],
        "quotes": [array of 3 quotes],
        "hashtags": "space separated relevant tags",
        "tips": "platform-specific advice"
      }
    `;

      const requestBody = {
        contents: [{ parts: [{ text: systemPrompt }] }],
        generationConfig: { temperature: 0.7, maxOutputTokens: 2048 }
      };

      const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody)
      });

      const data = await response.json();
      const textResponse = data.candidates?.[0]?.content?.parts?.[0]?.text;

      // Parse the JSON response
      return JSON.parse(textResponse.match(/{[\s\S]*?}/)[0]);

    } catch (error) {
      console.error("API Error:", error);
      throw error;
    }
  }

  function displayFallbackContent(platform, type, topic, prompt, tone) {
    const fallbackContent = {
      main: generateMainContent(platform, type, topic, prompt, tone),
      hashtags: generateHashtags(topic, platform),
      title: generateTitle(type, topic, tone),
      joke: generateJoke(topic),
      quote: generateQuote(topic, tone),
      tips: getPlatformTips(platform)
    };
    displayResults(platform, type, fallbackContent);
  }

  function generateMainContent(platform, type, topic, prompt, tone) {
    const tones = {
      professional: `This professional content about ${topic} provides valuable insights.`,
      casual: `Hey there! Here's some cool stuff about ${topic}.`,
      funny: `You won't believe this hilarious take on ${topic}!`,
      inspirational: `Let this inspire you about ${topic}!`,
      educational: `Here's what you need to know about ${topic}.`
    };

    return `${tones[tone]}\n\n${prompt || ""}`;
  }

  function generateHashtags(topic, platform) {
    const baseTags = topic.toLowerCase().split(' ').filter(w => w.length > 2);
    const platformTags = {
      instagram: ["instagood", "photooftheday"],
      youtube: ["youtube", "video"],
      linkedin: ["networking", "career"],
      twitter: ["trending", "twitter"],
      tiktok: ["fyp", "viral"],
      blog: ["blog", "writing"]
    };

    return [...baseTags, ...platformTags[platform]].slice(0, 10).join(' ');
  }

  function generateTitle(type, topic, tone) {
    const titles = {
      professional: `Professional ${type} about ${topic}`,
      casual: `Awesome ${topic} ${type}`,
      funny: `LOL: ${topic}`,
      inspirational: `Inspiring ${topic}`,
      educational: `Learn ${topic}`
    };
    return titles[tone] || `${topic} ${type}`;
  }

  function generateJoke(topic) {
    return `Why did the ${topic.split(' ')[0]} cross the road? To get to the other side!`;
  }

  function generateQuote(topic, tone) {
    return `"The best ${topic} starts with a single step." - ContentGenix`;
  }

  function getPlatformTips(platform) {
    const tips = {
      instagram: "Use high-quality images and short captions.",
      youtube: "Hook viewers in the first 10 seconds.",
      linkedin: "Keep it professional with actionable insights.",
      twitter: "Be concise and use relevant hashtags.",
      tiktok: "Jump right into the action.",
      blog: "Structure with headings and subheadings."
    };
    return tips[platform] || "";
  }

  function displayResults(platform, type, content) {
    let outputHTML = `
    <div class="output-section">
      <div class="output-group">
        <h2><i class="fas fa-heading"></i> Title Options</h2>
        <div class="options-grid">
          ${content.titles.map((title, i) => `
            <div class="option-card">
              <p>${title}</p>
              <button class="copy-btn" data-content="${escapeHtml(title)}">
                <i class="fas fa-copy"></i>
              </button>
            </div>
          `).join('')}
        </div>
      </div>

      <div class="output-group">
        <h2><i class="fas fa-comment-dots"></i> Caption Options</h2>
        <div class="options-grid">
          ${content.captions.map((caption, i) => `
            <div class="option-card">
              <p>${caption}</p>
              <button class="copy-btn" data-content="${escapeHtml(caption)}">
                <i class="fas fa-copy"></i>
              </button>
            </div>
          `).join('')}
        </div>
      </div>

      <div class="output-group">
        <h2><i class="fas fa-laugh-squint"></i> Joke Options</h2>
        <div class="options-grid">
          ${content.jokes.map((joke, i) => `
            <div class="option-card">
              <p>${joke}</p>
              <button class="copy-btn" data-content="${escapeHtml(joke)}">
                <i class="fas fa-copy"></i>
              </button>
            </div>
          `).join('')}
        </div>
      </div>

      <div class="output-group">
        <h2><i class="fas fa-quote-right"></i> Quote Options</h2>
        <div class="options-grid">
          ${content.quotes.map((quote, i) => `
            <div class="option-card">
              <p>${quote}</p>
              <button class="copy-btn" data-content="${escapeHtml(quote)}">
                <i class="fas fa-copy"></i>
              </button>
            </div>
          `).join('')}
        </div>
      </div>

      <div class="output-group">
        <h2><i class="fas fa-tags"></i> Hashtags</h2>
        <div class="hashtags-container">
          ${content.hashtags.split(' ').map(tag => `#${tag}`).join(' ')}
        </div>
      </div>

      ${content.tips ? `
        <div class="output-group tips">
          <h2><i class="fas fa-lightbulb"></i> Pro Tips</h2>
          <p>${content.tips}</p>
        </div>
      ` : ''}
    </div>
  `;

    outputSection.innerHTML = outputHTML;
    setupCopyButtons();
  }


  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  function escapeHtml(unsafe) {
    return unsafe
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function setupCopyButtons() {
    document.querySelectorAll(".copy-btn").forEach(btn => {
      btn.addEventListener("click", function () {
        const content = this.dataset.content;
        copyToClipboard(content);
        showToast("Copied to clipboard!");
      });
    });
  }

  function copyToClipboard(text) {
    navigator.clipboard.writeText(text).catch(err => {
      console.error("Copy failed:", err);
      showToast("Copy failed", "error");
    });
  }

  function showToast(message, type = "success") {
    toast.textContent = message;
    toast.className = "toast show";
    toast.style.background =
      type === "error" ? "var(--error)" :
        type === "warning" ? "var(--warning)" :
          "var(--success)";

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
      timestamp: new Date().toISOString()
    });

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
      historyItems.innerHTML = "<p>No history yet. Generate some content!</p>";
      return;
    }

    history.forEach(item => {
      const historyItem = document.createElement("div");
      historyItem.className = "history-item";
      historyItem.innerHTML = `
        <h4>${item.topic}</h4>
        <p>${capitalizeFirstLetter(item.platform)} ${item.type} • ${new Date(item.timestamp).toLocaleString()}</p>
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

  // Initialize
  loadHistory();
});