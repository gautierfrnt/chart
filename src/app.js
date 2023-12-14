import Chart from 'chart.js/auto';

// Fonction pour générer une couleur en fonction d'une chaîne de texte
function stringToColor(str) {
  // Utilisez une approche simple pour générer une couleur
  // const hue = str.length * 10; // Utilisez la longueur de la chaîne pour déterminer la teinte
  return `#BF4D34`; 
}

// Fonction pour récupérer les données du fichier JSON
async function fetchData() {
  const url = "https://www.cril.univ-artois.fr/~lecoutre/teaching/jssae/code5/results.json";

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error('Error fetching data');
    }

    const data = await response.json();

    const filteredData = data[2].data.filter(item => parseFloat(item.time) < 2400);

    console.log(filteredData);
    updateChart(filteredData);

  } catch (error) {
    console.error('Error fetching or parsing JSON:', error.message);
  }
}

// Fonction pour mettre à jour le graphique avec de nouvelles données
function updateChart(data) {
  // Récupérer tous les noms de solveurs
  const solverData = data;

  // const solverData = data[2].data;

  // Créer un ensemble unique de noms de solveurs pour générer des couleurs distinctes
  const uniqueSolverNames = Array.from(new Set(solverData.map(item => item.name)));

  // Créer des datasets pour chaque nom
  const datasets = uniqueSolverNames.map(name => {
    // Filtrer les données pour le nom actuel
    const filteredData = solverData.filter(item => item.name === name);

    // Calculer la moyenne des temps de résolution pour le nom actuel
    const averageTime = filteredData.reduce((total, item) => total + parseFloat(item.time), 0) / filteredData.length;

    return {
      label: name,
      data: [{ x: name, y: averageTime }],
      backgroundColor: stringToColor(name), // Utilisez la fonction pour générer une couleur
      borderColor: 'rgba(100, 0, 0, 1)', // Rouge, ajustez la transparence selon vos préférences
      fill: true,
      borderWidth: 2,
      showLine: true, // Activez l'affichage des lignes entre les points
    };
  });

  // Configuration du graphique
  const ctx = document.getElementById('canvas');
  new Chart(ctx, {
    type: 'line',
    data: {
      datasets: datasets,
    },
    options: {
      scales: {
        x: {
          type: 'category',
        },
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: 'Moyenne du temps de résolution (en secondes)',
          },
        },
      },
    },
  });
}

// Appeler la fonction fetchData pour récupérer les données et mettre à jour le graphique
fetchData();
