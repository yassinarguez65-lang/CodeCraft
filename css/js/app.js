const lomake = document.getElementById("haku-lomake");
const hakukentta = document.getElementById("haku");
const tulokset = document.getElementById("tulokset");
const viesti = document.getElementById("viesti");
const reseptinTiedot = document.getElementById("reseptin-tiedot");

lomake.addEventListener("submit", async (event) => {
    event.preventDefault();

    const hakusana = hakukentta.value.trim();

    if (!hakusana) return;

    tulokset.innerHTML = "";
    reseptinTiedot.innerHTML = "";
    viesti.textContent = "Haetaan reseptejä...";

    try {
        const vastaus = await fetch(
            `https://www.themealdb.com/api/json/v1/1/search.php?s=${encodeURIComponent(hakusana)}`
        );

        if (!vastaus.ok) {
            throw new Error("Rajapintavirhe");
        }

        const data = await vastaus.json();

        tulokset.innerHTML = "";

        if (!data.meals) {
            viesti.textContent = "Reseptejä ei löytynyt. Kokeile toista hakusanaa.";
            return;
        }

        viesti.textContent = `Löytyi ${data.meals.length} reseptiä.`;

        data.meals.forEach((resepti) => {
            const kortti = document.createElement("article");
            kortti.className = "resepti";

            kortti.innerHTML = `
                <img src="${resepti.strMealThumb}" alt="${resepti.strMeal}">
                <h3>${resepti.strMeal}</h3>
                <button type="button">Näytä resepti</button>
            `;

            kortti.querySelector("button").addEventListener("click", () => {
                naytaResepti(resepti);
            });

            tulokset.appendChild(kortti);
        });

    } catch (error) {
        viesti.textContent = "Reseptien hakeminen epäonnistui. Yritä uudelleen.";
    }
});

function naytaResepti(resepti) {
    const ainekset = [];

    for (let i = 1; i <= 20; i++) {
        const ainesosa = resepti[`strIngredient${i}`];
        const maara = resepti[`strMeasure${i}`];

        if (ainesosa && ainesosa.trim()) {
            ainekset.push(`<li>${maara || ""} ${ainesosa}</li>`);
        }
    }

    reseptinTiedot.innerHTML = `
        <h2>${resepti.strMeal}</h2>
        <img src="${resepti.strMealThumb}" alt="${resepti.strMeal}" width="250">
        <h3>Ainekset</h3>
        <ul>${ainekset.join("")}</ul>
        <h3>Valmistusohje</h3>
        <p>${resepti.strInstructions}</p>
    `;

    reseptinTiedot.scrollIntoView({ behavior: "smooth" });
}
