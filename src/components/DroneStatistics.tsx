import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DroneSwarmDataset } from '@/types/drone';
import { getDronesAtTime } from '@/data/realDataParser';
import { Battery, Users, Activity, Target } from 'lucide-react';

interface DroneStatisticsProps {
  dataset: DroneSwarmDataset;
  currentTime: string;  
  selectedDrone?: number | null;
}

export function DroneStatistics({ dataset, currentTime, selectedDrone }: DroneStatisticsProps) {
  // Calculate statistics for current time
  const currentDrones = getDronesAtTime(dataset, currentTime);
  const activeDrones = currentDrones.length;
  const avgBattery = activeDrones > 0 ? currentDrones.reduce((sum, drone) => sum + drone.batteryPercentage, 0) / activeDrones : 0;
  
  // Count by swarm (only positive swarm IDs)
  const swarmStats = currentDrones.reduce((acc, drone) => {
    if (drone.swarmId >= 0) {
      acc[drone.swarmId] = (acc[drone.swarmId] || 0) + 1;
    }
    return acc;
  }, {} as Record<number, number>);
  
  // Count by task (only positive task IDs)
  const taskStats = currentDrones.reduce((acc, drone) => {
    if (drone.taskId >= 0) {
      acc[drone.taskId] = (acc[drone.taskId] || 0) + 1;
    }
    return acc;
  }, {} as Record<number, number>);
  
  // Count by state
  const stateStats = currentDrones.reduce((acc, drone) => {
    acc[drone.state] = (acc[drone.state] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Calculate average velocity
  const avgVelocity = activeDrones > 0 ? currentDrones.reduce((sum, drone) => {
    const speed = Math.sqrt(drone.velocity.x ** 2 + drone.velocity.y ** 2 + drone.velocity.z ** 2);
    return sum + speed;
  }, 0) / activeDrones : 0;

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-primary/10 rounded-lg p-3 border border-primary/20">
          <div className="text-2xl font-bold text-primary">{activeDrones}</div>
          <div className="text-sm text-muted-foreground">Active Drones</div>
        </div>
        <div className="bg-secondary/10 rounded-lg p-3 border border-secondary/20">
          <div className="text-2xl font-bold text-secondary">{Object.keys(swarmStats).length}</div>
          <div className="text-sm text-muted-foreground">Active Swarms</div>
        </div>
        <div className="bg-accent/10 rounded-lg p-3 border border-accent/20">
          <div className="text-2xl font-bold text-accent">{Object.keys(taskStats).length}</div>
          <div className="text-sm text-muted-foreground">Active Tasks</div>
        </div>
        <div className={`rounded-lg p-3 border ${
          avgBattery > 50 ? 'bg-green-500/10 border-green-500/20' : 
          avgBattery > 20 ? 'bg-yellow-500/10 border-yellow-500/20' : 
          'bg-red-500/10 border-red-500/20'
        }`}>
          <div className={`text-2xl font-bold ${
            avgBattery > 50 ? 'text-green-400' : 
            avgBattery > 20 ? 'text-yellow-400' : 
            'text-red-400'
          }`}>
            {avgBattery.toFixed(1)}%
          </div>
          <div className="text-sm text-muted-foreground">Avg Battery</div>
        </div>
      </div>

      {/* Distribution Stats */}
      <div className="grid md:grid-cols-3 gap-6">
        <div>
          <h3 className="text-lg font-semibold mb-3 text-primary">Swarm Distribution</h3>
          <div className="space-y-2">
            {Object.entries(swarmStats).map(([swarm, count]) => (
              <div key={swarm} className="flex justify-between items-center p-2 bg-muted/20 rounded">
                <span>Swarm {swarm}</span>
                <span className="font-mono text-sm">{count} drones</span>
              </div>
            ))}
          </div>
        </div>
        
        <div>
          <h3 className="text-lg font-semibold mb-3 text-secondary">Task Distribution</h3>
          <div className="space-y-2">
            {Object.entries(taskStats).map(([task, count]) => (
              <div key={task} className="flex justify-between items-center p-2 bg-muted/20 rounded">
                <span>Task {task}</span>
                <span className="font-mono text-sm">{count} drones</span>
              </div>
            ))}
          </div>
        </div>
        
        <div>
          <h3 className="text-lg font-semibold mb-3 text-accent">State Distribution</h3>
          <div className="space-y-2">
            {Object.entries(stateStats).map(([state, count]) => (
              <div key={state} className="flex justify-between items-center p-2 bg-muted/20 rounded">
                <span className="text-xs">{state}</span>
                <span className="font-mono text-sm">{count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-muted/10 rounded-lg p-4 border border-muted/20">
          <div className="flex items-center gap-2 mb-2">
            <Activity className="h-4 w-4 text-secondary" />
            <span className="text-sm font-medium">Average Velocity</span>
          </div>
          <div className="text-xl font-bold text-secondary">{avgVelocity.toFixed(2)} m/s</div>
        </div>
        
        <div className="bg-muted/10 rounded-lg p-4 border border-muted/20">
          <div className="flex items-center gap-2 mb-2">
            <Target className="h-4 w-4 text-warning" />
            <span className="text-sm font-medium">Detection Coverage</span>
          </div>
          <div className="text-xl font-bold text-warning">
            {currentDrones.length > 0 ? currentDrones[0].detectionRange : 0} m
          </div>
        </div>
      </div>

      {/* Selected Drone Details */}
      {selectedDrone && (
        <div className="bg-card/50 rounded-lg p-4 border border-primary/30">
          <h3 className="text-lg font-semibold mb-3 text-primary">Selected Drone #{selectedDrone}</h3>
          {(() => {
            const drone = currentDrones.find(d => d.droneId === selectedDrone);
            if (!drone) return <p className="text-muted-foreground">Drone not active at current time</p>;
            
            return (
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="text-muted-foreground">Position</div>
                  <div className="font-mono">
                    ({drone.position.x.toFixed(1)}, {drone.position.y.toFixed(1)}, {drone.position.z.toFixed(1)})
                  </div>
                </div>
                <div>
                  <div className="text-muted-foreground">State</div>
                  <div className="font-medium">{drone.state}</div>
                </div>
                <div>
                  <div className="text-muted-foreground">Battery</div>
                  <div className="font-mono">{drone.batteryPercentage}%</div>
                </div>
                <div>
                  <div className="text-muted-foreground">Swarm</div>
                  <div className="font-mono">{drone.swarmId >= 0 ? `Swarm ${drone.swarmId}` : 'No Swarm'}</div>
                </div>
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
}