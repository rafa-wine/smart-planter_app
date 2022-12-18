import React, { useState } from "react";
import { NativeRouter, Routes, Route } from "react-router-native";
import { initializeApp } from "firebase/app";
import { useFonts } from "expo-font";

/* Importación de vistas y componentes necesarios */

import Welcome from "./Welcome";
import ConfigPlant from "./ConfigPlant";
import PlantStatus from "./PlantStatus";
import GlobalConfiguration from "./GlobalConfiguration";

/* Inicialización de referencia a la BD en Firebase */

const firebaseConfig = {
  apiKey: "AIzaSyDsZXdix7oQWMzXrrjP3NUs3bQ0oqsU6bw",
  authDomain: "smartpot-f8f23.firebaseapp.com",
  databaseURL: "https://smartpot-f8f23-default-rtdb.firebaseio.com",
  projectId: "smartpot-f8f23",
  storageBucket: "smartpot-f8f23.appspot.com",
  messagingSenderId: "340499422298",
  appId: "1:340499422298:web:3a9e0dcef6b0f44e194c63",
  measurementId: "G-NRLXFN9SG5",
};

/* Vista Main dedicada a la gestión de rutas*/
const Main = () => {
  /* Se inicia la referencia al proyecto de Firebase */
  const app = initializeApp(firebaseConfig);

  /* Se cargan las tipografias */
  const [fontsLoaded] = useFonts({
    Sacha: require("../fonts/Sacha_Sharpy.otf"),
    Sagesans: require("../fonts/sagesans-Regular.ttf"),
    Sakura: require("../fonts/SakuraBlossom.ttf"),
  });

  /* Componentes graficos */
  return (
    <NativeRouter>
      <Routes>
        <Route exact path="/" element={<Welcome />} />
        <Route exact path="/configPlant" element={<ConfigPlant />} />
        <Route exact path="plantStatus" element={<PlantStatus />} />
        <Route
          exact
          path="/globalConfiguration"
          element={<GlobalConfiguration />}
        />
      </Routes>
    </NativeRouter>
  );
};

export default Main;
