import { Component, AfterViewInit } from '@angular/core';
import { CountryService } from './country.service';

@Component({
  selector: 'app-map',
  standalone: true,
  templateUrl: './map.component.html',
  styleUrls: ['./map.css']
})
export class MapComponent implements AfterViewInit {
  constructor(private countryService: CountryService) {}

  async ngAfterViewInit() {
    console.log('MapComponent ngAfterViewInit triggered');
    const mapContainer = document.getElementById("map-container");
    if (!mapContainer) return;

    try {
      const response = await fetch("worldmap.svg");
      if (!response.ok) throw new Error("Map file not found");
      const svgData = await response.text();
      mapContainer.innerHTML = svgData;

      const paths = document.querySelectorAll("#worldmap path");

      paths.forEach(path => {
        path.addEventListener("mouseover", (e) => {
          const nameBox = document.getElementById("name")!;
          const nameText = document.getElementById("namep")!;
          path.setAttribute("fill", "lightblue");
          nameText.textContent = path.getAttribute("name") || "Unknown";
          nameBox.style.opacity = "1";

          window.onmousemove = function (j) {
            nameBox.style.top = j.clientY - 60 + "px";
            nameBox.style.left = j.clientX - 20 + "px";
          };
        });

        path.addEventListener("mouseleave", () => {
          path.setAttribute("fill", "");
          document.getElementById("name")!.style.opacity = "0";
        });

        path.addEventListener("click", () => {
          const countryId = path.id.toUpperCase();
          this.fetchCountryData(countryId);
        });
      });
    } catch (error) {
      console.error("Error loading map:", error);
    }

    const button = document.getElementById("button")!;
    const input = document.getElementById("usercode")! as HTMLInputElement;

    button.addEventListener("click", () => {
      const userInput = input.value.trim().toUpperCase();
      if (userInput) this.fetchCountryData(userInput);
    });

    input.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        const userInput = input.value.trim().toUpperCase();
        if (userInput) this.fetchCountryData(userInput);
      }
    });
  }

  fetchCountryData(code: string) {
    this.countryService.getCountryData(code).subscribe({
      next: (data: any) => {
        const country = data?.[1]?.[0];
        if (country) {
          this.displayCountryInfo(country);
          (document.getElementById("errormsg") as HTMLElement).innerText = "";
        } else {
          (document.getElementById("errormsg") as HTMLElement).innerText =
            "No country found matching that code.";
        }
      },
      error: (err) => {
        console.error("Error fetching country data:", err);
        (document.getElementById("errormsg") as HTMLElement).innerText =
          "Error fetching data.";
      }
    });
  }

  displayCountryInfo(country: any) {
    (document.getElementById("countryname") as HTMLElement).innerText = country.name || "N/A";
    (document.getElementById("capital") as HTMLElement).innerText = country.capitalCity || "N/A";
    (document.getElementById("region") as HTMLElement).innerText = country.region?.value || "N/A";
    (document.getElementById("incomelevel") as HTMLElement).innerText = country.incomeLevel?.value || "N/A";
    (document.getElementById("countrycode") as HTMLElement).innerText = country.iso2Code || "N/A";
    (document.getElementById("latitude") as HTMLElement).innerText = country.latitude || "N/A";
    (document.getElementById("longitude") as HTMLElement).innerText = country.longitude || "N/A";
  }
}
