import React, { useEffect, useState } from "react";
import {
  Animated,
  FlatList,
  Modal,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackScreenProps } from "../App";
import { Box, Button, Text, TextInput } from "@react-native-material/core";
import DateTimePicker, {
  DateTimePickerAndroid,
} from "@react-native-community/datetimepicker";

interface BookSpace {
  carReg: string;
  time: Date;
  selectedSpace: number;
}

const ParkingSpaces: React.FC<
  NativeStackScreenProps<RootStackScreenProps, "ParkingSpaces">
> = (props) => {
  const [numberOfSpace, setNumberOfSpaces] = useState<Array<any>>(new Array());
  const [selectedSpace, setSelectedSpace] = useState(-1);
  const [selectedSpaceCarReg, setSelectedSpaceCarReg] = useState("");
  const [selectedSpaceDate, setSelectedSpaceDate] = useState<Date>(new Date());
  const [bookedSpace, setBookedSpace] = useState<Array<BookSpace>>(
    new Array<BookSpace>()
  );
  useEffect(() => {
    if (props.route.params?.nops) {
      const arr = Array(props.route.params?.nops);
      setNumberOfSpaces(Array.from(arr));
    }
  }, [props.route.params]);

  const showTime = () => {
    DateTimePickerAndroid.open({
      value: selectedSpaceDate,
      onChange: (e, d) => setSelectedSpaceDate(d),
      mode: "time",
      is24Hour: false,
    });
  };

  const [modalOpen, setOpenModal] = useState(false);
  const [selectedSpaceForPayment, setSelectedSpaceForPayment] = useState(
    new Object() as BookSpace
  );

  const handleBooking = () => {
    setBookedSpace((ps) => {
      return [
        ...ps,
        { carReg: selectedSpaceCarReg, time: selectedSpaceDate, selectedSpace },
      ];
    });
    setSelectedSpace(-1);
    setSelectedSpaceCarReg("");
    setSelectedSpaceDate(new Date());
  };

  return (
    <>
      <Text variant="h5" style={{ textAlign: "center" }}>
        Select a Parking Slot
      </Text>
      <SafeAreaView style={styles.row}>
        {numberOfSpace.map((item, idx) => {
          const found = bookedSpace.find((i, idx1) => i.selectedSpace === idx);
          return (
            <TouchableOpacity
              onPress={() => {
                found
                  ? (() => {
                      setOpenModal(true);
                      setSelectedSpaceForPayment(found);
                    })()
                  : setSelectedSpace(idx);
              }}
            >
              <Box
                style={found ? styles.filledBox : styles.box}
                w={170}
                h={120}
                m={5}
                border={1}
                borderStyle="dotted"
              >
                <Text
                  testID={`parking-drawing-space-${idx}`}
                  style={found ? styles.whiteFont : null}
                >
                  {idx + 1}
                </Text>
                {found ? (
                  <>
                    <Text
                      style={styles.whiteFont}
                      testID={`parking-drawingregistered-${idx}`}
                    >
                      {found.carReg}
                    </Text>
                    <Text style={styles.whiteFont}>Tap to Checkout</Text>
                  </>
                ) : null}
              </Box>
            </TouchableOpacity>
          );
        })}

        <Modal visible={modalOpen}>
          <SafeAreaView style={styles.card}>
            <Text>Car Registration : {selectedSpaceForPayment.carReg}</Text>
            <Text testID="deregister-time-spent">
              Time :{" "}
              {(+new Date() - +new Date(selectedSpaceForPayment.time)) /
                (60 * 1000)}{" "}
              Minutes
            </Text>
            <Text testID="deregister-charge">Charges : $10</Text>
            <Button
              testID="deregister-paymentbutton"
              title="Pay"
              style={{ marginTop: 8 }}
              onPress={() => {
                setBookedSpace((ps) => {
                  const idx = ps.findIndex(
                    (item) =>
                      item.selectedSpace ===
                      selectedSpaceForPayment.selectedSpace
                  );
                  ps.splice(idx, 1);
                  return ps;
                });
                setOpenModal(false);
              }}
            />
            <Button
              style={{ marginTop: 8 }}
              title="Back"
              testID="deregister-back-button"
              onPress={() => setOpenModal(false)}
            ></Button>
          </SafeAreaView>
        </Modal>
      </SafeAreaView>

      {selectedSpace >= 0 && (
        <>
          <SafeAreaView style={styles.overlay}>
            <TextInput
              testID="parking-drawingregistration-input"
              value={selectedSpaceCarReg}
              onChangeText={(text) => {
                setSelectedSpaceCarReg(text);
              }}
              placeholder="Enter Car Registration"
            />

            <TextInput
              placeholder="Enter Time"
              value={`${selectedSpaceDate.getHours()} : ${selectedSpaceDate.getMinutes()}`}
              onFocus={showTime}
            />
            <Button
              disabled={!(selectedSpaceCarReg && selectedSpaceDate)}
              testID="parking-drawing-addcarbutton"
              title="Book Parking"
              onPress={handleBooking}
            />
          </SafeAreaView>
        </>
      )}

      {bookedSpace.length === numberOfSpace.length && (
        <Text style={{ ...styles.overlay, textAlign: "center" }}>
          All Slots Are Full Right Now, Please Come Back Later
        </Text>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    flex: 1,
    padding: 24,
    flexWrap: "wrap",
  },
  box: {
    justifyContent: "center",
    alignItems: "center",
  },
  overlay: {
    position: "absolute",
    bottom: 48,
    left: 0,
    right: 0,
  },
  filledBox: {
    backgroundColor: "rgba(90,150,180,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  whiteFont: {
    color: "white",
    fontWeight: "bold",
  },
  card: {
    borderWidth: 2,
    borderColor: "rgba(90,150,180,0.5)",
    borderRadius: 8,
    padding: 12,
  },
});

export default ParkingSpaces;
