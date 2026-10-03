import {
  ClipboardTextIcon,
  HouseLineIcon,
  CookingPotIcon,
  PaintRollerIcon,
  WrenchIcon,
  BathtubIcon,
  ShieldCheckIcon,
  ToolboxIcon,
  TrendUpIcon,
  UsersThreeIcon,
} from "@phosphor-icons/react/ssr";
import type { IconProps } from "@phosphor-icons/react";
import type { IconKey } from "@/lib/types";

const icons: Record<IconKey, React.ComponentType<IconProps>> = {
  management: ClipboardTextIcon,
  renovation: HouseLineIcon,
  kitchen: CookingPotIcon,
  exterior: PaintRollerIcon,
  repairs: WrenchIcon,
  bathroom: BathtubIcon,
  resilience: ShieldCheckIcon,
  preparation: ToolboxIcon,
  growth: TrendUpIcon,
  family: UsersThreeIcon,
};

/** Decorative content icon — always paired with visible text, so hidden from AT. */
export function Icon({ name, size = 40, className }: { name: IconKey; size?: number; className?: string }) {
  const Glyph = icons[name];
  return <Glyph size={size} weight="light" className={className} aria-hidden="true" />;
}
