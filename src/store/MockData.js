import { addDays, subDays } from 'date-fns';

export const MOCK_MEMBERS = [
  { id: 'u1', name: 'Alice Smith',   email: 'alice@hoversagency.com',   role: 'Admin',            avatar: 'https://i.pravatar.cc/150?u=1', status: 'Available' },
  { id: 'u2', name: 'Bob Jones',     email: 'bob@hoversagency.com',     role: 'Executive',         avatar: 'https://i.pravatar.cc/150?u=2', status: 'Busy' },
  { id: 'u3', name: 'Charlie Davis', email: 'charlie@hoversagency.com', role: 'Graphic Designer',  avatar: 'https://i.pravatar.cc/150?u=3', status: 'Do Not Disturb' },
  { id: 'u4', name: 'Diana Prince',  email: 'diana@hoversagency.com',   role: 'Executive',         avatar: 'https://i.pravatar.cc/150?u=4', status: 'Available' },
  { id: 'u5', name: 'Evan Wright',   email: 'evan@hoversagency.com',    role: 'Graphic Designer',  avatar: 'https://i.pravatar.cc/150?u=5', status: 'Away' },
  { id: 'u6', name: 'James Park',    email: 'james@hoversagency.com',   role: 'Manager',           avatar: 'https://i.pravatar.cc/150?u=6', status: 'Available' },
];

export const MOCK_SPACES = [
  { id: 'sp1', name: 'Nova Brand',    color: '#111111', icon: '🚀' },
  { id: 'sp2', name: 'Peak Retail',   color: '#e91e63', icon: '🛍️' },
  { id: 'sp3', name: 'Bloom Studio',  color: '#ff6900', icon: '🌸' },
];

export const MOCK_LISTS = [
  { id: 'l1', spaceId: 'sp1', name: 'Q3 Social Campaign' },
  { id: 'l2', spaceId: 'sp1', name: 'Print & OOH Materials' },
  { id: 'l3', spaceId: 'sp2', name: 'Influencer Campaign' },
  { id: 'l4', spaceId: 'sp3', name: 'Rebrand Project' },
];

const today = new Date();

export const TASK_TYPES = ['Static', 'Video', 'Design', 'Copy', 'Strategy', 'Other'];

export const MOCK_TASKS = [
  {
    id: 't1',
    listId: 'l1',
    title: 'Create Homepage Banner Static',
    description: 'Design a 1200x628px static banner for the homepage hero section. Use brand colors and the new tagline.',
    status: 'In Progress',
    priority: 'High',
    type: 'Static',
    assignees: ['u2'],
    assignedBy: 'u6',
    dueDate: addDays(today, 2).toISOString(),
    tags: ['Design'],
    timeEstimate: 4 * 60,
    timeTracked: 2 * 60,
    comments: [
      { id: 'c1t1', authorId: 'u6', authorName: 'James Park', authorAvatar: 'https://i.pravatar.cc/150?u=6', text: 'Make sure to use the updated brand colors from the style guide. Check the shared drive for the latest assets.', timestamp: subDays(today, 1).toISOString() }
    ]
  },
  {
    id: 't2',
    listId: 'l1',
    title: 'Produce Product Launch Video',
    description: 'Create a 60-second product launch video highlighting the top 3 features. Include captions.',
    status: 'To Do',
    priority: 'Urgent',
    type: 'Video',
    assignees: ['u3'],
    assignedBy: 'u6',
    dueDate: addDays(today, 1).toISOString(),
    tags: ['Content'],
    timeEstimate: 8 * 60,
    timeTracked: 0,
    comments: []
  },
  {
    id: 't3',
    listId: 'l1',
    title: 'Instagram Story Set (5 frames)',
    description: 'Design 5-frame Instagram story sequence for the new collection drop. Size: 1080x1920.',
    status: 'Review',
    priority: 'Normal',
    type: 'Static',
    assignees: ['u3'],
    assignedBy: 'u1',
    dueDate: subDays(today, 1).toISOString(),
    tags: ['Social'],
    timeEstimate: 3 * 60,
    timeTracked: 3 * 60,
    comments: []
  },
  {
    id: 't4',
    listId: 'l2',
    title: 'Write Q3 Campaign Email Copy',
    description: 'Write subject line, preview text and body copy for the Q3 campaign email. 250 words max.',
    status: 'Done',
    priority: 'High',
    type: 'Copy',
    assignees: ['u4'],
    assignedBy: 'u1',
    dueDate: subDays(today, 5).toISOString(),
    tags: ['Email'],
    timeEstimate: 4 * 60,
    timeTracked: 4 * 60,
    comments: []
  },
  {
    id: 't5',
    listId: 'l2',
    title: 'Facebook Ad Creative (Static)',
    description: 'Create 3 static ad variants (1200x628) for A/B testing. Follow the brief in the shared drive.',
    status: 'Blocked',
    priority: 'Urgent',
    type: 'Static',
    assignees: ['u5'],
    assignedBy: 'u6',
    dueDate: today.toISOString(),
    tags: ['Ads'],
    timeEstimate: 3 * 60,
    timeTracked: 1 * 60,
    comments: [
      { id: 'c1t5', authorId: 'u5', authorName: 'Evan Wright', authorAvatar: 'https://i.pravatar.cc/150?u=5', text: "Stuck — I don't have access to the creative brief. Can someone share the folder link?", timestamp: today.toISOString() }
    ]
  },
  {
    id: 't6',
    listId: 'l3',
    title: 'YouTube Thumbnail Batch (10 videos)',
    description: 'Create 10 YouTube thumbnails for the weekly content batch. Template is in the shared drive.',
    status: 'To Do',
    priority: 'Normal',
    type: 'Static',
    assignees: ['u2'],
    assignedBy: 'u1',
    dueDate: addDays(today, 7).toISOString(),
    tags: ['YouTube'],
    timeEstimate: 4 * 60,
    timeTracked: 0,
    comments: []
  },
  {
    id: 't7',
    listId: 'l4',
    title: 'Edit Brand Reel Video',
    description: 'Edit a 30-second brand reel using the footage from last shoot. Add background music and captions.',
    status: 'In Progress',
    priority: 'High',
    type: 'Video',
    assignees: ['u3'],
    assignedBy: 'u6',
    dueDate: addDays(today, 3).toISOString(),
    tags: ['Reel'],
    timeEstimate: 6 * 60,
    timeTracked: 2 * 60,
    comments: []
  },
  {
    id: 't8',
    listId: 'l4',
    title: 'Campaign Strategy Deck — Q4',
    description: 'Prepare the Q4 campaign strategy presentation covering target audiences, channels, budget split, and KPIs.',
    status: 'To Do',
    priority: 'High',
    type: 'Strategy',
    assignees: ['u4'],
    assignedBy: 'u1',
    dueDate: addDays(today, 10).toISOString(),
    tags: ['Strategy'],
    timeEstimate: 5 * 60,
    timeTracked: 0,
    comments: []
  }
];

