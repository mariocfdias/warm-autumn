import type { ColorInfo, ShirtCombo, PantsCombo, ShoeCombo } from "../types";

export const C: Record<string, ColorInfo> = {
  creme:     { hex: "#f0e6cf", name: "Creme / Marfim quente" },
  areia:     { hex: "#d8c39a", name: "Areia / Bege dourado" },
  camel:     { hex: "#c19a6b", name: "Camel / Caramelo" },
  caqui:     { hex: "#8f7e54", name: "Cáqui" },
  oliva:     { hex: "#6b6033", name: "Verde oliva" },
  musgo:     { hex: "#4a4a2c", name: "Verde musgo / Militar" },
  marrom:    { hex: "#6b4a2f", name: "Marrom / Castanho" },
  cafe:      { hex: "#4e3629", name: "Café / Chocolate" },
  mostarda:  { hex: "#c39a2e", name: "Mostarda queimada" },
  mel:       { hex: "#d4a13a", name: "Mel / Açafrão" },
  terracota: { hex: "#c16e54", name: "Terracota" },
  ferrugem:  { hex: "#9c5a34", name: "Ferrugem / Tijolo" },
  cobre:     { hex: "#9a5b34", name: "Cobre" },
  coral:     { hex: "#d07158", name: "Coral queimado" },
  salmao:    { hex: "#d3886c", name: "Salmão / Pêssego escuro" },
  paprica:   { hex: "#a83f2e", name: "Páprica / Tomate queimado" },
  petroleo:  { hex: "#274d52", name: "Azul petróleo" },
  teal:      { hex: "#2c5b5e", name: "Teal / Azul-pavão" },
  jeans:     { hex: "#3a4a5c", name: "Jeans índigo escuro" },
  taupe:     { hex: "#8c7d6b", name: "Taupe quente" },
};

export const PALETTES: Record<string, string[]> = {
  shirt: ["creme","areia","camel","oliva","musgo","mostarda","mel","terracota","ferrugem","cobre","coral","salmao","paprica","petroleo","teal"],
  pants: ["caqui","camel","areia","oliva","musgo","cafe","marrom","jeans","taupe"],
  shoe:  ["camel","marrom","cafe","areia","creme","caqui","oliva","taupe"],
};

export const PIECE_LABELS: Record<string, string> = {
  shirt: "Escolha a cor da camiseta / camisa:",
  pants: "Escolha a cor da calça:",
  shoe:  "Escolha a cor do sapato / tênis:",
};

