import { useState, useEffect, useRef, createContext, useContext } from "react";

// ─────────────────────────────────────────────
// PATTERN TYPES (palette-agnostic)
// ─────────────────────────────────────────────
const PATTERN_TYPES = [
  { id: "stripes-h",   name: "Listras horizontais" },
  { id: "stripes",     name: "Listras verticais" },
  { id: "check",       name: "Xadrez" },
  { id: "herringbone", name: "Espinha de peixe" },
  { id: "houndstooth", name: "Pied-de-poule" },
  { id: "windowpane",  name: "Windowpane" },
  { id: "polka",       name: "Poá / Bolinhas" },
  { id: "floral",      name: "Floral / Folhagem" },
  { id: "camo",        name: "Camuflado" },
  { id: "linen",       name: "Textura linho/sarja" },
  { id: "tie-dye",     name: "Tie-dye" },
];

// ─────────────────────────────────────────────
// WARM AUTUMN — data
// ─────────────────────────────────────────────
const C_AUTUMN = {
  creme:    { hex: "#f0e6cf", name: "Creme / Marfim quente" },
  areia:    { hex: "#d8c39a", name: "Areia / Bege dourado" },
  camel:    { hex: "#c19a6b", name: "Camel / Caramelo" },
  caqui:    { hex: "#8f7e54", name: "Cáqui" },
  oliva:    { hex: "#6b6033", name: "Verde oliva" },
  musgo:    { hex: "#4a4a2c", name: "Verde musgo / Militar" },
  marrom:   { hex: "#6b4a2f", name: "Marrom / Castanho" },
  cafe:     { hex: "#4e3629", name: "Café / Chocolate" },
  mostarda: { hex: "#c39a2e", name: "Mostarda queimada" },
  mel:      { hex: "#d4a13a", name: "Mel / Açafrão" },
  terracota:{ hex: "#c16e54", name: "Terracota" },
  ferrugem: { hex: "#9c5a34", name: "Ferrugem / Tijolo" },
  cobre:    { hex: "#9a5b34", name: "Cobre" },
  coral:    { hex: "#d07158", name: "Coral queimado" },
  salmao:   { hex: "#d3886c", name: "Salmão / Pêssego escuro" },
  paprica:  { hex: "#a83f2e", name: "Páprica / Tomate queimado" },
  petroleo: { hex: "#274d52", name: "Azul petróleo" },
  teal:     { hex: "#2c5b5e", name: "Teal / Azul-pavão" },
  jeans:    { hex: "#3a4a5c", name: "Jeans índigo escuro" },
  taupe:    { hex: "#8c7d6b", name: "Taupe quente" },
};

const PALETTES_AUTUMN = {
  shirt: ["creme","areia","camel","oliva","musgo","mostarda","mel","terracota","ferrugem","cobre","coral","salmao","paprica","petroleo","teal"],
  pants: ["caqui","camel","areia","oliva","musgo","cafe","marrom","jeans","taupe"],
  shoe:  ["camel","marrom","cafe","areia","creme","caqui","oliva","taupe"],
};

const COMBOS_AUTUMN = {
  shirt: {
    creme:    { pants:[{k:"caqui",note:"Combinação clássica e fácil"},{k:"oliva",note:"Visual terroso; perfeito com overshirt"},{k:"marrom",note:"Elegante; substitui o preto"},{k:"jeans",note:"Jeans escuro + creme é infalível"}], shoes:[{k:"camel",note:"Tom sobre tom quente"},{k:"marrom",note:"Âncora o look"}] },
    areia:    { pants:[{k:"oliva",note:"Terrosa e natural"},{k:"cafe",note:"Contraste suave"},{k:"caqui",note:"Tom sobre tom Warm Autumn"}], shoes:[{k:"marrom",note:"Finaliza bem"},{k:"camel",note:"Flui com a areia"}] },
    camel:    { pants:[{k:"musgo",note:"Contraste quente e sofisticado"},{k:"cafe",note:"Degradê terroso"},{k:"caqui",note:"Leve e casual"}], shoes:[{k:"marrom",note:"Ancora o look"},{k:"cafe",note:"Tom idêntico na base"}] },
    oliva:    { pants:[{k:"camel",note:"Muito versátil"},{k:"marrom",note:"Visual militar-terroso"},{k:"areia",note:"Alivia com tom claro"}], shoes:[{k:"marrom",note:"Clássico e seguro"},{k:"camel",note:"Aquece a base"}] },
    musgo:    { pants:[{k:"areia",note:"Contraste claro"},{k:"camel",note:"Quente e masculino"},{k:"cafe",note:"Tom sobre tom verde-marrom"}], shoes:[{k:"camel",note:"Equilibra o verde"},{k:"marrom",note:"Âncora terrosa"}] },
    mostarda: { pants:[{k:"oliva",note:"Outono perfeito"},{k:"cafe",note:"Contraste quente e vivo"},{k:"caqui",note:"A mostarda brilha sobre o neutro"}], shoes:[{k:"camel",note:"Espelha a mostarda"},{k:"marrom",note:"Âncora sem competir"}] },
    mel:      { pants:[{k:"musgo",note:"Outonal clássico"},{k:"marrom",note:"Mel sobre terra"},{k:"caqui",note:"Neutro que deixa o mel falar"}], shoes:[{k:"camel",note:"Continuidade dourada"},{k:"marrom",note:"Sobriedade"}] },
    terracota:{ pants:[{k:"caqui",note:"Combo favorito Warm Autumn"},{k:"areia",note:"A terracota vibra sobre o claro"},{k:"oliva",note:"Terra + floresta"},{k:"cafe",note:"Rico e profundo"}], shoes:[{k:"marrom",note:"Clássico"},{k:"areia",note:"Desert boot perfeito"}] },
    ferrugem: { pants:[{k:"caqui",note:"Dos melhores combos"},{k:"marrom",note:"Coeso e robusto"},{k:"areia",note:"Alivia com tom claro"}], shoes:[{k:"marrom",note:"Muito natural"},{k:"cafe",note:"Profundo e sofisticado"}] },
    cobre:    { pants:[{k:"caqui",note:"Cobre destaca"},{k:"oliva",note:"Terrosos complementares"},{k:"marrom",note:"Coeso e profundo"}], shoes:[{k:"marrom",note:"Âncora"},{k:"camel",note:"Tom quente no pé"}] },
    coral:    { pants:[{k:"areia",note:"Leveza com calor"},{k:"caqui",note:"Combinação campeã"},{k:"oliva",note:"Contraste interessante"}], shoes:[{k:"creme",note:"Off-white leve"},{k:"camel",note:"Quente e suave"}] },
    salmao:   { pants:[{k:"areia",note:"Visual suave e claro"},{k:"caqui",note:"Muito wearable"},{k:"oliva",note:"Contraste delicado"}], shoes:[{k:"creme",note:"Leve e limpo"},{k:"camel",note:"Dourado que flui"}] },
    paprica:  { pants:[{k:"marrom",note:"Profundo e intenso"},{k:"caqui",note:"Neutra para a páprica brilhar"},{k:"cafe",note:"Rico e outonal"}], shoes:[{k:"camel",note:"Âncora sem competir"},{k:"marrom",note:"Sóbria"}] },
    petroleo: { pants:[{k:"camel",note:"Melhor combinação"},{k:"caqui",note:"Equilibra bem"},{k:"marrom",note:"Sofisticado e masculino"}], shoes:[{k:"marrom",note:"Loafer ou bota — clássico"},{k:"camel",note:"Flui com a calça"}] },
    teal:     { pants:[{k:"camel",note:"Teal + camel — elegante"},{k:"areia",note:"Abre o look"},{k:"caqui",note:"Base sólida e quente"}], shoes:[{k:"marrom",note:"Atemporal"},{k:"camel",note:"Aquece o visual"}] },
  },
  pants: {
    caqui:  { shirts:[{k:"creme",note:"Ilumina bem"},{k:"terracota",note:"Destaque quente"},{k:"oliva",note:"Tom sobre tom terroso"},{k:"petroleo",note:"Sofisticado"}], shoes:[{k:"camel",note:"Muito versátil"},{k:"marrom",note:"Clássico"}] },
    camel:  { shirts:[{k:"petroleo",note:"Sofisticada e favorita"},{k:"oliva",note:"Terroso e masculino"},{k:"creme",note:"Visual limpo"},{k:"mostarda",note:"Tom sobre tom dourado"}], shoes:[{k:"marrom",note:"Âncora escura"},{k:"cafe",note:"Profundo e elegante"}] },
    areia:  { shirts:[{k:"terracota",note:"Destaque quente"},{k:"coral",note:"Leve para dias quentes"},{k:"oliva",note:"Natural e terroso"},{k:"mostarda",note:"Vivo sem sair da paleta"}], shoes:[{k:"marrom",note:"Ancora a areia"},{k:"camel",note:"Tom sobre tom"}] },
    oliva:  { shirts:[{k:"creme",note:"Clareia e equilibra"},{k:"mostarda",note:"Outono perfeito"},{k:"terracota",note:"Terra + folha"},{k:"marrom",note:"Tom sobre tom profundo"}], shoes:[{k:"marrom",note:"Bota ou tênis — ideal"},{k:"camel",note:"Aquece o look"}] },
    musgo:  { shirts:[{k:"mel",note:"Dourado sobre musgo"},{k:"areia",note:"Clareia o look"},{k:"camel",note:"Quente e natural"}], shoes:[{k:"camel",note:"Equilíbrio perfeito"},{k:"marrom",note:"Sólido e seguro"}] },
    cafe:   { shirts:[{k:"creme",note:"Contraste suave"},{k:"oliva",note:"Terroso profundo"},{k:"mostarda",note:"Mostarda brilha sobre café"}], shoes:[{k:"camel",note:"Âncora clara"},{k:"marrom",note:"Tom sobre tom dark"}] },
    marrom: { shirts:[{k:"creme",note:"Visual limpo"},{k:"coral",note:"Destaque sobre marrom"},{k:"petroleo",note:"Contraste frio-quente"}], shoes:[{k:"camel",note:"Clareia"},{k:"cafe",note:"Tom profundo"}] },
    jeans:  { shirts:[{k:"creme",note:"Infalível"},{k:"oliva",note:"Urban e versátil"},{k:"terracota",note:"Destaque quente"}], shoes:[{k:"marrom",note:"Melhor que preto"},{k:"camel",note:"Casual e quente"}] },
    taupe:  { shirts:[{k:"creme",note:"Neutro refinado"},{k:"terracota",note:"Aquece o visual"},{k:"oliva",note:"Contraste terroso"}], shoes:[{k:"camel",note:"Harmonioso"},{k:"marrom",note:"Âncora sóbria"}] },
  },
  shoe: {
    camel:  { shirts:[{k:"creme",note:"Tom sobre tom"},{k:"oliva",note:"Terroso e fácil"},{k:"petroleo",note:"Sofisticado"}], pants:[{k:"caqui",note:"Muito coeso"},{k:"oliva",note:"Complementar quente"},{k:"camel",note:"Tom sobre tom"}] },
    marrom: { shirts:[{k:"creme",note:"Clássico e elegante"},{k:"terracota",note:"Terra do pescoço ao pé"},{k:"petroleo",note:"Contraste rico"}], pants:[{k:"caqui",note:"Base leve com âncora"},{k:"oliva",note:"Terroso com âncora"},{k:"jeans",note:"Casual e acessível"}] },
    cafe:   { shirts:[{k:"creme",note:"Contraste limpo"},{k:"mostarda",note:"Vibrante com base escura"},{k:"oliva",note:"Natural e profundo"}], pants:[{k:"camel",note:"Elegante"},{k:"caqui",note:"Neutros sobre neutro"}] },
    areia:  { shirts:[{k:"terracota",note:"Desert boot areia + terracota"},{k:"coral",note:"Claro + claro verão"},{k:"oliva",note:"Natural e leve"}], pants:[{k:"caqui",note:"Tom próximo"},{k:"areia",note:"Tom sobre tom"},{k:"oliva",note:"Contraste terroso"}] },
    creme:  { shirts:[{k:"coral",note:"Leveza e calor"},{k:"salmao",note:"Verão WA"},{k:"oliva",note:"Natural e quente"}], pants:[{k:"caqui",note:"Leve e casual"},{k:"areia",note:"Tom claro"},{k:"marrom",note:"Âncora escura"}] },
    caqui:  { shirts:[{k:"creme",note:"Limpo e fácil"},{k:"oliva",note:"Tom sobre tom"},{k:"mostarda",note:"Vivo sobre neutro"}], pants:[{k:"caqui",note:"Coeso"},{k:"marrom",note:"Contraste sólido"},{k:"areia",note:"Visual claro"}] },
    oliva:  { shirts:[{k:"creme",note:"Clareia o conjunto"},{k:"terracota",note:"Outono total"},{k:"mostarda",note:"Dois tons fortes"}], pants:[{k:"caqui",note:"Base complementar"},{k:"marrom",note:"Tom escuro"},{k:"jeans",note:"Urban e casual"}] },
    taupe:  { shirts:[{k:"creme",note:"Neutro sobre neutro"},{k:"petroleo",note:"Frescor com base neutra"}], pants:[{k:"camel",note:"Harmonioso"},{k:"caqui",note:"Tom próximo"}] },
  },
};

