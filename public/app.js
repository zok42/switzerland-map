// Game and Map State
let playerName = '';
let gameMode = 'schweiz'; // 'schweiz' or 'kanton'
let selectedCantonAbbr = 'ZH'; // Active canton in canton mode
let points = 0;
let totalQuestions = 0;
let streak = 0;
let currentQuestion = null; // { type: 'canton'|'city'|'lake'|'river', id: ... , name: ... }

// Map variables
let map = null;
let cantonGeoJsonLayer = null;
let lakeGeoJsonLayer = null;
let districtGeoJsonLayer = null;
let riverLayersGroup = L.layerGroup();
let cityLayersGroup = L.layerGroup();

// Static Datasets
const CANTONS = {
  1: { abbr: 'ZH', name: 'Zürich', capital: 'Zürich', neighbors: ['AG', 'SH', 'TG', 'SG', 'SZ', 'ZG'], wappen: 'Zürich' },
  2: { abbr: 'BE', name: 'Bern', capital: 'Bern', neighbors: ['JU', 'SO', 'AG', 'LU', 'OW', 'UR', 'VS', 'VD', 'FR', 'NE'], wappen: 'Bern' },
  3: { abbr: 'LU', name: 'Luzern', capital: 'Luzern', neighbors: ['BE', 'AG', 'ZG', 'SZ', 'NW', 'OW'], wappen: 'Luzern' },
  4: { abbr: 'UR', name: 'Uri', capital: 'Altdorf', neighbors: ['SZ', 'GL', 'GR', 'TI', 'VS', 'BE', 'OW', 'NW'], wappen: 'Uri' },
  5: { abbr: 'SZ', name: 'Schwyz', capital: 'Schwyz', neighbors: ['ZH', 'SG', 'GL', 'UR', 'NW', 'LU', 'ZG'], wappen: 'Schwyz' },
  6: { abbr: 'OW', name: 'Obwalden', capital: 'Sarnen', neighbors: ['LU', 'NW', 'UR', 'BE'], wappen: 'Obwalden' },
  7: { abbr: 'NW', name: 'Nidwalden', capital: 'Stans', neighbors: ['LU', 'OW', 'UR', 'SZ'], wappen: 'Nidwalden' },
  8: { abbr: 'GL', name: 'Glarus', capital: 'Glarus', neighbors: ['SZ', 'SG', 'GR', 'UR'], wappen: 'Glarus' },
  9: { abbr: 'ZG', name: 'Zug', capital: 'Zug', neighbors: ['ZH', 'SZ', 'LU', 'AG'], wappen: 'Zug' },
  10: { abbr: 'FR', name: 'Freiburg', capital: 'Fribourg', neighbors: ['VD', 'BE', 'NE'], wappen: 'Freiburg' },
  11: { abbr: 'SO', name: 'Solothurn', capital: 'Solothurn', neighbors: ['BL', 'AG', 'BE', 'JU'], wappen: 'Solothurn' },
  12: { abbr: 'BS', name: 'Basel-Stadt', capital: 'Basel', neighbors: ['BL'], wappen: 'Basel-Stadt' },
  13: { abbr: 'BL', name: 'Basel-Landschaft', capital: 'Liestal', neighbors: ['BS', 'AG', 'SO', 'JU'], wappen: 'Basel-Landschaft' },
  14: { abbr: 'SH', name: 'Schaffhausen', capital: 'Schaffhausen', neighbors: ['ZH', 'TG'], wappen: 'Schaffhausen' },
  15: { abbr: 'AR', name: 'Appenzell Ausserrhoden', capital: 'Herisau', neighbors: ['SG', 'AI'], wappen: 'Appenzell_Ausserrhoden' },
  16: { abbr: 'AI', name: 'Appenzell Innerrhoden', capital: 'Appenzell', neighbors: ['SG', 'AR'], wappen: 'Appenzell_Innerrhoden' },
  17: { abbr: 'SG', name: 'St. Gallen', capital: 'St. Gallen', neighbors: ['TG', 'ZH', 'SZ', 'GL', 'GR', 'AR', 'AI'], wappen: 'St._Gallen' },
  18: { abbr: 'GR', name: 'Graubünden', capital: 'Chur', neighbors: ['SG', 'GL', 'UR', 'TI'], wappen: 'Graubünden' },
  19: { abbr: 'AG', name: 'Aargau', capital: 'Aarau', neighbors: ['ZH', 'ZG', 'LU', 'BE', 'SO', 'BL'], wappen: 'Aargau' },
  20: { abbr: 'TG', name: 'Thurgau', capital: 'Frauenfeld', neighbors: ['SH', 'ZH', 'SG'], wappen: 'Thurgau' },
  21: { abbr: 'TI', name: 'Tessin', capital: 'Bellinzona', neighbors: ['VS', 'UR', 'GR'], wappen: 'Tessin' },
  22: { abbr: 'VD', name: 'Waadt', capital: 'Lausanne', neighbors: ['GE', 'FR', 'NE', 'BE', 'VS'], wappen: 'Waadt' },
  23: { abbr: 'VS', name: 'Valais', capital: 'Sion', neighbors: ['VD', 'BE', 'UR', 'TI'], wappen: 'Wallis' },
  24: { abbr: 'NE', name: 'Neuenburg', capital: 'Neuchâtel', neighbors: ['VD', 'FR', 'BE', 'JU'], wappen: 'Neuenburg' },
  25: { abbr: 'GE', name: 'Genf', capital: 'Geneva', neighbors: ['VD'], wappen: 'Genf' },
  26: { abbr: 'JU', name: 'Jura', capital: 'Delémont', neighbors: ['NE', 'BE', 'SO', 'BL'], wappen: 'Jura' }
};

const LAKES = {
  9326: { name: 'Bodensee', cantons: ['TG', 'SG', 'SH'] },
  9757: { name: 'Genfersee', cantons: ['GE', 'VD', 'VS'] },
  9151: { name: 'Neuenburgersee', cantons: ['NE', 'VD', 'FR', 'BE'] },
  9179: { name: 'Vierwaldstättersee', cantons: ['LU', 'UR', 'SZ', 'NW', 'OW'] },
  9050: { name: 'Zürichsee', cantons: ['ZH', 'SZ', 'SG'] },
  9073: { name: 'Thunersee', cantons: ['BE'] },
  9089: { name: 'Brienzersee', cantons: ['BE'] },
  9148: { name: 'Bielersee', cantons: ['BE', 'NE'] },
  9175: { name: 'Zugersee', cantons: ['ZG', 'SZ', 'LU'] },
  9267: { name: 'Walensee', cantons: ['SG', 'GL'] },
  9294: { name: 'Murtensee', cantons: ['FR', 'VD'] },
  9710: { name: 'Luganersee', cantons: ['TI'] },
  9711: { name: 'Lago Maggiore', cantons: ['TI'] },
  9163: { name: 'Sempachersee', cantons: ['LU'] },
  9172: { name: 'Hallwilersee', cantons: ['AG', 'LU'] },
  9040: { name: 'Greifensee', cantons: ['ZH'] },
  9216: { name: 'Sihlsee', cantons: ['SZ'] },
  9239: { name: 'Sarnersee', cantons: ['OW'] },
  9157: { name: 'Baldeggersee', cantons: ['LU'] },
  9751: { name: 'Lac de Joux', cantons: ['VD'] },
  9276: { name: 'Lac de la Gruyère', cantons: ['FR'] }
};

