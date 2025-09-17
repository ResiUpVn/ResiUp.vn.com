# ResiUp

**ResiUp** is a comprehensive web application designed to support young people in embracing their unique identities and fostering mental well-being. It offers a suite of tools based on psychological principles, including daily challenges, mindfulness exercises, a private journaling space, a community forum, and an AI-powered chatbot named Resi.

## ✨ Features

*   **User Dashboard:** At-a-glance view of your progress, including completed challenges and journal entry frequency.
*   **Daily Challenges:** Small, manageable daily tasks to build positive habits and self-esteem.
*   **Mindful Breathing:** An animated guide for calming breathing exercises to reduce stress.
*   **Nature Sounds & Resources:** A curated library of relaxing nature videos and helpful wellness content.
*   **Private Journal:** A secure space to reflect on your thoughts and feelings.
*   **AI Chatbot (Resi):** A supportive AI assistant powered by the Gemini API, providing a safe space for conversation. Resi's knowledge can be customized by administrators.
*   **Community Forum:** Connect with others, share experiences, and find support in a moderated environment.
*   **Comprehensive Admin Panel:**
    *   User Management (View/Delete Users)
    *   Forum Moderation (Delete Posts/Comments)
    *   Content Management (Add/Remove Resources & Nature Sounds)
    *   Chatbot Knowledge Base (Customize Resi's expertise)
    *   Chat Log Viewer (Review user-bot interactions for insights)

## 🚀 Getting Started

This project is designed to be run in a web-based development environment like **Google's AI Studio**, which handles dependency management and environment variables.

### Prerequisites

*   An environment that provides the `@google/genai` SDK and other dependencies.
*   A Google AI API key provided as an environment variable named `API_KEY`.

The application's `index.html` uses an `importmap` to manage dependencies, so no local `npm install` is required if running in a compatible environment.

## 🛠️ Tech Stack

*   **Frontend:** [React](https://reactjs.org/) with [TypeScript](https://www.typescriptlang.org/)
*   **Styling:** [Tailwind CSS](https://tailwindcss.com/)
*   **Routing:** [React Router](https://reactrouter.com/)
*   **AI:** [Google Gemini API](https://ai.google.dev/) (`gemini-2.5-flash`)
*   **Data Persistence:** Browser Local Storage (for simulation purposes)
*   **Charts:** [Recharts](https://recharts.org/)
