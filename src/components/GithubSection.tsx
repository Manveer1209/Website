"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { GitBranch, GitFork, Loader2, Star, User } from "lucide-react";
import { GithubIcon as Github } from "@/components/icons";
import { siteConfig } from "@/config/site";

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

interface ContributionDay {
  color: string;
  contributionCount: number;
  date: string;
  weekday: number;
  contributionLevel: string;
}

interface ContributionWeek {
  contributionDays: ContributionDay[];
}

interface ContributionCalendar {
  totalContributions: number;
  weeks: ContributionWeek[];
}

interface FallbackContributionItem {
  date: string;
  count: number;
  color: string;
  intensity: string;
}

function parseFlatContributions(contributions: FallbackContributionItem[]): ContributionCalendar {
  const sorted = [...contributions].sort((a, b) => a.date.localeCompare(b.date));

  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - 365);

  let startIndex = sorted.findIndex(c => {
    const d = new Date(c.date);
    return d >= cutoffDate && d.getDay() === 0;
  });

  if (startIndex === -1) {
    startIndex = sorted.findIndex(c => new Date(c.date).getDay() === 0);
  }
  if (startIndex === -1) startIndex = 0;

  const sliced = sorted.slice(startIndex);

  const weeks: ContributionWeek[] = [];
  let currentWeekDays: ContributionDay[] = [];
  let totalContributions = 0;

  sliced.forEach(c => {
    const d = new Date(c.date);
    const weekday = d.getDay();

    const contributionLevel = 
      c.intensity === "4" ? "FOURTH_QUARTILE" :
      c.intensity === "3" ? "THIRD_QUARTILE" :
      c.intensity === "2" ? "SECOND_QUARTILE" :
      c.intensity === "1" ? "FIRST_QUARTILE" : "NONE";

    const day: ContributionDay = {
      color: c.color,
      contributionCount: c.count,
      date: c.date,
      weekday: weekday,
      contributionLevel: contributionLevel
    };

    totalContributions += c.count;
    currentWeekDays.push(day);

    if (weekday === 6) {
      weeks.push({ contributionDays: currentWeekDays });
      currentWeekDays = [];
    }
  });

  if (currentWeekDays.length > 0) {
    weeks.push({ contributionDays: currentWeekDays });
  }

  return {
    totalContributions,
    weeks
  };
}

function getContributionColor(level: string): string {
  switch (level) {
    case "FIRST_QUARTILE":
      return "#0e4429";
    case "SECOND_QUARTILE":
      return "#006d32";
    case "THIRD_QUARTILE":
      return "#26a641";
    case "FOURTH_QUARTILE":
      return "#39d353";
    case "NONE":
    default:
      return "#161b22";
  }
}

