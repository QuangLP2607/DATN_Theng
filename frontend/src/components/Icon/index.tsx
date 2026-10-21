import {
  Icon as IconifyIcon,
  type IconProps as IconifyIconProps,
} from "@iconify/react";

export interface IconProps extends Omit<IconifyIconProps, "icon"> {
  name: string;
}

const ICONS = {
  graduation: "lucide:graduation-cap",
  library: "lucide:library",
  chart: "lucide:chart-no-axes-column",
  success: "lucide:circle-check",
  book: "lucide:book-open",
  settings: "lucide:settings",
  user: "lucide:user",
  key: "lucide:key",
  question: "lucide:circle-help",
  arrowRight: "lucide:arrow-right",
} as const;

export type IconName = keyof typeof ICONS;

export default function Icon({ name, ...props }: IconProps) {
  const icon = ICONS[name as IconName];

  return <IconifyIcon icon={icon ?? name} {...props} />;
}
