// Mock implementation of @robosystems/client/clients for Vitest tests
import { vi } from 'vitest'

export const clients = {
  query: {
    query: vi.fn(),
    streamQuery: vi.fn(),
    close: vi.fn(),
  },
  agent: {
    query: vi.fn(),
    analyzeFinancials: vi.fn(),
    close: vi.fn(),
  },
  operations: {
    monitorOperation: vi.fn(),
    closeAll: vi.fn(),
  },
  ledger: {
    close: vi.fn(),
  },
  investor: {
    close: vi.fn(),
  },
  reports: {
    close: vi.fn(),
  },
  monitorOperation: vi.fn(),
  createSSEClient: vi.fn(),
  close: vi.fn(),
}

export const OperationClient = vi.fn().mockImplementation(() => ({
  monitorOperation: vi.fn(),
  closeAll: vi.fn(),
}))

export const QueryClient = vi.fn().mockImplementation(() => ({
  query: vi.fn(),
  streamQuery: vi.fn(),
  close: vi.fn(),
}))

export const SSEClient = vi.fn().mockImplementation(() => ({
  close: vi.fn(),
}))

export const AgentClient = vi.fn().mockImplementation(() => ({
  query: vi.fn(),
  analyzeFinancials: vi.fn(),
  close: vi.fn(),
}))

export const LedgerClient = vi.fn().mockImplementation(() => ({
  close: vi.fn(),
}))

export const InvestorClient = vi.fn().mockImplementation(() => ({
  close: vi.fn(),
}))

export const RoboSystemsClients = vi.fn().mockImplementation(() => ({
  query: QueryClient(),
  agent: AgentClient(),
  operations: OperationClient(),
  ledger: LedgerClient(),
  investor: InvestorClient(),
  monitorOperation: vi.fn(),
  createSSEClient: vi.fn(),
  close: vi.fn(),
}))

export const QueuedQueryError = class QueuedQueryError extends Error {}

export const EventType = {
  CONNECTED: 'connected',
  PROGRESS: 'progress',
  COMPLETE: 'complete',
  ERROR: 'error',
}

export const executeQuery = vi.fn()
export const monitorOperation = vi.fn()
export const streamQuery = vi.fn()
export const agentQuery = vi.fn()
export const analyzeFinancials = vi.fn()

export const useSDKClients = vi.fn().mockReturnValue({
  clients: null,
  isLoading: false,
  error: null,
})

export const useStreamingQuery = vi.fn().mockReturnValue({
  isStreaming: false,
  results: [],
  error: null,
  status: 'idle',
  startQuery: vi.fn(),
  cancelQuery: vi.fn(),
  reset: vi.fn(),
})

export const useOperation = vi.fn().mockReturnValue({
  progress: null,
  isMonitoring: false,
  error: null,
  startMonitoring: vi.fn(),
  stopMonitoring: vi.fn(),
})

export const useMultipleOperations = vi.fn().mockReturnValue({
  operations: {},
  startMonitoring: vi.fn(),
  stopMonitoring: vi.fn(),
  stopAll: vi.fn(),
})

export const useQuery = vi.fn().mockReturnValue({
  data: null,
  isLoading: false,
  error: null,
  execute: vi.fn(),
})

export const extractTokenFromSDKClient = vi.fn().mockReturnValue(null)
export const getSDKClientConfig = vi.fn().mockReturnValue({})
export const setSDKClientConfig = vi.fn()
