import React from 'react';
import { Tr, Td } from '@chakra-ui/react';
import {
  sanitizeAndShortenLogData,
  capitalizeFirstLetter,
} from '../../helpers/helpers';

function Log({ log, splitView, styleObj }, ref) {
  const { timestamp, class: classType, type, log: logData } = log;
  return (
      <tr
        onClick={splitView}
        style={styleObj}
        ref={ref}
      >
        <Td>{timestamp}</Td>
        <Td>{capitalizeFirstLetter(classType)}</Td>
        <Td>{capitalizeFirstLetter(type)}</Td>
        <Td>{sanitizeAndShortenLogData(logData)}</Td>
      </tr>
  );
}

const forwardedLog = React.forwardRef(Log)

export default forwardedLog
