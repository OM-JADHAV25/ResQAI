import React from "react";
import { Bell } from "lucide-react";

const Topbar: React.FC = () => {
  return (
    <header className="h-14 flex items-center px-4 bg-gradient-to-r from-[#05060a] to-[#071126] border-b border-slate-800">
      <div className="flex items-center gap-4 w-full">
        <div className="text-lg font-semibold text-white">ResQAI Command Center</div>
        <div className="ml-auto flex items-center gap-3">
          <div className="text-slate-300 text-sm">User: Team</div>
          <button className="p-2 rounded-full hover:bg-slate-800">
            <Bell className="w-5 h-5 text-slate-200" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Topbar;
