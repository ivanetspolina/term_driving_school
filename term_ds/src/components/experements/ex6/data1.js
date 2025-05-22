export const initialGrid = [
  [0, 0, 0, 1, 1, 0, 0, 0],
  [0, 0, 0, 1, 1, 0, 0, 0],
  [0, 0, 0, 1, 1, 0, 0, 0],
  [1, 1, 1, 1, 1, 1, 1, 4],
  [3, 1, 1, 1, 1, 1, 1, 1],
  [0, 0, 0, 1, 1, 0, 0, 0],
  [0, 0, 0, 1, 1, 0, 0, 0],
  [0, 0, 0, 1, 1, 0, 0, 0],
];

export const trafficLights = {
  "4,2": {
    name: "stop",
    cssClass: "custom-rule-top"
  },
  "4,2": "green", 
  "3,5": "red"
};

export const trueAnswer = {
  0: "car1",
  1: "car2",
};


export const carsList = [
  {
    id: "car1",
    color: "red",
    icon: "🚗",
    position: [4, 0],
    path: [
      [4, 0],
      [4, 1],
      [4, 2],
      [4, 3],
      [4, 4],
      [3, 4],
      [2, 4],
      [1, 4],
      [0, 4],
    ],
    finished: false,
  },
  {
    id: "car2",
    color: "blue",
    icon: "🚙",
    position: [3, 7],
    path: [
      [3, 7],
      [3, 6],
      [3, 5],
      [3, 4],
      [3, 3],
      [4, 3],
      [5, 3],
      [6, 3],
      [7, 3],
    ],
    finished: false,
  },
];
