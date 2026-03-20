export const NAV_LINKS = [
    { label: "Features", href: "#features" },
    { label: "How it Works", href: "#how-it-works" },
    { label: "Pricing", href: "#pricing" },
    { label: "Stories", href: "#stories" },
    { label: "About", href: "#about" },
];

export const HERO_STATS = {
    responseRate: { value: "73%", label: "Response Rate" },
    avgEnergy: { value: "7.1", label: "Avg Energy" },
    atRisk: { value: "3", label: "Need Attention" },
};

export const PROBLEM_ITEMS = [
    {
        num: "01",
        tag: "Revenue Leakage",
        title: "Clients disappear after programs end. You chase. They ghost.",
        description: "Programs expire and coaches find out only when the client stops responding. No system. No reminders. No recovery.",
        badge: "₹72K–₹1.08L lost annually per coach",
    },
    {
        num: "02",
        tag: "Engagement Blind Spot",
        title: "You only know a client is struggling when they stop paying.",
        description: "Without structured check-ins, coaches have no data on client progress until the client complains or drops out.",
        badge: "10–20% annual churn from retention blindness",
    },
    {
        num: "03",
        tag: "Admin Burnout",
        title: "Sunday evening sending 30 check-in messages by hand. Sound familiar?",
        description: "WhatsApp follow-ups. Payment reconciliation. Manual onboarding. Time that should go to clients, content, or recovery.",
        badge: "8–12 hours/week average admin overhead",
    },
];

export const FEATURES = [
    {
        num: "01",
        title: "Where Your Clients Already Are.",
        description: "India runs on WhatsApp. So does Fitosys. Your clients never need to download an app, and you run your whole business from the tool they use daily.",
        tag: "WhatsApp Native",
        tagColor: "wa",
    },
    {
        num: "02",
        title: "Weekly Check-in System",
        description: "Every Sunday, every active client gets a structured check-in. Their reply is stored automatically. You review a clean AI summary on Monday.",
        tag: "WhatsApp Native",
        tagColor: "wa",
    },
    {
        num: "03",
        title: "Renewal Reminder Automation",
        description: "Programs expiring in 7 days trigger automatic WhatsApp reminders. A follow-up fires after 48 hours if no reply. Never lose a renewal again.",
        tag: "WhatsApp Native",
        tagColor: "wa",
    },
    {
        num: "04",
        title: "Every Monday, a brief.",
        description: "Every Monday at 7AM, Fitosys tells you which clients need a call, which ones are at risk of leaving, and what to do about it. No data science degree required.",
        tag: "AI Powered",
        tagColor: "ai",
    },
    {
        num: "05",
        title: "GST Invoice Generation",
        description: "Every Razorpay payment automatically generates a GST-compliant invoice delivered via email. No manual invoice creation ever again.",
        tag: "Compliance Built-in",
        tagColor: "fin",
    },
    {
        num: "06",
        title: "Coach Dashboard",
        description: "Every client's status, check-in history, payment timeline, and renewal date — in one clean view. No spreadsheets. No app switching.",
        tag: "Real-time Data",
        tagColor: "ai",
    },
];

export const HOW_IT_WORKS_STEPS = [
    { num: "1", title: "Sign Up & Create Profile", description: "Create your Fitosys account. Add your coaching type, WhatsApp business number, and Razorpay details.", time: "⏱ 5 minutes" },
    { num: "2", title: "Create Your First Program", description: "Define your coaching program — name, duration, price, and check-in schedule. Get your unique onboarding link.", time: "⏱ 8 minutes" },
    { num: "3", title: "Share Your Link", description: "Send your link to new clients. They fill details, pay via UPI or card, get a WhatsApp welcome. You get notified.", time: "⏱ 15 min to first client" },
    { num: "4", title: "Fitosys Runs the Rest", description: "Check-ins fire every Sunday. AI summary arrives Monday. Renewal reminders go out 7 days before program ends.", time: "⏱ Runs forever" },
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
        quote: "I run a yoga studio in Delhi. Renewals used to happen by chance — whenever I remembered to follow up. Fitosys sent the reminder at T-7 days with the client's own progress data. Three clients renewed the same week I launched. ₹18,000 I would have lost otherwise.",
        roi: "₹1.8L",
        roiLabel: "annual revenue recovered",
        name: "Rahul Verma",
        role: "Yoga Instructor",
        location: "Delhi",
        clients: "22 active clients",
        initial: "R",
    },
    {
        quote: "Sunday raat 11 baj gaye the. Main abhi bhi 18 clients ko check-in messages bhej raha tha. Yeh koi business nahi tha — yeh madness tha. Now I wake up Monday morning to an AI summary instead.",
        roi: "2.5h",
        roiLabel: "saved every week",
        name: "Priya Sharma",
        role: "Fitness Coach",
        location: "Mumbai",
        clients: "28 active clients",
        initial: "P",
    },
    {
        quote: "My clients actually comment that the check-in system feels personal. The AI replies match the tone I set — it genuinely feels like a message from me. Not one client has asked if it's automated.",
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
    { value: "₹999", label: "Starting price — less than one skipped session" },
];

export const FAQS = [
    {
        q: "Will my clients think the messages are automated and feel less personal?",
        a: "No. Every message goes out from your WhatsApp number, in your name, with your client's first name. To them, it looks exactly like a message from you. The only difference is you didn't spend Sunday night sending 30 of them.",
    },
    {
        q: "What happens after the 14-day free trial?",
        a: "You pick a plan that fits your client count. No data is lost. No setup needed — everything continues seamlessly. Cancel anytime.",
    },
    {
        q: "Do I need any technical skills to set this up?",
        a: "Zero. If you can send a WhatsApp message, you can set up Fitosys. Average setup time is 30 minutes. We handle the rest.",
    },
    {
        q: "Is this actually built for Indian coaches?",
        a: "Yes. Razorpay for payments. GST invoicing built in. WhatsApp as the primary channel. Pricing in INR. We are not a US product with an Indian price tag.",
    },
    {
        q: "What if a client doesn't respond to the check-in?",
        a: "Fitosys flags them as at-risk in your Monday AI summary. You see exactly who hasn't responded and can follow up personally — but only with the ones who need it.",
    },
];
