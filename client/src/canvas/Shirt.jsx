import React from 'react'
import { easing } from 'maath';
import { useSnapshot } from 'valtio';
import { useFrame } from '@react-three/fiber';
import { Decal, useGLTF, useTexture } from '@react-three/drei';
import state from '../store';


const Shirt = () => {
  
  const snap = useSnapshot(state);
  const { nodes, materials } = useGLTF('/shirt_baked.glb'); // Del modelo de la camiseta extraemos los nodos y materials

  const logoTexture = useTexture(snap.logoDecal);           // Le aplicamos el dibujo del logo del state
  const fullTexture = useTexture(snap.fullDecal);           // Le aplicamos la textura del logo del state
 
  useFrame((state, delta) => easing.dampC(materials.lambert1.color, snap.color, 0.25, delta)); // Suavizamos los colores (modelo - estado)

   const stateString = JSON.stringify(snap);

    return (
    <group key={stateString}>
        <mesh
            castShadow                                    // Aplicamos las sombras
            geometry={nodes.T_Shirt_male.geometry}        // Dibujamos el modelo   
            material={materials.lambert1}                 // Le aplicamos las texturas iniciales que trae el modelo tipo lambert que son con sombras suaves
            material-roughness={1}                        // Le aplicamos un tipo de rugosidad
            dispose={null}
        >
        { snap.isFullTexture && (
          <Decal 
            position={[0,0,0]}
            rotation={[0,0,0]}
            scale={1}
            map={fullTexture}                             // Textura de camiseta
          />
        )}
        { snap.isLogoTexture && (
          <Decal 
            position={[0, 0.04, 0.15]}
            rotation={[0,0,0]}
            scale={0.15}
            map={logoTexture}                             // Textura del logo                   
            map-anisotrpy={16}
            depthTest={false}
            depthWrite={true}
          />
        )}
        </mesh>
    </group>
  )
}

export default Shirt