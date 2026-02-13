import { useMemo, useRef, useState } from "react";

const INITIAL_MESSAGES = [
  {
    role: "assistant",
    content:
      "I am your AI coder assistant. Ask for code changes, bug fixes, or architecture help.",
  },
];

export default function AICoderChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const listRef = useRef(null);

  const apiBaseUrl =
    (import.meta.env.VITE_API_URL || "http://localhost:5000").replace(/\/$/, "");

  const canSend = input.trim().length > 0 && !isSending;
  const historyForApi = useMemo(
    () => messages.map((message) => ({ role: message.role, content: message.content })),
    [messages]
  );

  async function sendMessage() {
    const prompt = input.trim();
    if (!prompt || isSending) return;

    const userMessage = { role: "user", content: prompt };
    setInput("");
    setMessages((prev) => [...prev, userMessage]);
    setIsSending(true);

    try {
      const response = await fetch(`${apiBaseUrl}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "meta-llama/llama-3.2-3b-instruct:free",
          messages: [
            {
              role: "system",
              content:
                "You are an AI coding assistant. Respond with concise, practical engineering guidance.",
            },
            ...historyForApi,
            userMessage,
          ],
        }),
      });

      const payload = await response.json();
      const content = extractAssistantText(payload);
      setMessages((prev) => [...prev, { role: "assistant", content }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "I could not reach the API right now. Check VITE_API_URL and backend health, then retry.",
        },
      ]);
    } finally {
      setIsSending(false);
      queueMicrotask(() => {
        listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
      });
    }
  }

  function handleKeyDown(event) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      void sendMessage();
    }
  }

  return (
    <div style={wrapStyle}>
      {isOpen ? (
        <div style={panelStyle}>
          <div style={headerStyle}>
            <div>
              <strong>AI Coder Chatbot</strong>
              <div style={metaStyle}>Connected to {apiBaseUrl}</div>
            </div>
            <button style={iconBtnStyle} onClick={() => setIsOpen(false)}>
              Hide
            </button>
          </div>

          <div ref={listRef} style={messagesStyle}>
            {messages.map((message, index) => (
              <div
                key={`${message.role}-${index}`}
                style={{
                  ...bubbleStyle,
                  marginLeft: message.role === "user" ? "auto" : 0,
                  background:
                    message.role === "user"
                      ? "rgba(255,107,43,0.25)"
                      : "rgba(255,255,255,0.07)",
                }}
              >
                <div style={{ opacity: 0.65, fontSize: 11, marginBottom: 3 }}>
                  {message.role === "user" ? "You" : "AI Coder"}
                </div>
                <div style={{ whiteSpace: "pre-wrap" }}>{message.content}</div>
              </div>
            ))}
            {isSending ? <div style={metaStyle}>Thinking...</div> : null}
          </div>

          <div style={composerStyle}>
            <textarea
              value={input}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask for code help..."
              style={inputStyle}
            />
            <button
              onClick={() => void sendMessage()}
              disabled={!canSend}
              style={{ ...sendBtnStyle, opacity: canSend ? 1 : 0.6 }}
            >
              Send
            </button>
          </div>
        </div>
      ) : (
        <button style={launcherStyle} onClick={() => setIsOpen(true)}>
          AI Coder Chat
        </button>
      )}
    </div>
  );
}

function extractAssistantText(payload) {
  const content = payload?.choices?.[0]?.message?.content;
  if (typeof content === "string" && content.trim()) return content;
  return "I received an unexpected response format. Please try again.";
}

const wrapStyle = {
  position: "fixed",
  right: 18,
  bottom: 18,
  zIndex: 40,
};

const panelStyle = {
  width: 360,
  height: 520,
  border: "1px solid rgba(255,255,255,0.12)",
  borderRadius: 12,
  overflow: "hidden",
  background: "rgba(10,11,18,0.96)",
  boxShadow: "0 20px 40px rgba(0,0,0,0.4)",
  display: "grid",
  gridTemplateRows: "auto 1fr auto",
};

const headerStyle = {
  padding: "10px 12px",
  borderBottom: "1px solid rgba(255,255,255,0.08)",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
};

const messagesStyle = {
  padding: 10,
  overflowY: "auto",
  display: "flex",
  flexDirection: "column",
  gap: 8,
};

const bubbleStyle = {
  maxWidth: "90%",
  borderRadius: 10,
  padding: "8px 10px",
  border: "1px solid rgba(255,255,255,0.09)",
  fontSize: 13,
  lineHeight: 1.45,
};

const composerStyle = {
  borderTop: "1px solid rgba(255,255,255,0.08)",
  padding: 10,
  display: "grid",
  gridTemplateColumns: "1fr auto",
  gap: 8,
};

const inputStyle = {
  width: "100%",
  minHeight: 58,
  resize: "none",
  borderRadius: 8,
  border: "1px solid rgba(255,255,255,0.14)",
  background: "rgba(255,255,255,0.04)",
  color: "#fff",
  padding: "8px 10px",
};

const sendBtnStyle = {
  padding: "8px 12px",
  borderRadius: 8,
  border: "1px solid rgba(255,130,61,0.8)",
  background: "rgba(255,107,43,0.22)",
  color: "#fff",
  fontWeight: 700,
  cursor: "pointer",
};

const launcherStyle = {
  padding: "11px 14px",
  borderRadius: 999,
  border: "1px solid rgba(255,130,61,0.8)",
  background: "rgba(255,107,43,0.22)",
  color: "#fff",
  fontWeight: 700,
  cursor: "pointer",
  boxShadow: "0 8px 20px rgba(0,0,0,0.3)",
};

const iconBtnStyle = {
  padding: "6px 10px",
  borderRadius: 7,
  border: "1px solid rgba(255,255,255,0.14)",
  background: "rgba(255,255,255,0.06)",
  color: "#fff",
  cursor: "pointer",
};

const metaStyle = { color: "rgba(255,255,255,0.62)", fontSize: 11 };
