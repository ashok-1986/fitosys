// AI Video Generation Models Data

export interface AIVideoTool {
    id: string;
    name: string;
    description: string;
    website: string;
    pricing: string;
    features: string[];
    maxDuration: string;
    quality: string;
    avatarColor: string;
    badge?: string;
    badgeColor?: string;
}

export const aiVideoTools: AIVideoTool[] = [
    {
        id: 'sora',
        name: 'OpenAI Sora',
        description: 'Advanced AI model that generates realistic and imaginative videos from text prompts. Capable of creating complex scenes with multiple characters and specific motions.',
        website: 'https://sora.openai.com',
        pricing: 'Coming Soon',
        features: ['Text-to-Video', 'Image-to-Video', 'Complex Scene Generation', 'Physics Simulation'],
        maxDuration: 'Up to 20 seconds',
        quality: 'Ultra HD',
        avatarColor: '#10a37f',
        badge: 'Most Popular',
        badgeColor: '#10a37f'
    },
    {
        id: 'runway',
        name: 'Runway Gen-3 Alpha',
        description: 'State-of-the-art video generation platform with exceptional motion coherence and visual quality. Industry leader in AI video production.',
        website: 'https://runwayml.com',
        pricing: 'Free / $35/mo',
        features: ['Text-to-Video', 'Motion Brush', 'Infinite Extend', 'Director Mode'],
        maxDuration: 'Up to 10 seconds',
        quality: 'High Definition',
        avatarColor: '#8b5cf6'
    },
    {
        id: 'pika',
        name: 'Pika Labs',
        description: 'Fast and intuitive AI video generator perfect for quick content creation. Supports various styles and offers real-time editing capabilities.',
        website: 'https://pika.art',
        pricing: 'Free / $15/mo',
        features: ['Text-to-Video', 'Image Animation', 'Video Editing', 'Style Transfer'],
        maxDuration: 'Up to 3 seconds',
        quality: 'HD',
        avatarColor: '#f59e0b'
    },
    {
        id: 'kling',
        name: 'Kling AI',
        description: 'Powerful video generation tool from Kuaishou with impressive motion quality and cinematic outputs. Excellent for professional content creators.',
        website: 'https://klingai.com',
        pricing: 'Coming Soon',
        features: ['Text-to-Video', 'Image-to-Video', 'Long Video Generation', 'Cinematic Quality'],
        maxDuration: 'Up to 2 minutes',
        quality: 'Ultra HD',
        avatarColor: '#ef4444'
    },
    {
        id: 'luma',
        name: 'Luma Dream Machine',
        description: 'Advanced video generation with exceptional consistency and realism. Great for creating high-quality marketing and social media content.',
        website: 'https://lumalabs.ai',
        pricing: 'Free / $30/mo',
        features: ['Text-to-Video', 'Image-to-Video', 'Camera Controls', 'Consistent Character Motion'],
        maxDuration: 'Up to 5 seconds',
        quality: 'High Definition',
        avatarColor: '#3b82f6'
    },
    {
        id: 'kling',
        name: 'Kling AI',
        description: 'Powerful video generation tool from Kuaishou with impressive motion quality and cinematic outputs. Excellent for professional content creators.',
        website: 'https://klingai.com',
        pricing: 'Coming Soon',
        features: ['Text-to-Video', 'Image-to-Video', 'Long Video Generation', 'Cinematic Quality'],
        maxDuration: 'Up to 2 minutes',
        quality: 'Ultra HD',
        avatarColor: '#ef4444'
    },
    {
        id: 'runway',
        name: 'Runway Gen-3 Alpha',
        description: 'State-of-the-art video generation platform with exceptional motion coherence and visual quality. Industry leader in AI video production.',
        website: 'https://runwayml.com',
        pricing: 'Free / $35/mo',
        features: ['Text-to-Video', 'Motion Brush', 'Infinite Extend', 'Director Mode'],
        maxDuration: 'Up to 10 seconds',
        quality: 'High Definition',
        avatarColor: '#8b5cf6'
    },
    {
        id: 'pika',
        name: 'Pika Labs',
        description: 'Fast and intuitive AI video generator perfect for quick content creation. Supports various styles and offers real-time editing capabilities.',
        website: 'https://pika.art',
        pricing: 'Free / $15/mo',
        features: ['Text-to-Video', 'Image Animation', 'Video Editing', 'Style Transfer'],
        maxDuration: 'Up to 3 seconds',
        quality: 'HD',
        avatarColor: '#f59e0b'
    },
    {
        id: 'luma',
        name: 'Luma Dream Machine',
        description: 'Advanced video generation with exceptional consistency and realism. Great for creating high-quality marketing and social media content.',
        website: 'https://lumalabs.ai',
        pricing: 'Free / $30/mo',
        features: ['Text-to-Video', 'Image-to-Video', 'Camera Controls', 'Consistent Character Motion'],
        maxDuration: 'Up to 5 seconds',
        quality: 'High Definition',
        avatarColor: '#3b82f6'
    },
    {
        id: 'sora',
        name: 'OpenAI Sora',
        description: 'Advanced AI model that generates realistic and imaginative videos from text prompts. Capable of creating complex scenes with multiple characters and specific motions.',
        website: 'https://sora.openai.com',
        pricing: 'Coming Soon',
        features: ['Text-to-Video', 'Image-to-Video', 'Complex Scene Generation', 'Physics Simulation'],
        maxDuration: 'Up to 20 seconds',
        quality: 'Ultra HD',
        avatarColor: '#10a37f',
        badge: 'Top Rated',
        badgeColor: '#10a37f'
    },
    {
        id: 'pika',
        name: 'Pika Labs',
        description: 'Fast and intuitive AI video generator perfect for quick content creation. Supports various styles and offers real-time editing capabilities.',
        website: 'https://pika.art',
        pricing: 'Free / $15/mo',
        features: ['Text-to-Video', 'Image Animation', 'Video Editing', 'Style Transfer'],
        maxDuration: 'Up to 3 seconds',
        quality: 'HD',
        avatarColor: '#f59e0b'
    },
    {
        id: 'runway',
        name: 'Runway Gen-3 Alpha',
        description: 'State-of-the-art video generation platform with exceptional motion coherence and visual quality. Industry leader in AI video production.',
        website: 'https://runwayml.com',
        pricing: 'Free / $35/mo',
        features: ['Text-to-Video', 'Motion Brush', 'Infinite Extend', 'Director Mode'],
        maxDuration: 'Up to 10 seconds',
        quality: 'High Definition',
        avatarColor: '#8b5cf6'
    },
];