export const SHIRT_COMBOS: Record<string, ShirtCombo> = {
  creme:     { pants:[{k:"caqui",note:"Combinação clássica e fácil"},{k:"oliva",note:"Visual terroso; perfeito com overshirt"},{k:"marrom",note:"Elegante; substitui o preto"},{k:"jeans",note:"Jeans escuro + creme é infalível"}], shoes:[{k:"camel",note:"Tom sobre tom quente"},{k:"marrom",note:"Âncora o look"}] },
  areia:     { pants:[{k:"oliva",note:"Terrosa e natural"},{k:"cafe",note:"Contraste suave"},{k:"caqui",note:"Tom sobre tom Warm Autumn"}], shoes:[{k:"marrom",note:"Finaliza bem"},{k:"camel",note:"Flui com a areia"}] },
  camel:     { pants:[{k:"musgo",note:"Contraste quente e sofisticado"},{k:"cafe",note:"Degradê terroso"},{k:"caqui",note:"Leve e casual"}], shoes:[{k:"marrom",note:"Ancora o look"},{k:"cafe",note:"Tom idêntico na base"}] },
  oliva:     { pants:[{k:"camel",note:"Muito versátil"},{k:"marrom",note:"Visual militar-terroso"},{k:"areia",note:"Alivia com tom claro"}], shoes:[{k:"marrom",note:"Clássico e seguro"},{k:"camel",note:"Aquece a base"}] },
  musgo:     { pants:[{k:"areia",note:"Contraste claro"},{k:"camel",note:"Quente e masculino"},{k:"cafe",note:"Tom sobre tom verde-marrom"}], shoes:[{k:"camel",note:"Equilibra o verde"},{k:"marrom",note:"Âncora terrosa"}] },
  mostarda:  { pants:[{k:"oliva",note:"Outono perfeito"},{k:"cafe",note:"Contraste quente e vivo"},{k:"caqui",note:"A mostarda brilha sobre o neutro"}], shoes:[{k:"camel",note:"Espelha a mostarda"},{k:"marrom",note:"Âncora sem competir"}] },
  mel:       { pants:[{k:"musgo",note:"Outonal clássico"},{k:"marrom",note:"Mel sobre terra"},{k:"caqui",note:"Neutro que deixa o mel falar"}], shoes:[{k:"camel",note:"Continuidade dourada"},{k:"marrom",note:"Sobriedade"}] },
  terracota: { pants:[{k:"caqui",note:"Combo favorito Warm Autumn"},{k:"areia",note:"A terracota vibra sobre o claro"},{k:"oliva",note:"Terra + floresta"},{k:"cafe",note:"Rico e profundo"}], shoes:[{k:"marrom",note:"Clássico"},{k:"areia",note:"Desert boot perfeito"}] },
  ferrugem:  { pants:[{k:"caqui",note:"Dos melhores combos"},{k:"marrom",note:"Coeso e robusto"},{k:"areia",note:"Alivia com tom claro"}], shoes:[{k:"marrom",note:"Muito natural"},{k:"cafe",note:"Profundo e sofisticado"}] },
  cobre:     { pants:[{k:"caqui",note:"Cobre destaca"},{k:"oliva",note:"Terrosos complementares"},{k:"marrom",note:"Coeso e profundo"}], shoes:[{k:"marrom",note:"Âncora"},{k:"camel",note:"Tom quente no pé"}] },
  coral:     { pants:[{k:"areia",note:"Leveza com calor"},{k:"caqui",note:"Combinação campeã"},{k:"oliva",note:"Contraste interessante"}], shoes:[{k:"creme",note:"Off-white leve"},{k:"camel",note:"Quente e suave"}] },
  salmao:    { pants:[{k:"areia",note:"Visual suave e claro"},{k:"caqui",note:"Muito wearable"},{k:"oliva",note:"Contraste delicado"}], shoes:[{k:"creme",note:"Leve e limpo"},{k:"camel",note:"Dourado que flui"}] },
  paprica:   { pants:[{k:"marrom",note:"Profundo e intenso"},{k:"caqui",note:"Neutra para a páprica brilhar"},{k:"cafe",note:"Rico e outonal"}], shoes:[{k:"camel",note:"Âncora sem competir"},{k:"marrom",note:"Sóbria"}] },
  petroleo:  { pants:[{k:"camel",note:"Melhor combinação"},{k:"caqui",note:"Equilibra bem"},{k:"marrom",note:"Sofisticado e masculino"}], shoes:[{k:"marrom",note:"Loafer ou bota — clássico"},{k:"camel",note:"Flui com a calça"}] },
  teal:      { pants:[{k:"camel",note:"Teal + camel — elegante"},{k:"areia",note:"Abre o look"},{k:"caqui",note:"Base sólida e quente"}], shoes:[{k:"marrom",note:"Atemporal"},{k:"camel",note:"Aquece o visual"}] },
};

export const PANTS_COMBOS: Record<string, PantsCombo> = {
  caqui:  { shirts:[{k:"creme",note:"Ilumina bem"},{k:"terracota",note:"Destaque quente"},{k:"oliva",note:"Tom sobre tom terroso"},{k:"petroleo",note:"Sofisticado"}], shoes:[{k:"camel",note:"Muito versátil"},{k:"marrom",note:"Clássico"}] },
  camel:  { shirts:[{k:"petroleo",note:"Sofisticada e favorita"},{k:"oliva",note:"Terroso e masculino"},{k:"creme",note:"Visual limpo"},{k:"mostarda",note:"Tom sobre tom dourado"}], shoes:[{k:"marrom",note:"Âncora escura"},{k:"cafe",note:"Profundo e elegante"}] },
  areia:  { shirts:[{k:"terracota",note:"Destaque quente"},{k:"coral",note:"Leve para dias quentes"},{k:"oliva",note:"Natural e terroso"},{k:"mostarda",note:"Vivo sem sair da paleta"}], shoes:[{k:"marrom",note:"Ancora a areia"},{k:"camel",note:"Tom sobre tom"}] },
  oliva:  { shirts:[{k:"creme",note:"Clareia e equilibra"},{k:"mostarda",note:"Outono perfeito"},{k:"terracota",note:"Terra + folha"},{k:"marrom",note:"Tom sobre tom profundo"}], shoes:[{k:"marrom",note:"Bota ou tênis — ideal"},{k:"camel",note:"Aquece o look"}] },
  musgo:  { shirts:[{k:"mel",note:"Dourado sobre musgo"},{k:"areia",note:"Clareia o look"},{k:"camel",note:"Quente e natural"}], shoes:[{k:"camel",note:"Equilíbrio perfeito"},{k:"marrom",note:"Sólido e seguro"}] },
  cafe:   { shirts:[{k:"creme",note:"Contraste suave"},{k:"oliva",note:"Terroso profundo"},{k:"mostarda",note:"Mostarda brilha sobre café"}], shoes:[{k:"camel",note:"Âncora clara"},{k:"marrom",note:"Tom sobre tom dark"}] },
  marrom: { shirts:[{k:"creme",note:"Visual limpo"},{k:"coral",note:"Destaque sobre marrom"},{k:"petroleo",note:"Contraste frio-quente"}], shoes:[{k:"camel",note:"Clareia"},{k:"cafe",note:"Tom profundo"}] },
  jeans:  { shirts:[{k:"creme",note:"Infalível"},{k:"oliva",note:"Urban e versátil"},{k:"terracota",note:"Destaque quente"}], shoes:[{k:"marrom",note:"Melhor que preto"},{k:"camel",note:"Casual e quente"}] },
  taupe:  { shirts:[{k:"creme",note:"Neutro refinado"},{k:"terracota",note:"Aquece o visual"},{k:"oliva",note:"Contraste terroso"}], shoes:[{k:"camel",note:"Harmonioso"},{k:"marrom",note:"Âncora sóbria"}] },
};

