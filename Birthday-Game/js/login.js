// =================================
// LOGIN SYSTEM
// =================================

const loginForm = document.getElementById("loginForm");

const nameInput = document.getElementById("playerName");

const ageInput = document.getElementById("playerAge");

const errorMessage = document.getElementById("errorMessage");


// Form Submission
loginForm.addEventListener("submit", function(event) {

    event.preventDefault();

    const name = nameInput.value.trim();

    const age = Number(ageInput.value);


    // Name Validation
    if (name.length === 0) {

        errorMessage.textContent = "Please enter your name.";

        nameInput.focus();

        return;
    }


    // Age Validation
    if (
        ageInput.value.trim() === "" ||
        !Number.isInteger(age) ||
        age < 1 ||
        age > 99
    ) {

        errorMessage.textContent = "Please enter a valid age.";

        ageInput.focus();

        return;
    }


    // Clear Error
    errorMessage.textContent = "";


    // Start Adventure
    App.startGame(name, age);

});