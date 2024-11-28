import { createContext, ReactNode, useState } from "react";
import { ColorSchemeName, useColorScheme } from "react-native";

// Define the type for the context value
interface ThemeContextType {
  theme: ColorSchemeName;
  setTheme: React.Dispatch<React.SetStateAction<ColorSchemeName>>;
  isDarkTheme: boolean;
}

// Create the context with the defined type
export const ThemeContext = createContext<ThemeContextType | undefined>(
  undefined
);

const ThemeContextProvider = ({ children }: { children: ReactNode }) => {
  const defaultTheme = useColorScheme();
  const [theme, setTheme] = useState<ColorSchemeName>(defaultTheme);
  const isDarkTheme = theme === "dark";

  return (
    <ThemeContext.Provider value={{ theme, setTheme, isDarkTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeContextProvider;