const CITIES = [
  { id: 101, name: 'Zürich', coords: [47.3769, 8.5417], canton: 'ZH' },
  { id: 102, name: 'Genf', coords: [46.2044, 6.1432], canton: 'GE' },
  { id: 103, name: 'Basel', coords: [47.5596, 7.5886], canton: 'BS' },
  { id: 104, name: 'Bern', coords: [46.9480, 7.4474], canton: 'BE' },
  { id: 105, name: 'Lausanne', coords: [46.5197, 6.6323], canton: 'VD' },
  { id: 106, name: 'Winterthur', coords: [47.5023, 8.7292], canton: 'ZH' },
  { id: 107, name: 'St. Gallen', coords: [47.4245, 9.3767], canton: 'SG' },
  { id: 108, name: 'Luzern', coords: [47.0502, 8.3089], canton: 'LU' },
  { id: 109, name: 'Lugano', coords: [46.0037, 8.9511], canton: 'TI' },
  { id: 110, name: 'Biel/Bienne', coords: [47.1368, 7.2468], canton: 'BE' },
  { id: 111, name: 'Thun', coords: [46.7512, 7.6217], canton: 'BE' },
  { id: 112, name: 'Bellinzona', coords: [46.1916, 9.0232], canton: 'TI' },
  { id: 113, name: 'Sion', coords: [46.2331, 7.3606], canton: 'VS' },
  { id: 114, name: 'Chur', coords: [46.8508, 9.5320], canton: 'GR' },
  { id: 115, name: 'Freiburg', coords: [46.8064, 7.1619], canton: 'FR' },
  { id: 116, name: 'Neuenburg', coords: [46.9900, 6.9293], canton: 'NE' },
  { id: 117, name: 'Schaffhausen', coords: [47.6973, 8.6349], canton: 'SH' },
  { id: 118, name: 'Solothurn', coords: [47.2088, 7.5323], canton: 'SO' },
  { id: 119, name: 'Aarau', coords: [47.3925, 8.0442], canton: 'AG' },
  { id: 120, name: 'Frauenfeld', coords: [47.5562, 8.8988], canton: 'TG' },
  { id: 121, name: 'Delémont', coords: [47.3639, 7.3435], canton: 'JU' },
  { id: 122, name: 'Liestal', coords: [47.4841, 7.7348], canton: 'BL' },
  { id: 123, name: 'Altdorf', coords: [46.8816, 8.6441], canton: 'UR' },
  { id: 124, name: 'Schwyz', coords: [47.0208, 8.6531], canton: 'SZ' },
  { id: 125, name: 'Sarnen', coords: [46.8961, 8.2458], canton: 'OW' },
  { id: 126, name: 'Stans', coords: [46.9582, 8.3659], canton: 'NW' },
  { id: 127, name: 'Glarus', coords: [47.0405, 9.0680], canton: 'GL' },
  { id: 128, name: 'Appenzell', coords: [47.3308, 9.4095], canton: 'AI' },
  { id: 129, name: 'Herisau', coords: [47.3863, 9.2792], canton: 'AR' },
  // Extra important cities & towns (Orte) for each canton
  { id: 301, name: 'Uster', coords: [47.3489, 8.7214], canton: 'ZH' },
  { id: 302, name: 'Bülach', coords: [47.5201, 8.5414], canton: 'ZH' },
  { id: 303, name: 'Horgen', coords: [47.2608, 8.5958], canton: 'ZH' },
  { id: 304, name: 'Dietikon', coords: [47.4061, 8.4042], canton: 'ZH' },
  { id: 305, name: 'Interlaken', coords: [46.6863, 7.8632], canton: 'BE' },
  { id: 306, name: 'Burgdorf', coords: [47.0572, 7.6253], canton: 'BE' },
  { id: 307, name: 'Emmen', coords: [47.0781, 8.3032], canton: 'LU' },
  { id: 308, name: 'Sursee', coords: [47.1724, 8.1091], canton: 'LU' },
  { id: 309, name: 'Erstfeld', coords: [46.8229, 8.6496], canton: 'UR' },
  { id: 310, name: 'Andermatt', coords: [46.6346, 8.5947], canton: 'UR' },
  { id: 311, name: 'Einsiedeln', coords: [47.1286, 8.7491], canton: 'SZ' },
  { id: 312, name: 'Küssnacht', coords: [47.0833, 8.4411], canton: 'SZ' },
  { id: 313, name: 'Engelberg', coords: [46.8203, 8.4025], canton: 'OW' },
  { id: 314, name: 'Hergiswil', coords: [46.9839, 8.3117], canton: 'NW' },
  { id: 315, name: 'Näfels', coords: [47.1000, 9.0667], canton: 'GL' },
  { id: 316, name: 'Baar', coords: [47.1951, 8.5258], canton: 'ZG' },
  { id: 317, name: 'Cham', coords: [47.1821, 8.4589], canton: 'ZG' },
  { id: 318, name: 'Bulle', coords: [46.6174, 7.0583], canton: 'FR' },
  { id: 319, name: 'Murten', coords: [46.9276, 7.1171], canton: 'FR' },
  { id: 320, name: 'Olten', coords: [47.3524, 7.9014], canton: 'SO' },
  { id: 321, name: 'Grenchen', coords: [47.1931, 7.3972], canton: 'SO' },
  { id: 322, name: 'Riehen', coords: [47.5847, 7.6491], canton: 'BS' },
  { id: 323, name: 'Allschwil', coords: [47.5511, 7.5358], canton: 'BL' },
  { id: 324, name: 'Reinach', coords: [47.4925, 7.5891], canton: 'BL' },
  { id: 325, name: 'Stein am Rhein', coords: [47.6591, 8.8591], canton: 'SH' },
  { id: 326, name: 'Neuhausen', coords: [47.6833, 8.6167], canton: 'SH' },
  { id: 327, name: 'Teufen', coords: [47.3917, 9.3886], canton: 'AR' },
  { id: 328, name: 'Oberegg', coords: [47.4222, 9.5511], canton: 'AI' },
  { id: 329, name: 'Wil', coords: [47.4644, 9.0494], canton: 'SG' },
  { id: 330, name: 'Rapperswil-Jona', coords: [47.2253, 8.8258], canton: 'SG' },
  { id: 331, name: 'Sargans', coords: [47.0491, 9.4391], canton: 'SG' },
  { id: 332, name: 'Davos', coords: [46.7931, 9.8214], canton: 'GR' },
  { id: 333, name: 'St. Moritz', coords: [46.4908, 9.8355], canton: 'GR' },
  { id: 334, name: 'Scuol', coords: [46.7967, 10.2991], canton: 'GR' },
  { id: 335, name: 'Wettingen', coords: [47.4658, 8.3283], canton: 'AG' },
  { id: 336, name: 'Baden', coords: [47.4736, 8.2774], canton: 'AG' },
  { id: 337, name: 'Zofingen', coords: [47.2886, 7.9458], canton: 'AG' },
  { id: 338, name: 'Rheinfelden', coords: [47.5544, 7.7917], canton: 'AG' },
  { id: 339, name: 'Kreuzlingen', coords: [47.6458, 9.1783], canton: 'TG' },
  { id: 340, name: 'Arbon', coords: [47.5147, 9.4358], canton: 'TG' },
  { id: 341, name: 'Locarno', coords: [46.1683, 8.7991], canton: 'TI' },
  { id: 342, name: 'Mendrisio', coords: [45.8711, 8.9858], canton: 'TI' },
  { id: 343, name: 'Chiasso', coords: [45.8344, 9.0306], canton: 'TI' },
  { id: 344, name: 'Yverdon-les-Bains', coords: [46.7783, 6.6411], canton: 'VD' },
  { id: 345, name: 'Montreux', coords: [46.4311, 6.9106], canton: 'VD' },
  { id: 346, name: 'Nyon', coords: [46.3833, 6.2414], canton: 'VD' },
  { id: 347, name: 'Martigny', coords: [46.1017, 7.0758], canton: 'VS' },
  { id: 348, name: 'Brig-Glis', coords: [46.3153, 7.9886], canton: 'VS' },
  { id: 349, name: 'Zermatt', coords: [46.0208, 7.7491], canton: 'VS' },
  { id: 350, name: 'La Chaux-de-Fonds', coords: [47.1008, 6.8317], canton: 'NE' },
  { id: 351, name: 'Le Locle', coords: [47.0544, 6.7491], canton: 'NE' },
  { id: 352, name: 'Lancy', coords: [46.1833, 6.1167], canton: 'GE' },
  { id: 353, name: 'Meyrin', coords: [46.2331, 6.0791], canton: 'GE' },
  { id: 354, name: 'Porrentruy', coords: [47.4167, 7.0833], canton: 'JU' },
  { id: 355, name: 'Saignelégier', coords: [47.2578, 6.9931], canton: 'JU' }
];

