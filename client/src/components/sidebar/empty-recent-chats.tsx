import { MessageCircle, Search, Users } from "lucide-react";

interface EmptyRecentChatsProps {
  onClick: () => void;
}

export const EmptyRecentChats = ({ onClick }: EmptyRecentChatsProps) => (
  <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
    <div className="relative mb-6">
      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
        <MessageCircle className="w-8 h-8 text-gray-400" />
      </div>
      <div className="absolute -top-1 -right-1 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
        <Search className="w-3 h-3 text-white" />
      </div>
    </div>

    <h3 className="text-lg font-semibold text-gray-800 mb-2">
      ยังไม่มีการสนทนา
    </h3>

    <p className="text-sm text-gray-500 mb-6 max-w-[280px] leading-relaxed">
      เริ่มสนทนากับเพื่อนของคุณ หรือค้นหาคนใหม่ๆ เพื่อเริ่มแชท
    </p>

    <div className="flex flex-col gap-3 w-full max-w-[200px]">
      <button
        onClick={onClick}
        className="flex items-center justify-center cursor-pointer gap-2 bg-blue-500 text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors"
      >
        <Users className="w-4 h-4" />
        ค้นหาเพื่อน
      </button>

      <button
        onClick={onClick}
        className="flex items-center justify-center cursor-pointer gap-2 border border-gray-200 text-gray-600 px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
      >
        <MessageCircle className="w-4 h-4" />
        เริ่มแชทใหม่
      </button>
    </div>
  </div>
);
