import {
  ChatHeader,
  ChatInputArea,
  ChatMessage,
  ErrorType,
  categorizeError,
  customTheme,
  generateMessageId,
  getErrorMessage,
  type AgentType,
  type Message,
} from '@/lib/core'
// import { queryFinancialAgent } from '@robosystems/client' // TODO: Implement new AI agent
import { Card } from 'flowbite-react'
import React, { useEffect, useRef, useState } from 'react'
import { FaRobot } from 'react-icons/fa'

// Re-export types from core lib for external consumption
export type { AgentType, Message } from '@/lib/core'

// RoboInvestor-specific types

export interface ChatInterfaceProps {
  messages: Message[]
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>
  className?: string
  title?: string
  showHeader?: boolean
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({
  messages,
  setMessages,
  className = '',
  title,
  showHeader = true,
}) => {
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [dots, setDots] = useState('')
  const [agentType, setAgentType] = useState<AgentType>('default')
  const [forceDeepResearch, setForceDeepResearch] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const ariaLiveRef = useRef<HTMLDivElement>(null)
  const sendMessageTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Cleanup on unmount
  useEffect(() => {
    const sendMessageTimeout = sendMessageTimeoutRef.current
    return () => {
      // Clear debounce timeout
      if (sendMessageTimeout) {
        clearTimeout(sendMessageTimeout)
      }
    }
  }, [])

  useEffect(() => {
    if (loading) {
      const interval = setInterval(() => {
        setDots((d) => (d.length >= 3 ? '' : d + '.'))
      }, 500)
      return () => clearInterval(interval)
    }
    setDots('')
  }, [loading])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()

    // Announce new messages to screen readers
    if (messages.length > 0 && ariaLiveRef.current) {
      const lastMessage = messages[messages.length - 1]
      const announcement = `${lastMessage.user}: ${lastMessage.text.substring(0, 100)}${lastMessage.text.length > 100 ? '...' : ''}`
      ariaLiveRef.current.textContent = announcement

      // Clear after announcement to avoid repetition
      setTimeout(() => {
        if (ariaLiveRef.current) {
          ariaLiveRef.current.textContent = ''
        }
      }, 1000)
    }
  }, [messages])

  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current
    if (textarea) {
      textarea.style.height = 'auto'
      textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`
    }
  }

  useEffect(() => {
    adjustTextareaHeight()
  }, [input])

  useEffect(() => {
    if (!loading && textareaRef.current) {
      textareaRef.current.focus()
    }
  }, [loading])

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value)
  }

  const sendMessage = async () => {
    const trimmedInput = input.trim()
    if (trimmedInput === '') return

    const newMessage: Message = {
      id: generateMessageId(),
      text: trimmedInput,
      user: 'You',
    }
    setMessages((prev) => [...prev, newMessage])
    setInput('')

    try {
      setLoading(true)

      // Format conversation history for the agent
      const history = messages.map((msg) => ({
        role: msg.user === 'You' ? 'user' : 'assistant',
        content: msg.text,
      }))

      // Use SEC database for investment research (graph_id = "sec")
      const agentRequest = {
        path: { graph_id: 'sec' },
        body: {
          message: trimmedInput,
          history,
          context: {
            analysis_focus: 'investment_research',
            data_source: 'sec_database',
            include_schema: false,
            encourage_deep_analysis: true,
            operation_type: 'financial_analysis',
            tier: 'standard',
          },
          force_extended_analysis: forceDeepResearch,
        },
      }

      // TODO: Implement the new AI agent integration for investment analysis
      // The AI agent was substantially rewritten and needs proper frontend implementation

      const agentMessageId = generateMessageId()
      const agentMessage: Message = {
        id: agentMessageId,
        text: "I'm sorry, the AI investment research agent is currently being updated with new capabilities. Please check back soon for enhanced SEC-based investment analysis features.",
        user: 'Agent',
        isPartial: false,
      }

      setMessages((prev) => [...prev, agentMessage])
    } catch (error) {
      console.error('Error querying investment agent:', error)

      // Categorize and get appropriate error message
      const errorType =
        error instanceof Error ? categorizeError(error) : ErrorType.UNKNOWN
      const errorText = getErrorMessage(errorType)

      const errorMessage: Message = {
        id: generateMessageId(),
        text: errorText,
        user: 'Agent',
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setLoading(false)
    }
  }

  // Debounced send message to prevent rapid submissions
  const debouncedSendMessage = () => {
    if (sendMessageTimeoutRef.current) {
      clearTimeout(sendMessageTimeoutRef.current)
    }

    sendMessageTimeoutRef.current = setTimeout(() => {
      sendMessage()
    }, 300) // 300ms debounce
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      debouncedSendMessage()
    }
  }

  return (
    <div className={`flex h-full flex-col ${className}`}>
      {/* Screen reader announcements */}
      <div
        ref={ariaLiveRef}
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      />
      {showHeader && (
        <ChatHeader
          agentType={agentType}
          setAgentType={setAgentType}
          loading={loading}
          title={title || 'RoboInvestor AI Chat'}
          activeTasks={0}
          agentDescription="Investment Analysis Agent"
        />
      )}
      <div className="flex-1 overflow-hidden">
        <div className="flex h-full flex-col">
          <div className="flex-1 overflow-y-auto px-4 pt-4">
            <div className="space-y-4">
              {messages.length === 0 && (
                <Card theme={customTheme.card} className="text-center">
                  <FaRobot className="text-secondary-500 dark:text-secondary-400 mx-auto mb-3 h-12 w-12" />
                  <h4 className="font-heading mb-2 text-lg font-medium text-gray-900 dark:text-gray-100">
                    Welcome to RoboInvestor AI
                  </h4>
                  <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
                    I provide comprehensive investment research using SEC
                    filings data. For complex analysis, I'll automatically
                    perform deep research with multiple data sources and provide
                    detailed insights.
                  </p>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    <div className="mb-2 font-medium">
                      Try complex queries like:
                    </div>
                    <div className="space-y-1">
                      <div>
                        "Analyze Apple's financial trends over the past 3 years"
                      </div>
                      <div>
                        "Compare Tesla vs Ford's recent performance and risks"
                      </div>
                      <div>
                        "Research Microsoft's revenue growth and profitability
                        trends"
                      </div>
                      <div>
                        "Investigate Netflix's competitive position and
                        financial health"
                      </div>
                    </div>
                    <div className="mt-3 text-xs">
                      💡 Complex queries automatically trigger deep research
                      mode
                    </div>
                  </div>
                </Card>
              )}
              {messages.map((message) => (
                <ChatMessage key={message.id} message={message} />
              ))}
            </div>
            <div ref={messagesEndRef} />
          </div>
          <ChatInputArea
            input={input}
            loading={loading}
            dots={dots}
            forceDeepResearch={forceDeepResearch}
            textareaRef={textareaRef}
            placeholder="Ask about trends, comparisons, detailed analysis, or comprehensive research..."
            deepResearchTooltip="Deep Research Mode: Forces comprehensive analysis with up to 12 tool calls for thorough investment research"
            onInputChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onSendMessage={debouncedSendMessage}
            onToggleDeepResearch={setForceDeepResearch}
          />
        </div>
      </div>
    </div>
  )
}
