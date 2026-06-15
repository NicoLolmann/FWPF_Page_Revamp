"use client";

import { useEffect, useRef, useState } from "react";
import { easeOutCubic, getStationCameraTarget } from "@/components/immersive/scene/camera";
import {
  drawPollingStationScene,
  type PollingStationSceneControls,
} from "@/components/immersive/scene/drawScene";
import { createStationHoverFrames, findStationAt, updateStationHoverFrames } from "@/components/immersive/scene/interactions";
import { sceneColors, sceneHeight, sceneWidth } from "@/components/immersive/scene/sceneConfig";
import {
  getImmersiveSpritePath,
  immersiveSpriteNames,
} from "@/components/immersive/scene/sprites";
import type {
  CameraTarget,
  ImmersiveStation,
  ImmersiveStationContent,
} from "@/components/immersive/scene/types";

export type { ImmersiveStationContent } from "@/components/immersive/scene/types";

type ImmersivePollingStationProps = {
  fullScreen?: boolean;
  onStationSelect?: (station: ImmersiveStationContent) => void;
  resetSignal?: number;
  submitAnimationSignal?: number;
  hideStationHint?: boolean;
};

export function ImmersivePollingStation({
  fullScreen = false,
  onStationSelect,
  resetSignal = 0,
  submitAnimationSignal = 0,
  hideStationHint = false,
}: ImmersivePollingStationProps) {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const appRef = useRef<{ destroy: () => void } | null>(null);
  const resetCameraRef = useRef<(() => void) | null>(null);
  const sceneControlsRef = useRef<PollingStationSceneControls | null>(null);
  const [hoveredStation, setHoveredStation] = useState<ImmersiveStation | undefined>();
  const [selectedStation, setSelectedStation] = useState<ImmersiveStation | undefined>();

  useEffect(() => {
    setSelectedStation(undefined);
    resetCameraRef.current?.();
  }, [resetSignal]);

  useEffect(() => {
    if (submitAnimationSignal > 0) {
      sceneControlsRef.current?.playBallotSubmitAnimation();
    }
  }, [submitAnimationSignal]);

  useEffect(() => {
    let cancelled = false;
    let cameraAnimationFrame = 0;
    let baseCamera: CameraTarget = { x: 0, y: 0, scale: 1 };
    const openTimers = new Set<number>();

    async function setupPixi() {
      const { AnimatedSprite, Application, Assets, Container, Graphics, Sprite, TilingSprite } =
        await import("pixi.js");

      if (cancelled || !mountRef.current) {
        return;
      }

      const app = new Application();
      await app.init({
        width: fullScreen ? window.innerWidth : sceneWidth,
        height: fullScreen ? window.innerHeight : sceneHeight,
        backgroundColor: sceneColors.appBackground,
        antialias: false,
        autoDensity: true,
        resolution: window.devicePixelRatio || 1,
      });

      if (cancelled || !mountRef.current) {
        app.destroy();
        return;
      }

      const spriteTextures = new Map(
        await Promise.all(
          immersiveSpriteNames.map(async (name) => [
            name,
            await Assets.load(getImmersiveSpritePath(name)),
          ] as const),
        ),
      );

      if (cancelled || !mountRef.current) {
        app.destroy();
        return;
      }

      app.canvas.style.width = fullScreen ? "100vw" : "100%";
      app.canvas.style.height = fullScreen ? "100vh" : "auto";
      app.canvas.style.imageRendering = "pixelated";
      app.canvas.className = fullScreen
        ? "block bg-ink"
        : "block border-4 border-ink bg-ink shadow-pixel";
      mountRef.current.appendChild(app.canvas);

      const world = new Container();
      app.stage.addChild(world);

      function calculateBaseCamera() {
        const viewportWidth = app.screen.width;
        const viewportHeight = app.screen.height;
        const scale = Math.min(viewportWidth / sceneWidth, viewportHeight / sceneHeight);

        return {
          x: (viewportWidth - sceneWidth * scale) / 2,
          y: (viewportHeight - sceneHeight * scale) / 2 - 28,
          scale,
        };
      }

      function animateCamera(target: CameraTarget, duration = 520) {
        window.cancelAnimationFrame(cameraAnimationFrame);

        const start = {
          x: world.x,
          y: world.y,
          scale: world.scale.x,
        };
        const startTime = performance.now();

        function tick(now: number) {
          const progress = Math.min(1, (now - startTime) / duration);
          const eased = easeOutCubic(progress);

          world.x = start.x + (target.x - start.x) * eased;
          world.y = start.y + (target.y - start.y) * eased;
          world.scale.set(start.scale + (target.scale - start.scale) * eased);

          if (progress < 1) {
            cameraAnimationFrame = window.requestAnimationFrame(tick);
          }
        }

        cameraAnimationFrame = window.requestAnimationFrame(tick);
      }

      resetCameraRef.current = () => {
        animateCamera(baseCamera, 460);
      };

      sceneControlsRef.current = drawPollingStationScene({
        world,
        Graphics,
        Sprite,
        AnimatedSprite,
        TilingSprite,
        spriteTextures,
      });

      const hoverFrames = createStationHoverFrames({ world, Graphics });

      function setActiveHover(station: ImmersiveStation | undefined) {
        setHoveredStation(station);
        updateStationHoverFrames(hoverFrames, station);
      }

      function openStation(station: ImmersiveStation) {
        openTimers.forEach((timer) => window.clearTimeout(timer));
        openTimers.clear();
        setSelectedStation(station);
        const cameraTarget = getStationCameraTarget(station);
        const targetScreenX = (cameraTarget.screenX / sceneWidth) * app.screen.width;
        const targetScreenY = (cameraTarget.screenY / sceneHeight) * app.screen.height;
        const targetScale = baseCamera.scale * cameraTarget.scale;
        animateCamera(
          {
            x: targetScreenX - cameraTarget.focusX * targetScale,
            y: targetScreenY - cameraTarget.focusY * targetScale,
            scale: targetScale,
          },
          560,
        );

        const timer = window.setTimeout(() => {
          onStationSelect?.(station.content);
          openTimers.delete(timer);
        }, 430);
        openTimers.add(timer);
      }

      const interactionPlane = new Graphics()
        .rect(0, 0, sceneWidth, sceneHeight)
        .fill({ color: 0xffffff, alpha: 0.001 });
      interactionPlane.eventMode = "static";
      interactionPlane.cursor = "default";
      interactionPlane.on("pointermove", (event) => {
        const point = world.toLocal(event.global);
        const station = findStationAt(point.x, point.y);
        interactionPlane.cursor = station ? "pointer" : "default";
        setActiveHover(station);
      });
      interactionPlane.on("pointerout", () => {
        interactionPlane.cursor = "default";
        setActiveHover(undefined);
      });
      interactionPlane.on("pointertap", (event) => {
        const point = world.toLocal(event.global);
        const station = findStationAt(point.x, point.y);

        if (station) {
          openStation(station);
        }
      });
      world.addChild(interactionPlane);

      function resizeScene() {
        if (!fullScreen) {
          baseCamera = { x: 0, y: 0, scale: 1 };
          world.x = 0;
          world.y = 0;
          world.scale.set(1);
          return;
        }

        app.renderer.resize(window.innerWidth, window.innerHeight);
        baseCamera = calculateBaseCamera();
        world.x = baseCamera.x;
        world.y = baseCamera.y;
        world.scale.set(baseCamera.scale);
      }

      resizeScene();
      window.addEventListener("resize", resizeScene);

      appRef.current = {
        destroy: () => {
          window.removeEventListener("resize", resizeScene);
          app.destroy(true, { children: true });
        },
      };
    }

    setupPixi();

    return () => {
      cancelled = true;
      window.cancelAnimationFrame(cameraAnimationFrame);
      openTimers.forEach((timer) => window.clearTimeout(timer));
      appRef.current?.destroy();
      appRef.current = null;
      resetCameraRef.current = null;
      sceneControlsRef.current = null;
      if (mountRef.current) {
        mountRef.current.innerHTML = "";
      }
    };
  }, [fullScreen, onStationSelect]);

  if (fullScreen) {
    return (
      <section className="relative h-dvh w-dvw overflow-hidden bg-[#24211e]">
        <div ref={mountRef} className="grid h-full w-full place-items-center" />
        <div className="pointer-events-none absolute left-5 top-5 grid gap-2">
          {!hideStationHint && (hoveredStation || selectedStation) ? (
            <div className="border-4 border-ink bg-ballot p-3 shadow-pixel-sm">
              <p className="font-pixel text-xs font-black uppercase text-ink/70">
                {hoveredStation ? "Station" : "Ausgewählt"}
              </p>
              <p className="mt-1 font-pixel text-lg font-black">
                {(hoveredStation ?? selectedStation)?.label}
              </p>
              <p className="mt-1 max-w-64 text-sm leading-5">
                {(hoveredStation ?? selectedStation)?.detail}
              </p>
            </div>
          ) : null}
        </div>

      </section>
    );
  }

  return (
    <section className="pixel-panel overflow-hidden bg-paper p-4 md:p-5">
      <div className="mb-4 flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="font-pixel text-xs font-black uppercase text-ink/70">
            Immersive Mode
          </p>
          <h2 className="mt-1 font-pixel text-2xl font-black">
            Wahlraum der Grundschule
          </h2>
        </div>
        <div className="border-3 border-ink bg-white px-3 py-2 font-pixel text-xs font-black uppercase shadow-[2px_2px_0_#171717]">
          Stationen anklicken
        </div>
      </div>

      <div className="relative">
        <div ref={mountRef} />
        <div className="pointer-events-none absolute left-4 top-4 grid gap-2">
          {!hideStationHint && (hoveredStation || selectedStation) ? (
            <div className="border-4 border-ink bg-ballot p-3 shadow-pixel-sm">
              <p className="font-pixel text-xs font-black uppercase text-ink/70">
                {hoveredStation ? "Station" : "Ausgewählt"}
              </p>
              <p className="mt-1 font-pixel text-lg font-black">
                {(hoveredStation ?? selectedStation)?.label}
              </p>
              <p className="mt-1 max-w-64 text-sm leading-5">
                {(hoveredStation ?? selectedStation)?.detail}
              </p>
            </div>
          ) : null}
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-4 border-ink bg-white p-3">
        <p className="text-sm leading-6">
          Erste technische Szene: Die Stationen reagieren auf Hover und Klick. Im
          nächsten Schritt öffnen sie die bestehenden Wahl-Komponenten als Papier-Overlay.
        </p>
      </div>
    </section>
  );
}
