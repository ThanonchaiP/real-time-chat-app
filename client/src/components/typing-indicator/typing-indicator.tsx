export const TypingIndicator = () => {
  return (
    <div className="flex items-end space-x-3 py-2">
      <div className="size-[35px] bg-gray-300 rounded-full flex items-center justify-center">
        <span className="text-xs font-medium text-gray-600">•••</span>
      </div>
      <div className="bg-[#F5F7FB] rounded-2xl rounded-bl-sm px-4 py-3 max-w-xs">
        <div className="flex space-x-1">
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
          <div
            className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
            style={{ animationDelay: "0.1s" }}
          ></div>
          <div
            className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
            style={{ animationDelay: "0.2s" }}
          ></div>
        </div>
        <div className="text-xs text-gray-500 mt-1">กำลังพิมพ์...</div>
      </div>
    </div>
  );
};