const PATTERN_COMBOS_AUTUMN = {
  shirt: {
    "stripes-h": [
      { name:"Creme + Marrom café", colors:["#f0e6cf","#4e3629"], look:[{role:"shirt",ck:"creme"},{role:"pants",ck:"caqui"},{role:"shoe",ck:"camel"}], note:"Excelente para Warm Autumn. Substitui o clássico branco/azul." },
      { name:"Creme + Oliva", colors:["#f0e6cf","#6b6033"], look:[{role:"shirt",ck:"creme"},{role:"pants",ck:"camel"},{role:"shoe",ck:"marrom"}], note:"Mais casual e natural. Fácil de combinar." },
      { name:"Areia + Petróleo", colors:["#d8c39a","#274d52"], look:[{role:"shirt",ck:"areia"},{role:"pants",ck:"caqui"},{role:"shoe",ck:"camel"}], note:"Boa alternativa ao azul-marinho com branco." },
      { name:"Creme + Ferrugem", colors:["#f0e6cf","#9c5a34"], look:[{role:"shirt",ck:"creme"},{role:"pants",ck:"cafe"},{role:"shoe",ck:"marrom"}], note:"Mais marcante, mas dentro da paleta." },
    ],
    "stripes": [
      { name:"Creme + Camel", colors:["#f0e6cf","#c19a6b"], look:[{role:"shirt",ck:"creme"},{role:"pants",ck:"oliva"},{role:"shoe",ck:"marrom"}], note:"Listras verticais elegantes, casual arrumado." },
      { name:"Areia + Petróleo", colors:["#d8c39a","#274d52"], look:[{role:"shirt",ck:"areia"},{role:"pants",ck:"camel"},{role:"shoe",ck:"marrom"}], note:"Sofisticado e fácil de combinar." },
      { name:"Marfim + Oliva", colors:["#f0e6cf","#6b6033"], look:[{role:"shirt",ck:"creme"},{role:"pants",ck:"caqui"},{role:"shoe",ck:"camel"}], note:"Natural e terroso." },
    ],
    "check": [
      { name:"Oliva + Creme + Marrom", colors:["#6b6033","#f0e6cf","#6b4a2f"], look:[{role:"shirt",ck:"oliva"},{role:"pants",ck:"jeans"},{role:"shoe",ck:"cafe"}], note:"Um dos melhores xadrezes para WA. Muito masculino." },
      { name:"Ferrugem + Camel + Chocolate", colors:["#9c5a34","#c19a6b","#4e3629"], look:[{role:"shirt",ck:"ferrugem"},{role:"pants",ck:"caqui"},{role:"shoe",ck:"camel"}], note:"Outonal e marcante." },
      { name:"Petróleo + Camel + Creme", colors:["#274d52","#c19a6b","#f0e6cf"], look:[{role:"shirt",ck:"petroleo"},{role:"pants",ck:"areia"},{role:"shoe",ck:"marrom"}], note:"Elegante, ótimo para casual arrumado." },
      { name:"Mostarda + Musgo + Café", colors:["#c39a2e","#4a4a2c","#4e3629"], look:[{role:"shirt",ck:"mostarda"},{role:"pants",ck:"marrom"},{role:"shoe",ck:"cafe"}], note:"Outono total — muito característico da paleta." },
    ],
    "herringbone": [
      { name:"Marrom herringbone", colors:["#6b4a2f","#4e3629"], look:[{role:"shirt",ck:"creme"},{role:"pants",ck:"camel"},{role:"shoe",ck:"cafe"}], note:"Textura rica e clássica. Ótimo em overshirt." },
      { name:"Oliva herringbone", colors:["#6b6033","#4a4a2c"], look:[{role:"shirt",ck:"creme"},{role:"pants",ck:"jeans"},{role:"shoe",ck:"marrom"}], note:"Natural e versátil." },
      { name:"Taupe herringbone", colors:["#8c7d6b","#6b4a2f"], look:[{role:"shirt",ck:"creme"},{role:"pants",ck:"camel"},{role:"shoe",ck:"marrom"}], note:"Neutro quente, muito wearable." },
    ],
    "houndstooth": [
      { name:"Marrom + Creme", colors:["#6b4a2f","#f0e6cf"], look:[{role:"shirt",ck:"marrom"},{role:"pants",ck:"caqui"},{role:"shoe",ck:"marrom"}], note:"Substitui o clássico preto/branco. Muito elegante." },
      { name:"Chocolate + Camel", colors:["#4e3629","#c19a6b"], look:[{role:"shirt",ck:"cafe"},{role:"pants",ck:"caqui"},{role:"shoe",ck:"camel"}], note:"Tom sobre tom quente e sofisticado." },
      { name:"Oliva + Areia", colors:["#6b6033","#d8c39a"], look:[{role:"shirt",ck:"oliva"},{role:"pants",ck:"marrom"},{role:"shoe",ck:"marrom"}], note:"Natural e terroso." },
    ],
    "windowpane": [
      { name:"Creme + Terracota", colors:["#f0e6cf","#c16e54"], look:[{role:"shirt",ck:"creme"},{role:"pants",ck:"caqui"},{role:"shoe",ck:"marrom"}], note:"Delicado e quente." },
      { name:"Camel + Chocolate", colors:["#c19a6b","#4e3629"], look:[{role:"shirt",ck:"camel"},{role:"pants",ck:"cafe"},{role:"shoe",ck:"marrom"}], note:"Elegante para casual arrumado." },
    ],
    "polka": [
      { name:"Marrom + Poá creme", colors:["#6b4a2f","#f0e6cf"], look:[{role:"shirt",ck:"marrom"},{role:"pants",ck:"caqui"},{role:"shoe",ck:"camel"}], note:"Discreto e charmoso." },
      { name:"Petróleo + Poá areia", colors:["#274d52","#d8c39a"], look:[{role:"shirt",ck:"petroleo"},{role:"pants",ck:"camel"},{role:"shoe",ck:"marrom"}], note:"Fundo escuro com poá quente — muito WA." },
      { name:"Oliva + Poá marfim", colors:["#6b6033","#f0e6cf"], look:[{role:"shirt",ck:"oliva"},{role:"pants",ck:"cafe"},{role:"shoe",ck:"creme"}], note:"Natural e não usual." },
    ],
    "floral": [
      { name:"Creme + Folhagem oliva/ferrugem", colors:["#f0e6cf","#6b6033","#9c5a34"], look:[{role:"shirt",ck:"creme"},{role:"pants",ck:"caqui"},{role:"shoe",ck:"marrom"}], note:"Linho creme com folhagem — perfeito para verão." },
      { name:"Petróleo + Flores terracota/camel", colors:["#274d52","#c16e54","#c19a6b"], look:[{role:"shirt",ck:"petroleo"},{role:"pants",ck:"areia"},{role:"shoe",ck:"marrom"}], note:"Floral sofisticado e não-óbvio." },
      { name:"Oliva + Detalhes mostarda", colors:["#6b6033","#c39a2e","#4e3629"], look:[{role:"shirt",ck:"oliva"},{role:"pants",ck:"camel"},{role:"shoe",ck:"cafe"}], note:"Tropical quente. Ótimo com bermuda camel." },
    ],
    "camo": [
      { name:"Camo oliva/musgo/marrom", colors:["#6b6033","#4a4a2c","#6b4a2f","#d8c39a"], look:[{role:"shirt",ck:"creme"},{role:"pants",ck:"marrom"},{role:"shoe",ck:"cafe"}], note:"Camo quente — o melhor para WA. Resto do look liso." },
      { name:"Desert camo areia/camel/marrom", colors:["#d8c39a","#c19a6b","#6b4a2f","#8f7e54"], look:[{role:"shirt",ck:"camel"},{role:"pants",ck:"marrom"},{role:"shoe",ck:"cafe"}], note:"Desert camo quente. Muito natural." },
    ],
    "linen": [
      { name:"Textura areia/creme", colors:["#d8c39a","#c5b08a"], look:[{role:"shirt",ck:"areia"},{role:"pants",ck:"cafe"},{role:"shoe",ck:"marrom"}], note:"Textura de linho natural — muito WA." },
      { name:"Textura oliva", colors:["#6b6033","#545228"], look:[{role:"shirt",ck:"oliva"},{role:"pants",ck:"camel"},{role:"shoe",ck:"marrom"}], note:"Tom rico com profundidade de textura." },
    ],
    "tie-dye": [
      { name:"Terracota + Areia", colors:["#c16e54","#d8c39a","#9c5a34"], look:[{role:"shirt",ck:"terracota"},{role:"pants",ck:"caqui"},{role:"shoe",ck:"marrom"}], note:"Tie-dye quente — dentro da paleta WA." },
      { name:"Oliva + Creme", colors:["#6b6033","#f0e6cf","#4a4a2c"], look:[{role:"shirt",ck:"oliva"},{role:"pants",ck:"camel"},{role:"shoe",ck:"marrom"}], note:"Natural e terroso." },
    ],
  },
  pants: {
    "stripes": [
      { name:"Calça listrada cáqui/marrom", colors:["#8f7e54","#4e3629"], look:[{role:"shirt",ck:"creme"},{role:"pants",ck:"caqui"},{role:"shoe",ck:"marrom"}], note:"Listras discretas dentro dos neutros quentes." },
      { name:"Listras camel/chocolate", colors:["#c19a6b","#4e3629"], look:[{role:"shirt",ck:"oliva"},{role:"pants",ck:"camel"},{role:"shoe",ck:"cafe"}], note:"Tom sobre tom elegante." },
    ],
    "check": [
      { name:"Xadrez cáqui/oliva discreta", colors:["#8f7e54","#6b6033","#4e3629"], look:[{role:"shirt",ck:"creme"},{role:"pants",ck:"caqui"},{role:"shoe",ck:"marrom"}], note:"Padrão sutil que funciona como neutro." },
      { name:"Xadrez marrom/taupe", colors:["#6b4a2f","#8c7d6b","#4e3629"], look:[{role:"shirt",ck:"petroleo"},{role:"pants",ck:"marrom"},{role:"shoe",ck:"camel"}], note:"Sofisticado; rest do look deve ser liso." },
      { name:"Xadrez café/camel", colors:["#4e3629","#c19a6b","#8f7e54"], look:[{role:"shirt",ck:"creme"},{role:"pants",ck:"cafe"},{role:"shoe",ck:"marrom"}], note:"Polo creme + calça xadrez discreta + loafer." },
    ],
    "herringbone": [
      { name:"Herringbone camel/marrom", colors:["#c19a6b","#6b4a2f"], look:[{role:"shirt",ck:"petroleo"},{role:"pants",ck:"camel"},{role:"shoe",ck:"marrom"}], note:"Um dos melhores padrões para calça WA." },
      { name:"Herringbone marrom/café", colors:["#6b4a2f","#4e3629"], look:[{role:"shirt",ck:"creme"},{role:"pants",ck:"marrom"},{role:"shoe",ck:"camel"}], note:"Profundo e sofisticado. Casual arrumado." },
      { name:"Herringbone taupe/chocolate", colors:["#8c7d6b","#4e3629"], look:[{role:"shirt",ck:"creme"},{role:"pants",ck:"taupe"},{role:"shoe",ck:"marrom"}], note:"Neutro quente — muito wearable." },
    ],
    "houndstooth": [
      { name:"Pied-de-poule marrom/creme", colors:["#6b4a2f","#f0e6cf"], look:[{role:"shirt",ck:"creme"},{role:"pants",ck:"marrom"},{role:"shoe",ck:"cafe"}], note:"Substitui o preto/branco clássico. Elegante." },
      { name:"Bege/café bem pequeno", colors:["#d8c39a","#4e3629"], look:[{role:"shirt",ck:"oliva"},{role:"pants",ck:"cafe"},{role:"shoe",ck:"camel"}], note:"Micro padrão funciona como textura." },
    ],
    "windowpane": [
      { name:"Camel + Linhas chocolate", colors:["#c19a6b","#4e3629"], look:[{role:"shirt",ck:"creme"},{role:"pants",ck:"camel"},{role:"shoe",ck:"marrom"}], note:"Windowpane na calça — elegante e masculino." },
      { name:"Cáqui + Linhas oliva", colors:["#8f7e54","#4a4a2c"], look:[{role:"shirt",ck:"creme"},{role:"pants",ck:"caqui"},{role:"shoe",ck:"marrom"}], note:"Sutil e funcional." },
    ],
    "camo": [
      { name:"Cargo camo oliva/cáqui", colors:["#6b6033","#8f7e54","#6b4a2f","#d8c39a"], look:[{role:"shirt",ck:"creme"},{role:"pants",ck:"oliva"},{role:"shoe",ck:"camel"}], note:"Calça cargo camo — rest do look lisa." },
    ],
    "linen": [
      { name:"Sarja com microtextura cáqui", colors:["#8f7e54","#7a6d48"], look:[{role:"shirt",ck:"creme"},{role:"pants",ck:"caqui"},{role:"shoe",ck:"marrom"}], note:"Textura de sarja — visual mais rico que liso." },
      { name:"Cotelê oliva", colors:["#6b6033","#545228"], look:[{role:"shirt",ck:"terracota"},{role:"pants",ck:"oliva"},{role:"shoe",ck:"marrom"}], note:"Cotelê é textura e padrão ao mesmo tempo." },
    ],
  },
};

const SWAPS_AUTUMN = [
  { bad:"Azul-marinho + Branco",       badColors:["#1a2a6c","#ffffff"],                       good:"Petróleo + Creme",              goodColors:["#274d52","#f0e6cf"],                       pattern:"stripes-h" },
  { bad:"Preto + Branco",              badColors:["#111111","#f8f8f8"],                       good:"Marrom café + Creme",          goodColors:["#4e3629","#f0e6cf"],                       pattern:"houndstooth" },
  { bad:"Cinza + Preto",               badColors:["#9099a0","#111111"],                       good:"Taupe quente + Chocolate",      goodColors:["#8c7d6b","#4e3629"],                       pattern:"check" },
  { bad:"Vermelho frio + Preto",        badColors:["#c01020","#111111"],                       good:"Ferrugem + Marrom",             goodColors:["#9c5a34","#6b4a2f"],                       pattern:"check" },
  { bad:"Azul royal + Branco",         badColors:["#2040b8","#f8f8f8"],                       good:"Teal/Petróleo + Areia",         goodColors:["#274d52","#d8c39a"],                       pattern:"stripes-h" },
  { bad:"Xadrez cinza",                badColors:["#9099a0","#5f6065"],                       good:"Xadrez cáqui/marrom/oliva",     goodColors:["#8f7e54","#6b4a2f","#6b6033"],            pattern:"check" },
  { bad:"Listras brancas puras",       badColors:["#f8f8f8","#3a4a5c"],                       good:"Listras marfim/creme",          goodColors:["#f0e6cf","#274d52"],                       pattern:"stripes-h" },
  { bad:"Camuflado urbano cinza",      badColors:["#7a7f80","#9099a0","#4a5050","#b0b5b5"],   good:"Camo oliva/cáqui/marrom",       goodColors:["#6b6033","#8f7e54","#6b4a2f","#d8c39a"],  pattern:"camo" },
];

