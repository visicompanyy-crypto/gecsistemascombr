import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./AuthContext";

interface CompanySettings {
  id: string;
  company_name: string;
  logo_url: string | null;
  primary_color: string;
  onboarding_completed: boolean;
}

interface CompanySettingsContextType {
  settings: CompanySettings | null;
  loading: boolean;
  updateSettings: (updates: Partial<CompanySettings>) => Promise<void>;
  refreshSettings: () => Promise<void>;
}

const CompanySettingsContext = createContext<CompanySettingsContextType | undefined>(undefined);

const COLOR_THEMES: Record<string, { primary: string; primaryDark: string }> = {
  green: { primary: "136 42% 40%", primaryDark: "136 42% 34%" },
  blue: { primary: "210 84% 45%", primaryDark: "210 84% 38%" },
  purple: { primary: "270 60% 50%", primaryDark: "270 60% 42%" },
  orange: { primary: "25 95% 53%", primaryDark: "25 95% 45%" },
  red: { primary: "0 84% 50%", primaryDark: "0 84% 42%" },
};

export const CompanySettingsProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [settings, setSettings] = useState<CompanySettings | null>(null);
  const [loading, setLoading] = useState(true);

  const applyTheme = (color: string) => {
    const theme = COLOR_THEMES[color] || COLOR_THEMES.green;
    document.documentElement.style.setProperty("--primary", theme.primary);
    document.documentElement.style.setProperty("--primary-dark", theme.primaryDark);
    document.documentElement.style.setProperty("--ring", theme.primary);
    document.documentElement.style.setProperty("--chart-1", theme.primary);
    document.documentElement.style.setProperty("--sidebar-primary", theme.primary);
    document.documentElement.style.setProperty("--sidebar-ring", theme.primary);
  };

  const fetchSettings = async () => {
    if (!user) {
      setSettings(null);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from("company_settings")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setSettings(data);
        applyTheme(data.primary_color);
      } else {
        setSettings(null);
      }
    } catch (error) {
      console.error("Error fetching company settings:", error);
      setSettings(null);
    } finally {
      setLoading(false);
    }
  };

  const updateSettings = async (updates: Partial<CompanySettings>) => {
    if (!user) return;

    try {
      if (settings) {
        const { error } = await supabase
          .from("company_settings")
          .update(updates)
          .eq("user_id", user.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("company_settings")
          .insert({
            user_id: user.id,
            company_name: updates.company_name || "Minha Empresa",
            logo_url: updates.logo_url || null,
            primary_color: updates.primary_color || "green",
            onboarding_completed: updates.onboarding_completed || false,
          });
        if (error) throw error;
      }

      await fetchSettings();
    } catch (error) {
      console.error("Error updating company settings:", error);
      throw error;
    }
  };

  const refreshSettings = async () => {
    await fetchSettings();
  };

  useEffect(() => {
    fetchSettings();
  }, [user]);

  return (
    <CompanySettingsContext.Provider
      value={{
        settings,
        loading,
        updateSettings,
        refreshSettings,
      }}
    >
      {children}
    </CompanySettingsContext.Provider>
  );
};

export const useCompanySettings = () => {
  const context = useContext(CompanySettingsContext);
  if (context === undefined) {
    throw new Error("useCompanySettings must be used within a CompanySettingsProvider");
  }
  return context;
};

export { COLOR_THEMES };
