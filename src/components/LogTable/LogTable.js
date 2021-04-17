import React, { useRef, useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Table, Thead, Tbody, Tfoot, Tr, Th, useToken
} from '@chakra-ui/react';
import Log from './Log';
import Request from './Request';
import Response from './Response';
import { getHeaderTitles } from '../../helpers/helpers';

export default function LogTable({
  showLogs,
  activeLog,
  showMoreLogInfo,
  splitView,
  logs,
  logTypes,
}) {
  const messengerBlue = useToken('colors', 'messenger.400');
  const TIMEDIFF_THRESHOLD = 500;
  // Assign titles dynamically depending on which types of logs the user is viewing
  const [colTitle1, colTitle2, colTitle3, colTitle4] = getHeaderTitles(
    logTypes
  );
  const LogMotion = motion(Log);
  const RequestMotion = motion(Request);
  const ResponseMotion = motion(Response);
  const hasRenderedRef = useRef(false);
  const prevCountRef = useRef();
  const prevCount = useRef();

  useEffect(() => {
    prevCountRef.current = logs.length;
    if (logs.length > 0) {
      hasRenderedRef.current = true;
    } else {
      hasRenderedRef.current = false;
      prevCountRef.current = 0;
    }
  }, [logs]);

  prevCount.current = prevCountRef.current;

  return (
    <div>
      {showLogs && (
      <Table variant="simple">
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
                color: 'white',
              };
            }
            switch (log.class) {
              case 'client':
              case 'server':
                return (
                  <AnimatePresence exitBeforeEnter>
                    <LogMotion
                      styleObj={styleObj}
                      variants={{
                        initialHidden: () => ({
                          opacity: 0,
                          y: -50 * i,
                        }),
                        initialVisible: () => ({
                          opacity: 1,
                          y: 0,
                          transition: {
                            delay: 0.025 * i,
                          },
                        }),
                        loadedHidden: () => {
                          const timeDiff = Date.parse(new Date().toISOString())
                          - Date.parse(
                            new Date(
                              `${log.arrivedAt.replace(' - ', 'T')}Z`
                            ).toISOString()
                          );
                          if (Math.abs(timeDiff) < TIMEDIFF_THRESHOLD) {
                            return {
                              opacity: 0,
                            };
                          }
                          return {
                            opacity: 1,
                          };
                        },
                        loadedVisible: () => {
                          const timeDiff = Date.parse(new Date().toISOString())
                          - Date.parse(
                            new Date(
                              `${log.arrivedAt.replace(' - ', 'T')}Z`
                            ).toISOString()
                          );
                          if (Math.abs(timeDiff) < TIMEDIFF_THRESHOLD) {
                            return {
                              opacity: 1,
                              transition: {
                                delay: Math.abs(i - logs.length) * 0.05,
                              },
                            };
                          }
                          return { opacity: 1 };
                        },
                      }}
                      initial={
                      hasRenderedRef.current ? 'loadedHidden' : 'initialHidden'
                    }
                      animate={
                      hasRenderedRef.current
                        ? 'loadedVisible'
                        : 'initialVisible'
                    }
                      custom={i}
                      log={log}
                      key={`${log.class}${log.type}${log.timestamp}${log.log}`}
                      splitView={() => splitView(log.id)}
                    />
                  </AnimatePresence>
                );
              case 'request':
                return (
                  <AnimatePresence>
                    <RequestMotion
                      styleObj={styleObj}
                      variants={{
                        initialHidden: () => ({
                          opacity: 0,
                          y: -50 * i,
                        }),
                        initialVisible: () => ({
                          opacity: 1,
                          y: 0,
                          transition: {
                            delay: i * 0.025,
                          },
                        }),
                        loadedHidden: () => {
                          const timeDiff = Date.parse(new Date().toISOString())
                          - Date.parse(
                            new Date(
                              `${log.arrivedAt.replace(' - ', 'T')}Z`
                            ).toISOString()
                          );
                          if (Math.abs(timeDiff) < TIMEDIFF_THRESHOLD) {
                            return {
                              opacity: 0,
                            };
                          }
                          return {
                            opacity: 1,
                          };
                        },
                        loadedVisible: () => {
                          const timeDiff = Date.parse(new Date().toISOString())
                          - Date.parse(
                            new Date(
                              `${log.arrivedAt.replace(' - ', 'T')}Z`
                            ).toISOString()
                          );
                          if (Math.abs(timeDiff) < TIMEDIFF_THRESHOLD) {
                            return {
                              opacity: 1,
                              transition: {
                                delay: Math.abs(i - logs.length) * 0.025,
                              },
                            };
                          }
                          return { opacity: 1 };
                        },
                      }}
                      initial={
                      hasRenderedRef.current ? 'loadedHidden' : 'initialHidden'
                    }
                      animate={
                      hasRenderedRef.current
                        ? 'loadedVisible'
                        : 'initialVisible'
                    }
                      custom={i}
                      request={log}
                      key={`${log.class}${log.method}${log.timestamp}${log.originalUri}`}
                      splitView={() => splitView(log.id)}
                    />
                  </AnimatePresence>
                );
              case 'response':
                return (
                  <AnimatePresence>
                    <ResponseMotion
                      styleObj={styleObj}
                      response={log}
                      variants={{
                        initialHidden: () => ({
                          opacity: 0,
                          y: -50 * i,
                        }),
                        initialVisible: () => ({
                          opacity: 1,
                          y: 0,
                          transition: {
                            delay: i * 0.025,
                          },
                        }),
                        loadedHidden: () => {
                          const timeDiff = Date.parse(new Date().toISOString())
                          - Date.parse(
                            new Date(
                              `${log.arrivedAt.replace(' - ', 'T')}Z`
                            ).toISOString()
                          );
                          if (Math.abs(timeDiff) < TIMEDIFF_THRESHOLD) {
                            return {
                              opacity: 0,
                            };
                          }
                          return {
                            opacity: 1,
                          };
                        },
                        loadedVisible: () => {
                          const timeDiff = Date.parse(new Date().toISOString())
                          - Date.parse(
                            new Date(
                              `${log.arrivedAt.replace(' - ', 'T')}Z`
                            ).toISOString()
                          );
                          if (Math.abs(timeDiff) < TIMEDIFF_THRESHOLD) {
                            return {
                              opacity: 1,
                              transition: {
                                delay: Math.abs(i - logs.length) * 0.025,
                              },
                            };
                          }
                          return { opacity: 1 };
                        },
                      }}
                      initial={
                      hasRenderedRef.current ? 'loadedHidden' : 'initialHidden'
                    }
                      animate={
                      hasRenderedRef.current
                        ? 'loadedVisible'
                        : 'initialVisible'
                    }
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
      )}
    </div>
  );
}
