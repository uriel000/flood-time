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

      //   console.log(`${userID}: ${userName} ${userEmail} ${userNumber}`);

      createUserTable(userID, userName, userEmail, userNumber, userType);
    });

    const deleteBtns = document.querySelectorAll("#userTable .delete-btn");

    deleteBtns.forEach((del) => {
      del.addEventListener("click", () => {
        // let adminConfirmed = window.confirm("Delete this user? ");

        // if (adminConfirmed) {
        //   let user_id = del.getAttribute("data-user-id");
        //   let exactLocationOfStoryInDb = ref(database, `Users/${user_id}`);
        //   remove(exactLocationOfStoryInDb);
        //   app.auth().deleteUser(user);
        //   alert("User deleted successfully.");
        // } else {
        //   console.log(del.getAttribute("data-user-id"));
        // }
        window.location.href = "https://console.firebase.google.com/";
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
  //   const editButton = document.createElement("button");
  const deleteButton = document.createElement("button");
  //   editButton.classList.add("btn", "btn-primary");
  //   editButton.textContent = "Edit";
  deleteButton.innerHTML = "<i class='fa-solid fa-pen'></i>";
  deleteButton.classList.add("btn", "btn-primary", "delete-btn");
  //   editButton.setAttribute("data-bs-toggle", "modal");
  //   editButton.setAttribute("data-bs-target", "#editModal");
  //   editButton.setAttribute("data-user-id", userID);
  deleteButton.setAttribute("data-user-id", userID);

  nameCell.innerHTML = userName;
  emailCell.innerHTML = userEmail;
  contactCell.innerHTML = userNumber;
  usertypeCell.innerHTML = userType;
  //   manageCell.appendChild(editButton);
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