const RIVERS = [
  {
    id: 201,
    name: 'Rhein',
    coords: [[46.85, 9.53], [47.05, 9.50], [47.25, 9.60], [47.45, 9.65], [47.60, 9.00], [47.66, 8.60], [47.58, 8.20], [47.56, 7.59]],
    cantons: ['GR', 'SG', 'TG', 'SH', 'ZH', 'AG', 'BL', 'BS']
  },
  {
    id: 202,
    name: 'Aare',
    coords: [[46.65, 8.35], [46.73, 8.00], [46.75, 7.63], [46.95, 7.44], [47.10, 7.30], [47.20, 7.53], [47.35, 7.90], [47.45, 8.15], [47.60, 8.22]],
    cantons: ['BE', 'SO', 'AG']
  },
  {
    id: 203,
    name: 'Rhône',
    coords: [[46.56, 8.38], [46.40, 8.00], [46.22, 7.36], [46.10, 7.00], [46.35, 6.90], [46.45, 6.60], [46.20, 6.14]],
    cantons: ['VS', 'VD', 'GE']
  },
  {
    id: 204,
    name: 'Reuss',
    coords: [[46.60, 8.60], [46.88, 8.63], [47.05, 8.30], [47.25, 8.35], [47.48, 8.24]],
    cantons: ['UR', 'SZ', 'NW', 'LU', 'ZG', 'AG']
  },
  {
    id: 205,
    name: 'Limmat',
    coords: [[47.25, 8.75], [47.37, 8.54], [47.48, 8.31]],
    cantons: ['ZH', 'AG', 'SZ']
  },
  {
    id: 206,
    name: 'Ticino',
    coords: [[46.50, 8.55], [46.32, 8.80], [46.19, 8.93], [45.95, 8.75]],
    cantons: ['TI']
  },
  {
    id: 207,
    name: 'Inn',
    coords: [[46.38, 9.75], [46.60, 10.05], [46.85, 10.45]],
    cantons: ['GR']
  },
  {
    id: 208,
    name: 'Thur',
    coords: [[47.20, 9.30], [47.30, 9.15], [47.45, 9.05], [47.55, 9.15], [47.58, 8.90], [47.59, 8.60]],
    cantons: ['SG', 'TG', 'ZH']
  },
  {
    id: 209,
    name: 'Broye',
    coords: [[46.55, 6.85], [46.70, 6.80], [46.85, 6.95], [46.93, 7.05]],
    cantons: ['FR', 'VD']
  },
  {
    id: 210,
    name: 'Saane / Sarine',
    coords: [[46.35, 7.25], [46.48, 7.15], [46.65, 7.10], [46.80, 7.16], [46.95, 7.25]],
    cantons: ['VS', 'BE', 'FR', 'VD']
  },
  {
    id: 211,
    name: 'Linth',
    coords: [[46.85, 9.00], [47.05, 9.07], [47.18, 8.98]],
    cantons: ['GL', 'SZ', 'SG']
  },
  {
    id: 212,
    name: 'Doubs',
    coords: [[47.05, 6.70], [47.25, 6.90], [47.38, 7.15]],
    cantons: ['NE', 'JU']
  },
  {
    id: 213,
    name: 'Sihl',
    coords: [[47.05, 8.85], [47.15, 8.75], [47.25, 8.55], [47.37, 8.53]],
    cantons: ['SZ', 'ZG', 'ZH']
  },
  {
    id: 214,
    name: 'Emme',
    coords: [[46.80, 7.95], [46.95, 7.75], [47.10, 7.60], [47.22, 7.57]],
    cantons: ['BE', 'SO']
  },
  {
    id: 215,
    name: 'Birs',
    coords: [[47.20, 7.25], [47.35, 7.40], [47.45, 7.45], [47.55, 7.60]],
    cantons: ['BE', 'JU', 'SO', 'BL', 'BS']
  }
];

