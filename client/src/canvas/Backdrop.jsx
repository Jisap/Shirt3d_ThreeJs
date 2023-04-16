import React, { useRef } from 'react'
import { easing } from 'maath'
import { useFrame } from '@react-three/fiber'
import { AccumulativeShadows, RandomizedLight } from '@react-three/drei';

const Backdrop = () => {
  const shadows = useRef();

  return (
    <AccumulativeShadows    // Crea sombras acumulativas
      ref={shadows}         // Los valores del componente se almacenan en la ref=shadows         
      temporal              // Las sombras se acumulan con el tiempo en lugar de ser calculadas
      frames={60}           // Nº de cuadros para acumular las sombras
      alphaTest={0.85}                  // Las siguientes props establecen la posición y la escala 
      scale={10}                        // de la sombra en relación con la escena.
      rotation={[Math.PI / 2, 0, 0]}
      position={[0, 0, -0.14]}
    >
      <RandomizedLight  // Luz aleatoria 1
        amount={4}
        radius={9}
        intensity={0.55}
        ambient={0.25}
        position={[5, 5, -10]}
      />
      <RandomizedLight  // Luz aleatoria 2
        amount={4}
        radius={5}
        intensity={0.25}
        ambient={0.55}
        position={[-5, 5, -9]}
      />
    </AccumulativeShadows>
  )
}

export default Backdrop