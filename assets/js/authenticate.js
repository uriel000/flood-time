let otp_val = 0;
const sendOtpBtn = document.querySelector("#sendOtpBtn");
sendOtpBtn.addEventListener("click", () => {
  sendOTP();
});
const sendOTP = () => {
  const email = document.querySelector("#userEmail");
  let messageBox = document.querySelector(".message");
  let messageBoxSpan = document.querySelector(".message span");
  otp_val = Math.floor(Math.random() * 10000);

  let emailBody = `
    <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; color: #333; margin: 0; padding: 0;">

    <table width="100%" cellspacing="0" cellpadding="0" bgcolor="#f4f4f4" style="margin: 0; padding: 20px;">
        <tr>
            <td align="center">
                <table width="600" cellspacing="0" cellpadding="0" bgcolor="#ffffff" style="border-radius: 10px; overflow: hidden; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
                    <!-- Header -->
                    <tr>
                        <td style="padding: 20px; text-align: center; background-color: #f9aaa6; color: #ffffff;">
                            <h1 style="margin: 0;">Flood-Watch</h1>
                        </td>
                    </tr>
                    <!-- Content -->
                    <tr>
                        <td style="padding: 20px;">
                            <h2 style="color: #f9aaa6;">One-Time Password (OTP) for Flood-Watch Login</h2>
                            <p>Your OTP is: <strong style="font-size: 1.2em; color: #333;">${otp_val}</strong></p>
                        </td>
                    </tr>
                    <!-- Footer -->
                    <tr>
                        <td style="padding: 20px; text-align: center; background-color: #f9aaa6; color: #ffffff;">
                            <p style="margin: 0;">This email was sent from Flood-Watch. Please do not reply to this email.</p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>

</body>
    `;

  Email.send({
    SecureToken: "75cac3c2-a152-46c4-8098-3ff84905ff6d",
    To: email.value,
    From: "jesrielledesma@gmail.com",
    Subject: "One-Time OTP for Flood-Watch",
    Body: emailBody,
  }).then((message) => {
    if (message === "OK") {
      messageBoxSpan.innerHTML = "OTP was sent to your email " + email.value;
      messageBox.style.display = "flex";
    }
  });
};

let otp_input = document.querySelector("#otp");
let otp_btn = document.querySelector("#submitOtpBtn");

otp_btn.addEventListener("click", () => {
  if (otp_input.value == otp_val) {
    window.location.href = "home.html";
  } else {
    let messageBox = document.querySelector(".message");
    let messageBoxSpan = document.querySelector(".message span");
    messageBoxSpan.textContent = "Incorrect OTP.";
    messageBox.style.display = "flex";
  }
});
