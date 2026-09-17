const CLIENT_ID_KEY = "gps_client_id";

/** Anonymous per-browser identity used to scope conversation history without a
 * login system. Generated once and persisted in localStorage. */
export function getOrCreateClientId(): string {
  if (typeof window === "undefined") return "";

  let id = window.localStorage.getItem(CLIENT_ID_KEY);
  if (!id) {
    id = crypto.randomUUID();
    window.localStorage.setItem(CLIENT_ID_KEY, id);
  }
  return id;
}
