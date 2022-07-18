import React from 'react';
import { render, WithRoute } from 'lib/testHelpers';
import {
  clusterConnectConnectorConfigPath,
  clusterConnectConnectorEditPath,
} from 'lib/paths';
import Edit from 'components/Connect/Edit/Edit';
import { connector } from 'lib/fixtures/kafkaConnect';
import { waitFor } from '@testing-library/dom';
import { act, fireEvent, screen } from '@testing-library/react';
import {
  useConnectorConfig,
  useUpdateConnectorConfig,
} from 'lib/hooks/api/kafkaConnect';

jest.mock('components/common/Editor/Editor', () => 'mock-Editor');

const mockHistoryPush = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockHistoryPush,
}));
jest.mock('lib/hooks/api/kafkaConnect', () => ({
  useConnectorConfig: jest.fn(),
  useUpdateConnectorConfig: jest.fn(),
}));

const [clusterName, connectName, connectorName] = [
  'my-cluster',
  'my-connect',
  'my-connector',
];

describe('Edit', () => {
  const pathname = clusterConnectConnectorEditPath();
  const renderComponent = () =>
    render(
      <WithRoute path={pathname}>
        <Edit />
      </WithRoute>,
      {
        initialEntries: [
          clusterConnectConnectorEditPath(
            clusterName,
            connectName,
            connectorName
          ),
        ],
      }
    );

  beforeEach(() => {
    (useConnectorConfig as jest.Mock).mockImplementation(() => ({
      data: connector.config,
    }));
  });

  it('calls updateConfig and redirects to connector config view on successful submit', async () => {
    const updateConfig = jest.fn(() => {
      return Promise.resolve(connector);
    });
    (useUpdateConnectorConfig as jest.Mock).mockImplementation(() => ({
      mutateAsync: updateConfig,
    }));

    renderComponent();
    fireEvent.submit(screen.getByRole('form'));
    await waitFor(() => expect(updateConfig).toHaveBeenCalledTimes(1));

    await waitFor(() => expect(mockHistoryPush).toHaveBeenCalledTimes(1));
    expect(mockHistoryPush).toHaveBeenCalledWith(
      clusterConnectConnectorConfigPath(clusterName, connectName, connectorName)
    );
  });

  it('does not redirect to connector config view on unsuccessful submit', async () => {
    const updateConfig = jest.fn(() => {
      return Promise.resolve();
    });
    (useUpdateConnectorConfig as jest.Mock).mockImplementation(() => ({
      mutateAsync: updateConfig,
    }));
    renderComponent();
    await act(() => {
      fireEvent.submit(screen.getByRole('form'));
    });
    expect(mockHistoryPush).not.toHaveBeenCalled();
  });
});
