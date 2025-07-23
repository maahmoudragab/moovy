export async function fetchFromTMDB(endpoint: string, query = "") {
  const API_KEY = process.env.TMDB_API_KEY;
  const BASE_URL = process.env.TMDB_BASE_URL;

  if (!API_KEY || !BASE_URL) {
    throw new Error("API_KEY أو BASE_URL مش موجودين في env");
  }

  const url = `${BASE_URL}${endpoint}?api_key=${API_KEY}${query ? `${query}` : ""}`;

  const res = await fetch(url, {next: {revalidate: 60}});

  if (!res.ok) {
    throw new Error("TMDB fetch failed");
  }

  return res.json();
}
