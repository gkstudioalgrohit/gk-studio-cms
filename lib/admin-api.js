"use client";
// Thin fetch wrapper for admin API calls. Throws a plain Error with the
// server's message so components can show it directly.
export async function api(path, options = {}) {
  const res = await fetch(`/api/admin${path}`, {
    ...options,
    headers: options.body instanceof FormData ? options.headers : { "Content-Type": "application/json", ...options.headers },
  });
  let data = null;
  try { data = await res.json(); } catch {}
  if (!res.ok) throw new Error(data?.error || `Request failed (${res.status})`);
  return data;
}
export const getSection = (key) => api(`/sections/${key}`).then((d) => d.data);
export const saveSection = (key, data) => api(`/sections/${key}`, { method: "PUT", body: JSON.stringify(data) }).then((d) => d.data);
