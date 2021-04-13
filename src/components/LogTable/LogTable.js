import React from 'react';
import { AnimatePresence, motion } from 'framer-motion'
import {
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  useToken
} from "@chakra-ui/react";
import Log from "./Log";
import Request from "./Request";
import Response from "./Response";
import { getHeaderTitles } from "../../helpers/helpers";
const TbodyMotion = motion(Tbody)
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

export default function LogTable({
  activeLog, showMoreLogInfo, splitView, logs, logTypes
}) {
  const messengerBlue = useToken("colors", "messenger.400");
  // Assign titles dynamically depending on which types of logs the user is viewing
  const [colTitle1, colTitle2, colTitle3, colTitle4] = getHeaderTitles(logTypes);
  return (
    <Table variant="simple">
      <Thead>
        <Tr>
          <Th>{colTitle1}</Th>
          <Th>{colTitle2}</Th>
          <Th>{colTitle3}</Th>
          <Th>{colTitle4}</Th>
        </Tr>
      </Thead>
      <Tbody>
        {logs.map((log, i) => {
          let styleObj = {};
          if (showMoreLogInfo && activeLog.id === log.id) {
            styleObj = {
              backgroundColor: messengerBlue,
              color: 'white'
            };
          }
          switch (log.class) {
            case "client":
            case "server":
              return (
                <Log
                  styleObj={styleObj}
                  log={log}
                  key={`${log.class}${log.type}${log.timestamp}${log.log}`}
                  splitView={() => splitView(log.id)}
                />
              );
            case "request":
              return (
                <Request
                  styleObj={styleObj}
                  request={log}
                  key={`${log.class}${log.method}${log.timestamp}${log.originalUri}`}
                  splitView={() => splitView(log.id)}
                />
              );
            case "response":
              return (
                <Response
                  styleObj={styleObj}
                  response={log}
                  key={`${log.class}${log.responseStatus}${log.timestamp}`}
                  splitView={() => splitView(log.id)}
                />
              );
            default:
              return <noscript />;
          }
        })}
      </Tbody>
      <Tfoot>
        <Tr>
          <Th>TimeStamp</Th>
          <Th>Type</Th>
          <Th>Class / Referer / Endpoint</Th>
          <Th>Log / Data</Th>
        </Tr>
      </Tfoot>
    </Table>
  );
}
