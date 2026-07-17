export const siteConfig = {
  name: "Keshav Uppal",
  role: "Student",
  titles: [
    "Linux Enthusiast",
    "Developer",
    "Open Source Learner",
    "Student"
  ],
  githubUsername: "Manveer1209", // Connects client-side GitHub statistics
  githubRepoName: "Website", // The repository name of this website
  githubToken: process.env.NEXT_PUBLIC_GITHUB_TOKEN || "", // Optional Personal Access Token for rate limits
  about: {
    name: "Keshav Uppal",
    role: "Student & Developer",
    focus: [
      "Python",
      "Linux",
      "Backend (Learning)",
      "Open Source"
    ],
    interests: [
      "Arch Linux Ricing",
      "System Customization",
      "Photography",
      "Tech Events"
    ],
    currentlyLearning: [],
    status: "Always learning."
  },
  skills: {
    languages: ["Python"],
    operatingSystems: ["Arch Linux", "Windows"],
    currentlyLearning: [],
    interests: ["Linux Ricing", "Graphic Designing", "Photography", "System Customization"]
  },
  projects: [
    {
      id: "arch-rice",
      title: "Arch Rice",
      description: "A personalized Arch Linux rice with custom dotfiles, configurations, scripts, and workflow improvements focused on productivity and aesthetics.",
      status: "In Development",
      techStack: ["Hyprland/Bspwm", "Lua", "Bash", "Rofi", "Waybar"],
      githubUrl: "https://github.com/Manveer1209/arch-rice-dotfiles" // Placeholder or actual link
    }
  ],
  certifications: [
    {
      id: "kryptix-26",
      title: "3rd Place - KRYPTIX '26 Capture The Flag",
      issuer: "Kryptix (Mundus Obscurus) & Krypton",
      date: "May 2026",
      credentialUrl: "/kryptix-cert.png",
      previewText: "CTF-3RD"
    },
    {
      id: "finomyy-eduthon-2025",
      title: "2nd Place - finomyy by YouVah",
      issuer: "Finomyy & YouVah",
      date: "2025",
      credentialUrl: "/findmyy-cert.png",
      previewText: "SHUTTER"
    }
  ],
  contact: {
    email: "uppalkeshav0912@gmail.com",
    linkedin: "https://www.linkedin.com/in/keshav-uppal-296846365/",
    discord: "manveer_1209"
  }
};
