"use client";

import { MessageSquare, ArrowLeft } from "lucide-react";

export default function HomePage() {
  return (
    <div className="h-full flex-1 flex items-center justify-center">
      <div className="text-center space-y-6 max-w-sm mx-auto">
        <div className="bg-gray-100 p-8 rounded-full w-24 h-24 mx-auto flex items-center justify-center">
          <MessageSquare className="w-12 h-12 text-gray-400" />
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl font-semibold text-gray-800">เลือกห้องแชท</h2>
          <p className="text-gray-500">
            เลือกห้องจากรายการด้านซ้ายเพื่อเริ่มการสนทนา
          </p>
        </div>

        <div className="flex items-center justify-center text-sm text-gray-400 space-x-2">
          <ArrowLeft className="w-4 h-4" />
          <span>เลือกห้องจากแถบด้านซ้าย</span>
        </div>
      </div>
    </div>
  );
}
