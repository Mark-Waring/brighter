import "./App.css";
import { Button, Flex, Select } from "@chakra-ui/react";
import { useState } from "react";
import Guess from "./Guess";
import Comps from "./Comps";
import { extendTheme, ChakraProvider } from "@chakra-ui/react";
import { bodyTheme, getNewCompsByLevel } from "./utils";

export default function App() {
  const [guessOptions, setGuessOptions] = useState(null);
  const [displayedOption, setDisplayedOption] = useState(null);
  const [streak, setStreak] = useState(0);
  const [selectedLevel, setSelectedLevel] = useState("");
  let level = guessOptions ? Math.log2(guessOptions.flat(Infinity).length) : 0;
  const isPlaying = !!guessOptions;
  const canGuess = isPlaying && !displayedOption;
  const [diff, setDiff] = useState(null);

  function startGame() {
    const newOptions = getNewCompsByLevel(selectedLevel || 1);
    setGuessOptions(newOptions.base ?? []);
    setDiff(newOptions.diff);
    setDisplayedOption(newOptions.base[0]);
  }

  function selectLevel(e) {
    setSelectedLevel(e.target.value ? parseInt(e.target.value) : null);
    setGuessOptions(null);
    setDisplayedOption(null);
    setStreak(null);
  }

  if (isPlaying && displayedOption) {
    setTimeout(() => {
      setDisplayedOption(
        displayedOption === guessOptions[0] ? guessOptions[1] : null
      );
      // }, 5000);
    }, (level - 1 || 1) * 1000);
  }

  function handleGuess(idx) {
    const passed = idx === 0 ? diff > 0 : diff < 0;
    if (passed) {
      const newStreak = streak + 1;
      // if (true) {
      if (level === 1 || newStreak === 3) {
        level++;
        setStreak(0);
      } else {
        setStreak(newStreak);
      }
      const newComps = getNewCompsByLevel(selectedLevel || level);
      setGuessOptions(newComps.base);
      setDiff(newComps.diff);
      setDisplayedOption(newComps.base[0]);
    } else {
      setStreak(0);
      setGuessOptions(null);
      setDisplayedOption(null);
      setDiff(null);
    }
  }

  return (
    <ChakraProvider theme={extendTheme(bodyTheme)}>
      <Flex p="10px" justifyContent="center" alignItems="center">
        <Select
          variant="outline"
          w="fit-content"
          value={selectedLevel || level}
          placeholder="Select Level"
          onChange={selectLevel}
          bg="#2D3748"
          color="white"
          sx={{
            "> option": {
              background: "#2D3748",
              color: "white",
            },
          }}
        >
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((option) => (
            <option key={option} value={option}>
              Level {option}
            </option>
          ))}
        </Select>
      </Flex>
      <Flex
        className="full-container"
        minHeight="calc(100vh - 60px)"
        alignItems="center"
        justifyContent={
          !displayedOption
            ? "space-evenly"
            : displayedOption === guessOptions[1]
            ? "flex-end"
            : "flex-start"
        }
      >
        {!isPlaying && (
          <Button
            transform="translateY(-60px)"
            colorScheme="blue"
            onClick={startGame}
          >
            Start Game
          </Button>
        )}
        {canGuess && (
          <Guess
            className="guess-container"
            onGuess={handleGuess}
            guessOptions={guessOptions}
          />
        )}
        {!!displayedOption && (
          <Flex
            transform={level <= 5 ? "translateY(-60px)" : "none"}
            className="options-container"
            flexBasis={level > 5 ? "90%" : "75%"}
            justifyContent="space-evenly"
          >
            <Comps depth={1} guessOptions={displayedOption} level={level} />
          </Flex>
        )}
      </Flex>
    </ChakraProvider>
  );
}
