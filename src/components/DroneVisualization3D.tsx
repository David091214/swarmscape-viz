import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, Line, Sphere, Box } from '@react-three/drei';
import * as THREE from 'three';
import { DroneData, SwarmID, TaskType } from '../types/drone';

interface DroneVisualization3DProps {
  drones: DroneData[];
  showTrajectories?: boolean;
  showDetectionRanges?: boolean;
  showVelocityVectors?: boolean;
  className?: string;
}

// Color mapping for swarms
const swarmColors = {
  alpha: '#0ea5e9',    // Blue
  beta: '#a855f7',     // Purple
  gamma: '#22c55e',    // Green
  delta: '#f59e0b',    // Orange
  epsilon: '#ef4444'   // Red
};

// Color mapping for tasks
const taskColors = {
  idle: '#64748b',
  patrol: '#0ea5e9',
  search: '#a855f7',
  rescue: '#f59e0b',
  attack: '#ef4444'
};

// Individual drone component
function DroneModel({ drone, showDetectionRange, showVelocityVector }: {
  drone: DroneData;
  showDetectionRange?: boolean;
  showVelocityVector?: boolean;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const swarmColor = swarmColors[drone.swarmId];
  const taskColor = taskColors[drone.taskId];
  
  // Animate drone rotation based on orientation
  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.x = THREE.MathUtils.degToRad(drone.orientation.pitch);
      meshRef.current.rotation.y = THREE.MathUtils.degToRad(drone.orientation.yaw);
      meshRef.current.rotation.z = THREE.MathUtils.degToRad(drone.orientation.roll);
    }
  });

  // Battery-based opacity
  const opacity = Math.max(0.3, drone.batteryPercentage / 100);
  
  return (
    <group position={[drone.position.x, drone.position.y, drone.position.z]}>
      {/* Main drone body */}
      <Box
        ref={meshRef}
        args={[1, 0.3, 1]}
        position={[0, 0, 0]}
      >
        <meshStandardMaterial
          color={swarmColor}
          transparent
          opacity={opacity}
          emissive={swarmColor}
          emissiveIntensity={0.2}
        />
      </Box>
      
      {/* Task indicator (small sphere above drone) */}
      <Sphere args={[0.2]} position={[0, 0.8, 0]}>
        <meshStandardMaterial
          color={taskColor}
          transparent
          opacity={0.8}
          emissive={taskColor}
          emissiveIntensity={0.5}
        />
      </Sphere>
      
      {/* Battery level indicator */}
      <Box
        args={[0.2, 0.1, 1.2]}
        position={[0.7, 0, 0]}
      >
        <meshStandardMaterial
          color={drone.batteryPercentage > 50 ? '#22c55e' : 
                drone.batteryPercentage > 25 ? '#f59e0b' : '#ef4444'}
          transparent
          opacity={0.7}
        />
      </Box>
      
      {/* Detection range visualization */}
      {showDetectionRange && (
        <mesh>
          <sphereGeometry args={[drone.detectionRange, 16, 8]} />
          <meshBasicMaterial
            color={swarmColor}
            transparent
            opacity={0.05}
            wireframe
          />
        </mesh>
      )}
      
      {/* Velocity vector */}
      {showVelocityVector && (
        <Line
          points={[
            [0, 0, 0],
            [drone.velocity.x * 2, drone.velocity.y * 2, drone.velocity.z * 2]
          ]}
          color="#ffffff"
          transparent
          opacity={0.6}
          lineWidth={2}
        />
      )}
      
      {/* Drone ID label */}
      <Text
        position={[0, -1, 0]}
        fontSize={0.3}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
      >
        {drone.droneId}
      </Text>
    </group>
  );
}

// Grid floor component
function GridFloor() {
  const gridSize = 200;
  const divisions = 20;
  
  return (
    <group position={[0, -5, 0]}>
      <gridHelper args={[gridSize, divisions, '#1e293b', '#0f172a']} />
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[gridSize, gridSize]} />
        <meshBasicMaterial
          color="#0f172a"
          transparent
          opacity={0.1}
        />
      </mesh>
    </group>
  );
}

// Coordinate axes
function CoordinateAxes() {
  return (
    <group>
      {/* X Axis - Red */}
      <Line
        points={[[-50, 0, 0], [50, 0, 0]]}
        color="#ef4444"
        lineWidth={2}
      />
      <Text position={[52, 0, 0]} fontSize={1} color="#ef4444">X</Text>
      
      {/* Y Axis - Green */}
      <Line
        points={[[0, -5, 0], [0, 50, 0]]}
        color="#22c55e"
        lineWidth={2}
      />
      <Text position={[0, 52, 0]} fontSize={1} color="#22c55e">Y</Text>
      
      {/* Z Axis - Blue */}
      <Line
        points={[[0, 0, -50], [0, 0, 50]]}
        color="#0ea5e9"
        lineWidth={2}
      />
      <Text position={[0, 0, 52]} fontSize={1} color="#0ea5e9">Z</Text>
    </group>
  );
}

export function DroneVisualization3D({
  drones,
  showTrajectories = false,
  showDetectionRanges = false,
  showVelocityVectors = false,
  className
}: DroneVisualization3DProps) {
  
  return (
    <div className={className}>
      <Canvas
        camera={{ position: [50, 40, 50], fov: 60 }}
        style={{ background: 'radial-gradient(circle at center, #1e293b 0%, #0f172a 70%)' }}
      >
        {/* Lighting */}
        <ambientLight intensity={0.3} />
        <directionalLight
          position={[10, 10, 5]}
          intensity={0.8}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />
        <pointLight position={[0, 50, 0]} intensity={0.5} color="#0ea5e9" />
        
        {/* Controls */}
        <OrbitControls
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          minDistance={10}
          maxDistance={200}
        />
        
        {/* Scene elements */}
        <GridFloor />
        <CoordinateAxes />
        
        {/* Render all drones */}
        {drones.map((drone) => (
          <DroneModel
            key={`${drone.droneId}-${drone.timePoint}`}
            drone={drone}
            showDetectionRange={showDetectionRanges}
            showVelocityVector={showVelocityVectors}
          />
        ))}
        
        {/* Environment fog for depth */}
        <fog attach="fog" args={['#0f172a', 50, 300]} />
      </Canvas>
    </div>
  );
}