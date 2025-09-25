import { DroneData, DroneSwarmDataset, SwarmID, TaskID, DroneState } from '../types/drone';

// Parse the real drone data from the uploaded Excel content
export function parseRealDroneData(): DroneSwarmDataset {
  // Real data extracted from the Excel file
  const rawData = [
    { DroneID: 1, TimePoint: 'TP1', SwarmID: -1, TaskID: -1, State: 'Taking Off', PositionX: 0, PositionY: 0, PositionZ: 0, VelocityX: 2.1, VelocityY: 2.3, VelocityZ: 1.04, Pitch: 22.1, Roll: 2.3, Yaw: 48.2, BatteryPercentage: 98, DetectionRange: 50 },
    { DroneID: 1, TimePoint: 'TP2', SwarmID: 1, TaskID: -1, State: 'Entering Swarm', PositionX: 21, PositionY: 23, PositionZ: 10.4, VelocityX: 1.9, VelocityY: 2.56, VelocityZ: 0.94, Pitch: 18.4, Roll: -1.5, Yaw: 52.7, BatteryPercentage: 98, DetectionRange: 50 },
    { DroneID: 1, TimePoint: 'TP3', SwarmID: 1, TaskID: -1, State: 'Hovering', PositionX: 40, PositionY: 48.6, PositionZ: 19.8, VelocityX: 2.16, VelocityY: 2.2, VelocityZ: 1.1, Pitch: 21.9, Roll: 3.2, Yaw: 49.5, BatteryPercentage: 96, DetectionRange: 50 },
    { DroneID: 1, TimePoint: 'TP4', SwarmID: 1, TaskID: -1, State: 'Passing By', PositionX: 61.6, PositionY: 70.6, PositionZ: 30.8, VelocityX: 2.19, VelocityY: 2, VelocityZ: 1.11, Pitch: 24.1, Roll: 3, Yaw: 49.7, BatteryPercentage: 95, DetectionRange: 50 },
    { DroneID: 2, TimePoint: 'TP1', SwarmID: -1, TaskID: -1, State: 'Taking Off', PositionX: 96, PositionY: 40, PositionZ: 20, VelocityX: -2.1, VelocityY: 0.96, VelocityZ: 0.04, Pitch: 0.9, Roll: -2.5, Yaw: 160.1, BatteryPercentage: 100, DetectionRange: 50 },
    { DroneID: 2, TimePoint: 'TP2', SwarmID: -1, TaskID: -1, State: 'Passing By', PositionX: 75, PositionY: 49.6, PositionZ: 20.4, VelocityX: -2.24, VelocityY: 1.04, VelocityZ: -0.02, Pitch: -1.1, Roll: 4.1, Yaw: 155.3, BatteryPercentage: 98, DetectionRange: 50 },
    { DroneID: 2, TimePoint: 'TP3', SwarmID: 1, TaskID: 1, State: 'Entering Swarm', PositionX: 52.6, PositionY: 60, PositionZ: 20.2, VelocityX: -2.6, VelocityY: 0.92, VelocityZ: 0.06, Pitch: 1.2, Roll: -3.7, Yaw: 158.2, BatteryPercentage: 97, DetectionRange: 50 },
    { DroneID: 2, TimePoint: 'TP4', SwarmID: 1, TaskID: 1, State: 'Attacking', PositionX: 26.6, PositionY: 69.2, PositionZ: 20.8, VelocityX: -2.3, VelocityY: 0.9, VelocityZ: 0.06, Pitch: 1.3, Roll: -3.3, Yaw: 158.6, BatteryPercentage: 95, DetectionRange: 50 },
    { DroneID: 3, TimePoint: 'TP1', SwarmID: -1, TaskID: -1, State: 'Taking Off', PositionX: 0, PositionY: 0, PositionZ: 10, VelocityX: 2.04, VelocityY: 1.7, VelocityZ: 0.56, Pitch: 15.4, Roll: 1.8, Yaw: -41.1, BatteryPercentage: 91, DetectionRange: 50 },
    { DroneID: 3, TimePoint: 'TP2', SwarmID: -1, TaskID: -1, State: 'Passing By', PositionX: 20.4, PositionY: 17, PositionZ: 15.6, VelocityX: 1.94, VelocityY: 1.56, VelocityZ: 0.46, Pitch: 12.8, Roll: -2.6, Yaw: -36.9, BatteryPercentage: 89, DetectionRange: 50 },
    { DroneID: 3, TimePoint: 'TP3', SwarmID: 2, TaskID: 2, State: 'Entering Swarm', PositionX: 39.8, PositionY: 32.6, PositionZ: 20.2, VelocityX: 2.1, VelocityY: 1.64, VelocityZ: 0.54, Pitch: 14.9, Roll: 3.1, Yaw: -39.8, BatteryPercentage: 88, DetectionRange: 50 },
    { DroneID: 3, TimePoint: 'TP4', SwarmID: 2, TaskID: 2, State: 'Hovering', PositionX: 60.8, PositionY: 49, PositionZ: 25.6, VelocityX: 2.6, VelocityY: 1.33, VelocityZ: 0.79, Pitch: 15.1, Roll: 3.2, Yaw: -39.1, BatteryPercentage: 85, DetectionRange: 50 },
    { DroneID: 4, TimePoint: 'TP1', SwarmID: -1, TaskID: -1, State: 'Taking Off', PositionX: 80, PositionY: 20, PositionZ: 0, VelocityX: -1.4, VelocityY: 2.1, VelocityZ: 1.06, Pitch: 28.9, Roll: -3.4, Yaw: -126.5, BatteryPercentage: 95, DetectionRange: 50 },
    { DroneID: 4, TimePoint: 'TP2', SwarmID: -1, TaskID: -1, State: 'Passing By', PositionX: 66, PositionY: 41, PositionZ: 10.6, VelocityX: -1.28, VelocityY: 1.92, VelocityZ: 0.96, Pitch: 25.2, Roll: 2.8, Yaw: -121.7, BatteryPercentage: 95, DetectionRange: 50 },
    { DroneID: 4, TimePoint: 'TP3', SwarmID: 2, TaskID: 2, State: 'Entering Swarm', PositionX: 53.2, PositionY: 60.2, PositionZ: 20.2, VelocityX: -1.42, VelocityY: 2.04, VelocityZ: 1.02, Pitch: 27.6, Roll: -4.6, Yaw: -124.9, BatteryPercentage: 94, DetectionRange: 50 },
    { DroneID: 4, TimePoint: 'TP4', SwarmID: 2, TaskID: 2, State: 'Parachute Deployment', PositionX: 39, PositionY: 80.6, PositionZ: 30.4, VelocityX: -1.55, VelocityY: 2.12, VelocityZ: 1.31, Pitch: 27.9, Roll: -4.2, Yaw: -125.9, BatteryPercentage: 93, DetectionRange: 50 }
  ];

  // Transform raw data to DroneData format
  const drones: DroneData[] = rawData.map(row => ({
    droneId: row.DroneID,
    timePoint: row.TimePoint,
    swarmId: row.SwarmID as SwarmID,
    taskId: row.TaskID as TaskID,
    state: row.State as DroneState,
    position: {
      x: row.PositionX,
      y: row.PositionY,
      z: row.PositionZ
    },
    velocity: {
      x: row.VelocityX,
      y: row.VelocityY,
      z: row.VelocityZ
    },
    orientation: {
      pitch: row.Pitch,
      roll: row.Roll,
      yaw: row.Yaw
    },
    batteryPercentage: row.BatteryPercentage,
    detectionRange: row.DetectionRange
  }));

  // Extract unique time points
  const timePoints = Array.from(new Set(drones.map(d => d.timePoint))).sort();

  // Calculate metadata
  const uniqueDroneIds = new Set(drones.map(d => d.droneId));
  const totalDrones = uniqueDroneIds.size;

  // Count swarms
  const swarmCounts: Record<number, number> = {};
  drones.forEach(drone => {
    if (drone.swarmId >= 0) { // Only count actual swarms, not -1
      swarmCounts[drone.swarmId] = (swarmCounts[drone.swarmId] || 0) + 1;
    }
  });

  // Count tasks
  const taskCounts: Record<number, number> = {};
  drones.forEach(drone => {
    if (drone.taskId >= 0) { // Only count actual tasks, not -1
      taskCounts[drone.taskId] = (taskCounts[drone.taskId] || 0) + 1;
    }
  });

  // Count states
  const stateCounts: Record<DroneState, number> = {} as Record<DroneState, number>;
  drones.forEach(drone => {
    stateCounts[drone.state] = (stateCounts[drone.state] || 0) + 1;
  });

  // Calculate bounding box
  const positions = drones.map(d => d.position);
  const boundingBox = {
    min: {
      x: Math.min(...positions.map(p => p.x)) - 10,
      y: Math.min(...positions.map(p => p.y)) - 10,
      z: Math.min(...positions.map(p => p.z)) - 10
    },
    max: {
      x: Math.max(...positions.map(p => p.x)) + 10,
      y: Math.max(...positions.map(p => p.y)) + 10,
      z: Math.max(...positions.map(p => p.z)) + 10
    }
  };

  return {
    timePoints,
    drones,
    metadata: {
      totalDrones,
      totalTimePoints: timePoints.length,
      swarmCounts,
      taskCounts,
      stateCounts,
      boundingBox
    }
  };
}

// Get drones for a specific time point
export function getDronesAtTime(dataset: DroneSwarmDataset, timePoint: string): DroneData[] {
  return dataset.drones.filter(drone => drone.timePoint === timePoint);
}

// Get trajectory for a specific drone
export function getDroneTrajectory(dataset: DroneSwarmDataset, droneId: number): DroneData[] {
  return dataset.drones
    .filter(drone => drone.droneId === droneId)
    .sort((a, b) => a.timePoint.localeCompare(b.timePoint));
}