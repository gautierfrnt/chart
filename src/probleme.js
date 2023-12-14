import Chart from 'chart.js/auto';

const UNSAT = 'UNSAT';
const SAT = 'SAT';
const UNKNOWN = 'UNKNOWN';


function stringToColor(status) {
  switch (status) {
    case UNSAT:
      return '#2458BF'
    case SAT:
      return '#F2DCC9'; 
    case UNKNOWN:
      return '#BF5934'; 
    default:
      return 'rgb(50%, 50%, 50%)'; // Gray by default
  }
}


async function fetchData() {
  const url = "https://www.cril.univ-artois.fr/~lecoutre/teaching/jssae/code5/results.json";

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error('Error fetching data');
    }

    const data = await response.json();
    console.log(data[2].data);
    updateChart(data);

  } catch (error) {
    console.error('Error fetching or parsing JSON:', error.message);
  }
}

function updateChart(data) {
    // Récupérer tous les noms de solveurs
    const solverData = data[2].data;
  
    // Créer un ensemble unique de noms de solveurs pour générer des couleurs distinctes
    const uniqueSolverNames = Array.from(new Set(solverData.map(item => item.name)));
  
    // Créer des datasets pour chaque nom
    const datasets = uniqueSolverNames
      .map(name => {
        // Filtrer les données pour le nom actuel
        const filteredData = solverData.filter(item => item.name === name);
  
        // Initialiser les compteurs pour chaque statut
        let unsatCount = 0;
        let satCount = 0;
        let unknownCount = 0;
  
        // Compter le nombre de fois où item.status est 'UNSAT', 'SAT' ou 'UNKNOWN'
        filteredData.forEach(item => {
          switch (item.status) {
            case UNSAT:
              unsatCount++;
              break;
            case SAT:
              satCount++;
              break;
            case UNKNOWN:
              unknownCount++;
              break;
            default:
              break;
          }
        });
  
        return {
          label: name,
          data: [
            unsatCount,
            satCount,
            unknownCount,
          ],
          backgroundColor: [
            stringToColor(UNSAT),
            stringToColor(SAT),
            stringToColor(UNKNOWN),
          ],
          borderWidth: 2,
          showLine: true,
        };
      })
      .sort((a, b) => {
        // Trier les datasets en fonction du nombre total d'occurrences (somme des trois statuts)
        const totalOccurrencesA = a.data.reduce((sum, entry) => sum + entry, 0);
        const totalOccurrencesB = b.data.reduce((sum, entry) => sum + entry, 0);
        return totalOccurrencesB - totalOccurrencesA;
      })
      .slice(0, 10); // Sélectionner les 10 premiers solveurs
  
    // Configuration du graphique
    const ctx = document.getElementById('canvasprobleme');
    new Chart(ctx, {
      type: 'bar', 
      data: {
        labels: uniqueSolverNames,
        datasets: [
          {
            label: 'UNSAT',
            data: datasets.map(dataset => dataset.data[0]),
            backgroundColor: stringToColor(UNSAT),
            borderWidth: 2,
            showLine: true,
          },
          {
            label: 'SAT',
            data: datasets.map(dataset => dataset.data[1]),
            backgroundColor: stringToColor(SAT),
            borderWidth: 2,
            showLine: true,
          },
          {
            label: 'UNKNOWN',
            data: datasets.map(dataset => dataset.data[2]),
            backgroundColor: stringToColor(UNKNOWN),
            borderWidth: 2,
            showLine: true,
          },
        ],
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
              text: "Nombre d'occurrences",
            },
          },
        },
        plugins: {
          tooltip: {
            callbacks: {
              label: (context) => {
                const datasetLabel = context.dataset.label || '';
                const value = context.parsed.y;
                const index = context.dataIndex;
                const statusLabels = ['UNSAT', 'SAT', 'UNKNOWN'];
                const status = statusLabels[index];
                return `${datasetLabel}: ${value} (${status})`;
              },
            },
          },
        },
      },
    });
  }
  
// Appeler la fonction fetchData pour récupérer les données et mettre à jour le graphique
fetchData();
