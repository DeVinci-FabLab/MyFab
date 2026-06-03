// Easter egg anniversaire — 17 janvier, pour tout le monde.
// Ce jour-là : les avatars deviennent des emojis de fête + chapeau sur le logo.
// Astuce preview (hors 17/01) : ajouter ?fete=1 à l'URL.

const BIRTHDAY_EMOJIS = ["🎂", "🎉", "🎁"];

export function isBirthday() {
  if (
    typeof window !== "undefined" &&
    window.location &&
    window.location.search.includes("fete=1")
  ) {
    return true;
  }
  const d = new Date();
  return d.getMonth() === 0 && d.getDate() === 17; // janvier = mois 0
}

// Emoji déterministe selon une graine (nom) → un peu de variété entre avatars.
export function birthdayEmoji(seed) {
  let n = 0;
  const s = seed == null ? "" : String(seed);
  for (let i = 0; i < s.length; i++) n += s.charCodeAt(i);
  return BIRTHDAY_EMOJIS[Math.abs(n) % BIRTHDAY_EMOJIS.length];
}
