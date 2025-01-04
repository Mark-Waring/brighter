import "./App.css";
import { Button, Flex, Select } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import Guess from "./Guess";
import Comps from "./Comps";
import FeedbackOverlay from "./FeedbackOverlay";
import { extendTheme, ChakraProvider } from "@chakra-ui/react";
import { bodyTheme, getNewCompsByLevel } from "./utils";

class AdaptiveLearning {
  constructor(config = {}) {
    this.questionsPerLevel = config.questionsPerLevel;
    this.masteryThreshold = config.masteryThreshold || 0.8;
    this.demotionThreshold = config.demotionThreshold || 0.3;
    this.performanceHistory = [];
  }

  processResponse(isCorrect, currentLevel) {
    this.performanceHistory.push({
      level: currentLevel,
      isCorrect,
    });

    if (this.questionsPerLevel !== currentLevel + 1) {
      this.questionsPerLevel = currentLevel + 1;
    }

    const recentPerformance = this.performanceHistory
      .filter((p) => p.level === currentLevel)
      .slice(-this.questionsPerLevel);

    const mastery =
      recentPerformance.filter((p) => p.isCorrect).length /
      recentPerformance.length;

    if (recentPerformance.length >= this.questionsPerLevel) {
      if (mastery >= this.masteryThreshold) {
        return 1;
      } else if (mastery <= this.demotionThreshold) {
        return -1;
      }
    }
    return 0;
  }
}

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

  const GAME_LENGTH_IN_MILLISECONDS = 60000;

  // Timer effect
  useEffect(() => {
    let timer;
    if (isGameActive) {
      setTimeout(() => {
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
      }, (level - 1 || 1) * 1000);
      return () => clearTimeout(timer);
    }
  }, [displayedOption, feedback.isVisible]);

  function handleGuess(idx) {
    const isCorrect = idx === 0 ? diff > 0 : diff < 0;
    setFeedback({ isVisible: true, isCorrect });

    const levelChange = adaptiveSystem.processResponse(isCorrect, level);
    const newLevel = Math.max(1, Math.min(9, level + levelChange));
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
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((option) => (
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
