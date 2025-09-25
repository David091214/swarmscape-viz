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
  | 'Taking Off'
  | 'Entering Swarm'
  | 'Hovering'
  | 'Passing By'
  | 'Attacking'
  | 'Parachute Deployment';

export type TaskID = number; // -1 for no task, positive numbers for task assignments
export type TaskType = TaskID; // For compatibility

export type SwarmID = number; // -1 for no swarm, positive numbers for swarm assignments

export interface DroneData {
  droneId: number;
  timePoint: string;
  swarmId: SwarmID;
  taskId: TaskID;
  state: DroneState;
  position: DronePosition;
  velocity: DroneVelocity;
  orientation: DroneOrientation;
  batteryPercentage: number;
  detectionRange: number;
}

export interface DroneSwarmDataset {
  timePoints: string[];
  drones: DroneData[];
  metadata: {
    totalDrones: number;
    totalTimePoints: number;
    swarmCounts: Record<number, number>;
    taskCounts: Record<number, number>;
    stateCounts: Record<DroneState, number>;
    boundingBox: {
      min: DronePosition;
      max: DronePosition;
    };
  };
}

// Visualization filters and controls
export interface VisualizationFilters {
  selectedSwarms: SwarmID[];
  selectedTasks: TaskID[];
  selectedStates: DroneState[];
  batteryRange: [number, number];
  showTrajectories: boolean;
  showDetectionRanges: boolean;
  showVelocityVectors: boolean;
}

export interface TimelineState {
  currentTime: string;
  isPlaying: boolean;
  playbackSpeed: number;
  timeRange: [string, string];
}