// Load Pokémon data
let pokemonData;

fetch('./data/pokemon.json')
    .then(response => response.json())
    .then(data => pokemonData = data)
    .catch(error => console.error('Error loading Pokémon data:', error));

  

function getPokemonStats(name) {
    const pokemon = pokemonData.find(p => p.Name.toLowerCase() === name.toLowerCase());
    if (pokemon) {
        return {
            HP: pokemon.HP,
            Attack: pokemon.Attack,
            Defense: pokemon.Defense,
            Special_Attack: pokemon.Special_Attack,
            Special_Defense: pokemon.Special_Defense,
            Speed: pokemon.Speed
        };
    } else {
        return null;
    }
}

// Show empty radar chart initially
document.addEventListener("DOMContentLoaded", () => {
    createRadarChart();
});

function setupSuggestions(inputId, suggestionsId) {
    const input = document.getElementById(inputId);
    const suggestionsBox = document.getElementById(suggestionsId);

    input.addEventListener("input", () => {
        const query = input.value.toLowerCase().trim();
        suggestionsBox.innerHTML = ""; // Clear suggestions
        let matches = [];
        if (query.length > 0) {
            matches = pokemonData
                .filter(pokemon => pokemon.Name.toLowerCase().startsWith(query))
                .map(pokemon => pokemon.Name);

            matches.forEach(match => {
                const suggestion = document.createElement("div");
                suggestion.textContent = match;
                suggestion.addEventListener("click", () => {
                    input.value = match;
                    suggestionsBox.innerHTML = ""; // Clear suggestions on selection
                });
                suggestionsBox.appendChild(suggestion);
            });
        }

        suggestionsBox.style.display = matches.length > 0 ? "block" : "none";
    });

    // Hide suggestions when clicking outside
    document.addEventListener("click", (e) => {
        if (!suggestionsBox.contains(e.target) && e.target !== input) {
            suggestionsBox.style.display = "none";
        }
    });
}

// Activate suggestions for both inputs
setupSuggestions("pokemon1", "suggestions1");
setupSuggestions("pokemon2", "suggestions2");

function createRadarChart(data1, data2, name1, name2) {
    const container = d3.select("#chart-container");
    container.html(""); // Clear any existing chart

    const width = 600;
    const height = 600;
    const margin = 100;

    const radius = Math.min(width, height) / 2 - margin;
    const maxStatValue = 250;
    const levels = 5;

    const allAxis = ["HP", "Attack", "Defense", "Special_Attack", "Special_Defense", "Speed"];
    const angleSlice = (2 * Math.PI) / allAxis.length;

    // Create SVG
    const svg = container
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", `translate(${width / 2}, ${height / 2})`);

    // Draw grid
    for (let level = 0; level <= levels; level++) {
        const levelFactor = radius * (level / levels);
        svg.selectAll(`.grid-level-${level}`)
            .data(allAxis)
            .enter()
            .append("line")
            .attr("x1", (d, i) => levelFactor * Math.cos(angleSlice * i))
            .attr("y1", (d, i) => levelFactor * Math.sin(angleSlice * i))
            .attr("x2", (d, i) => levelFactor * Math.cos(angleSlice * (i + 1)))
            .attr("y2", (d, i) => levelFactor * Math.sin(angleSlice * (i + 1)))
            .attr("stroke", "#ddd")
            .attr("stroke-width", 1);
    }

    // Draw axes
    svg.selectAll(".axis")
        .data(allAxis)
        .enter()
        .append("line")
        .attr("x1", 0)
        .attr("y1", 0)
        .attr("x2", (d, i) => radius * Math.cos(angleSlice * i))
        .attr("y2", (d, i) => radius * Math.sin(angleSlice * i))
        .attr("stroke", "#bbb")
        .attr("stroke-width", 2);

    // Add labels
    svg.selectAll(".label")
        .data(allAxis)
        .enter()
        .append("text")
        .attr("x", (d, i) => (radius + 20) * Math.cos(angleSlice * i))
        .attr("y", (d, i) => (radius + 20) * Math.sin(angleSlice * i))
        .attr("text-anchor", "middle")
        .text(d => d);

    // Convert stats to coordinates
    function statsToCoordinates(stats) {
        return allAxis.map((axis, i) => ({
            x: radius * (stats[axis] / maxStatValue) * Math.cos(angleSlice * i),
            y: radius * (stats[axis] / maxStatValue) * Math.sin(angleSlice * i),
            value: stats[axis]
        }));
    }

    const coords1 = statsToCoordinates(data1);
    const coords2 = statsToCoordinates(data2);

    // Draw radar area
    const radarLine = d3.line().x(d => d.x).y(d => d.y).curve(d3.curveLinearClosed);

    svg.append("path")
        .datum(coords1)
        .attr("d", radarLine)
        .attr("fill", "rgba(99, 144, 240, 0.6)")
        .attr("stroke", "#6390F0");

    svg.append("path")
        .datum(coords2)
        .attr("d", radarLine)
        .attr("fill", "rgba(238, 129, 48, 0.6)")
        .attr("stroke", "#EE8130");

    // Add points and tooltips
    const tooltip = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("position", "absolute")
        .style("background", "#fff")
        .style("padding", "5px 10px")
        .style("border", "1px solid #ccc")
        .style("border-radius", "5px")
        .style("visibility", "hidden");

    // Add data points for first Pokémon
    svg.selectAll(".point1")
        .data(coords1)
        .enter()
        .append("circle")
        .attr("cx", d => d.x)
        .attr("cy", d => d.y)
        .attr("r", 5)
        .attr("fill", "#6390F0")
        .on("mouseover", function (event, d) {
            tooltip.style("visibility", "visible")
                .text(`${d.value}`);
        })
        .on("mousemove", function (event) {
            tooltip.style("top", (event.pageY - 10) + "px")
                .style("left", (event.pageX + 10) + "px");
        })
        .on("mouseout", function () {
            tooltip.style("visibility", "hidden");
        });

    // Add data points for second Pokémon
    svg.selectAll(".point2")
        .data(coords2)
        .enter()
        .append("circle")
        .attr("cx", d => d.x)
        .attr("cy", d => d.y)
        .attr("r", 5)
        .attr("fill", "#EE8130")
        .on("mouseover", function (event, d) {
            tooltip.style("visibility", "visible")
                .text(`${d.value}`);
        })
        .on("mousemove", function (event) {
            tooltip.style("top", (event.pageY - 10) + "px")
                .style("left", (event.pageX + 10) + "px");
        })
        .on("mouseout", function () {
            tooltip.style("visibility", "hidden");
        });

    // Add legend
    const legend = svg.append("g")
        .attr("transform", `translate(${-width / 2 + 10}, ${-height / 2 + 20})`);

    legend.append("circle").attr("cx", 0).attr("cy", 0).attr("r", 5).attr("fill", "#6390F0");
    legend.append("text").attr("x", 15).attr("y", 5).text(name1).attr("fill", "#333");

    legend.append("circle").attr("cx", 0).attr("cy", 20).attr("r", 5).attr("fill", "#EE8130");
    legend.append("text").attr("x", 15).attr("y", 25).text(name2).attr("fill", "#333");
}

document.getElementById('compare-btn').addEventListener('click', () => {
    const name1 = document.getElementById('pokemon1').value.trim();
    const name2 = document.getElementById('pokemon2').value.trim();

    const stats1 = getPokemonStats(name1);
    const stats2 = getPokemonStats(name2);

    if (stats1 && stats2) {
        createRadarChart(stats1, stats2, name1, name2);
    } else {
        alert('One or both Pokémon not found. Please check the names and try again.');
    }
});