export const STATUS_COLUMNS = ['To Do', 'In Progress', 'Review', 'Blocked', 'Done'];

export const BRAND_GUIDELINES = {
  sp1: {
    spaceId: 'sp1',
    name: 'Nova Brand',
    icon: '🚀',
    colors: [
      { name: 'Midnight Black', hex: '#111111' },
      { name: 'Electric Lime',  hex: '#E8FF00' },
      { name: 'Cloud White',    hex: '#F5F5F5' },
      { name: 'Charcoal',       hex: '#444444' },
    ],
    fonts: {
      display: { name: 'Neue Haas Grotesk', weight: '700–900', note: 'Headlines & hero text only' },
      body:    { name: 'IBM Plex Mono',      weight: '400',     note: 'Body copy & UI labels' },
    },
    dos: [
      'Use bold, high-contrast typography throughout',
      'Maintain generous white space — less is always more',
      'Apply Electric Lime as a single precise accent',
      'Keep layouts strictly minimal and grid-aligned',
    ],
    donts: [
      'Never use decorative or script typefaces',
      'No gradients, drop shadows, or heavy effects',
      'Don\'t mix multiple accent colors in one piece',
      'Avoid rounded "friendly" design elements',
    ],
  },
  sp2: {
    spaceId: 'sp2',
    name: 'Peak Retail',
    icon: '🛍️',
    colors: [
      { name: 'Vivid Pink',  hex: '#E91E63' },
      { name: 'Coral Blush', hex: '#FF6B6B' },
      { name: 'Blush White', hex: '#FFF9F9' },
      { name: 'Deep Navy',   hex: '#1A1A2E' },
    ],
    fonts: {
      display: { name: 'Playfair Display', weight: '700', note: 'Headlines & campaign titles' },
      body:    { name: 'Lato',             weight: '400', note: 'Descriptions & body copy' },
    },
    dos: [
      'Lead with lifestyle imagery — aspirational, warm',
      'Use Vivid Pink as the primary CTA color',
      'Keep copy concise — let visuals do the talking',
      'Feminine, inviting, and optimistic aesthetic',
    ],
    donts: [
      'Never use cold or desaturated blues unanchored',
      'Avoid generic or clearly staged stock photography',
      'Don\'t crowd product shots with excessive text',
      'No dark moody color treatments',
    ],
  },
  sp3: {
    spaceId: 'sp3',
    name: 'Bloom Studio',
    icon: '🌸',
    colors: [
      { name: 'Tangerine',    hex: '#FF6900' },
      { name: 'Peach Cream',  hex: '#FFE0B2' },
      { name: 'Forest Green', hex: '#2D4A3E' },
      { name: 'Parchment',    hex: '#FAFAFA' },
    ],
    fonts: {
      display: { name: 'Cormorant Garamond', weight: '600', note: 'Headlines — artisanal serif feel' },
      body:    { name: 'Karla',              weight: '400', note: 'Body copy — grounded & readable' },
    },
    dos: [
      'Embrace earthy, botanical, and handcrafted vibes',
      'Layer organic textures with natural tones',
      'Use serif display fonts to convey artisan quality',
      'Let imperfection breathe — not everything symmetrical',
    ],
    donts: [
      'Never use synthetic neon or electric colors',
      'Avoid hard drop shadows or heavy outlines',
      'Don\'t apply rigid corporate grid layouts',
      'No staged or obviously AI-generated imagery',
    ],
  },
};
