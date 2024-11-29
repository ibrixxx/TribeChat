import { TouchableHighlight, View, ViewProps } from "react-native";
import React from "react";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { AppColors } from "@/constants/Colors";
import { useTheme } from "@/hooks/useTheme";

const ThemeSwitch = ({ ...props }: ViewProps) => {
  const { isDarkTheme, setTheme } = useTheme();

  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
      }}
      {...props}
    >
      <TouchableHighlight
        onPress={() => setTheme(isDarkTheme ? "light" : "dark")}
      >
        {isDarkTheme ? (
          <MaterialIcons
            name="dark-mode"
            size={24}
            color={AppColors.gray[10]}
          />
        ) : (
          <MaterialIcons
            name="light-mode"
            size={24}
            color={AppColors.yellow[14]}
          />
        )}
      </TouchableHighlight>
    </View>
  );
};

export default ThemeSwitch;
