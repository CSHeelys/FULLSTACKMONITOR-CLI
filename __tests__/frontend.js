/* eslint-disable */
import React from 'react';
import { configure, mount } from 'enzyme';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';

import LogTable from '../src/components/LogTable/LogTable.js';
import LogDrawer from '../src/components/LogDrawer/LogDrawer.js';

configure({ adapter: new Adapter() });

describe('React unit tests', () => {
  describe('Test logs table', () => {
    const props = {
      logTypes: {
        client: true,
        server: true,
        request: true,
        response: true,
      },
      activeLog: {},
      logs: [
        {
          id: 1,
          class: 'server',
          type: 'log',
          timestamp: '2021-04-09 - 03:45:56.024',
          log: 'Server listening on port: 3000',
          stack: [
            'at Server.<anonymous> (/Users/paulochoi/Documents/Codesmith/iteration-project/Example-Project/server/server.js:76:11)',
          ],
        },
        {
          id: 2,
          class: 'request',
          timestamp: '2021-04-09 - 03:46:01.668',
          fromip: '::ffff:127.0.0.1',
          method: 'get',
          originaluri: '/api/',
          uri: '/',
          requestData: [],
        },
      ],
      showMoreLogInfo: false,
      splitView: () => {},
    };
    const { logTypes, activeLog, showMoreLogInfo, splitView, logs } = props;

    let wrapper;

    beforeAll(() => {
      wrapper = mount(
        <LogTable
          logTypes={logTypes}
          activeLog={activeLog}
          logs={logs.filter((log) => logTypes[log.class])}
          showMoreLogInfo={showMoreLogInfo}
          splitView={splitView}
        />
      );
    });

    it('Rows should populate with logs data', () => {
      expect(wrapper.find('tbody tr td').at(0).text()).toBe(logs[0].timestamp);
      expect(wrapper.find('tbody tr td').at(1).text()).toBe(
        logs[0].class.charAt(0).toUpperCase() + logs[0].class.slice(1)
      );
      expect(wrapper.find('tbody tr td').at(2).text()).toBe(
        logs[0].type.charAt(0).toUpperCase() + logs[0].type.slice(1)
      );
      expect(wrapper.find('tbody tr td').at(3).text()).toBe(
        `\"${logs[0].log}\"`
      );
    });

    it('Rows should populate with requests data', () => {
      const secondRow = wrapper.find('tbody tr').at(1);
      expect(secondRow.find('td').at(0).text()).toBe(logs[1].timestamp);
      expect(secondRow.find('td').at(1).text()).toBe(
        ' ' +
          logs[1].method +
          ' ' +
          logs[1].class.charAt(0).toUpperCase() +
          logs[1].class.slice(1)
      );
      expect(secondRow.find('td').at(2).text()).toBe('');
      expect(secondRow.find('td').at(3).text()).toBe('[]');
    });
  });

  describe('Test logs drawer', () => {
    const props = {
      showMoreLogInfo: true,
      activeLog: {
        id: 1,
        class: 'server',
        type: 'log',
        timestamp: '2021-04-09 - 03:45:56.024',
        log: 'Server listening on port: 3000',
        stack: [
          'at Server.<anonymous> (/Users/paulochoi/Documents/Codesmith/iteration-project/Example-Project/server/server.js:76:11)',
        ],
      },
    };
    let wrapper;
    const { showMoreLogInfo, activeLog } = props;
    beforeAll(() => {
      wrapper = mount(
        <LogDrawer showMoreLogInfo={showMoreLogInfo} activeLog={activeLog} />
      );
    });

    it('Should display logs in detail', () => {
      const text = wrapper.find('.chakra-text');
      expect(text.at(1).text()).toBe(activeLog.timestamp);
      expect(text.at(3).text()).toBe(
        activeLog.class.charAt(0).toUpperCase() + activeLog.class.slice(1)
      );
      expect(text.at(5).text()).toBe(
        activeLog.type.charAt(0).toUpperCase() + activeLog.type.slice(1)
      );
      expect(text.at(7).text()).toBe(`\"${activeLog.log}\"`);
      expect(wrapper.find('ul li').text()).toBe(activeLog.stack[0])
    });
  });

});