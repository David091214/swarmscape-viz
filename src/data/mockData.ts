import { DroneData, DroneSwarmDataset, SwarmID, TaskType, DroneState } from '../types/drone';

// Generate realistic mock data for drone swarm visualization
export function generateMockData(): DroneSwarmDataset {
  const timePoints = Array.from({ length: 100 }, (_, i) => i);
  const swarms: SwarmID[] = ['alpha', 'beta', 'gamma', 'delta', 'epsilon'];
  const tasks: TaskType[] = ['idle', 'patrol', 'search', 'rescue', 'attack'];
  const states: DroneState[] = ['idle', 'patrol', 'search', 'rescue', 'attack', 'charging'];
  
  const drones: DroneData[] = [];
  const dronesPerSwarm = 8;
  const totalDrones = swarms.length * dronesPerSwarm;

  // Swarm formation centers and behaviors
  const swarmCenters = {
    alpha: { x: -50, y: 20, z: -30 },
    beta: { x: 30, y: 25, z: 40 },
    gamma: { x: 0, y: 30, z: 0 },
    delta: { x: -30, y: 15, z: 30 },
    epsilon: { x: 50, y: 35, z: -20 }
  };

  timePoints.forEach(timePoint => {
    swarms.forEach(swarmId => {
      for (let droneIndex = 0; droneIndex < dronesPerSwarm; droneIndex++) {
        const droneId = `${swarmId}-${droneIndex.toString().padStart(2, '0')}`;
        const center = swarmCenters[swarmId];
        
        // Create realistic movement patterns
        const t = timePoint * 0.1;
        const swarmPhase = swarms.indexOf(swarmId) * Math.PI * 0.4;
        const dronePhase = droneIndex * Math.PI * 0.25;
        
        // Different movement patterns based on task
        const currentTask = tasks[Math.floor((timePoint / 20 + droneIndex) % tasks.length)];
        const currentState = currentTask as DroneState;
        
        let position = { ...center };
        let velocity = { x: 0, y: 0, z: 0 };
        
        switch (currentTask) {
          case 'patrol':
            // Circular patrol pattern
            const patrolRadius = 15 + droneIndex * 2;
            position.x += patrolRadius * Math.cos(t + dronePhase + swarmPhase);
            position.z += patrolRadius * Math.sin(t + dronePhase + swarmPhase);
            position.y += Math.sin(t * 0.5 + dronePhase) * 3;
            velocity.x = -patrolRadius * 0.1 * Math.sin(t + dronePhase + swarmPhase);
            velocity.z = patrolRadius * 0.1 * Math.cos(t + dronePhase + swarmPhase);
            break;
            
          case 'search':
            // Random search pattern with some coordination
            const searchX = center.x + (Math.sin(t * 1.2 + dronePhase) * 20);
            const searchZ = center.z + (Math.cos(t * 0.8 + dronePhase) * 20);
            position.x = searchX;
            position.z = searchZ;
            position.y = center.y + Math.sin(t * 0.3 + dronePhase) * 8;
            velocity.x = 1.2 * Math.cos(t * 1.2 + dronePhase);
            velocity.z = -0.8 * Math.sin(t * 0.8 + dronePhase);
            break;
            
          case 'attack':
            // Aggressive formation flying
            const attackRadius = 8 + droneIndex;
            position.x += attackRadius * Math.cos(t * 2 + dronePhase);
            position.z += attackRadius * Math.sin(t * 2 + dronePhase);
            position.y += Math.cos(t * 1.5 + dronePhase) * 2;
            velocity.x = -attackRadius * 0.2 * Math.sin(t * 2 + dronePhase);
            velocity.z = attackRadius * 0.2 * Math.cos(t * 2 + dronePhase);
            velocity.y = -0.3 * Math.sin(t * 1.5 + dronePhase);
            break;
            
          case 'rescue':
            // Coordinated rescue formation
            const rescueOffset = droneIndex * 3;
            position.x += rescueOffset * Math.cos(swarmPhase);
            position.z += rescueOffset * Math.sin(swarmPhase);
            position.y += Math.sin(t * 0.2 + droneIndex) * 2;
            break;
            
          default: // idle
            // Hovering with slight drift
            position.x += Math.sin(t * 0.1 + dronePhase) * 2;
            position.z += Math.cos(t * 0.1 + dronePhase) * 2;
            position.y += Math.sin(t * 0.05 + dronePhase) * 1;
        }
        
        // Realistic orientation based on movement
        const orientation = {
          pitch: Math.atan2(velocity.y, Math.sqrt(velocity.x ** 2 + velocity.z ** 2)) * 180 / Math.PI,
          roll: Math.atan2(velocity.x, velocity.z) * 10, // Bank into turns
          yaw: Math.atan2(velocity.x, velocity.z) * 180 / Math.PI
        };
        
        // Battery depletion and charging cycles
        const batteryBase = 100 - (timePoint % 80) * 1.25; // Depletes over time
        const chargeCycle = Math.max(0, batteryBase + (currentState === 'charging' ? 20 : 0));
        const batteryPercentage = Math.max(5, Math.min(100, chargeCycle + (Math.random() - 0.5) * 5));
        
        // Detection range varies with battery and task
        const baseRange = currentTask === 'search' ? 25 : currentTask === 'attack' ? 30 : 20;
        const detectionRange = baseRange * (batteryPercentage / 100) * (0.8 + Math.random() * 0.4);
        
        drones.push({
          droneId,
          timePoint,
          swarmId,
          taskId: currentTask,
          state: currentState,
          position,
          velocity,
          orientation,
          batteryPercentage,
          detectionRange
        });
      }
    });
  });

  // Calculate metadata
  const swarmCounts = swarms.reduce((acc, swarm) => ({
    ...acc,
    [swarm]: dronesPerSwarm
  }), {} as Record<SwarmID, number>);

  const taskCounts = tasks.reduce((acc, task) => ({
    ...acc,
    [task]: Math.floor(totalDrones / tasks.length)
  }), {} as Record<TaskType, number>);

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
      boundingBox
    }
  };
}

// Get drones for a specific time point
export function getDronesAtTime(dataset: DroneSwarmDataset, timePoint: number): DroneData[] {
  return dataset.drones.filter(drone => drone.timePoint === timePoint);
}

// Get trajectory for a specific drone
export function getDroneTrajectory(dataset: DroneSwarmDataset, droneId: string): DroneData[] {
  return dataset.drones
    .filter(drone => drone.droneId === droneId)
    .sort((a, b) => a.timePoint - b.timePoint);
}