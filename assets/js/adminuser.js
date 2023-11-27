// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
} from "https://www.gstatic.com/firebasejs/10.4.0/firebase-auth.js";
import {
  getDatabase,
  set,
  ref,
  push,
  update,
  onValue,
  remove,
} from "https://www.gstatic.com/firebasejs/10.4.0/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyCpr-1EERV53eqD-jKDGBCNLYeW4GwbBSs",
  authDomain: "flood-watch-614bb.firebaseapp.com",
  projectId: "flood-watch-614bb",
  storageBucket: "flood-watch-614bb.appspot.com",
  messagingSenderId: "917331455641",
  appId: "1:917331455641:web:6f7bd1c3974ec667d71208",
  databaseURL:
    "https://flood-watch-614bb-default-rtdb.asia-southeast1.firebasedatabase.app/",
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const usersInDB = ref(database, "Users/");
const auth = getAuth(app);
let usersArray = [];

// Display all users
onValue(usersInDB, (snapshot) => {
  resetTable();
  if (snapshot.exists()) {
    let usersArray = Object.entries(snapshot.val());
    console.log(usersArray.length);

    usersArray.map((user) => {
      const userID = user[0];
      const userName = user[1]["name"];
      const userEmail = user[1]["email"];
      const userNumber = user[1]["contact"];
      const userType = user[1]["user_type"];
      usersArray.push({
        userid: user[0],
        name: user[1]["name"],
        email: user[1]["email"],
        contact: user[1]["contact"],
        user_type: user[1]["user_type"],
      });

      //   console.log(`${userID}: ${userName} ${userEmail} ${userNumber}`);

      createUserTable(userID, userName, userEmail, userNumber, userType);
    });

    const deleteBtns = document.querySelectorAll("#userTable .delete-btn");

    deleteBtns.forEach((del) => {
      del.addEventListener("click", () => {
        deleteUser(del.getAttribute("data-user-id"), usersArray);
        // window.location.href = "https://console.firebase.google.com/";
      });
    });

    const editBtns = document.querySelectorAll("#userTable .edit-btn");
    editBtns.forEach((edituser) => {
      edituser.addEventListener("click", () => {
        editUser(edituser.getAttribute("data-user-id"), usersArray);
      });
    });
  }
});

const resetTable = () => {
  const table = document.getElementById("tableBody");
  table.innerHTML = "";
};

// Create the user table
const createUserTable = (userID, userName, userEmail, userNumber, userType) => {
  const table = document.getElementById("tableBody");

  let newRow = table.insertRow();
  let nameCell = newRow.insertCell(0);
  let emailCell = newRow.insertCell(1);
  let contactCell = newRow.insertCell(2);
  let usertypeCell = newRow.insertCell(3);
  let manageCell = newRow.insertCell(4);
  newRow.id = userID;
  const editButton = document.createElement("button");
  const deleteButton = document.createElement("button");
  editButton.classList.add("btn", "btn-primary", "edit-btn");
  editButton.innerHTML = "<i class='fa-solid fa-pen'></i>";
  deleteButton.innerHTML = "<i class='fa-solid fa-trash'></i>";
  deleteButton.classList.add("btn", "btn-primary", "delete-btn");
  editButton.setAttribute("data-bs-toggle", "modal");
  editButton.setAttribute("data-bs-target", "#editModal");
  deleteButton.setAttribute("data-bs-toggle", "modal");
  deleteButton.setAttribute("data-bs-target", "#deleteModal");
  editButton.setAttribute("data-user-id", userID);
  deleteButton.setAttribute("data-user-id", userID);

  nameCell.innerHTML = userName;
  emailCell.innerHTML = userEmail;
  contactCell.innerHTML = userNumber;
  usertypeCell.innerHTML = userType;
  manageCell.appendChild(editButton);
  manageCell.appendChild(deleteButton);
};

const addButton = document.querySelector("#addButtonModal");

addButton.addEventListener("click", (e) => {
  e.preventDefault();
  const nameInput = document.querySelector("#new-user-name").value;
  const emailInput = document.querySelector("#new-user-email").value;
  const numberInput = document.querySelector("#new-user-number").value;
  const passwordInput = document.querySelector("#new-user-password").value;
  const userTypeInput = document.querySelector("#new-user-type").value;
  if (
    nameInput !== "" &&
    emailInput !== "" &&
    numberInput !== "" &&
    passwordInput !== "" &&
    userTypeInput !== ""
  ) {
    addToDatabase(
      nameInput,
      emailInput,
      numberInput,
      passwordInput,
      userTypeInput
    );
    // clearInputBoxes();
  }
});

