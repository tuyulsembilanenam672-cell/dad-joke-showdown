// Dad Joke Showdown — one dad joke, written to /output/entry.txt.
// The joke is the whole entry: a single line of at most 200 characters.
// Node 22.18+ runs this TypeScript file as-is (type stripping).
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";

const JOKE =
  "I told my daughter the stairs were my favourite part of the house. She asked why, and I said, 'They always step up when I need them.'";

const OUT_PATH = "/output/entry.txt";
const MAX_CODE_POINTS = 200;

function countCodePoints(text: string): number {
  return [...text].length;
}

function hasLoneSurrogate(text: string): boolean {
  for (let i = 0; i < text.length; i++) {
    const code = text.charCodeAt(i);
    if (code >= 0xd800 && code <= 0xdbff) {
      const next = text.charCodeAt(i + 1);
      if (!(next >= 0xdc00 && next <= 0xdfff)) return true;
      i++;
    } else if (code >= 0xdc00 && code <= 0xdfff) {
      return true;
    }
  }
  return false;
}

function validate(text: string): void {
  const points = countCodePoints(text);
  if (points < 1 || points > MAX_CODE_POINTS) {
    throw new Error(`joke must be 1-${MAX_CODE_POINTS} code points, got ${points}`);
  }
  if (text.includes("\n") || text.includes("\r")) {
    throw new Error("joke must be a single line");
  }
  if (text.trim().length === 0) {
    throw new Error("joke must not be whitespace only");
  }
  if (hasLoneSurrogate(text)) {
    throw new Error("joke must be valid UTF-8 (no lone surrogates)");
  }
}

function main(): void {
  validate(JOKE);
  mkdirSync(dirname(OUT_PATH), { recursive: true });
  writeFileSync(OUT_PATH, JOKE, "utf8");
  console.log(`Wrote ${countCodePoints(JOKE)} code points to ${OUT_PATH}`);
}

main();