// ─────────────────────────────────────────────
// BRIGHT SPRING — data
// ─────────────────────────────────────────────
const C_SPRING = {
  marfim:    { hex: "#FFF4D8", name: "Marfim claro" },
  creme:     { hex: "#FFEFC4", name: "Creme luminoso" },
  pessego:   { hex: "#FFB07C", name: "Pêssego vivo" },
  areia:     { hex: "#E9D3A3", name: "Areia clara quente" },
  camel:     { hex: "#C99A5B", name: "Camel claro" },
  caramelo:  { hex: "#B9803F", name: "Caramelo claro" },
  chocolate: { hex: "#8A5A35", name: "Chocolate ao leite" },
  taupe:     { hex: "#B99B7A", name: "Taupe quente" },
  marinho:   { hex: "#123E78", name: "Marinho brilhante" },
  coral:     { hex: "#FF6F61", name: "Coral vivo" },
  pink:      { hex: "#F72585", name: "Pink quente" },
  melancia:  { hex: "#FF4F7B", name: "Rosa melancia" },
  fucsia:    { hex: "#D92B8A", name: "Fúcsia quente" },
  tomate:    { hex: "#F9423A", name: "Vermelho tomate" },
  tangerina: { hex: "#FF8C1A", name: "Tangerina" },
  canario:   { hex: "#FFD447", name: "Amarelo canário" },
  esmeralda: { hex: "#00A36C", name: "Verde esmeralda" },
  agua:      { hex: "#4ED9C4", name: "Verde água quente" },
  piscina:   { hex: "#00AEEF", name: "Azul piscina" },
  violeta:   { hex: "#8F5CF7", name: "Violeta claro vivo" },
};

const PALETTES_SPRING = {
  shirt: ["marfim","creme","pessego","coral","pink","melancia","fucsia","tomate","tangerina","canario","esmeralda","agua","piscina","violeta","marinho"],
  pants: ["marfim","creme","areia","camel","caramelo","taupe","marinho","coral","piscina"],
  shoe:  ["marfim","creme","camel","caramelo","chocolate","areia","pessego","marinho"],
};

const COMBOS_SPRING = {
  shirt: {
    marfim:    { pants:[{k:"marinho",note:"Contraste limpo e luminoso — clássico Spring"},{k:"camel",note:"Casual elegante e arejado"},{k:"coral",note:"Vibrante e feminino"},{k:"piscina",note:"Fresco para dias quentes"}], shoes:[{k:"caramelo",note:"Aquece e ancora"},{k:"camel",note:"Tom sobre tom suave"}] },
    creme:     { pants:[{k:"marinho",note:"Alta intensidade limpa"},{k:"camel",note:"Combinação fácil e luminosa"},{k:"coral",note:"Femina e cheia de vida"}], shoes:[{k:"caramelo",note:"Sapatilha caramelo finaliza"},{k:"marfim",note:"Look arejado total"}] },
    pessego:   { pants:[{k:"marinho",note:"Combinação favorita Spring"},{k:"areia",note:"Suave e luminosa"},{k:"creme",note:"Visual fresco e leve"}], shoes:[{k:"marfim",note:"Sapato off-white limpo"},{k:"camel",note:"Continuidade dourada"}] },
    coral:     { pants:[{k:"marfim",note:"Coral vivo sobre branco quente — luminoso"},{k:"marinho",note:"Contraste de alta intensidade"},{k:"areia",note:"Suave para o dia a dia"},{k:"creme",note:"Visual aberto e fresco"}], shoes:[{k:"marfim",note:"Limpo e arejado"},{k:"camel",note:"Aquece sem competir"}] },
    pink:      { pants:[{k:"marinho",note:"Forte contraste limpo"},{k:"creme",note:"Pink quente sobre creme — feminino"},{k:"areia",note:"Suaviza sem apagar"}], shoes:[{k:"marfim",note:"Off-white deixa o pink falar"},{k:"camel",note:"Aterramento quente"}] },
    melancia:  { pants:[{k:"marfim",note:"Rosa melancia sobre branco — fresco"},{k:"marinho",note:"Vibrante e jovem"},{k:"creme",note:"Combinação delicada"}], shoes:[{k:"marfim",note:"Limpa o look"},{k:"camel",note:"Adoça o conjunto"}] },
    fucsia:    { pants:[{k:"marinho",note:"Combinação favorita Spring — fúcsia + navy vivo"},{k:"marfim",note:"Alta saturação sobre claro"},{k:"creme",note:"Feminina e marcante"}], shoes:[{k:"marfim",note:"Não compete com o fúcsia"},{k:"caramelo",note:"Aquece o look"}] },
    tomate:    { pants:[{k:"marfim",note:"Vermelho tomate sobre marfim — moderno"},{k:"creme",note:"Equilíbrio luminoso"},{k:"marinho",note:"Clássico Spring — alta intensidade"}], shoes:[{k:"caramelo",note:"Aterra o vermelho"},{k:"marfim",note:"Visual limpo e vibrante"}] },
    tangerina: { pants:[{k:"marfim",note:"Cor solar sobre marfim"},{k:"areia",note:"Suave e luminosa"},{k:"marinho",note:"Contraste alta intensidade"}], shoes:[{k:"marfim",note:"Limpo e fresco"},{k:"camel",note:"Tom sobre tom solar"}] },
    canario:   { pants:[{k:"marinho",note:"Amarelo + marinho vivo — náutico moderno"},{k:"marfim",note:"Suave e iluminado"},{k:"creme",note:"Tom sobre tom luminoso"}], shoes:[{k:"caramelo",note:"Aquece e ancora"},{k:"marfim",note:"Visual leve"}] },
    esmeralda: { pants:[{k:"marfim",note:"Verde rico sobre claro — sofisticado"},{k:"areia",note:"Natural e fresco"},{k:"marinho",note:"Profundidade limpa"}], shoes:[{k:"camel",note:"Combina o verde"},{k:"marfim",note:"Limpa a base"}] },
    agua:      { pants:[{k:"marfim",note:"Verde água sobre marfim — delicado"},{k:"areia",note:"Praiano e fresco"},{k:"creme",note:"Pastel luminoso"}], shoes:[{k:"marfim",note:"Limpíssimo"},{k:"camel",note:"Toque dourado"}] },
    piscina:   { pants:[{k:"marfim",note:"Azul vivo sobre branco quente"},{k:"creme",note:"Combinação fresca de verão"},{k:"areia",note:"Suave e cheia de luz"}], shoes:[{k:"marfim",note:"Limpa e leve"},{k:"caramelo",note:"Aterra com calor"}] },
    violeta:   { pants:[{k:"marfim",note:"Roxo claro luminoso sobre claro"},{k:"creme",note:"Feminino e moderno"}], shoes:[{k:"marfim",note:"Mantém a leveza"}] },
    marinho:   { pants:[{k:"marfim",note:"Marinho + marfim — clássico Spring"},{k:"creme",note:"Náutico fresco"},{k:"coral",note:"Coral nas pernas equilibra a profundidade"}], shoes:[{k:"caramelo",note:"Loafer caramelo finaliza"},{k:"marfim",note:"Visual aberto e clean"}] },
  },
  pants: {
    marfim:    { shirts:[{k:"coral",note:"Coral vivo brilha sobre marfim"},{k:"pink",note:"Feminina e cheia de luz"},{k:"esmeralda",note:"Sofisticado e luminoso"},{k:"tangerina",note:"Solar e moderna"}], shoes:[{k:"camel",note:"Aquece a base clara"},{k:"caramelo",note:"Ancora o branco quente"}] },
    creme:     { shirts:[{k:"coral",note:"Luminoso e leve"},{k:"melancia",note:"Feminino e fresco"},{k:"pessego",note:"Suave e elegante"},{k:"piscina",note:"Verão arejado"}], shoes:[{k:"camel",note:"Tom sobre tom dourado"},{k:"caramelo",note:"Ancora suavemente"}] },
    areia:     { shirts:[{k:"coral",note:"Destaque quente sobre neutro"},{k:"pessego",note:"Suave e arejada"},{k:"esmeralda",note:"Natural e luminoso"},{k:"tomate",note:"Vivo sobre claro"}], shoes:[{k:"caramelo",note:"Coeso e quente"},{k:"camel",note:"Tom sobre tom"}] },
    camel:     { shirts:[{k:"marfim",note:"Visual limpo e elegante"},{k:"marinho",note:"Camel + marinho vivo — chique"},{k:"piscina",note:"Fresco e moderno"},{k:"coral",note:"Quente e luminoso"}], shoes:[{k:"chocolate",note:"Aprofunda o camel"},{k:"caramelo",note:"Tom sobre tom dourado"}] },
    caramelo:  { shirts:[{k:"marfim",note:"Visual minimalista"},{k:"esmeralda",note:"Verde rico + caramelo — sofisticado"},{k:"marinho",note:"Elegante e contrastado"}], shoes:[{k:"caramelo",note:"Tom sobre tom"},{k:"chocolate",note:"Aprofunda o look"}] },
    taupe:     { shirts:[{k:"marfim",note:"Neutro refinado"},{k:"coral",note:"Aquece com vivacidade"},{k:"esmeralda",note:"Natural e equilibrado"}], shoes:[{k:"camel",note:"Harmonioso e luminoso"},{k:"caramelo",note:"Ancora suavemente"}] },
    marinho:   { shirts:[{k:"pessego",note:"Suave e feminino"},{k:"coral",note:"Coral + marinho vivo — clássico"},{k:"marfim",note:"Look clean e luminoso"},{k:"canario",note:"Náutico solar"}], shoes:[{k:"camel",note:"Caramelo claro finaliza"},{k:"caramelo",note:"Combinação clássica"}] },
    coral:     { shirts:[{k:"marfim",note:"Branco quente para o coral brilhar"},{k:"creme",note:"Suave e luminoso"}], shoes:[{k:"marfim",note:"Visual fresco"},{k:"camel",note:"Aquece sem competir"}] },
    piscina:   { shirts:[{k:"marfim",note:"Fresco e moderno"},{k:"creme",note:"Suave e arejado"}], shoes:[{k:"marfim",note:"Limpo e leve"},{k:"camel",note:"Toque quente"}] },
  },
  shoe: {
    marfim:    { shirts:[{k:"coral",note:"Tom claro deixa o coral brilhar"},{k:"pessego",note:"Suave e luminoso"},{k:"melancia",note:"Feminina e fresca"},{k:"esmeralda",note:"Sofisticado e leve"}], pants:[{k:"marinho",note:"Contraste limpo"},{k:"camel",note:"Tom sobre tom quente"},{k:"marfim",note:"Visual total marfim"}] },
    creme:     { shirts:[{k:"coral",note:"Luminoso e arejado"},{k:"pessego",note:"Feminino e sereno"}], pants:[{k:"camel",note:"Casual elegante"},{k:"areia",note:"Tom sobre tom suave"}] },
    camel:     { shirts:[{k:"marfim",note:"Clássico Spring"},{k:"marinho",note:"Sofisticado e luminoso"},{k:"coral",note:"Quente e cheio de luz"},{k:"esmeralda",note:"Rico sobre dourado"}], pants:[{k:"marfim",note:"Branco quente + camel — chique"},{k:"areia",note:"Tom sobre tom"},{k:"marinho",note:"Elegante e clássico"}] },
    caramelo:  { shirts:[{k:"marfim",note:"Visual limpo e ancorado"},{k:"esmeralda",note:"Verde + caramelo — chique"},{k:"marinho",note:"Contraste rico"},{k:"tomate",note:"Vibrante com âncora quente"}], pants:[{k:"marinho",note:"Combinação clássica feminina"},{k:"camel",note:"Tom sobre tom dourado"},{k:"marfim",note:"Limpo e elegante"}] },
    chocolate: { shirts:[{k:"marfim",note:"Contraste suave e refinado"},{k:"esmeralda",note:"Profundo e sofisticado"}], pants:[{k:"camel",note:"Coeso e elegante"},{k:"marinho",note:"Sóbrio e moderno"}] },
    areia:     { shirts:[{k:"coral",note:"Suave + vivo — perfeito"},{k:"pessego",note:"Tons claros do verão"},{k:"marfim",note:"Total clean"}], pants:[{k:"marfim",note:"Branco quente + areia"},{k:"areia",note:"Tom sobre tom"}] },
    pessego:   { shirts:[{k:"marfim",note:"Suave e luminoso"},{k:"creme",note:"Visual aberto e delicado"}], pants:[{k:"marinho",note:"Sapatilha pêssego + marinho — feminino"},{k:"marfim",note:"Total light"}] },
    marinho:   { shirts:[{k:"marfim",note:"Sapato marinho ancora o branco"},{k:"pessego",note:"Suave e contrastado"},{k:"coral",note:"Coral + marinho — clássico"}], pants:[{k:"marfim",note:"Look limpo e elegante"},{k:"creme",note:"Náutico luminoso"}] },
  },
};

