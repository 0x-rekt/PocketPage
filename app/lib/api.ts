export const API_URL = process.env.EXPO_PUBLIC_API_URL ?? "http://localhost:3000";

export interface DashboardIncident {
  id: string;
  title: string;
  source: string;
  severity: "critical" | "warning" | "success" | "muted";
  status: "open" | "acked" | "resolved";
  createdAt: string;
}

export interface DashboardData {
  team: { id: string; name: string } | null;
  rotation: {
    id: string;
    name: string;
    cadence: string;
    startDate: string;
    members: Array<{
      id: string;
      position: number;
      name: string;
      email: string;
      isCurrent: boolean;
    }>;
  } | null;
  incidents: DashboardIncident[];
}

export async function apiGet(path: string, getToken: () => Promise<string | null>) {
  const token = await getToken();
  const response = await fetch(`${API_URL}${path}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });

  if (!response.ok) throw new Error(`API request failed: ${response.status}`);
  return response.json();
}
