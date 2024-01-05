const SerialPort = require("serialport");
const admin = require("firebase-admin");
const nodemailer = require("nodemailer");
require("dotenv").config();

const serviceAccount = require("./flood-watch-614bb-firebase-adminsdk-wefl6-361c59d088.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.FIREBASE_DATABASE_URL,
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
  let exactData = Math.abs(data - 70);
  console.log(exactData);
  data = parseInt(exactData);
  const status = getStatus(exactData);

  sensorData = {
    height: exactData,
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
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const createEmail = () => {
  const emailString = userEmails.join(", ");
  console.log(emailString);
  let height = sensorData.height;
  let indication = sensorData.indication;
  let date = sensorData.date;
  let alertMessage = "";
  let detailMessage = "";
  if (height >= 33.02 && height < 66.04) {
    alertMessage = "Moderate Flooding";
    detailMessage = "It is not safe to travel here for light vehicles.";
  } else if (height >= 66.04) {
    alertMessage = "High Flooding";
    detailMessage = "It is not safe to travel here for all types of vehicles.";
  }
  let message = `
  <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; color: #333; margin: 0; padding: 0;">
    <table width="100%" cellspacing="0" cellpadding="0" bgcolor="#f4f4f4" style="margin: 0; padding: 20px;">
        <tr>
            <td align="center">
                <table width="600" cellspacing="0" cellpadding="0" bgcolor="#ffffff" style="border-radius: 10px; overflow: hidden; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
                    <!-- Header -->
                    <tr>
                        <td style="padding: 20px; text-align: center; background-color: #f47777; color: #ffffff;">
                            <h1 style="margin: 0;">Flood-Watch Alert</h1>
                        </td>
                    </tr>
                    <!-- Content -->
                    <tr>
                        <td style="padding: 20px;">
                            <p>Good day!</p>
                            <p>We want to alert you about the current flood situation at ${stationName}. As of ${date}.</p>
                            <br/>
                            <strong>Alert Details:</strong>
                            <ul>
                                <li>Alert: ${alertMessage}</li>
                                <li>Location: ${stationName}</li>
                                <li>Flood Height: ${height} cm</li>
                                <li>Flood Level: ${indication}</li>
                                <li>Details: ${detailMessage}</li>
                            </ul>
                            <br/>
                            <p>Your safety is our top priority. If you have any concerns or need assistance, feel free to contact us.</p>
                            <br/>
                            <p>Stay Safe,</p>
                            <p>Flood-Watch Team</p>
                        </td>
                    </tr>
                    <!-- Footer -->
                    <tr>
                        <td style="padding: 20px; text-align: center; background-color: #f47777; color: #ffffff;">
                            <p style="margin: 0;">This email was sent from Flood-Watch. Please do not reply to this email.</p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
  `;

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
