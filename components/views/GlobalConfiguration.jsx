import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Image,
  TextInput,
} from "react-native";
import { Link } from "react-router-native";
import RangeSlider from "react-native-range-slider-expo";
import StyledLink from "../styles/StyledLink";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getDatabase, ref, update, child, get, set } from "firebase/database";
import SelectList from "react-native-dropdown-select-list";
import { StatusBar } from "expo-status-bar";

/* Variables para posicionar la elementos graficos */
const headerHeight = 70;
const footerHeight = 80;
const bodyHeight =
  Dimensions.get("window").height - (headerHeight + footerHeight);
const heightDisplay = Dimensions.get("window").height;
const widthDisplay = Dimensions.get("window").width;

/* Función para actualizar rangos e información en Firabase */
function setItem(id, nameNew, type, minTem, maxTem, minSoil, maxSoil) {
  const obj = { id: id, name: nameNew, typePlant: type };
  AsyncStorage.setItem("plant", JSON.stringify(obj));
  let urlSettings = id + "/setting";

  const db = getDatabase();

  update(ref(db, urlSettings), {
    modified: 1,
    namePlant: nameNew,
    typePlant: type.toLowerCase(),
  });

  let urlParameters = id + "/plantTypes/" + type.toLowerCase();
  update(ref(db, urlParameters), {
    maxSoilMoisture: maxSoil,
    maxTemperature: maxTem,
    minSoilMoisture: minSoil,
    minTemperature: minTem,
  });
}

/* Funcion para eliminar el inicio de sesión */
function removeItem() {
  AsyncStorage.removeItem("plant");
}

