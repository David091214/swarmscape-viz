import React from 'react';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Play, Pause, SkipBack, SkipForward } from 'lucide-react';

interface TimelineProps {
  timePoints: string[];
  currentTime: string;
  onTimeChange: (time: string) => void;
  isPlaying: boolean;
  onPlayToggle: () => void;
}

export function Timeline({
  timePoints,
  currentTime,
  onTimeChange,
  isPlaying,
  onPlayToggle
}: TimelineProps) {
  const currentIndex = timePoints.indexOf(currentTime);
  const progress = timePoints.length > 1 ? (currentIndex / (timePoints.length - 1)) * 100 : 0;

  const handleSliderChange = (value: number[]) => {
    const newIndex = Math.round(value[0]);
    const newTime = timePoints[newIndex];
    if (newTime !== undefined) {
      onTimeChange(newTime);
    }
  };

  return (
    <div className="space-y-4">
      {/* Playback Controls */}
      <div className="flex items-center justify-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onTimeChange(timePoints[0])}
          className="w-10 h-10 p-0"
        >
          <SkipBack className="w-4 h-4" />
        </Button>
        
        <Button
          variant="outline"
          size="lg"
          onClick={onPlayToggle}
          className="w-12 h-12 p-0"
        >
          {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => onTimeChange(timePoints[timePoints.length - 1])}
          className="w-10 h-10 p-0"
        >
          <SkipForward className="w-4 h-4" />
        </Button>
      </div>

      {/* Timeline Slider */}
      <div className="space-y-2">
        <Slider
          value={[currentIndex]}
          max={timePoints.length - 1}
          step={1}
          onValueChange={handleSliderChange}
          className="w-full"
        />
        
        {/* Time Points Display */}
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>{timePoints[0]}</span>
          <span className="font-mono bg-primary/20 px-2 py-1 rounded text-primary">
            {currentTime} ({currentIndex + 1}/{timePoints.length})
          </span>
          <span>{timePoints[timePoints.length - 1]}</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-muted rounded-full h-2">
        <div 
          className="bg-gradient-primary h-2 rounded-full transition-all duration-300 glow"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}