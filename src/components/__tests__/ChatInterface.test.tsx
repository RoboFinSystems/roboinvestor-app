import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { ChatInterface, type Message } from '../ChatInterface'

// Mock scrollIntoView
Object.defineProperty(Element.prototype, 'scrollIntoView', {
  value: vi.fn(),
  writable: true,
})

// Mock timers
vi.useFakeTimers()

// Mock the core library
vi.mock('@/lib/core', () => ({
  ChatMessage: ({ message }: { message: any }) => (
    <div data-testid="chat-message">
      <span data-testid="message-user">{message.user}</span>
      <span data-testid="message-text">{message.text}</span>
    </div>
  ),
  ChatHeader: ({
    title,
    agentDescription,
  }: {
    title: string
    agentDescription: string
  }) => (
    <div data-testid="chat-header">
      <span data-testid="header-title">{title}</span>
      <span data-testid="header-description">{agentDescription}</span>
    </div>
  ),
  ChatInputArea: ({
    input,
    loading,
    forceDeepResearch,
    placeholder,
    onInputChange,
    onSendMessage,
    onToggleDeepResearch,
  }: any) => (
    <div data-testid="chat-input-area">
      <input
        data-testid="message-input"
        value={input}
        onChange={(e) => onInputChange({ target: { value: e.target.value } })}
        placeholder={placeholder}
        disabled={loading}
      />
      <button
        data-testid="send-button"
        onClick={onSendMessage}
        disabled={loading}
      >
        Send
      </button>
      <button
        data-testid="deep-research-toggle"
        onClick={() => onToggleDeepResearch(!forceDeepResearch)}
      >
        {forceDeepResearch ? 'Deep Research ON' : 'Deep Research OFF'}
      </button>
    </div>
  ),
  generateMessageId: () => 'test-message-id',
  ErrorType: {
    AUTHENTICATION: 'AUTHENTICATION',
    NOT_FOUND: 'NOT_FOUND',
    NETWORK: 'NETWORK',
    UNKNOWN: 'UNKNOWN',
  },
  categorizeError: () => 'UNKNOWN',
  getErrorMessage: () => 'Test error message',
  customTheme: {
    card: {},
    button: {},
    textarea: {},
  },
}))

// Mock the SDK - using centralized mock from src/__mocks__/@robosystems/client.js
vi.mock('@robosystems/client')

// Get mocked functions
const {
  // queryFinancialAgent: mockQueryFinancialAgent, // TODO: Implement new AI agent methods
  getTaskStatus: mockGetTaskStatus,
} = (await vi.importMock('@robosystems/client')) as {
  getTaskStatus: ReturnType<typeof vi.fn>
}

