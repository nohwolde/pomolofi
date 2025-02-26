import { db } from "@/lib/firebase";
import {
  doc,
  setDoc,
  getDoc,
  collection,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  increment,
} from "firebase/firestore";
import { DailyStats, UserStatsData } from "@/types/stats";

export async function updateDailyStats(
  userId: string,
  stats: Partial<DailyStats> & { date: string }
) {
  try {
    const statsRef = doc(db, "users", userId, "dailyStats", stats.date);
    await setDoc(statsRef, stats, { merge: true });
    await updateAggregatedStats(userId);
  } catch (error) {
    console.error("Error updating daily stats:", error);
    throw error;
  }
}

async function incrementStat(userId: string, field: keyof DailyStats) {
  const today = new Date().toISOString().split("T")[0];
  const statsRef = doc(db, "users", userId, "dailyStats", today);

  const docSnap = await getDoc(statsRef);

  if (!docSnap.exists()) {
    // Initialize new document with all fields at 0
    await setDoc(statsRef, {
      date: today,
      focusTime: field === "focusTime" ? 1 : 0,
      breakTime: field === "breakTime" ? 1 : 0,
      pomodorosCompleted: field === "pomodorosCompleted" ? 1 : 0,
      tasksCompleted: field === "tasksCompleted" ? 1 : 0,
    });
  } else {
    // Just increment the specific field
    await setDoc(
      statsRef,
      {
        [field]: increment(1),
      },
      { merge: true }
    );
  }

  await updateAggregatedStats(userId);
}

export const incrementFocusTime = (userId: string) =>
  incrementStat(userId, "focusTime");
export const incrementBreakTime = (userId: string) =>
  incrementStat(userId, "breakTime");
export const incrementPomodoros = (userId: string) =>
  incrementStat(userId, "pomodorosCompleted");
export const incrementTasksCompleted = (userId: string) =>
  incrementStat(userId, "tasksCompleted");

async function updateAggregatedStats(userId: string) {
  try {
    const last28Days = Array.from({ length: 28 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - i);
      return d.toISOString().split("T")[0];
    });

    // Query last 28 days of stats
    const statsRef = collection(db, "users", userId, "dailyStats");
    const q = query(
      statsRef,
      where("date", "in", last28Days),
      orderBy("date", "desc")
    );

    const querySnapshot = await getDocs(q);
    const stats = querySnapshot.docs.map((doc) => doc.data() as DailyStats);

    // Calculate weekly and monthly totals
    const weeklyStats = calculateTotals(stats.slice(0, 7));
    const monthlyStats = calculateTotals(stats);

    // Update aggregated stats document
    const aggregatedStatsRef = doc(db, "users", userId, "stats", "aggregated");
    await setDoc(
      aggregatedStatsRef,
      {
        weeklyTotal: weeklyStats,
        monthlyTotal: monthlyStats,
        updatedAt: new Date().toISOString(),
      },
      { merge: true }
    );
  } catch (error) {
    console.error("Error updating aggregated stats:", error);
    throw error;
  }
}

export async function getUserStats(userId: string): Promise<UserStatsData> {
  try {
    const today = new Date();
    const last28Days = new Date(today);
    last28Days.setDate(today.getDate() - 28);

    const statsQuery = query(
      collection(db, "users", userId, "dailyStats"),
      where("date", ">=", last28Days.toISOString().split("T")[0]),
      orderBy("date", "asc")
    );

    const querySnapshot = await getDocs(statsQuery);
    const dailyStats: DailyStats[] = [];
    querySnapshot.forEach((doc) => {
      dailyStats.push(doc.data() as DailyStats);
    });

    // Sort array to ensure correct order
    dailyStats.sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    return {
      recentDays: dailyStats,
    };
  } catch (error) {
    console.error("Error getting user stats:", error);
    throw error;
  }
}

function calculateTotals(stats: DailyStats[]) {
  return stats.reduce(
    (acc, stat) => ({
      focusTime: acc.focusTime + stat.focusTime,
      breakTime: acc.breakTime + stat.breakTime,
      pomodorosCompleted: acc.pomodorosCompleted + stat.pomodorosCompleted,
      tasksCompleted: acc.tasksCompleted + stat.tasksCompleted,
    }),
    {
      focusTime: 0,
      breakTime: 0,
      pomodorosCompleted: 0,
      tasksCompleted: 0,
    }
  );
}
