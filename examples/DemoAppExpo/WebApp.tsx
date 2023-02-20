import React, { useEffect } from "react";
import { webViewRender, emit, useNativeMessage } from "react-native-react-bridge/lib/web";

const style = {
  width: 0,
  height: 0,
  // margin: "auto",
  // backgroundColor: "lightblue",
};

const Root = () => {
  // Use native message to get num_pts, v_0 & theta_0_deg from App.tsx
  const [num_pts, setNum_Pts] = React.useState<number>();
  const [v_0, setV_0] = React.useState<number>();
  const [theta_0_deg, setTheta_0_deg] = React.useState<number>();
  useNativeMessage<number[]>((message) => {
    if (message.type === "calculate") {
      setNum_Pts(message.data[0])
      setV_0(message.data[1]);
      setTheta_0_deg(message.data[2]);
    }
  });

  // Use useEffect to calculate sumarray and emit message to App.tsx
  useEffect(() => {
    if (num_pts !== undefined && v_0 !== undefined && theta_0_deg !== undefined) {
      const sumarray = [];
      for (let i = 0; i < num_pts; i++) {
        const sum = v_0 + theta_0_deg + 2*i;
        sumarray.push(sum);
      }
      emit({ type: "add", data: sumarray });
    }
  }, [num_pts, v_0, theta_0_deg]);

  return (
    <div style={style}>

    </div>
  );
};

export default webViewRender(<Root />);
