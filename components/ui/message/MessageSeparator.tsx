import { DateSeparator } from "@/components/ui/dateSeparator/DateSeparator";
import { MessageJSON } from "@/types/chat";
import moment from "moment";
const MessageSeparator = ({
  leadingItem,
  trailingItem,
}: {
  leadingItem: MessageJSON[];
  trailingItem: MessageJSON[];
}) => {
  if (!leadingItem || !trailingItem) return null;

  const leadingDate = moment(leadingItem[0].sentAt).format("YYYY-MM-DD");
  const trailingDate = moment(trailingItem[0].sentAt).format("YYYY-MM-DD");

  if (leadingDate !== trailingDate) {
    return <DateSeparator timestamp={leadingItem[0].sentAt} />;
  }

  return null;
};
export default MessageSeparator;
