import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, Line } from '@react-three/drei';
import * as THREE from 'three';
import { DroneData, DroneSwarmDataset, SwarmID } from '../types/drone';
import { getDronesAtTime, getDroneTrajectory } from '@/data/realDataParser';

interface DroneVisualization3DProps {
  dataset: DroneSwarmDataset;
  currentTime: string;
  showTrajectories: boolean;
  selectedSwarm?: SwarmID;
  onDroneSelect?: (droneId: number) => void;
}

// Get swarm color based on swarm ID
const getSwarmColor = (swarmId: SwarmID): string => {
  if (swarmId === -1) return '#FFFFFF'; // No swarm - white
  if (swarmId === 1) return '#00BFFF';   // Swarm 1 - cyan
  if (swarmId === 2) return '#9932CC';   // Swarm 2 - purple
  return '#00FF7F'; // Default - green
};

// Get state color based on drone state
const getStateColor = (state: string): string => {
  switch (state) {
    case 'Taking Off': return '#FFD700';
    case 'Entering Swarm': return '#32CD32';
    case 'Hovering': return '#00BFFF';
    case 'Passing By': return '#FF6347';
    case 'Attacking': return '#FF4500';
    case 'Parachute Deployment': return '#DA70D6';
    default: return '#FFFFFF';
  }
};

// Drone component that represents a single drone in 3D space
const Drone: React.FC<{ 
  drone: DroneData; 
  isSelected: boolean; 
  onClick: () => void;
}> = ({ drone, isSelected, onClick }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  // Animate drone rotation based on orientation
  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.x = (drone.orientation.pitch * Math.PI) / 180;
      meshRef.current.rotation.y = (drone.orientation.yaw * Math.PI) / 180;
      meshRef.current.rotation.z = (drone.orientation.roll * Math.PI) / 180;
    }
  });

  const swarmColor = getSwarmColor(drone.swarmId);
  const stateColor = getStateColor(drone.state);
  
  return (
    <group position={[drone.position.x, drone.position.y, drone.position.z]}>
      {/* Drone body */}
      <mesh ref={meshRef} onClick={onClick}>
        <boxGeometry args={[2, 0.5, 2]} />
        <meshStandardMaterial 
          color={swarmColor}
          emissive={swarmColor}
          emissiveIntensity={isSelected ? 0.5 : 0.2}
        />
      </mesh>
      
      {/* State indicator sphere */}
      <mesh position={[0, 1, 0]}>
        <sphereGeometry args={[0.3]} />
        <meshStandardMaterial 
          color={stateColor}
          emissive={stateColor}
          emissiveIntensity={0.4}
        />
      </mesh>
      
      {/* Detection range visualization */}
      <mesh position={[0, -1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[drone.detectionRange * 0.8, drone.detectionRange, 32]} />
        <meshBasicMaterial 
          color={swarmColor} 
          transparent 
          opacity={0.1}
          side={THREE.DoubleSide}
        />
      </mesh>
      
      {/* Velocity vector */}
      <arrowHelper 
        args={[
          new THREE.Vector3(drone.velocity.x, drone.velocity.y, drone.velocity.z).normalize(),
          new THREE.Vector3(0, 0, 0),
          Math.sqrt(drone.velocity.x ** 2 + drone.velocity.y ** 2 + drone.velocity.z ** 2) * 2,
          swarmColor,
          2,
          1
        ]}
      />
      
      {/* Battery indicator */}
      <Text
        position={[0, 3, 0]}
        fontSize={1}
        color={drone.batteryPercentage > 20 ? '#00FF00' : '#FF0000'}
        anchorX="center"
        anchorY="middle"
      >
        {drone.batteryPercentage}%
      </Text>
      
      {/* Drone ID label */}
      <Text
        position={[0, -3, 0]}
        fontSize={0.8}
        color={swarmColor}
        anchorX="center"
        anchorY="middle"
      >
        D{drone.droneId}
      </Text>
    </group>
  );
};

export function DroneVisualization3D({
  dataset,
  currentTime,
  showTrajectories,
  selectedSwarm,
  onDroneSelect
}: DroneVisualization3DProps) {
  const [selectedDroneId, setSelectedDroneId] = useState<number | null>(null);

  // Get current drones filtered by time and optionally by swarm
  const currentDrones = getDronesAtTime(dataset, currentTime).filter(drone => 
    selectedSwarm === undefined || drone.swarmId === selectedSwarm
  );

  // Handle drone selection
  const handleDroneClick = (droneId: number) => {
    setSelectedDroneId(droneId);
    onDroneSelect?.(droneId);
  };

  return (
    <div className="w-full h-full">
      <Canvas
        camera={{ position: [100, 80, 100], fov: 60 }}
        style={{ 
          background: 'radial-gradient(circle at center, hsl(var(--surface)) 0%, hsl(var(--background)) 70%)'
        }}
      >
        {/* Lighting setup */}
        <ambientLight intensity={0.4} />
        <directionalLight
          position={[50, 50, 25]}
          intensity={0.8}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />
        <pointLight position={[0, 100, 0]} intensity={0.6} color="hsl(var(--primary))" />
        
        {/* Camera controls */}
        <OrbitControls
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          minDistance={20}
          maxDistance={300}
        />
        
        {/* Grid floor */}
        <gridHelper args={[200, 20, 'hsl(var(--border))', 'hsl(var(--muted))']} position={[0, -5, 0]} />
        
        {/* Coordinate axes */}
        <group>
          <Line
            points={[[-100, 0, 0], [100, 0, 0]]}
            color="hsl(var(--destructive))"
            lineWidth={2}
          />
          <Line
            points={[[0, 0, 0], [0, 100, 0]]}
            color="hsl(var(--accent))"
            lineWidth={2}
          />
          <Line
            points={[[0, 0, -100], [0, 0, 100]]}
            color="hsl(var(--primary))"
            lineWidth={2}
          />
        </group>
        
        {/* Render current drones */}
        {currentDrones.map((drone) => (
          <Drone
            key={`${drone.droneId}-${drone.timePoint}`}
            drone={drone}
            isSelected={selectedDroneId === drone.droneId}
            onClick={() => handleDroneClick(drone.droneId)}
          />
        ))}
        
        {/* Trajectory visualization */}
        {showTrajectories && selectedDroneId && (
          (() => {
            const trajectory = getDroneTrajectory(dataset, selectedDroneId);
            const points = trajectory.map(d => [d.position.x, d.position.y, d.position.z] as [number, number, number]);
            return points.length > 1 ? (
              <Line
                points={points}
                color="hsl(var(--secondary))"
                lineWidth={3}
                transparent
                opacity={0.7}
              />
            ) : null;
          })()
        )}
        
        {/* Environment fog */}
        <fog attach="fog" args={['hsl(var(--background))', 100, 400]} />
      </Canvas>
    </div>
  );
}