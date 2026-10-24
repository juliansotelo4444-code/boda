export const initialWeddingData = {
  couple: {
    groom: "Julián",
    bride: "Yanet",
    date: "2027-10-09T18:00:00",
    venue: "Palacio San Souci / Jardines de la Reina",
    address: "Av. Libertador 2450, San Fernando",
    totalBudget: 25000,
    currency: "USD",
    avatarUrl: "/assets/couple.jpg",
    heroImageUrl: "/assets/hero-bg.jpg"
  },
  
  // Listas de datos iniciadas de cero
  guests: [],

  tables: [
    { id: "t-novios", name: "Mesa Nupcial (Julián & Yanet)", capacity: 2, shape: "presidential", x: 380, y: 50, color: "#67001A" },
    { id: "t-fam1", name: "Familia Julián", capacity: 10, shape: "round", x: 180, y: 180, color: "#800020" },
    { id: "t-fam2", name: "Familia Yanet", capacity: 10, shape: "round", x: 580, y: 180, color: "#800020" }
  ],

  tasks: [],

  budgetItems: [],

  vendors: [],

  photos: [],

  songs: [],

  // Módulo Banquete & Menú Gastronómico (3 Pasos + Mesa Dulce + Trasnoche)
  catering: {
    format: "Catering de 3 pasos (Recepción / Entrada, Plato Principal y Postre) + Mesa Dulce y Fin de fiesta",
    cocktail: [
      { id: "c1", title: "Cazuelas de lomo braseado al malbec con papitas noisette", category: "Caliente" },
      { id: "c2", title: "Bruschettas de jamón crudo serrano, rúcula y brie", category: "Frío" },
      { id: "c3", title: "Empanaditas de cordero patagónico cortado a cuchillo", category: "Caliente" },
      { id: "c4", title: "Shots de ceviche fresco de lenguado y mango", category: "Gourmet" }
    ],
    mainCourses: [
      { id: "m1", title: "Ojo de bife en cocción lenta al Malbec con gratén de papas trufadas", type: "Tradicional" },
      { id: "m2", title: "Salmón rosado con costra crocante de almendras y puré rústico", type: "Pescado" },
      { id: "m3", title: "Risotto de hongos de pino y vegetales asados", type: "Vegetariano / Vegano" },
      { id: "m4", title: "Milanesitas de lomo con papas bastón", type: "Menú Infantil" }
    ],
    desserts: [
      { id: "d1", title: "Volcán de chocolate belga tibio con helado artesanal de crema y coulis de frutos rojos" }
    ],
    sweetTable: [
      { id: "s1", title: "Torta Nupcial de Julián & Yanet (Red Velvet y Buttercream de vainilla)" },
      { id: "s2", title: "Minitartas: Lemon pie, Cabsha de dulce de leche, Cheesecake de maracuyá" },
      { id: "s3", title: "Rogel tradicional con dulce de leche repostero y merengue italiano" }
    ],
    lateNight: [
      { id: "ln1", title: "Mini burgers gourmet con panceta crocante y dip de cheddar fundido" },
      { id: "ln2", title: "Pizzas artesanales a la pala de muzzarella, rúcula y fugazzeta" }
    ],
    openBar: [
      { id: "ob1", title: "Barra Libre Premium: Gin Tonic de autor, Aperol Spritz, Fernet Branca, Mojitos" },
      { id: "ob2", title: "Vinos Reserva Malbec & Chardonnay y Espumante Extra Brut para el Brindis" }
    ]
  },

  honeymoon: {
    destination: "Neuquén, Patagonia Argentina",
    dates: "Octubre 2027",
    budget: 5000,
    description: "Ruta de los Siete Lagos, Villa La Angostura, San Martín de los Andes, bodegas y paisajes cordilleranos.",
    items: [
      { id: "h1", type: "Vuelo", title: "Vuelos ida y vuelta Buenos Aires ↔ San Martín de los Andes", cost: 950, status: "Planificado", dates: "12 Oct 2027" },
      { id: "h2", type: "Alquiler Auto", title: "Alquiler de camioneta 4x4 para Ruta de los 7 Lagos (7 días)", cost: 800, status: "Planificado", dates: "12 - 19 Oct 2027" },
      { id: "h3", type: "Hotel", title: "Reserva Hotel Boutique con vista al Lago Nahuel Huapi", cost: 1600, status: "Planificado", dates: "12 - 16 Oct 2027" },
      { id: "h4", type: "Actividad", title: "Almuerzo y degustación en Bodega del Fin del Mundo (San Patricio del Chañar)", cost: 350, status: "Planificado", dates: "17 Oct 2027" },
      { id: "h5", type: "Actividad", title: "Navegación lacustre en velero y spa de montaña para dos", cost: 450, status: "Planificado", dates: "18 Oct 2027" }
    ]
  }
};
