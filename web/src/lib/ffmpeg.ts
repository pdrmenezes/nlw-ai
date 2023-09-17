import { FFmpeg } from "@ffmpeg/ffmpeg";

import coreURL from "../ffmpeg/ffmpeg-core.js";
// import wasmURL from "../ffmpeg/ffmpeg-core.wasm";
import workerURL from "../ffmpeg/ffmpeg-worker.js";

let ffmpeg: FFmpeg | null;

export async function LoadFFmpeg() {
  if (ffmpeg) return ffmpeg;

  ffmpeg = new FFmpeg();

  if (!ffmpeg?.loaded) await ffmpeg?.load({});

  return ffmpeg;
}
