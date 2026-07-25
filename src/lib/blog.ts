export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  readTime: string;
  content: string[];
};

export const blogPosts: BlogPost[] = [
  {
    slug: "why-gold-stays-valuable",
    title: "Why gold remains a lasting store of value",
    excerpt: "From ancient coins to modern investment bars, gold has long held its role as a trusted hedge against volatility.",
    category: "Investment",
    readTime: "5 min read",
    content: [
      "Gold is prized because it combines scarcity, durability, and global recognition. Unlike paper currency, it cannot be printed at will, which gives it enduring value in uncertain markets.",
      "Across centuries, gold has served as both ornament and insurance. Investors often turn to it when inflation rises or currencies fluctuate, because its value is rooted in trust rather than policy.",
      "For collectors, the appeal is equally emotional: each piece carries history, craftsmanship, and long-term desirability.",
    ],
  },
  {
    slug: "how-to-choose-between-18k-and-24k",
    title: "How to choose between 18K and 24K gold",
    excerpt: "Understanding karatage helps you balance durability, value, and design when buying gold jewelry.",
    category: "Education",
    readTime: "4 min read",
    content: [
      "18K gold contains 75% pure gold and is more durable for everyday jewelry, making it popular for rings and bracelets that see regular wear.",
      "24K gold is purer and more luminous, but also softer, so it is often favored for investment pieces and ceremonial jewelry.",
      "Choosing between them comes down to whether you prioritize resilience, purity, or a balance of both.",
    ],
  },
  {
    slug: "what-makes-a-gold-piece-investment-grade",
    title: "What makes a gold piece investment grade",
    excerpt: "A piece can be beautiful and still be a strong investment when weight, purity, and provenance align.",
    category: "Collecting",
    readTime: "6 min read",
    content: [
      "Investment-grade gold jewelry and bullion are valued for their purity, weight, and authenticity. A clear hallmark and certificate of authenticity matter greatly.",
      "The best pieces are made with recognized standards and can be easily verified for weight, karat, and origin.",
      "Whether you buy a bar or a handcrafted jewel, documentation and craftsmanship can preserve value over time.",
    ],
  },
];
