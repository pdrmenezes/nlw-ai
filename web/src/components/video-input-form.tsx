"use client";
import { FileVideo, Upload } from "lucide-react";
import { Separator } from "./ui/separator";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { ChangeEvent, useMemo, useState } from "react";

export default function VideoInputForm() {
  const [videoPreview, setVideoPreview] = useState<File | null>(null);

  function handleSelectedFile(event: ChangeEvent<HTMLInputElement>) {
    const { files } = event.currentTarget;

    if (!files) return;

    const selectedfile = files[0];
  }

  const previewURL = useMemo(() => {
    if (!videoPreview) return null;

    return URL.createObjectURL(videoPreview);
  }, [videoPreview]);

  return (
    <form className="space-y-6">
      <label
        htmlFor="video"
        className="border border-dashed text-sm flex flex-col gap-2 items-center justify-center text-muted-foreground rounded-md aspect-video cursor-pointer hover:bg-primary/5 relative"
      >
        {previewURL ? (
          <video src={previewURL} controls={false} className="pointer-events-none absolute inset-0" />
        ) : (
          <>
            <FileVideo className="h-4 w-4" />
            Selecione um vídeo
          </>
        )}
      </label>
      <input type="file" name="video" id="video" accept="video/mp4" className="sr-only" onChange={handleSelectedFile} />
      <Separator />
      <div className="space-y-2">
        <Label htmlFor="transcription_prompt">Prompt de transcrição</Label>
        <Textarea
          id="transcription_prompt"
          className="h-20 leading-relaxed resize-none"
          placeholder="Inclua palavras-chave mencionadas no vídeo separadas por vírgula (,)"
        />
      </div>
      <Button type="submit" className="w-full">
        Carregar vídeo <Upload className="h-4 w-4 ml-2" />
      </Button>
    </form>
  );
}
