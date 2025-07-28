import { useState } from "react";
import { Button } from "../components/ui/button";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";

export default function Home() {
  const [text, setText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!text.trim()) return;

    setIsLoading(true);
    setAudioUrl(null);

    try {
      const apiUrl = import.meta.env.VITE_API_URL;
      const response = await fetch(`${apiUrl}/tts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate speech");
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      console.log(url);
      setAudioUrl(url);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-lg border border-slate-200 p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            Text to Speech
          </h1>
          <p className="text-slate-600">
            Convert your text to natural-sounding speech using AI
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-3">
            <Label
              htmlFor="text-input"
              className="text-sm font-medium text-slate-700"
            >
              Enter your text
            </Label>
            <Textarea
              id="text-input"
              placeholder="Type the text you want to convert to speech..."
              value={text}
              onChange={handleTextChange}
              className="min-h-[120px] resize-none"
              disabled={isLoading}
            />
          </div>

          <Button
            type="submit"
            disabled={!text.trim() || isLoading}
            className="w-full h-12 text-base font-medium"
          >
            {isLoading ? "Generating..." : "Convert to Speech"}
          </Button>
        </form>

        {audioUrl && (
          <div className="mt-8 p-4 bg-slate-50 rounded-lg border border-slate-200">
            <Label className="text-sm font-medium text-slate-700 mb-3 block">
              Generated Speech
            </Label>
            {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
            <audio controls className="w-full">
              <source src={audioUrl} type="audio/mpeg" />
              <track kind="captions" srcLang="en" label="English" />
              Your browser does not support the audio element.
            </audio>
          </div>
        )}
      </div>
    </div>
  );
}
