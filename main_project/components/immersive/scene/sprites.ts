const spriteAssetVersion = 12;

export const immersiveSpriteNames = [
  "door-open",
  "booth-1",
  "booth-2",
  "booth-3",
  "booth-4",
  "floor-tiles",
  "floor-tiles-clean",
  "rules-table-side",
  "review-table-side",
  "ballot-box-side",
  "voting-sheet",
  "timetable-poster",
  "stone-small",
  "gras-small",
  "trash-bin",
  "plant-small",
  "tree-fruits",
  "tree-long",
  "tree-normal",
  "tree-variant",
  "water-machine",
  "bench-small",
  "locker-group",
  "boy-frame-1",
  "boy-frame-2",
  "boy-frame-3",
  "boy-frame-4",
  "girl-frame-1-aligned",
  "girl-frame-2-aligned",
  "girl-frame-3-aligned",
  "girl-frame-4-aligned",
] as const;

export type ImmersiveSpriteName = (typeof immersiveSpriteNames)[number];

export function getImmersiveSpritePath(name: ImmersiveSpriteName) {
  return `/assets/immersive/sprites/${name}.png?v=${spriteAssetVersion}`;
}
