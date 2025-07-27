# Text-to-Speech App

A modern fullstack application that converts text to speech using OpenAI's TTS API. Built with Fastify, React Router, and Tailwind CSS.

## Features

- 🎯 **Simple Interface**: Clean textarea input with submit button
- 🎤 **High-Quality Speech**: Powered by OpenAI's TTS-1 model
- 🎨 **Modern UI**: Beautiful interface built with shadcn/ui and Tailwind CSS
- ⚡ **Fast & Efficient**: Fastify backend with React Router frontend
- 🔄 **Real-time Processing**: Instant audio generation and playback

## Tech Stack

- **Backend**: Fastify, OpenAI API
- **Frontend**: React Router v7, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui components
- **Build**: Vite, esbuild

## Prerequisites

- Node.js 18+
- Yarn
- OpenAI API key

## Setup

1. **Clone and install dependencies**:
   ```bash
   cd app
   yarn install
   ```

2. **Environment setup**:
   ```bash
   cp .env.example .env
   ```
   
   Add your OpenAI API key to `.env`:
   ```
   NODE_ENV=development
   OPENAI_API_KEY=your_actual_openai_api_key_here
   ```

3. **Development**:
   ```bash
   yarn dev
   ```

4. **Production build**:
   ```bash
   yarn build
   yarn start
   ```

## Usage

1. Open the app in your browser
2. Enter text in the textarea
3. Click "Convert to Speech"
4. Listen to the generated audio

## API Endpoints

- `POST /api/tts` - Convert text to speech
  - Body: `{ "text": "Your text here" }`
  - Returns: MP3 audio file

## Project Structure

```
app/
├── src/
│   ├── plugins/          # Fastify plugins
│   │   ├── api.tts.ts   # TTS API endpoint
│   │   ├── app.env.ts   # Environment config
│   │   └── ...
│   └── web/             # Frontend code
│       ├── components/  # shadcn/ui components
│       ├── routes/      # React Router routes
│       └── styles/      # CSS styles
├── package.json
└── tailwind.config.js
```

## License

MIT 