import { Outlet } from "react-router-dom";
import logo from "../../app/assets/Logo.png";

const AuthLayout = () => {
  return (
    // الخلفية الأساسية فاتحة ومريحة للعين متناسقة مع البوسترات
    <div className="relative min-h-[100dvh] w-full overflow-hidden bg-[#f5f7fa] text-slate-800 antialiased">
      
      {/* التدرجات الخلفية الناعمة (Ambient Glow) المستوحاة من ألوان اللوغو */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(79,70,229,0.08),_transparent_45%),radial-gradient(circle_at_bottom_right,_rgba(14,165,233,0.1),_transparent_50%)]" />
      <div className="absolute left-[-5%] top-[-10%] h-80 w-80 rounded-full bg-[#4a46bc]/10 blur-3xl" />
      <div className="absolute bottom-[-10%] right-[-5%] h-96 w-96 rounded-full bg-[#1da1f2]/10 blur-3xl" />

      {/* الحاوية الرئيسية المتمركزة */}
      <div className="relative z-10 flex min-h-[100dvh] items-center justify-center px-5 py-6 sm:px-6 sm:py-8 lg:px-8">

        {/* الكارد الأبيض الفاخر: بدون تأطير مزدوج على الموبايل (كارد الفورم نفسه هو الكارد الوحيد الظاهر)، ويعود التصميم الفاخر بحوافه وظله من sm فما فوق */}
        <div className="w-full max-w-6xl rounded-none border-0 bg-transparent p-0 shadow-none sm:rounded-4xl sm:border sm:border-white/60 sm:bg-white/70 sm:p-8 sm:shadow-[0_20px_50px_rgba(0,0,0,0.05)] sm:backdrop-blur-xl lg:p-10">
          <div className="grid items-center gap-8 lg:grid-cols-[1.05fr_0.95fr]">
            
            {/* القسم الجانبي الترحيبي (يظهر على الشاشات الكبيرة) */}
            <div className="hidden flex-col justify-center rounded-[1.6rem] border border-slate-100 bg-gradient-to-br from-slate-50/80 to-white/90 p-10 shadow-sm lg:flex">
              <img
                src={logo}
                alt="BlueBits logo"
                className="mb-8 h-20 w-auto self-start object-contain"
              />
              
              {/* تدرج لوني للنص مأخوذ مباشرة من لوغو الفريق */}
              <h1 className="mb-4 text-4xl font-extrabold tracking-tight bg-gradient-to-r from-[#464cc4] to-[#2192cf] bg-clip-text text-transparent">
                Welcome to BlueBits
              </h1>
              
              <p className="max-w-md text-base leading-8 text-slate-600 font-medium">
                Your smart academic space for lectures, assignments, and a
                better study experience.
              </p>
              
              {/* البادجات ملونة بنفس درجات أطراف اللوغو المتدرجة */}
              <div className="mt-8 flex flex-wrap gap-3">
                <span className="rounded-xl border border-[#464cc4]/20 bg-[#464cc4]/5 px-4 py-1.5 text-xs font-semibold text-[#464cc4]">
                  Secure access
                </span>
                <span className="rounded-xl border border-[#2192cf]/20 bg-[#2192cf]/5 px-4 py-1.5 text-xs font-semibold text-[#2192cf]">
                  Fast onboarding
                </span>
              </div>
            </div>

            {/* قسم الفورم الديناميكي (Outlet) */}
            <div className="flex w-full justify-center px-0 sm:px-2">
              <div className="w-full max-w-md">
                {/* اللوغو للشاشات الصغيرة فقط */}
                <div className="mb-5 flex items-center justify-center sm:mb-6 lg:hidden">
                  <img src={logo} alt="BlueBits logo" className="h-14 w-auto object-contain sm:h-16" />
                </div>

                {/* هنا يتم عرض محتوى صفحة تسجيل الدخول أو الإنشاء */}
                <div className="bg-transparent p-0 sm:bg-white/40 sm:p-2 lg:bg-transparent lg:p-0 rounded-2xl">
                  <Outlet />
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;