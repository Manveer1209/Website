import { NextResponse } from "next/server";
import { siteConfig } from "@/config/site";

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

export async function GET() {
  const username = siteConfig.githubUsername;
  if (!username) {
    return NextResponse.json({ error: "no-username" }, { status: 400 });
  }

  const token = process.env.GITHUB_TOKEN || "";
  const headers: HeadersInit = {};
  if (token) {
    headers["Authorization"] = `token ${token}`;
  }

  const fetchGql = async (): Promise<ContributionCalendar | null> => {
    if (!token) return null;
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

  try {
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
      return NextResponse.json({ error: "rate-limit" }, { status: 403 });
    }

    if (!profileRes.ok || !reposRes.ok) {
      return NextResponse.json({ error: "rate-limit" }, { status: 500 });
    }

    const profileData = await profileRes.json();
    const reposData = await reposRes.json();

    return NextResponse.json({
      profile: profileData,
      repos: reposData,
      contributionCalendar: calendarDataVal
    });
  } catch (err) {
    console.error("API route GitHub stats fetch error:", err);
    return NextResponse.json({ error: "rate-limit" }, { status: 500 });
  }
}
