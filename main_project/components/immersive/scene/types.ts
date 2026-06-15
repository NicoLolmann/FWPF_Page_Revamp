export type StationId =
  | "rules"
  | "booth-1"
  | "booth-2"
  | "booth-3"
  | "booth-4"
  | "review";

export type ImmersiveStationContent = "rules" | "wahl" | "review" | "timetable";

export type ImmersiveStation = {
  id: StationId;
  content: ImmersiveStationContent;
  label: string;
  detail: string;
  x: number;
  y: number;
  width: number;
  height: number;
};

export type CameraTarget = {
  x: number;
  y: number;
  scale: number;
};

export type StationCameraTarget = {
  focusX: number;
  focusY: number;
  screenX: number;
  screenY: number;
  scale: number;
};