// Adds the input to the database
const addToDatabase = (
  nameInput,
  emailInput,
  numberInput,
  passwordInput,
  userTypeInput
) => {
  createUserWithEmailAndPassword(auth, emailInput, passwordInput)
    .then((userCredential) => {
      const user = userCredential.user;
      set(ref(database, "Users/" + user.uid), {
        name: nameInput,
        email: emailInput,
        contact: numberInput,
        user_type: userTypeInput,
      });
      const messageBox = document.querySelector(".message");
      const messageBoxSpan = document.querySelector(".message span");
      messageBoxSpan.innerHTML = "Registration successful.";
      messageBox.style.display = "flex";
      document.querySelector("#new-user-name").value = "";
      document.querySelector("#new-user-email").value = "";
      document.querySelector("#new-user-number").value = "";
      document.querySelector("#new-user-password").value = "";
      document.querySelector("#new-user-type").value = "";
    })
    .catch((error) => {
      const errorCode = error.code;
      const messageBox = document.querySelector(".message");
      const messageBoxSpan = document.querySelector(".message span");
      const errorCodeWithoutPrefix = errorCode.replace("auth/", "");
      const formattedErrorCode = errorCodeWithoutPrefix
        .replace(/-/g, " ") // Replace dashes with spaces
        .replace(/\b\w/g, (firstChar) => firstChar.toUpperCase());
      messageBoxSpan.innerHTML = formattedErrorCode;
      messageBox.style.display = "flex";
    });
};

const editUser = (user_id, usersArray) => {
  const foundUser = usersArray.find((user) => user.userid === user_id);

  if (foundUser) {
    const editButton = document.querySelector("#editButtonModal");
    const nameInput = document.querySelector("#edit-user-name");
    let emailInput = document.querySelector("#edit-user-email");
    let contactInput = document.querySelector("#edit-user-number");
    let typeInput = document.querySelector("#edit-user-type");
    // let stringPathInput = document.querySelector("#editstringPath");

    // Set initial values
    nameInput.value = foundUser.name;
    emailInput.value = foundUser.email;
    contactInput.value = foundUser.contact;
    typeInput.value = foundUser.user_type;
    // stringPathInput.value = foundSensor.sensorP;

    editButton.addEventListener("click", () => {
      // Update values when the button is clicked
      const updatedName = nameInput.value;
      const updatedEmail = emailInput.value;
      const updatedContact = contactInput.value;
      const updatedUsertype = typeInput.value;
      // const updatedStringPath = stringPathInput.value;

      if (
        updatedName !== "" &&
        updatedEmail !== "" &&
        updatedContact !== "" &&
        updatedUsertype !== ""
      ) {
        const updatedUserData = {
          name: updatedName,
          email: updatedEmail,
          contact: updatedContact,
          user_type: updatedUsertype,
        };
        editToDatabase(user_id, updatedUserData);
        // Update the sensor in the database with updatedSensor
        // addToDatabase(updatedSensor, nameInput.value);
        // clearInputBoxes();
      }
    });
  }
};

const editToDatabase = (user_id, updatedUserData) => {
  const stationsInDB = ref(database, `Users/${user_id}`);
  update(stationsInDB, updatedUserData)
    .then(() => {
      console.log(`Data updated under ${user_id}`);
    })
    .catch((error) => {
      console.error("Error updating data:", error);
    });
};

const deleteUser = (user_id, usersArray) => {
  const foundUser = usersArray.find((user) => user.userid === user_id);
  if (foundUser) {
    const deleteBtn = document.querySelector("#deleteButtonModal");
    let userdeleteName = document.querySelector("#nameOfuser");
    userdeleteName.textContent = `"${foundUser.name}"`;

    deleteBtn.addEventListener("click", () => {
      let exactLocationOfStoryInDb = ref(database, `Users/${user_id}`);
      remove(exactLocationOfStoryInDb);
      app.auth().deleteUser(user_id);
    });
  }
};
