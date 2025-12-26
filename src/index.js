/**
 * Inject Buffer into the global scope. Cloudflare Workers don't include it by default,
 * but the 'snapdeck' library requires it to handle Base64 deck encoding.
 */
import { Buffer } from "buffer";
globalThis.Buffer = Buffer;

import { getAllCards, generateDeckcodeString } from "snapdeck";
import { sampleSize } from "lodash-es";

export default {
  async fetch() {
    const allCards = await getAllCards();
    const now = Date.now();

    // 1. Select only obtainable and released cards
    const playable = allCards.filter(c => c.obtainable && new Date(c.releaseDate) <= now);

    // 2. Pick 12 random cards
    const randomDeck = sampleSize(playable, 12);

    return new Response(generateDeckcodeString(randomDeck), {
      headers: { "Content-Type": "text/plain" },
    });
  },
};