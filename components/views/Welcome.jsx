import React, { useState } from "react";
import { View, Text, StyleSheet, Image, Animated } from "react-native";
import StyledLink from "../styles/StyledLink";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { StatusBar } from "expo-status-bar";

/* Se importa la vista de PlantStatus en caso ya haya un inicio de sesión */
import PlantStatus from "./PlantStatus";

/* Vista Welcome */
const Welcome = () => {
  /* Consulta a Asyng storage para localizar inicio de sesión */
  const [registered, setRegistered] = useState(false);
  AsyncStorage.getItem("plant").then((res) => {
    if (res !== null) {
      setRegistered(true);
    } else {
      setRegistered(false);
    }
  });

  /* Si existe un inicio de secion se renderiza la vista PlantStatus */
  if (registered) {
    return <PlantStatus />;
    /* Si no hay inicio de seción se renderiza la vista de Bienvenida */
  } else {
    /* Componentes graficos */
    return (
      <View style={styles.container}>
        <StatusBar backgroundColor="#f8f7fd" />
        <View style={{ width: "100%" }}>
          <Text style={styles.title}>Smart Planter</Text>
        </View>
        <View style={{ width: "100%", height: "25%", alignItems: "center" }}>
          <Image source={require("../../assets/Plants.png")} />
        </View>
        <View style={{ width: "100%", alignItems: "center" }}>
          <Text style={styles.phrase}>
            Conecta con tu planta, conecta con la vida!
          </Text>
          <Text style={styles.intro}>
            Maceta inteligente IoT diseña para crear vínculos afectivos con tu
            planta favorita.
          </Text>
        </View>
        <View
          style={{ width: "100%", alignItems: "center", marginBottom: "5%" }}
        >
          <StyledLink
            screen={"/configPlant"}
            text={"Empecemos"}
            color={["#ffffff", "#acfe43"]}
            off={false}
          />
        </View>
      </View>
    );
  }
};

/* Estilos que utiliza la vista de Bienvenida */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f7fd",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-around",
  },
  title: {
    fontSize: 20,
    fontFamily: "Sakura",
    color: "#129022",
    marginLeft: "5%",
  },
  phrase: {
    width: "55%",
    fontFamily: "Sacha",
    textAlign: "center",
    marginBottom: "2%",
    fontSize: 30,
    color: "#000000",
  },
  intro: {
    width: "60%",
    textAlign: "center",
    fontSize: 15,
    fontWeight: "regular",
    fontFamily: "Sagesans",
    color: "#484848",
  },
});

export default Welcome;
