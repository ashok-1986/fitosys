import { Eyebrow } from "@/components/ui/Eyebrow";

export function WhatsAppSection() {
    return (
        <section id="whatsapp" className="bg-[var(--surface)]">
            <div className="max-w-[1400px] mx-auto px-4 md:px-12 py-28 md:py-32">
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                    
                    {/* Left - Content */}
                    <div>
                        <Eyebrow label="WhatsApp Native" />
                        <h2 className="font-display font-medium text-[44px] md:text-[56px] lg:text-[64px] leading-none tracking-[0.02em] uppercase text-white mt-6 mb-8">
                            Where Your<br />
                            Clients<br />
                            <span className="text-[#25D366]">Already Are.</span>
                        </h2>
                        <p className="font-sans text-[18px] text-[var(--grey)] leading-[1.7] mb-8">
                            India runs on WhatsApp. So does Fitosys.
                        </p>
                        <p className="font-sans text-[16px] text-[var(--grey)] leading-[1.7] mb-10">
                            Your clients never need to download another app. Every message, every check-in, 
                            every renewal reminder happens natively on WhatsApp — the app they already 
                            use every single day.
                        </p>
                        
                        <ul className="space-y-4 mb-10">
                            <li className="flex items-start gap-3">
                                <span className="font-display font-medium text-[20px] text-[var(--red)] mt-1">●</span>
                                <div>
                                    <span className="font-sans text-[15px] text-white block mb-1">No app download required</span>
                                    <span className="font-sans text-[13px] text-[var(--grey)]">Your clients stay in WhatsApp. Zero friction.</span>
                                </div>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="font-display font-medium text-[20px] text-[var(--red)] mt-1">●</span>
                                <div>
                                    <span className="font-sans text-[15px] text-white block mb-1">90%+ open rates</span>
                                    <span className="font-sans text-[13px] text-[var(--grey)]">WhatsApp messages get read. Emails don't.</span>
                                </div>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="font-display font-medium text-[20px] text-[var(--red)] mt-1">●</span>
                                <div>
                                    <span className="font-sans text-[15px] text-white block mb-1">Feels personal, runs automated</span>
                                    <span className="font-sans text-[13px] text-[var(--grey)]">Every message comes from your number, in your name.</span>
                                </div>
                            </li>
                        </ul>

                        <a
                            href="/signup"
                            className="inline-block bg-[var(--red)] text-white font-sans font-bold text-[13px] uppercase tracking-[0.04em] px-10 py-[14px] rounded-[2px] hover:bg-[#C20000] transition-colors border-2 border-[var(--red)]"
                        >
                            Start Free — No Card Needed
                        </a>
                    </div>

                    {/* Right - WhatsApp Chat Mockup */}
                    <div className="relative">
                        {/* Phone Frame */}
                        <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-[38px] p-[13px] shadow-[0_48px_96px_rgba(0,0,0,0.9),0_0_0_1px_rgba(255,255,255,0.03)]">
                            <div className="bg-[#0A0A0A] rounded-[28px] overflow-hidden min-h-[520px]">
                                
                                {/* Chat Header */}
                                <div className="bg-[#111111] border-b border-[rgba(255,255,255,0.06)] px-5 py-4 flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-[var(--red)] flex items-center justify-center">
                                        <span className="font-display font-medium text-[16px] text-white">F</span>
                                    </div>
                                    <div>
                                        <div className="font-sans font-semibold text-[14px] text-white">Fitosys Coach</div>
                                        <div className="font-sans text-[11px] text-[var(--grey)]">Business Account</div>
                                    </div>
                                </div>

                                {/* Chat Messages */}
                                <div className="p-5 space-y-4">
                                    {/* Message 1 - Coach */}
                                    <div className="bg-[#1E1E1E] rounded-[16px] rounded-tl-[4px] p-3 max-w-[85%]">
                                        <p className="font-sans text-[14px] text-white leading-[1.5]">
                                            Hey Priya! 👋 Your weekly check-in is here.
                                        </p>
                                        <p className="font-sans text-[14px] text-white leading-[1.5] mt-2">
                                            How did your workouts go this week? Rate it 1-10:
                                        </p>
                                        <div className="flex gap-2 mt-3">
                                            {['1-4', '5-7', '8-10'].map((opt) => (
                                                <button key={opt} className="bg-[var(--red)] text-white font-sans text-[12px] font-bold px-4 py-2 rounded-[4px]">
                                                    {opt}
                                                </button>
                                            ))}
                                        </div>
                                        <span className="font-sans text-[10px] text-[var(--grey)] block mt-2 text-right">10:32 AM</span>
                                    </div>

                                    {/* Message 2 - Client */}
                                    <div className="bg-[#0B4F3A] rounded-[16px] rounded-tr-[4px] p-3 max-w-[75%] ml-auto">
                                        <p className="font-sans text-[14px] text-white leading-[1.5]">
                                            8-10! 💪 Had 4 great sessions this week
                                        </p>
                                        <span className="font-sans text-[10px] text-[rgba(255,255,255,0.6)] block mt-2 text-right">10:35 AM</span>
                                    </div>

                                    {/* Message 3 - Coach */}
                                    <div className="bg-[#1E1E1E] rounded-[16px] rounded-tl-[4px] p-3 max-w-[85%]">
                                        <p className="font-sans text-[14px] text-white leading-[1.5]">
                                            Amazing! 🎉 What was your biggest win?
                                        </p>
                                        <span className="font-sans text-[10px] text-[var(--grey)] block mt-2 text-right">10:36 AM</span>
                                    </div>

                                    {/* Message 4 - Client */}
                                    <div className="bg-[#0B4F3A] rounded-[16px] rounded-tr-[4px] p-3 max-w-[75%] ml-auto">
                                        <p className="font-sans text-[14px] text-white leading-[1.5]">
                                            Finally hit my protein goals every day! The meal prep template you shared was a game changer 🙌
                                        </p>
                                        <span className="font-sans text-[10px] text-[rgba(255,255,255,0.6)] block mt-2 text-right">10:38 AM</span>
                                    </div>

                                    {/* Message 5 - Coach */}
                                    <div className="bg-[#1E1E1E] rounded-[16px] rounded-tl-[4px] p-3 max-w-[85%]">
                                        <p className="font-sans text-[14px] text-white leading-[1.5]">
                                            That's the way! 🔥 Keep this momentum. Next week's focus?
                                        </p>
                                        <span className="font-sans text-[10px] text-[var(--grey)] block mt-2 text-right">10:39 AM</span>
                                    </div>
                                </div>

                                {/* Chat Input (static) */}
                                <div className="bg-[#111111] border-t border-[rgba(255,255,255,0.06)] px-4 py-3 flex items-center gap-3">
                                    <div className="flex-1 bg-[#1A1A1A] rounded-[20px] px-4 py-2">
                                        <span className="font-sans text-[13px] text-[var(--grey)]">Type a message...</span>
                                    </div>
                                    <div className="w-10 h-10 rounded-full bg-[var(--red)] flex items-center justify-center">
                                        <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Decorative Elements */}
                        <div className="absolute -top-6 -right-6 w-24 h-24 bg-[var(--red)] opacity-10 blur-[60px] pointer-events-none" />
                        <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-[#25D366] opacity-10 blur-[60px] pointer-events-none" />
                    </div>
                </div>
            </div>
        </section>
    );
}