const DISTRICTS = {
  // ZH
  101: "Bezirk Affoltern", 102: "Bezirk Andelfingen", 103: "Bezirk Bülach", 104: "Bezirk Dielsdorf", 111: "Bezirk Dietikon", 105: "Bezirk Hinwil", 106: "Bezirk Horgen", 107: "Bezirk Meilen", 108: "Bezirk Pfäffikon", 109: "Bezirk Uster", 110: "Bezirk Winterthur", 112: "Bezirk Zürich",
  // BE
  241: "Verwaltungskreis Berner Jura", 242: "Verwaltungskreis Biel/Bienne", 243: "Verwaltungskreis Seeland", 244: "Verwaltungskreis Oberaargau", 245: "Verwaltungskreis Emmental", 246: "Verwaltungskreis Bern-Mittelland", 247: "Verwaltungskreis Thun", 248: "Verwaltungskreis Obersimmental-Saanen", 249: "Verwaltungskreis Frutigen-Niedersimmental", 250: "Verwaltungskreis Interlaken-Oberhasli",
  // LU
  311: "Wahlkreis Entlebuch", 312: "Wahlkreis Hochdorf", 313: "Wahlkreis Luzern-Land", 314: "Wahlkreis Luzern-Stadt", 315: "Wahlkreis Sursee", 316: "Wahlkreis Willisau",
  // UR
  400: "Kanton Uri",
  // SZ
  501: "Bezirk Einsiedeln", 502: "Bezirk Gersau", 503: "Bezirk Höfe", 504: "Bezirk Küssnacht", 505: "Bezirk March", 506: "Bezirk Schwyz",
  // OW
  600: "Kanton Obwalden",
  // NW
  700: "Kanton Nidwalden",
  // GL
  800: "Kanton Glarus",
  // ZG
  900: "Kanton Zug",
  // FR
  1001: "District de la Broye", 1002: "District de la Glâne", 1003: "District de la Gruyère", 1004: "District de la Sarine", 1005: "District du Lac / Seebezirk", 1006: "Bezirk Sense", 1007: "District de la Veveyse",
  // SO
  1101: "Bezirk Bucheggberg", 1102: "Bezirk Dorneck", 1103: "Bezirk Gäu", 1104: "Bezirk Gösgen", 1105: "Bezirk Lebern", 1106: "Bezirk Olten", 1107: "Bezirk Solothurn", 1108: "Bezirk Thal", 1109: "Bezirk Thierstein", 1110: "Bezirk Wasseramt",
  // BS
  1200: "Kanton Basel-Stadt",
  // BL
  1301: "Bezirk Arlesheim", 1302: "Bezirk Laufen", 1303: "Bezirk Liestal", 1304: "Bezirk Sissach", 1305: "Bezirk Waldenburg",
  // SH
  1400: "Kanton Schaffhausen",
  // AR
  1500: "Kanton Appenzell Ausserrhoden",
  // AI
  1600: "Kanton Appenzell Innerrhoden",
  // SG
  1721: "Wahlkreis Rheintal", 1722: "Wahlkreis Rorschach", 1723: "Wahlkreis Sarganserland", 1724: "Wahlkreis See-Gaster", 1725: "Wahlkreis St. Gallen", 1726: "Wahlkreis Toggenburg", 1727: "Wahlkreis Werdenberg", 1728: "Wahlkreis Wil",
  // GR
  1841: "Region Albula", 1842: "Region Bernina", 1843: "Region Engiadina Bassa/Val Müstair", 1844: "Region Imboden", 1845: "Region Landquart", 1846: "Region Maloja", 1847: "Region Moesa", 1848: "Region Plessur", 1849: "Region Prättigau/Davos", 1850: "Region Surselva", 1851: "Region Viamala",
  // AG
  1901: "Bezirk Aarau", 1902: "Bezirk Baden", 1903: "Bezirk Bremgarten", 1904: "Bezirk Brugg", 1905: "Bezirk Kulm", 1906: "Bezirk Laufenburg", 1907: "Bezirk Lenzburg", 1908: "Bezirk Muri", 1909: "Bezirk Rheinfelden", 1910: "Bezirk Zofingen", 1911: "Bezirk Zurzach",
  // TG
  2011: "Bezirk Arbon", 2012: "Bezirk Frauenfeld", 2013: "Bezirk Kreuzlingen", 2014: "Bezirk Münchwilen", 2015: "Bezirk Weinfelden",
  // TI
  2101: "Distretto di Bellinzona", 2102: "Distretto di Blenio", 2103: "Distretto di Leventina", 2104: "Distretto di Locarno", 2105: "Distretto di Lugano", 2106: "Distretto di Mendrisio", 2107: "Distretto di Riviera", 2108: "Distretto di Vallemaggia",
  // VD
  2221: "District d'Aigle", 2222: "District de la Broye-Vully", 2223: "District du Gros-de-Vaud", 2224: "District du Jura-Nord vaudois", 2225: "District de Lausanne", 2226: "District de Lavaux-Oron", 2227: "District de Morges", 2228: "District de Nyon", 2229: "District de l'Ouest lausannois", 2230: "District de la Riviera-Pays-d'Enhaut",
  // VS
  2301: "Bezirk Goms", 2302: "Halbbezirk Östlich Raron", 2303: "Bezirk Brig", 2304: "Bezirk Visp", 2305: "Halbbezirk Westlich Raron", 2306: "Bezirk Leuk", 2307: "Bezirk Siders", 2308: "District de Sion", 2309: "District de Conthey", 2310: "District d'Hérens", 2311: "District d'Entremont", 2312: "District de Martigny", 2313: "District de Saint-Maurice", 2314: "District de Monthey",
  // NE
  2400: "Kanton Neuchâtel",
  // GE
  2500: "Kanton Genève",
  // JU
  2601: "District de Delémont", 2602: "District des Franches-Montagnes", 2603: "District de Porrentruy"
};

// Elements Lookup DOM
const btnModeSchweiz = document.getElementById('btn-mode-schweiz');
const btnModeKanton = document.getElementById('btn-mode-kanton');
const btnModeWappen = document.getElementById('btn-mode-wappen');
const cantonSelectWrapper = document.getElementById('canton-select-wrapper');
const cantonSelector = document.getElementById('canton-selector');

const targetTypeBadge = document.getElementById('target-type-badge');
const targetPrompt = document.getElementById('target-prompt');
const wappenContainer = document.getElementById('wappen-container');
const wappenImage = document.getElementById('wappen-image');
const statPoints = document.getElementById('stat-points');
const statTotal = document.getElementById('stat-total');
const statAccuracy = document.getElementById('stat-accuracy');
const statStreak = document.getElementById('stat-streak');
const skipQuestionBtn = document.getElementById('skip-question');
const resetStatsBtn = document.getElementById('reset-stats');
const guessLog = document.getElementById('guess-log');

