import React, { useEffect, useState } from "react";
import { View, Button, Text } from "react-native";
import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue, set, get } from "firebase/database";

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

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

function storeHighScore(userId, score) {
  const reference = ref(database, "users/" + userId);
  set(reference, {
    highscore: score,
  });
}

function lighValue() {
  const reference = ref(database, "smartpot_v00/sensorValues");
  onValue(reference, (snapshot) => {
    const light = snapshot.val().light;
    console.log("Light: " + light);
  });
}

function soilMoistureValue() {
  const reference = ref(database, "smartpot_v00/sensorValues");
  onValue(reference, (snapshot) => {
    const soilMoisture = snapshot.val().soilMoisture;
    console.log("Soil Moisture: " + soilMoisture);
  });
}

function temperatureValue() {
  const reference = ref(database, "smartpot_v00/sensorValues");
  onValue(reference, (snapshot) => {
    const temperature = snapshot.val().temperature;
    console.log("Temperature: " + temperature);
  });
}

/* function sensorValues() {
  const reference = ref(database, "smartpot_v00/sensorValues");
  onValue(reference, (snapshot) => {
    const light = snapshot.val().light;
    const soilMoisture = snapshot.val().soilMoisture;
    const temperature = snapshot.val().temperature;
    console.log("Light: " + light + " --- Soil Moisture: " + soilMoisture + " --- Temperature: " + temperature);
  });
} */

const Config = () => {
  const [rtData, setRTData] = useState([]);

  async function loadRTData() {
    const reference = ref(database, "smartpot_v00/sensorValues");
    onValue(reference, (snapshot) => {
      setRTData(snapshot.val());
    });
  }

  useEffect(() => {
    loadRTData();
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>{rtData.light}</Text>
      <Text>{rtData.soilMoisture}</Text>
      <Text>{rtData.temperature}</Text>
    </View>
  );
};
export default Config;
