import { sceneColors, sceneHeight, sceneWidth } from "@/components/immersive/scene/sceneConfig";
import type { ImmersiveSpriteName } from "@/components/immersive/scene/sprites";
import type {
  AnimatedSprite as PixiAnimatedSprite,
  Container,
  Graphics as PixiGraphics,
  Sprite,
  Texture,
  TilingSprite,
} from "pixi.js";

type GraphicsConstructor = new () => PixiGraphics;
type SpriteConstructor = new (texture: Texture) => Sprite;
type AnimatedSpriteConstructor = new (textures: Texture[]) => PixiAnimatedSprite;
type TilingSpriteConstructor = new (options: {
  texture: Texture;
  width: number;
  height: number;
}) => TilingSprite;

type DrawPollingStationSceneParams = {
  world: Container;
  Graphics: GraphicsConstructor;
  Sprite: SpriteConstructor;
  AnimatedSprite: AnimatedSpriteConstructor;
  TilingSprite: TilingSpriteConstructor;
  spriteTextures: Map<ImmersiveSpriteName, Texture>;
};

export type PollingStationSceneControls = {
  playBallotSubmitAnimation: () => void;
  resetBallotSubmitAnimation: () => void;
};

function createRect(
  Graphics: GraphicsConstructor,
  x: number,
  y: number,
  width: number,
  height: number,
  fill: number,
  stroke: number = sceneColors.ink,
  strokeWidth: number = 4,
) {
  return new Graphics()
    .rect(x, y, width, height)
    .fill(fill)
    .stroke({ color: stroke, width: strokeWidth });
}

