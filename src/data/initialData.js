export const initialWeddingData = {
  couple: {
    groom: "Julián",
    bride: "Yanet",
    date: "2027-10-09T18:00:00",
    venue: "Palacio San Souci / Jardines de la Reina",
    address: "Av. Libertador 2450, San Fernando",
    totalBudget: 25000,
    currency: "USD"
  },
  
  // Listas de datos iniciadas de cero
  guests: [],

  tables: [
    { id: "t-novios", name: "Mesa Nupcial (Julián & Yanet)", capacity: 2, shape: "presidential", x: 380, y: 50, color: "#67001A" }
  ],

  tasks: [],

  budgetItems: [],

  vendors: [],

  photos: [],

  songs: [],

  honeymoon: {
    destination: "Neuquén, Patagonia Argentina",
    dates: "Octubre 2027",
    budget: 5000,
    description: "Ruta de los Siete Lagos, bodegas patagónicas y paisajes andinos de ensueño.",
    items: []
  }
};
