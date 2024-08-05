import React, { useRef, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera, useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { Html } from "@react-three/drei";

function DisplacementMap({ activeProvince }) {
    return (
        <Canvas>
            <ambientLight />
            <directionalLight intensity={1} position={[0, 3, 3]} />
            <OrbitControls enableZoom />
            <PerspectiveCamera
                makeDefault
                fov={30}
                aspect={window.innerWidth / window.innerHeight}
                near={0.1}
                far={100000000000}
                position={[0, 2000, 4000]}
            />
            <SpinningPlane selectedProvince={activeProvince} />
        </Canvas>
    );
}

function SpinningPlane({ selectedProvince }) {
    const { scene } = useGLTF("/assets/model/testGIS3.gltf");

    useEffect(() => {
        if (scene) {
            scene.scale.set(0.3, 0.3, 0.3);
            scene.position.y = -100;
        }
    }, [scene]);

    useFrame(() => {
        if (scene) {
            scene.rotation.x = 0;
            scene.rotation.z = 0;
            scene.rotation.y += 0.004;
        }
    });

    return <primitive object={scene} />;
}

export default DisplacementMap;
