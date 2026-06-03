import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { runMigrations } from "../database/migrations";
import {
  getNumberSetting,
  saveNumberSetting,
} from "../database/settingsRepository";

const DAILY_DOPAMINE_GOAL_KEY = "dailyDopamineGoal";

const DEFAULT_DAILY_DOPAMINE_GOAL = 100;
const DOPAMINE_POINTS_PER_TODO = 10;

type AppSettingsContextValue = {
  dailyDopamineGoal: number;
  dopaminePointsPerTodo: number;
  isSettingsLoading: boolean;
  setDailyDopamineGoal: (goal: number) => Promise<void>;
};

const AppSettingsContext = createContext<AppSettingsContextValue | undefined>(
  undefined
);

type AppSettingsProviderProps = {
  children: ReactNode;
};

export function AppSettingsProvider({ children }: AppSettingsProviderProps) {
  const [dailyDopamineGoalState, setDailyDopamineGoalState] = useState(
    DEFAULT_DAILY_DOPAMINE_GOAL
  );
  const [isSettingsLoading, setIsSettingsLoading] = useState(true);

  useEffect(() => {
    async function loadSettings() {
      try {
        await runMigrations();

        const savedGoal = await getNumberSetting(DAILY_DOPAMINE_GOAL_KEY);

        if (savedGoal && savedGoal > 0) {
          setDailyDopamineGoalState(savedGoal);
        }
      } finally {
        setIsSettingsLoading(false);
      }
    }

    loadSettings();
  }, []);

  async function setDailyDopamineGoal(goal: number) {
    const safeGoal = Math.max(DOPAMINE_POINTS_PER_TODO, Math.round(goal));

    setDailyDopamineGoalState(safeGoal);
    await saveNumberSetting(DAILY_DOPAMINE_GOAL_KEY, safeGoal);
  }

  const value = useMemo(
    () => ({
      dailyDopamineGoal: dailyDopamineGoalState,
      dopaminePointsPerTodo: DOPAMINE_POINTS_PER_TODO,
      isSettingsLoading,
      setDailyDopamineGoal,
    }),
    [dailyDopamineGoalState, isSettingsLoading]
  );

  return (
    <AppSettingsContext.Provider value={value}>
      {children}
    </AppSettingsContext.Provider>
  );
}

export function useAppSettings() {
  const context = useContext(AppSettingsContext);

  if (!context) {
    throw new Error("useAppSettings must be used inside AppSettingsProvider");
  }

  return context;
}