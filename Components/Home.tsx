import React, { useState } from "react";
import { SafeAreaView, StyleSheet, View } from "react-native";
import { TextInput, Button } from "@react-native-material/core";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

const Home: React.FC<NativeStackScreenProps<any, "Home">> = (props) => {
  const [numberOfParkingSlots, setNumberOfParkingSlots] = useState<number>(0);
  return (
    <SafeAreaView style={styles.homeContainer}>
      <TextInput
        testID="Parking-create-text-input"
        keyboardType="number-pad"
        placeholder="Enter number of parking spaces"
        onChangeText={(text) => {
          setNumberOfParkingSlots(parseInt(text));
        }}
      />
      <Button
        disabled={numberOfParkingSlots ? false : true}
        style={styles.btn}
        title="Submit"
        testID="Parking-create-submitbutton"
        onPress={() => {
          props.navigation.navigate("ParkingSpaces", {
            nops: numberOfParkingSlots,
          });
        }}
      ></Button>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  homeContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    flex: 1,
  },
  btn: {
    alignSelf: "center",
    marginTop: 24,
  },
});

export default Home;
