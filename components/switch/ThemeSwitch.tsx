import { Pressable, ViewProps } from "react-native";
import React from "react";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { AppColors } from "@/constants/Colors";
import { useTheme } from "@/hooks/useTheme";

const ThemeSwitch = ({ ...props }: ViewProps) => {
  const { isDarkTheme, setTheme } = useTheme();

  return (
    <Pressable
      style={{
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: isDarkTheme
          ? AppColors.gray[12]
          : AppColors.lightBlue[0],
        padding: 4,
        borderRadius: 20,
      }}
      {...props}
      onPress={() => setTheme(isDarkTheme ? "light" : "dark")}
    >
      {isDarkTheme ? (
        <MaterialIcons name="dark-mode" size={24} color={AppColors.gray[10]} />
      ) : (
        <MaterialIcons
          name="light-mode"
          size={24}
          color={AppColors.yellow[15]}
        />
      )}
    </Pressable>
  );
};

export default ThemeSwitch;
