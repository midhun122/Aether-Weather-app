# Aether 🌤️🤖

Aether is a modern AI-powered weather application built using HTML, CSS, and JavaScript. It combines real-time weather data, dynamic weather-reactive visuals, and AI-generated weather insights to create a more immersive and intelligent weather experience.

Unlike traditional weather apps that only display raw data, Aether interprets weather conditions and provides practical recommendations such as clothing suggestions, outdoor activity guidance, and weather-based insights.

> 🚧 **Under Active Development**
>
> Aether is continuously evolving with new features, UI enhancements, AI improvements, and performance optimizations being added regularly.

---

## Features

### 🌦️ Weather Features

* Real-time weather information
* City-based weather search
* Current location weather using geolocation
* Dynamic weather-reactive backgrounds
* Animated weather particle effects
* Temperature unit switching (°C / °F)
* UV Index information
* Wind speed and direction
* Humidity monitoring
* Atmospheric pressure
* Visibility tracking
* Cloud coverage analysis
* Responsive design for desktop and mobile devices

### 🤖 AI Features

* AI-powered weather summaries
* Smart weather insights
* Practical weather recommendations
* "Do I need an umbrella?" guidance
* "What should I wear?" suggestions
* "Good for running?" activity recommendations
* Gemini AI integration
* Secure API architecture using Cloudflare Workers

### 🎨 User Experience

* Modern glassmorphism-inspired interface
* Dynamic weather themes
* Smooth animations and transitions
* Mobile-first responsive layout
* Weather-specific visual effects
* Clean and intuitive user interface

---

## Tech Stack

### Frontend

* HTML5
* CSS3
* Vanilla JavaScript

### APIs & Services

* OpenWeatherMap API
* Google Gemini AI API
* Cloudflare Workers

### Deployment

* GitHub Pages
* Cloudflare Workers

---

## Architecture

```text
User
 │
 ▼
Aether Frontend
 │
 ├── OpenWeatherMap API
 │
 ▼
Cloudflare Worker
 │
 ▼
Google Gemini AI
```

Aether uses a Cloudflare Worker as a secure backend proxy to protect AI API keys from being exposed in the frontend source code.

---

## Getting Started

### Clone the Repository

```bash
git clone https://github.com/midhun122/Aether-Weather-app.git
```

### Open the Project

Navigate into the project folder and open it in your preferred code editor.

### Add Your OpenWeatherMap API Key

Locate:

```javascript
const OWM_KEY = 'YOUR_OWM_KEY_HERE';
```

Replace it with:

```javascript
const OWM_KEY = 'YOUR_API_KEY';
```

### Configure AI Features

Create a Cloudflare Worker and add your Gemini API key as a secret:

```bash
GEMINI_API_KEY
```

Update the Worker URL inside `script.js`:

```javascript
https://your-worker-name.workers.dev
```

### Run the Project

Open `index.html` in your browser.

No build tools or additional dependencies are required.

---

## Project Structure

```text
Aether-Weather-app/
│
├── index.html
├── style.css
├── script.js
├── assets/
│   ├── images/
│   └── icons/
│
└── README.md
```

---

## Current Development Focus

Planned improvements include:

* Full AI weather chat assistant
* 5-day forecast enhancements
* Weather alerts and warnings
* Progressive Web App (PWA) support
* Better AI recommendations
* Accessibility improvements
* Advanced weather visualizations
* Performance optimization
* Voice-based weather assistant

---

## Why This Project?

Most weather applications focus on presenting data. Aether aims to transform weather information into an interactive and intelligent experience through AI-powered recommendations, dynamic visuals, and weather-reactive design.

This project was built to strengthen my frontend development skills, explore API integration, experiment with AI-powered interfaces, and learn how to securely deploy applications using modern cloud services.

---

## Live Demo

🌐 https://midhun122.github.io/Aether-Weather-app/

---

## Contributing

Suggestions, feedback, and improvements are always welcome.

If you find a bug or have an idea for a feature, feel free to open an issue or submit a pull request.

---

## Author

Made with ❤️ by **Midhun Sujith Nair**

Web Developer • AI Enthusiast
