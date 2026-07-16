"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { GitBranch, GitFork, Loader2, Star, User } from "lucide-react";
import { GithubIcon as Github } from "@/components/icons";
import { portfolioConfig } from "@/config/portfolio";

interface GitHubProfile {
  login: string;
  avatar_url: string;
  html_url: string;
  public_repos: number;
  followers: number;
  bio: string;
}

interface GitHubRepo {
  id: number;
  name: string;
  description: string;
  html_url: string;
  stargazers_count: number;
  forks_count: number;
  language: string;
}

export default function GithubSection() {
  const [profile, setProfile] = useState<GitHubProfile | null>(null);
  const [repos, setRepos] = useState<GitHubRepo[]>([]);
  const [commitsCount, setCommitsCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<"no-username" | "rate-limit" | null>(null);

  useEffect(() => {
    const username = portfolioConfig.githubUsername;
    if (!username) {
      setError("no-username");
      setLoading(false);
      return;
    }

    const fetchGitHubData = async () => {
      try {
        const headers: HeadersInit = {};
        if (portfolioConfig.githubToken) {
          headers["Authorization"] = `token ${portfolioConfig.githubToken}`;
        }

        const [profileRes, reposRes] = await Promise.all([
          fetch(`https://api.github.com/users/${username}`, { headers }),
          fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=4`, { headers })
        ]);

        if (profileRes.status === 403 || reposRes.status === 403) {
          setError("rate-limit");
          setLoading(false);
          return;
        }

        if (!profileRes.ok || !reposRes.ok) {
          setError("rate-limit");
          setLoading(false);
          return;
        }

        const profileData = await profileRes.json();
        const reposData = await reposRes.json();

        // Fetch commits count of the portfolio website repository
        const repoName = portfolioConfig.githubRepoName || "Website";
        let commitsCountVal: number | null = null;
        try {
          const commitsRes = await fetch(
            `https://api.github.com/repos/${username}/${repoName}/commits?per_page=1`,
            { headers }
          );
          if (commitsRes.ok) {
            const linkHeader = commitsRes.headers.get("Link") || commitsRes.headers.get("link");
            if (linkHeader) {
              const match = linkHeader.match(/[?&]page=(\d+)>;\s*rel="last"/);
              if (match) {
                commitsCountVal = parseInt(match[1], 10);
              } else {
                const commitsData = await commitsRes.json();
                commitsCountVal = Array.isArray(commitsData) ? commitsData.length : 1;
              }
            } else {
              const commitsData = await commitsRes.json();
              commitsCountVal = Array.isArray(commitsData) ? commitsData.length : 0;
            }
          }
        } catch (commitErr) {
          console.error("Error fetching commits count:", commitErr);
        }

        setProfile(profileData);
        setRepos(reposData);
        setCommitsCount(commitsCountVal);
        setError(null);
      } catch (err) {
        console.error("Error fetching GitHub statistics", err);
        setError("rate-limit");
      } finally {
        setLoading(false);
      }
    };

    fetchGitHubData();
  }, []);

  return (
    <div className="w-full max-w-3xl mx-auto font-mono text-xs md:text-sm">
      {loading ? (
        <div className="flex flex-col items-center justify-center py-12 gap-2 text-gray-500 select-none">
          <Loader2 className="animate-spin text-violet-400" size={20} />
          <span>Syncing with GitHub API...</span>
        </div>
      ) : error ? (
        /* Honest placeholder shown when rate-limited, offline, or disconnected */
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="border border-white/[0.06] bg-white/[0.01] rounded-lg p-6 text-center space-y-4 select-none accent-glow-box"
        >
          <div className="mx-auto w-10 h-10 rounded-full bg-white/[0.02] border border-white/[0.08] flex items-center justify-center text-gray-400">
            <Github size={18} />
          </div>
          
          <div className="max-w-md mx-auto space-y-2">
            <h4 className="text-white font-bold text-sm tracking-wide">
              {error === "no-username" ? "GitHub Profile Disconnected" : "GitHub Sync Paused"}
            </h4>
            <p className="text-gray-400 leading-relaxed text-xs">
              {error === "no-username"
                ? "Configure your GitHub username in the portfolio settings to pull active repositories and statistics."
                : "The public GitHub rate limit was reached or your network is offline. Your repository count and cards will render once sync completes."}
            </p>
          </div>

          <div className="inline-block py-1.5 px-3 rounded bg-black/40 border border-white/[0.04] text-[10px] text-gray-500">
            {error === "no-username" 
              ? "Edit: src/config/portfolio.ts -> githubUsername"
              : "Retrying connection on next viewport entry."}
          </div>
        </motion.div>
      ) : (
        /* Real data display */
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-6"
        >
          {/* Profile Overview Banner */}
          <div className="border border-white/[0.06] bg-white/[0.01] rounded-lg p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              {profile?.avatar_url ? (
                <img
                  src={profile.avatar_url}
                  alt={profile.login}
                  className="w-12 h-12 rounded-full border border-white/[0.08] pointer-events-none"
                  loading="lazy"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400">
                  <User size={18} />
                </div>
              )}
              <div>
                <a
                  href={profile?.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white hover:text-violet-400 font-bold hover:accent-glow-text transition-colors select-none interactive-cursor flex items-center gap-1 text-sm md:text-base"
                >
                  @{profile?.login}
                  <Github size={14} className="opacity-60" />
                </a>
                <p className="text-gray-400 text-[10px] md:text-xs mt-0.5 truncate max-w-[200px] sm:max-w-md select-text">
                  {profile?.bio || "Linux enthusiast & Developer."}
                </p>
              </div>
            </div>

            {/* Profile Statistics */}
            <div className="flex items-center gap-6 text-[10px] text-gray-500 border-t sm:border-t-0 sm:border-l border-white/[0.06] pt-3 sm:pt-0 sm:pl-6 shrink-0 w-full sm:w-auto justify-around sm:justify-start">
              <div>
                <span className="text-gray-600 block uppercase font-bold text-[8px] mb-0.5 select-none">Repos</span>
                <span className="text-white font-bold text-sm select-text">{profile?.public_repos}</span>
              </div>
              <div>
                <span className="text-gray-600 block uppercase font-bold text-[8px] mb-0.5 select-none">Followers</span>
                <span className="text-white font-bold text-sm select-text">{profile?.followers}</span>
              </div>
              {commitsCount !== null && (
                <div>
                  <span className="text-gray-600 block uppercase font-bold text-[8px] mb-0.5 select-none">Website Commits</span>
                  <span className="text-white font-bold text-sm select-text">{commitsCount}</span>
                </div>
              )}
            </div>
          </div>

          {/* Repo Grid */}
          <div>
            <div className="flex items-center gap-2 mb-3 px-1 text-gray-500 select-none">
              <GitBranch size={14} className="text-violet-400" />
              <span className="text-[10px] uppercase font-bold tracking-wider">Recently Updated Repos</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {repos.map((repo) => (
                <a
                  key={repo.id}
                  href={repo.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="border border-white/[0.05] hover:border-violet-400/20 bg-white/[0.01] rounded-lg p-4 flex flex-col justify-between hover:bg-white/[0.02] transition-all duration-300 interactive-cursor select-none group"
                >
                  <div>
                    <h5 className="text-white font-bold group-hover:text-violet-400 transition-colors text-xs md:text-sm tracking-tight truncate">
                      {repo.name}
                    </h5>
                    <p className="text-gray-400 text-[10px] md:text-xs mt-1.5 leading-relaxed line-clamp-2 select-text">
                      {repo.description || "No description provided."}
                    </p>
                  </div>

                  <div className="flex items-center justify-between mt-4 pt-3 border-t border-white/[0.03] text-[9px] text-gray-500">
                    <span className="truncate max-w-[80px]">
                      {repo.language || "Plain"}
                    </span>
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1">
                        <Star size={10} />
                        <span>{repo.stargazers_count}</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <GitFork size={10} />
                        <span>{repo.forks_count}</span>
                      </span>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
