import React from "react";
import { Tr, Td } from "@chakra-ui/react";
import { ArrowBackIcon } from '@chakra-ui/icons';
import { sanitizeAndShortenRequestResponseData, capitalizeFirstLetter } from "../../helpers/helpers";

function Response({ response, splitView, styleObj }, ref) {
  const {
    timestamp, class: classType, responseStatus, referer, responseData
  } = response;

  return (
    <Tr
      onClick={splitView}
      style={styleObj}
      ref={ref}
    >
      <Td>{timestamp}</Td>
      <Td>
        <ArrowBackIcon color="green.300" marginBottom="2px" />
        {` ${responseStatus} ${capitalizeFirstLetter(classType)}`}
      </Td>
      <Td>{referer}</Td>
      <Td>{sanitizeAndShortenRequestResponseData(responseData)}</Td>
    </Tr>
  );
}

const forwardedResponse = React.forwardRef(Response);

export default forwardedResponse;
