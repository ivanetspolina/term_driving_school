import StopIcon from "../../../assets/svg/stop.svg";
import GiveWayIcon from "../../../assets/svg/give_way.svg";
import MainRoadIcon from "../../../assets/svg/main_road.svg";
import TrafficRedIcon from "../../../assets/svg/traffic_light_red.svg";
import TrafficGreenIcon from "../../../assets/svg/traffic_light_green.svg";

// Додамо цю функцію для рендеру знаків
export const renderSign = (signId) => {
  switch (signId) {
    case "stop":
      return (
        <img
          src={StopIcon}
          alt="STOP"
          className="!w-[40px] !h-[40px]"
          style={{
            width: "40px !important",
            height: "40px !important",
            maxWidth: "40px",
            maxHeight: "40px",
          }}
        />
      );
    case "main_road":
      return (
        <img
          src={MainRoadIcon}
          alt="Main Road"
          className="!w-[40px] !h-[40px]"
          style={{
            width: "40px !important",
            height: "40px !important",
            maxWidth: "40px",
            maxHeight: "40px",
          }}
        />
      );
    case "give_way":
      return (
        <img
          src={GiveWayIcon}
          alt="Give Way"
          className="!w-[40px] !h-[40px]"
          style={{
            width: "40px !important",
            height: "40px !important",
            maxWidth: "40px",
            maxHeight: "40px",
          }}
        />
      );
    case "traffic_light_green":
      return (
        <img
          src={TrafficGreenIcon}
          alt="Green Light"
          className="!w-[60px] !h-[60px]"
          style={{
            width: "60px !important",
            height: "60px !important",
            maxWidth: "60px",
            maxHeight: "60px",
          }}
        />
      );
    case "traffic_light_red":
      return (
        <img
          src={TrafficRedIcon}
          alt="Red Light"
          className="!w-[60px] !h-[60px]"
          style={{
            width: "60px !important",
            height: "60px !important",
            maxWidth: "60px",
            maxHeight: "60px",
          }}
        />
      );
    default:
      return null;
  }
};
