document.addEventListener("DOMContentLoaded", async function () {
  const mapContainer = document.getElementById("map-container");

  try {
    // Fetch the SVG file
    const response = await fetch("Angular-Files/src/worldmap.svg");
    if (!response.ok) throw new Error("Map file not found");
    const svgData = await response.text();

    // Inject SVG into container
    mapContainer.innerHTML = svgData;

    // throw error if map can't load
    const svg = mapContainer.querySelector("svg");
    if (!svg) throw new Error("No <svg> found in SVG file");
    svg.id = "worldmap";

    // Select all svg paths
    const paths = document.querySelectorAll("#worldmap path");

    // Add map hover effects
    paths.forEach(path => {
      path.addEventListener("mouseover", function () {
        const nameBox = document.getElementById("name");
        const nameText = document.getElementById("namep");

        path.style.fill = "lightblue";
        nameText.innerText = path.getAttribute("name") || "Unknown";
        nameBox.style.opacity = 1;

        window.onmousemove = function (event) {
          nameBox.style.top = event.clientY - 30 + "px";
          nameBox.style.left = event.clientX - 20 + "px";
        };
      });

      path.addEventListener("mouseleave", function () {
        path.style.fill = "";
        document.getElementById("name").style.opacity = 0;
      });

      path.addEventListener("click", async () => {
        const countryId = path.id.toUpperCase();
        fetchCountryData(countryId);
      });
    });
  } catch (error) {
    console.error("Error loading map:", error);
  }

  // Function to display country info
  function displayCountryInfo(country) {
    document.getElementById("countryname").innerText = country.name || "N/A";
    document.getElementById("capital").innerText = country.capitalCity || "N/A";
    document.getElementById("region").innerText = country.region?.value || "N/A";
    document.getElementById("incomelevel").innerText = country.incomeLevel?.value || "N/A";
    document.getElementById("countrycode").innerText = country.iso2Code || "N/A";
    document.getElementById("latitude").innerText = country.latitude || "N/A";
    document.getElementById("longitude").innerText = country.longitude || "N/A";
  }

  // Reusable API fetch function
  async function fetchCountryData(code) {
    try {
      const res = await fetch(`https://api.worldbank.org/v2/country/${code}?format=json`);
      const data = await res.json();
      const country = data?.[1]?.[0];

      if (country) {
        displayCountryInfo(country);
        document.getElementById("errormsg").innerText = "";
      } else {
        document.getElementById("errormsg").innerText = "No country found matching that code.";
      }
    } catch (err) {
      console.error("Error fetching country data:", err);
      document.getElementById("errormsg").innerText = "Error fetching data.";
    }
  }

  // Handle user input search
  const button = document.getElementById("button");
  const input = document.getElementById("usercode");

  button.addEventListener("click", () => {
    const userInput = input.value.trim().toUpperCase();
    if (userInput) fetchCountryData(userInput);
  });

  input.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      const userInput = input.value.trim().toUpperCase();
      if (userInput) fetchCountryData(userInput);
    }
  });
});
