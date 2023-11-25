const SerialPort = require("serialport");
const admin = require("firebase-admin");

const serviceAccount = require("./flood-watch-614bb-firebase-adminsdk-wefl6-361c59d088.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL:
    "https://flood-watch-614bb-default-rtdb.asia-southeast1.firebasedatabase.app/",
});

const db = admin.database();
const rootRef = db.ref("Sensors"); // Added root node "Sensors"
const dataRef = rootRef.child("Donada");
// UnitedNations
// VitoCruz
// QuirinoAve
// PedroGil

const parsers = SerialPort.parsers;
const parser = new parsers.Readline({
  delimiter: "\r\n",
});

const port = new SerialPort("COM4", {
  baudRate: 9600,
  dataBits: 8,
  parity: "none",
  stopBits: 1,
  flowControl: false,
});

port.pipe(parser);

parser.on("data", function (data) {
  console.log(data);
  data = parseInt(data);
  const status = getStatus(data);

  const sensorData = {
    height: data,
    date: Date(Date.now()),
    indication: status,
  };

  dataRef
    .push(sensorData)
    .then(() => {
      console.log("Added to the database!");
    })
    .catch((error) => {
      console.log(error.message);
    });
});

const getStatus = (data) => {
  const statusRanges = [
    { min: 0, max: 20.32, status: "No flood" },
    { min: 20.32, max: 25.4, status: "Gutter" },
    { min: 25.4, max: 33.02, status: "Half knee" },
    { min: 33.02, max: 48.26, status: "Half tire" },
    { min: 48.26, max: 66.04, status: "Knee" },
    { min: 66.04, max: 93.98, status: "Tire" },
    { min: 93.98, max: 114.3, status: "Waist" },
    { min: 114.3, max: 152.4, status: "Head" },
    { min: 152.4, max: Infinity, status: "Above human" },
  ];

  for (const range of statusRanges) {
    if (data >= range.min && data < range.max) {
      return range.status;
    }
  }

  return "Unknown"; // Handle cases where data is not in any defined range
};
