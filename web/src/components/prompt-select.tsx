"use client";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { api } from "@/lib/axios";
import { useEffect, useState } from "react";

type Prompt = {
  id: string;
  title: string;
  template: string;
};

type PromptSelectProps = {
  onPromptSelect: (template: string) => void;
};

export default function PromptSelect({ onPromptSelect }: PromptSelectProps) {
  const [prompts, setPrompts] = useState<Prompt[] | null>(null);

  useEffect(() => {
    api.get("/prompts").then((response) => setPrompts(response.data));
  }, []);

  return (
    <Select onValueChange={onPromptSelect}>
      <SelectTrigger>
        <SelectValue placeholder="Selecione um prompt..." />
      </SelectTrigger>
      <SelectContent>
        {prompts?.map((prompt) => (
          <SelectItem key={prompt.id} value={prompt.template}>
            {prompt.title}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
