import React from 'react';
import { Tr, Td } from '@chakra-ui/react';
import { ArrowForwardIcon } from '@chakra-ui/icons';
import {
  sanitizeAndShortenRequestResponseData,
  capitalizeFirstLetter,
} from '../../helpers/helpers';

function Request({ request, splitView, styleObj }, ref) {
  const {
    timestamp,
    class: classType,
    method,
    originalUri,
    requestData,
  } = request;

  return (
    <Tr
      onClick={splitView}
      style={styleObj}
      ref={ref}
    >
      <Td>{timestamp}</Td>
      <Td>
        <ArrowForwardIcon color="green.300" marginBottom="2px" />
        {` ${method} ${capitalizeFirstLetter(classType)}`}
      </Td>
      <Td>{originalUri}</Td>
      <Td>{sanitizeAndShortenRequestResponseData(requestData)}</Td>
    </Tr>
  );
}

const forwardedRequest = React.forwardRef(Request);

export default forwardedRequest;
