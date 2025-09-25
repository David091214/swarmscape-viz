import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { SwarmID, TaskID, DroneState, VisualizationFilters } from '@/types/drone';
import { cn } from '@/lib/utils';

interface ControlPanelProps {
  filters: VisualizationFilters;
  onFiltersChange: (filters: VisualizationFilters) => void;
  className?: string;
}

const swarmOptions: { id: SwarmID; label: string; color: string }[] = [
  { id: -1, label: 'No Swarm', color: 'bg-muted' },
  { id: 1, label: 'Swarm 1', color: 'bg-swarm-alpha' },
  { id: 2, label: 'Swarm 2', color: 'bg-swarm-beta' },
];

const taskOptions: { id: TaskID; label: string; color: string }[] = [
  { id: -1, label: 'No Task', color: 'bg-muted' },
  { id: 1, label: 'Task 1', color: 'bg-task-patrol' },
  { id: 2, label: 'Task 2', color: 'bg-task-search' },
];

const stateOptions: { id: DroneState; label: string; color: string }[] = [
  { id: 'Taking Off', label: 'Taking Off', color: 'bg-yellow-500' },
  { id: 'Entering Swarm', label: 'Entering Swarm', color: 'bg-green-500' },
  { id: 'Hovering', label: 'Hovering', color: 'bg-blue-500' },
  { id: 'Passing By', label: 'Passing By', color: 'bg-orange-500' },
  { id: 'Attacking', label: 'Attacking', color: 'bg-red-500' },
  { id: 'Parachute Deployment', label: 'Parachute Deployment', color: 'bg-purple-500' },
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

  const toggleTask = (taskId: TaskID) => {
    const newTasks = filters.selectedTasks.includes(taskId)
      ? filters.selectedTasks.filter(id => id !== taskId)
      : [...filters.selectedTasks, taskId];
    updateFilters({ selectedTasks: newTasks });
  };

  const toggleState = (state: DroneState) => {
    const newStates = filters.selectedStates.includes(state)
      ? filters.selectedStates.filter(s => s !== state)
      : [...filters.selectedStates, state];
    updateFilters({ selectedStates: newStates });
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
                  id={`swarm-${swarm.id}`}
                  checked={filters.selectedSwarms.includes(swarm.id)}
                  onCheckedChange={() => toggleSwarm(swarm.id)}
                />
                <label
                  htmlFor={`swarm-${swarm.id}`}
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
                  id={`task-${task.id}`}
                  checked={filters.selectedTasks.includes(task.id)}
                  onCheckedChange={() => toggleTask(task.id)}
                />
                <label
                  htmlFor={`task-${task.id}`}
                  className="flex items-center space-x-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                >
                  <div className={cn("w-3 h-3 rounded", task.color)} />
                  <span>{task.label}</span>
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* State Selection */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-foreground">States</h3>
          <div className="grid grid-cols-1 gap-2 max-h-40 overflow-y-auto">
            {stateOptions.map(state => (
              <div key={state.id} className="flex items-center space-x-2">
                <Checkbox
                  id={`state-${state.id}`}
                  checked={filters.selectedStates.includes(state.id)}
                  onCheckedChange={() => toggleState(state.id)}
                />
                <label
                  htmlFor={`state-${state.id}`}
                  className="flex items-center space-x-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                >
                  <div className={cn("w-3 h-3 rounded", state.color)} />
                  <span className="text-xs">{state.label}</span>
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
                selectedTasks: taskOptions.map(t => t.id),
                selectedStates: stateOptions.map(s => s.id)
              })}
              className="px-3 py-2 text-xs bg-primary text-primary-foreground rounded hover:bg-primary/90 transition-colors"
            >
              Select All
            </button>
            <button
              onClick={() => updateFilters({
                selectedSwarms: [],
                selectedTasks: [],
                selectedStates: []
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