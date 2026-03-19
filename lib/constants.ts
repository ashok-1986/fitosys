export const NAV_LINKS = [
    { label: "Features", href: "#features" },
    { label: "How it Works", href: "#how-it-works" },
    { label: "Pricing", href: "#pricing" },
    { label: "Stories", href: "#stories" },
];

export const HERO_STATS = {
    responseRate: { value: "73%", label: "Response Rate" },
    avgEnergy: { value: "7.1", label: "Avg Energy" },
    atRisk: { value: "3", label: "Need Attention" },
};

export const PROBLEM_ITEMS = [
    {
        title: "Client Ghosting",
        description: "They sign up, pay, and then disappear by week 3 because Excel sheets don't check in on them.",
    },
    {
        title: "Sunday Spreadsheet Hell",
        description: "Spending your entire rest day tracking down who did their workouts and who missed them.",
    },
    {
        title: "Lost Renewals",
        description: "Losing thousands because you forgot to tell a client their 12-week program ended yesterday.",
    },
];

export const FEATURES = [
    {
        title: "WhatsApp Check-ins",
        description: "Automated, branded messages sent exactly when your clients need them. Replies are auto-captured.",
    },
    {
        title: "AI Summaries",
        description: "Every Monday morning, get a prioritised brief of who is thriving and who is at risk of churning.",
    },
    {
        title: "Zero-Friction Payments",
        description: "Integrated Razorpay. Automatic GST invoices. Instant dashboard updates when a client pays.",
    },
    {
        title: "Renewal Intelligence",
        description: "Automated reminders 7 days and 3 days before a program expires. Never miss a renewal again.",
    },
    {
        title: "Program Blueprints",
        description: "Build a program once. Assign it to 50 clients. The system handles the scheduling and progression.",
    },
    {
        title: "Client Health Pulse",
        description: "A single dashboard showing red, yellow, and green indicators for every client on your roster.",
    },
];

export const HOW_IT_WORKS_STEPS = [
    { title: "Onboard instantly", description: "Send a payment link. The system handles the rest." },
    { title: "Automate Check-ins", description: "Set the schedule. WhatsApp does the heavy lifting." },
    { title: "Review Summaries", description: "Read Monday's AI brief. Action the 20% that matters." },
    { title: "Scale Revenue", description: "Watch renewals hit your bank account automatically." },
];

export const PRICING_PLANS = [
    {
        name: "Starter",
        price: "999",
        limit: "Up to 10 clients",
        features: [
            "WhatsApp check-ins (auto)",
            "Razorpay onboarding",
            "Renewal reminders",
            "GST invoice generation",
            "Coach dashboard",
        ],
    },
    {
        name: "Growth",
        price: "2499",
        limit: "Up to 50 clients",
        features: [
            "Everything in Starter",
            "AI Monday summary",
            "At-risk client flagging",
            "AI coach insight",
            "Full check-in history",
        ],
        popular: true,
    },
    {
        name: "Scale",
        price: "4999",
        limit: "Unlimited clients",
        features: [
            "Everything in Growth",
            "Custom check-in templates",
            "Program-specific flows",
            "Renewal analytics",
            "WhatsApp priority support",
        ],
    },
];

export const TESTIMONIALS = [
    {
        quote: "I was losing 2-3 renewals per month simply because I forgot to follow up. Fitosys caught 4 renewals in the first month alone.",
        roi: "₹1.8L",
        roiLabel: "annual revenue recovered",
        name: "Rahul Verma",
        role: "Yoga Instructor",
        location: "Delhi",
        clients: "22 active clients",
        initial: "R",
    },
    {
        quote: "I used to spend every Sunday sending check-in messages manually to 28 clients. Now I wake up Monday morning to an AI summary.",
        roi: "2.5h",
        roiLabel: "saved every week",
        name: "Priya Sharma",
        role: "Fitness Coach",
        location: "Mumbai",
        clients: "28 active clients",
        initial: "P",
    },
    {
        quote: "My clients actually comment that the check-in system feels personal. The AI replies match the tone I set - it genuinely feels like a message from me.",
        roi: "94%",
        roiLabel: "check-in response rate",
        name: "Ananya Krishnan",
        role: "Nutrition Coach",
        location: "Bangalore",
        clients: "35 active clients",
        initial: "A",
    },
];

export const ABOUT_STATS = [
    { value: "₹72K", label: "Average annual revenue recovered per coach" },
    { value: "130+", label: "Hours saved per year from admin automation" },
    { value: "30min", label: "Average setup time for new coaches" },
    { value: "₹999", label: "Starting price - less than one skipped session" },
];
