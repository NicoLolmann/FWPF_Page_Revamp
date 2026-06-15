import { sceneColors } from "@/components/immersive/scene/sceneConfig";
import { immersiveStations } from "@/components/immersive/scene/stations";
import type { ImmersiveStation, StationId } from "@/components/immersive/scene/types";
import type { Container, Graphics as PixiGraphics } from "pixi.js";

type GraphicsConstructor = new () => PixiGraphics;

export function findStationAt(x: number, y: number) {
  return immersiveStations.find(
    (station) =>
      x >= station.x &&
      x <= station.x + station.width &&
      y >= station.y &&
      y <= station.y + station.height,
  );
}

export function createStationHoverFrames({
  world,
  Graphics,
}: {
  world: Container;
  Graphics: GraphicsConstructor;
}) {
  const hoverFrames = new Map<StationId, PixiGraphics>();

  immersiveStations.forEach((station) => {
    const frame = new Graphics()
      .rect(station.x - 8, station.y - 8, station.width + 16, station.height + 16)
      .stroke({ color: sceneColors.hover, width: 6 });
    frame.alpha = 0;
    world.addChild(frame);
    hoverFrames.set(station.id, frame);
  });

  return hoverFrames;
}

export function updateStationHoverFrames(
  hoverFrames: Map<StationId, PixiGraphics>,
  station: ImmersiveStation | undefined,
) {
  hoverFrames.forEach((frame, stationId) => {
    frame.alpha = station?.id === stationId ? 1 : 0;
  });
}
