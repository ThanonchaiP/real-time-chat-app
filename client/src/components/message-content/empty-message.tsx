import { MessageCircle, Send } from "lucide-react";

export const EmptyMessage = () => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
      <div className="relative mb-6">
        {/* Background circle with gradient */}
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center relative">
          <MessageCircle className="w-10 h-10 text-blue-500" />

          {/* Floating send icon */}
          <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center shadow-lg animate-bounce">
            <Send className="w-4 h-4 text-white" />
          </div>
        </div>

        {/* Animated dots */}
        <div className="absolute -top-2 -right-2 flex space-x-1">
          <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
          <div
            className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"
            style={{ animationDelay: "0.2s" }}
          ></div>
          <div
            className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"
            style={{ animationDelay: "0.4s" }}
          ></div>
        </div>
      </div>

      <div className="space-y-3 max-w-md">
        <h3 className="text-lg font-semibold text-gray-800">
          เริ่มต้นการสนทนา
        </h3>
        <p className="text-sm text-gray-500 leading-relaxed">
          ยังไม่มีข้อความในห้องแชทนี้ เริ่มส่งข้อความเพื่อเริ่มการสนทนากันเลย!
        </p>
      </div>

      {/* Decorative elements */}
      <div className="mt-8 flex space-x-2 opacity-60">
        <div className="w-3 h-3 bg-blue-200 rounded-full animate-pulse"></div>
        <div
          className="w-3 h-3 bg-indigo-200 rounded-full animate-pulse"
          style={{ animationDelay: "0.3s" }}
        ></div>
        <div
          className="w-3 h-3 bg-purple-200 rounded-full animate-pulse"
          style={{ animationDelay: "0.6s" }}
        ></div>
      </div>
    </div>
  );
};
