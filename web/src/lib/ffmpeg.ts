import { FFmpeg } from "@ffmpeg/ffmpeg";

import { toBlobURL } from "@ffmpeg/util";

let ffmpeg: FFmpeg | null;

export async function LoadFFmpeg() {
  const baseURL = "https://unpkg.com/@ffmpeg/core@0.12.2/dist/esm";
  if (ffmpeg) return ffmpeg;

  ffmpeg = new FFmpeg();

  await ffmpeg?.load({
    coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, "text/javascript"),
    wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, "application/wasm"),
  });

  return ffmpeg;
}
