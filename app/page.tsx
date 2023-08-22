"use client";

import { useState } from "react";

import { Textarea } from "@/components/ui/textarea";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import ReactMarkdown from "react-markdown";
import { Label } from "@/components/ui/label";

const Home = () => {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [sources, setSources] = useState<{ link: string; title: string }[]>([]);

  const handleSubmit = async () => {
    setLoading(true);
    setAnswer("");
    try {
      const response = await fetch("/api/ask-question", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ question }),
      });

      if (response.ok) {
        setLoading(false);
        const data = await response.json();
        setAnswer(data.answer);
        setSources(data.sources);
      } else {
        setLoading(false);
        console.error("Error fetching answer:", response.statusText);
      }
    } catch (error) {
      setLoading(false);
      console.error("Error fetching answer:", error);
    }
  };

  return (
    <div className="w-full flex flex-col sm:flex-row flex-grow overflow-hidden min-h-screen">
      <aside className="sm:w-1/3 md:1/4 w-full flex-shrink flex-grow-0 p-4 bg-slate-900 ">
        <div className="sticky top-0 p-4 w-full">
          <h1 className="text-3xl font-bold mb-8 text-center text-white">
            Ampuverse 🦿
          </h1>
          <div className="grid w-full gap-1.5">
            <Label htmlFor="message" className="font-bold mb-2 text-white">
              What would you like to know as an amputee?
            </Label>
            <Textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Eg. How do I take care of my prosthetic liner?"
              className="mb-4"
              rows={4}
            />
            <Button onClick={handleSubmit} className="w-full bg-purple-700">
              Ask
            </Button>
          </div>
        </div>
      </aside>
      <main className="w-full h-full flex-grow p-6 pb-8 overflow-auto">
        <h2 className="text-2xl text-center mb-8">Answer</h2>
        {loading && (
          <div className="flex items-center space-x-4">
            <div className="space-y-3 w-full">
              <div className="flex space-x-2">
                <Skeleton className="h-6 w-1/3" />
                <Skeleton className="h-6 w-2/3" />
              </div>
              <div className="flex space-x-2">
                <Skeleton className="h-6 w-1/4" />
                <Skeleton className="h-6 w-1/2" />
                <Skeleton className="h-6 w-1/4" />
              </div>
              <div className="flex space-x-2">
                <Skeleton className="h-6 w-1/2" />
                <Skeleton className="h-6 w-1/2" />
              </div>
              <div className="flex space-x-2">
                <Skeleton className="h-6 w-1/4" />
                <Skeleton className="h-6 w-1/2" />
                <Skeleton className="h-6 w-1/4" />
              </div>
              <div className="flex space-x-2">
                <Skeleton className="h-6 w-1/3" />
                <Skeleton className="h-6 w-2/3" />
              </div>

              <div className="flex space-x-2">
                <Skeleton className="h-6 w-64" />
                <Skeleton className="h-6 w-32" />
              </div>
            </div>
          </div>
        )}
        {answer && (
          <div>
            <ReactMarkdown linkTarget="_blank" className="prose max-w-none">
              {answer}
            </ReactMarkdown>
            <div className="flex space-x-3 mt-2">
              <h3 className="font-extrabold">Sources:</h3>
              {sources.map((source, index) => (
                <a
                  key={index}
                  href={source.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-700"
                >
                  [{index + 1}] {source.title}
                </a>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Home;
