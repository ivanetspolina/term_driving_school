import StopIcon from "../../../assets/svg/stop.svg";
import GiveWayIcon from "../../../assets/svg/give_way.svg";
import MainRoadIcon from "../../../assets/svg/main_road.svg";
import TrafficRedIcon from "../../../assets/svg/traffic_light_red.svg";
import TrafficGreenIcon from "../../../assets/svg/traffic_light_green.svg";

// Константи для розмірів
const SIGN_SIZE = 40;
const TRAFFIC_LIGHT_SIZE = 60;

// Стилі для знаків
const signStyles = {
  regular: {
    width: `${SIGN_SIZE}px`,
    height: `${SIGN_SIZE}px`,
    maxWidth: `${SIGN_SIZE}px`,
    maxHeight: `${SIGN_SIZE}px`,
  },
  trafficLight: {
    width: `${TRAFFIC_LIGHT_SIZE}px`,
    height: `${TRAFFIC_LIGHT_SIZE}px`,
    maxWidth: `${TRAFFIC_LIGHT_SIZE}px`,
    maxHeight: `${TRAFFIC_LIGHT_SIZE}px`,
  }
};

// Об'єкт зі знаками для більш декларативного підходу
const SIGNS = {
  stop: {
    icon: StopIcon,
    alt: "STOP",
    style: signStyles.regular
  },
  main_road: {
    icon: MainRoadIcon,
    alt: "Main Road",
    style: signStyles.regular
  },
  give_way: {
    icon: GiveWayIcon,
    alt: "Give Way",
    style: signStyles.regular
  },
  traffic_light_green: {
    icon: TrafficGreenIcon,
    alt: "Green Light",
    style: signStyles.trafficLight
  },
  traffic_light_red: {
    icon: TrafficRedIcon,
    alt: "Red Light",
    style: signStyles.trafficLight
  }
};

// Додамо цю функцію для рендеру знаків
export const renderSign = (signId) => {
  const sign = SIGNS[signId];
  
  if (!sign) return null;

  return (
    <img
      src={sign.icon}
      alt={sign.alt}
      className="sign-icon"
      style={sign.style}
    />
  );
};



// export const renderSign = (signId) => {
//   switch (signId) {
//     case "stop":
//       return (
//         <img
//           src={StopIcon}
//           alt="STOP"
//           className="!w-[40px] !h-[40px]"
//           style={{
//             width: "40px !important",
//             height: "40px !important",
//             maxWidth: "40px",
//             maxHeight: "40px",
//           }}
//         />
//       );
//     case "main_road":
//       return (
//         <img
//           src={MainRoadIcon}
//           alt="Main Road"
//           className="!w-[40px] !h-[40px]"
//           style={{
//             width: "40px !important",
//             height: "40px !important",
//             maxWidth: "40px",
//             maxHeight: "40px",
//           }}
//         />
//       );
//     case "give_way":
//       return (
//         <img
//           src={GiveWayIcon}
//           alt="Give Way"
//           className="!w-[40px] !h-[40px]"
//           style={{
//             width: "40px !important",
//             height: "40px !important",
//             maxWidth: "40px",
//             maxHeight: "40px",
//           }}
//         />
//       );
//     case "traffic_light_green":
//       return (
//         <img
//           src={TrafficGreenIcon}
//           alt="Green Light"
//           className="!w-[60px] !h-[60px]"
//           style={{
//             width: "60px !important",
//             height: "60px !important",
//             maxWidth: "60px",
//             maxHeight: "60px",
//           }}
//         />
//       );
//     case "traffic_light_red":
//       return (
//         <img
//           src={TrafficRedIcon}
//           alt="Red Light"
//           className="!w-[60px] !h-[60px]"
//           style={{
//             width: "60px !important",
//             height: "60px !important",
//             maxWidth: "60px",
//             maxHeight: "60px",
//           }}
//         />
//       );
//     default:
//       return null;
//   }
// };
