import { sceneHeight, sceneWidth } from "@/components/immersive/scene/sceneConfig";
import type {
  ImmersiveStation,
  StationCameraTarget,
} from "@/components/immersive/scene/types";

export function getStationCameraTarget(
  station: ImmersiveStation,
): StationCameraTarget {
  const centerX = station.x + station.width / 2;
  const centerY = station.y + station.height / 2;

  if (station.content === "rules") {
    return {
      focusX: centerX,
      focusY: centerY,
      screenX: sceneWidth * 0.78,
      screenY: sceneHeight * 0.58,
      scale: 2,
    };
  }

  if (station.content === "review") {
    return {
      focusX: centerX,
      focusY: centerY,
      screenX: sceneWidth * 0.23,
      screenY: sceneHeight * 0.58,
      scale: 2,
    };
  }

  return {
    focusX: centerX,
    focusY: centerY,
    screenX: sceneWidth / 2,
    screenY: sceneHeight / 2,
    scale: 2,
  };
}

export function easeOutCubic(progress: number) {
  return 1 - (1 - progress) ** 3;
}
