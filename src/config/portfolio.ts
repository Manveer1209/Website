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
      id: "cert-placeholder-1",
      title: "Professional Python Developer",
      issuer: "Python Institute (Example)",
      date: "Expected 2026",
      credentialUrl: "#",
      previewText: "PY-CORE"
    },
    {
      id: "cert-placeholder-2",
      title: "Linux System Administration",
      issuer: "Linux Foundation (Example)",
      date: "Expected 2026",
      credentialUrl: "#",
      previewText: "LFS-201"
    }
  ],
  contact: {
    email: "uppalkeshav0912@gmail.com",
    linkedin: "https://www.linkedin.com/in/keshav-uppal-296846365/",
    discord: "manveer_1209"
  }
};