const PATTERN_COMBOS_SPRING = {
  shirt: {
    "stripes-h": [
      { name:"Marfim + Marinho", colors:["#FFF4D8","#123E78"], look:[{role:"shirt",ck:"marfim"},{role:"pants",ck:"marinho"},{role:"shoe",ck:"caramelo"}], note:"Clássico náutico Spring — luminoso e atemporal." },
      { name:"Marfim + Coral", colors:["#FFF4D8","#FF6F61"], look:[{role:"shirt",ck:"marfim"},{role:"pants",ck:"marfim"},{role:"shoe",ck:"camel"}], note:"Listras femininas e cheias de luz." },
      { name:"Creme + Piscina", colors:["#FFEFC4","#00AEEF"], look:[{role:"shirt",ck:"creme"},{role:"pants",ck:"marfim"},{role:"shoe",ck:"marfim"}], note:"Listras vibrantes de verão." },
      { name:"Marfim + Pink quente", colors:["#FFF4D8","#F72585"], look:[{role:"shirt",ck:"marfim"},{role:"pants",ck:"marinho"},{role:"shoe",ck:"marfim"}], note:"Feminino e energético." },
    ],
    "stripes": [
      { name:"Marfim + Marinho vertical", colors:["#FFF4D8","#123E78"], look:[{role:"shirt",ck:"marfim"},{role:"pants",ck:"camel"},{role:"shoe",ck:"caramelo"}], note:"Listras verticais elegantes e arejadas." },
      { name:"Marfim + Camel", colors:["#FFF4D8","#C99A5B"], look:[{role:"shirt",ck:"marfim"},{role:"pants",ck:"marinho"},{role:"shoe",ck:"caramelo"}], note:"Tom sobre tom dourado." },
      { name:"Creme + Coral", colors:["#FFEFC4","#FF6F61"], look:[{role:"shirt",ck:"creme"},{role:"pants",ck:"marfim"},{role:"shoe",ck:"marfim"}], note:"Verão luminoso." },
    ],
    "check": [
      { name:"Coral + Marfim + Marinho", colors:["#FF6F61","#FFF4D8","#123E78"], look:[{role:"shirt",ck:"coral"},{role:"pants",ck:"marfim"},{role:"shoe",ck:"marfim"}], note:"Xadrez vibrante e luminoso — muito Spring." },
      { name:"Marinho + Marfim + Camel", colors:["#123E78","#FFF4D8","#C99A5B"], look:[{role:"shirt",ck:"marinho"},{role:"pants",ck:"marfim"},{role:"shoe",ck:"caramelo"}], note:"Elegante e fresco para o trabalho." },
      { name:"Pink + Marfim + Marinho", colors:["#F72585","#FFF4D8","#123E78"], look:[{role:"shirt",ck:"pink"},{role:"pants",ck:"marinho"},{role:"shoe",ck:"marfim"}], note:"Alta saturação feminina." },
      { name:"Tangerina + Marfim + Caramelo", colors:["#FF8C1A","#FFF4D8","#B9803F"], look:[{role:"shirt",ck:"tangerina"},{role:"pants",ck:"marfim"},{role:"shoe",ck:"caramelo"}], note:"Solar e moderno." },
    ],
    "herringbone": [
      { name:"Caramelo herringbone", colors:["#B9803F","#8A5A35"], look:[{role:"shirt",ck:"marfim"},{role:"pants",ck:"camel"},{role:"shoe",ck:"caramelo"}], note:"Textura rica e elegante." },
      { name:"Marinho herringbone", colors:["#123E78","#003B71"], look:[{role:"shirt",ck:"marfim"},{role:"pants",ck:"marinho"},{role:"shoe",ck:"caramelo"}], note:"Sofisticado e luminoso." },
      { name:"Camel herringbone", colors:["#C99A5B","#B9803F"], look:[{role:"shirt",ck:"marfim"},{role:"pants",ck:"camel"},{role:"shoe",ck:"caramelo"}], note:"Neutro quente, muito feminino." },
    ],
    "houndstooth": [
      { name:"Marinho + Marfim", colors:["#123E78","#FFF4D8"], look:[{role:"shirt",ck:"marinho"},{role:"pants",ck:"marfim"},{role:"shoe",ck:"caramelo"}], note:"Substitui preto/branco — clássico Spring." },
      { name:"Caramelo + Marfim", colors:["#B9803F","#FFF4D8"], look:[{role:"shirt",ck:"caramelo"},{role:"pants",ck:"marfim"},{role:"shoe",ck:"caramelo"}], note:"Tom sobre tom luminoso." },
    ],
    "windowpane": [
      { name:"Marfim + Linhas coral", colors:["#FFF4D8","#FF6F61"], look:[{role:"shirt",ck:"marfim"},{role:"pants",ck:"marinho"},{role:"shoe",ck:"caramelo"}], note:"Delicado e cheio de vida." },
      { name:"Camel + Linhas marinho", colors:["#C99A5B","#123E78"], look:[{role:"shirt",ck:"camel"},{role:"pants",ck:"marfim"},{role:"shoe",ck:"caramelo"}], note:"Elegante para o dia a dia." },
    ],
    "polka": [
      { name:"Marinho + Poá marfim", colors:["#123E78","#FFF4D8"], look:[{role:"shirt",ck:"marinho"},{role:"pants",ck:"marfim"},{role:"shoe",ck:"marfim"}], note:"Clássico feminino — Spring com sofisticação." },
      { name:"Coral + Poá marfim", colors:["#FF6F61","#FFF4D8"], look:[{role:"shirt",ck:"coral"},{role:"pants",ck:"marfim"},{role:"shoe",ck:"marfim"}], note:"Charmoso e luminoso." },
      { name:"Marfim + Poá pink", colors:["#FFF4D8","#F72585"], look:[{role:"shirt",ck:"marfim"},{role:"pants",ck:"marinho"},{role:"shoe",ck:"marfim"}], note:"Doce e vibrante." },
    ],
    "floral": [
      { name:"Marfim + Floral coral/esmeralda", colors:["#FFF4D8","#FF6F61","#00A36C"], look:[{role:"shirt",ck:"marfim"},{role:"pants",ck:"marfim"},{role:"shoe",ck:"caramelo"}], note:"Floral fresco — clássico Spring." },
      { name:"Marinho + Floral coral/canário", colors:["#123E78","#FF6F61","#FFD447"], look:[{role:"shirt",ck:"marinho"},{role:"pants",ck:"marfim"},{role:"shoe",ck:"marfim"}], note:"Floral vibrante sobre fundo escuro limpo." },
      { name:"Piscina + Flores pink/canário", colors:["#00AEEF","#F72585","#FFD447"], look:[{role:"shirt",ck:"piscina"},{role:"pants",ck:"marfim"},{role:"shoe",ck:"marfim"}], note:"Tropical alegre e luminoso." },
    ],
    "linen": [
      { name:"Textura marfim/creme", colors:["#FFF4D8","#FFEFC4"], look:[{role:"shirt",ck:"marfim"},{role:"pants",ck:"camel"},{role:"shoe",ck:"caramelo"}], note:"Linho luminoso — verão Spring." },
      { name:"Textura pêssego", colors:["#FFB07C","#F3CDAA"], look:[{role:"shirt",ck:"pessego"},{role:"pants",ck:"marinho"},{role:"shoe",ck:"marfim"}], note:"Suave e quente." },
    ],
    "tie-dye": [
      { name:"Coral + Pêssego + Marfim", colors:["#FF6F61","#FFB07C","#FFF4D8"], look:[{role:"shirt",ck:"coral"},{role:"pants",ck:"marfim"},{role:"shoe",ck:"marfim"}], note:"Tie-dye luminoso e quente — Spring puro." },
      { name:"Piscina + Água + Marfim", colors:["#00AEEF","#4ED9C4","#FFF4D8"], look:[{role:"shirt",ck:"piscina"},{role:"pants",ck:"marfim"},{role:"shoe",ck:"marfim"}], note:"Fresco e oceânico." },
    ],
  },
  pants: {
    "stripes": [
      { name:"Marinho + Marfim", colors:["#123E78","#FFF4D8"], look:[{role:"shirt",ck:"marfim"},{role:"pants",ck:"marinho"},{role:"shoe",ck:"caramelo"}], note:"Listras náuticas vivas." },
      { name:"Camel + Marfim", colors:["#C99A5B","#FFF4D8"], look:[{role:"shirt",ck:"coral"},{role:"pants",ck:"camel"},{role:"shoe",ck:"caramelo"}], note:"Listras suaves e luminosas." },
    ],
    "check": [
      { name:"Xadrez marfim/camel/coral", colors:["#FFF4D8","#C99A5B","#FF6F61"], look:[{role:"shirt",ck:"marfim"},{role:"pants",ck:"marfim"},{role:"shoe",ck:"caramelo"}], note:"Vibrante e feminino." },
      { name:"Xadrez marinho/marfim", colors:["#123E78","#FFF4D8"], look:[{role:"shirt",ck:"coral"},{role:"pants",ck:"marinho"},{role:"shoe",ck:"marfim"}], note:"Clássico Spring." },
    ],
    "herringbone": [
      { name:"Herringbone camel/caramelo", colors:["#C99A5B","#B9803F"], look:[{role:"shirt",ck:"marfim"},{role:"pants",ck:"camel"},{role:"shoe",ck:"caramelo"}], note:"Textura quente e sofisticada." },
      { name:"Herringbone marinho/marfim", colors:["#123E78","#FFF4D8"], look:[{role:"shirt",ck:"marfim"},{role:"pants",ck:"marinho"},{role:"shoe",ck:"caramelo"}], note:"Elegante e luminoso." },
    ],
    "houndstooth": [
      { name:"Pied-de-poule marfim/marinho", colors:["#FFF4D8","#123E78"], look:[{role:"shirt",ck:"marfim"},{role:"pants",ck:"marinho"},{role:"shoe",ck:"caramelo"}], note:"Clássico repaginado para Spring." },
      { name:"Caramelo/marfim micro", colors:["#B9803F","#FFF4D8"], look:[{role:"shirt",ck:"esmeralda"},{role:"pants",ck:"caramelo"},{role:"shoe",ck:"caramelo"}], note:"Micro padrão luminoso." },
    ],
    "windowpane": [
      { name:"Camel + Linhas coral", colors:["#C99A5B","#FF6F61"], look:[{role:"shirt",ck:"marfim"},{role:"pants",ck:"camel"},{role:"shoe",ck:"caramelo"}], note:"Windowpane feminino e quente." },
      { name:"Marfim + Linhas marinho", colors:["#FFF4D8","#123E78"], look:[{role:"shirt",ck:"coral"},{role:"pants",ck:"marfim"},{role:"shoe",ck:"caramelo"}], note:"Sutil e moderno." },
    ],
    "linen": [
      { name:"Linho marfim/areia", colors:["#FFF4D8","#E9D3A3"], look:[{role:"shirt",ck:"coral"},{role:"pants",ck:"marfim"},{role:"shoe",ck:"marfim"}], note:"Textura natural — verão Spring." },
      { name:"Sarja camel/caramelo", colors:["#C99A5B","#B9803F"], look:[{role:"shirt",ck:"marfim"},{role:"pants",ck:"camel"},{role:"shoe",ck:"caramelo"}], note:"Textura quente e luminosa." },
    ],
  },
};

const SWAPS_SPRING = [
  { bad:"Preto + Branco frio",          badColors:["#111111","#f8f8f8"],                       good:"Marinho vivo + Marfim",           goodColors:["#123E78","#FFF4D8"],                       pattern:"houndstooth" },
  { bad:"Cinza + Preto",                badColors:["#9099a0","#111111"],                       good:"Marfim + Marinho brilhante",      goodColors:["#FFF4D8","#123E78"],                       pattern:"check" },
  { bad:"Vinho fechado + Bordô",        badColors:["#5a1a25","#3d1116"],                       good:"Vermelho tomate + Coral",         goodColors:["#F9423A","#FF6F61"],                       pattern:"check" },
  { bad:"Mostarda suja + Marrom",       badColors:["#7a6520","#3b2a18"],                       good:"Tangerina viva + Caramelo",       goodColors:["#FF8C1A","#B9803F"],                       pattern:"stripes-h" },
  { bad:"Verde oliva militar",          badColors:["#4a4a2c","#3a3a22"],                       good:"Verde esmeralda + Marfim",        goodColors:["#00A36C","#FFF4D8"],                       pattern:"floral" },
  { bad:"Bege apagado + Cinza frio",    badColors:["#c2bba8","#9099a0"],                       good:"Pêssego vivo + Marfim",           goodColors:["#FFB07C","#FFF4D8"],                       pattern:"stripes" },
  { bad:"Lilás cinza acinzentado",      badColors:["#b098d8","#867aa0"],                       good:"Violeta claro vivo + Marfim",     goodColors:["#8F5CF7","#FFF4D8"],                       pattern:"polka" },
  { bad:"Rosa antigo / malva",          badColors:["#b07a85","#9d6c75"],                       good:"Rosa melancia + Pink quente",     goodColors:["#FF4F7B","#F72585"],                       pattern:"polka" },
];

// ─────────────────────────────────────────────
// ICON COMPONENTS
// ─────────────────────────────────────────────
const IconShirt = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d="M20.38 3.46 16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.57a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.57a2 2 0 0 0-1.34-2.23z" />
  </svg>
);
const IconPants = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d="M6 2h12l1 8-4 12H9L5 10Z" /><path d="M9 14h6" />
  </svg>
);
const IconShoe = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d="M2 18h20v2H2z" /><path d="M4 18V9l6-5 4 3 4-2v13" /><path d="M10 13l4-2" />
  </svg>
);
const IconBlouse = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" strokeLinecap="round">
    <path d="M8 3 L12 8 L16 3 L20 6 L18.5 11 L17 10.5 V21 H7 V10.5 L5.5 11 L4 6 Z" />
    <path d="M12 8 V14" />
  </svg>
);
const IconSkirt = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" strokeLinecap="round">
    <path d="M7 4 H17 L17.5 7 H6.5 Z" />
    <path d="M6.5 7 L3 21 H21 L17.5 7 Z" />
    <path d="M10 11 L9 21" />
    <path d="M14 11 L15 21" />
  </svg>
);
const IconHeel = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" strokeLinecap="round">
    <path d="M3 17 H18 L20 15 V12 L15 13 L10 8 H6 L4 13 Z" />
    <path d="M18 17 L19 21 H17 L17 17" />
    <path d="M3 19 H20" />
  </svg>
);
const IconClock = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ flexShrink: 0 }}>
    <circle cx="12" cy="12" r="10" /><path d="M12 8v4l3 3" />
  </svg>
);

