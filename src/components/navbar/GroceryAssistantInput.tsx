"use client";

import { useState } from "react";
import { FiArrowRight } from "react-icons/fi";
import { LuSparkles } from "react-icons/lu";

interface GroceryAssistantInputProps {
  onSearch: (prompt: string) => void;
  isLoading: boolean;
}

const suggestions = [
  {
    label: "Spaghetti for 4",
    prompt: "I want to make spaghetti for 4 people",
  },
  {
    label: "Chicken fried rice",
    prompt: "What do I need to make chicken frid rice?",
  },
  {
    label: "Pancakes",
    prompt: "I want to make pancakes for breakfast?",
  },
  {
    label: "Family dinner",
    prompt: "What groceries do I need for a family dinner?",
  },
];
export default function GroceryAssistantInput({
  onSearch,
  isLoading,
}: GroceryAssistantInputProps) {
  const [prompt, setPrompt] = useState("");
  const hadleSubmit = (event:  React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedPrompt = prompt.trim();
    if (!trimmedPrompt || isLoading) {
      return;
    }
    onSearch(trimmedPrompt);
  };
  return (
    <div>
      <form onSubmit={hadleSubmit}>
        <div className="rounded-xl border border-border bg-background p-3 transition focus-within:border-primary">
          <textarea
            className="w-full resize-none bg-transparent px-2 py-1 text-sm text-text outline-none placeholder:text-muted disabled:cursor-not-allowed disabled:opacity-60"
            placeholder="I want to make spaghetti for 4 people..."
            rows={4}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            disabled={isLoading}
          />
          <div className="mt-2 flex items-center justify-between border-t border-border pt-3">
            <p className="hidden text-xs text-muted sm:block">
                Describe what you what to cook
            </p>
            <button className="ml-auto flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-white transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-50" disabled={!prompt.trim() || isLoading}>
                <LuSparkles size={15} />
                {isLoading ? "Finding...": "Find Groceries"}

                {!isLoading && <FiArrowRight size={15} />}
            </button>

          </div>
        </div>
      </form>
      <div className="mt-4 ">
        <p className="text-xs font-medium tex-text">
            Try asking
        </p>
        <div className="mt-2 flex flex-wrap gap-2">
            {suggestions.map((suggestion) => (
                <button className="rounded-full border border-border bg-card px-3 py-1.5 text-xs text-muted transition hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-50 " disabled={isLoading} key={suggestion.label} type="button" onClick={() => setPrompt(suggestion.prompt)}>
                    {suggestion.label}
                    
                </button>
            ))}
        </div>
      </div>
    </div>
  );
}
