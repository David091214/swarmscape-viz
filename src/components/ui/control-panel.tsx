import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { SwarmID, TaskType, DroneState, VisualizationFilters } from '@/types/drone';
import { cn } from '@/lib/utils';

interface ControlPanelProps {
  filters: VisualizationFilters;
  onFiltersChange: (filters: VisualizationFilters) => void;
  className?: string;
}

const swarmOptions: { id: SwarmID; label: string; color: string }[] = [
  { id: 'alpha', label: 'Alpha', color: 'bg-swarm-alpha' },
  { id: 'beta', label: 'Beta', color: 'bg-swarm-beta' },
  { id: 'gamma', label: 'Gamma', color: 'bg-swarm-gamma' },
  { id: 'delta', label: 'Delta', color: 'bg-swarm-delta' },
  { id: 'epsilon', label: 'Epsilon', color: 'bg-swarm-epsilon' },
];

const taskOptions: { id: TaskType; label: string; color: string }[] = [
  { id: 'idle', label: 'Idle', color: 'bg-task-idle' },
  { id: 'patrol', label: 'Patrol', color: 'bg-task-patrol' },
  { id: 'search', label: 'Search', color: 'bg-task-search' },
  { id: 'rescue', label: 'Rescue', color: 'bg-task-rescue' },
  { id: 'attack', label: 'Attack', color: 'bg-task-attack' },
];

export function ControlPanel({ filters, onFiltersChange, className }: ControlPanelProps) {
  const updateFilters = (updates: Partial<VisualizationFilters>) => {
    onFiltersChange({ ...filters, ...updates });
  };

  const toggleSwarm = (swarmId: SwarmID) => {
    const newSwarms = filters.selectedSwarms.includes(swarmId)
      ? filters.selectedSwarms.filter(id => id !== swarmId)
      : [...filters.selectedSwarms, swarmId];
    updateFilters({ selectedSwarms: newSwarms });
  };

  const toggleTask = (taskId: TaskType) => {
    const newTasks = filters.selectedTasks.includes(taskId)
      ? filters.selectedTasks.filter(id => id !== taskId)
      : [...filters.selectedTasks, taskId];
    updateFilters({ selectedTasks: newTasks });
  };

  return (
    <Card className={cn("w-80", className)}>
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-bold bg-gradient-primary bg-clip-text text-transparent">
          Visualization Controls
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Swarm Selection */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-foreground">Swarms</h3>
          <div className="grid grid-cols-1 gap-2">
            {swarmOptions.map(swarm => (
              <div key={swarm.id} className="flex items-center space-x-2">
                <Checkbox
                  id={swarm.id}
                  checked={filters.selectedSwarms.includes(swarm.id)}
                  onCheckedChange={() => toggleSwarm(swarm.id)}
                />
                <label
                  htmlFor={swarm.id}
                  className="flex items-center space-x-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                >
                  <div className={cn("w-3 h-3 rounded-full", swarm.color)} />
                  <span>{swarm.label}</span>
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Task Selection */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-foreground">Tasks</h3>
          <div className="grid grid-cols-1 gap-2">
            {taskOptions.map(task => (
              <div key={task.id} className="flex items-center space-x-2">
                <Checkbox
                  id={task.id}
                  checked={filters.selectedTasks.includes(task.id)}
                  onCheckedChange={() => toggleTask(task.id)}
                />
                <label
                  htmlFor={task.id}
                  className="flex items-center space-x-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                >
                  <div className={cn("w-3 h-3 rounded", task.color)} />
                  <span className="capitalize">{task.label}</span>
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Battery Range Filter */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-foreground">Battery Level</h3>
          <div className="px-2">
            <Slider
              value={filters.batteryRange}
              min={0}
              max={100}
              step={5}
              onValueChange={(value) => updateFilters({ batteryRange: value as [number, number] })}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>{filters.batteryRange[0]}%</span>
              <span>{filters.batteryRange[1]}%</span>
            </div>
          </div>
        </div>

        {/* Visualization Options */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-foreground">Display Options</h3>
          
          <div className="flex items-center justify-between">
            <label htmlFor="trajectories" className="text-sm font-medium">
              Show Trajectories
            </label>
            <Switch
              id="trajectories"
              checked={filters.showTrajectories}
              onCheckedChange={(checked) => updateFilters({ showTrajectories: checked })}
            />
          </div>

          <div className="flex items-center justify-between">
            <label htmlFor="detection" className="text-sm font-medium">
              Detection Ranges
            </label>
            <Switch
              id="detection"
              checked={filters.showDetectionRanges}
              onCheckedChange={(checked) => updateFilters({ showDetectionRanges: checked })}
            />
          </div>

          <div className="flex items-center justify-between">
            <label htmlFor="velocity" className="text-sm font-medium">
              Velocity Vectors
            </label>
            <Switch
              id="velocity"
              checked={filters.showVelocityVectors}
              onCheckedChange={(checked) => updateFilters({ showVelocityVectors: checked })}
            />
          </div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-foreground">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => updateFilters({
                selectedSwarms: swarmOptions.map(s => s.id),
                selectedTasks: taskOptions.map(t => t.id)
              })}
              className="px-3 py-2 text-xs bg-primary text-primary-foreground rounded hover:bg-primary/90 transition-colors"
            >
              Select All
            </button>
            <button
              onClick={() => updateFilters({
                selectedSwarms: [],
                selectedTasks: []
              })}
              className="px-3 py-2 text-xs bg-muted text-muted-foreground rounded hover:bg-muted/80 transition-colors"
            >
              Clear All
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}