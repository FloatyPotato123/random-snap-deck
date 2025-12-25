import { Buffer } from "buffer";
globalThis.Buffer = Buffer; // make Buffer available globally

import { getAllCards, generateDeckcodeString } from "snapdeck";

/** Pick `count` unique random elements from an array */
function pickRandomUnique(array, count) {
  const copy = [...array];
  const result = [];
  while (result.length < count) {
    const index = Math.floor(Math.random() * copy.length);
    result.push(copy.splice(index, 1)[0]);
  }
  return result;
}

export default {
  async fetch(request) {
    const allCards = await getAllCards();

    // Only include cards that are playable
    const playableCards = allCards.filter(card => card.obtainable);

    const randomCards = pickRandomUnique(playableCards, 12);
    const deckCode = generateDeckcodeString(randomCards);

    return new Response(deckCode, {
      headers: { "Content-Type": "text/plain" },
    });
  },
};