describe('ChatInterface', () => {
  let messages: Message[]
  let setMessages: ReturnType<typeof vi.fn>

  beforeEach(() => {
    messages = []
    setMessages = vi.fn()
    // mockQueryFinancialAgent.mockClear() // TODO: Implement new AI agent methods
    mockGetTaskStatus.mockClear()
    vi.clearAllTimers()
  })

  afterEach(() => {
    vi.runOnlyPendingTimers()
    vi.useRealTimers()
    vi.useFakeTimers()
  })

  it('renders correctly with default props', () => {
    render(<ChatInterface messages={messages} setMessages={setMessages} />)

    expect(screen.getByTestId('chat-header')).toBeInTheDocument()
    expect(screen.getByTestId('header-title')).toHaveTextContent(
      'RoboInvestor AI Chat'
    )
    expect(screen.getByTestId('header-description')).toHaveTextContent(
      'Investment Analysis Agent'
    )
    expect(screen.getByTestId('chat-input-area')).toBeInTheDocument()
  })

  it('renders custom title when provided', () => {
    render(
      <ChatInterface
        messages={messages}
        setMessages={setMessages}
        title="Custom Investment Chat"
      />
    )

    expect(screen.getByTestId('header-title')).toHaveTextContent(
      'Custom Investment Chat'
    )
  })

  it('hides header when showHeader is false', () => {
    render(
      <ChatInterface
        messages={messages}
        setMessages={setMessages}
        showHeader={false}
      />
    )

    expect(screen.queryByTestId('chat-header')).not.toBeInTheDocument()
  })

  it('displays welcome message when no messages', () => {
    render(<ChatInterface messages={messages} setMessages={setMessages} />)

    expect(screen.getByText('Welcome to RoboInvestor AI')).toBeInTheDocument()
    expect(
      screen.getByText(/I provide comprehensive investment research/)
    ).toBeInTheDocument()
  })

  it('renders existing messages', () => {
    const testMessages: Message[] = [
      { id: '1', text: 'Hello', user: 'You' },
      { id: '2', text: 'Hi there!', user: 'Agent' },
    ]

    render(<ChatInterface messages={testMessages} setMessages={setMessages} />)

    expect(screen.getAllByTestId('chat-message')).toHaveLength(2)
    expect(screen.getByText('Hello')).toBeInTheDocument()
    expect(screen.getByText('Hi there!')).toBeInTheDocument()
  })

  it('handles input changes', () => {
    render(<ChatInterface messages={messages} setMessages={setMessages} />)

    const input = screen.getByTestId('message-input')
    fireEvent.change(input, { target: { value: 'Test message' } })

    expect(input).toHaveValue('Test message')
  })

  it('toggles deep research mode', () => {
    render(<ChatInterface messages={messages} setMessages={setMessages} />)

    const toggle = screen.getByTestId('deep-research-toggle')
    expect(toggle).toHaveTextContent('Deep Research OFF')

    fireEvent.click(toggle)
    expect(toggle).toHaveTextContent('Deep Research ON')
  })

  it.skip('sends message with SEC database configuration - TODO: Re-enable when new AI agent is implemented', async () => {
    const mockResponse = {
      data: {
        response: 'Test response',
        is_partial: false,
        task_id: null,
      },
    }
    // mockQueryFinancialAgent.mockResolvedValue(mockResponse) // TODO: Re-enable when new AI agent is implemented

    render(<ChatInterface messages={messages} setMessages={setMessages} />)

    const input = screen.getByTestId('message-input')
    const sendButton = screen.getByTestId('send-button')

    fireEvent.change(input, { target: { value: 'Test query' } })
    fireEvent.click(sendButton)

    /*
    await waitFor(() => {
      expect(mockQueryFinancialAgent).toHaveBeenCalledWith({
        path: { graph_id: 'sec' },
        body: {
          message: 'Test query',
          history: [],
          context: {
            analysis_focus: 'investment_research',
            data_source: 'sec_database',
            include_schema: false,
            encourage_deep_analysis: true,
            operation_type: 'financial_analysis',
            tier: 'standard',
          },
          force_extended_analysis: false,
        },
      })
    })
    */ // TODO: Re-enable when new AI agent is implemented

    expect(setMessages).toHaveBeenCalled()
  })

  it.skip('sends message with deep research enabled - TODO: Re-enable when new AI agent is implemented', async () => {
    const mockResponse = {
      data: {
        response: 'Deep research response',
        is_partial: true,
        task_id: 'task-123',
      },
    }
    // mockQueryFinancialAgent.mockResolvedValue(mockResponse) // TODO: Re-enable when new AI agent is implemented

    render(<ChatInterface messages={messages} setMessages={setMessages} />)

    // Enable deep research
    const toggle = screen.getByTestId('deep-research-toggle')
    fireEvent.click(toggle)

    const input = screen.getByTestId('message-input')
    const sendButton = screen.getByTestId('send-button')

    fireEvent.change(input, { target: { value: 'Complex analysis query' } })
    fireEvent.click(sendButton)

    /*
    await waitFor(() => {
      expect(mockQueryFinancialAgent).toHaveBeenCalledWith({
        path: { graph_id: 'sec' },
        body: {
          message: 'Complex analysis query',
          history: [],
          context: {
            analysis_focus: 'investment_research',
            data_source: 'sec_database',
            include_schema: false,
            encourage_deep_analysis: true,
            operation_type: 'financial_analysis',
            tier: 'standard',
          },
          force_extended_analysis: true,
        },
      })
    })
    */ // TODO: Re-enable when new AI agent is implemented
  })

  it.skip('handles message sending errors - TODO: Re-enable when new AI agent is implemented', async () => {
    // Suppress console.error for this test
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

    // mockQueryFinancialAgent.mockRejectedValue(new Error('Network error')) // TODO: Re-enable when new AI agent is implemented

    render(<ChatInterface messages={messages} setMessages={setMessages} />)

    const input = screen.getByTestId('message-input')
    const sendButton = screen.getByTestId('send-button')

    await act(async () => {
      fireEvent.change(input, { target: { value: 'Test query' } })
      fireEvent.click(sendButton)

      // Run any pending timers (debounced sendMessage)
      vi.runOnlyPendingTimers()
    })

    await waitFor(() => {
      expect(setMessages).toHaveBeenCalledWith(expect.any(Function))
    })

    // Restore console.error
    consoleSpy.mockRestore()
  })

  it.skip('creates partial message for task responses - TODO: Re-enable when new AI agent is implemented', async () => {
    const mockResponse = {
      data: {
        response: 'Initial response',
        is_partial: true,
        task_id: 'task-123',
      },
    }

    // mockQueryFinancialAgent.mockResolvedValue(mockResponse) // TODO: Re-enable when new AI agent is implemented

    render(<ChatInterface messages={messages} setMessages={setMessages} />)

    const input = screen.getByTestId('message-input')
    const sendButton = screen.getByTestId('send-button')

    fireEvent.change(input, { target: { value: 'Test query' } })
    fireEvent.click(sendButton)

    /*
    await waitFor(() => {
      expect(mockQueryFinancialAgent).toHaveBeenCalled()
    })
    */ // TODO: Re-enable when new AI agent is implemented

    // Verify that setMessages was called to add both user and agent messages
    expect(setMessages).toHaveBeenCalledTimes(2)
  })

  it('applies custom className', () => {
    const { container } = render(
      <ChatInterface
        messages={messages}
        setMessages={setMessages}
        className="bg-blue-50"
      />
    )

    expect(container.firstChild).toHaveClass('bg-blue-50')
  })
})