// Layer visibility filters
const chkFilterCanton = document.getElementById('chk-filter-canton');
const chkFilterDistrict = document.getElementById('chk-filter-district');
const chkFilterCity = document.getElementById('chk-filter-city');
const chkFilterLake = document.getElementById('chk-filter-lake');
const chkFilterRiver = document.getElementById('chk-filter-river');

// Initial setup of Map
function initMap() {
  // Center of Switzerland is roughly 46.8182, 8.2275
  map = L.map('map', {
    zoomControl: true,
    minZoom: 7,
    maxZoom: 12,
    attributionControl: false
  }).setView([46.8182, 8.2275], 8);

  // Google Maps (Roadmap basemap without labels/city names to keep the quiz challenging)
  L.tileLayer('https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}&apistyle=s.t%3A0%7Cs.e%3Al%7Cp.v%3Aoff', {
    maxZoom: 19,
    attribution: '&copy; Google'
  }).addTo(map);

  riverLayersGroup.addTo(map);
  cityLayersGroup.addTo(map);

  // Load the boundary geodata from TopoJSON
  loadGeodata();
}

// Fetch boundary data of cantons and lakes from swiss-maps NPM CDN
async function loadGeodata() {
  try {
    const response = await fetch('https://unpkg.com/swiss-maps@4/2021/ch-combined.json');
    if (!response.ok) throw new Error('Network error loading map boundaries.');
    const topo = await response.json();

    // Decode cantons topojson
    const cantonsData = topojson.feature(topo, topo.objects.cantons);
    // Decode lakes topojson
    const lakesData = topojson.feature(topo, topo.objects.lakes);
    // Decode districts topojson
    const districtsData = topojson.feature(topo, topo.objects.districts);

    // Style cantons
    cantonGeoJsonLayer = L.geoJSON(cantonsData, {
      style: cantonStyle,
      onEachFeature: onEachCantonFeature
    }).addTo(map);

    // Style districts (visible and styled uniquely in Canton Mode)
    districtGeoJsonLayer = L.geoJSON(districtsData, {
      style: districtStyle,
      onEachFeature: onEachDistrictFeature
    });

    // Style lakes
    lakeGeoJsonLayer = L.geoJSON(lakesData, {
      style: lakeStyle,
      onEachFeature: onEachLakeFeature
    }).addTo(map);

    // Render cities and rivers
    drawRivers();
    drawCities();

    // Setup canton selector options
    populateCantonSelector();

    // Start first question
    generateQuestion();

  } catch (err) {
    console.error('Error loading boundaries:', err);
    alert('Fehler beim Laden der Schweizer Landkartendaten. Bitte lade die Seite neu.');
  }
}

// Styling Functions
function cantonStyle(feature) {
  const isCantonMode = gameMode === 'kanton';
  const cId = feature.id;
  const cMeta = CANTONS[cId];
  
  if (isCantonMode && cMeta) {
    const activeCantonMeta = Object.values(CANTONS).find(c => c.abbr === selectedCantonAbbr);
    if (cMeta.abbr === selectedCantonAbbr) {
      return {
        fillColor: '#da291c', // Highlit active canton in beautiful Swiss red
        fillOpacity: 0.15,
        color: '#da291c',
        weight: 3.5,
        opacity: 0.95
      };
    } else if (activeCantonMeta && activeCantonMeta.neighbors.includes(cMeta.abbr)) {
      // Style neighbors nicely as candidates
      return {
        fillColor: '#4b5563', // Slate gray
        fillOpacity: 0.1,
        color: '#9ca3af',
        weight: 1.5,
        opacity: 0.6
      };
    } else {
      // Hide other non-relevant cantons slightly
      return {
        fillColor: '#111827',
        fillOpacity: 0.45,
        color: '#374151',
        weight: 0.8,
        opacity: 0.2
      };
    }
  }

  // Switzerland Map mode (default)
  return {
    fillColor: '#374151', // Sleek gray
    fillOpacity: 0.25,
    color: '#ffffff', // Clean white border
    weight: 1.2,
    opacity: 0.8
  };
}

function districtStyle(feature) {
  const isCantonMode = gameMode === 'kanton';
  const dId = feature.id;
  const cantonBfsId = Math.floor(dId / 100);
  const parentCantonMeta = CANTONS[cantonBfsId];
  
  if (isCantonMode && parentCantonMeta && parentCantonMeta.abbr === selectedCantonAbbr) {
    return {
      fillColor: '#da291c', // Standard red/warm color
      fillOpacity: 0.08,
      color: '#ffffff', // White dashed lines for district boundaries
      weight: 1.2,
      dashArray: '4, 4',
      opacity: 0.85
    };
  }

  // Completely transparent/invisible if not active in canton mode
  return {
    fillColor: '#000000',
    fillOpacity: 0,
    color: '#000000',
    weight: 0,
    opacity: 0
  };
}

function lakeStyle(feature) {
  const isCantonMode = gameMode === 'kanton';
  const lMeta = LAKES[feature.id];
  
  if (isCantonMode && lMeta) {
    if (lMeta.cantons.includes(selectedCantonAbbr)) {
      return {
        fillColor: '#0070c0', // Clean blue
        fillOpacity: 0.7,
        color: '#005a9c',
        weight: 1.5,
        opacity: 0.9
      };
    } else {
      return {
        fillColor: '#0070c0',
        fillOpacity: 0.08,
        color: '#005a9c',
        weight: 0.5,
        opacity: 0.15
      };
    }
  }

  return {
    fillColor: '#0070c0', // Clean blue
    fillOpacity: 0.6,
    color: '#005a9c',
    weight: 1,
    opacity: 0.8
  };
}

// Bind interactions to Canton layers
function onEachCantonFeature(feature, layer) {
  layer.on({
    mouseover: (e) => {
      const cMeta = CANTONS[feature.id];
      if (!cMeta) return;

      // Highlight style
      const hoverStyle = {
        fillOpacity: gameMode === 'kanton' ? 0.3 : 0.45,
        weight: gameMode === 'kanton' ? 4 : 2.5
      };
      layer.setStyle(hoverStyle);
    },
    mouseout: (e) => {
      if (cantonGeoJsonLayer) {
        cantonGeoJsonLayer.resetStyle(layer);
      }
    },
    click: (e) => {
      handleGuess('canton', feature.id, layer);
    }
  });
}

