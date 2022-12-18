import React from "react";
import { View, Button, StyleSheet } from "react-native";
import * as SQLite from "expo-sqlite";

const db = SQLite.openDatabase("db.config");

function createTable() {
  db.transaction(
    (tx) => (
      tx.executeSql(
        "CREATE TABLE IF NOT EXISTS plant(code_pot TEXT, name_plant TEXT, type_plant TEXT);"
      ),
      (transact, resulset) => {
        console.log(transact);
        console.log(resulset);
      }
    ),
    (transact, error) => {
      console.log(transact);
      console.log(error);
    }
  );
}

function deleteTable() {
  db.transaction(
    (tx) => (
      tx.executeSql("DROP TABLE plant;"),
      (transact, resulset) => {
        console.log(transact);
        console.log(resulset);
      }
    ),
    (transact, error) => {
      console.log(transact);
      console.log(error);
    }
  );
}

function insertPlant() {
  const query =
    "INSERT INTO plant(code_pot, name_plant, type_plant) VALUES (?, ?, ?);";
  console.log(query);
  //it looks fine to me
  db.transaction((trx) => {
    let trxQuery = trx.executeSql(
      query,
      ["smartPot_v00", "Thimi", "Cactus"],
      (transact, resultset) => console.log("we made it", resultset),
      (transact, err) => console.log("We have encounter an Error", err)
    );
  });
}

function selectPlant() {
  const query = "SELECT * FROM plant;";
  console.log(query);
  //it looks fine to me
  db.transaction((trx) => {
    let trxQuery = trx.executeSql(
      query,
      [],
      (transact, resultset) =>
        console.log("we made it", resultset.rows._array[0]),
      (transact, err) => console.log("We have encounter an Error", err)
    );
  });
}

function clearPlants() {
  const query = "DELETE FROM plant;";
  console.log(query);
  //it looks fine to me
  db.transaction((trx) => {
    let trxQuery = trx.executeSql(
      query,
      [],
      (transact, resultset) =>
        console.log("we made it", resultset.rows._array[0]),
      (transact, err) => console.log("We have encounter an Error", err)
    );
  });
}

const Comunication = () => {
  return (
    <View style={styles.container}>
      <Button title="Create DB" onPress={() => createTable()} />
      <Button title="Delete BD" onPress={() => deleteTable()} />
      <Button title="Create Plant" onPress={() => insertPlant()} />
      <Button title="Read Plant" onPress={() => selectPlant()} />
      <Button title="delete Plants" onPress={() => clearPlants()} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-around",
    alignItems: "center",
  },
});

export default Comunication;
