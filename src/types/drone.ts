// Comprehensive drone swarm data types

export interface DronePosition {
  x: number;
  y: number; // Height
  z: number;
}

export interface DroneVelocity {
  x: number;
  y: number;
  z: number;
}

export interface DroneOrientation {
  pitch: number; // Rotation around X-axis
  roll: number;  // Rotation around Z-axis  
  yaw: number;   // Rotation around Y-axis
}

export type DroneState = 
  | 'idle' 
  | 'patrol' 
  | 'search' 
  | 'rescue' 
  | 'attack' 
  | 'charging' 
  | 'maintenance' 
  | 'emergency';

export type TaskType = 
  | 'idle'
  | 'patrol'
  | 'search'
  | 'rescue'
  | 'attack';

export type SwarmID = 'alpha' | 'beta' | 'gamma' | 'delta' | 'epsilon';

export interface DroneData {
  droneId: string;
  timePoint: number;
  swarmId: SwarmID;
  taskId: TaskType;
  state: DroneState;
  position: DronePosition;
  velocity: DroneVelocity;
  orientation: DroneOrientation;
  batteryPercentage: number;
  detectionRange: number;
}

export interface DroneSwarmDataset {
  timePoints: number[];
  drones: DroneData[];
  metadata: {
    totalDrones: number;
    totalTimePoints: number;
    swarmCounts: Record<SwarmID, number>;
    taskCounts: Record<TaskType, number>;
    boundingBox: {
      min: DronePosition;
      max: DronePosition;
    };
  };
}

// Visualization filters and controls
export interface VisualizationFilters {
  selectedSwarms: SwarmID[];
  selectedTasks: TaskType[];
  selectedStates: DroneState[];
  batteryRange: [number, number];
  showTrajectories: boolean;
  showDetectionRanges: boolean;
  showVelocityVectors: boolean;
}

export interface TimelineState {
  currentTime: number;
  isPlaying: boolean;
  playbackSpeed: number;
  timeRange: [number, number];
}