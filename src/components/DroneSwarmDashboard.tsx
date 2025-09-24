import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { DroneVisualization3D } from './DroneVisualization3D';
import { Timeline } from './ui/timeline';
import { ControlPanel } from './ui/control-panel';
import { DroneStatistics } from './DroneStatistics';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { generateMockData, getDronesAtTime } from '@/data/mockData';
import { VisualizationFilters, TimelineState, DroneData } from '@/types/drone';
import { Radar, BarChart3, Settings, Play } from 'lucide-react';
import { toast } from 'sonner';

export function DroneSwarmDashboard() {
  // Generate data on component mount
  const dataset = useMemo(() => {
    const data = generateMockData();
    toast.success('Drone swarm data loaded successfully', {
      description: `${data.metadata.totalDrones} drones across ${data.timePoints.length} time points`
    });
    return data;
  }, []);

  // Timeline state
  const [timelineState, setTimelineState] = useState<TimelineState>({
    currentTime: 0,
    isPlaying: false,
    playbackSpeed: 1,
    timeRange: [0, dataset.timePoints.length - 1]
  });

  // Visualization filters
  const [filters, setFilters] = useState<VisualizationFilters>({
    selectedSwarms: ['alpha', 'beta', 'gamma', 'delta', 'epsilon'],
    selectedTasks: ['idle', 'patrol', 'search', 'rescue', 'attack'],
    selectedStates: ['idle', 'patrol', 'search', 'rescue', 'attack', 'charging'],
    batteryRange: [0, 100],
    showTrajectories: false,
    showDetectionRanges: false,
    showVelocityVectors: false
  });

  // Auto-play functionality
  useEffect(() => {
    if (timelineState.isPlaying) {
      const interval = setInterval(() => {
        setTimelineState(prev => {
          const nextTime = prev.currentTime + prev.playbackSpeed;
          if (nextTime >= dataset.timePoints.length - 1) {
            return { ...prev, currentTime: 0, isPlaying: false };
          }
          return { ...prev, currentTime: nextTime };
        });
      }, 100); // 10 FPS

      return () => clearInterval(interval);
    }
  }, [timelineState.isPlaying, timelineState.playbackSpeed, dataset.timePoints.length]);

  // Get current drones with filters applied
  const currentDrones = useMemo(() => {
    const dronesAtTime = getDronesAtTime(dataset, Math.floor(timelineState.currentTime));
    
    return dronesAtTime.filter(drone => {
      return filters.selectedSwarms.includes(drone.swarmId) &&
             filters.selectedTasks.includes(drone.taskId) &&
             drone.batteryPercentage >= filters.batteryRange[0] &&
             drone.batteryPercentage <= filters.batteryRange[1];
    });
  }, [dataset, timelineState.currentTime, filters]);

  // Timeline handlers
  const handleTimeChange = (time: number) => {
    setTimelineState(prev => ({ ...prev, currentTime: time }));
  };

  const handlePlayPause = () => {
    setTimelineState(prev => ({ ...prev, isPlaying: !prev.isPlaying }));
  };

  const handleSpeedChange = (speed: number) => {
    setTimelineState(prev => ({ ...prev, playbackSpeed: speed }));
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="border-b border-border bg-card/50 backdrop-blur-sm"
      >
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
                <Radar className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                  Drone Swarm Visualization
                </h1>
                <p className="text-sm text-muted-foreground">
                  Real-time spatiotemporal analysis of multi-dimensional drone data
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <div className="w-2 h-2 bg-accent rounded-full animate-pulse" />
              <span>{currentDrones.length} active drones</span>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-6">
        <div className="grid grid-cols-12 gap-6 h-[calc(100vh-200px)]">
          {/* Control Panel */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="col-span-12 lg:col-span-3"
          >
            <ControlPanel
              filters={filters}
              onFiltersChange={setFilters}
              className="h-fit sticky top-6"
            />
          </motion.div>

          {/* Visualization Area */}
          <div className="col-span-12 lg:col-span-9 space-y-4">
            {/* 3D Visualization */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="overflow-hidden">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2">
                    <Radar className="w-5 h-5" />
                    3D Spatial View
                    <span className="text-sm font-normal text-muted-foreground">
                      Time: {timelineState.currentTime.toFixed(0)}
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <DroneVisualization3D
                    drones={currentDrones}
                    showTrajectories={filters.showTrajectories}
                    showDetectionRanges={filters.showDetectionRanges}
                    showVelocityVectors={filters.showVelocityVectors}
                    className="h-96 w-full"
                  />
                </CardContent>
              </Card>
            </motion.div>

            {/* Timeline Controls */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Timeline
                currentTime={timelineState.currentTime}
                maxTime={dataset.timePoints.length - 1}
                isPlaying={timelineState.isPlaying}
                playbackSpeed={timelineState.playbackSpeed}
                onTimeChange={handleTimeChange}
                onPlayPause={handlePlayPause}
                onSpeedChange={handleSpeedChange}
              />
            </motion.div>

            {/* Analysis Tabs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Tabs defaultValue="statistics" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="statistics" className="flex items-center gap-2">
                    <BarChart3 className="w-4 h-4" />
                    Statistics
                  </TabsTrigger>
                  <TabsTrigger value="analysis" className="flex items-center gap-2">
                    <Settings className="w-4 h-4" />
                    Analysis
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="statistics" className="mt-4">
                  <DroneStatistics drones={currentDrones} />
                </TabsContent>
                
                <TabsContent value="analysis" className="mt-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Advanced Analysis</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-semibold mb-2">Coordination Metrics</h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span>Swarm Cohesion:</span>
                              <span className="font-mono">0.87</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Task Distribution:</span>
                              <span className="font-mono">0.92</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Energy Efficiency:</span>
                              <span className="font-mono">0.78</span>
                            </div>
                          </div>
                        </div>
                        <div>
                          <h4 className="font-semibold mb-2">Performance Indicators</h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span>Mission Success Rate:</span>
                              <span className="font-mono text-accent">94.5%</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Average Response Time:</span>
                              <span className="font-mono">2.3s</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Coverage Area:</span>
                              <span className="font-mono">4.2 km²</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}