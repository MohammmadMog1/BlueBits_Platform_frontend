import React, { useState, useEffect } from "react";
import {useAppDispatch, useAppSelector} from "../redux/hooks"; // تأكد من تعديل المسار حسب هيكل مشروعك
import { useNavigate } from "react-router-dom";

// استيراد الـ Thunk والأنواع (عدّل المسارات حسب هيكل مشروعك)
import { loginThunk } from "../redux/authThunk";
import type { RootState } from "../../../app/store/store"; // تأكد من وجود تعريف RootState في ملف الـ store

const LoginPage: React.FC = () => {
  // 1. Redux Hooks
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  
  // جلب الحالة من Redux Store
  const { isLoading, error, isAuthenticated} = useAppSelector(
    (state: RootState) => state.auth
  );

  // 2. Local State for Form
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  // 3. Effect: التوجيه عند نجاح تسجيل الدخول
  useEffect(() => {
    if (isAuthenticated) {
      // غيّر '/dashboard' إلى المسار الذي تريد توجيه المستخدم إليه بعد الدخول
      navigate("/dashboard", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  // 4. Event Handler: معالجة إرسال النموذج
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // منع إعادة تحميل الصفحة
    
    // إرسال البيانات إلى الـ Thunk
    dispatch(loginThunk({ email, password }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        
        {/* العنوان */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800">تسجيل الدخول</h2>
          <p className="text-gray-500 mt-2">أهلاً بك مجدداً، يرجى إدخال بياناتك</p>
        </div>

        {/* عرض رسالة الخطأ إن وجدت */}
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md text-sm flex items-center">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {error}
          </div>
        )}

        {/* نموذج تسجيل الدخول */}
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* حقل البريد الإلكتروني */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              البريد الإلكتروني
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              placeholder="example@domain.com"
              disabled={isLoading}
            />
          </div>

          {/* حقل كلمة المرور */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              كلمة المرور
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              placeholder="••••••••"
              disabled={isLoading}
            />
          </div>

          {/* زر الإرسال */}
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-2.5 px-4 rounded-md text-white font-semibold transition duration-200 flex items-center justify-center
              ${isLoading 
                ? "bg-blue-400 cursor-not-allowed" 
                : "bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-lg"
              }`}
          >
            {isLoading ? (
              <>
                {/* أيقونة التحميل (Spinner) */}
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                جاري تسجيل الدخول...
              </>
            ) : (
              "تسجيل الدخول"
            )}
          </button>
        </form>

        {/* روابط إضافية (اختياري) */}
        <div className="mt-6 text-center text-sm text-gray-600">
          <p>
            ليس لديك حساب؟{" "}
            <a href="/register" className="text-blue-600 hover:text-blue-800 font-medium hover:underline">
              إنشاء حساب جديد
            </a>
          </p>
          <p className="mt-2">
            <a href="/forgot-password" className="text-gray-500 hover:text-gray-700 hover:underline">
              نسيت كلمة المرور؟
            </a>
          </p>
        </div>

      </div>
    </div>
  );
};

export default LoginPage;