import type { PatternType, PatternCombo, SwapEntry } from "../types";

export const PATTERN_TYPES: PatternType[] = [
  { id: "stripes-h",    name: "Listras horizontais" },
  { id: "stripes",      name: "Listras verticais" },
  { id: "check",        name: "Xadrez" },
  { id: "herringbone",  name: "Espinha de peixe" },
  { id: "houndstooth",  name: "Pied-de-poule" },
  { id: "windowpane",   name: "Windowpane" },
  { id: "polka",        name: "Poá / Bolinhas" },
  { id: "floral",       name: "Floral / Folhagem" },
  { id: "camo",         name: "Camuflado" },
  { id: "linen",        name: "Textura linho/sarja" },
  { id: "tie-dye",      name: "Tie-dye" },
];

export const PATTERN_COMBOS: Record<string, Record<string, PatternCombo[]>> = {
  shirt: {
    "stripes-h": [
      { name:"Creme + Marrom café",           colors:["#f0e6cf","#4e3629"],                      look:[{role:"shirt",ck:"creme"},{role:"pants",ck:"caqui"},{role:"shoe",ck:"camel"}],  note:"Excelente para Warm Autumn. Substitui o clássico branco/azul." },
      { name:"Creme + Oliva",                  colors:["#f0e6cf","#6b6033"],                      look:[{role:"shirt",ck:"creme"},{role:"pants",ck:"camel"},{role:"shoe",ck:"marrom"}], note:"Mais casual e natural. Fácil de combinar." },
      { name:"Areia + Petróleo",               colors:["#d8c39a","#274d52"],                      look:[{role:"shirt",ck:"areia"},{role:"pants",ck:"caqui"},{role:"shoe",ck:"camel"}],  note:"Boa alternativa ao azul-marinho com branco." },
      { name:"Creme + Ferrugem",               colors:["#f0e6cf","#9c5a34"],                      look:[{role:"shirt",ck:"creme"},{role:"pants",ck:"cafe"},{role:"shoe",ck:"marrom"}],  note:"Mais marcante, mas dentro da paleta." },
    ],
    "stripes": [
      { name:"Creme + Camel",                  colors:["#f0e6cf","#c19a6b"],                      look:[{role:"shirt",ck:"creme"},{role:"pants",ck:"oliva"},{role:"shoe",ck:"marrom"}], note:"Listras verticais elegantes, casual arrumado." },
      { name:"Areia + Petróleo",               colors:["#d8c39a","#274d52"],                      look:[{role:"shirt",ck:"areia"},{role:"pants",ck:"camel"},{role:"shoe",ck:"marrom"}], note:"Sofisticado e fácil de combinar." },
      { name:"Marfim + Oliva",                 colors:["#f0e6cf","#6b6033"],                      look:[{role:"shirt",ck:"creme"},{role:"pants",ck:"caqui"},{role:"shoe",ck:"camel"}],  note:"Natural e terroso." },
    ],
    "check": [
      { name:"Oliva + Creme + Marrom",         colors:["#6b6033","#f0e6cf","#6b4a2f"],            look:[{role:"shirt",ck:"oliva"},{role:"pants",ck:"jeans"},{role:"shoe",ck:"cafe"}],   note:"Um dos melhores xadrezes para WA. Muito masculino." },
      { name:"Ferrugem + Camel + Chocolate",   colors:["#9c5a34","#c19a6b","#4e3629"],            look:[{role:"shirt",ck:"ferrugem"},{role:"pants",ck:"caqui"},{role:"shoe",ck:"camel"}],note:"Outonal e marcante." },
      { name:"Petróleo + Camel + Creme",       colors:["#274d52","#c19a6b","#f0e6cf"],            look:[{role:"shirt",ck:"petroleo"},{role:"pants",ck:"areia"},{role:"shoe",ck:"marrom"}],note:"Elegante, ótimo para casual arrumado." },
      { name:"Mostarda + Musgo + Café",        colors:["#c39a2e","#4a4a2c","#4e3629"],            look:[{role:"shirt",ck:"mostarda"},{role:"pants",ck:"marrom"},{role:"shoe",ck:"cafe"}], note:"Outono total — muito característico da paleta." },
    ],
    "herringbone": [
      { name:"Marrom herringbone",             colors:["#6b4a2f","#4e3629"],                      look:[{role:"shirt",ck:"creme"},{role:"pants",ck:"camel"},{role:"shoe",ck:"cafe"}],   note:"Textura rica e clássica. Ótimo em overshirt." },
      { name:"Oliva herringbone",              colors:["#6b6033","#4a4a2c"],                      look:[{role:"shirt",ck:"creme"},{role:"pants",ck:"jeans"},{role:"shoe",ck:"marrom"}], note:"Natural e versátil." },
      { name:"Taupe herringbone",              colors:["#8c7d6b","#6b4a2f"],                      look:[{role:"shirt",ck:"creme"},{role:"pants",ck:"camel"},{role:"shoe",ck:"marrom"}], note:"Neutro quente, muito wearable." },
    ],
    "houndstooth": [
      { name:"Marrom + Creme",                 colors:["#6b4a2f","#f0e6cf"],                      look:[{role:"shirt",ck:"marrom"},{role:"pants",ck:"caqui"},{role:"shoe",ck:"marrom"}], note:"Substitui o clássico preto/branco. Muito elegante." },
      { name:"Chocolate + Camel",              colors:["#4e3629","#c19a6b"],                      look:[{role:"shirt",ck:"cafe"},{role:"pants",ck:"caqui"},{role:"shoe",ck:"camel"}],   note:"Tom sobre tom quente e sofisticado." },
      { name:"Oliva + Areia",                  colors:["#6b6033","#d8c39a"],                      look:[{role:"shirt",ck:"oliva"},{role:"pants",ck:"marrom"},{role:"shoe",ck:"marrom"}], note:"Natural e terroso." },
    ],
    "windowpane": [
      { name:"Creme + Terracota",              colors:["#f0e6cf","#c16e54"],                      look:[{role:"shirt",ck:"creme"},{role:"pants",ck:"caqui"},{role:"shoe",ck:"marrom"}], note:"Delicado e quente." },
      { name:"Camel + Chocolate",              colors:["#c19a6b","#4e3629"],                      look:[{role:"shirt",ck:"camel"},{role:"pants",ck:"cafe"},{role:"shoe",ck:"marrom"}],  note:"Elegante para casual arrumado." },
    ],
    "polka": [
      { name:"Marrom + Poá creme",             colors:["#6b4a2f","#f0e6cf"],                      look:[{role:"shirt",ck:"marrom"},{role:"pants",ck:"caqui"},{role:"shoe",ck:"camel"}], note:"Discreto e charmoso." },
      { name:"Petróleo + Poá areia",           colors:["#274d52","#d8c39a"],                      look:[{role:"shirt",ck:"petroleo"},{role:"pants",ck:"camel"},{role:"shoe",ck:"marrom"}],note:"Fundo escuro com poá quente — muito WA." },
      { name:"Oliva + Poá marfim",             colors:["#6b6033","#f0e6cf"],                      look:[{role:"shirt",ck:"oliva"},{role:"pants",ck:"cafe"},{role:"shoe",ck:"creme"}],   note:"Natural e não usual." },
    ],
    "floral": [
      { name:"Creme + Folhagem oliva/ferrugem",colors:["#f0e6cf","#6b6033","#9c5a34"],            look:[{role:"shirt",ck:"creme"},{role:"pants",ck:"caqui"},{role:"shoe",ck:"marrom"}], note:"Linho creme com folhagem — perfeito para verão." },
      { name:"Petróleo + Flores terracota/camel",colors:["#274d52","#c16e54","#c19a6b"],          look:[{role:"shirt",ck:"petroleo"},{role:"pants",ck:"areia"},{role:"shoe",ck:"marrom"}],note:"Floral sofisticado e não-óbvio." },
      { name:"Oliva + Detalhes mostarda",      colors:["#6b6033","#c39a2e","#4e3629"],            look:[{role:"shirt",ck:"oliva"},{role:"pants",ck:"camel"},{role:"shoe",ck:"cafe"}],   note:"Tropical quente. Ótimo com bermuda camel." },
    ],
    "camo": [
      { name:"Camo oliva/musgo/marrom",        colors:["#6b6033","#4a4a2c","#6b4a2f","#d8c39a"], look:[{role:"shirt",ck:"creme"},{role:"pants",ck:"marrom"},{role:"shoe",ck:"cafe"}],  note:"Camo quente — o melhor para WA. Resto do look liso." },
      { name:"Desert camo areia/camel/marrom", colors:["#d8c39a","#c19a6b","#6b4a2f","#8f7e54"], look:[{role:"shirt",ck:"camel"},{role:"pants",ck:"marrom"},{role:"shoe",ck:"cafe"}],  note:"Desert camo quente. Muito natural." },
    ],
    "linen": [
      { name:"Textura areia/creme",            colors:["#d8c39a","#c5b08a"],                      look:[{role:"shirt",ck:"areia"},{role:"pants",ck:"cafe"},{role:"shoe",ck:"marrom"}],  note:"Textura de linho natural — muito WA." },
      { name:"Textura oliva",                  colors:["#6b6033","#545228"],                      look:[{role:"shirt",ck:"oliva"},{role:"pants",ck:"camel"},{role:"shoe",ck:"marrom"}], note:"Tom rico com profundidade de textura." },
    ],
    "tie-dye": [
      { name:"Terracota + Areia",              colors:["#c16e54","#d8c39a","#9c5a34"],            look:[{role:"shirt",ck:"terracota"},{role:"pants",ck:"caqui"},{role:"shoe",ck:"marrom"}],note:"Tie-dye quente — dentro da paleta WA." },
      { name:"Oliva + Creme",                  colors:["#6b6033","#f0e6cf","#4a4a2c"],            look:[{role:"shirt",ck:"oliva"},{role:"pants",ck:"camel"},{role:"shoe",ck:"marrom"}], note:"Natural e terroso." },
    ],
  },
  pants: {
    "stripes": [
      { name:"Calça listrada cáqui/marrom",    colors:["#8f7e54","#4e3629"],                      look:[{role:"shirt",ck:"creme"},{role:"pants",ck:"caqui"},{role:"shoe",ck:"marrom"}], note:"Listras discretas dentro dos neutros quentes." },
      { name:"Listras camel/chocolate",        colors:["#c19a6b","#4e3629"],                      look:[{role:"shirt",ck:"oliva"},{role:"pants",ck:"camel"},{role:"shoe",ck:"cafe"}],   note:"Tom sobre tom elegante." },
    ],
    "check": [
      { name:"Xadrez cáqui/oliva discreta",    colors:["#8f7e54","#6b6033","#4e3629"],            look:[{role:"shirt",ck:"creme"},{role:"pants",ck:"caqui"},{role:"shoe",ck:"marrom"}], note:"Padrão sutil que funciona como neutro." },
      { name:"Xadrez marrom/taupe",            colors:["#6b4a2f","#8c7d6b","#4e3629"],            look:[{role:"shirt",ck:"petroleo"},{role:"pants",ck:"marrom"},{role:"shoe",ck:"camel"}],note:"Sofisticado; resto do look deve ser liso." },
      { name:"Xadrez café/camel",              colors:["#4e3629","#c19a6b","#8f7e54"],            look:[{role:"shirt",ck:"creme"},{role:"pants",ck:"cafe"},{role:"shoe",ck:"marrom"}],  note:"Polo creme + calça xadrez discreta + loafer." },
    ],
    "herringbone": [
      { name:"Herringbone camel/marrom",       colors:["#c19a6b","#6b4a2f"],                      look:[{role:"shirt",ck:"petroleo"},{role:"pants",ck:"camel"},{role:"shoe",ck:"marrom"}],note:"Um dos melhores padrões para calça WA." },
      { name:"Herringbone marrom/café",        colors:["#6b4a2f","#4e3629"],                      look:[{role:"shirt",ck:"creme"},{role:"pants",ck:"marrom"},{role:"shoe",ck:"camel"}], note:"Profundo e sofisticado. Casual arrumado." },
      { name:"Herringbone taupe/chocolate",    colors:["#8c7d6b","#4e3629"],                      look:[{role:"shirt",ck:"creme"},{role:"pants",ck:"taupe"},{role:"shoe",ck:"marrom"}],  note:"Neutro quente — muito wearable." },
    ],
    "houndstooth": [
      { name:"Pied-de-poule marrom/creme",     colors:["#6b4a2f","#f0e6cf"],                      look:[{role:"shirt",ck:"creme"},{role:"pants",ck:"marrom"},{role:"shoe",ck:"cafe"}],  note:"Substitui o preto/branco clássico. Elegante." },
      { name:"Bege/café bem pequeno",          colors:["#d8c39a","#4e3629"],                      look:[{role:"shirt",ck:"oliva"},{role:"pants",ck:"cafe"},{role:"shoe",ck:"camel"}],   note:"Micro padrão funciona como textura." },
    ],
    "windowpane": [
      { name:"Camel + Linhas chocolate",       colors:["#c19a6b","#4e3629"],                      look:[{role:"shirt",ck:"creme"},{role:"pants",ck:"camel"},{role:"shoe",ck:"marrom"}], note:"Windowpane na calça — elegante e masculino." },
      { name:"Cáqui + Linhas oliva",           colors:["#8f7e54","#4a4a2c"],                      look:[{role:"shirt",ck:"creme"},{role:"pants",ck:"caqui"},{role:"shoe",ck:"marrom"}], note:"Sutil e funcional." },
    ],
    "camo": [
      { name:"Cargo camo oliva/cáqui",         colors:["#6b6033","#8f7e54","#6b4a2f","#d8c39a"], look:[{role:"shirt",ck:"creme"},{role:"pants",ck:"oliva"},{role:"shoe",ck:"camel"}],  note:"Calça cargo camo — resto do look lisa." },
    ],
    "linen": [
      { name:"Sarja com microtextura cáqui",   colors:["#8f7e54","#7a6d48"],                      look:[{role:"shirt",ck:"creme"},{role:"pants",ck:"caqui"},{role:"shoe",ck:"marrom"}], note:"Textura de sarja — visual mais rico que liso." },
      { name:"Cotelê oliva",                   colors:["#6b6033","#545228"],                      look:[{role:"shirt",ck:"terracota"},{role:"pants",ck:"oliva"},{role:"shoe",ck:"marrom"}],note:"Cotelê é textura e padrão ao mesmo tempo." },
    ],
  },
};

