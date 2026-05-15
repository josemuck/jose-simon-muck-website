/* perspectives-data.js — Single source of truth for all article metadata */
const PERSPECTIVES_DATA = [
  // ── Strategic Foundations ──────────────────────────────────────────────────
  {
    slug: 'article-product-strategy.html',
    title: 'Product Strategy in Complex Organizations',
    category: 'Product Strategy',
    intro: 'In international organizations, product strategy is rarely only about prioritization. More often, it is about alignment across cultures, teams, and different ways of understanding the same objective.',
    image: 'assets/images/articles/product-strategy-in-complex-organizations.png',
    readTime: '3 min read',
    related: [
      'article-organizational-translation.html',
      'article-product-advice-orgs.html',
      'article-international-growth.html'
    ]
  },
  {
    slug: 'article-ai-workflows.html',
    title: 'AI and the Future of Workflows',
    category: 'AI & Work',
    intro: 'Artificial intelligence will not simply automate tasks. It will reshape how organizations communicate, collaborate, and operate across increasingly complex international environments.',
    image: 'assets/images/articles/ai-and-the-future-of-workflows.png',
    readTime: '3 min read',
    related: [
      'article-transformation-vacuum.html',
      'article-people-transformation.html',
      'article-time-illusion.html'
    ]
  },
  {
    slug: 'article-international-growth.html',
    title: 'International Digital Growth Beyond Localization',
    category: 'International Growth',
    intro: 'International digital growth is not simply a translation exercise. It is the challenge of scaling alignment, trust, and execution across cultures, markets, and organizational realities.',
    image: 'assets/images/articles/international-digital-growth-beyond-localization.png',
    readTime: '3 min read',
    related: [
      'article-international-vs-startups.html',
      'article-organizational-translation.html',
      'article-product-strategy.html'
    ]
  },
  {
    slug: 'article-people-transformation.html',
    title: 'People-Centered Transformation',
    category: 'People-Centered Leadership',
    intro: 'Digital transformation succeeds or fails less because of technology itself and more because of how organizations guide people through complexity, ambiguity, and change.',
    image: 'assets/images/articles/people-centered-transformation.png',
    readTime: '3 min read',
    related: [
      'article-empowered-teams.html',
      'article-transformation-friction.html',
      'article-ai-workflows.html'
    ]
  },

  // ── Organizational Reality ─────────────────────────────────────────────────
  {
    slug: 'article-product-advice-orgs.html',
    title: 'Most Product Advice Assumes Functional Organizations',
    category: 'Product Leadership',
    intro: 'A large portion of modern product thinking assumes organizations already have alignment, trust, clarity, and healthy incentives. Many companies do not.',
    image: 'assets/images/articles/most-product-advice-assumes-functional-organizations.png',
    readTime: '5 min read',
    related: [
      'article-frameworks-reality.html',
      'article-empowered-teams.html',
      'article-transformation-vacuum.html'
    ]
  },
  {
    slug: 'article-empowered-teams.html',
    title: 'Empowered Teams Are Not a Process',
    category: 'Leadership',
    intro: 'Many organizations try to implement empowered teams structurally while preserving the exact conditions that prevent empowerment from existing.',
    image: 'assets/images/articles/empowered-teams-are-not-a-process.png',
    readTime: '4 min read',
    related: [
      'article-pm-influence.html',
      'article-frameworks-reality.html',
      'article-people-transformation.html'
    ]
  },
  {
    slug: 'article-organizational-translation.html',
    title: 'The Most Important Product Skill Is Organizational Translation',
    category: 'Product Management',
    intro: 'At scale, product management becomes less about backlog prioritization and more about translating between people, incentives, cultures, and organizational realities.',
    image: 'assets/images/articles/organizational-translation.png',
    readTime: '4 min read',
    related: [
      'article-international-growth.html',
      'article-international-vs-startups.html',
      'article-product-strategy.html'
    ]
  },
  {
    slug: 'article-frameworks-reality.html',
    title: "Frameworks Don't Survive Organizational Reality",
    category: 'Transformation',
    intro: 'Frameworks are useful until they collide with politics, incentives, legacy systems, acquisitions, market pressure, and organizational complexity.',
    image: 'assets/images/articles/frameworks-vs-organizational-reality.png',
    readTime: '4 min read',
    related: [
      'article-product-advice-orgs.html',
      'article-transformation-vacuum.html',
      'article-transformation-friction.html'
    ]
  },
  {
    slug: 'article-pm-influence.html',
    title: 'The Product Manager Is Often the Least Powerful Person in the Room',
    category: 'Product Leadership',
    intro: 'Modern product discourse often talks about ownership and empowerment. In practice, many product managers operate with responsibility but very limited actual authority.',
    image: 'assets/images/articles/responsibility-without-authority.png',
    readTime: '4 min read',
    related: [
      'article-empowered-teams.html',
      'article-organizational-translation.html',
      'article-frameworks-reality.html'
    ]
  },
  {
    slug: 'article-international-vs-startups.html',
    title: 'Why International Organizations Cannot Be Managed Like Silicon Valley Startups',
    category: 'International Leadership',
    intro: 'Many modern management ideas were born in highly concentrated technology environments. International organizations operate under very different realities.',
    image: 'assets/images/articles/international-orgs-vs-startups.png',
    readTime: '4 min read',
    related: [
      'article-international-growth.html',
      'article-organizational-translation.html',
      'article-product-advice-orgs.html'
    ]
  },

  // ── Transformation Under Pressure ──────────────────────────────────────────
  {
    slug: 'article-transformation-vacuum.html',
    title: 'Transformation Does Not Happen in a Vacuum',
    category: 'Transformation',
    intro: 'Most transformation narratives assume organizations have the luxury of focus. In reality, many companies are trying to transform while simultaneously fighting for relevance, revenue, speed, and survival.',
    image: 'assets/images/articles/transformation-under-pressure.png',
    readTime: '4 min read',
    related: [
      'article-ship-or-die.html',
      'article-competitiveness-goal.html',
      'article-time-illusion.html'
    ]
  },
  {
    slug: 'article-ship-or-die.html',
    title: 'Ship or Die: Why Product Development Looks Different Inside Real Companies',
    category: 'Product Development',
    intro: 'Many organizations are not optimizing for perfect product processes. They are optimizing for survival, speed, market pressure, and business continuity.',
    image: 'assets/images/articles/ship-or-die.png',
    readTime: '4 min read',
    related: [
      'article-transformation-vacuum.html',
      'article-competitiveness-goal.html',
      'article-time-illusion.html'
    ]
  },
  {
    slug: 'article-transformation-friction.html',
    title: 'When Transformation Starts Feeling Like Friction',
    category: 'Transformation',
    intro: 'Transformation fails when organizations introduce complexity faster than teams experience meaningful operational improvement.',
    image: 'assets/images/articles/transformation-friction.png',
    readTime: '4 min read',
    related: [
      'article-people-transformation.html',
      'article-frameworks-reality.html',
      'article-transformation-vacuum.html'
    ]
  },
  {
    slug: 'article-competitiveness-goal.html',
    title: 'Transformation Is Not the Goal. Competitiveness Is.',
    category: 'Business Strategy',
    intro: 'Transformation only matters if it strengthens a company\'s ability to compete, adapt, execute, and survive in increasingly demanding markets.',
    image: 'assets/images/articles/competitiveness-over-transformation.png',
    readTime: '4 min read',
    related: [
      'article-ship-or-die.html',
      'article-transformation-vacuum.html',
      'article-time-illusion.html'
    ]
  },
  {
    slug: 'article-time-illusion.html',
    title: 'The Most Dangerous Transformation Illusion Is Thinking Time Exists',
    category: 'Transformation',
    intro: 'Many organizations behave as if transformation can happen gradually and comfortably while markets continue accelerating around them.',
    image: 'assets/images/articles/time-pressure-and-market-speed.png',
    readTime: '4 min read',
    related: [
      'article-competitiveness-goal.html',
      'article-ship-or-die.html',
      'article-ai-workflows.html'
    ]
  }
];
