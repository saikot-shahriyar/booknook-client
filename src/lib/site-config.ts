export const siteConfig = {
  name: "BookNook",
  shortName: "BookNook",
  tagline: "A Small Online Library",
  description:
    "A modern digital sanctuary for book lovers. Discover thousands of stories, manage your borrows, and cultivate your passion for reading.",
  contact: {
    email: "contact@booknook.library",
    phone: "+1 (800) 555-2665",
    address: "42 Library Square, Reading City, NY 10001",
    hours: "Mon – Fri: 9:00 AM – 6:00 PM EST",
  },
  social: {
    x: "https://x.com/booknook",
    github: "https://github.com",
    linkedin: "https://linkedin.com",
    facebook: "https://facebook.com",
  },
  nav: {
    public: [
      { title: "Home", href: "/" },
      { title: "All Books", href: "/books" },
    ],
    // Reserved for authenticated sessions (Better Auth integration in future phase)
    private: [
      { title: "Add Book", href: "/add-book" },
      { title: "My Books", href: "/my-books" },
      { title: "My Borrows", href: "/my-borrows" },
    ],
  },
  categories: [
    { title: "Fiction", href: "/books?category=Fiction" },
    { title: "Science", href: "/books?category=Science" },
    { title: "History", href: "/books?category=History" },
    { title: "Kids", href: "/books?category=Kids" },
    { title: "Others", href: "/books?category=Others" },
  ],
};

export type SiteConfig = typeof siteConfig;
