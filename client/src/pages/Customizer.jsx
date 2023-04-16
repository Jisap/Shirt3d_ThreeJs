import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useSnapshot } from 'valtio';
import config from '../config/config';
import state from '../store';
import { download } from '../assets';
import { downloadCanvasToImage, reader } from '../config/helpers';
import { EditorTabs, FilterTabs, DecalTypes } from '../config/constants';
import { fadeAnimation, slideAnimation } from '../config/motion';
import { AIPicker, ColorPicker, CustomButton, FilePicker, Tab } from '../components';



const Customizer = () => {

  const snap = useSnapshot(state);
  const [file, setFile] = useState('');
  const [prompt, setPrompt] = useState('');
  const [generatingImg, setGeneratingImg] = useState(false); 
  const [activeEditorTab, setActiveEditorTab] = useState(""); // Estado del lado izdo de la edición
  const [activeFilterTab, setActiveFilterTab] = useState({    // Estado de la parte de abajo de la edición
    logoShirt: true,
    stylishShirt: false,
  })


  // show tab content dependind on activeTab value
  const generateTabContent = () => {
    switch (activeEditorTab) {
      case "colorpicker":
        return <ColorPicker />
      case "filepicker":
        return <FilePicker
          file={file}
          setFile={setFile}
          readFile={readFile}
        />
      case "aipicker":
        return <AIPicker 
          prompt={prompt}
          setPrompt={setPrompt}
          generatingImg={generatingImg}
          handleSubmit={handleSubmit}
        />
      default:
        return null;
    }
  }

  const handleSubmit = async( type ) => {
    if(!prompt) return alert("Please enter a prompt");

    try {
      
      setGeneratingImg(true);

      const response = await fetch('http://localhost:8080/api/v1/dalle', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          prompt,
        })
      })

      const data = await response.json();

      handleDecals(type, `data:image/png;base64,${data.photo}`)


    } catch (error) {
      alert(error);
    }finally{
      setGeneratingImg(false)
      setActiveEditorTab("")
    }
  }


  const handleDecals = (type, result) => {        // (logo/full, img)
    const decalType = DecalTypes[type];           // Obtenemos a que objeto apuntamos de DecalType, logo o full 

    state[decalType.stateProperty] = result;      // Actualizamos en el state general logoDecal o fullDecal con la imagen subida 
    
    if(!activeFilterTab[decalType.filterTab]) {   // Si el filterTab asociado al objeto seleccionado no existe 
      handleActiveFilterTab(decalType.filterTab)  // actualizamos el estado correspondiente filterTab
    }

  }
  

  // Con esta función se pueden establecer a la vez la textura y el logo 

  const handleActiveFilterTab = (tabName) => {              // Recibimos el filterTab asociado al objeto elegido (logoshirt o stylishShirt)
    
    switch (tabName) {
      case "logoShirt":                                     // Si es logoshirt
          state.isLogoTexture = !activeFilterTab[tabName];  // isLogoTexture (false) se actualiza al contrario del estado actual 
        break;
      case "stylishShirt":                                  // Si es stylishShirt
          state.isFullTexture = !activeFilterTab[tabName];  // isFullTexture (true) se actualiza al contratio de su estado actual
        break;
      default:                                              // Sino es una de esas opciones se establece el estado por defecto
        state.isLogoTexture = true;
        state.isFullTexture = false;
        break;
    }

    // after setting the state, activeFilterTab is updated

    setActiveFilterTab((prevState) => { // prevState al inicio es {logoShirt: true, stylishShirt: false}
      return {
        ...prevState,
        [tabName]: !prevState[tabName] // Cambia la contrario del estado previo.
      }
    })
  }

  // Refactoring... Con esta alternativa solo se puede poner o el logo o la textura 

  // const handleActiveFilterTab = (tabName) => {
    
  //   console.log(tabName)

  //   if (tabName === "logoShirt") {
  //     state.isLogoTexture = true;
  //     state.isFullTexture = false;
  //   } else if (tabName === "stylishShirt") {
  //     state.isLogoTexture = false;
  //     state.isFullTexture = true;
  //   } else {
  //     state.isLogoTexture = false;
  //     state.isFullTexture = false;
  //   }
  //   // after setting the state, activeFilterTab is updated
  //   setActiveFilterTab((prevState) => {
  //     const newState = {
  //       logoShirt: state.isLogoTexture,
  //       stylishShirt: state.isFullTexture,
  //     };
  //     return {
  //       ...prevState,
  //       ...newState,
  //     }
  //   });
  // }

  const readFile = (type) => {        // vista de la camiseta logo o full
    reader(file)                      // Utilizamos el helper reader para obtener el file como un objeto de datos 
      .then((result) => {
        handleDecals(type, result);   // Enviamos a handleDecals el tipo de vista de la camiseta y el file subido como result
        setActiveEditorTab("");
      })
  }

  return (
    <AnimatePresence>
      { !snap.intro && (
        <>
          <motion.div
            key="custom"
            className='absolute top-0 left-0 z-10'
            {...slideAnimation('left')}
          >
            <div className='flex items-center min-h-screen'>
              <div className='editorTabs-container tabs'>
                { EditorTabs.map((tab)=> (
                  <Tab 
                    key={tab.name}
                    tab={tab}
                    handleClick={() => setActiveEditorTab(tab.name)} // Establece ActiveEditorTab -> generateTabContent() -> Component
                  />
                ))}

                {generateTabContent()} 
              </div>
            </div>
          </motion.div> 

          <motion.div
            className='absolute z-10 top-5 right-5'
            {...fadeAnimation}
          >
            <CustomButton 
              type='filled'
              title='Go Back'
              handleClick={() => state.intro = true}
              customStyles='w-fit px-4 py-2.5 font-bold text-sm'
            />
          </motion.div>

          <motion.div
            className='filtertabs-container'
            {...slideAnimation('up')}
          >
            { FilterTabs.map((tab)=> ( // logoShirt, stylishShirt
                  <Tab 
                    key={tab.name}
                    tab={tab}
                    isFilterTab // siempre es true
                    isActiveTab={activeFilterTab[tab.name]} // prop que se pasa con el nombre del filtro elegido y da true como resultado
                    handleClick={() => handleActiveFilterTab(tab.name)} //Cambia state al contrario y activeFilterTab {logoShirt: true, stylishShirt: false} al contrario
                  />
                ))}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default Customizer