export const SWAPS: SwapEntry[] = [
  { bad:"Azul-marinho + Branco",      badColors:["#1a2a6c","#ffffff"],                      good:"Petróleo + Creme",             goodColors:["#274d52","#f0e6cf"],                       pattern:"stripes-h"  },
  { bad:"Preto + Branco",             badColors:["#111111","#f8f8f8"],                      good:"Marrom café + Creme",          goodColors:["#4e3629","#f0e6cf"],                       pattern:"houndstooth"},
  { bad:"Cinza + Preto",              badColors:["#9099a0","#111111"],                      good:"Taupe quente + Chocolate",     goodColors:["#8c7d6b","#4e3629"],                       pattern:"check"      },
  { bad:"Vermelho frio + Preto",      badColors:["#c01020","#111111"],                      good:"Ferrugem + Marrom",            goodColors:["#9c5a34","#6b4a2f"],                       pattern:"check"      },
  { bad:"Azul royal + Branco",        badColors:["#2040b8","#f8f8f8"],                      good:"Teal/Petróleo + Areia",        goodColors:["#274d52","#d8c39a"],                       pattern:"stripes-h"  },
  { bad:"Xadrez cinza",               badColors:["#9099a0","#5f6065"],                      good:"Xadrez cáqui/marrom/oliva",   goodColors:["#8f7e54","#6b4a2f","#6b6033"],            pattern:"check"      },
  { bad:"Listras brancas puras",      badColors:["#f8f8f8","#3a4a5c"],                      good:"Listras marfim/creme",         goodColors:["#f0e6cf","#274d52"],                       pattern:"stripes-h"  },
  { bad:"Camuflado urbano cinza",     badColors:["#7a7f80","#9099a0","#4a5050","#b0b5b5"], good:"Camo oliva/cáqui/marrom",     goodColors:["#6b6033","#8f7e54","#6b4a2f","#d8c39a"],  pattern:"camo"       },
];
