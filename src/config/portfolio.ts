export const portfolioConfig = {
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
    currentlyLearning: [
      "Git"
    ],
    status: "Always learning."
  },
  skills: {
    languages: ["Python"],
    operatingSystems: ["Arch Linux", "Windows"],
    currentlyLearning: ["Git"],
    interests: ["Linux Ricing", "Open Source", "Photography", "System Customization"]
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
      id: "findmyy-hackathon-1",
      title: "2nd Place - findmyy's 1st Hackathon",
      issuer: "findmyy & Youthub",
      date: "2026",
      credentialUrl: "/findmyy-cert.png",
      previewText: "HACK-2ND"
    }
  ],
  contact: {
    email: "uppalkeshav0912@gmail.com",
    linkedin: "https://www.linkedin.com/in/keshav-uppal-296846365/",
    discord: "manveer_1209"
  }
};