// Bind interactions to District layers
function onEachDistrictFeature(feature, layer) {
  layer.on({
    mouseover: (e) => {
      const isCantonMode = gameMode === 'kanton';
      const dId = feature.id;
      const cantonBfsId = Math.floor(dId / 100);
      const parentCantonMeta = CANTONS[cantonBfsId];
      
      if (isCantonMode && parentCantonMeta && parentCantonMeta.abbr === selectedCantonAbbr) {
        layer.setStyle({
          fillOpacity: 0.28,
          weight: 2
        });
      }
    },
    mouseout: (e) => {
      if (districtGeoJsonLayer) {
        districtGeoJsonLayer.resetStyle(layer);
      }
    },
    click: (e) => {
      const isCantonMode = gameMode === 'kanton';
      const dId = feature.id;
      const cantonBfsId = Math.floor(dId / 100);
      const parentCantonMeta = CANTONS[cantonBfsId];
      
      if (isCantonMode && parentCantonMeta && parentCantonMeta.abbr === selectedCantonAbbr) {
        handleGuess('district', feature.id, layer);
      }
    }
  });
}

// Bind interactions to Lake layers
function onEachLakeFeature(feature, layer) {
  layer.on({
    mouseover: (e) => {
      const lMeta = LAKES[feature.id];
      if (!lMeta) return;

      layer.setStyle({
        fillOpacity: 0.85,
        weight: 2
      });
    },
    mouseout: (e) => {
      if (lakeGeoJsonLayer) {
        lakeGeoJsonLayer.resetStyle(layer);
      }
    },
    click: (e) => {
      handleGuess('lake', feature.id, layer);
    }
  });
}

// Draw static cities of Switzerland as markers on the map
function drawCities() {
  cityLayersGroup.clearLayers();
  
  CITIES.forEach(city => {
    const isCantonMode = gameMode === 'kanton';
    let visible = true;
    
    if (isCantonMode && city.canton !== selectedCantonAbbr) {
      visible = false;
    }

    if (!visible) return;

    // Custom circle marker
    const marker = L.circleMarker(city.coords, {
      radius: 6,
      fillColor: '#ef4444', // Red dot for city
      fillOpacity: 0.85,
      color: '#ffffff',
      weight: 1.5,
      opacity: 0.95
    });

    marker.on({
      mouseover: (e) => {
        marker.setRadius(9);
        marker.setStyle({ fillColor: '#f43f5e' });
      },
      mouseout: (e) => {
        marker.setRadius(6);
        marker.setStyle({ fillColor: '#ef4444' });
      },
      click: (e) => {
        handleGuess('city', city.id, marker);
      }
    });

    cityLayersGroup.addLayer(marker);
  });
}

// Draw static rivers of Switzerland as polylines
function drawRivers() {
  riverLayersGroup.clearLayers();

  RIVERS.forEach(river => {
    const isCantonMode = gameMode === 'kanton';
    let visible = true;
    
    if (isCantonMode && !river.cantons.includes(selectedCantonAbbr)) {
      visible = false;
    }

    if (!visible) return;

    const polyline = L.polyline(river.coords, {
      color: '#0ea5e9', // Blue/sky river
      weight: 3.5,
      opacity: 0.75,
      lineCap: 'round',
      lineJoin: 'round'
    });

    polyline.on({
      mouseover: (e) => {
        polyline.setStyle({
          weight: 6,
          opacity: 0.95,
          color: '#38bdf8'
        });
      },
      mouseout: (e) => {
        polyline.setStyle({
          weight: 3.5,
          opacity: 0.75,
          color: '#0ea5e9'
        });
      },
      click: (e) => {
        handleGuess('river', river.id, polyline);
      }
    });

    riverLayersGroup.addLayer(polyline);
  });
}

// Dynamically generate the next random question based on game state
function generateQuestion() {
  let pool = [];

  const isCantonMode = gameMode === 'kanton';
  const isWappenMode = gameMode === 'wappen';

  if (isWappenMode) {
    // Only cantons with coats of arms
    Object.entries(CANTONS).forEach(([id, canton]) => {
      pool.push({
        type: 'canton',
        id: parseInt(id),
        name: canton.name,
        wappen: canton.wappen,
        prompt: `den Kanton von diesem Wappen`
      });
    });
  } else if (isCantonMode) {
    const activeCantonMeta = Object.values(CANTONS).find(c => c.abbr === selectedCantonAbbr);
    const neighbors = activeCantonMeta ? activeCantonMeta.neighbors : [];

    // Neighboring cantons pool
    neighbors.forEach(abbr => {
      const candidateCanton = Object.entries(CANTONS).find(([id, c]) => c.abbr === abbr);
      if (candidateCanton) {
        pool.push({
          type: 'canton',
          id: parseInt(candidateCanton[0]),
          name: candidateCanton[1].name,
          prompt: `den Nachbarkanton: ${candidateCanton[1].name}`
        });
      }
    });

    // Cities pool (only cities inside active canton)
    CITIES.forEach(city => {
      if (city.canton === selectedCantonAbbr) {
        pool.push({
          type: 'city',
          id: city.id,
          name: city.name,
          prompt: `die Stadt: ${city.name}`
        });
      }
    });

    // Lakes pool (only bordering or inside active canton)
    Object.entries(LAKES).forEach(([id, lake]) => {
      if (lake.cantons.includes(selectedCantonAbbr)) {
        pool.push({
          type: 'lake',
          id: parseInt(id),
          name: lake.name,
          prompt: `den See: ${lake.name}`
        });
      }
    });

    // Rivers pool (flowing through active canton)
    RIVERS.forEach(river => {
      if (river.cantons.includes(selectedCantonAbbr)) {
        pool.push({
          type: 'river',
          id: river.id,
          name: river.name,
          prompt: `den Fluss: ${river.name}`
        });
      }
    });

    // Districts pool (only belonging to the active canton)
    Object.entries(DISTRICTS).forEach(([id, name]) => {
      const cantonId = Math.floor(parseInt(id) / 100);
      const parentCanton = CANTONS[cantonId];
      if (parentCanton && parentCanton.abbr === selectedCantonAbbr) {
        pool.push({
          type: 'district',
          id: parseInt(id),
          name: name,
          prompt: `den Bezirk/Region: ${name}`
        });
      }
    });

  } else {
    // Switzerland mode (all items pool)
    
    // Add all cantons
    Object.entries(CANTONS).forEach(([id, canton]) => {
      pool.push({
        type: 'canton',
        id: parseInt(id),
        name: canton.name,
        prompt: `den Kanton: ${canton.name}`
      });
    });

    // Add all cities
    CITIES.forEach(city => {
      pool.push({
        type: 'city',
        id: city.id,
        name: city.name,
        prompt: `die Stadt: ${city.name}`
      });
    });

    // Add all lakes
    Object.entries(LAKES).forEach(([id, lake]) => {
      pool.push({
        type: 'lake',
        id: parseInt(id),
        name: lake.name,
        prompt: `den See: ${lake.name}`
      });
    });

    // Add all rivers
    RIVERS.forEach(river => {
      pool.push({
        type: 'river',
        id: river.id,
        name: river.name,
        prompt: `den Fluss: ${river.name}`
      });
    });
  }

  // Fallback if pool is empty
  if (pool.length === 0) {
    // Reset to include some elements or parent canton
    const activeCantonMeta = Object.values(CANTONS).find(c => c.abbr === selectedCantonAbbr);
    pool.push({
      type: 'canton',
      id: Object.keys(CANTONS).find(id => CANTONS[id].abbr === selectedCantonAbbr),
      name: activeCantonMeta ? activeCantonMeta.name : 'Zürich',
      prompt: `den Hauptkanton: ${activeCantonMeta ? activeCantonMeta.name : 'Zürich'}`
    });
  }

  // Prevent getting the exact same question as last time if pool has multiple options
  let selected = pool[Math.floor(Math.random() * pool.length)];
  if (currentQuestion && pool.length > 1) {
    while (selected.type === currentQuestion.type && selected.id === currentQuestion.id) {
      selected = pool[Math.floor(Math.random() * pool.length)];
    }
  }

  currentQuestion = selected;

  // Update prompt UI
  if (isWappenMode) {
    targetTypeBadge.textContent = 'Kanton-Wappen';
    targetPrompt.textContent = 'Finde diesen Kanton!';
    wappenImage.src = `https://commons.wikimedia.org/wiki/Special:FilePath/Wappen_${selected.wappen}_matt.svg?width=120`;
    wappenContainer.classList.remove('hidden');
    wappenContainer.classList.add('flex');
  } else {
    targetTypeBadge.textContent = selected.type === 'canton' ? (isCantonMode ? 'Nachbarkanton' : 'Kanton') : selected.type;
    targetPrompt.textContent = selected.name;
    wappenContainer.classList.remove('flex');
    wappenContainer.classList.add('hidden');
    wappenImage.src = '';
  }

  // Visual highlights
  targetPrompt.classList.add('scale-105', 'text-amber-300');
  setTimeout(() => {
    targetPrompt.classList.remove('scale-105', 'text-amber-300');
  }, 350);
}

