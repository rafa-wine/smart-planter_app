import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Dimensions,
  Image,
} from "react-native";
import { Link } from "react-router-native";
import SelectList from "react-native-dropdown-select-list";
import StyledLink from "../styles/StyledLink";
import { getDatabase, ref, child, get, update } from "firebase/database";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { StatusBar } from "expo-status-bar";

/* Variables para posicionar la elementos graficos */
const headerHeight = 70;
const footerHeight = 80;
const bodyHeight =
  Dimensions.get("window").height - (headerHeight + footerHeight);
const heightDisplay = Dimensions.get("window").height;
const widthDisplay = Dimensions.get("window").width;

/* Una vez se introduscan los datos se guarda el inicio de sesión */
function setItem(id, name, type) {
  const obj = { id: id.toLowerCase(), name: name, typePlant: type };
  AsyncStorage.setItem("plant", JSON.stringify(obj));

  let url = id.toLowerCase() + "/setting";

  const db = getDatabase();
  update(ref(db, url), {
    modified: 1,
    namePlant: name,
    typePlant: type.toLowerCase(),
  });
}

/* Vista ConfigPlant */
function ConfigPlant() {
  /* Varibles de estado necesarias para el texto y acceso a la siguiente vista */
  const [isEditable, setIsEditable] = useState(false);
  const [nextScreen, setNextScreen] = useState(true);
  const [borderCode, setBorderCode] = useState("black");
  const [borderName, setBorderName] = useState("#888888");
  const [colors, setColors] = useState(["#ffffff", "#324a13"]);
  const [typePlant, setTypePlant] = useState(
    require("../../assets/Cactus.png")
  );

  /* Se consulta a la BD en Firebase si existe la maceta */
  async function getData(url) {
    const database = ref(getDatabase());
    get(child(database, url))
      .then((snapshot) => {
        if (snapshot.exists()) {
          console.log("Exists");
          setIsEditable(true);
          setNextScreen(false);
          setColors(["#ffffff", "#acfe43"]);
          setBorderCode("#129022");
          setBorderName("#129022");
        } else {
          setIsEditable(false);
          setNextScreen(true);
          setColors(["#ffffff", "#324a13"]);
          setBorderCode("red");
          setBorderName("#888888");
          console.log("No data available");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  /* Datos establecidos por defecto para referenciar al usuario */
  const [code, setCode] = React.useState("smartpot_v11");
  const [name, setName] = React.useState("Thimi");
  const [selected, setSelected] = React.useState("");
  const dataTypePlants = [
    { key: "Cactus", value: "Cactus" },
    { key: "Girasoles", value: "Girasoles" },
    { key: "Tuberosas", value: "Tuberosas" },
  ];

  /* Componentes graficos */
  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#f8f7fd" />
      <View style={styles.header}>
        <Link to="/" style={{ marginLeft: "5%", borderRadius: 15 }}>
          <Image source={require("../../assets/back.png")} />
        </Link>
        <Text style={styles.title}>Conecta con tu Planta</Text>
      </View>
      <View style={styles.body}>
        <View style={styles.subContainers}>
          <Text style={styles.label}>Código de Maceta:</Text>
          <TextInput
            placeholder="smartpot_v11"
            style={{
              width: "80%",
              height: 45,
              borderWidth: 1.5,
              borderColor: borderCode,
              borderRadius: 10,
              textAlign: "center",
            }}
            onChangeText={(text) => {
              setCode(text);
              if (text == "") {
                console.log("nulo");
              } else {
                getData(text.toLowerCase());
              }
            }}
          />
          <Text style={styles.label}>Apodo:</Text>
          <TextInput
            placeholder="Thimi"
            style={{
              width: "80%",
              height: 45,
              borderWidth: 1.5,
              borderColor: borderName,
              borderRadius: 10,
              paddingLeft: 18,
            }}
            editable={isEditable}
            onChangeText={(text) => setName(text)}
          />
          <Text style={styles.label}>Tipo de Planta:</Text>
          <View style={{ alignItems: "center" }}>
            <View style={{ position: "absolute", zIndex: 10 }}>
              <SelectList
                setSelected={setSelected}
                data={dataTypePlants}
                onSelect={() => {
                  if (selected == "Cactus") {
                    setTypePlant(require("../../assets/Cactus.png"));
                  }
                  if (selected == "Girasoles") {
                    setTypePlant(require("../../assets/Girasoles.png"));
                  }
                  if (selected == "Tuberosas") {
                    setTypePlant(require("../../assets/Tuberosas.png"));
                  }
                }}
                maxHeight={70}
                inputStyles={{ width: "73%" }}
                boxStyles={{
                  borderColor: "#129022",
                  borderWidth: 1.5,
                }}
                dropdownStyles={{
                  borderColor: "#843700",
                  borderWidth: 1.5,
                  backgroundColor: "#f8f7fd",
                }}
                defaultOption={{ key: "Cactus", value: "Cactus" }}
              />
            </View>
          </View>
        </View>
        <View style={styles.image}>
          <Image source={typePlant} />
          <View style={{ width: "100%", position: "absolute", zIndex: 1 }}>
            <Text
              style={{
                position: "absolute",
                marginLeft: "12%",
                fontSize: 18,
                textAlign: "center",
                textAlignVertical: "center",
                backgroundColor: "#ebedf0",
                borderRadius: 10,
                zIndex: 1,
                fontFamily: "Sakura",
              }}
            >
              ¡Hola!, soy {name}.
            </Text>
          </View>
          <View
            style={{
              width: "100%",
              position: "absolute",
              alignItems: "center",
              zIndex: 1,
            }}
          >
            <Text
              style={{
                width: 100,

                marginTop: 275,
                fontSize: 12,
                textAlign: "center",
                textAlignVertical: "center",
                backgroundColor: "#ebedf0",
                borderRadius: 5,
                padding: 3,
              }}
            >
              {code.toLowerCase()}
            </Text>
          </View>
        </View>
      </View>
      <View style={styles.footer}>
        <StyledLink
          screen={"/plantStatus"}
          text={"Conectar"}
          color={colors}
          off={nextScreen}
          action={() => setItem(code, name, selected)}
        />
      </View>
    </View>
  );
}

/* Estilos que utiliza la vista de ConfigPlant */
const styles = StyleSheet.create({
  container: {
    width: widthDisplay,
    height: heightDisplay,
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8f7fd",
  },
  header: {
    width: "100%",
    height: headerHeight,
    flexDirection: "row",
    alignItems: "flex-end",
  },
  body: {
    width: "100%",
    height: bodyHeight,
  },
  subContainers: {
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: "50%",
  },
  image: {
    alignItems: "center",
  },
  footer: {
    width: "100%",
    height: footerHeight,
    alignItems: "center",
  },
  title: {
    width: "100%",
    fontSize: 20,
    fontFamily: "Sakura",
    color: "#129022",
    marginLeft: "5%",
    marginBottom: "0.5%",
  },
  label: {
    width: "80%",
    fontSize: 16,
    fontFamily: "Sagesans",
    color: "#000",
    marginTop: 15,
    marginBottom: 5,
    marginLeft: 10,
  },
});

export default ConfigPlant;
