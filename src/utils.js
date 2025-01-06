export function getNewCompsByLevel(level) {
  const base = generateNestedComps(level);
  const diff = getDiff(base);
  return { base, diff };
}

function generateNestedComps(depth) {
  if (depth === 1) {
    return [getRandomBrightness(), getRandomBrightness()];
  }
  return [generateNestedComps(depth - 1), generateNestedComps(depth - 1)];
}

export function getRandomBrightness() {
  return Math.floor(Math.random() * 100 + 50);
}

export function replaceNumbersWithRandom(valueSet) {
  if (!Array.isArray(valueSet)) {
    return getRandomBrightness();
  }
  return valueSet.map((item) => replaceNumbersWithRandom(item));
}

function getDiff(valueSet) {
  const currGuess = valueSet[0];
  const otherGuess = valueSet[1];
  if (!Array.isArray(currGuess)) {
    return currGuess - otherGuess;
  }
  return Math.abs(getDiff(currGuess)) - Math.abs(getDiff(otherGuess));
}

export const bodyTheme = {
  styles: {
    global: {
      body: {
        bgColor: "black",
      },
    },
  },
};

export function getWrapperProps(level, depth, allComps) {
  return {
    padding: "6px",
    gap: "10px",
    justifyContent: "center",
    border: Array.isArray(allComps) && depth !== 1 ? "2px solid white" : "",
    flexWrap: "wrap",
    borderRadius: "50px",
    flexGrow: level > 5 || depth === 1 ? 1 : 0,
    color: "white",
  };
}
