export function getApi() {
  if (typeof window !== "undefined") {
    return (window.__ENV__ && window.__ENV__.API) || "";
  }
  return process.env.API || "";
}
