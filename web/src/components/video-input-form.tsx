"use client";
import { FileVideo, Loader2, Upload } from "lucide-react";
import { Separator } from "./ui/separator";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { ChangeEvent, FormEvent, useMemo, useRef, useState } from "react";
import { LoadFFmpeg } from "@/lib/ffmpeg";
import { fetchFile } from "@ffmpeg/util";
import { api } from "@/lib/axios";

const UploadVideoStatusMessages = {
  Waiting: "Carregar vídeo",
  Converting: "Convertendo",
  Uploading: "Carregando",
  "Generating Transcription": "Gerando transcrição",
  Success: "Sucesso!",
};
type UploadVideoStatus = keyof typeof UploadVideoStatusMessages;

export default function VideoInputForm() {
  const [videoPreview, setVideoPreview] = useState<File | null>(null);
  const [uploadVideoStatus, setUploadVideoStatus] = useState<UploadVideoStatus>("Waiting");
  const promptInputRef = useRef<HTMLTextAreaElement>(null);

  function handleSelectedFile(event: ChangeEvent<HTMLInputElement>) {
    const { files } = event.currentTarget;

    if (!files) return;

    const selectedfile = files[0];
  }

  async function convertVideoToAudio(video: File) {
    const ffmpeg = await LoadFFmpeg();
    // creating file on FFmpeg's filesystem
    await ffmpeg.writeFile("input.mp4", await fetchFile(video));
    // loggin the conversion progress from 0 to 100
    ffmpeg.on("progress", (progress) => {
      console.log("conversion progress: " + Math.round(progress.progress * 100));
    });
    // executing the convertion script with some parameter flags to get the first audio stream, setting the bitrate to 20k, chosing the codec, etc.
    await ffmpeg.exec(["-i", "input.mp4", "-map", "0:a", "-b:a", "20k", "-acodec", "libmp3lame", "output.mp3"]);
    // getting the outputed file and reading it from the WASM filesystem
    const data = await ffmpeg.readFile("output.mp3");
    // to convert the 'FileData' typed file to a Javascript 'File' first we have to turn it into a 'Blob'
    const audioFileBlob = new Blob([data], { type: "audio/mpeg" });
    // then, from the Blob we convert it to a File
    const audioFile = new File([audioFileBlob], "audio.mp3", { type: "audio/mpeg" });

    console.log("Convertion finished");
    return audioFile;
  }

  async function handleUploadVideo(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const prompt = promptInputRef.current?.value;

    if (!videoPreview) return;

    setUploadVideoStatus("Converting");
    const audioFile = await convertVideoToAudio(videoPreview);

    const formData = new FormData();
    formData.append("file", audioFile);

    setUploadVideoStatus("Uploading");
    const response = await api.post("/videos", formData);
    const videoId = response.data.video.id;

    setUploadVideoStatus("Generating Transcription");
    await api.post(`/videos/${videoId}/transcription`, {
      prompt,
    });

    setUploadVideoStatus("Success");
  }

  const previewURL = useMemo(() => {
    if (!videoPreview) return null;

    return URL.createObjectURL(videoPreview);
  }, [videoPreview]);

  return (
    <form className="space-y-6" onSubmit={handleUploadVideo}>
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
          ref={promptInputRef}
          disabled={uploadVideoStatus !== "Waiting"}
          id="transcription_prompt"
          className="h-20 leading-relaxed resize-none"
          placeholder="Inclua palavras-chave mencionadas no vídeo separadas por vírgula (,)"
        />
      </div>
      <Button
        disabled={uploadVideoStatus !== "Waiting"}
        type="submit"
        className="w-full data-[success=true]:bg-emerald-400"
        data-success={uploadVideoStatus === "Success"}
      >
        {UploadVideoStatusMessages[uploadVideoStatus]} {uploadVideoStatus === "Waiting" && <Upload className="h-4 w-4 ml-2" />}{" "}
        {uploadVideoStatus !== "Waiting" && uploadVideoStatus !== "Success" && <Loader2 className="h-4 w-4 ml-2 animate-spin" />}
      </Button>
    </form>
  );
}