/* Funcion para optener los valores por defecto de la información de la maceta */
const GlobalConfiguration = () => {
  AsyncStorage.getItem("plant").then((res) => {
    if (!data) {
      if (res !== null) {
        setIdUrl(JSON.parse(res).id);
        setName(JSON.parse(res).name);
        setNewName(JSON.parse(res).name);
        setLastName(JSON.parse(res).typePlant);
      } else {
        console.log("sin datos");
      }

      loadRTData();
      console.log("sigo actualizando");
    }
  });

  /* Variables de estado para llevar acabo la actualización de datos */
  const [data, setData] = useState(false);
  const [enable, setEnable] = useState(true);
  const [temperatureMin, setTemperatureMin] = useState(0);
  const [temperatureMax, setTemperatureMax] = useState(0);
  const [soilMoistureMin, setSoilMoistureMin] = useState(0);
  const [soilMoistureMax, setSoilMoistureMax] = useState(0);
  const [name, setName] = useState("Thimi");
  const [newName, setNewName] = useState("Thimi");
  const [lastName, setLastName] = useState("Cactus++");
  const [idUrl, setIdUrl] = useState("smartpot_v11");
  const [idUrlParameters, setIdUrlParameters] = useState(
    "smartpot_v11/plantTypes/cactus"
  );
  const [selected, setSelected] = React.useState("");
  const dataTypePlants = [
    { key: "Cactus", value: "Cactus" },
    { key: "Girasoles", value: "Girasoles" },
    { key: "Tuberosas", value: "Tuberosas" },
  ];

  /* Funcion para optener los valores por defecto de la configuracion de la maceta */
  async function loadRTData() {
    let url = idUrl + "/plantTypes/" + lastName.toLowerCase();
    setIdUrlParameters(url);

    /* Referencia a Realtime Database */
    const dbRef = ref(getDatabase());
    get(child(dbRef, idUrlParameters))
      .then((snapshot) => {
        if (snapshot.exists()) {
          setSoilMoistureMax(snapshot.val().maxSoilMoisture);
          setTemperatureMax(snapshot.val().maxTemperature);
          setSoilMoistureMin(snapshot.val().minSoilMoisture);
          setTemperatureMin(snapshot.val().minTemperature);
          setData(true);
          setEnable(false);
        } else {
          console.log("No data available");
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }

  /* Componentes graficos */
  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#f8f7fd" />
      <View style={styles.header}>
        <Link to="/plantStatus" style={{ marginLeft: "5%", borderRadius: 15 }}>
          <Image source={require("../../assets/back.png")} />
        </Link>
        <Text style={styles.title}>Configuracion </Text>
      </View>
      <View style={styles.body}>
        <View style={styles.containerSlider}>
          <View style={{ alignItems: "center" }}>
            <Text style={styles.titleSection}>Apodo y tipo de planta</Text>
          </View>
          <View style={{ width: "100%", alignItems: "center" }}>
            <TextInput
              defaultValue={name}
              style={{
                width: "80%",
                height: 45,
                borderWidth: 1.5,
                borderRadius: 10,
                paddingLeft: 18,
                borderColor: "#129022",
                borderWidth: 1.5,
                marginBottom: 10,
              }}
              onChangeText={(text) => setNewName(text)}
            />
            <View
              style={{
                width: "100%",
                alignItems: "center",
                marginBottom: 40,
              }}
            >
              <View style={{ position: "absolute", zIndex: 10 }}>
                <SelectList
                  onSelect={(txt) => {
                    let url = idUrl + "/plantTypes/" + selected.toLowerCase();

                    const dbRef = ref(getDatabase());
                    get(child(dbRef, url))
                      .then((snapshot) => {
                        if (snapshot.exists()) {
                          setSoilMoistureMax(snapshot.val().maxSoilMoisture);
                          setTemperatureMax(snapshot.val().maxTemperature);
                          setSoilMoistureMin(snapshot.val().minSoilMoisture);
                          setTemperatureMin(snapshot.val().minTemperature);
                          setData(true);
                        } else {
                          console.log("No data available");
                        }
                      })
                      .catch((error) => {
                        console.error(error);
                      });
                  }}
                  setSelected={setSelected}
                  data={dataTypePlants}
                  maxHeight={70}
                  inputStyles={{ width: "72%" }}
                  boxStyles={{
                    borderColor: "#129022",
                    borderWidth: 1.5,
                  }}
                  dropdownStyles={{
                    borderColor: "#843700",
                    borderWidth: 1.5,
                    backgroundColor: "#f8f7fd",
                  }}
                  defaultOption={{ key: lastName, value: lastName }}
                  enable={false}
                />
              </View>
            </View>
          </View>
        </View>
        <View style={styles.containerSlider}>
          <View style={{ alignItems: "center" }}>
            <Text style={styles.titleSection}>Temperatura</Text>
          </View>
          <View style={{ width: "100%", height: "60%", alignItems: "center" }}>
            <View style={styles.slider}>
              <RangeSlider
                min={0}
                max={35}
                fromValueOnChange={(value) => setTemperatureMin(value)}
                toValueOnChange={(value) => setTemperatureMax(value)}
                initialFromValue={temperatureMin}
                initialToValue={temperatureMax}
                styleSize={20}
                fromKnobColor={"#2586cd"}
                toKnobColor={"#cd2943"}
              />
            </View>
          </View>
          <View style={styles.valuesRange}>
            <Text
              style={{
                borderRadius: 5,
                backgroundColor: "#2586cd",
                padding: 3,
                color: "white",
                fontFamily: "Sagesans",
              }}
            >
              Mínima: {temperatureMin}°C
            </Text>
            <Text
              style={{
                borderRadius: 5,
                backgroundColor: "#cd2943",
                padding: 3,
                color: "white",
                fontFamily: "Sagesans",
              }}
            >
              Máxima: {temperatureMax}°C
            </Text>
          </View>
        </View>
        <View style={styles.containerSlider}>
          <View style={{ alignItems: "center" }}>
            <Text style={styles.titleSection}>Humedad de suelo</Text>
          </View>
          <View style={{ width: "100%", height: "60%", alignItems: "center" }}>
            <View style={styles.slider}>
              <RangeSlider
                min={0}
                max={100}
                fromValueOnChange={(value) => setSoilMoistureMin(value)}
                toValueOnChange={(value) => setSoilMoistureMax(value)}
                initialFromValue={soilMoistureMin}
                initialToValue={soilMoistureMax}
                styleSize={20}
                fromKnobColor={"#c88d61"}
                toKnobColor={"#633513"}
              />
            </View>
          </View>
          <View style={styles.valuesRange}>
            <Text
              style={{
                borderRadius: 5,
                backgroundColor: "#c88d61",
                padding: 3,
                color: "white",
                fontFamily: "Sagesans",
              }}
            >
              Mínima: {soilMoistureMin}%
            </Text>
            <Text
              style={{
                borderRadius: 5,
                backgroundColor: "#633513",
                padding: 3,
                color: "white",
                fontFamily: "Sagesans",
              }}
            >
              Máxima: {soilMoistureMax}%
            </Text>
          </View>
        </View>

        <View style={styles.containerSlider}>
          <View
            style={{
              width: "100%",
              height: "100%",
              alignItems: "center",
              justifyContent: "flex-end",
              marginBottom: 20,
            }}
          >
            <StyledLink
              screen={"/"}
              text={"Cerrar sesión"}
              color={["#ffffff", "#d65348"]}
              off={false}
              action={() => removeItem()}
            />
          </View>
        </View>
      </View>
      <View style={styles.footer}>
        <StyledLink
          screen={"/plantStatus"}
          text={"Guardar configuración"}
          color={["#ffffff", "#acfe43"]}
          off={enable}
          action={() =>
            setItem(
              idUrl,
              newName,
              selected,
              temperatureMin,
              temperatureMax,
              soilMoistureMin,
              soilMoistureMax
            )
          }
        />
      </View>
    </View>
  );
};

/* Estilos de la vista GlobalConfiguration */
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
  containerSlider: {
    width: "100%",
    height: "25%",
    justifyContent: "space-around",
  },
  slider: {
    width: "85%",
    height: "100%",
    resizeMode: "contain",
    justifyContent: "center",
  },
  valuesRange: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-around",
  },
  titleSection: {
    fontSize: 18,
    width: "90%",
    marginTop: "5%",
    padding: 4,
    borderRadius: 6,
    fontFamily: "Sagesans",
    backgroundColor: "#eff1f3",
  },
});

export default GlobalConfiguration;
