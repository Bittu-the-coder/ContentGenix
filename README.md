# ContentGenix - AI Content Generator

![ContentGenix Logo](https://img.shields.io/badge/ContentGenix-AI%20Content%20Generator-4361ee?style=for-the-badge&logo=robot)

ContentGenix is a powerful AI-driven web application that helps content creators generate engaging social media content across multiple platforms. Using Google's Gemini AI, it creates tailored captions, titles, hashtags, jokes, and quotes optimized for different social media platforms.

## ✨ Features

- **Multi-Platform Support**: Generate content for Instagram, YouTube, LinkedIn, Twitter, and Blogs
- **Multiple Content Types**: Create captions, titles, hashtags, video scripts, jokes, and quotes
- **AI-Powered Generation**: Utilizes Google Gemini AI for intelligent content creation
- **Tone Customization**: Choose from professional, casual, funny, inspirational, or educational tones
- **Content History**: Save and revisit previously generated content
- **Dark/Light Theme**: Toggle between light and dark modes for comfortable viewing
- **Copy to Clipboard**: Easy one-click copying of generated content
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## 🚀 Live Demo

Open `index.html` in your browser to start generating content immediately!

## 🛠️ Installation & Setup

### Prerequisites

- A modern web browser (Chrome, Firefox, Safari, Edge)
- Internet connection for AI API calls
- Google Gemini API key (optional - fallback content available)

### Quick Start

1. **Clone or Download** the repository:

   ```bash
   git clone https://github.com/your-username/ContentGenix.git
   cd ContentGenix
   ```

2. **Open the application**:

   - Simply open `index.html` in your web browser
   - No additional installation required!

3. **Configure API Key** (Optional):
   - Open `script.js`
   - Replace the API key with your own Gemini API key:
   ```javascript
   const GEMINI_API_KEY = "your-api-key-here";
   ```

### Getting a Gemini API Key

1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Create a new API key
4. Copy and paste it into the `script.js` file

## 📱 Usage

### Basic Usage

1. **Select Platform**: Choose your target social media platform (Instagram, YouTube, LinkedIn, Twitter, or Blog)
2. **Choose Content Type**: Select what type of content you want to generate
3. **Set Tone**: Pick the tone that matches your brand voice
4. **Enter Topic**: Provide the main topic or theme for your content
5. **Add Details** (Optional): Include specific requirements or keywords
6. **Generate**: Click the "Generate Content" button
7. **Copy & Use**: Copy your favorite generated options to clipboard

### Content Types Available

- **Post**: Complete social media posts
- **Caption**: Short, engaging captions
- **Hashtags**: Relevant hashtag suggestions
- **Title**: Catchy titles for posts or videos
- **Video Script**: Scripts for video content
- **Joke**: Humorous content related to your topic
- **Quote**: Inspirational quotes

### Platform-Specific Features

Each platform has optimized content generation:

- **Instagram**: Focus on visual storytelling and hashtags
- **YouTube**: Emphasis on engaging hooks and titles
- **LinkedIn**: Professional tone and industry insights
- **Twitter**: Concise, punchy content under character limits
- **Blog**: Longer-form content with structured formatting

## 🏗️ Project Structure

```
ContentGenix/
├── index.html          # Main HTML file
├── script.js           # JavaScript functionality
├── styles.css          # CSS styling
├── README.md           # Project documentation
└── testing/            # Development and testing files
    ├── temp/           # Temporary files
    └── test/           # Test versions
```

## 🎨 Customization

### Themes

The application supports both light and dark themes. Users can toggle between themes using the theme button in the header.

### Styling

Modify `styles.css` to customize:

- Color schemes
- Typography
- Layout spacing
- Responsive breakpoints

### Content Types

Add new content types by:

1. Adding options to the content type dropdown in `index.html`
2. Updating the generation logic in `script.js`
3. Styling new content cards in `styles.css`

## 🔧 Technical Details

### Technologies Used

- **HTML5**: Semantic markup and structure
- **CSS3**: Modern styling with CSS Grid and Flexbox
- **Vanilla JavaScript**: Core functionality without dependencies
- **Google Gemini AI**: AI content generation
- **Font Awesome**: Icon library
- **Local Storage**: Content history persistence

### Browser Compatibility

- ✅ Chrome 80+
- ✅ Firefox 75+
- ✅ Safari 13+
- ✅ Edge 80+

### API Integration

The application uses Google's Gemini AI API with fallback content generation for offline use or API failures.

## 📊 Features in Detail

### Content History

- Automatically saves last 20 generated content pieces
- Stored locally in browser storage
- Click any history item to regenerate content
- Toggle visibility to save screen space

### Responsive Design

- Mobile-first approach
- Adaptive layout for tablets and desktops
- Touch-friendly interface elements
- Optimized for various screen sizes

## 🚧 Future Enhancements

- [ ] Export content to PDF/Word
- [ ] Social media scheduling integration
- [ ] Team collaboration features
- [ ] Analytics and performance tracking
- [ ] Custom prompt templates
- [ ] Multi-language support
- [ ] Integration with more AI models

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

### Development Setup

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Test thoroughly across different browsers
5. Commit your changes (`git commit -m 'Add some amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Google Gemini AI** for providing the AI content generation capabilities
- **Font Awesome** for the beautiful icons
- **The open-source community** for inspiration and resources

## 📞 Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/your-username/ContentGenix/issues) section
2. Create a new issue with detailed description
3. Join our community discussions

## ⭐ Show Your Support

If this project helped you, please consider giving it a ⭐ star on GitHub!

---

**Made with ❤️ for content creators worldwide**

## 📈 Version History

- **v1.0.0** - Initial release with core functionality
- Multi-platform content generation
- AI integration with Gemini
- Responsive design
- Content history feature

---

_Last updated: July 2025_
