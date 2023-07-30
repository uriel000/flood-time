const map = L.map("map").setView([14.5989505, 121.0077555], 17);
const attribution = "";

L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution: "© OpenStreetMap",
}).addTo(map);

var centery = 14.5989505;
var centerx = 121.0077555;
var minlong = 121.004799;
var minlat = 14.595201;
var maxlong = 121.010712;
var maxlat = 14.6027;

var latlngs = [
  [14.596805594717253, 121.01074931792118],
  [14.596462404012144, 121.0100830302705],
  [14.597200783349521, 121.00885792071813],
  [14.597169584273203, 121.0084495508674],
  [14.597533573226912, 121.00776177006583],
  [14.598029800169442, 121.00601446972416],
  [14.59859051614913, 121.0063276706307],
  [14.599575554272803, 121.006507761151],
  [14.600370802239667, 121.00649123782819],
  [14.600825082219714, 121.00615153571613],
  [14.601197782350468, 121.00588054797959],
  [14.602218338839322, 121.00491797646578],
  [14.602470700689707, 121.00471927970182],
  [14.602630200696694, 121.00485023588789],
  [14.602724152128943, 121.005717256308],
  [14.599008400098228, 121.01034233879881],
  [14.598198602201933, 121.01064688273539],
  [14.59762775918874, 121.01070724311126],
  [14.596806882665035, 121.01074086862059],
];

const polyline = L.polyline(latlngs, { color: "red" }).addTo(map);

// zoom the map to the polyline
map.fitBounds(polyline.getBounds());

const road5 = [
  [14.599262545174412, 121.00594448262086],
  [14.599698515495234, 121.00718086345927],
  [14.599728017214133, 121.00748233714393],
  [14.600134484950942, 121.00871533063889],
];

const polyline2 = L.polyline(road5, { color: "blue", weight: 8, opacity: 0.3 });

const anonasew = [
  [14.598798729745639, 121.00813537615477],
  [14.59890410297551, 121.00781197645244],
  [14.598957843302486, 121.00764973215757],
  [14.599050571679882, 121.00724248808837],
  [14.599108687337534, 121.00718251681462],
  [14.599273069322294, 121.00715856128068],
  [14.599104472413543, 121.00718469459093],
  [14.59905073212164, 121.00724022787261],
  [14.598581821175728, 121.00711827242912],
];

const polyline3 = L.polyline(anonasew, {
  color: "blue",
  weight: 8,
  opacity: 0.3,
});

const anonas = [
  [14.598835958342647, 121.00579403188937],
  [14.599079380708076, 121.00662471131295],
  [14.60003608460373, 121.00932734436242],
  [14.600132320859899, 121.0098304319003],
];

const polyline4 = L.polyline(anonas, {
  color: "blue",
  weight: 8,
  opacity: 0.3,
});

const arellano = [
  [14.600891139759995, 121.00781056251606],
  [14.601280931084304, 121.00743513727753],
  [14.60129228421981, 121.00738429844273],
  [14.601000886901858, 121.0045529664365],
];

const polyline5 = L.polyline(arellano, {
  color: "blue",
  weight: 8,
  opacity: 0.3,
});

const fortuna = [
  [14.601151601125622, 121.00619109189512],
  [14.601750615577686, 121.0061325882171],
];

const polyline6 = L.polyline(fortuna, {
  color: "blue",
  weight: 8,
  opacity: 0.3,
});

const Panganiban = [
  [14.600028286911794, 121.00828297668147],
  [14.600072964944744, 121.00815370383333],
  [14.600034243982975, 121.0075658201622],
  [14.600090836155175, 121.00739653428911],
  [14.599962759113154, 121.00599915635183],
  [14.599926663887643, 121.00590051714386],
  [14.598684610362909, 121.00604210169303],
  [14.598622060718697, 121.00609442641712],
  [14.598237826803398, 121.00756875247856],
];

const polyline7 = L.polyline(Panganiban, {
  color: "blue",
  weight: 8,
  opacity: 0.3,
});

const Magsaysay = [
  [14.601913452114331, 121.00658780012748],
  [14.601717222527682, 121.00445861945087],
  [14.601578226464156, 121.00448396684084],
  [14.601798984876524, 121.00690323430052],
];

const polyline8 = L.polyline(Magsaysay, {
  color: "blue",
  weight: 8,
  opacity: 0.3,
});

const road1 = [
  [14.599994724316204, 121.00652338700428],
  [14.599555838545513, 121.0066457930767],
];

const polyline9 = L.polyline(road1, { color: "blue", weight: 8, opacity: 0.3 });

const road2 = [
  [14.600018263293464, 121.00685764902158],
  [14.599645438279325, 121.00692277532875],
];

const polyline10 = L.polyline(road2, {
  color: "blue",
  weight: 8,
  opacity: 0.3,
});

const road3 = [
  [14.600047147507638, 121.00715222015185],
  [14.599326127638633, 121.00723579130607],
];

const polyline11 = L.polyline(road3, {
  color: "blue",
  weight: 8,
  opacity: 0.3,
});

const road7 = [
  [14.599827882778271, 121.00885534379734],
  [14.599540180936401, 121.00895419085617],
  [14.59939669777981, 121.00854587646307],
];

const polyline12 = L.polyline(road7, {
  color: "blue",
  weight: 8,
  opacity: 0.3,
});