export function drawPollingStationScene({
  world,
  Graphics,
  Sprite,
  AnimatedSprite,
  TilingSprite,
  spriteTextures,
}: DrawPollingStationSceneParams): PollingStationSceneControls {
  function rect(
    x: number,
    y: number,
    width: number,
    height: number,
    fill: number,
    stroke: number = sceneColors.ink,
    strokeWidth: number = 4,
  ) {
    return createRect(Graphics, x, y, width, height, fill, stroke, strokeWidth);
  }

  function addSprite(
    fileName: ImmersiveSpriteName,
    x: number,
    y: number,
    scale: number,
  ) {
    const texture = spriteTextures.get(fileName);

    if (!texture) {
      return undefined;
    }

    const sprite = new Sprite(texture);
    sprite.x = x;
    sprite.y = y;
    sprite.scale.set(scale);
    world.addChild(sprite);
    return sprite;
  }

  function addAnimatedSprite(
    fileNames: ImmersiveSpriteName[],
    x: number,
    y: number,
    scale: number,
    animationSpeed = 0.06,
  ) {
    const textures = fileNames
      .map((fileName) => spriteTextures.get(fileName))
      .filter((texture): texture is Texture => Boolean(texture));

    if (textures.length !== fileNames.length) {
      return undefined;
    }

    const sprite = new AnimatedSprite(textures);
    sprite.anchor.set(0.5, 1);
    sprite.x = x;
    sprite.y = y;
    sprite.scale.set(scale);
    sprite.animationSpeed = animationSpeed;
    sprite.play();
    world.addChild(sprite);
    return sprite;
  }

  function addTiledSprite(
    fileName: ImmersiveSpriteName,
    x: number,
    y: number,
    width: number,
    height: number,
    tileScale = 0.8,
    tileOffsetX = 0,
    tileOffsetY = 0,
  ) {
    const texture = spriteTextures.get(fileName);

    if (!texture) {
      return undefined;
    }

    const sprite = new TilingSprite({ texture, width, height });
    sprite.x = x;
    sprite.y = y;
    sprite.tileScale.set(tileScale);
    sprite.tilePosition.set(
      -x / tileScale + tileOffsetX,
      -y / tileScale + tileOffsetY,
    );
    world.addChild(sprite);
    return sprite;
  }

  const cleanFloorTextureSize = spriteTextures.get("floor-tiles-clean")?.width ?? 237;
  const roomFloorTileScale = 400 / (cleanFloorTextureSize * 6);
  const roomFloorTileOffsetX = 0;
  const roomFloorTileOffsetY = -2;

  const outsidePaddingX = 900;
  const outsidePaddingY = 420;
  const outsideX = -outsidePaddingX;
  const outsideY = -outsidePaddingY;
  const outsideWidth = sceneWidth + outsidePaddingX * 2;
  const outsideHeight = sceneHeight + outsidePaddingY * 2;

  world.addChild(
    rect(
      outsideX,
      outsideY,
      outsideWidth,
      outsideHeight,
      sceneColors.grassBase,
      sceneColors.grassBase,
      0,
    ),
  );

  for (let x = outsideX; x < outsideX + outsideWidth; x += 24) {
    for (let y = outsideY; y < outsideY + outsideHeight; y += 24) {
      const variant = (x * 13 + y * 7) % 5;
      const grassColor =
        variant === 0
          ? sceneColors.grassLight
          : variant === 1
            ? sceneColors.grassDark
            : sceneColors.grassMid;
      world.addChild(
        new Graphics()
          .rect(x + ((y / 24) % 2) * 4, y + ((x / 24) % 2) * 3, 8, 5)
          .fill(grassColor),
      );
    }
  }

  const grassDecorations: Array<{
    name: Extract<ImmersiveSpriteName, "gras-small" | "stone-small">;
    x: number;
    y: number;
    scale: number;
  }> = [
      { name: "gras-small", x: 34, y: 118, scale: 0.34 },
      { name: "stone-small", x: 62, y: 212, scale: 0.22 },
      { name: "gras-small", x: 18, y: 384, scale: 0.42 },
      { name: "stone-small", x: 76, y: 456, scale: 0.18 },
      { name: "gras-small", x: 178, y: 28, scale: 0.3 },
      { name: "stone-small", x: 318, y: 46, scale: 0.16 },
      { name: "gras-small", x: 462, y: 22, scale: 0.38 },
      { name: "gras-small", x: 682, y: 42, scale: 0.28 },
      { name: "stone-small", x: 802, y: 30, scale: 0.2 },
      { name: "gras-small", x: 890, y: 112, scale: 0.36 },
      { name: "stone-small", x: 918, y: 238, scale: 0.17 },
      { name: "gras-small", x: 884, y: 392, scale: 0.44 },
      { name: "stone-small", x: 928, y: 468, scale: 0.2 },
      { name: "gras-small", x: -44, y: 64, scale: 0.32 },
      { name: "gras-small", x: 974, y: 176, scale: 0.3 },
      { name: "stone-small", x: -58, y: 340, scale: 0.16 },
    ];

  grassDecorations.forEach((decoration) => {
    addSprite(decoration.name, decoration.x, decoration.y, decoration.scale);
  });

  const treeDecorations: Array<{
    name: Extract<
      ImmersiveSpriteName,
      "tree-fruits" | "tree-long" | "tree-normal" | "tree-variant"
    >;
    x: number;
    y: number;
    scale: number;
  }> = [
      { name: "tree-normal", x: -82, y: 110, scale: 0.42 },
      { name: "tree-long", x: 950, y: 30, scale: 0.38 },
      { name: "tree-fruits", x: 900, y: 260, scale: 0.45 },
      { name: "tree-variant", x: -94, y: 380, scale: 0.33 },
      { name: "tree-normal", x: 280, y: -30, scale: 0.33 },
      { name: "tree-long", x: 560, y: -50, scale: 0.33 },
    ];

  treeDecorations.forEach((decoration) => {
    addSprite(decoration.name, decoration.x, decoration.y, decoration.scale);
  });

  const corridorY = 526;
  const corridorHeight = 140;
  const corridorFloorTileScale = roomFloorTileScale;
  const corridorFloorTileOffsetX = -11;
  const corridorFloorTileOffsetY = 5;
  world.addChild(rect(outsideX, corridorY, outsideWidth, corridorHeight, sceneColors.floorBase));
  addTiledSprite(
    "floor-tiles-clean",
    outsideX,
    corridorY,
    outsideWidth,
    corridorHeight,
    corridorFloorTileScale,
    corridorFloorTileOffsetX,
    corridorFloorTileOffsetY,
  );

  const roomX = 98;
  const roomY = 78;
  const roomExtensionX = 18;
  const roomWidth = 764 + roomExtensionX;
  const roomHeight = 448;
  const roomRight = roomX + roomWidth;
  const roomBottom = roomY + roomHeight;
  const innerWallX = 108;
  const innerWallTopY = 88;
  const innerWallBottomY = 502;
  const innerWallWidth = 744 + roomExtensionX;
  const leftWallX = 108;
  const rightWallX = 834 + roomExtensionX;
  const sideWallWidth = 18;
  const sideWallHeight = 428;
  const bottomWallY = 502;
  const bottomWallAccentY = 502;
  const wallExtensionHeight = roomBottom - bottomWallY;

  world.addChild(
    rect(
      outsideX,
      bottomWallY,
      roomX - outsideX,
      wallExtensionHeight,
      sceneColors.wallBase,
      sceneColors.ink,
      6,
    ),
  );
  world.addChild(
    rect(
      roomRight,
      bottomWallY,
      outsideX + outsideWidth - roomRight,
      wallExtensionHeight,
      sceneColors.wallBase,
      sceneColors.ink,
      6,
    ),
  );
  world.addChild(
    new Graphics()
      .rect(outsideX, bottomWallAccentY, roomX - outsideX, 14)
      .fill(sceneColors.wallAccent),
  );
  world.addChild(
    new Graphics()
      .rect(roomRight, bottomWallAccentY, outsideX + outsideWidth - roomRight, 14)
      .fill(sceneColors.wallAccent),
  );

  world.addChild(
    rect(roomX, roomY, roomWidth, roomHeight, sceneColors.wallBase, sceneColors.ink, 6),
  );

  world.addChild(
    new Graphics().rect(innerWallX, innerWallTopY, innerWallWidth, 18).fill(sceneColors.wallTop),
  );
  world.addChild(
    new Graphics().rect(innerWallX, innerWallBottomY, innerWallWidth, 14).fill(sceneColors.wallAccent),
  );
  world.addChild(
    new Graphics().rect(leftWallX, innerWallTopY, sideWallWidth, sideWallHeight).fill(sceneColors.wallSide),
  );
  world.addChild(
    new Graphics().rect(rightWallX, innerWallTopY, sideWallWidth, sideWallHeight).fill(sceneColors.wallSide),
  );

  const topWallMarkWidth = 36;
  for (let x = 126; x + topWallMarkWidth <= rightWallX; x += 72) {
    world.addChild(new Graphics().rect(x, 92, topWallMarkWidth, 4).fill(sceneColors.wallMark));
  }

  for (let y = 126; y < 490; y += 68) {
    world.addChild(new Graphics().rect(112, y, 4, 32).fill(sceneColors.sideWallMark));
    world.addChild(new Graphics().rect(rightWallX + 10, y, 4, 32).fill(sceneColors.sideWallMark));
  }

  const floorX = 122;
  const floorY = 102;
  const floorWidth = 716 + roomExtensionX;
  const floorHeight = 400;

  world.addChild(rect(floorX, floorY, floorWidth, floorHeight, sceneColors.floorBase));
  addTiledSprite(
    "floor-tiles-clean",
    floorX,
    floorY,
    floorWidth,
    floorHeight,
    roomFloorTileScale,
    roomFloorTileOffsetX,
    roomFloorTileOffsetY,
  );

  world.addChild(
    new Graphics()
      .rect(floorX, floorY, floorWidth, floorHeight)
      .stroke({ color: sceneColors.ink, width: 4 }),
  );

  const doorwayX = 640;
  const doorwayY = 500;
  const doorwayWidth = 68;
  const doorwayHeight = 30;
  const doorwayFloorX = doorwayX;
  const doorwayFloorY = doorwayY;
  const doorwayFloorWidth = doorwayWidth;
  const doorwayFloorHeight = doorwayHeight;
  const doorwayFloorColor = 0xb8ac94;
  world.addChild(
    new Graphics()
      .rect(doorwayFloorX, doorwayFloorY, doorwayFloorWidth, doorwayFloorHeight)
      .fill(doorwayFloorColor),
  );

  world.addChild(new Graphics().rect(doorwayX - 4, doorwayY, 4, doorwayHeight).fill(sceneColors.ink));
  world.addChild(
    new Graphics()
      .rect(doorwayX + doorwayWidth, doorwayY, 4, doorwayHeight)
      .fill(sceneColors.ink),
  );

  addSprite("door-open", 630, 432, 0.63);

  const rulesTableX = 730;
  const rulesTableY = 320;
  const rulesTableScale = 1.1;
  const rulesWomanOffsetX = 80;
  const rulesWomanOffsetY = 100;
  const rulesWomanX = rulesTableX + rulesWomanOffsetX;
  const rulesWomanY = rulesTableY + rulesWomanOffsetY;
  const rulesWomanScale = 0.18;
  const rulesWomanAnimationSpeed = 0.045;
  addAnimatedSprite(
    [
      "girl-frame-1-aligned",
      "girl-frame-2-aligned",
      "girl-frame-3-aligned",
      "girl-frame-4-aligned",
    ],
    rulesWomanX,
    rulesWomanY,
    rulesWomanScale,
    rulesWomanAnimationSpeed,
  );
  addSprite("rules-table-side", rulesTableX, rulesTableY, rulesTableScale);

  for (let index = 0; index < 4; index += 1) {
    const x = 190 + index * 140;
    addSprite(`booth-${index + 1}` as ImmersiveSpriteName, x, 112, 0.67);
  }
  addSprite("timetable-poster", 646, 130, 0.24);

  const reviewTableX = 200;
  const reviewTableY = 330;
  const reviewTableScale = 1.1;
  const reviewBallotBoxOffsetX = 19;
  const reviewBallotBoxOffsetY = 4;
  const reviewBallotBoxScale = 0.55;
  const reviewBoyX = reviewTableX - 30;
  const reviewBoyY = 440;
  const reviewBoyScale = 0.25;
  const reviewBoyAnimationSpeed = 0.045;
  addAnimatedSprite(
    ["boy-frame-1", "boy-frame-2", "boy-frame-3", "boy-frame-4"],
    reviewBoyX,
    reviewBoyY,
    reviewBoyScale,
    reviewBoyAnimationSpeed,
  );
  addSprite("review-table-side", reviewTableX, reviewTableY, reviewTableScale);
  addSprite(
    "ballot-box-side",
    reviewTableX + reviewBallotBoxOffsetX,
    reviewTableY + reviewBallotBoxOffsetY,
    reviewBallotBoxScale,
  );
  const sceneSubmitBallot = addSprite("voting-sheet", 0, 0, 0.22);
  let sceneSubmitAnimationFrame = 0;
  let submitSuccessAnimationFrame = 0;
  let submitSuccessParticles: PixiGraphics[] = [];

  function clearSubmitSuccessBurst() {
    window.cancelAnimationFrame(submitSuccessAnimationFrame);
    submitSuccessParticles.forEach((particle) => {
      particle.destroy();
    });
    submitSuccessParticles = [];
  }

  function playSubmitSuccessBurst() {
    clearSubmitSuccessBurst();

    const originX = reviewTableX + reviewBallotBoxOffsetX + 14;
    const originY = reviewTableY + reviewBallotBoxOffsetY;
    const colors = [0xffd166, 0xef476f, 0x06d6a0, 0x118ab2, 0xffffff];
    const particles = Array.from({ length: 18 }, (_, index) => {
      const angle = (Math.PI * 2 * index) / 18;
      const speed = 28 + (index % 5) * 7;
      const particle = new Graphics()
        .rect(-3, -3, 6, 6)
        .fill(colors[index % colors.length]);
      particle.x = originX;
      particle.y = originY;
      world.addChild(particle);
      submitSuccessParticles.push(particle);

      return {
        particle,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 18,
      };
    });

    const duration = 1200;
    const startedAt = performance.now();

    function tick(now: number) {
      const progress = Math.min(1, (now - startedAt) / duration);
      const fade = 1 - progress;

      particles.forEach(({ particle, vx, vy }) => {
        particle.x = originX + vx * progress;
        particle.y = originY + vy * progress + 54 * progress * progress;
        particle.alpha = fade;
        particle.scale.set(Math.max(0.2, fade));
      });

      if (progress < 1) {
        submitSuccessAnimationFrame = window.requestAnimationFrame(tick);
        return;
      }

      clearSubmitSuccessBurst();
    }

    submitSuccessAnimationFrame = window.requestAnimationFrame(tick);
  }

  function resetBallotSubmitAnimation() {
    window.cancelAnimationFrame(sceneSubmitAnimationFrame);
    clearSubmitSuccessBurst();

    if (!sceneSubmitBallot) {
      return;
    }

    sceneSubmitBallot.visible = false;
    sceneSubmitBallot.alpha = 0;
    sceneSubmitBallot.rotation = 0;
    sceneSubmitBallot.x = reviewTableX - 10;
    sceneSubmitBallot.y = reviewTableY - 36;
  }

  function playBallotSubmitAnimation() {
    if (!sceneSubmitBallot) {
      return;
    }

    window.cancelAnimationFrame(sceneSubmitAnimationFrame);

    const start = { x: reviewTableX - 10, y: reviewTableY - 36 };
    const aboveBox = {
      x: reviewTableX + reviewBallotBoxOffsetX,
      y: reviewTableY - 36,
    };
    const insideBox = {
      x: reviewTableX + reviewBallotBoxOffsetX + 1,
      y: reviewTableY + reviewBallotBoxOffsetY + 28,
    };
    const duration = 980;
    const startedAt = performance.now();

    sceneSubmitBallot.visible = true;
    sceneSubmitBallot.alpha = 1;
    sceneSubmitBallot.rotation = 0;
    sceneSubmitBallot.x = start.x;
    sceneSubmitBallot.y = start.y;

    function tick(now: number) {
      const progress = Math.min(1, (now - startedAt) / duration);

      if (progress < 0.58) {
        const localProgress = progress / 0.58;
        sceneSubmitBallot!.x = start.x + (aboveBox.x - start.x) * localProgress;
        sceneSubmitBallot!.y = start.y + (aboveBox.y - start.y) * localProgress;
        sceneSubmitBallot!.rotation = -0.06 * localProgress;
      } else {
        const localProgress = (progress - 0.58) / 0.42;
        sceneSubmitBallot!.x = aboveBox.x + (insideBox.x - aboveBox.x) * localProgress;
        sceneSubmitBallot!.y = aboveBox.y + (insideBox.y - aboveBox.y) * localProgress;
        sceneSubmitBallot!.alpha = Math.max(0, 1 - localProgress * 1.25);
      }

      if (progress < 1) {
        sceneSubmitAnimationFrame = window.requestAnimationFrame(tick);
        return;
      }

      resetBallotSubmitAnimation();
      playSubmitSuccessBurst();
    }

    sceneSubmitAnimationFrame = window.requestAnimationFrame(tick);
  }

  addSprite("plant-small", 760, 120, 0.4);
  addSprite("trash-bin", 140, 250, 0.4);

  addSprite("water-machine", 565, 470, 0.3);
  addSprite("bench-small", 410, 540, 0.35);
  addSprite("locker-group", -60, 470, 0.3);
  addSprite("locker-group", 59, 470, 0.3);

  resetBallotSubmitAnimation();

  return {
    playBallotSubmitAnimation,
    resetBallotSubmitAnimation,
  };
}
