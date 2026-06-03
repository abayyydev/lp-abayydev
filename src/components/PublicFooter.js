"use client";
import Link from "next/link";
import Image from "next/image";

export default function PublicFooter() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    "Quick Links": [
      { name: "Home", href: "/" },
      { name: "Projects", href: "#projects" },
      { name: "About", href: "#about" },
      { name: "Contact", href: "#contact" },
    ],
    Services: [
      { name: "Web Development", href: "#" },
      { name: "Mobile Apps", href: "#" },
      { name: "UI/UX Design", href: "#" },
      { name: "Consultation", href: "#" },
    ],
    Resources: [
      { name: "Blog", href: "#" },
      { name: "Case Studies", href: "#" },
      { name: "Documentation", href: "#" },
      { name: "Support", href: "#" },
    ],
  };

  // Menggunakan Google Material Symbols sebagai pengganti emoji brand
  const socialLinks = [
    { name: "GitHub", icon: "code_blocks", href: "#", color: "hover:bg-slate-800 hover:border-slate-800" },
    { name: "LinkedIn", icon: "work_history", href: "#", color: "hover:bg-blue-700 hover:border-blue-700" },
    { name: "Twitter", icon: "alternate_email", href: "#", color: "hover:bg-sky-500 hover:border-sky-500" },
    { name: "Instagram", icon: "photo_camera", href: "#", color: "hover:bg-pink-600 hover:border-pink-600" },
  ];

  return (
    <>
      {/* Import Google Material Symbols */}
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0"
      />

      {/* Main Footer */}
      <footer className="relative bg-gradient-to-b from-white via-slate-50 to-slate-100 pt-24 pb-12 overflow-hidden border-t border-slate-100">
        
        {/* Background decorative elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-r from-blue-100 to-cyan-100 rounded-full blur-[100px] opacity-40"></div>
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-full blur-[100px] opacity-40"></div>
        </div>

        <div className="max-w-7xl mx-auto px-5 md:px-8 relative z-10">
          
          {/* CTA Section */}
          <div className="bg-gradient-to-r from-blue-600 to-cyan-500 rounded-[2.5rem] p-8 md:p-14 text-center mb-20 shadow-2xl shadow-blue-900/20 border border-blue-400/30 relative overflow-hidden">
            {/* CTA Background Pattern */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

            <div className="relative z-10">
              <h2 className="text-3xl md:text-5xl font-black text-white mb-6 tracking-tight">
                Ready to Start Your Project?
              </h2>
              <p className="text-blue-50 text-lg mb-10 max-w-2xl mx-auto font-medium leading-relaxed">
                Let's create something amazing together. I'm available for new
                projects, collaborations, and tech consultations.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <a
                  href="#contact"
                  className="w-full sm:w-auto px-8 py-4 bg-white text-blue-600 font-bold rounded-2xl hover:bg-slate-50 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex items-center justify-center gap-2 group"
                >
                  <span className="material-symbols-outlined text-xl group-hover:scale-110 transition-transform">chat</span>
                  Get In Touch
                </a>
                <a
                  href="mailto:hello@akbardev.com"
                  className="w-full sm:w-auto px-8 py-4 border-2 border-white/80 text-white font-bold rounded-2xl hover:bg-white/10 hover:border-white transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined text-xl">mail</span>
                  hello@akbardev.com
                </a>
              </div>
            </div>
          </div>

          {/* Footer Content */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
            
            {/* Brand Column */}
            <div className="lg:col-span-2">
              <Link href="/" className="inline-block mb-6 group">
  <div className="flex items-center gap-4">

    <Image
      src="/logo-terbaru.png"
      alt="AbayyyDev Logo"
      width={56}
      height={56}
      className="object-contain transition-transform duration-300 group-hover:scale-105"
    />

    <div>
      <h3 className="text-2xl font-black tracking-tight">
        <span className="text-slate-900">Abayyy</span>
        <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
          Dev
        </span>
      </h3>

      <p className="text-xs font-bold text-slate-400 uppercase tracking-[3px] mt-1">
        Full Stack Developer
      </p>
    </div>

  </div>
</Link>
              <p className="text-slate-500 mb-8 max-w-md leading-relaxed text-sm">
                Creating digital experiences that are fast, beautiful, and
                functional. Specializing in modern web technologies and
                innovative solutions.
              </p>

              {/* Social Links */}
              <div className="flex gap-3">
                {socialLinks.map((social) => (
                  <a
                    key={social.name}
                    href={social.href}
                    className={`w-12 h-12 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-500 hover:text-white transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg ${social.color}`}
                    title={social.name}
                  >
                    <span className="material-symbols-outlined text-[22px]">{social.icon}</span>
                  </a>
                ))}
              </div>
            </div>

            {/* Links Columns */}
            {Object.entries(footerLinks).map(([category, links]) => (
              <div key={category}>
                <h4 className="font-extrabold text-slate-900 text-lg mb-6">
                  {category}
                </h4>
                <ul className="space-y-4">
                  {links.map((link) => (
                    <li key={link.name}>
                      <a
                        href={link.href}
                        className="text-slate-500 hover:text-blue-600 transition-colors flex items-center gap-2 group font-medium text-sm"
                      >
                        <span className="material-symbols-outlined text-[16px] text-slate-300 group-hover:text-blue-500 transition-colors">chevron_right</span>
                        <span className="group-hover:translate-x-1 transition-transform">{link.name}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Newsletter Section */}
          <div className="mb-12 p-8 md:p-10 bg-white rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/40">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div>
                <h4 className="text-2xl font-black text-slate-900 mb-2 flex items-center gap-2">
                  <span className="material-symbols-outlined text-amber-500">mark_email_unread</span>
                  Stay Updated
                </h4>
                <p className="text-slate-500 text-sm">
                  Subscribe to my newsletter for the latest projects and tech insights. No spam, I promise.
                </p>
              </div>
              <form className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-grow">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">mail</span>
                  <input
                    type="email"
                    placeholder="Your email address"
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 text-sm rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                  />
                </div>
                <button
                  type="submit"
                  className="px-8 py-4 bg-slate-900 text-white font-bold rounded-2xl hover:bg-blue-600 hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2 group"
                >
                  Subscribe
                  <span className="material-symbols-outlined text-lg group-hover:translate-x-1 transition-transform">send</span>
                </button>
              </form>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="pt-8 border-t border-slate-200">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
              <p className="text-slate-500 text-sm font-medium">
                &copy; {currentYear} AkbarDev. All rights reserved.
              </p>

              <div className="flex items-center gap-6 text-sm font-medium text-slate-500">
                <a href="#" className="hover:text-blue-600 transition-colors">Privacy Policy</a>
                <a href="#" className="hover:text-blue-600 transition-colors">Terms of Service</a>
                <a href="#" className="hover:text-blue-600 transition-colors">Cookies</a>
              </div>
            </div>
          </div>
        </div>

        {/* Back to Top Button */}
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-8 right-8 w-14 h-14 bg-white border border-slate-100 text-slate-600 rounded-2xl shadow-xl shadow-slate-200/50 hover:bg-blue-600 hover:text-white hover:-translate-y-2 hover:border-blue-600 transition-all duration-300 flex items-center justify-center z-40 group"
          aria-label="Back to top"
        >
          <span className="material-symbols-outlined text-2xl group-hover:animate-bounce">arrow_upward</span>
        </button>
      </footer>
    </>
  );
}