export default function GithubSection() {
  const [profile, setProfile] = useState<GitHubProfile | null>(null);
  const [repos, setRepos] = useState<GitHubRepo[]>([]);
  const [commitsCount, setCommitsCount] = useState<number | null>(null);
  const [contributionCalendar, setContributionCalendar] = useState<ContributionCalendar | null>(null);
  const [loading, setLoading] = useState(() => !!siteConfig.githubUsername);
  const [error, setError] = useState<"no-username" | "rate-limit" | null>(() => 
    siteConfig.githubUsername ? null : "no-username"
  );

  useEffect(() => {
    const username = siteConfig.githubUsername;
    if (!username) return;

    const fetchGitHubData = async () => {
      try {
        const headers: HeadersInit = {};
        if (siteConfig.githubToken) {
          headers["Authorization"] = `token ${siteConfig.githubToken}`;
        }

        const fetchGql = async (): Promise<ContributionCalendar | null> => {
          if (!siteConfig.githubToken) return null;
          try {
            const gqlQuery = {
              query: `
                query($username: String!) {
                  user(login: $username) {
                    contributionsCollection {
                      contributionCalendar {
                        totalContributions
                        weeks {
                          contributionDays {
                            color
                            contributionCount
                            date
                            weekday
                            contributionLevel
                          }
                        }
                      }
                    }
                  }
                }
              `,
              variables: { username }
            };
            const res = await fetch("https://api.github.com/graphql", {
              method: "POST",
              headers: {
                ...headers,
                "Content-Type": "application/json"
              },
              body: JSON.stringify(gqlQuery)
            });
            if (res.ok) {
              const data = await res.json();
              return data.data?.user?.contributionsCollection?.contributionCalendar || null;
            }
          } catch (e) {
            console.error("GQL fetch error:", e);
          }
          return null;
        };

        const fetchFallback = async (): Promise<ContributionCalendar | null> => {
          try {
            const res = await fetch(`https://github-contributions.vercel.app/api/v1/${username}`);
            if (res.ok) {
              const data = await res.json();
              if (data.contributions && Array.isArray(data.contributions)) {
                return parseFlatContributions(data.contributions);
              }
            }
          } catch (e) {
            console.error("Fallback fetch error:", e);
          }
          return null;
        };

        const [profileRes, reposRes, calendarDataVal] = await Promise.all([
          fetch(`https://api.github.com/users/${username}`, { headers }),
          fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=4`, { headers }),
          (async () => {
            const gqlResult = await fetchGql();
            if (gqlResult) return gqlResult;
            return await fetchFallback();
          })()
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

        // Fetch commits count of the website repository
        const repoName = siteConfig.githubRepoName || "Website";
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
        setContributionCalendar(calendarDataVal);
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
                ? "Configure your GitHub username in the settings to pull active repositories and statistics."
                : "The public GitHub rate limit was reached or your network is offline. Your repository count and cards will render once sync completes."}
            </p>
          </div>

          <div className="inline-block py-1.5 px-3 rounded bg-black/40 border border-white/[0.04] text-[10px] text-gray-500">
            {error === "no-username" 
              ? "Edit: src/config/site.ts -> githubUsername"
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
                <div className="w-12 h-12 relative shrink-0">
                  <Image
                    src={profile.avatar_url}
                    alt={profile.login}
                    fill
                    sizes="48px"
                    className="rounded-full border border-white/[0.08] pointer-events-none object-cover"
                  />
                </div>
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

          {/* Contribution Activity Section */}
          <div>
            <div className="flex items-center gap-2 mb-3 px-1 text-gray-500 select-none">
              <span className="text-violet-400 font-extrabold text-xs">⌁</span>
              <span className="text-[10px] uppercase font-bold tracking-wider">Contribution Activity</span>
            </div>

            <div className="border border-white/[0.06] bg-white/[0.01] hover:border-white/[0.08] transition-all duration-300 rounded-lg p-5 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <span className="text-white font-bold text-xs md:text-sm tracking-tight select-none">
                  GitHub Contributions
                </span>
                <span className="text-gray-400 text-[10px] md:text-xs select-text">
                  {contributionCalendar
                    ? `${contributionCalendar.totalContributions} contributions in the last year`
                    : "Contributions in the last year"}
                </span>
              </div>

              {!contributionCalendar ? (
                <div className="py-6 text-center text-gray-500 text-xs">
                  Unable to load contribution data.
                </div>
              ) : (
                <>
                  <div className="overflow-x-auto w-full select-none no-scrollbar py-1">
                    <div className="w-max flex flex-col">
                      {/* Month labels row */}
                      <div className="flex">
                        <div className="w-7 shrink-0" />
                        <div className="flex gap-[3px] text-[9px] text-gray-500 mb-1.5 h-3.5 select-none relative">
                          {contributionCalendar.weeks.map((week, idx) => {
                            const firstDayOfWeek = week.contributionDays[0];
                            if (!firstDayOfWeek) return null;
                            const date = new Date(firstDayOfWeek.date);
                            const monthName = date.toLocaleString("default", { month: "short" });
                            
                            // Check if this is the start of a new month
                            let showMonth = false;
                            if (idx === 0) {
                              showMonth = true;
                            } else {
                              const prevWeekFirstDay = contributionCalendar.weeks[idx - 1].contributionDays[0];
                              if (prevWeekFirstDay) {
                                const prevDate = new Date(prevWeekFirstDay.date);
                                if (date.getMonth() !== prevDate.getMonth()) {
                                  showMonth = true;
                                }
                              }
                            }
                            
                            return (
                              <div key={idx} className="w-[10px] shrink-0 relative">
                                {showMonth && (
                                  <span className="absolute left-0 bottom-0 whitespace-nowrap leading-none">
                                    {monthName}
                                  </span>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Grid + Day Labels */}
                      <div className="flex">
                        {/* Day Labels column */}
                        <div className="flex flex-col gap-[3px] pr-2 text-gray-500 text-[9px] select-none w-7 shrink-0 justify-center">
                          <div className="h-[10px] leading-none" />
                          <div className="h-[10px] flex items-center leading-none">Mon</div>
                          <div className="h-[10px] leading-none" />
                          <div className="h-[10px] flex items-center leading-none">Wed</div>
                          <div className="h-[10px] leading-none" />
                          <div className="h-[10px] flex items-center leading-none">Fri</div>
                          <div className="h-[10px] leading-none" />
                        </div>

                        {/* Weeks Grid */}
                        <div className="flex gap-[3px]">
                          {contributionCalendar.weeks.map((week, weekIdx) => (
                            <div key={weekIdx} className="flex flex-col gap-[3px]">
                              {week.contributionDays.map((day, dayIdx) => {
                                const color = getContributionColor(day.contributionLevel);
                                const formattedDate = new Date(day.date).toLocaleDateString("en-US", {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                });
                                const titleText = `${day.contributionCount} ${day.contributionCount === 1 ? "contribution" : "contributions"} on ${formattedDate}`;
                                
                                return (
                                  <div
                                    key={dayIdx}
                                    className="w-[10px] h-[10px] rounded-[1.5px] transition-all duration-200 hover:scale-110 shrink-0"
                                    style={{ backgroundColor: color }}
                                    title={titleText}
                                  />
                                );
                              })}
                              {/* Pad the week to 7 days if the last week contains fewer days */}
                              {week.contributionDays.length < 7 && 
                                Array.from({ length: 7 - week.contributionDays.length }).map((_, padIdx) => (
                                  <div
                                    key={`pad-${padIdx}`}
                                    className="w-[10px] h-[10px] bg-transparent shrink-0"
                                  />
                                ))
                              }
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Legend Row */}
                  <div className="flex items-center justify-end gap-1.5 text-[9px] md:text-[10px] text-gray-500 select-none pt-1">
                    <span>Less</span>
                    <div className="w-[10px] h-[10px] rounded-[1.5px] bg-[#161b22]" />
                    <div className="w-[10px] h-[10px] rounded-[1.5px] bg-[#0e4429]" />
                    <div className="w-[10px] h-[10px] rounded-[1.5px] bg-[#006d32]" />
                    <div className="w-[10px] h-[10px] rounded-[1.5px] bg-[#26a641]" />
                    <div className="w-[10px] h-[10px] rounded-[1.5px] bg-[#39d353]" />
                    <span>More</span>
                  </div>
                </>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
