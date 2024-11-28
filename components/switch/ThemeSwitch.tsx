import { StyleSheet, Switch, View, ViewProps } from "react-native";
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
      {isDarkTheme ? (
        <MaterialIcons name="dark-mode" size={24} color={AppColors.gray[10]} />
      ) : (
        <MaterialIcons
          name="light-mode"
          size={24}
          color={AppColors.yellow[14]}
        />
      )}
      <Switch
        style={styles.switch}
        value={!isDarkTheme}
        thumbColor={"white"}
        trackColor={{ false: AppColors.gray[10], true: AppColors.yellow[7] }}
        onChange={() => setTheme(isDarkTheme ? "light" : "dark")}
      />
    </View>
  );
};

export default ThemeSwitch;

const styles = StyleSheet.create({
  switch: {
    marginHorizontal: 4,
  },
});
