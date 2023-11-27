const SerialPort = require("serialport");
const admin = require("firebase-admin");
const nodemailer = require("nodemailer");

const serviceAccount = require("./flood-watch-614bb-firebase-adminsdk-wefl6-361c59d088.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL:
    "https://flood-watch-614bb-default-rtdb.asia-southeast1.firebasedatabase.app/",
});

const db = admin.database();
const rootRef = db.ref("Sensors");
const stationName = "VitoCruz";
const dataRef = rootRef.child(stationName);
// UnitedNations
// VitoCruz
// QuirinoAve
// // PedroGil

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
let sensorData = {};
let oldSensorData = [0, 30];

parser.on("data", function (data) {
  console.log(data);
  data = parseInt(data);
  const status = getStatus(data);

  sensorData = {
    height: data,
    date: Date(Date.now()),
    indication: status,
  };

  dataRef
    .push(sensorData)
    .then(() => {
      let oldie = oldSensorData[oldSensorData.length - 2];
      if (sensorData.height > oldie && sensorData.height >= 33.02) {
        createEmail();
      }
      console.log("Added to the database!");
    })
    .catch((error) => {
      console.log(error.message);
    });
  oldSensorData.push(sensorData.height);
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

const usersRef = db.ref("Users");
let userEmails = [];

usersRef.once("value", (snapshot) => {
  const users = snapshot.val();

  if (users) {
    Object.keys(users).forEach((userId) => {
      const user = users[userId];
      userEmails.push(user.email);
    });
  } else {
    console.log("No users found");
  }
});

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "jesrielledesma@gmail.com", // Replace with your Gmail address
    pass: "iayd mdwa epun polc", // Replace with your Gmail password or generate an app password
  },
});

const createEmail = () => {
  const emailString = userEmails.join(", ");
  console.log(emailString);
  let height = sensorData.height;
  let indication = sensorData.indication;
  let date = sensorData.date;
  let message = "";
  if (height >= 33.02 && height < 66.04) {
    message = `
  Good day!<br/><br/>
  We want to alert you about the current flood situation at ${stationName}.  As of ${date}.<br/>
  <br/>
  Alert: Moderate Flooding<br/>
  Location: ${stationName}<br/>
  Flood Height: ${height} cm<br/>
  Flood Level: ${indication}<br/>
  Details: It is not safe to travel here for light vehicles.<br/><br/>
  Your safety is our top priority.<br/>
  If you have any concerns or need assistance, feel free to contact us.<br/><br/>
  Stay Safe,<br/>
  Flood-Watch Team
    `;
  } else if (height >= 66.04) {
    message = `
  Good day!<br/><br/>
  We want to alert you about the current flood situation at ${stationName}. As of ${date}.<br/>
  <br/>
  Alert: High Flooding<br/>
  Location: ${stationName}<br/>
  Flood Height: ${height} cm<br/>
  Flood Level: ${indication}<br/>
  Details: It is not safe to travel here for all types of vehicles.<br/><br/>
  Your safety is our top priority.<br/>
  If you have any concerns or need assistance, feel free to contact us.<br/><br/>
  Stay Safe,<br/>
  Flood-Watch Team
    `;
  }
  const messageHead = {
    from: "jesrielledesma@gmail.com",
    to: emailString, // Join the array into a comma-separated string
    subject: "Flood Watch: Flood Alert",
    html: message,
  };

  // Send the email
  transporter.sendMail(messageHead, (error, info) => {
    if (error) {
      console.error(error.message);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
};