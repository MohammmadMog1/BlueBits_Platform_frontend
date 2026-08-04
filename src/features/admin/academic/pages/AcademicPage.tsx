import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { GraduationCap, Layers } from "lucide-react";
import YearsPanel from "../components/YearsPanel";
import SemestersPanel from "../components/SemestersPanel";

export default function AcademicPage() {
  const [activeTab, setActiveTab] = useState<"years" | "semesters">("years");
  return (
    <div className="flex flex-col gap-6" dir="rtl">
      <div>
        <div className="mb-1 flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#404293] to-[#2376BB] shadow-md shadow-[#404293]/25">
            <GraduationCap className="h-[18px] w-[18px] text-white" />
          </div>
          <h1 className="text-xl font-black tracking-tight text-gray-900">
            الهيكل الأكاديمي
          </h1>
        </div>
        <p className="text-sm font-medium text-gray-400">
          إدارة السنوات والفصول الدراسية
        </p>
      </div>
      <div className="flex w-fit gap-1 rounded-2xl bg-gray-100 p-1">
        {(["years", "semesters"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold transition-all duration-200 ${activeTab === tab ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
          >
            {tab === "years" ? (
              <>
                <GraduationCap size={15} /> السنوات الدراسية
              </>
            ) : (
              <>
                <Layers size={15} /> الفصول الدراسية
              </>
            )}
          </button>
        ))}
      </div>
      <AnimatePresence mode="wait">
        {activeTab === "years" ? (
          <motion.div
            key="years"
            initial={{ opacity: 0, x: 14 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -14 }}
            transition={{ duration: 0.18 }}
          >
            <YearsPanel />
          </motion.div>
        ) : (
          <motion.div
            key="semesters"
            initial={{ opacity: 0, x: 14 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -14 }}
            transition={{ duration: 0.18 }}
          >
            <SemestersPanel />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