// ─────────────────────────────────────────────
// PALETTE CONFIG REGISTRY
// ─────────────────────────────────────────────
const PALETTE_CONFIG = {
  "warm-autumn": {
    id: "warm-autumn",
    title: { prefix: "Warm", emph: "Autumn" },
    eyebrow: "Coloração Pessoal · Guia de Estilo",
    subtitle: "Paleta interativa para montagem de looks",
    footer: "Warm Autumn · Guia de Coloração Pessoal · Paleta baseada em Pantone TCX",
    toggleLabel: "Outono Quente",
    toggleShort: "Outono",
    accentDot: "#c08a4a",
    C: C_AUTUMN,
    PALETTES: PALETTES_AUTUMN,
    COMBOS: COMBOS_AUTUMN,
    PATTERN_COMBOS: PATTERN_COMBOS_AUTUMN,
    SWAPS: SWAPS_AUTUMN,
    PIECE_LABELS: {
      shirt: "Escolha a cor da camiseta / camisa:",
      pants: "Escolha a cor da calça:",
      shoe:  "Escolha a cor do sapato / tênis:",
    },
    PIECE_TABS: {
      shirt: "Camisa / Camiseta",
      pants: "Calça",
      shoe:  "Sapato / Tênis",
    },
    PIECE_ICONS: { shirt: IconShirt, pants: IconPants, shoe: IconShoe },
    AVOID: [
      { hex: "#f8f8f8", label: "Branco óptico" },
      { hex: "#111111", label: "Preto puro" },
      { hex: "#9099a0", label: "Cinza frio" },
      { hex: "#2040b8", label: "Azul royal" },
      { hex: "#e03090", label: "Rosa pink" },
      { hex: "#b098d8", label: "Lilás frio" },
      { hex: "#5040a0", label: "Roxo azulado" },
      { hex: "#20e8c0", label: "Neon / gélido" },
    ],
    METALS: [
      { grad: "linear-gradient(135deg,#d4af37,#b8902c)", label: "Dourado" },
      { grad: "linear-gradient(135deg,#b87333,#9a5b34)", label: "Cobre" },
      { grad: "linear-gradient(135deg,#a97142,#84592e)", label: "Bronze" },
      { grad: "linear-gradient(135deg,#b5a05f,#8c7836)", label: "Ouro envelhecido" },
      { grad: "linear-gradient(135deg,#d8c9a3,#bdaa82)", label: "Champanhe" },
    ],
    metalsNote: "Prata muito fria pesa menos bem; prata envelhecida ou champanhe pode funcionar dependendo do conjunto.",
    avoidHeading: "Cores que costumam destoar em Warm Autumn",
    swapHeading: "Trocas inteligentes — padrões para Warm Autumn",
    swapNote: "Substitua os padrões frios clássicos por versões quentes que favorecem sua coloração:",
    THEME_VARS: {
      "--warm-bg": "#f7f2ea",
      "--warm-bg2": "#efe8d8",
      "--warm-card": "#faf7f2",
      "--warm-brown": "#5c3d23",
      "--warm-brown-light": "#8a6040",
      "--warm-gold": "#c08a4a",
      "--warm-border": "rgba(120,90,50,0.15)",
      "--warm-border2": "rgba(120,90,50,0.28)",
      "--text-main": "#3a2710",
      "--text-muted": "#7a6450",
      "--text-light": "#b09a7c",
      "--header-fg": "#f5e8d0",
      "--header-fg-soft": "rgba(240,220,180,0.7)",
      "--header-fg-em": "#e8c48a",
      "--header-overlay": "radial-gradient(ellipse at 20% 50%,rgba(192,138,74,0.18) 0%,transparent 60%),radial-gradient(ellipse at 80% 30%,rgba(193,110,84,0.15) 0%,transparent 50%)",
      "--btn-active-fg": "#f5e8d0",
      "--avoid-stroke": "rgba(160,30,30,0.75)",
    },
  },
  "bright-spring": {
    id: "bright-spring",
    title: { prefix: "Bright", emph: "Spring" },
    eyebrow: "Coloração Pessoal · Guia de Estilo Feminino",
    subtitle: "Paleta interativa para montagem de looks vibrantes",
    footer: "Bright Spring · Guia de Coloração Pessoal · Paleta baseada em Pantone TCX",
    toggleLabel: "Primavera Brilhante",
    toggleShort: "Primavera",
    accentDot: "#F72585",
    C: C_SPRING,
    PALETTES: PALETTES_SPRING,
    COMBOS: COMBOS_SPRING,
    PATTERN_COMBOS: PATTERN_COMBOS_SPRING,
    SWAPS: SWAPS_SPRING,
    PIECE_LABELS: {
      shirt: "Escolha a cor da blusa:",
      pants: "Escolha a cor da saia ou calça:",
      shoe:  "Escolha a cor do sapato:",
    },
    PIECE_TABS: {
      shirt: "Blusa / Camisa",
      pants: "Saia / Calça",
      shoe:  "Sapato",
    },
    PIECE_ICONS: { shirt: IconBlouse, pants: IconSkirt, shoe: IconHeel },
    AVOID: [
      { hex: "#7a6520", label: "Mostarda suja" },
      { hex: "#5a1a25", label: "Vinho fechado" },
      { hex: "#4a4a2c", label: "Oliva militar" },
      { hex: "#c2bba8", label: "Bege acinzentado" },
      { hex: "#9099a0", label: "Cinza frio" },
      { hex: "#b098d8", label: "Lavanda fria" },
      { hex: "#b07a85", label: "Rosa antigo / malva" },
      { hex: "#3b2a18", label: "Marrom frio" },
    ],
    METALS: [
      { grad: "linear-gradient(135deg,#F7C948,#e0b432)", label: "Dourado claro" },
      { grad: "linear-gradient(135deg,#F7E3B2,#e6cf95)", label: "Champagne" },
      { grad: "linear-gradient(135deg,#F6B7A8,#e89a8a)", label: "Rose gold" },
      { grad: "linear-gradient(135deg,#d68a55,#b87333)", label: "Cobre claro" },
      { grad: "linear-gradient(135deg,#c69152,#a97142)", label: "Bronze luminoso" },
    ],
    metalsNote: "Prata muito fria e escovada tende a harmonizar menos; brilho dourado/champagne realça a luminosidade da Primavera Brilhante.",
    avoidHeading: "Cores que costumam destoar em Bright Spring",
    swapHeading: "Trocas inteligentes — padrões para Bright Spring",
    swapNote: "Substitua os padrões apagados, frios ou empoeirados por versões vivas e luminosas que favorecem sua coloração:",
    MAKEUP: {
      intro: "A maquiagem ideal deve parecer fresca, luminosa, colorida e limpa. Pele com acabamento natural, acetinado ou luminoso. Evite base muito matte, contorno cinza e pó pesado.",
      pele: [
        { label: "Base", value: "Natural, glow, satin, segunda pele" },
        { label: "Corretivo", value: "Leve a médio, sem acinzentar" },
        { label: "Pó", value: "Translúcido fino, só onde precisa" },
        { label: "Iluminador", value: "Champagne, dourado claro, pêssego luminoso" },
        { label: "Bronzer", value: "Dourado claro, mel, caramelo suave" },
      ],
      blush: [
        { hex: "#FFB07C", name: "Pêssego vivo",   note: "Natural e fresco" },
        { hex: "#FF7F7A", name: "Coral claro",    note: "Muito harmônico" },
        { hex: "#FF6F61", name: "Rosa coral",     note: "Feminino e alegre" },
        { hex: "#FF4F7B", name: "Rosa melancia",  note: "Mais impactante" },
        { hex: "#FF9F45", name: "Tangerina suave",note: "Moderno e solar" },
        { hex: "#F76F72", name: "Goiaba",         note: "Ótimo para pele média" },
      ],
      blushAvoid: "Evite blush malva, rosa queimado, vinho, marrom frio e ameixa.",
      iluminador: [
        { hex: "#F7E3B2", name: "Champagne claro" },
        { hex: "#F7C948", name: "Dourado suave" },
        { hex: "#FFD0A6", name: "Pêssego perolado" },
        { hex: "#F6B7A8", name: "Rosé quente luminoso" },
      ],
      iluminadorAvoid: "Evite iluminador prateado frio, gelo ou lilás se ficar artificial.",
      batomDia: [
        { hex: "#FF7F7A", name: "Coral claro",            note: "Natural, bonito e seguro" },
        { hex: "#F4A896", name: "Pêssego rosado",         note: "Nude ideal da cartela" },
        { hex: "#F76F72", name: "Rosa goiaba",            note: "Alegre sem pesar" },
        { hex: "#FF6F91", name: "Rosa melancia suave",    note: "Boca saudável" },
        { hex: "#FF8C42", name: "Tangerina translúcido", note: "Moderno e fresco" },
        { hex: "#FF6F61", name: "Gloss coral",            note: "Excelente para maquiagem leve" },
      ],
      batomMarcante: [
        { hex: "#F9423A", name: "Vermelho tomate",   note: "Clássico da cartela" },
        { hex: "#FF5349", name: "Vermelho coral",    note: "Elegante e quente" },
        { hex: "#F4364C", name: "Vermelho melancia", note: "Vivo e feminino" },
        { hex: "#F72585", name: "Pink quente",        note: "Impactante" },
        { hex: "#D92B8A", name: "Fúcsia quente",      note: "Forte, mas harmônico" },
        { hex: "#FF8C1A", name: "Laranja tangerina",  note: "Fashion e luminoso" },
        { hex: "#E40046", name: "Cereja brilhante",   note: "Melhor se não for vinho" },
      ],
      batomNude: "Para Primavera Brilhante, o nude raramente é bege apagado — o melhor nude costuma ser um pêssego rosado, coral suave ou rosa quente translúcido.",
      batomAcabamentos: {
        bons: ["Cremoso", "Acetinado", "Glossy", "Balm pigmentado", "Lip tint coral / melancia", "Laqueado"],
        evitar: ["Matte muito seco", "Batom muito escuro", "Nude bege acinzentado", "Marrom frio", "Malva", "Vinho fechado", "Rosa queimado"],
      },
      sombrasNeutras: [
        { hex: "#F7E3B2", name: "Champagne",                 note: "Iluminar canto interno" },
        { hex: "#F7C948", name: "Dourado claro",             note: "Pálpebra móvel" },
        { hex: "#FFB07C", name: "Pêssego acetinado",         note: "Maquiagem diária" },
        { hex: "#F3CDAA", name: "Bege quente luminoso",      note: "Base de sombra" },
        { hex: "#B9803F", name: "Caramelo claro",            note: "Côncavo suave" },
        { hex: "#C6924B", name: "Bronze claro",              note: "Noite, sem pesar" },
        { hex: "#8A5A35", name: "Marrom chocolate ao leite", note: "Delineado suave" },
      ],
      sombrasColoridas: [
        { hex: "#00B8C8", name: "Turquesa",        note: "Delineado colorido" },
        { hex: "#4ED9C4", name: "Verde água",      note: "Ponto de luz" },
        { hex: "#FF6F61", name: "Coral",           note: "Sombra moderna" },
        { hex: "#FFB07C", name: "Pêssego vivo",    note: "Maquiagem leve" },
        { hex: "#F72585", name: "Rosa quente",     note: "Monocromática feminina" },
        { hex: "#00AEEF", name: "Azul piscina",    note: "Delineado ou detalhe" },
        { hex: "#F7C948", name: "Dourado",         note: "Festa" },
      ],
      delineador: [
        "Marrom chocolate vivo",
        "Marrom café quente",
        "Azul marinho vivo",
        "Verde petróleo luminoso",
        "Bronze",
        "Cobre",
        "Turquesa escuro",
      ],
      delineadorNote: "Máscara preta funciona, mas a marrom escura costuma ficar mais integrada em looks suaves.",
      unhas: [
        { hex: "#FF6F61", name: "Coral" },
        { hex: "#FFB07C", name: "Pêssego vivo" },
        { hex: "#F76F72", name: "Goiaba" },
        { hex: "#FF4F7B", name: "Melancia" },
        { hex: "#F9423A", name: "Vermelho tomate" },
        { hex: "#FF8C1A", name: "Tangerina" },
        { hex: "#F72585", name: "Pink quente" },
        { hex: "#00B8C8", name: "Turquesa" },
        { hex: "#4ED9C4", name: "Verde água" },
        { hex: "#F7C948", name: "Dourado claro" },
        { hex: "#EAB893", name: "Nude pêssego" },
        { hex: "#FFF4D8", name: "Branco quente" },
      ],
      unhasAvoid: "Evite nude acinzentado, vinho escuro, marrom frio e lilás cinza.",
    },
    THEME_VARS: {
      "--warm-bg": "#FFF4D8",
      "--warm-bg2": "#FFEFC4",
      "--warm-card": "#FFFBEE",
      "--warm-brown": "#123E78",
      "--warm-brown-light": "#246BFE",
      "--warm-gold": "#F7C948",
      "--warm-border": "rgba(18,62,120,0.15)",
      "--warm-border2": "rgba(18,62,120,0.28)",
      "--text-main": "#0F2A4F",
      "--text-muted": "#4A5E7A",
      "--text-light": "#8AA0BD",
      "--header-fg": "#FFF4D8",
      "--header-fg-soft": "rgba(255,244,216,0.78)",
      "--header-fg-em": "#FFD447",
      "--header-overlay": "radial-gradient(ellipse at 20% 50%,rgba(255,111,97,0.22) 0%,transparent 60%),radial-gradient(ellipse at 80% 30%,rgba(247,37,133,0.18) 0%,transparent 55%)",
      "--btn-active-fg": "#FFF4D8",
      "--avoid-stroke": "rgba(200,30,80,0.75)",
    },
  },
};

// ─────────────────────────────────────────────
// CONTEXT
// ─────────────────────────────────────────────
const PaletteContext = createContext(null);
const usePalette = () => useContext(PaletteContext);

