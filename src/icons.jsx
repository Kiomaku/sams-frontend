// All icons come from the Hugeicons free pack. Swap any icon here in one place.
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ViewIcon, ViewOffIcon, ArrowUp02Icon, Menu01Icon, MessageAdd01Icon, Settings02Icon, Delete02Icon,
  RefreshIcon, Activity01Icon, ServerStack01Icon, InboxIcon, Clock01Icon, Moon02Icon, Sun03Icon, Copy01Icon, Tick02Icon,
} from "@hugeicons/core-free-icons";
const mk = (icon) => ({ size = 20, className }) => <HugeiconsIcon icon={icon} size={size} className={className} />;
export const Eye = mk(ViewIcon);
export const EyeOff = mk(ViewOffIcon);
export const ArrowUp = mk(ArrowUp02Icon);
export const Menu = mk(Menu01Icon);
export const MessageSquarePlus = mk(MessageAdd01Icon);
export const Settings2 = mk(Settings02Icon);
export const Trash2 = mk(Delete02Icon);
export const RotateCcw = mk(RefreshIcon);
export const Activity = mk(Activity01Icon);
export const Server = mk(ServerStack01Icon);
export const Inbox = mk(InboxIcon);
export const History = mk(Clock01Icon);
export const Moon = mk(Moon02Icon);
export const Sun = mk(Sun03Icon);
export const Copy = mk(Copy01Icon);
export const Check = mk(Tick02Icon);
