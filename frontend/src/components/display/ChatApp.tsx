import { atom, useAtom } from "jotai";
import { useEffect, useRef } from "react";
import { Send, Smile, MoreVertical, Sticker } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";
import { disAPI } from "@/lib/utils";

// helps to manage both global and local state management .
// whereas the usestate is used to manage only local state and for globally we have to use useContext.

const messagesAtom = atom<Message[]>([]);
const inputAtom = atom("");
const showEmojiPickerAtom = atom(false);
const showStickerPickerAtom = atom(false);

interface Message {
  text?: string;
  sticker?: string;
  sender: "user" | "bot";
}

export default function ChatApp() {
  const [messages, setMessages] = useAtom(messagesAtom);
  const [input, setInput] = useAtom(inputAtom);
  const [showEmojiPicker, setShowEmojiPicker] = useAtom(showEmojiPickerAtom);
  const [showStickerPicker, setShowStickerPicker] = useAtom(showStickerPickerAtom);
  const chatRef = useRef<HTMLDivElement>(null);

  const stickers = [
    "/sticker4.jpeg",
    "/sticker2.jpeg",
    "/sticker1.avif",
    "/sticker5.jpeg",
    "/sticker1.jpeg",
    "/sticker3.jpg",
  ];

  useEffect(() => {
    chatRef.current?.scrollIntoView({ behavior:"smooth" });
  }, [messages])
  
  const sendMessage = async () => {
    if (!input) return;
    const userMessage: Message = { text: input, sender: "user" };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    try {
      const res = await disAPI(
        "send-message",
        "POST",
        JSON.stringify({ text: input })
      );
      const botMessage: Message = { text: res.response, sender: "bot" };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Error sending message:", error);
    }

    setShowEmojiPicker(false);
  };

  const sendSticker = async (stickerUrl: string) => {
    const userMessage: Message = { sticker: stickerUrl, sender: "user" };
    setMessages((prev) => [...prev, userMessage]);
    setShowStickerPicker(false);

    try {
      const res = await disAPI(
        "send-message",
        "POST",
        JSON.stringify({ sticker: stickerUrl })
      );
      const botMessage: Message = { sticker: res.sticker, sender: "bot" };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Error sending sticker:", error);
    }
  };

  const handleEmojiSelect = (emoji: { native:string }) => {
    setInput((prevInput) => prevInput + emoji.native);
  };

  const toggleEmojiPicker = () => {
    setShowEmojiPicker((prev) => !prev);
  };

  return (
    <div className="bg-gray-200 w-screen">
      <div className="flex items-center justify-center min-h-screen bg-gray-500">
        <div
          className="w-full max-w-sm bg-white dark:bg-gray-800 rounded-3xl shadow-lg overflow-hidden"
          style={{ height: "600px", width: "350px" }}
        >
          <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-300 dark:border-gray-700 p-4 flex items-center justify-between">
            <div
              className="flex items-center space-x-3"
              style={{ height: "50px" }}
            >
              <div className="relative">
                <Avatar>
                  <AvatarImage src="bot.webp" alt="Bot" />
                  <AvatarFallback>Bot</AvatarFallback>
                </Avatar>
                <span className="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full bg-green-400 ring-2 ring-white" />
              </div>
              <div>
                <h3 className="font-semibold dark:text-gray-200">Chatbot</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Online
                </p>
              </div>
            </div>
            <Button variant="ghost" size="icon">
              <MoreVertical className="h-5 w-5" />
            </Button>
          </div>

          <div
            className="flex-1 overflow-y-auto p-4 space-y-4"
            style={{ height: "calc(100% - 160px)" }}
          >
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${
                  msg.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-xs px-4 py-2 rounded-lg shadow ${
                    msg.sender === "user"
                      ? "bg-blue-500 text-white"
                      : "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                  }`}
                >
                  {msg.text}
                  {msg.sticker && (
                    <img
                      src={msg.sticker}
                      alt="sticker"
                      className="w-20 h-20 rounded-lg"
                    />
                  )}
                </div>
              </div>
            ))}
            <div ref={chatRef}></div>
          </div>
          <div className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-3 relative">
            <div className="flex items-center space-x-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowStickerPicker((prev) => !prev)}
              >
                <Sticker className="h-5 w-5" />
              </Button>
              <Input
                type="text"
                className="flex-1"
                placeholder="Type a message..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && sendMessage()}
              />

              <Button variant="ghost" size="icon" onClick={toggleEmojiPicker}>
                <Smile className="h-5 w-5" />
              </Button>

              <Button onClick={sendMessage} size="icon">
                <Send className="h-5 w-5" />
              </Button>
            </div>

            {showEmojiPicker && (
              <div className="absolute bottom-16 right-0 z-50 bg-white shadow-lg rounded-lg">
                <Picker
                  data={data}
                  onEmojiSelect={handleEmojiSelect}
                  emojiSize={20}
                  theme="light"
                />
              </div>
            )}

            {showStickerPicker && (
              <div className="absolute bottom-16 left-2 z-50 bg-white shadow-lg rounded-lg p-2 flex space-x-2 overflow-x-auto">
                {stickers.map((sticker, index) => (
                  <img
                    key={index}
                    src={sticker}
                    alt="sticker"
                    className="w-16 h-16 cursor-pointer hover:opacity-75"
                    onClick={() => sendSticker(sticker)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
