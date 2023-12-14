import Chart from 'chart.js/auto';

// Variables pour stocker le solveur actuel et l'élément h1
let currentSolver = 'choco';
const pourcentageh1 = document.querySelector('.pourcentage');

// Fonction pour récupérer les données du fichier JSON
async function fetchData() {
  const url = "https://www.cril.univ-artois.fr/~lecoutre/teaching/jssae/code5/results.json";

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error('Erreur lors de la récupération des données');
    }

    const data = await response.json();
    console.log(data[2].data);
    updateChart(data);

  } catch (error) {
    console.error('Error fetching or parsing JSON:', error.message);
  }
}

// Fonction pour mettre à jour le graphique avec de nouvelles données
function updateChart(data) {
  const ctx = document.getElementById('canvaspourcentage');

  // Filtrer les noms de solveurs en fonction du solveur actuel
  const filteredData = data[2].data.filter(item =>
    item.name.toLowerCase().startsWith(currentSolver)
  );

  // Compter les occurrences de SAT, UNSAT et UNKNOWN
  const satCount = filteredData.filter(item => item.status === 'SAT').length;
  const unsatCount = filteredData.filter(item => item.status === 'UNSAT').length;
  const unknownCount = filteredData.filter(item => item.status === 'UNKNOWN').length;

  const totalCount = satCount + unsatCount + unknownCount;

  // Calculer les pourcentages
  const satPercentage = (satCount / totalCount) * 100;
  const unsatPercentage = (unsatCount / totalCount) * 100;
  const unknownPercentage = (unknownCount / totalCount) * 100;

  // Détruire le graphique existant s'il existe
  Chart.getChart(ctx)?.destroy();

  // Créer un nouveau graphique avec les nouvelles données
  new Chart(ctx, {
    type: 'pie',
    data: {
      labels: ['SAT', 'UNSAT', 'UNKNOW'],
      datasets: [{
        data: [satPercentage, unsatPercentage, unknownPercentage],
        backgroundColor: ['#F2DCC9', '#2458BF', '#BF5934'],
        hoverOffset: 4
      }]
    }
  });


  // Mettre à jour le titre en fonction du solveur sélectionné
  pourcentageh1.textContent = "Pourcentage de : " + currentSolver + " (UNSAT, SAT, UNKNOW)";
}

// Écouter les clics sur les boutons et mettre à jour le solveur actuel
const ace = document.getElementById('ace');
const choco = document.getElementById('choco');
const picat = document.getElementById('picat');
const btd = document.getElementById('btd');
const cosoco = document.getElementById('cosoco');
const funscopcad = document.getElementById('funscopcad');
const funscopglue = document.getElementById('funscopglue');
const mistral = document.getElementById('mistral');
const sat4jcp = document.getElementById('sat4jcp');
const sat4jrs = document.getElementById('sat4jrs');


ace.addEventListener('click', function() {
  currentSolver = 'ace';
  fetchData(); // Rechargez le graphique avec les nouvelles données
});

choco.addEventListener('click', function() {
  currentSolver = 'choco';
  fetchData(); // Rechargez le graphique avec les nouvelles données
});

btd.addEventListener('click', function() {
  currentSolver = 'btd';
  fetchData(); // Rechargez le graphique avec les nouvelles données
});

picat.addEventListener('click', function() {
  currentSolver = 'picat';
  fetchData(); // Rechargez le graphique avec les nouvelles données
});

cosoco.addEventListener('click', function() {
  currentSolver = 'cosoco';
  fetchData(); // Rechargez le graphique avec les nouvelles données
});

funscopcad.addEventListener('click', function() {
  currentSolver = 'fun-scop-cad';
  fetchData(); // Rechargez le graphique avec les nouvelles données
});

funscopglue.addEventListener('click', function() {
  currentSolver = 'fun-scop-glue';
  fetchData(); // Rechargez le graphique avec les nouvelles données
});

mistral.addEventListener('click', function() {
  currentSolver = 'mistral';
  fetchData(); // Rechargez le graphique avec les nouvelles données
});

sat4jcp.addEventListener('click', function() {
  currentSolver = 'sat4j-cp';
  fetchData(); // Rechargez le graphique avec les nouvelles données
});

sat4jrs.addEventListener('click', function() {
  currentSolver = 'sat4j-rs';
  fetchData(); // Rechargez le graphique avec les nouvelles données
});

// Appeler la fonction fetchData pour récupérer les données et mettre à jour le graphique
fetchData();