// ─────────────────────────────────────────────
// PATTERN DRAWING UTILITY
// ─────────────────────────────────────────────
function drawPattern(canvas, type, colors, scale = 1) {
  const ctx = canvas.getContext("2d");
  const w = canvas.width, h = canvas.height;
  ctx.clearRect(0, 0, w, h);

  if (type === "stripes") {
    const [c1, c2] = colors;
    const sw = Math.round(10 * scale);
    let x = 0;
    while (x < w) { ctx.fillStyle = c1; ctx.fillRect(x, 0, sw, h); x += sw; ctx.fillStyle = c2; ctx.fillRect(x, 0, sw, h); x += sw; }
  } else if (type === "stripes-h") {
    const [c1, c2] = colors;
    const sw = Math.round(9 * scale);
    let y = 0;
    while (y < h) { ctx.fillStyle = c1; ctx.fillRect(0, y, w, sw); y += sw; ctx.fillStyle = c2; ctx.fillRect(0, y, w, sw); y += sw; }
  } else if (type === "check") {
    const [c1, c2, c3] = colors;
    const sz = Math.round(14 * scale);
    ctx.fillStyle = c1; ctx.fillRect(0, 0, w, h);
    for (let y = 0; y < h; y += sz * 2) for (let x = 0; x < w; x += sz * 2) { ctx.fillStyle = c2; ctx.fillRect(x, y, sz, sz); ctx.fillRect(x + sz, y + sz, sz, sz); }
    if (c3) { ctx.strokeStyle = c3; ctx.lineWidth = 1.5 * scale; for (let x = 0; x <= w; x += sz) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke(); } for (let y = 0; y <= h; y += sz) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke(); } }
  } else if (type === "herringbone") {
    const [c1, c2] = colors;
    ctx.fillStyle = c1; ctx.fillRect(0, 0, w, h);
    const sz = Math.round(8 * scale);
    ctx.strokeStyle = c2; ctx.lineWidth = sz * 0.55;
    for (let y = -h; y < h * 2; y += sz * 2) for (let x = -w; x < w * 2; x += sz * 4) {
      ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + sz * 2, y + sz * 2); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(x + sz * 2, y); ctx.lineTo(x, y + sz * 2); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(x + sz * 2, y + sz * 2); ctx.lineTo(x + sz * 4, y); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(x + sz * 4, y + sz * 2); ctx.lineTo(x + sz * 2, y); ctx.stroke();
    }
  } else if (type === "houndstooth") {
    const [c1, c2] = colors;
    const sz = Math.round(10 * scale);
    ctx.fillStyle = c1; ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = c2;
    for (let y = 0; y < h + sz * 2; y += sz * 2) for (let x = 0; x < w + sz * 2; x += sz * 2) {
      ctx.beginPath();
      ctx.moveTo(x, y); ctx.lineTo(x + sz, y); ctx.lineTo(x + sz, y + sz * 0.5);
      ctx.lineTo(x + sz * 1.5, y); ctx.lineTo(x + sz * 2, y); ctx.lineTo(x + sz * 2, y + sz);
      ctx.lineTo(x + sz * 1.5, y + sz); ctx.lineTo(x + sz * 2, y + sz * 1.5);
      ctx.lineTo(x + sz * 2, y + sz * 2); ctx.lineTo(x + sz, y + sz * 2);
      ctx.lineTo(x + sz, y + sz * 1.5); ctx.lineTo(x + sz * 0.5, y + sz * 2);
      ctx.lineTo(x, y + sz * 2); ctx.lineTo(x, y + sz); ctx.lineTo(x + sz * 0.5, y + sz);
      ctx.lineTo(x, y + sz * 0.5); ctx.closePath(); ctx.fill();
    }
  } else if (type === "windowpane") {
    const [c1, c2] = colors;
    ctx.fillStyle = c1; ctx.fillRect(0, 0, w, h);
    const sz = Math.round(18 * scale);
    ctx.strokeStyle = c2; ctx.lineWidth = 1.5 * scale;
    for (let x = 0; x <= w; x += sz) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke(); }
    for (let y = 0; y <= h; y += sz) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke(); }
  } else if (type === "polka") {
    const [c1, c2] = colors;
    ctx.fillStyle = c1; ctx.fillRect(0, 0, w, h);
    const r = Math.round(4 * scale), sp = Math.round(14 * scale);
    ctx.fillStyle = c2;
    for (let y = r; y < h; y += sp) for (let x = r; x < w; x += sp) { ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill(); }
  } else if (type === "floral") {
    const [c1, c2, c3] = colors;
    ctx.fillStyle = c1; ctx.fillRect(0, 0, w, h);
    const petals = 5, r = Math.max(4, Math.round(5 * scale)), sp = Math.max(16, Math.round(20 * scale));
    for (let y = sp / 2; y < h; y += sp) for (let x = sp / 2; x < w; x += sp) {
      ctx.fillStyle = c2;
      for (let p = 0; p < petals; p++) { const a = (p / petals) * Math.PI * 2; ctx.beginPath(); ctx.ellipse(x + Math.cos(a) * r * 0.8, y + Math.sin(a) * r * 0.8, Math.max(1, r * 0.7), Math.max(1, r * 0.4), a, 0, Math.PI * 2); ctx.fill(); }
      ctx.fillStyle = c3 || c2; ctx.beginPath(); ctx.arc(x, y, Math.max(1, r * 0.45), 0, Math.PI * 2); ctx.fill();
    }
  } else if (type === "camo") {
    const cols = colors;
    ctx.fillStyle = cols[0]; ctx.fillRect(0, 0, w, h);
    const seed = (x, y) => Math.abs(Math.sin(x * 127.1 + y * 311.7) * 43758.5453) % 1;
    for (let i = 0; i < 80; i++) {
      const sx = seed(i, 0) * w, sy = seed(0, i) * h;
      const sz = Math.max(4, seed(i, i) * 20 * scale + 6 * scale);
      const ci = Math.floor(seed(i, i * 2) * 3) % cols.length;
      ctx.fillStyle = cols[ci];
      ctx.beginPath(); ctx.ellipse(sx, sy, sz, Math.max(2, sz * 0.55), seed(i, i * 3) * Math.PI, 0, Math.PI * 2); ctx.fill();
    }
  } else if (type === "linen") {
    const [c1, c2] = colors;
    ctx.fillStyle = c1; ctx.fillRect(0, 0, w, h);
    ctx.strokeStyle = c2; ctx.lineWidth = 0.8 * scale; ctx.globalAlpha = 0.35;
    const sp = 3 * scale;
    for (let x = 0; x < w; x += sp) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke(); }
    for (let y = 0; y < h; y += sp) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke(); }
    ctx.globalAlpha = 1;
  } else if (type === "tie-dye") {
    const [c1, c2, c3] = colors;
    const cx2 = w / 2, cy2 = h / 2;
    const grad = ctx.createRadialGradient(cx2, cy2, 0, cx2, cy2, Math.max(w, h) * 0.7);
    grad.addColorStop(0, c1); grad.addColorStop(0.4, c2); grad.addColorStop(0.7, c3 || c1); grad.addColorStop(1, c2);
    ctx.fillStyle = grad; ctx.fillRect(0, 0, w, h);
    ctx.strokeStyle = "rgba(255,255,255,0.12)"; ctx.lineWidth = 1.5 * scale;
    for (let r2 = 4; r2 < Math.max(w, h); r2 += 6 * scale) { ctx.beginPath(); ctx.arc(cx2, cy2, r2, 0, Math.PI * 2); ctx.stroke(); }
  }
}

// ─────────────────────────────────────────────
// PATTERN CANVAS COMPONENT
// ─────────────────────────────────────────────
function PatternCanvas({ type, colors, width, height, scale = 1, style = {}, className = "" }) {
  const canvasRef = useRef(null);
  useEffect(() => {
    if (canvasRef.current) drawPattern(canvasRef.current, type, colors, scale);
  }, [type, colors, scale]);
  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      style={{ display: "block", width, height, ...style }}
      className={className}
    />
  );
}

