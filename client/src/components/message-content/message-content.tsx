import { ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";
import { getAvatarName } from "@/utils";

import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

interface Message {
  id: number;
  user: string;
  text: string;
  timestamp: string;
  isOwn: boolean;
}

export const MessageContent = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 20,
      user: "User 2",
      text: "This is message #20. Hello everyone!",
      timestamp: "5:11:27 AM",
      isOwn: true,
    },
    {
      id: 19,
      user: "User 6",
      text: "This is message #19. Hello everyone!",
      timestamp: "5:10:27 AM",
      isOwn: false,
    },
    {
      id: 18,
      user: "User 5",
      text: "This is message #18. How are you doing today?",
      timestamp: "5:09:27 AM",
      isOwn: false,
    },
    {
      id: 17,
      user: "User 10",
      text: "This is message #17. How are you doing today?",
      timestamp: "5:08:27 AM",
      isOwn: false,
    },
    {
      id: 16,
      user: "User 2",
      text: "This is message #16. Hello everyone!",
      timestamp: "5:07:27 AM",
      isOwn: true,
    },
    {
      id: 15,
      user: "User 5",
      text: "This is message #15. Hello everyone!",
      timestamp: "5:06:27 AM",
      isOwn: false,
    },
    {
      id: 14,
      user: "User 9",
      text: "This is message #14. Hello everyone!",
      timestamp: "5:05:27 AM",
      isOwn: true,
    },
    {
      id: 13,
      user: "User 10",
      text: "This is message #13. Hello everyone!",
      timestamp: "5:04:27 AM",
      isOwn: false,
    },
    {
      id: 12,
      user: "User 7",
      text: "This is message #12. Hello everyone!",
      timestamp: "5:03:27 AM",
      isOwn: true,
    },
    {
      id: 11,
      user: "User 6",
      text: "This is message #11. How are you doing today?",
      timestamp: "5:02:27 AM",
      isOwn: false,
    },
    {
      id: 10,
      user: "User 7",
      text: "This is message #10. Hello everyone!",
      timestamp: "5:01:27 AM",
      isOwn: false,
    },
    {
      id: 9,
      user: "User 7",
      text: "This is message #9. Hello everyone!",
      timestamp: "5:00:27 AM",
      isOwn: false,
    },
    {
      id: 8,
      user: "User 10",
      text: "This is message #8. How are you doing today?",
      timestamp: "4:59:27 AM",
      isOwn: false,
    },
    {
      id: 7,
      user: "User 8",
      text: "This is message #7. How are you doing today?",
      timestamp: "4:58:27 AM",
      isOwn: false,
    },
    {
      id: 6,
      user: "User 5",
      text: "This is message #6. How are you doing today?",
      timestamp: "4:57:27 AM",
      isOwn: false,
    },
    {
      id: 5,
      user: "User 7",
      text: "This is message #5. Hello everyone!",
      timestamp: "4:56:27 AM",
      isOwn: false,
    },
    {
      id: 4,
      user: "User 4",
      text: "This is message #4. How are you doing today?",
      timestamp: "4:55:27 AM",
      isOwn: false,
    },
    {
      id: 3,
      user: "User 2",
      text: "This is message #3. Hello everyone!",
      timestamp: "4:54:27 AM",
      isOwn: false,
    },
    {
      id: 2,
      user: "User 10",
      text: "This is message #2. How are you doing today?",
      timestamp: "4:53:27 AM",
      isOwn: false,
    },
    {
      id: 1,
      user: "User 8",
      text: "This is message #1. Hello everyone!",
      timestamp: "4:52:27 AM",
      isOwn: false,
    },
  ]);
  const [newMessage, setNewMessage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [page, setPage] = useState<number>(1);
  const [showScrollButton, setShowScrollButton] = useState<boolean>(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const isLoadingRef = useRef<boolean>(false);

  const generateMessages = (pageNum: number, count: number = 20): Message[] => {
    const messages: Message[] = [];
    const startId = (pageNum - 1) * count + 1;

    for (let i = 0; i < count; i++) {
      const messageId = startId + i;
      messages.push({
        id: messageId,
        user: `User ${Math.floor(Math.random() * 10) + 1}`,
        text: `This is message #${messageId}. ${
          Math.random() > 0.5 ? "Hello everyone!" : "How are you doing today?"
        }`,
        timestamp: new Date(
          Date.now() - (1000 - messageId) * 60000
        ).toLocaleTimeString(),
        isOwn: Math.random() > 0.7,
      });
    }

    return messages.reverse(); // Reverse to show newest first
  };

  // Load initial messages
  useEffect(() => {
    const initialMessages = generateMessages(1);
    setMessages(initialMessages);

    console.log("Initial messages loaded:", initialMessages);

    const el = messagesContainerRef.current;
    if (el) {
      el.scrollTop = el.scrollHeight; // Scroll to bottom on initial load
    }

    // Auto scroll to bottom on initial load
    // setTimeout(() => {
    //   scrollToBottom();
    // }, 100);
  }, []);

  // Load more messages (pagination)
  const loadMoreMessages = async (): Promise<void> => {
    if (isLoadingRef.current || !hasMore) return;

    isLoadingRef.current = true;
    setLoading(true);

    const container = messagesContainerRef.current;
    if (!container) return;

    const previousScrollHeight = container.scrollHeight;

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const newPage = page + 1;
    const newMessages = generateMessages(newPage);

    if (newMessages.length === 0 || newPage > 10) {
      setHasMore(false);
    } else {
      setMessages((prev) => [...newMessages, ...prev]);
      setPage(newPage);

      // Maintain scroll position after loading new messages
      setTimeout(() => {
        const newScrollHeight = container.scrollHeight;
        const scrollDiff = newScrollHeight - previousScrollHeight;
        container.scrollTop = scrollDiff;
      }, 0);
    }

    setLoading(false);
    isLoadingRef.current = false;
  };

  // Handle scroll events
  const handleScroll = (): void => {
    const container = messagesContainerRef.current;
    if (!container) return;

    const { scrollTop, scrollHeight, clientHeight } = container;
    const isAtBottom = scrollHeight - scrollTop === clientHeight;

    // Show scroll to bottom button
    setShowScrollButton(
      !isAtBottom && scrollTop < scrollHeight - clientHeight - 100
    );

    // Load more messages when scrolled near top (within 200px)
    if (scrollTop <= 200 && hasMore && !loading) {
      loadMoreMessages();
    }
  };

  // Scroll to bottom
  const scrollToBottom = (): void => {
    messagesEndRef.current?.scrollIntoView();
  };

  return (
    <>
      {/* Messages Container */}
      <div
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto p-4 space-y-3 relative"
        // onScroll={handleScroll}
      >
        {/* Loading indicator at top */}
        {loading && (
          <div className="flex justify-center py-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
          </div>
        )}

        {/* End of messages indicator */}
        {!hasMore && (
          <div className="text-center py-4 text-gray-500 text-sm">
            <div className="inline-flex items-center space-x-2">
              <div className="w-16 h-px bg-gray-300"></div>
              <span>Beginning of conversation</span>
              <div className="w-16 h-px bg-gray-300"></div>
            </div>
          </div>
        )}

        {/* Messages */}
        {messages.map((message) => (
          <div
            key={message.id}
            className={cn(
              "flex gap-2 items-end",
              message.isOwn ? "justify-end" : "justify-start"
            )}
          >
            <Avatar
              className={cn(
                "size-[35px]",
                message.isOwn ? "order-2" : "order-1"
              )}
            >
              <AvatarImage src="" />
              <AvatarFallback
                className="text-white"
                style={{ backgroundColor: "#4A90E2" }}
              >
                {getAvatarName("Non")}
              </AvatarFallback>
            </Avatar>
            <div
              className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                message.isOwn
                  ? "bg-blue-500 text-white order-1"
                  : "bg-[#F5F7FB] text-gray-800 order-2"
              }`}
            >
              <p className="text-base">{message.text}</p>
              <p
                className={cn(
                  "text-xs mt-1",
                  message.isOwn ? "text-blue-100" : "text-right text-gray-500"
                )}
              >
                {message.timestamp}
              </p>
            </div>
          </div>
        ))}

        {/* Scroll anchor */}
        <div ref={messagesEndRef} />
      </div>
      {/* Scroll to bottom button */}
      {showScrollButton && (
        <button
          onClick={scrollToBottom}
          className="fixed bottom-20 right-6 bg-blue-500 text-white p-3 rounded-full shadow-lg hover:bg-blue-600 transition-colors"
        >
          <ChevronDown className="w-5 h-5" />
        </button>
      )}
    </>
  );
};
