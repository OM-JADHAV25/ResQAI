import React from "react";
import { Activity, Layers } from "lucide-react";

const Sidebar: React.FC = () => {
  return (
    <aside className="w-72 bg-[#061025] glass border-r border-slate-800 p-4 flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#22050a] to-[#3b0a12] flex items-center justify-center shadow">
          <div className="text-white font-bold">R</div>
        </div>
        <div>
          <h2 className="text-lg font-semibold">ResQAI</h2>
          <p className="text-xs text-slate-400">Command Center</p>
        </div>
      </div>

      <nav className="flex-1">
        <ul className="space-y-2">
          <li className="flex items-center gap-3 p-2 rounded hover:bg-slate-800">
            <Activity className="w-4 h-4 text-slate-300" />
            <span className="text-sm text-slate-200">Overview</span>
          </li>
          <li className="flex items-center gap-3 p-2 rounded hover:bg-slate-800">
            <Layers className="w-4 h-4 text-slate-300" />
            <span className="text-sm text-slate-200">Map</span>
          </li>
        </ul>
      </nav>

      <div className="text-xs text-slate-400">
        <p>Connected: <span className="text-green-400 font-medium">Yes</span></p>
        <p className="mt-2">Model: <span className="text-slate-200 ml-1">gemini-2.5-pro</span></p>
      </div>
    </aside>
  );
};

export default Sidebar;
