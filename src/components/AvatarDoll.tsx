import type { AvatarDoll } from "@/types";

export function AvatarDoll({ avatar, className }: { avatar: AvatarDoll; className?: string }) {
  return (
    <div
      className={className}
      aria-label="2D Avatar Doll"
      role="img"
      dangerouslySetInnerHTML={{ __html: avatar.svg }}
    />
  );
}

