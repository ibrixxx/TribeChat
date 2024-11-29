import ThemeSwitch from "@/components/switch/ThemeSwitch";
import { Colors } from "@/constants/Colors";
import { useTheme } from "@/hooks/useTheme";
import { Stack } from "expo-router";

const MainStack = () => {
  const { theme } = useTheme();

  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerShown: true,
          title: "Tribe Chat Pro",
          headerRight: () => <ThemeSwitch />,
          headerTitleStyle: {
            fontWeight: "bold",
            color: Colors[theme!].text,
          },
          headerTitleAlign: "center",
          headerStyle: {
            backgroundColor: Colors[theme!].headerBackground,
          },
        }}
      />
      <Stack.Screen name="+not-found" />
    </Stack>
  );
};

export default MainStack;
