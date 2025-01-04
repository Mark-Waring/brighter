import "./App.css";
import { Button, Flex, Heading } from "@chakra-ui/react";

export default function Guess({ guessOptions, onGuess }) {
  const guessWrapperProps = {
    borderRadius: "50%",
    w: 100,
    h: 100,
    justifyContent: "center",
    alignItems: "center",
    _hover: {
      transform: "scale(1.02)",
      transition: "transform 0.2s ease-in-out",
    },
    color: "white",
    bg: "black",
    border: "2px solid white",
  };
  return (
    <Flex
      transform={"translateY(-70px)"}
      p={"8px"}
      flexBasis={"100%"}
      justifyContent={"space-evenly"}
    >
      <Button {...guessWrapperProps} onClick={() => onGuess(0)}>
        <Heading>1</Heading>
      </Button>
      <Button {...guessWrapperProps} onClick={() => onGuess(1)}>
        <Heading>2</Heading>
      </Button>
    </Flex>
  );
}
