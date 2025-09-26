import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { DroneData, SwarmID, TaskType } from '@/types/drone';
import { Battery, Activity, Target, Users, AlertTriangle } from 'lucide-react';

interface DroneStatisticsProps {
  drones: DroneData[];
  className?: string;
}

export function DroneStatistics({ drones, className }: DroneStatisticsProps) {
  // Calculate statistics
  const totalDrones = drones.length;
  const avgBattery = drones.reduce((sum, drone) => sum + drone.batteryPercentage, 0) / totalDrones;
  
  // Count by swarm
  const swarmCounts = drones.reduce((acc, drone) => {
    acc[drone.swarmId] = (acc[drone.swarmId] || 0) + 1;
    return acc;
  }, {} as Record<SwarmID, number>);
  
  // Count by task
  const taskCounts = drones.reduce((acc, drone) => {
    acc[drone.taskId] = (acc[drone.taskId] || 0) + 1;
    return acc;
  }, {} as Record<TaskType, number>);
  
  // Battery level distribution
  const batteryLevels = {
    critical: drones.filter(d => d.batteryPercentage < 20).length,
    low: drones.filter(d => d.batteryPercentage >= 20 && d.batteryPercentage < 50).length,
    medium: drones.filter(d => d.batteryPercentage >= 50 && d.batteryPercentage < 80).length,
    high: drones.filter(d => d.batteryPercentage >= 80).length,
  };
  
  // Activity metrics
  const avgVelocity = drones.reduce((sum, drone) => {
    const speed = Math.sqrt(drone.velocity.x ** 2 + drone.velocity.y ** 2 + drone.velocity.z ** 2);
    return sum + speed;
  }, 0) / totalDrones;
  
  const avgDetectionRange = drones.reduce((sum, drone) => sum + drone.detectionRange, 0) / totalDrones;
  
  const swarmColors = {
    alpha: 'bg-swarm-alpha',
    beta: 'bg-swarm-beta', 
    gamma: 'bg-swarm-gamma',
    delta: 'bg-swarm-delta',
    epsilon: 'bg-swarm-epsilon'
  };
  
  return (
    <div className={className}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* Total Drones */}
        <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Drones</p>
                <p className="text-2xl font-bold text-primary">{totalDrones}</p>
              </div>
              <Users className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        {/* Average Battery */}
        <Card className="bg-gradient-to-br from-accent/10 to-accent/5 border-accent/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <div>
                <p className="text-sm text-muted-foreground">Avg Battery</p>
                <p className="text-2xl font-bold text-accent">{avgBattery.toFixed(1)}%</p>
              </div>
              <Battery className="w-8 h-8 text-accent" />
            </div>
            <Progress value={avgBattery} className="h-2" />
          </CardContent>
        </Card>

        {/* Average Speed */}
        <Card className="bg-gradient-to-br from-secondary/10 to-secondary/5 border-secondary/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg Speed</p>
                <p className="text-2xl font-bold text-secondary">{avgVelocity.toFixed(1)}</p>
              </div>
              <Activity className="w-8 h-8 text-secondary" />
            </div>
          </CardContent>
        </Card>

        {/* Detection Range */}
        <Card className="bg-gradient-to-br from-warning/10 to-warning/5 border-warning/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg Range</p>
                <p className="text-2xl font-bold text-warning">{avgDetectionRange.toFixed(1)}</p>
              </div>
              <Target className="w-8 h-8 text-warning" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Swarm Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Swarm Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(swarmCounts).map(([swarmId, count]) => (
                <div key={swarmId} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${swarmColors[swarmId as SwarmID]}`} />
                    <span className="font-medium capitalize">{swarmId}</span>
                  </div>
                  <Badge variant="outline">{count} drones</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Task Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5" />
              Task Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(taskCounts).map(([taskId, count]) => (
                <div key={taskId} className="flex items-center justify-between">
                  <span className="font-medium capitalize">{taskId}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-20 bg-muted rounded-full h-2">
                      <div 
                        className="h-2 bg-primary rounded-full" 
                        style={{ width: `${(count / totalDrones) * 100}%` }}
                      />
                    </div>
                    <Badge variant="outline">{count}</Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Battery Health */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Battery className="w-5 h-5" />
              Battery Health
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Critical (&lt;20%)</span>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-battery-critical rounded-full" />
                  <Badge variant={batteryLevels.critical > 0 ? "destructive" : "outline"}>
                    {batteryLevels.critical}
                  </Badge>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Low (20-50%)</span>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-battery-low rounded-full" />
                  <Badge variant="outline">{batteryLevels.low}</Badge>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Medium (50-80%)</span>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-battery-medium rounded-full" />
                  <Badge variant="outline">{batteryLevels.medium}</Badge>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">High (80%+)</span>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-battery-high rounded-full" />
                  <Badge variant="outline">{batteryLevels.high}</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* System Alerts */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              System Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {batteryLevels.critical > 0 && (
                <div className="flex items-center gap-2 p-2 bg-destructive/10 border border-destructive/20 rounded">
                  <AlertTriangle className="w-4 h-4 text-destructive" />
                  <span className="text-sm">{batteryLevels.critical} drone(s) critically low battery</span>
                </div>
              )}
              {batteryLevels.low > 5 && (
                <div className="flex items-center gap-2 p-2 bg-warning/10 border border-warning/20 rounded">
                  <AlertTriangle className="w-4 h-4 text-warning" />
                  <span className="text-sm">{batteryLevels.low} drone(s) need charging soon</span>
                </div>
              )}
              {batteryLevels.critical === 0 && batteryLevels.low <= 5 && (
                <div className="flex items-center gap-2 p-2 bg-accent/10 border border-accent/20 rounded">
                  <div className="w-4 h-4 bg-accent rounded-full" />
                  <span className="text-sm text-accent">All systems operating normally</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}