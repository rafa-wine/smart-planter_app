import React from "react";
import { Text, StyleSheet } from "react-native";
import { Link } from "react-router-native";
import { LinearGradient } from "expo-linear-gradient";
import theme from "../theme/theme";

const styles = StyleSheet.create({
  link: {
    width: "80%",
    justifyContent: "center",
    alignItems: "center",
    height: 50,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.37,
    shadowRadius: 7.49,

    elevation: 12,
  },
  gradient: {
    borderRadius: 10,
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 18,
    color: "#1d1d1d",
    fontFamily: "Sagesans",
    textTransform: "uppercase",
  },
});

const StyledLink = (props) => {
  return (
    <Link
      to={props.screen}
      style={styles.link}
      disabled={props.off}
      onPress={props.action}
    >
      <LinearGradient
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        colors={props.color}
        style={styles.gradient}
      >
        <Text style={styles.text}>{props.text}</Text>
      </LinearGradient>
    </Link>
  );
};

export default StyledLink;
