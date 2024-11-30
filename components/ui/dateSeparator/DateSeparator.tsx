import { View, StyleSheet } from "react-native";
import { ThemedText } from "../themed/ThemedText";
import moment from "moment";
import { ThemedView } from "../themed/ThemedView";
import { AppColors } from "@/constants/Colors";

interface DateSeparatorProps {
  timestamp: number;
}

export const DateSeparator = ({ timestamp }: DateSeparatorProps) => {
  const formattedDate = moment(timestamp).calendar(null, {
    sameDay: "[Today]",
    lastDay: "[Yesterday]",
    lastWeek: "dddd",
    sameElse: "MMMM D, YYYY",
  });

  return (
    <ThemedView style={styles.container}>
      <View style={styles.line} />
      <ThemedText style={styles.text}>{formattedDate}</ThemedText>
      <View style={styles.line} />
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: AppColors.gray[2],
  },
  text: {
    marginHorizontal: 16,
    fontSize: 12,
    color: "#666",
  },
});