// Verify guess and update score
function handleGuess(guessedType, guessedId, leafletElement) {
  if (!currentQuestion) return;

  totalQuestions++;

  const isCorrect = currentQuestion.type === guessedType && currentQuestion.id === guessedId;

  if (isCorrect) {
    points++;
    streak++;
    
    // Celebratory effect
    triggerCelebrate();
    addLogItem('correct', `Richtig! ${currentQuestion.name} gefunden.`);
    
    // Temporarily color element green
    flashElement(leafletElement, '#10b981'); // Emerald green

    // Highlight complete
    setTimeout(() => {
      generateQuestion();
    }, 1200);

  } else {
    // Incorrect guess
    streak = 0;
    
    let guessedName = 'Unbekannt';
    if (guessedType === 'canton' && CANTONS[guessedId]) guessedName = CANTONS[guessedId].name;
    else if (guessedType === 'lake' && LAKES[guessedId]) guessedName = LAKES[guessedId].name;
    else if (guessedType === 'district' && DISTRICTS[guessedId]) guessedName = DISTRICTS[guessedId];
    else if (guessedType === 'city') guessedName = CITIES.find(c => c.id === guessedId)?.name || 'Stadt';
    else if (guessedType === 'river') guessedName = RIVERS.find(r => r.id === guessedId)?.name || 'Fluss';

    addLogItem('wrong', `Falsch! Das war ${guessedName} (gesucht war ${currentQuestion.name}).`);
    flashElement(leafletElement, '#ef4444'); // Soft red

    // Keep active question, they can try again! Or they can skip.
  }

  updateStatsUI();
}

// Quick flash element color
function flashElement(layer, color) {
  if (!layer) return;
  
  if (layer.setStyle) {
    const originalStyle = { ...layer.options };
    layer.setStyle({
      fillColor: color,
      color: color,
      fillOpacity: 0.8,
      weight: 4
    });
    
    setTimeout(() => {
      if (layer.resetStyle) {
        // Redraw correctly
        if (layer.options.id && CANTONS[layer.options.id]) {
          cantonGeoJsonLayer.resetStyle(layer);
        } else if (layer.options.id && LAKES[layer.options.id]) {
          lakeGeoJsonLayer.resetStyle(layer);
        } else if (layer.options.id && DISTRICTS[layer.options.id]) {
          districtGeoJsonLayer.resetStyle(layer);
        } else {
          layer.setStyle(originalStyle);
        }
      } else {
        layer.setStyle(originalStyle);
      }
    }, 1000);
  }
}

// Confetti celebrate using canvas-confetti library
function triggerCelebrate() {
  confetti({
    particleCount: 80,
    spread: 60,
    origin: { y: 0.8 },
    colors: ['#da291c', '#ffffff', '#0070c0'] // Red, White, Blue Swiss colors
  });
}

// Add history item to guess log
function addLogItem(status, message) {
  const item = document.createElement('div');
  item.className = `p-2.5 rounded-lg text-xs flex items-start space-x-2 bg-gray-800/80 border border-gray-700 animate-fadeIn ${
    status === 'correct' ? 'log-item-correct' : status === 'wrong' ? 'log-item-wrong' : 'log-item-skip'
  }`;
  
  let icon = '<i class="fa-solid fa-circle-check text-emerald-400 mt-0.5"></i>';
  if (status === 'wrong') icon = '<i class="fa-solid fa-circle-xmark text-red-400 mt-0.5"></i>';
  if (status === 'skip') icon = '<i class="fa-solid fa-circle-right text-amber-400 mt-0.5"></i>';

  item.innerHTML = `
    ${icon}
    <div class="flex-1">
      <p class="font-medium text-gray-200">${message}</p>
      <span class="text-[9px] text-gray-500">${new Date().toLocaleTimeString()}</span>
    </div>
  `;

  // Remove empty placeholder
  if (guessLog.querySelector('italic')) {
    guessLog.innerHTML = '';
  }

  // Remove placeholder if present
  if (guessLog.children.length > 0 && guessLog.children[0].classList.contains('italic')) {
    guessLog.removeChild(guessLog.children[0]);
  }

  guessLog.insertBefore(item, guessLog.firstChild);
}

// Update local UI labels and statistics counters
function updateStatsUI() {
  statPoints.textContent = points;
  statTotal.textContent = totalQuestions;
  
  const accuracy = totalQuestions > 0 ? Math.round((points / totalQuestions) * 100) : 0;
  statAccuracy.textContent = `${accuracy}%`;
  statStreak.textContent = streak;
}

