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
        title: "Renewals slip. Silently.",
        description: "Programs expire and you find out when the client stops responding. No reminder fired. No system caught it. At ₹3,000 to ₹8,000 per client per month, that is real money gone quietly.",
        badge: "₹72,000+ lost annually on average",
    },
    {
        num: "02",
        tag: "Engagement Blindspot",
        title: "You can't see who's about to leave.",
        description: "Without structured check-ins, there is no early warning. By the time a client's energy drops or sessions start slipping, the relationship has already cooled. You catch it after the fact — not before.",
        badge: "10–20% annual churn from retention blindness",
    },
    {
        num: "03",
        tag: "Admin Burnout",
        title: "Sunday evenings are not yours.",
        description: "Manual check-ins. Payment follow-ups. Onboarding over 4 WhatsApp exchanges. Coaches with 25 clients spend 3 to 5 hours a week on tasks a system should handle.",
        badge: "3–5 hours of admin every week",
    },
];

export const FEATURES = [
    {
        num: "01",
        title: "Onboarding in one link",
        description: "Share one link. Your client fills the intake form, picks a program, and pays via UPI or card. They get a WhatsApp welcome automatically. You get notified. No back-and-forth. No awkward payment conversation.",
        tag: "WhatsApp Native",
        tagColor: "wa",
    },
    {
        num: "02",
        title: "Check-ins without lifting a finger",
        description: "Every Sunday at 7 PM, structured check-ins go out to every active client — in your name, from your number. Replies are stored automatically. Monday morning you receive a 2-minute AI summary showing exactly who needs your attention that week.",
        tag: "WhatsApp Native",
        tagColor: "wa",
    },
    {
        num: "03",
        title: "Never lose a renewal again",
        description: "7 days before a program ends, a personalised reminder fires with the client's own progress data. If there is no reply in 48 hours, a follow-up goes out. Renewals get caught before they lapse — without you thinking about it.",
        tag: "WhatsApp Native",
        tagColor: "wa",
    },
    {
        num: "04",
        title: "Know who needs you. Every Monday.",
        description: "Gemini AI reads every check-in response and delivers one clear brief to your WhatsApp by 7 AM Monday. Response rates, energy trends, at-risk clients — sorted and prioritised.",
        tag: "AI Powered",
        tagColor: "ai",
    },
    {
        num: "05",
        title: "Every payment. Every invoice. Automatic.",
        description: "Every Razorpay payment triggers a GST-compliant invoice, generated and emailed automatically. No manual invoicing. Built for Indian coaches from day one.",
        tag: "Compliance Built-in",
        tagColor: "fin",
    },
    {
        num: "06",
        title: "Your whole business. One screen.",
        description: "Every client's status, check-in history, payment timeline, and renewal date — in one clean view. No spreadsheets. No app switching.",
        tag: "Real-time Data",
        tagColor: "ai",
    },
];

export const HOW_IT_WORKS_STEPS = [
    { num: "1", title: "Sign up and create your profile", description: "Add your coaching type, WhatsApp number, and Razorpay details. Takes 5 minutes.", time: "5 minutes" },
    { num: "2", title: "Create your first program", description: "Set a name, duration, price, and check-in schedule. Get your unique onboarding link.", time: "8 minutes" },
    { num: "3", title: "Share your link", description: "Send it on WhatsApp or Instagram. Client fills the form, pays, gets a welcome message. You get notified instantly.", time: "15 minutes to first client" },
    { num: "4", title: "Fitosys runs the rest", description: "Check-ins fire every Sunday. AI summary arrives Monday. Renewal reminders go out 7 days before programs end. Every week. Without you.", time: "Runs automatically" },
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
        quote: "I used to spend every Sunday sending check-in messages manually to 28 clients. Now I wake up Monday to an AI summary and spend the time on an actual rest day.",
        roi: "2.5 hrs",
        roiLabel: "saved every week — 130 hours per year back",
        name: "Priya S.",
        role: "Fitness Coach",
        location: "Mumbai",
        clients: "28 active clients",
        initial: "P",
    },
    {
        quote: "I was losing 2 to 3 renewals a month because I forgot to follow up. Fitosys caught 4 renewals in the first month. That is more than ₹15,000 in one month alone.",
        roi: "₹1.8L",
        roiLabel: "annual renewal revenue recovered",
        name: "Rahul V.",
        role: "Yoga Instructor",
        location: "Delhi",
        clients: "22 active clients",
        initial: "R",
    },
    {
        quote: "My clients comment that the check-in feels personal. They do not know it is automated. The message goes out in my name, from my number. That is the detail that matters.",
        roi: "94%",
        roiLabel: "check-in response rate — up from 60%",
        name: "Ananya K.",
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
