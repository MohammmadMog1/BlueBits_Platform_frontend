interface FooterProps {
  isDark: boolean;
  LogoImg: string;
}

export function Footer({ isDark, LogoImg }: FooterProps) {
  return (
    <footer
      className={`relative py-14 sm:py-20 border-t transition-colors duration-500 ${isDark ? "bg-[#06070a] border-white/5" : "bg-white border-slate-100"}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 sm:gap-12 mb-10 sm:mb-16">
          <div className="col-span-2">
            <img
              src={LogoImg}
              alt="BlueBits"
              className="h-8 sm:h-9 object-contain mb-4"
            />
            <p
              className={`text-sm leading-relaxed mb-4 max-w-xs ${isDark ? "text-gray-500" : "text-slate-500"}`}
            >
              Empowering university students with smart, elegant academic tools.
            </p>
            <div
              className={`flex items-center gap-2 text-xs font-semibold ${isDark ? "text-gray-600" : "text-slate-400"}`}
            >
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Platform Online
            </div>
          </div>
          {[
            {
              title: "Platform",
              links: [
                "Dashboard",
                "Lectures",
                "MCQ Practice",
                "AI Chatbot",
                "Exam Schedule",
              ],
            },
            {
              title: "Company",
              links: ["About Us", "Our Team", "Blog", "Careers"],
            },
            {
              title: "Support",
              links: ["Help Center", "Privacy Policy", "Terms of Service"],
            },
          ].map((col) => (
            <div key={col.title}>
              <h4
                className={`text-[10px] font-black uppercase tracking-widest mb-4 ${isDark ? "text-gray-400" : "text-[#1a1b2e]"}`}
              >
                {col.title}
              </h4>
              <ul className="space-y-2.5">
                {col.links.map((l) => (
                  <li key={l}>
                    <a
                      href="#"
                      onClick={(e) => e.preventDefault()}
                      className={`text-sm transition-colors hover:text-[#404293] dark:hover:text-[#9fa8e8] ${isDark ? "text-gray-500 hover:text-white" : "text-slate-500 hover:text-slate-900"}`}
                    >
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div
          className={`pt-6 border-t flex flex-col sm:flex-row items-center justify-between gap-3 ${isDark ? "border-white/5" : "border-slate-100"}`}
        >
          <p
            className={`text-xs text-center sm:text-left ${isDark ? "text-gray-600" : "text-slate-400"}`}
          >
            © 2026 BlueBits. All rights reserved.
          </p>
          <div className="flex items-center gap-5">
            {["Facebook", "Instagram", "Telegram"].map((s) => (
              <a
                key={s}
                href="#"
                onClick={(e) => e.preventDefault()}
                className={`text-xs transition-colors hover:text-[#404293] dark:hover:text-[#9fa8e8] ${isDark ? "text-gray-500 hover:text-white" : "text-slate-400 hover:text-slate-900"}`}
              >
                {s}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
