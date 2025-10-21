import { Platform } from "react-native";

export const API_BASE =
  Platform.OS === "android" ? "http://10.0.2.2:8000" : "http://localhost:8000";

export async function uploadAudio(uri: string) {
  const form = new FormData();
  const filename = uri.split("/").pop() || "audio.m4a";
  form.append("file", {
    // @ts-ignore React Native FormData file
    uri,
    name: filename,
    type: "audio/m4a",
  });
  const res = await fetch(`${API_BASE}/upload-audio`, {
    method: "POST",
    headers: { "Content-Type": "multipart/form-data" },
    body: form as any,
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json() as Promise<{ status: string; job_id: string }>;
}

export async function submitText(text: string, capturedAtISO: string) {
  const res = await fetch(`${API_BASE}/submit-text`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text, captured_at: capturedAtISO }),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json() as Promise<{ status: string; job_id: string }>;
}

export async function getResult(jobId: string) {
  const r = await fetch(`${API_BASE}/result/${jobId}`);
  if (!r.ok) throw new Error(await r.text());
  return r.json() as Promise<{ job_id: string; status: string }>;
}
