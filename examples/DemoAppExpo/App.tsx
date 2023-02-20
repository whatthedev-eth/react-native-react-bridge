import React, { useState } from "react";
import {
  Dimensions,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TextInput,
  Pressable,
} from "react-native";
import WebView from "react-native-webview";
import { useWebViewMessage } from "react-native-react-bridge";

// Import web app component
import webApp from "./WebApp";

const { width, height } = Dimensions.get("window");

export default function App() {
  // Define state variables
  const [num_pts, setNum_pts] = useState("");
  const [v_0, setV_0] = useState("");
  const [theta_0_deg, setTheta_0_Deg] = useState("");
  const [sumarray, setSumarray] = useState<number[]>([]);

  // Use bridge library to create a reference to webview, 
  // and listen to messages from web app
  const { ref, onMessage, emit } = useWebViewMessage<number[]>((message) => {
    if (message.type === "add") {
      setSumarray(message.data); // update state variable with sumarray
    }
  });

  const handlePress = () => {
    // Convert to Numbers
    const num_ptsNum = Number(num_pts);
    const v_0Num = Number(v_0);
    const theta_0_degNum = Number(theta_0_deg);
    // Emit message to web app with v_0Num and theta_0_degNum as data
    emit({ type: "calculate", data: [num_ptsNum, v_0Num, theta_0_degNum] });
  };

  return (
    <View style={styles.container}>
      <View style={styles.mobileapp}>
        <TextInput
          style={styles.input}
          // update state if input text changes
          onChangeText={(text) => setNum_pts(text)} 
          // set value of input to state variable
          value={num_pts} 
          keyboardType="numeric"
          placeholder="Enter num_pts"
        />
        <TextInput
          style={styles.input}
          // update state if input text changes
          onChangeText={(text) => setV_0(text)} 
          // set value of input to state variable
          value={v_0} 
          keyboardType="numeric"
          placeholder="Enter v_0"
        />
        <TextInput
          style={styles.input}
          onChangeText={(text) => setTheta_0_Deg(text)}
          value={theta_0_deg}
          keyboardType="numeric"
          placeholder="Enter theta0 in degrees"
        />
        <Pressable
          // send message to webApp when button is pressed
          onPress={handlePress}
          style={styles.button}
        >
          <Text>Calculate Sum</Text>
        </Pressable>
  
        {/* Display the values in the sumarray */}
        {sumarray && (
          <View>
            {sumarray.map((value, index) => (
              <Text key={index}>Value {index + 1}: {value}</Text>
            ))}
          </View>
        )}
      </View>
      <WebView 
        style={styles.webapp}
        ref={ref}
        source={{ html: webApp }}
        onMessage={onMessage}
        onError={console.log}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  webapp: {
    height: 0,
    width: 0,
    opacity: 0,
  },
  mobileapp: {
    padding: 4,
    height: height,
    width: width,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    height: 40,
    width: 200,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 8,
    paddingHorizontal: 10,
  },
  button: {
    borderRadius: 10,
    padding: 8,
    backgroundColor: "lightgray",
    alignItems: "center",
    marginTop: 16,
  },
});