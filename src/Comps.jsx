import { Box, Flex } from "@chakra-ui/react";
import { getWrapperProps } from "./utils";

// colors (brightness, opacity??) sounds (tones, notes octaves?) gaps shape
// slopes (no axis labels), height/width diffs
// sequence vs static
// timed
// length of sound, distance of sound range
// animation speed

export default function Comps({ guessOptions: brightnessVals, depth, level }) {
  if (typeof brightnessVals === "number") {
    let brightness = brightnessVals;
    return (
      <Box
        style={{
          fontSize: `${15 / depth}em`,
          color: "#F7F7F7",
          filter: `brightness(${brightness / 100})`,
        }}
      >
        💡
      </Box>
    );
  }
  return (
    <Flex {...getWrapperProps(level, depth, brightnessVals)}>
      {brightnessVals.map((item, idx) => (
        <Comps key={idx} guessOptions={item} depth={depth + 1} level={level} />
      ))}
    </Flex>
  );
}
