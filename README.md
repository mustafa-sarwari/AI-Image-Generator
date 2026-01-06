# 🎨 AI Image Generator

A powerful web application that generates stunning AI images using the free Hugging Face API. Transform your imagination into visual art with just a few clicks!

![AI Image Generator Light Mode](https://github.com/user-attachments/assets/dd7c5526-4be6-4c00-bff0-3e4603738793)

## ✨ Features

- **AI-Powered Image Generation** - Create unique images from text descriptions using state-of-the-art AI models
- **Multiple AI Models** - Choose from different Stable Diffusion models:
  - Stable Diffusion XL
  - Runwayml Stable Diffusion v1.5
- **Customizable Output** - Select the number of images (1-4) and aspect ratio (1:1, 16:9, 9:16)
- **Random Prompt Generator** - Get creative inspiration with random example prompts
- **Download Option** - Save your generated images with one click
- **Dark/Light Theme** - Toggle between themes based on your preference
- **Responsive Design** - Works seamlessly on desktop and mobile devices

## 🖼️ Screenshots

### Light Mode
![Light Mode](https://github.com/user-attachments/assets/dd7c5526-4be6-4c00-bff0-3e4603738793)

### Dark Mode
![Dark Mode](https://github.com/user-attachments/assets/c57f6dc6-3dfe-4fbc-ac24-b4fd4ec190ac)

## 🚀 Live Demo

> **Note:** To run the live demo, you need to set up your own Hugging Face API key.

## 🛠️ Technologies Used

- **Frontend:** HTML5, CSS3, JavaScript (ES6+)
- **Backend:** Node.js, Express.js
- **API:** Hugging Face Inference API
- **Styling:** Custom CSS with CSS Variables, Font Awesome icons

## 📋 Prerequisites

- [Node.js](https://nodejs.org/) (v14 or higher)
- [npm](https://www.npmjs.com/) (comes with Node.js)
- [Hugging Face API Key](https://huggingface.co/settings/tokens) (free)

## ⚙️ Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/mustafa-sarwari/AI-Image-Generator.git
   cd AI-Image-Generator
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   # Copy the example environment file
   cp config/.env.example config/.env
   
   # Edit config/.env and add your Hugging Face API key
   # api_KEY=your_huggingface_api_key_here
   ```

4. **Start the server**
   ```bash
   npm start
   ```

5. **Open your browser**
   
   Navigate to `http://localhost:3000`

## 🔧 Configuration

Create a `config/.env` file with the following content:

```env
api_KEY=your_huggingface_api_key_here
```

To get your API key:
1. Create a free account at [Hugging Face](https://huggingface.co/)
2. Go to [Settings > Access Tokens](https://huggingface.co/settings/tokens)
3. Create a new token with read permissions
4. Copy the token to your `.env` file

## 📁 Project Structure

```
AI-Image-Generator/
├── config/
│   ├── .env              # Environment variables (not tracked)
│   └── .env.example      # Example environment file
├── img/
│   └── test.png          # Sample image
├── public/
│   ├── index.html        # Main HTML file
│   ├── script.js         # Frontend JavaScript
│   └── style.css         # Stylesheet
├── server.js             # Express server
├── package.json          # Project dependencies
└── README.md             # This file
```

## 🎯 Usage

1. **Enter a Prompt** - Describe the image you want to generate in detail
2. **Select a Model** - Choose your preferred AI model
3. **Set Image Count** - Choose how many images to generate (1-4)
4. **Pick Aspect Ratio** - Select the image dimensions
5. **Generate** - Click the Generate button and wait for the magic!
6. **Download** - Hover over any generated image to download it

### 💡 Tips for Better Results

- Be specific and detailed in your prompts
- Include style descriptors (e.g., "digital art", "oil painting", "photorealistic")
- Mention lighting, colors, and mood
- Use the random prompt button for inspiration

## 🤝 Contributing

Contributions are welcome! Feel free to:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License.

## 🙏 Acknowledgments

- [Hugging Face](https://huggingface.co/) for providing the free AI inference API
- [Font Awesome](https://fontawesome.com/) for the icons
- [Google Fonts](https://fonts.google.com/) for the Inter font family

---

<p align="center">
  Made with ❤️ by <a href="https://github.com/mustafa-sarwari">Mustafa Sarwari</a>
</p>