// ─────────────────────────────────────────────
// COLORS TAB
// ─────────────────────────────────────────────
function ColorsTab() {
  const cfg = usePalette();
  const { C, PALETTES, PIECE_LABELS, PIECE_TABS, PIECE_ICONS, AVOID, METALS, metalsNote, avoidHeading } = cfg;
  const [piece, setPiece] = useState("shirt");
  const [selected, setSelected] = useState(null);

  const handleSetPiece = (p) => { setPiece(p); setSelected(null); };

  return (
    <div>
      {/* Piece selector */}
      <div className="section-label">Selecione a peça</div>
      <div className="piece-selector">
        {["shirt","pants","shoe"].map((id) => {
          const Icon = PIECE_ICONS[id];
          return (
            <button
              key={id}
              className={`piece-btn${piece === id ? " active" : ""}`}
              onClick={() => handleSetPiece(id)}
            >
              <Icon /> {PIECE_TABS[id]}
            </button>
          );
        })}
      </div>

      {/* Palette */}
      <div className="palette-section">
        <div className="section-label">{PIECE_LABELS[piece]}</div>
        <div className="palette-grid">
          {PALETTES[piece].map((k) => (
            <div
              key={k}
              className={`color-chip${selected === k ? " selected" : ""}`}
              onClick={() => setSelected(selected === k ? null : k)}
            >
              <div className="chip-swatch" style={{ background: C[k].hex }} />
              <div className="chip-label">{C[k].name}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="divider" />

      {/* Result */}
      <ResultSection piece={piece} selected={selected} />

      <div className="divider" />

      {/* Avoid */}
      <div>
        <div className="section-label">{avoidHeading}</div>
        <div className="avoid-grid">
          {AVOID.map(({ hex, label }) => (
            <div key={label} className="avoid-chip">
              <div className="avoid-swatch" style={{ background: hex }} />
              <div className="avoid-label">{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Metals */}
      <div className="info-box" style={{ marginTop: "2rem" }}>
        <div className="info-box-title">Metais que favorecem</div>
        <div className="info-tags">
          {METALS.map(({ grad, label }) => (
            <div key={label} className="info-tag">
              <div className="dot" style={{ background: grad }} />
              {label}
            </div>
          ))}
        </div>
        <p style={{ fontSize: 12, color: "var(--text-light)", marginTop: ".75rem", fontStyle: "italic" }}>
          {metalsNote}
        </p>
      </div>
    </div>
  );
}

function ResultSection({ piece, selected }) {
  const cfg = usePalette();
  const { C, COMBOS, PIECE_TABS } = cfg;

  if (!selected) {
    return (
      <div className="result-empty">
        <IconClock />
        Selecione uma cor acima para ver as combinações
      </div>
    );
  }

  const c = C[selected];
  const combos = COMBOS[piece][selected] || {};

  const rows = (items, role) =>
    items.map(({ k, note }) => (
      <div key={k} className="suggestion-row fade-in">
        <div className="sugg-swatch" style={{ background: C[k].hex }} />
        <div className="sugg-body">
          <div className="sugg-role">{role}</div>
          <div className="sugg-name">{C[k].name}</div>
          <div className="sugg-note">{note}</div>
        </div>
      </div>
    ));

  const fullLookPieces =
    piece === "shirt" && combos.pants?.length && combos.shoes?.length
      ? [{ role: PIECE_TABS.shirt, hex: c.hex, name: c.name }, { role: PIECE_TABS.pants, hex: C[combos.pants[0].k].hex, name: C[combos.pants[0].k].name }, { role: PIECE_TABS.shoe, hex: C[combos.shoes[0].k].hex, name: C[combos.shoes[0].k].name }]
      : piece === "pants" && combos.shirts?.length && combos.shoes?.length
      ? [{ role: PIECE_TABS.shirt, hex: C[combos.shirts[0].k].hex, name: C[combos.shirts[0].k].name }, { role: PIECE_TABS.pants, hex: c.hex, name: c.name }, { role: PIECE_TABS.shoe, hex: C[combos.shoes[0].k].hex, name: C[combos.shoes[0].k].name }]
      : piece === "shoe" && combos.shirts?.length && combos.pants?.length
      ? [{ role: PIECE_TABS.shirt, hex: C[combos.shirts[0].k].hex, name: C[combos.shirts[0].k].name }, { role: PIECE_TABS.pants, hex: C[combos.pants[0].k].hex, name: C[combos.pants[0].k].name }, { role: PIECE_TABS.shoe, hex: c.hex, name: c.name }]
      : null;

  return (
    <div className="result-section">
      <div className="result-header fade-in">
        <div className="result-color-dot" style={{ background: c.hex }} />
        <div className="result-title">
          Combinações com <span>{c.name}</span>
        </div>
      </div>

      {piece === "shirt" && (
        <>
          {combos.pants?.length > 0 && <><div className="result-sub-label">{PIECE_TABS.pants} que combinam</div><div className="suggestions-grid">{rows(combos.pants, PIECE_TABS.pants)}</div></>}
          {combos.shoes?.length > 0 && <><div className="result-sub-label">{PIECE_TABS.shoe}</div><div className="suggestions-grid">{rows(combos.shoes, PIECE_TABS.shoe)}</div></>}
        </>
      )}
      {piece === "pants" && (
        <>
          {combos.shirts?.length > 0 && <><div className="result-sub-label">{PIECE_TABS.shirt}</div><div className="suggestions-grid">{rows(combos.shirts, PIECE_TABS.shirt)}</div></>}
          {combos.shoes?.length > 0 && <><div className="result-sub-label">{PIECE_TABS.shoe}</div><div className="suggestions-grid">{rows(combos.shoes, PIECE_TABS.shoe)}</div></>}
        </>
      )}
      {piece === "shoe" && (
        <>
          {combos.shirts?.length > 0 && <><div className="result-sub-label">{PIECE_TABS.shirt}</div><div className="suggestions-grid">{rows(combos.shirts, PIECE_TABS.shirt)}</div></>}
          {combos.pants?.length > 0 && <><div className="result-sub-label">{PIECE_TABS.pants}</div><div className="suggestions-grid">{rows(combos.pants, PIECE_TABS.pants)}</div></>}
        </>
      )}

      {fullLookPieces && (
        <div className="full-look fade-in">
          <div className="full-look-header">Look completo sugerido</div>
          <div className="full-look-pieces">
            {fullLookPieces.map((p) => (
              <div key={p.role} className="look-piece">
                <div className="look-swatch" style={{ background: p.hex }} />
                <div className="look-meta">
                  <div className="look-role">{p.role}</div>
                  <div className="look-name">{p.name}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// PATTERNS TAB
// ─────────────────────────────────────────────
function PatternsTab() {
  const cfg = usePalette();
  const { C, PATTERN_COMBOS, PIECE_TABS, PIECE_ICONS, swapHeading, swapNote } = cfg;
  const [patternPiece, setPatternPiece] = useState("shirt");
  const [selectedPattern, setSelectedPattern] = useState(null);

  const handleSetPatternPiece = (p) => { setPatternPiece(p); setSelectedPattern(null); };

  const availablePatterns = PATTERN_TYPES.filter(
    (pt) => (PATTERN_COMBOS[patternPiece]?.[pt.id] || []).length > 0
  );

  const pieceLabel = PIECE_TABS[patternPiece];
  const combos = selectedPattern ? (PATTERN_COMBOS[patternPiece]?.[selectedPattern] || []) : [];

  const roleDisplayMap = PIECE_TABS;

  return (
    <div>
      {/* Piece selector */}
      <div className="section-label">Selecione o tipo de peça</div>
      <div className="pattern-piece-selector">
        {["shirt","pants"].map((id) => {
          const Icon = PIECE_ICONS[id];
          return (
            <button
              key={id}
              className={`piece-btn${patternPiece === id ? " active" : ""}`}
              onClick={() => handleSetPatternPiece(id)}
            >
              <Icon /> {PIECE_TABS[id]}
            </button>
          );
        })}
      </div>

      {/* Pattern type grid */}
      <div className="section-label">Escolha o padrão</div>
      <div className="pattern-types-grid">
        {availablePatterns.map((pt) => {
          const previewColors = (PATTERN_COMBOS[patternPiece][pt.id] || [])[0]?.colors || ["#ccc"];
          return (
            <div
              key={pt.id}
              className={`pattern-type-chip${selectedPattern === pt.id ? " selected" : ""}`}
              onClick={() => setSelectedPattern(selectedPattern === pt.id ? null : pt.id)}
            >
              <PatternCanvas
                type={pt.id}
                colors={previewColors}
                width={110}
                height={72}
                scale={1.1}
                style={{ borderRadius: "8px 8px 0 0" }}
              />
              <div className="pattern-type-label">{pt.name}</div>
            </div>
          );
        })}
      </div>

      <div className="divider" />

      {/* Pattern combos */}
      <div id="pattern-combos-area">
        {!selectedPattern ? (
          <div className="result-empty">
            <IconClock />
            Selecione um padrão acima para ver os looks
          </div>
        ) : combos.length === 0 ? (
          <div className="result-empty">Nenhuma combinação disponível para este padrão/peça.</div>
        ) : (
          combos.map((combo, i) => {
            const others = combo.look.filter((p) => p.role !== patternPiece);
            return (
              <div key={i} className="pattern-combo-card fade-in">
                <div className="pattern-combo-header">
                  <PatternCanvas
                    type={selectedPattern}
                    colors={combo.colors}
                    width={80}
                    height={56}
                    scale={0.85}
                    style={{ borderRadius: 6, border: "1px solid var(--warm-border2)", flexShrink: 0 }}
                  />
                  <div>
                    <div style={{ fontSize: 9.5, fontWeight: 500, letterSpacing: 2, textTransform: "uppercase", color: "var(--warm-gold)", marginBottom: 4 }}>
                      {pieceLabel} com padrão
                    </div>
                    <div className="pattern-combo-title">{combo.name}</div>
                    <div className="pattern-combo-desc">{combo.note}</div>
                  </div>
                </div>
                <div className="pattern-combo-body">
                  <div style={{ fontSize: 9.5, fontWeight: 500, letterSpacing: 2, textTransform: "uppercase", color: "var(--warm-gold)", marginBottom: 8 }}>
                    Combina com
                  </div>
                  <div className="pattern-combo-look">
                    {others.length === 0 ? (
                      <span style={{ fontSize: 12, color: "var(--text-light)", fontStyle: "italic" }}>
                        Veja as sugestões de cores sólidas na outra aba
                      </span>
                    ) : (
                      others.map((p) => {
                        const cc = C[p.ck];
                        return (
                          <div key={p.role} className="look-pill">
                            <div className="look-pill-dot" style={{ background: cc?.hex || "#ccc" }} />
                            <span style={{ fontSize: 11, color: "var(--text-light)" }}>{roleDisplayMap[p.role] || p.role}:</span>
                            &nbsp;{cc?.name || p.ck}
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      <div className="divider" />

      {/* Swap table */}
      <div className="section-label">{swapHeading}</div>
      <p style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: "1.25rem", fontStyle: "italic" }}>
        {swapNote}
      </p>
      <SwapTable />
    </div>
  );
}

function SwapTable() {
  const { SWAPS } = usePalette();
  return (
    <table className="swap-table">
      <thead>
        <tr>
          <th>Padrão comum</th>
          <th>Troca para a paleta</th>
        </tr>
      </thead>
      <tbody>
        {SWAPS.map((s, i) => (
          <tr key={i}>
            <td className="swap-bad">
              <div className="swap-pattern-cell">
                <div className="swap-canvas-wrap">
                  <PatternCanvas
                    type={s.pattern}
                    colors={s.badColors}
                    width={56}
                    height={36}
                    scale={0.5}
                    style={{ borderRadius: 5, border: "1px solid var(--warm-border2)" }}
                  />
                </div>
                <span style={{ fontSize: 12, color: "var(--text-muted)" }}>{s.bad}</span>
              </div>
            </td>
            <td>
              <div className="swap-pattern-cell">
                <span style={{ fontSize: 18, color: "var(--warm-gold)", marginRight: 4 }}>→</span>
                <div className="swap-canvas-wrap">
                  <PatternCanvas
                    type={s.pattern}
                    colors={s.goodColors}
                    width={56}
                    height={36}
                    scale={0.5}
                    style={{ borderRadius: 5, border: "1px solid var(--warm-border2)" }}
                  />
                </div>
                <span style={{ fontSize: 12, fontWeight: 500, color: "var(--text-main)" }}>{s.good}</span>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

// ─────────────────────────────────────────────
// MAKEUP TAB (palette-specific; only rendered when cfg.MAKEUP exists)
// ─────────────────────────────────────────────
function MakeupSwatchGrid({ items, withNote = true }) {
  return (
    <div className="palette-grid makeup-grid">
      {items.map((c) => (
        <div key={c.name + c.hex} className="color-chip makeup-chip">
          <div className="chip-swatch" style={{ background: c.hex }} />
          <div className="chip-label">
            <div className="makeup-name">{c.name}</div>
            {withNote && c.note && <div className="makeup-note">{c.note}</div>}
          </div>
        </div>
      ))}
    </div>
  );
}

function MakeupTab() {
  const cfg = usePalette();
  const m = cfg.MAKEUP;
  if (!m) return null;

  return (
    <div>
      <p className="makeup-intro">{m.intro}</p>

      <div className="section-label">Pele</div>
      <div className="makeup-list">
        {m.pele.map((p) => (
          <div key={p.label} className="makeup-row">
            <div className="makeup-row-label">{p.label}</div>
            <div className="makeup-row-value">{p.value}</div>
          </div>
        ))}
      </div>

      <div className="divider" />

      <div className="section-label">Blush</div>
      <MakeupSwatchGrid items={m.blush} />
      <p className="makeup-tip">{m.blushAvoid}</p>

      <div className="divider" />

      <div className="section-label">Iluminador</div>
      <MakeupSwatchGrid items={m.iluminador} withNote={false} />
      <p className="makeup-tip">{m.iluminadorAvoid}</p>

      <div className="divider" />

      <div className="section-label">Batons para o dia a dia</div>
      <MakeupSwatchGrid items={m.batomDia} />
      <p className="makeup-tip">{m.batomNude}</p>

      <div className="section-label" style={{ marginTop: "2rem" }}>Batons marcantes</div>
      <MakeupSwatchGrid items={m.batomMarcante} />

      <div className="info-box" style={{ marginTop: "1.5rem" }}>
        <div className="info-box-title">Acabamentos de batom</div>
        <div className="acabamentos-cols">
          <div>
            <div className="acabamento-h good">Melhores</div>
            <ul className="acabamento-list">
              {m.batomAcabamentos.bons.map((b) => <li key={b}>{b}</li>)}
            </ul>
          </div>
          <div>
            <div className="acabamento-h bad">Usar com cuidado</div>
            <ul className="acabamento-list">
              {m.batomAcabamentos.evitar.map((b) => <li key={b}>{b}</li>)}
            </ul>
          </div>
        </div>
      </div>

      <div className="divider" />

      <div className="section-label">Sombras neutras</div>
      <MakeupSwatchGrid items={m.sombrasNeutras} />

      <div className="section-label" style={{ marginTop: "2rem" }}>Sombras coloridas</div>
      <MakeupSwatchGrid items={m.sombrasColoridas} />

      <div className="info-box" style={{ marginTop: "1.5rem" }}>
        <div className="info-box-title">Delineador & Máscara</div>
        <div className="info-tags">
          {m.delineador.map((d) => (
            <div key={d} className="info-tag">
              <div className="dot" style={{ background: "var(--warm-brown)" }} />
              {d}
            </div>
          ))}
        </div>
        <p style={{ fontSize: 12, color: "var(--text-light)", marginTop: ".75rem", fontStyle: "italic" }}>
          {m.delineadorNote}
        </p>
      </div>

      <div className="divider" />

      <div className="section-label">Unhas</div>
      <MakeupSwatchGrid items={m.unhas} withNote={false} />
      <p className="makeup-tip">{m.unhasAvoid}</p>
    </div>
  );
}

// ─────────────────────────────────────────────
// PALETTE TOGGLE
// ─────────────────────────────────────────────
function PaletteToggle({ paletteId, onChange }) {
  return (
    <div className="palette-toggle" role="group" aria-label="Trocar paleta de cores">
      {Object.values(PALETTE_CONFIG).map((p) => (
        <button
          key={p.id}
          type="button"
          className={`pt-btn${paletteId === p.id ? " active" : ""}`}
          onClick={() => onChange(p.id)}
          aria-pressed={paletteId === p.id}
          aria-label={p.toggleLabel}
        >
          <span className="pt-dot" style={{ background: p.accentDot }} />
          <span className="pt-label-full">{p.toggleLabel}</span>
          <span className="pt-label-short">{p.toggleShort}</span>
        </button>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────
// ROOT APP
// ─────────────────────────────────────────────
const styles = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=DM+Sans:wght@300;400;500&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
:root{
  --warm-bg:#f7f2ea;--warm-bg2:#efe8d8;--warm-card:#faf7f2;
  --warm-brown:#5c3d23;--warm-brown-light:#8a6040;--warm-gold:#c08a4a;
  --warm-border:rgba(120,90,50,0.15);--warm-border2:rgba(120,90,50,0.28);
  --text-main:#3a2710;--text-muted:#7a6450;--text-light:#b09a7c;
  --header-fg:#f5e8d0;--header-fg-soft:rgba(240,220,180,0.7);--header-fg-em:#e8c48a;
  --header-overlay:radial-gradient(ellipse at 20% 50%,rgba(192,138,74,0.18) 0%,transparent 60%),radial-gradient(ellipse at 80% 30%,rgba(193,110,84,0.15) 0%,transparent 50%);
  --btn-active-fg:#f5e8d0;--avoid-stroke:rgba(160,30,30,0.75);
  --radius:10px;--radius-lg:16px;
}
html{font-size:16px;scroll-behavior:smooth}
body{font-family:'DM Sans',sans-serif;background:var(--warm-bg);color:var(--text-main);min-height:100vh;transition:background 0.4s ease,color 0.4s ease}
header{background:var(--warm-brown);padding:3rem 2rem 2.5rem;text-align:center;position:relative;overflow:hidden;transition:background 0.4s ease}
header::before{content:'';position:absolute;inset:0;background:var(--header-overlay);transition:background 0.4s ease}
.header-inner{position:relative;z-index:1}
.header-eyebrow{font-size:11px;font-weight:400;letter-spacing:5px;text-transform:uppercase;color:var(--header-fg-soft);margin-bottom:14px}
header h1{font-family:'Cormorant Garamond',serif;font-size:clamp(3rem,7vw,5rem);font-weight:300;color:var(--header-fg);letter-spacing:3px;line-height:1;margin-bottom:14px}
header h1 em{font-style:italic;color:var(--header-fg-em)}
.header-sub{font-size:13px;color:var(--header-fg-soft);letter-spacing:1px}
.palette-toggle{position:absolute;top:16px;right:16px;z-index:3;display:flex;background:rgba(0,0,0,0.20);border:1px solid rgba(255,255,255,0.18);border-radius:50px;padding:3px;backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px)}
.pt-btn{padding:7px 14px;border:none;background:transparent;border-radius:50px;font-family:'DM Sans',sans-serif;font-weight:500;font-size:11px;letter-spacing:1px;text-transform:uppercase;color:var(--header-fg-soft);cursor:pointer;display:flex;align-items:center;gap:7px;transition:background 0.25s ease,color 0.25s ease,transform 0.15s ease;line-height:1}
.pt-btn:hover{color:var(--header-fg)}
.pt-btn.active{background:var(--warm-gold);color:#1a1208}
.pt-btn.active:hover{color:#1a1208}
.pt-dot{width:9px;height:9px;border-radius:50%;flex-shrink:0;border:1px solid rgba(255,255,255,0.4)}
.pt-btn.active .pt-dot{border-color:rgba(0,0,0,0.15)}
.pt-label-short{display:none}
.tab-bar{display:flex;background:var(--warm-brown);border-top:1px solid rgba(255,255,255,0.08);transition:background 0.4s ease}
.tab-btn{flex:1;padding:12px 8px;font-family:'DM Sans',sans-serif;font-size:12px;font-weight:500;letter-spacing:1.5px;text-transform:uppercase;color:var(--header-fg-soft);background:none;border:none;cursor:pointer;transition:all 0.2s;border-bottom:2px solid transparent}
.tab-btn:hover{color:var(--header-fg)}
.tab-btn.active{color:var(--header-fg-em);border-bottom-color:var(--header-fg-em)}
.main{max-width:920px;margin:0 auto;padding:2.5rem 1.5rem 4rem}
.section-label{font-size:10px;font-weight:500;letter-spacing:4px;text-transform:uppercase;color:var(--warm-gold);margin-bottom:1rem}
.piece-selector{display:flex;gap:10px;margin-bottom:2rem;flex-wrap:wrap}
.piece-btn{display:flex;align-items:center;gap:8px;padding:10px 20px;border-radius:50px;border:1.5px solid var(--warm-border2);background:var(--warm-card);color:var(--text-muted);font-family:'DM Sans',sans-serif;font-size:13px;font-weight:500;cursor:pointer;transition:all 0.2s;user-select:none}
.piece-btn svg{flex-shrink:0;opacity:0.6;transition:opacity 0.2s}
.piece-btn:hover{border-color:var(--warm-gold);color:var(--warm-brown)}
.piece-btn:hover svg{opacity:1}
.piece-btn.active{background:var(--warm-brown);border-color:var(--warm-brown);color:var(--btn-active-fg)}
.piece-btn.active svg{opacity:1;filter:brightness(3)}
.palette-section{margin-bottom:2rem}
.palette-grid{display:flex;flex-wrap:wrap;gap:8px}
.color-chip{border-radius:var(--radius);overflow:hidden;cursor:pointer;border:2px solid transparent;transition:transform 0.15s,border-color 0.15s,box-shadow 0.15s;width:86px;background:var(--warm-card);box-shadow:0 1px 3px rgba(60,30,10,0.08)}
.color-chip:hover{transform:translateY(-3px);box-shadow:0 6px 16px rgba(90,50,20,0.15)}
.color-chip.selected{border-color:var(--warm-brown);box-shadow:0 0 0 3px rgba(92,61,35,0.18),0 4px 12px rgba(90,50,20,0.2)}
.chip-swatch{height:54px}
.chip-label{padding:5px 6px 6px;font-size:10.5px;color:var(--text-muted);line-height:1.3;border-top:1px solid var(--warm-border)}
.divider{height:1px;background:var(--warm-border2);margin:2rem 0}
.result-section{min-height:200px}
.result-empty{display:flex;align-items:center;gap:12px;padding:2.5rem 2rem;background:var(--warm-card);border:1.5px dashed var(--warm-border2);border-radius:var(--radius-lg);color:var(--text-light);font-size:14px;font-style:italic}
.result-header{display:flex;align-items:center;gap:12px;margin-bottom:1.5rem}
.result-color-dot{width:28px;height:28px;border-radius:50%;border:2px solid rgba(0,0,0,0.08);flex-shrink:0}
.result-title{font-family:'Cormorant Garamond',serif;font-size:1.5rem;font-weight:400}
.result-title span{color:var(--warm-brown-light);font-style:italic}
.suggestions-grid{display:flex;flex-direction:column;gap:10px}
.suggestion-row{display:flex;align-items:stretch;border-radius:var(--radius-lg);overflow:hidden;border:1.5px solid var(--warm-border);background:var(--warm-card);transition:border-color 0.15s,box-shadow 0.15s}
.suggestion-row:hover{border-color:var(--warm-border2);box-shadow:0 3px 12px rgba(90,50,20,0.1)}
.sugg-swatch{width:56px;flex-shrink:0}
.sugg-body{padding:12px 16px;flex:1;border-left:1px solid var(--warm-border);display:flex;flex-direction:column;justify-content:center;gap:3px}
.sugg-role{font-size:9.5px;font-weight:500;letter-spacing:2px;text-transform:uppercase;color:var(--text-light)}
.sugg-name{font-size:14px;font-weight:500}
.sugg-note{font-size:12px;color:var(--text-muted);font-style:italic;line-height:1.4}
.result-sub-label{font-size:9.5px;font-weight:500;letter-spacing:3px;text-transform:uppercase;color:var(--warm-gold);margin:1.5rem 0 0.75rem}
.full-look{margin-top:1.75rem;border-radius:var(--radius-lg);overflow:hidden;border:1.5px solid var(--warm-border2)}
.full-look-header{background:var(--warm-bg2);padding:10px 16px;font-size:9.5px;font-weight:500;letter-spacing:3px;text-transform:uppercase;color:var(--warm-brown-light);border-bottom:1px solid var(--warm-border2)}
.full-look-pieces{display:flex}
.look-piece{flex:1}
.look-piece+.look-piece .look-swatch{border-left:1px solid var(--warm-border)}
.look-swatch{height:64px}
.look-meta{padding:8px 12px;background:var(--warm-card);border-top:1px solid var(--warm-border)}
.look-piece+.look-piece .look-meta{border-left:1px solid var(--warm-border)}
.look-role{font-size:9px;letter-spacing:1.5px;text-transform:uppercase;color:var(--text-light);margin-bottom:2px}
.look-name{font-size:11.5px;font-weight:500;line-height:1.3}
.info-box{padding:1.25rem 1.5rem;border-radius:var(--radius-lg);background:linear-gradient(135deg,rgba(160,100,50,0.07),rgba(100,80,40,0.05));border:1px solid var(--warm-border2)}
.info-box-title{font-size:11px;font-weight:500;letter-spacing:2px;text-transform:uppercase;color:var(--warm-brown-light);margin-bottom:.75rem}
.info-tags{display:flex;flex-wrap:wrap;gap:6px}
.info-tag{padding:5px 12px;border-radius:50px;font-size:12px;color:var(--text-muted);border:1px solid var(--warm-border2);background:var(--warm-card);display:flex;align-items:center;gap:6px}
.info-tag .dot{width:9px;height:9px;border-radius:50%;flex-shrink:0}
.avoid-grid{display:flex;flex-wrap:wrap;gap:8px;margin-top:1.5rem}
.avoid-chip{width:82px;border-radius:var(--radius);overflow:hidden;border:1.5px solid var(--warm-border);background:var(--warm-card)}
.avoid-swatch{height:46px;position:relative}
.avoid-swatch::after{content:'';position:absolute;inset:0;background:linear-gradient(135deg,transparent 42%,var(--avoid-stroke) 43%,var(--avoid-stroke) 57%,transparent 58%)}
.avoid-label{padding:4px 6px 5px;font-size:10px;color:var(--text-muted);background:var(--warm-card);text-align:center;border-top:1px solid var(--warm-border)}
.pattern-piece-selector{display:flex;gap:10px;margin-bottom:2rem;flex-wrap:wrap}
.pattern-types-grid{display:flex;flex-wrap:wrap;gap:10px;margin-bottom:2rem}
.pattern-type-chip{border-radius:var(--radius);overflow:hidden;cursor:pointer;border:2px solid transparent;transition:transform 0.15s,border-color 0.15s,box-shadow 0.15s;width:110px;background:var(--warm-card);box-shadow:0 1px 3px rgba(60,30,10,0.08)}
.pattern-type-chip:hover{transform:translateY(-3px);box-shadow:0 6px 16px rgba(90,50,20,0.15)}
.pattern-type-chip.selected{border-color:var(--warm-brown);box-shadow:0 0 0 3px rgba(92,61,35,0.18)}
.pattern-type-label{padding:5px 6px 7px;font-size:11px;font-weight:500;color:var(--text-muted);text-align:center;border-top:1px solid var(--warm-border)}
.pattern-combo-card{background:var(--warm-card);border:1.5px solid var(--warm-border);border-radius:var(--radius-lg);overflow:hidden;margin-bottom:14px;transition:border-color 0.15s,box-shadow 0.15s}
.pattern-combo-card:hover{border-color:var(--warm-border2);box-shadow:0 4px 14px rgba(90,50,20,0.1)}
.pattern-combo-header{display:flex;align-items:center;gap:14px;padding:14px 16px;border-bottom:1px solid var(--warm-border);background:var(--warm-bg2)}
.pattern-combo-title{font-size:14px;font-weight:500}
.pattern-combo-desc{font-size:12px;color:var(--text-muted);font-style:italic;margin-top:2px;line-height:1.4}
.pattern-combo-body{padding:14px 16px}
.pattern-combo-look{display:flex;gap:8px;flex-wrap:wrap}
.look-pill{display:flex;align-items:center;gap:6px;padding:6px 12px;border-radius:50px;background:var(--warm-bg);border:1px solid var(--warm-border2);font-size:12px;color:var(--text-muted)}
.look-pill-dot{width:10px;height:10px;border-radius:50%;flex-shrink:0;border:1px solid rgba(0,0,0,0.1)}
.swap-table{width:100%;border-collapse:collapse;font-size:13px}
.swap-table th{font-size:9.5px;font-weight:500;letter-spacing:2px;text-transform:uppercase;color:var(--warm-gold);padding:8px 12px;border-bottom:1.5px solid var(--warm-border2);text-align:left;background:var(--warm-bg2)}
.swap-table td{padding:10px 12px;border-bottom:1px solid var(--warm-border);vertical-align:middle}
.swap-table tr:last-child td{border-bottom:none}
.swap-table tr:hover td{background:rgba(192,138,74,0.04)}
.swap-pattern-cell{display:flex;align-items:center;gap:10px}
.swap-canvas-wrap canvas{border-radius:5px;border:1px solid var(--warm-border2);display:block}
.swap-bad{opacity:0.55}
.makeup-intro{font-size:13px;color:var(--text-muted);line-height:1.55;margin-bottom:1.5rem;font-style:italic}
.makeup-list{display:flex;flex-direction:column;gap:8px;margin-bottom:.5rem}
.makeup-row{display:flex;gap:14px;padding:10px 14px;background:var(--warm-card);border:1px solid var(--warm-border);border-radius:var(--radius);align-items:baseline}
.makeup-row-label{font-size:9.5px;font-weight:500;letter-spacing:2px;text-transform:uppercase;color:var(--warm-gold);min-width:96px;flex-shrink:0}
.makeup-row-value{font-size:13px;color:var(--text-main)}
.makeup-grid{margin-bottom:.75rem}
.makeup-chip{width:120px}
.makeup-chip .chip-swatch{height:48px}
.makeup-chip .chip-label{padding:6px 8px 8px;border-top:1px solid var(--warm-border)}
.makeup-name{font-size:11.5px;font-weight:500;color:var(--text-main);line-height:1.25;margin-bottom:2px}
.makeup-note{font-size:10px;color:var(--text-muted);font-style:italic;line-height:1.3}
.makeup-tip{font-size:12px;color:var(--text-light);font-style:italic;margin:.5rem 0 1.25rem;line-height:1.45}
.acabamentos-cols{display:grid;grid-template-columns:1fr 1fr;gap:1.25rem;margin-top:.75rem}
.acabamento-h{font-size:10px;font-weight:500;letter-spacing:2px;text-transform:uppercase;margin-bottom:.5rem}
.acabamento-h.good{color:var(--warm-gold)}
.acabamento-h.bad{color:var(--text-muted)}
.acabamento-list{list-style:none;padding:0;margin:0;display:flex;flex-direction:column;gap:4px}
.acabamento-list li{font-size:12px;color:var(--text-main);padding:4px 10px;background:var(--warm-card);border:1px solid var(--warm-border);border-radius:50px;display:inline-block;width:fit-content}
.acabamento-h.bad + .acabamento-list li{color:var(--text-muted);opacity:0.7}
@keyframes fadeUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
.fade-in{animation:fadeUp 0.3s ease forwards}
footer{text-align:center;padding:2rem;font-size:11px;color:var(--text-light);letter-spacing:1px;border-top:1px solid var(--warm-border2)}
@media(max-width:760px){
  .pt-label-full{display:none}
  .pt-label-short{display:inline}
  .pt-btn{padding:6px 10px;font-size:10px;letter-spacing:0.5px}
}
@media(max-width:600px){
  header{padding:3.25rem 1.25rem 1.75rem}
  .palette-toggle{top:10px;right:10px;padding:2px}
  .pt-btn{padding:5px 8px;gap:0;font-size:0}
  .pt-btn .pt-dot{width:14px;height:14px}
  .main{padding:1.75rem 1rem 3rem}
  .color-chip{width:76px}
  .avoid-chip{width:72px}
  .pattern-type-chip{width:90px}
  .makeup-chip{width:108px}
  .acabamentos-cols{grid-template-columns:1fr;gap:1rem}
  .tab-btn{padding:11px 4px;font-size:11px;letter-spacing:1px}
  .makeup-row{flex-direction:column;gap:4px}
  .makeup-row-label{min-width:0}
}
@media(max-width:420px){
  header{padding-top:3.5rem}
  header h1{font-size:clamp(2.4rem,11vw,4rem)}
}
`;

export default function WarmAutumn() {
  const [paletteId, setPaletteId] = useState(() => {
    try {
      const saved = typeof window !== "undefined" ? window.localStorage.getItem("palette") : null;
      return saved && PALETTE_CONFIG[saved] ? saved : "warm-autumn";
    } catch {
      return "warm-autumn";
    }
  });
  const [activeTab, setActiveTab] = useState("colors");

  useEffect(() => {
    try { window.localStorage.setItem("palette", paletteId); } catch { /* ignore */ }
  }, [paletteId]);

  useEffect(() => {
    const vars = PALETTE_CONFIG[paletteId].THEME_VARS;
    const root = document.documentElement;
    for (const k in vars) root.style.setProperty(k, vars[k]);
  }, [paletteId]);

  const cfg = PALETTE_CONFIG[paletteId];
  const hasMakeup = !!cfg.MAKEUP;

  useEffect(() => {
    if (activeTab === "makeup" && !hasMakeup) setActiveTab("colors");
  }, [activeTab, hasMakeup]);

  return (
    <PaletteContext.Provider value={cfg}>
      <style>{styles}</style>
      <header>
        <PaletteToggle paletteId={paletteId} onChange={setPaletteId} />
        <div className="header-inner">
          <div className="header-eyebrow">{cfg.eyebrow}</div>
          <h1>{cfg.title.prefix} <em>{cfg.title.emph}</em></h1>
          <div className="header-sub">{cfg.subtitle}</div>
        </div>
      </header>

      <div className="tab-bar">
        <button
          className={`tab-btn${activeTab === "colors" ? " active" : ""}`}
          onClick={() => setActiveTab("colors")}
        >
          Cores sólidas
        </button>
        <button
          className={`tab-btn${activeTab === "patterns" ? " active" : ""}`}
          onClick={() => setActiveTab("patterns")}
        >
          Padrões & Estampas
        </button>
        {hasMakeup && (
          <button
            className={`tab-btn${activeTab === "makeup" ? " active" : ""}`}
            onClick={() => setActiveTab("makeup")}
          >
            Maquiagem & Batom
          </button>
        )}
      </div>

      <div className="main">
        {activeTab === "colors" && <ColorsTab key={paletteId + "-colors"} />}
        {activeTab === "patterns" && <PatternsTab key={paletteId + "-patterns"} />}
        {activeTab === "makeup" && hasMakeup && <MakeupTab key={paletteId + "-makeup"} />}
      </div>

      <footer>{cfg.footer}</footer>
    </PaletteContext.Provider>
  );
}
