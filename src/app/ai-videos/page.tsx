import Link from 'next/link';
import { aiVideoTools, type AIVideoTool } from '@/lib/ai-video-data';

export default function AIVideoDirectory() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
            {/* Header */}
            <header className="border-b border-white/10 backdrop-blur-xl sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <span className="text-xl font-bold text-white">FitoSys AI Videos</span>
                        </div>
                        <nav className="hidden md:flex items-center gap-6">
                            <Link href="/" className="text-gray-300 hover:text-white transition-colors">Home</Link>
                            <Link href="/programs" className="text-gray-300 hover:text-white transition-colors">Programs</Link>
                            <Link href="/join" className="text-gray-300 hover:text-white transition-colors">Join</Link>
                        </nav>
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <section className="relative py-20 px-4">
                <div className="max-w-7xl mx-auto text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/20 border border-purple-500/30 text-purple-300 text-sm mb-6">
                        <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse"></span>
                        Curated Collection
                    </div>
                    <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
                        Best AI Video Generation
                        <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                            Models in 2026
                        </span>
                    </h1>
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-8">
                        Discover the most powerful AI tools for creating stunning videos from text, images, or existing footage.
                    </p>

                    {/* Search Bar */}
                    <div className="max-w-xl mx-auto relative">
                        <input
                            type="text"
                            placeholder="Search AI video tools..."
                            className="w-full px-6 py-4 rounded-2xl bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent backdrop-blur-xl"
                        />
                        <svg className="w-6 h-6 text-gray-400 absolute right-4 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                </div>

                {/* Background Decorations */}
                <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"></div>
                <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl"></div>
            </section>

            {/* Stats Section */}
            <section className="py-8 px-4 border-y border-white/10 bg-white/5">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {[
                            { value: '12+', label: 'AI Tools Listed' },
                            { value: 'Free & Paid', label: 'Pricing Options' },
                            { value: '4K', label: 'Max Quality' },
                            { value: 'Updated', label: 'March 2026' },
                        ].map((stat, index) => (
                            <div key={index} className="text-center">
                                <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                                <div className="text-gray-400 text-sm">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Tools Grid */}
            <section className="py-20 px-4">
                <div className="max-w-7xl mx-auto">
                    <div className="flex items-center justify-between mb-10">
                        <h2 className="text-2xl font-bold text-white">All AI Video Tools</h2>
                        <div className="flex items-center gap-2">
                            <span className="text-gray-400 text-sm">Sort by:</span>
                            <select className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500">
                                <option>Popular</option>
                                <option>Newest</option>
                                <option>Name</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {aiVideoTools.map((tool: AIVideoTool) => (
                            <div
                                key={tool.id}
                                className="group relative bg-white/10 rounded-2xl border border-white/10 hover:border-purple-500/50 transition-all duration-300 overflow-hidden hover:shadow-2xl hover:shadow-purple-500/20"
                            >
                                {/* Badge */}
                                {tool.badge && (
                                    <div className="absolute top-4 right-4 z-10">
                                        <span
                                            className="px-3 py-1 rounded-full text-xs font-semibold text-white"
                                            style={{ backgroundColor: tool.badgeColor }}
                                        >
                                            {tool.badge}
                                        </span>
                                    </div>
                                )}

                                <div className="p-6">
                                    {/* Avatar */}
                                    <div className="flex items-center gap-4 mb-4">
                                        <div
                                            className="w-14 h-14 rounded-xl flex items-center justify-center text-white font-bold text-xl"
                                            style={{ backgroundColor: tool.avatarColor }}
                                        >
                                            {tool.name.charAt(0)}
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold text-white group-hover:text-purple-400 transition-colors">
                                                {tool.name}
                                            </h3>
                                            <p className="text-gray-400 text-sm">{tool.quality}</p>
                                        </div>
                                    </div>

                                    {/* Description */}
                                    <p className="text-gray-300 text-sm mb-4 line-clamp-3">
                                        {tool.description}
                                    </p>

                                    {/* Features */}
                                    <div className="flex flex-wrap gap-2 mb-4">
                                        {tool.features.slice(0, 3).map((feature, index) => (
                                            <span
                                                key={index}
                                                className="px-2 py-1 rounded-lg bg-white/10 text-gray-300 text-xs"
                                            >
                                                {feature}
                                            </span>
                                        ))}
                                        {tool.features.length > 3 && (
                                            <span className="px-2 py-1 rounded-lg bg-white/10 text-gray-400 text-xs">
                                                +{tool.features.length - 3} more
                                            </span>
                                        )}
                                    </div>

                                    {/* Stats */}
                                    <div className="grid grid-cols-2 gap-3 mb-4">
                                        <div className="bg-white/5 rounded-lg p-3">
                                            <p className="text-gray-500 text-xs mb-1">Duration</p>
                                            <p className="text-white text-sm font-medium">{tool.maxDuration}</p>
                                        </div>
                                        <div className="bg-white/5 rounded-lg p-3">
                                            <p className="text-gray-500 text-xs mb-1">Pricing</p>
                                            <p className="text-white text-sm font-medium">{tool.pricing}</p>
                                        </div>
                                    </div>

                                    {/* Action Button */}
                                    <a
                                        href={tool.website}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold hover:from-purple-500 hover:to-pink-500 transition-all duration-300 group-hover:shadow-lg group-hover:shadow-purple-500/30"
                                    >
                                        Visit Website
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                        </svg>
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 px-4">
                <div className="max-w-4xl mx-auto text-center">
                    <div className="relative bg-gradient-to-br from-purple-600/20 to-pink-600/20 rounded-3xl p-12 border border-white/10">
                        <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 to-pink-600/10 rounded-3xl"></div>
                        <div className="relative">
                            <h2 className="text-3xl font-bold text-white mb-4">
                                Want to get featured?
                            </h2>
                            <p className="text-gray-300 mb-8 max-w-xl mx-auto">
                                Submit your AI video generation tool and get discovered by thousands of creators looking for the best tools.
                            </p>
                            <button className="px-8 py-4 rounded-xl bg-white text-purple-900 font-semibold hover:bg-gray-100 transition-colors">
                                Submit Your Tool
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t border-white/10 py-12 px-4">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <span className="text-white font-semibold">FitoSys AI Videos</span>
                        </div>
                        <div className="flex items-center gap-6 text-gray-400 text-sm">
                            <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
                            <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
                            <span>© 2026 FitoSys. All rights reserved.</span>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
