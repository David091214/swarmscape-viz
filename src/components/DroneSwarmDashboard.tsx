import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { DroneVisualization3D } from './DroneVisualization3D';
import { Timeline } from './ui/timeline';
import { DroneStatistics } from './DroneStatistics';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { parseRealDroneData, getDronesAtTime } from '@/data/realDataParser';
import { DroneSwarmDataset, DroneData, SwarmID } from '@/types/drone';
import { Target, BarChart3, Clock, Radar } from 'lucide-react';
import { toast } from 'sonner';

export function DroneSwarmDashboard() {
  // Generate data on component mount
  const dataset = useMemo(() => {
    const data = parseRealDroneData();
    toast.success('Real drone swarm data loaded successfully', {
      description: `${data.metadata.totalDrones} drones across ${data.timePoints.length} time points`
    });
    return data;
  }, []);

  // State management
  const [currentTime, setCurrentTime] = useState<string>(dataset.timePoints[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showTrajectories, setShowTrajectories] = useState(false);
  const [selectedSwarm, setSelectedSwarm] = useState<SwarmID | undefined>(undefined);
  const [selectedDrone, setSelectedDrone] = useState<number | null>(null);

  // Auto-play functionality
  useEffect(() => {
    if (isPlaying) {
      const interval = setInterval(() => {
        setCurrentTime(prev => {
          const currentIndex = dataset.timePoints.indexOf(prev);
          const nextIndex = currentIndex + 1;
          if (nextIndex >= dataset.timePoints.length) {
            setIsPlaying(false);
            return dataset.timePoints[0];
          }
          return dataset.timePoints[nextIndex];
        });
      }, 500); // 2 FPS for smooth animation

      return () => clearInterval(interval);
    }
  }, [isPlaying, dataset.timePoints]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="border-b border-border/30 bg-card/40 backdrop-blur-lg"
      >
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center pulse-neon">
                <Radar className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                  Drone Swarm Visualization
                </h1>
                <p className="text-sm text-muted-foreground">
                  Real-time spatiotemporal analysis with {dataset.metadata.totalDrones} drones
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <div className="w-2 h-2 bg-accent rounded-full animate-pulse" />
              <span>Time: {currentTime}</span>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Main Content Grid */}
      <div className="container mx-auto px-6 py-6">
        <div className="grid grid-cols-12 gap-6">
          
          {/* Left Column - Statistics */}
          <div className="col-span-12 lg:col-span-4 space-y-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="border-border/30 bg-card/40 backdrop-blur-lg">
                <CardHeader className="pb-3">
                  <CardTitle className="text-secondary flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Real-time Statistics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <DroneStatistics 
                    dataset={dataset}
                    currentTime={currentTime}
                    selectedDrone={selectedDrone}
                  />
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Right Column - Visualization */}
          <div className="col-span-12 lg:col-span-8 space-y-6">
            
            {/* 3D Visualization */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="border-border/30 bg-card/60 backdrop-blur-md">
                <CardHeader className="pb-3">
                  <CardTitle className="text-primary flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    3D Visualization
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="h-[600px] relative overflow-hidden rounded-lg">
                    <DroneVisualization3D 
                      dataset={dataset}
                      currentTime={currentTime}
                      showTrajectories={showTrajectories}
                      selectedSwarm={selectedSwarm}
                      onDroneSelect={setSelectedDrone}
                    />
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Timeline Control */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="border-border/30 bg-card/50 backdrop-blur-lg">
                <CardHeader className="pb-3">
                  <CardTitle className="text-accent flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Timeline Control
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Timeline
                    timePoints={dataset.timePoints}
                    currentTime={currentTime}
                    onTimeChange={setCurrentTime}
                    isPlaying={isPlaying}
                    onPlayToggle={() => setIsPlaying(!isPlaying)}
                  />
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}