// animated loader
window.addEventListener("load", function () {
  setTimeout(() => {
    document.getElementById("loader").classList.add("hidden");
    document.querySelector(".container").style.display = "block";
  }, 2500); // Matches animation duration to complete before hiding
});

// Save all UI elements in variables at the top level
const form = document.getElementById("diesel-calculator");
const tankTypeInput = document.getElementById("tankType");
const orientationContainer = document.getElementById("orientation-container");
const tankOrientationInput = document.getElementById("tankOrientation");
const dimensionsContainer = document.getElementById("dimensions-container");
const rectangularDimension = document.getElementById("rectangular-dimensions");
const cylindricalDimension = document.getElementById("cylindrical-dimensions");
const lengthRectangular = document.getElementById("length"); // Rectangular tank length
const breadthInput = document.getElementById("breadth"); // Rectangular tank breadth
const dipLevelRectangular = document.getElementById("dipLevel-rectangular"); // Liquid height for rectangular tank
const heightRectangular = document.getElementById("height");
const lengthCylindrical = document.getElementById("length-cylindrical"); // Cylindrical tank length
const diameterInput = document.getElementById("diameter"); // Cylindrical tank diameter
const dipLevelCylindrical = document.getElementById("dipLevel-cylindrical"); // Liquid height for cylindrical tank
const resultContainer = document.getElementById("result-container");
const resultDiv = document.getElementById("result");
const calculateButton = document.getElementById("calculate");
const clearResultsButton = document.getElementById("clear-results");
const resetButton = document.getElementById("reset");
const toast = document.getElementById("toast");

// Event listeners
tankTypeInput.addEventListener("change", function () {
  if (tankTypeInput.value === "cylindrical") {
    orientationContainer.style.display = "block";
    rectangularDimension.style.display = "none";
  } else if (tankTypeInput.value === "rectangular") {
    orientationContainer.style.display = "none";
    dimensionsContainer.style.display = "block";
    rectangularDimension.style.display = "block";
    cylindricalDimension.style.display = "none";
  } else {
    orientationContainer.style.display = "none";
    dimensionsContainer.style.display = "none";
  }
  resultContainer.style.display = "none";
});

tankOrientationInput.addEventListener("change", function () {
  if (
    tankOrientationInput.value === "horizontal" ||
    tankOrientationInput.value === "vertical"
  ) {
    dimensionsContainer.style.display = "block";
    cylindricalDimension.style.display = "block";
  }
});

calculateButton.addEventListener("click", function (event) {
  event.preventDefault();

  // Get input values based on tank type and orientation
  let tankCapacityLiters, liquidVolumeLiters, volumePerCm;
  if (tankTypeInput.value === "rectangular") {
    const length = parseFloat(lengthRectangular.value);
    const breadth = parseFloat(breadthInput.value);
    const height = parseFloat(heightRectangular.value);
    const dipLevel = parseFloat(dipLevelRectangular.value);

    if (isNaN(length) || isNaN(breadth) || isNaN(dipLevel)) {
      showToast("Please enter valid values for rectangular tank dimensions.");
      return;
    }

    tankCapacityLiters = (length * breadth * height) / 1000;
    liquidVolumeLiters = (length * breadth * dipLevel) / 1000;
    volumePerCm = tankCapacityLiters / 1000; // Volume per cm for rectangular tank
  } else if (tankTypeInput.value === "cylindrical") {
    const length = parseFloat(lengthCylindrical.value);
    const diameter = parseFloat(diameterInput.value);
    const dipLevel = parseFloat(dipLevelCylindrical.value);
    const radius = diameter / 2;

    if (isNaN(length) || isNaN(diameter) || isNaN(dipLevel)) {
      showToast("Please enter valid values for cylindrical tank dimensions.");
      return;
    }

    if (tankOrientationInput.value === "horizontal") {
      tankCapacityLiters = (Math.PI * Math.pow(radius, 2) * length) / 1000;
      liquidVolumeLiters =
        (length *
          (Math.pow(radius, 2) * Math.acos((radius - dipLevel) / radius) -
            (radius - dipLevel) *
              Math.sqrt(2 * radius * dipLevel - Math.pow(dipLevel, 2)))) /
        1000;
      volumePerCm = tankCapacityLiters / 1000; // Volume per cm for cylindrical tank in horizontal orientation
    } else {
      tankCapacityLiters = (Math.PI * Math.pow(radius, 2) * length) / 1000;
      liquidVolumeLiters = (Math.PI * Math.pow(radius, 2) * dipLevel) / 1000;
      volumePerCm = tankCapacityLiters / 1000; // Volume per cm for vertical orientation
    }
  } else {
    showToast("Please select a tank type.");
    return;
  }

  resultDiv.innerHTML = `
    <p>Total Capacity: ${tankCapacityLiters.toFixed(2)} liters</p>
    <p>Diesel Volume: ${liquidVolumeLiters.toFixed(2)} liters</p>
    <p>Missing Volume: ${(tankCapacityLiters - liquidVolumeLiters).toFixed(2)} liters</p>
    <div class="volume-container">
        <p style="margin-block: 10px;">Note: 1cm = ${volumePerCm.toFixed(2)} liters</p>
    </div>
`;

  resultContainer.style.display = "block";
});

clearResultsButton.addEventListener("click", clearResults);

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 3000);
}

// Function to reset form
function resetForm() {
  // reset the input fields
  tankTypeInput.value = "";
  tankOrientationInput.value = "";
  lengthRectangular.value = "";
  breadthInput.value = "";
  dipLevelRectangular.value = "";
  lengthCylindrical.value = "";
  diameterInput.value = "";
  dipLevelCylindrical.value = "";

  // reset the UI
  orientationContainer.style.display = "none";
  dimensionsContainer.style.display = "none";
  resultContainer.style.display = "none";
}

function clearResults() {
  resultContainer.style.display = "none";
  resultDiv.innerHTML = "";
}

// Reset the UI
resetButton.addEventListener("click", resetForm);
