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

export default function LogTable({
  activeLog, showMoreLogInfo, splitView, logs, logTypes
}) {
  const messengerBlue = useToken("colors", "messenger.400");
  // Assign titles dynamically depending on which types of logs the user is viewing
  const [colTitle1, colTitle2, colTitle3, colTitle4] = getHeaderTitles(logTypes);
  const LogMotion = motion(Log)
  const RequestMotion = motion(Request)
  const ResponseMotion = motion(Response)
  const variants = {
    hidden: (i) => ({
      opacity: 0,
      y: -50 * i,
    }),
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.025,
      },
    }),
  };

  return (
    <Table colorScheme="facebook" variant="simple">
      <Thead>
        <Tr className="sticky-table">
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
                <AnimatePresence>
                <LogMotion
                  styleObj={styleObj}
                  variants={{hidden: (i) => ({
                    opacity: 0,
                    y: -50 * i,
                  }),
                  visible: (i) => ({
                    opacity: 1,
                    y: 0,
                    transition: {
                      delay: i * 0.025,
                    },
                  })}}
                  initial="hidden"
                  animate="visible"
                  custom={i}
                  log={log}
                  key={`${log.class}${log.type}${log.timestamp}${log.log}`}
                  splitView={() => splitView(log.id)}
                />
                </AnimatePresence>
              );
            case "request":
              return (
                <AnimatePresence>
                <RequestMotion
                  styleObj={styleObj}
                  variants={{hidden: (i) => ({
                    opacity: 0,
                    y: -50 * i,
                  }),
                  visible: (i) => ({
                    opacity: 1,
                    y: 0,
                    transition: {
                      delay: i * 0.025,
                    },
                  })}}
                  initial="hidden"
                  animate="visible"
                  custom={i}
                  request={log}
                  key={`${log.class}${log.method}${log.timestamp}${log.originalUri}`}
                  splitView={() => splitView(log.id)}
                />
                </AnimatePresence>
              );
            case "response":
              return (
                <AnimatePresence>
                <ResponseMotion
                  styleObj={styleObj}
                  response={log}
                  variants={{hidden: (i) => ({
                    opacity: 0,
                    y: -50 * i,
                  }),
                  visible: (i) => ({
                    opacity: 1,
                    y: 0,
                    transition: {
                      delay: i * 0.025,
                    },
                  })}}
                  initial="hidden"
                  animate="visible"
                  custom={i}
                  key={`${log.class}${log.responseStatus}${log.timestamp}`}
                  splitView={() => splitView(log.id)}
                />
                </AnimatePresence>
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
