import "./App.css";
import { Button, Flex, Select } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import Guess from "./Guess";
import Comps from "./Comps";
import FeedbackOverlay from "./FeedbackOverlay";
import AdaptiveLearning from "./adaptiveLearning";
import { extendTheme, ChakraProvider } from "@chakra-ui/react";
import { bodyTheme, getNewCompsByLevel } from "./utils";

export default function App() {
  const [guessOptions, setGuessOptions] = useState(null);
  const [diff, setDiff] = useState(null);
  const [displayedOption, setDisplayedOption] = useState(null);
  const [level, setLevel] = useState(null);
  const [adaptiveSystem] = useState(() => new AdaptiveLearning());
  const [isGameActive, setIsGameActive] = useState(false);
  const [feedback, setFeedback] = useState({
    isVisible: false,
    isCorrect: false,
  });

  const canGuess = isGameActive && !displayedOption;

  const GAME_LENGTH_IN_MILLISECONDS = 90000;

  useEffect(() => {
    let timer;
    if (isGameActive) {
      timer = setTimeout(() => {
        setIsGameActive(false);
        setGuessOptions(null);
        setDisplayedOption(null);
        setLevel(null);
      }, GAME_LENGTH_IN_MILLISECONDS);
    }
    return () => clearInterval(timer);
  }, [isGameActive]);

  function startGame() {
    setIsGameActive(true);
    setLevel(level || 1);
    const { base: newOptions, diff } = getNewCompsByLevel(level || 1);
    setGuessOptions(newOptions);
    setDiff(diff);
    setDisplayedOption(newOptions[0]);
    setFeedback({ isVisible: false, isCorrect: false });
  }

  function selectLevel(e) {
    const newLevel = e.target.value ? parseInt(e.target.value) : null;
    setLevel(newLevel);
    setGuessOptions(null);
    setDisplayedOption(null);
    setIsGameActive(false);
    setFeedback({ isVisible: false, isCorrect: false });
  }

  useEffect(() => {
    if (displayedOption && !feedback.isVisible) {
      const timer = setTimeout(() => {
        setDisplayedOption(
          displayedOption === guessOptions[0] ? guessOptions[1] : null
        );
      }, Math.max(level ** 2 * 250, 1000));
      return () => clearTimeout(timer);
    }
  }, [displayedOption, feedback.isVisible]);

  function handleGuess(idx) {
    const isCorrect = idx === 0 ? diff >= 0 : diff <= 0;
    setFeedback({ isVisible: true, isCorrect });

    const levelChange = adaptiveSystem.processResponse(isCorrect, level);
    const newLevel = level + levelChange;
    const newComps = getNewCompsByLevel(newLevel);
    setGuessOptions(newComps.base);
    setDiff(newComps.diff);
    setDisplayedOption(newComps.base[0]);

    if (levelChange !== 0) {
      setLevel(newLevel);
    }
  }

  function handleFeedbackEnd() {
    setFeedback({ isVisible: false, isCorrect: false });
  }

  return (
    <ChakraProvider theme={extendTheme(bodyTheme)}>
      <FeedbackOverlay
        isVisible={feedback.isVisible}
        isCorrect={feedback.isCorrect}
        onAnimationEnd={handleFeedbackEnd}
      />
      <Flex p="10px" justifyContent="center" alignItems="center">
        <Select
          variant="outline"
          w="fit-content"
          value={level || ""}
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
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((option) => (
            <option key={option} value={option}>
              Level {option}
            </option>
          ))}
        </Select>
      </Flex>
      {!feedback.isVisible && (
        <>
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
            {!isGameActive && (
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
        </>
      )}
    </ChakraProvider>
  );
}
