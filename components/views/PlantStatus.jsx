import React, { useRef, useState, useEffect } from "react";
import { View, Text, Image, StyleSheet, Animated } from "react-native";
import { getDatabase, ref, onValue, child, get } from "firebase/database";
import CircularProgress from "react-native-circular-progress-indicator";
import StyledLink from "../styles/StyledLink";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { StatusBar } from "expo-status-bar";

/* Funcion de animación del corazón */
const GetStarted = () => {
  const scale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.spring(scale, { toValue: 0.9, useNativeDriver: true }),
        Animated.spring(scale, { toValue: 1.1, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  /* Se obtienen los datos ingresados por el usuario */
  AsyncStorage.getItem("plant").then((res) => {
    if (res !== null) {
      setId(JSON.parse(res).id);
      setName(JSON.parse(res).name);
      setLastName(JSON.parse(res).typePlant);
    } else {
      console.log("sin datos");
    }
    loadKeys();
    loadRTData();
  });

  /* Variables por defecto, se actualizan cuando se consulta lo ingresado por el usuario */
  const [name, setName] = useState("Thimi");
  const [lastName, setLastName] = useState("Cactus");
  const [image, setImage] = useState("https://i.ibb.co/sKJmqpQ/smartpot.png++");
  const [id, setId] = useState("smartpot_v11");
  const [idUrlSensors, setIdUrlSensors] = useState("smartpot_v11/sensorValues");
  const [idUrlParameters, setIdUrlParameters] = useState(
    "smartpot_v11cc/plantTypes/cactus"
  );
  const [hum, setHum] = useState(0);
  const [luz, setLuz] = useState(0);
  const [tem, setTem] = useState(0);

  /* Se consulta la URL de la imagen correpondiente a la maceta */
  function loadKeys() {
    setIdUrlParameters(id + "/plantTypes/" + lastName.toLowerCase());
    const dbRef = ref(getDatabase());
    get(child(dbRef, idUrlParameters))
      .then((snapshot) => {
        if (snapshot.exists()) {
          setImage(snapshot.val().urlImage);
        } else {
          console.log("No data available");
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }

  /* Se consultan los valores de los sensores y se actualiza cada que detecte un cambio */
  async function loadRTData() {
    let url = id + "/sensorValues";
    setIdUrlSensors(url);

    const db = getDatabase();
    const starCountRef = ref(db, idUrlSensors);
    onValue(starCountRef, (snapshot) => {
      if (snapshot.exists()) {
        setHum(snapshot.val().soilMoisture);
        setLuz(snapshot.val().light);
        setTem(snapshot.val().temperature);
      } else {
        console.log("No data available");
      }
    });
  }

  /* Componentes graficos */
  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#f8f7fd" />
      <View style={styles.plant}>
        <View style={styles.subContainer}>
          <Text
            style={{
              width: "200%",
              fontSize: 38,
              marginLeft: "110%",
              zIndex: 5,
              color: "#129022",
              fontFamily: "Sakura",
            }}
          >
            {name}
          </Text>
          <Text
            style={{
              width: "100%",
              fontSize: 16,
              marginLeft: "10%",
              textAlignVertical: "top",
              color: "#24ad36",
              fontFamily: "Sagesans",
            }}
          >
            {lastName}
          </Text>
        </View>
        <View>
          <Image style={{ width: 265, height: 375 }} source={{ uri: image }} />
        </View>
      </View>
      <View style={styles.info}>
        <View style={styles.sensors}>
          <View style={styles.subContainerSensors}>
            <View style={{ margin: 10 }}>
              <CircularProgress
                title="Humedad"
                titleStyle={{ fontFamily: "Sagesans" }}
                progressValueStyle={{
                  fontWeight: "100",
                  color: "white",
                  fontFamily: "Sagesans",
                }}
                titleFontSize={12}
                titleColor={"#303030"}
                value={hum}
                radius={70}
                progressValueColor={"#1e1e1e"}
                duration={500}
                valueSuffix={"%"}
                strokeColorConfig={[
                  { color: "#ab4a05", value: 0 },
                  { color: "#0f6fff", value: 50 },
                  { color: "#2c1ef7", value: 100 },
                ]}
                inActiveStrokeOpacity={0.5}
                inActiveStrokeWidth={10}
                activeStrokeWidth={20}
              />
            </View>
            <View style={{ margin: 10 }}>
              <CircularProgress
                title="Luz"
                titleStyle={{ fontFamily: "Sagesans" }}
                progressValueStyle={{
                  fontWeight: "100",
                  color: "white",
                  fontFamily: "Sagesans",
                }}
                titleFontSize={12}
                titleColor={"#303030"}
                value={luz}
                radius={70}
                progressValueColor={"#1e1e1e"}
                duration={500}
                valueSuffix={"%"}
                strokeColorConfig={[
                  { color: "#1e1e1e", value: 0 },
                  { color: "#f5ff3d", value: 50 },
                  { color: "#ff6200", value: 100 },
                ]}
                inActiveStrokeOpacity={0.5}
                inActiveStrokeWidth={10}
                activeStrokeWidth={20}
              />
            </View>
          </View>
          <View style={styles.subContainerSensors}>
            <View style={{ margin: 10 }}>
              <Animated.Image
                source={require("../../assets/heart.png")}
                style={{
                  width: 140,
                  height: 140,
                  resizeMode: "contain",
                  marginLeft: "5%",
                  marginRight: "5%",
                  transform: [{ scale }],
                }}
              />
            </View>
            <View style={{ margin: 10 }}>
              <CircularProgress
                title="Temperatura"
                titleStyle={{ fontFamily: "Sagesans" }}
                progressValueStyle={{
                  fontWeight: "100",
                  color: "white",
                  fontFamily: "Sagesans",
                }}
                titleFontSize={12}
                titleColor={"#303030"}
                value={tem}
                maxValue={35}
                radius={70}
                progressValueColor={"#1e1e1e"}
                duration={500}
                valueSuffix={"°C"}
                inActiveStrokeOpacity={0.5}
                activeStrokeWidth={20}
                inActiveStrokeWidth={20}
                strokeColorConfig={[
                  { color: "blue", value: 0 },
                  { color: "#3cabfa", value: 13 },
                  { color: "red", value: 26 },
                ]}
                inActiveStrokeColor="rgba(0, 0, 0, 0.1)"
                dashedStrokeConfig={{
                  count: 35,
                  width: 3,
                }}
              />
            </View>
          </View>
        </View>
        <View style={styles.widgets}>
          <StyledLink
            screen={"/globalConfiguration"}
            text={"Configuración"}
            color={["#ffffff", "#843700"]}
            off={false}
          />
        </View>
      </View>
    </View>
  );
};

/* Estilos que utiliza la vista de PlantStatus */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f8f7fd",
  },
  subContainer: {
    height: "100%",
    width: "50%",
    justifyContent: "flex-start",
    paddingTop: "20%",
    alignItems: "center",
  },
  plant: {
    display: "flex",
    width: "80%",
    height: "47.5%",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "flex-end",
    marginBottom: 20,
  },
  info: {
    width: "100%",
    height: "50%",
    borderRadius: 40,
    justifyContent: "space-around",
    alignItems: "center",
  },
  widgets: {
    width: "100%",
    height: "25%",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    marginBottom: 18,
  },
  sensors: {
    zIndex: 15,
    height: "75%",
    width: "80%",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffffff",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.34,
    shadowRadius: 6.27,

    elevation: 5,
    borderRadius: 15,
  },
  subContainerSensors: {
    height: "100%",
    width: "50%",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default GetStarted;
