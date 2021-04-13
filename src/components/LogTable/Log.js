import React from "react";
import { Tr, Td } from "@chakra-ui/react";
import { sanitizeAndShortenLogData, capitalizeFirstLetter } from "../../helpers/helpers";
import { AnimatePresence, motion } from 'framer-motion'

export default function Log({ log, splitView, styleObj }) {
  const TrMotion = motion(Tr)
  const variants = {
    hidden: {
      opacity: 0
    },
    visible: (i) => ({
      opacity: 1,
      transition: {
        delay: i * 0.01
      }
    })
  }
  const {
    timestamp, class: classType, type, log: logData
  } = log;
  return (
    <TrMotion onClick={splitView} style={styleObj} initial="hidden"
    animate="visible"
    >
      <Td>{timestamp}</Td>
      <Td>{capitalizeFirstLetter(classType)}</Td>
      <Td>{capitalizeFirstLetter(type)}</Td>
      <Td>{sanitizeAndShortenLogData(logData)}</Td>
    </TrMotion>
  );
}
