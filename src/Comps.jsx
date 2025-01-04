import { Box, Flex } from "@chakra-ui/react";
import { getWrapperProps } from "./utils";

// colors (brightness, opacity??) sounds (tones, notes octaves?) gaps shape
// slopes (no axis labels), height/width diffs
// sequence vs static
// timed
// length of sound, distance of sound range
// animation speed

export default function Comps({ guessOptions, depth, level }) {
  if (typeof guessOptions === "number") {
    return (
      <Box
        style={{
          fontSize: `${15 / depth}em`,
          color: "#F7F7F7",
          filter: `brightness(${guessOptions / 100})`,
        }}
      >
        💡
      </Box>
    );
  }
  return (
    <Flex {...getWrapperProps(level, depth, guessOptions)}>
      {guessOptions.map((item, idx) => (
        <Comps key={idx} guessOptions={item} depth={depth + 1} level={level} />
      ))}
    </Flex>
  );
}
