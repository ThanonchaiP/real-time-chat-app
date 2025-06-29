import SimpleBar from "simplebar-react";

import { SearchInput } from "../search-input";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

import "simplebar/dist/simplebar.min.css";

export const SidebarChats = () => {
  const chats = Array.from({ length: 20 }, (_, i) => ({
    id: i + 1,
    name: `Chat ${i + 1}`,
    lastMessage: `Last message in chat ${i + 1}`,
    timestamp: new Date().toISOString(),
    typing: Math.random() < 0.5,
  }));

  return (
    <div className="h-full">
      <div className="p-6 pb-2">
        <h2 className="text-xl font-semibold mb-6">Chats</h2>
        <SearchInput onDebounce={(value) => console.log(value)} />

        <h4 className="font-semibold mt-6">Recent</h4>
      </div>

      <SimpleBar style={{ maxHeight: "calc(100vh - 200px)" }} autoHide={true}>
        {chats.map((chat) => (
          <div
            key={chat.id}
            className="flex items-center gap-4 py-[15px] px-[20px] cursor-pointer hover:bg-[#E6EBF5]"
          >
            <div className="relative">
              <Avatar className="size-[35px]">
                <AvatarImage
                  src="https://github.com/shadcn.png"
                  alt="@shadcn"
                />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>

              <span className="absolute right-0 bottom-0 w-2.5 h-2.5 rounded-full bg-green-500 border border-white"></span>
            </div>
            <div className="flex flex-1 justify-between">
              <div>
                <h5 className="font-semibold">{chat.name}</h5>
                {chat.typing ? (
                  <TypingIndicator />
                ) : (
                  <p className="text-sm text-muted-foreground">
                    {chat.lastMessage}
                  </p>
                )}
              </div>
              <p className="text-[11px] text-muted-foreground">
                {new Date(chat.timestamp).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          </div>
        ))}
      </SimpleBar>
    </div>
  );
};

const TypingIndicator = () => (
  <p className="text-sm text-primary font-semibold flex gap-1 items-center max-h-[20px]">
    Typing
    <span className="text-2xl animate-bounce [animation-delay:0ms]">.</span>
    <span className="text-2xl animate-bounce [animation-delay:150ms]">.</span>
    <span className="text-2xl animate-bounce [animation-delay:300ms]">.</span>
  </p>
);
