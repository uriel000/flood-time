const SerialPort = require("serialport");
const admin = require("firebase-admin");
const nodemailer = require("nodemailer");
const axios = require("axios");

require("dotenv").config();

const serviceAccount = require("./flood-watch-614bb-firebase-adminsdk-wefl6-361c59d088.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL:
    "https://flood-watch-614bb-default-rtdb.asia-southeast1.firebasedatabase.app/",
});

const db = admin.database();
const rootRef = db.ref("Sensors");
// const stationName = "UnitedNations";
let stationName = "";
// const dataRef = rootRef.child(stationName);
// UnitedNations
// VitoCruz
// QuirinoAve
// // PedroGil

const parsers = SerialPort.parsers;
const parser = new parsers.Readline({
  delimiter: "\r\n",
});

const port = new SerialPort("COM6", {
  baudRate: 9600,
  dataBits: 8,
  parity: "none",
  stopBits: 1,
  flowControl: false,
});

port.pipe(parser);
let sensorData = {};
let bufferSize = 10;
let oldSensorData = new Array(bufferSize).fill(4);
// let oldSensorData = [4, 4, 4];

parser.on("data", function (data) {
  let splitData = data.split(":");
  let stationNameId = splitData[0];
  stationName =
    stationNameId === "0001"
      ? "UnitedNations"
      : stationNameId === "0002"
      ? "PedroGil"
      : "None";
  let stationData = splitData[1];
  let exactData = Math.abs(stationData);
  console.log(exactData);
  data = parseInt(exactData);
  const status = getStatus(exactData);
  let calcStdArray = [...oldSensorData];
  calcStdArray.shift();
  calcStdArray.push(exactData);
  const stdDeviation = calculateStandardDeviation(calcStdArray);
  console.log("Standard Deviation:", stdDeviation);
  console.log("Indication:", stdDeviation < 2 ? "Low" : "High");
  console.log("Data array: ", calcStdArray);

  sensorData = {
    height: exactData,
    date: Date(Date.now()),
    indication: status,
    dispersion: stdDeviation,
  };
  const dataRef = rootRef.child(stationName);

  dataRef
    .push(sensorData)
    .then(() => {
      let oldie = oldSensorData[oldSensorData.length - 2];
      let maxNum = Math.max(...oldSensorData);
      if (sensorData.height > maxNum) {
        if (sensorData.height > oldie && sensorData.height >= 33.02) {
          console.log("SMS sent");
          // createEmail();
          // createSMS();
        }
      }
      console.log("Added to the database!");
    })
    .catch((error) => {
      console.log(error.message);
    });
  oldSensorData.shift();
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
let userNumbers = [];

usersRef.once("value", (snapshot) => {
  const users = snapshot.val();

  if (users) {
    Object.keys(users).forEach((userId) => {
      const user = users[userId];
      userEmails.push(user.email);
      userNumbers.push(user.contact);
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

// Function to calculate standard deviation
function calculateStandardDeviation(dataArray) {
  const mean = dataArray.reduce((acc, val) => acc + val, 0) / dataArray.length;
  const squaredDifferences = dataArray.map((val) => Math.pow(val - mean, 2));
  const variance =
    squaredDifferences.reduce((acc, val) => acc + val, 0) / dataArray.length;
  const standardDeviation = Math.sqrt(variance);
  return standardDeviation;
}

const createSMS = async () => {
  const numberString = userNumbers.join(", ");
  let height = sensorData.height;
  let indication = sensorData.indication;
  let date = convertDateTime(sensorData.date);
  let alertMessage = "";
  let detailMessage = "";

  if (height >= 33.02 && height < 66.04) {
    alertMessage = "Moderate Flooding";
    detailMessage = "It is not safe to travel here for light vehicles.";
  } else if (height >= 66.04) {
    alertMessage = "High Flooding";
    detailMessage = "It is not safe to travel here for all types of vehicles.";
  }

  let message = `We want to alert you about the current flood situation at ${stationName}. As of ${date}.

    Alert: ${alertMessage}
    Flood Height: ${height} cm
    Flood Level: ${indication}
    Details: ${detailMessage}

    Stay Safe, Flood-Watch Team
  `;

  // const parameters = {
  //   apikey: process.env.SEMAPHORE_API_KEY,
  //   number: "09813756027, 09178744999, 09194546663, 09477609828",
  //   message: message,
  //   sendername: "Flood-Watch",
  // };

  const apiUrl = "https://api.semaphore.co/api/v4/messages";

  try {
    const response = await axios.post(apiUrl, {
      apikey: "fcd953ba83b3804747db383dc52d7ffe",
      message: message,
      number: "09813756027, 09194546663, 09477609828", // Replace with the recipient's phone number
    });

    console.log("SMS sent successfully:", response.data);
  } catch (error) {
    console.error("Error sending SMS:", error.message);
  }
};

const convertDateTime = (time) => {
  const today = new Date(time);

  const options = { year: "numeric", month: "long", day: "numeric" };
  const formattedDate = today.toLocaleDateString("en-US", options);

  // Get the hours and minutes from the Date object
  var hour = today.getHours();
  var minutes = today.getMinutes();

  // Format the time
  var ampm = hour >= 12 ? "pm" : "am";
  hour = hour % 12;
  hour = hour ? hour : 12;
  minutes = minutes < 10 ? "0" + minutes : minutes;
  const exactDate = `${formattedDate} ${hour}:${minutes}${ampm}`;
  return exactDate;
};
