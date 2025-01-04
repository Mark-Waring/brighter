export function getNewCompsByLevel(level) {
  let base = [getRandomBrightness(), getRandomBrightness()];
  for (let i = 1; i < level; i++) {
    base = [
      [...replaceNumbersWithRandom(base)],
      [...replaceNumbersWithRandom(base)],
    ];
  }
  let diff = testGuess(base);
  if (Math.abs(diff) < 3) {
    base = getNewCompsByLevel(level).base;
  }
  return { base, diff };
}

export function getRandomBrightness() {
  // return Math.floor(Math.random() * (10 - 2) + 2);
  return Math.floor(Math.random() * (100 - 20) + 20);
}

export function replaceNumbersWithRandom(valueSet) {
  if (!Array.isArray(valueSet)) {
    return getRandomBrightness();
  }
  return valueSet.map((item) => replaceNumbersWithRandom(item));
}

export function testGuess(valueSet) {
  const currGuess = valueSet[0];
  const otherGuess = valueSet[1];
  if (!Array.isArray(currGuess)) {
    return currGuess - otherGuess;
  }
  return (
    Math.round(Math.abs(testGuess(currGuess))) -
    Math.round(Math.abs(testGuess(otherGuess)))
  );
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