const road9 = [
  [14.599386091196948, 121.00940921052205],
  [14.599730371775934, 121.00934897468136],
  [14.600018182639744, 121.0092040321922],
  [14.600553728436097, 121.0087786165737],
];

const polyline13 = L.polyline(road9, {
  color: "blue",
  weight: 8,
  opacity: 0.3,
});

const Jose = [
  [14.600890307733536, 121.00779390301034],
  [14.600758115101186, 121.00792725471814],
  [14.600644807067056, 121.0079662844883],
  [14.60050946683927, 121.00794026464223],
  [14.600405601027475, 121.00777113564374],
  [14.600112888018145, 121.00466176408042],
];

const polyline14 = L.polyline(Jose, { color: "blue", weight: 8, opacity: 0.3 });

const araullo = [
  [14.600896602618405, 121.00780040797133],
  [14.600692018754714, 121.00607008823124],
  [14.600569268345552, 121.00461622935137],
];

const polyline15 = L.polyline(araullo, {
  color: "blue",
  weight: 8,
  opacity: 0.3,
});

const anonasExWestCheckbox = document.getElementById("anonasew");
const anonasCheckbox = document.getElementById("anonas");
const araulloCheckbox = document.getElementById("araullo");
const arellanoCheckbox = document.getElementById("arellano");
const fortunaCheckbox = document.getElementById("fortuna");
const PanganibanCheckbox = document.getElementById("Panganiban");
const JoseCheckbox = document.getElementById("Jose");
const MagsaysayCheckbox = document.getElementById("Magsaysay");
const road1Checkbox = document.getElementById("road1");
const road2Checkbox = document.getElementById("road2");
const road3Checkbox = document.getElementById("road3");
const road5Checkbox = document.getElementById("road5");
const road7Checkbox = document.getElementById("road7");
const road9Checkbox = document.getElementById("road9");

road5Checkbox.addEventListener("change", function () {
  if (road5Checkbox.checked) {
    polyline2.addTo(map);
    map.fitBounds(polyline2.getBounds());
  } else {
    polyline2.removeFrom(map);
  }
});

anonasExWestCheckbox.addEventListener("change", function () {
  if (anonasExWestCheckbox.checked) {
    polyline3.addTo(map);
    map.fitBounds(polyline3.getBounds());
  } else {
    polyline3.removeFrom(map);
  }
});

anonasCheckbox.addEventListener("change", function () {
  if (anonasCheckbox.checked) {
    polyline4.addTo(map);
    map.fitBounds(polyline4.getBounds());
  } else {
    polyline4.removeFrom(map);
  }
});

arellanoCheckbox.addEventListener("change", function () {
  if (arellanoCheckbox.checked) {
    polyline5.addTo(map);
    map.fitBounds(polyline5.getBounds());
  } else {
    polyline5.removeFrom(map);
  }
});

fortunaCheckbox.addEventListener("change", function () {
  if (fortunaCheckbox.checked) {
    polyline6.addTo(map);
    map.fitBounds(polyline6.getBounds());
  } else {
    polyline6.removeFrom(map);
  }
});

PanganibanCheckbox.addEventListener("change", function () {
  if (PanganibanCheckbox.checked) {
    polyline7.addTo(map);
    map.fitBounds(polyline7.getBounds());
  } else {
    polyline7.removeFrom(map);
  }
});

MagsaysayCheckbox.addEventListener("change", function () {
  if (MagsaysayCheckbox.checked) {
    polyline8.addTo(map);
    map.fitBounds(polyline8.getBounds());
  } else {
    polyline8.removeFrom(map);
  }
});

road1Checkbox.addEventListener("change", function () {
  if (road1Checkbox.checked) {
    polyline9.addTo(map);
    map.fitBounds(polyline9.getBounds());
  } else {
    polyline9.removeFrom(map);
  }
});

road2Checkbox.addEventListener("change", function () {
  if (road2Checkbox.checked) {
    polyline10.addTo(map);
    map.fitBounds(polyline10.getBounds());
  } else {
    polyline10.removeFrom(map);
  }
});

road3Checkbox.addEventListener("change", function () {
  if (road3Checkbox.checked) {
    polyline11.addTo(map);
    map.fitBounds(polyline11.getBounds());
  } else {
    polyline11.removeFrom(map);
  }
});

road7Checkbox.addEventListener("change", function () {
  if (road7Checkbox.checked) {
    polyline12.addTo(map);
    map.fitBounds(polyline12.getBounds());
  } else {
    polyline12.removeFrom(map);
  }
});

road9Checkbox.addEventListener("change", function () {
  if (road9Checkbox.checked) {
    polyline13.addTo(map);
    map.fitBounds(polyline13.getBounds());
  } else {
    polyline13.removeFrom(map);
  }
});

JoseCheckbox.addEventListener("change", function () {
  if (JoseCheckbox.checked) {
    polyline14.addTo(map);
    map.fitBounds(polyline14.getBounds());
  } else {
    polyline14.removeFrom(map);
  }
});

araulloCheckbox.addEventListener("change", function () {
  if (araulloCheckbox.checked) {
    polyline15.addTo(map);
    map.fitBounds(polyline15.getBounds());
  } else {
    polyline15.removeFrom(map);
  }
});
