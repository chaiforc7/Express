let Name = document.getElementById("name");
let email = document.getElementById("email");
let tel = document.getElementById("tel");
let message = document.getElementById("message");
let linkButton = document.getElementById("sendMessageButton");

let usermessage = {
  Name: Name.value,
  Email: email.value,
  Tel: tel.value,
  Message: message.value,
};
function handleChange() {
  usermessage.Name = Name.value;
  usermessage.Email = email.value;
  usermessage.Tel = tel.value;
  usermessage.Message = message.value;
}
let whatsappsend = linkButton.addEventListener("click", function () {
  location.href =
    "https://wa.me/2348132030908?text=" + JSON.stringify(usermessage);
  console.log(usermessage);
});