export const SHOE_COMBOS: Record<string, ShoeCombo> = {
  camel:  { shirts:[{k:"creme",note:"Tom sobre tom"},{k:"oliva",note:"Terroso e fácil"},{k:"petroleo",note:"Sofisticado"}], pants:[{k:"caqui",note:"Muito coeso"},{k:"oliva",note:"Complementar quente"},{k:"camel",note:"Tom sobre tom"}] },
  marrom: { shirts:[{k:"creme",note:"Clássico e elegante"},{k:"terracota",note:"Terra do pescoço ao pé"},{k:"petroleo",note:"Contraste rico"}], pants:[{k:"caqui",note:"Base leve com âncora"},{k:"oliva",note:"Terroso com âncora"},{k:"jeans",note:"Casual e acessível"}] },
  cafe:   { shirts:[{k:"creme",note:"Contraste limpo"},{k:"mostarda",note:"Vibrante com base escura"},{k:"oliva",note:"Natural e profundo"}], pants:[{k:"camel",note:"Elegante"},{k:"caqui",note:"Neutros sobre neutro"}] },
  areia:  { shirts:[{k:"terracota",note:"Desert boot areia + terracota"},{k:"coral",note:"Claro + claro verão"},{k:"oliva",note:"Natural e leve"}], pants:[{k:"caqui",note:"Tom próximo"},{k:"areia",note:"Tom sobre tom"},{k:"oliva",note:"Contraste terroso"}] },
  creme:  { shirts:[{k:"coral",note:"Leveza e calor"},{k:"salmao",note:"Verão WA"},{k:"oliva",note:"Natural e quente"}], pants:[{k:"caqui",note:"Leve e casual"},{k:"areia",note:"Tom claro"},{k:"marrom",note:"Âncora escura"}] },
  caqui:  { shirts:[{k:"creme",note:"Limpo e fácil"},{k:"oliva",note:"Tom sobre tom"},{k:"mostarda",note:"Vivo sobre neutro"}], pants:[{k:"caqui",note:"Coeso"},{k:"marrom",note:"Contraste sólido"},{k:"areia",note:"Visual claro"}] },
  oliva:  { shirts:[{k:"creme",note:"Clareia o conjunto"},{k:"terracota",note:"Outono total"},{k:"mostarda",note:"Dois tons fortes"}], pants:[{k:"caqui",note:"Base complementar"},{k:"marrom",note:"Tom escuro"},{k:"jeans",note:"Urban e casual"}] },
  taupe:  { shirts:[{k:"creme",note:"Neutro sobre neutro"},{k:"petroleo",note:"Frescor com base neutra"}], pants:[{k:"camel",note:"Harmonioso"},{k:"caqui",note:"Tom próximo"}] },
};

export const COMBOS = {
  shirt: SHIRT_COMBOS,
  pants: PANTS_COMBOS,
  shoe:  SHOE_COMBOS,
} as const;

export const AVOID_COLORS = [
  { hex: "#f8f8f8", label: "Branco óptico" },
  { hex: "#111111", label: "Preto puro" },
  { hex: "#9099a0", label: "Cinza frio" },
  { hex: "#2040b8", label: "Azul royal" },
  { hex: "#e03090", label: "Rosa pink" },
  { hex: "#b098d8", label: "Lilás frio" },
  { hex: "#5040a0", label: "Roxo azulado" },
  { hex: "#20e8c0", label: "Neon / gélido" },
] as const;

export const METALS = [
  { grad: "linear-gradient(135deg,#d4af37,#b8902c)", label: "Dourado" },
  { grad: "linear-gradient(135deg,#b87333,#9a5b34)", label: "Cobre" },
  { grad: "linear-gradient(135deg,#a97142,#84592e)", label: "Bronze" },
  { grad: "linear-gradient(135deg,#b5a05f,#8c7836)", label: "Ouro envelhecido" },
  { grad: "linear-gradient(135deg,#d8c9a3,#bdaa82)", label: "Champanhe" },
] as const;