// Fill options in Canton select menu
function populateCantonSelector() {
  cantonSelector.innerHTML = '';
  
  // Sort alphabetically
  const sortedCantons = Object.values(CANTONS).sort((a, b) => a.name.localeCompare(b.name));
  
  sortedCantons.forEach(c => {
    const opt = document.createElement('option');
    opt.value = c.abbr;
    opt.textContent = `${c.name} (${c.abbr})`;
    if (c.abbr === selectedCantonAbbr) opt.selected = true;
    cantonSelector.appendChild(opt);
  });
}

// Switch between Switzerland View, Canton View, and Wappen View
function switchViewMode(mode) {
  gameMode = mode;
  
  const activeClass = "py-2 px-2 rounded-lg font-bold text-xs transition-all focus:outline-none flex flex-col items-center justify-center space-y-1 bg-swissred text-white shadow-md shadow-red-900/20 border border-red-500/30";
  const inactiveClass = "py-2 px-2 rounded-lg font-bold text-xs transition-all focus:outline-none flex flex-col items-center justify-center space-y-1 bg-gray-700 hover:bg-gray-600 text-gray-300 border border-transparent";
  
  if (mode === 'schweiz') {
    btnModeSchweiz.className = activeClass;
    btnModeKanton.className = inactiveClass;
    btnModeWappen.className = inactiveClass;
    cantonSelectWrapper.classList.add('hidden');
    
    // Remove district layer so it doesn't block canton clicks!
    if (districtGeoJsonLayer) map.removeLayer(districtGeoJsonLayer);
    
    // Zoom back to full Switzerland view
    map.setView([46.8182, 8.2275], 8);
  } else if (mode === 'kanton') {
    btnModeKanton.className = activeClass;
    btnModeSchweiz.className = inactiveClass;
    btnModeWappen.className = inactiveClass;
    cantonSelectWrapper.classList.remove('hidden');
    
    // Add district layer in canton mode and manage layer order
    if (districtGeoJsonLayer && chkFilterDistrict.checked) {
      districtGeoJsonLayer.addTo(map);
      if (cantonGeoJsonLayer) cantonGeoJsonLayer.bringToBack();
      districtGeoJsonLayer.bringToBack();
    }
    
    // Focus map on current active Canton
    zoomToCanton(selectedCantonAbbr);
  } else {
    // wappen mode
    btnModeWappen.className = activeClass;
    btnModeSchweiz.className = inactiveClass;
    btnModeKanton.className = inactiveClass;
    cantonSelectWrapper.classList.add('hidden');
    
    // Remove district layer so it doesn't block canton clicks!
    if (districtGeoJsonLayer) map.removeLayer(districtGeoJsonLayer);
    
    // Zoom back to full Switzerland view so they can see all cantons for the wappen quiz
    map.setView([46.8182, 8.2275], 8);
  }

  // Redraw layers to accommodate active Canton filters
  if (cantonGeoJsonLayer) cantonGeoJsonLayer.resetStyle();
  if (lakeGeoJsonLayer) lakeGeoJsonLayer.resetStyle();
  if (districtGeoJsonLayer) districtGeoJsonLayer.resetStyle();
  drawRivers();
  drawCities();

  // Reset and start new question
  generateQuestion();
}

// Zoom and pan the Leaflet map to fit the selected canton boundaries
function zoomToCanton(cantonAbbr) {
  if (!cantonGeoJsonLayer) return;

  const cantonFeature = cantonGeoJsonLayer.getLayers().find(layer => {
    const cId = layer.feature.id;
    return CANTONS[cId] && CANTONS[cId].abbr === cantonAbbr;
  });

  if (cantonFeature) {
    map.fitBounds(cantonFeature.getBounds(), {
      padding: [40, 40],
      maxZoom: 10,
      animate: true,
      duration: 1.0
    });
  }
}

// Event Listeners setup
function setupEventListeners() {

  // Mode Selection click events
  btnModeSchweiz.addEventListener('click', () => switchViewMode('schweiz'));
  btnModeKanton.addEventListener('click', () => switchViewMode('kanton'));
  btnModeWappen.addEventListener('click', () => switchViewMode('wappen'));

  // Canton Select menu selection
  cantonSelector.addEventListener('change', (e) => {
    selectedCantonAbbr = e.target.value;
    zoomToCanton(selectedCantonAbbr);
    
    // Re-apply Canton filters to layers
    if (cantonGeoJsonLayer) cantonGeoJsonLayer.resetStyle();
    if (lakeGeoJsonLayer) lakeGeoJsonLayer.resetStyle();
    if (districtGeoJsonLayer) districtGeoJsonLayer.resetStyle();
    drawRivers();
    drawCities();

    generateQuestion();
  });

  // Question controls
  skipQuestionBtn.addEventListener('click', () => {
    addLogItem('skip', `Aufgabe übersprungen: ${currentQuestion.name}`);
    streak = 0;
    updateStatsUI();
    generateQuestion();
  });

  resetStatsBtn.addEventListener('click', () => {
    if (confirm('Möchtest du deinen Punktestand wirklich zurücksetzen?')) {
      points = 0;
      totalQuestions = 0;
      streak = 0;
      guessLog.innerHTML = '<div class="text-gray-500 italic text-center py-4">Noch keine Versuche gemacht</div>';
      updateStatsUI();
      generateQuestion();
    }
  });

  // Layer filter controls
  chkFilterCanton.addEventListener('change', (e) => {
    if (cantonGeoJsonLayer) {
      if (e.target.checked) map.addLayer(cantonGeoJsonLayer);
      else map.removeLayer(cantonGeoJsonLayer);
    }
  });

  chkFilterDistrict.addEventListener('change', (e) => {
    if (districtGeoJsonLayer) {
      if (e.target.checked && gameMode === 'kanton') map.addLayer(districtGeoJsonLayer);
      else map.removeLayer(districtGeoJsonLayer);
    }
  });

  chkFilterCity.addEventListener('change', (e) => {
    if (e.target.checked) map.addLayer(cityLayersGroup);
    else map.removeLayer(cityLayersGroup);
  });

  chkFilterLake.addEventListener('change', (e) => {
    if (lakeGeoJsonLayer) {
      if (e.target.checked) map.addLayer(lakeGeoJsonLayer);
      else map.removeLayer(lakeGeoJsonLayer);
    }
  });

  chkFilterRiver.addEventListener('change', (e) => {
    if (e.target.checked) map.addLayer(riverLayersGroup);
    else map.removeLayer(riverLayersGroup);
  });
}

// Initialise everything when DOM is ready
window.addEventListener('DOMContentLoaded', () => {
  initMap();
  setupEventListeners();
});
