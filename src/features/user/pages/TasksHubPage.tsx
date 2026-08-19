import { useState } from "react";
import { useTheme } from "next-themes";
import { CheckSquare, GraduationCap } from "lucide-react";
import FocusTimerCard from "../components/FocusTimerCard";
import { PersonalTasksPage } from "../../personalTasks";
import { useGetPersonalTasksQuery } from "../../personalTasks";
import { StudentAcademicTasksPage } from "../../studentAcademicTasks";
import { useGetAcademicTasksQuery } from "../../admin/tasks";

type TasksTab = "personal" | "academic";

const tabs: { id: TasksTab; label: string; icon: typeof CheckSquare }[] = [
  { id: "personal", label: "المهام الشخصية", icon: CheckSquare },
  { id: "academic", label: "المهام الأكاديمية", icon: GraduationCap },
];

export default function TasksHubPage() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [activeTab, setActiveTab] = useState<TasksTab>("personal");

  const { data: personalTasks = [] } = useGetPersonalTasksQuery();
  const { data: academicTasks = [] } = useGetAcademicTasksQuery();

  const personalDone = personalTasks.filter((task) => task.isCompleted).length;
  const totalTasks = personalTasks.length + academicTasks.length;
  const totalDone = personalDone + academicTasks.filter((task) => task.status === "closed").length;
  const progress = totalTasks > 0 ? Math.round((totalDone / totalTasks) * 100) : 0;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className={`text-xl font-black tracking-tight ${isDark ? "text-white" : "text-gray-900"}`}>
          مهامي
        </h1>
        <p className={`text-sm font-medium ${isDark ? "text-gray-400" : "text-gray-400"}`}>
          نظّم مهامك الشخصية والأكاديمية في مكان واحد
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div
          className={`rounded-[2rem] border p-5 shadow-sm backdrop-blur-md lg:col-span-2 ${
            isDark ? "border-white/10 bg-white/5" : "border-gray-100 bg-white/80"
          }`}
        >
          <div className="mb-3 flex items-center justify-between">
            <span className={`text-sm font-semibold ${isDark ? "text-gray-300" : "text-gray-700"}`}>
              التقدم الإجمالي
            </span>
            <span className="text-xl font-extrabold text-[#2376BB]">{progress}%</span>
          </div>
          <div className={`h-3.5 w-full overflow-hidden rounded-full ${isDark ? "bg-white/10" : "bg-gray-100"}`}>
            <div
              className="h-full bg-gradient-to-r from-[#404293] to-[#2376BB] transition-all duration-700 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="mt-3 flex items-center gap-6">
            <div className="flex items-center gap-2 text-sm font-medium">
              <div className="h-2.5 w-2.5 rounded-full bg-[#404293]" />
              <span className={isDark ? "text-gray-400" : "text-gray-600"}>
                {personalTasks.length} شخصية
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm font-medium">
              <div className="h-2.5 w-2.5 rounded-full bg-[#2376BB]" />
              <span className={isDark ? "text-gray-400" : "text-gray-600"}>
                {academicTasks.length} أكاديمية
              </span>
            </div>
          </div>
        </div>

        <FocusTimerCard isDark={isDark} />
      </div>

      <div
        className={`flex w-fit gap-1 rounded-2xl border p-1.5 shadow-sm ${
          isDark ? "border-white/10 bg-white/5" : "border-gray-100 bg-white"
        }`}
      >
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          const count = tab.id === "personal" ? personalTasks.length : academicTasks.length;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold transition-all ${
                isActive
                  ? "bg-gradient-to-r from-[#404293] to-[#2376BB] text-white shadow-md shadow-[#404293]/25"
                  : isDark
                    ? "text-gray-400 hover:text-white"
                    : "text-gray-500 hover:bg-gray-50"
              }`}
            >
              <Icon size={15} /> {tab.label}
              <span
                className={`rounded-md px-1.5 py-0.5 text-[10px] ${
                  isActive ? "bg-white/20" : isDark ? "bg-white/10" : "bg-gray-100"
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {activeTab === "personal" ? <PersonalTasksPage /> : <StudentAcademicTasksPage />}
    </div>
  );
}
