import { useEffect, useRef, useState } from "react";
import { Button } from "../components/ui/button";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { cn } from "../lib/utils";

export default function Home() {
  const [text, setText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showAudioPlayer, setShowAudioPlayer] = useState(false);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!text.trim()) return;

    setIsLoading(true);
    setAudioUrl(null);

    try {
      const apiUrl =
        import.meta.env.VITE_API_URL || "https://voice.omin.dev/api";
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

  const handleReset = () => {
    setText("");
  };

  const handlePaste = async () => {
    const clipboardText = await navigator.clipboard.readText();
    setText(clipboardText);
  };

  const handlePlayPause = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    setIsPlaying(false);
    const audio = audioRef.current;
    if (!audio) return;
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleEnded = () => setIsPlaying(false);
    audio.addEventListener("play", handlePlay);
    audio.addEventListener("pause", handlePause);
    audio.addEventListener("ended", handleEnded);
    return () => {
      audio.removeEventListener("play", handlePlay);
      audio.removeEventListener("pause", handlePause);
      audio.removeEventListener("ended", handleEnded);
    };
  }, [audioUrl]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-lg border border-slate-200 p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            Text to Speech
          </h1>
        </div>

        {audioUrl && (
          <div
            className={cn(
              "mb-4 flex flex-col justify-center items-center",
              !showAudioPlayer && "hidden",
            )}
          >
            <>
              {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
              <audio ref={audioRef} controls className="w-full">
                <source src={audioUrl} type="audio/mpeg" />
                <track kind="captions" srcLang="en" label="English" />
                Your browser does not support the audio element.
              </audio>
            </>
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="space-y-3 mb-3">
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

          <div className="mt-2">
            {text === "" ? (
              <Button
                type="button"
                onClick={handlePaste}
                disabled={isLoading}
                className="w-full h-12 text-base font-medium"
              >
                Paste
              </Button>
            ) : (
              <Button
                type="button"
                onClick={handleReset}
                disabled={isLoading}
                className="w-full h-12 text-base font-medium"
                variant="outline"
              >
                Reset
              </Button>
            )}
          </div>
          <div className="flex gap-4 mt-2">
            <Button
              type="submit"
              disabled={!text.trim() || isLoading}
              className={
                audioUrl
                  ? "w-1/2 h-12 text-base font-medium"
                  : "w-full h-12 text-base font-medium"
              }
            >
              Convert
            </Button>
            {audioUrl && (
              <Button
                type="button"
                onClick={handlePlayPause}
                className="w-1/2 h-12 text-base font-medium bg-orange-500 hover:bg-orange-600 text-white flex items-center justify-center"
                style={{ backgroundColor: "#f97316" }}
              >
                {isPlaying ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 32 32"
                    strokeWidth="3"
                    stroke="currentColor"
                    className="w-9 h-9"
                  >
                    <title>Pause</title>
                    <rect x="8" y="6" width="5" height="20" rx="1.5" />
                    <rect x="19" y="6" width="5" height="20" rx="1.5" />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 32 32"
                    strokeWidth="3"
                    stroke="currentColor"
                    className="w-9 h-9"
                  >
                    <title>Play</title>
                    <polygon points="10,6 26,16 10,26" fill="currentColor" />
                  </svg>
                )}
              </Button>
            )}
          </div>
          {audioUrl && (
            <div className="flex justify-center mt-2">
              <button
                type="button"
                onClick={() => setShowAudioPlayer(!showAudioPlayer)}
                className="text-xs underline text-slate-400 hover:text-slate-600"
                style={{ textUnderlineOffset: 2 }}
              >
                {showAudioPlayer ? "Hide audio player" : "Show audio player"}
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
