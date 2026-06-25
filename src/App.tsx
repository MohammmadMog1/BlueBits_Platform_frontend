import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "./features/auth/redux/hooks";
import { getMeThunk } from "./features/auth/redux/authThunk";
import AppRouter from "./app/routes/AppRouter";

function App() {
  const dispatch = useAppDispatch();
  // 👈 جلب الـ user من الـ store بالإضافة للحالات الأخرى
  const { isLoading, isAuthenticated, user } = useAppSelector((state) => state.auth);

  console.log("isAuthenticated: ",isAuthenticated)
  useEffect(() => {
    const token = localStorage.getItem("token");
    
    // 👈 التعديل السحري هنا: 
    // نرسل الـ API فقط إذا كان هناك توكن "ولم تكن بيانات المستخدم متوفرة في الـ store"
    if (token && !user) {
      dispatch(getMeThunk());
    }
  }, [dispatch, user]); // إضافة user لمصفوفة الاعتمادات

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#08090d] text-white">
        <div className="flex flex-col items-center gap-3">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#404293]"></div>
          <p className="text-sm text-gray-400">Verifying session...</p>
        </div>
      </div>
    );
  }

  return <AppRouter />;
}

export default App;