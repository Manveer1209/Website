"use client";

import { motion } from "framer-motion";
import { Folder, Info } from "lucide-react";
import { GithubIcon as Github } from "@/components/icons";
import { siteConfig } from "@/config/site";

export default function ProjectsSection() {
  const projects = siteConfig.projects;

  return (
    <div className="w-full max-w-3xl mx-auto space-y-8 font-mono">
      <div className="grid grid-cols-1 gap-8">
        {projects.map((project, idx) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5, delay: idx * 0.15 }}
            className="border border-white/[0.06] bg-white/[0.01] rounded-lg overflow-hidden flex flex-col hover:border-violet-400/20 transition-all duration-300 accent-glow-box"
          >
            {/* Project Card Header */}
            <div className="border-b border-white/[0.06] bg-black/40 px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-3 select-none">
              <div className="flex items-center gap-2.5">
                <Folder size={18} className="text-violet-400" />
                <h3 className="text-white text-base font-bold tracking-wide">{project.title}</h3>
              </div>
              <div className="flex items-center gap-3">
                <span className="px-2 py-0.5 rounded text-[10px] bg-violet-500/10 border border-violet-500/20 text-violet-400 flex items-center gap-1 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
                  {project.status}
                </span>
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors p-1 rounded hover:bg-white/5 select-none interactive-cursor"
                  title="View GitHub Repository"
                >
                  <Github size={16} />
                </a>
              </div>
            </div>

            {/* Project Card Content Layout */}
            <div className="p-6 flex flex-col lg:flex-row gap-6">
              {/* Left Column: Details & Tech Stack */}
              <div className="flex-1 flex flex-col justify-between">
                <div className="space-y-4">
                  <p className="text-gray-300 text-xs md:text-sm leading-relaxed select-text">
                    {project.description}
                  </p>
                  
                  {/* Tech Stack Chips */}
                  <div>
                    <span className="text-[10px] text-gray-500 block uppercase tracking-wider mb-2 font-bold select-none">
                      Environment / Stack:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {project.techStack.map((tech) => (
                        <span
                          key={tech}
                          className="px-2 py-0.5 rounded text-[10px] bg-white/[0.02] border border-white/[0.05] text-gray-400 hover:text-white transition-colors select-none"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-white/[0.04] flex items-center gap-2 text-[10px] text-gray-500 select-none">
                  <Info size={12} className="text-violet-400" />
                  <span>Click repo icon to explore dotfiles config files.</span>
                </div>
              </div>

              {/* Right Column: Linux Desktop Configuration Mockup (No Fake Screenshots!) */}
              <div className="flex-1 border border-white/[0.05] rounded-md bg-black overflow-hidden flex flex-col aspect-video select-none text-[9px] md:text-[10px]">
                {/* Mock Window Header */}
                <div className="bg-[#000000] border-b border-white/[0.05] px-2 py-1.5 flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-white/10" />
                    <span className="w-1.5 h-1.5 rounded-full bg-white/10" />
                    <span className="w-1.5 h-1.5 rounded-full bg-white/10" />
                  </div>
                  <span className="text-[9px] text-gray-600">hyprland.conf</span>
                  <div className="w-6" />
                </div>

                {/* Mock Desktop Workspace Interface */}
                <div className="flex-1 flex flex-col p-2 gap-2 bg-[#000000] relative">
                  {/* Waybar Simulation Panel */}
                  <div className="w-full bg-[#000000] border border-white/[0.04] rounded px-2 py-1 flex justify-between items-center text-[8px] text-gray-500">
                    <div className="flex items-center gap-1">
                      <span className="w-3 h-3 rounded bg-violet-500/20 text-violet-400 border border-violet-500/30 flex items-center justify-center font-bold text-[8px]">1</span>
                      <span className="w-3 h-3 flex items-center justify-center">2</span>
                      <span className="w-3 h-3 flex items-center justify-center">3</span>
                    </div>
                    <span className="text-gray-400 truncate max-w-[100px]">manveer@arch: ~/.config/hypr</span>
                    <div className="flex items-center gap-2">
                      <span>RAM: 3.2G</span>
                      <span className="text-violet-400">CPU: 14%</span>
                    </div>
                  </div>

                  {/* Window Tile Layout Splits */}
                  <div className="flex-1 grid grid-cols-2 gap-2 overflow-hidden">
                    {/* Left Tile - Mock Code Editor */}
                    <div className="border border-white/[0.04] rounded bg-[#000000] flex flex-col overflow-hidden">
                      <div className="bg-[#050505] px-1.5 py-0.5 border-b border-white/[0.04] text-gray-600 text-[8px]">
                        nvim config.conf
                      </div>
                      <pre className="p-1.5 text-gray-500 font-mono overflow-hidden leading-relaxed">
                        <code className="block">
                          <span className="text-violet-400"># Bindings</span><br />
                          bind = $Mod, RET, exec, kitty<br />
                          bind = $Mod, Q, killactive<br />
                          <span className="text-violet-400"># Aesthetic</span><br />
                          gaps_in = 5<br />
                          gaps_out = 10<br />
                          border_sz = 1<br />
                          active_col = #a78bfa
                        </code>
                      </pre>
                    </div>

                    {/* Right Tile - Mock System Monitor */}
                    <div className="border border-white/[0.04] rounded bg-[#000000] flex flex-col overflow-hidden justify-between">
                      <div className="bg-[#050505] px-1.5 py-0.5 border-b border-white/[0.04] text-gray-600 text-[8px]">
                        btop
                      </div>
                      <div className="p-1.5 space-y-1.5 text-gray-500 font-mono flex-1 flex flex-col justify-around">
                        <div>
                          <div className="flex justify-between text-[8px] text-gray-400">
                            <span>Core 0</span>
                            <span>[42%]</span>
                          </div>
                          <div className="w-full bg-white/[0.05] h-1 rounded overflow-hidden mt-0.5">
                            <div className="bg-violet-400 h-full w-[42%]" />
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between text-[8px] text-gray-400">
                            <span>Core 1</span>
                            <span>[18%]</span>
                          </div>
                          <div className="w-full bg-white/[0.05] h-1 rounded overflow-hidden mt-0.5">
                            <div className="bg-violet-400/50 h-full w-[18%]" />
                          </div>
                        </div>
                        <div className="text-[7px] text-gray-600 flex justify-between items-center border-t border-white/[0.03] pt-1">
                          <span>Uptime: 2d 5h</span>
                          <span>Pkg: 842</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
