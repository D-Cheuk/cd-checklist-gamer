// ============================================================
// BUILD.OS — dados das estações de checklist
// Cada item vira um card na seção #componentes
// ============================================================

const COMPONENTS = [
  {
    id: "cpu",
    number: "01",
    name: "CPU",
    tagline: "o cérebro",
    icon: "fa-microchip",
    accent: "node",
    specs: [
      { label: "Marca", detail: "quem fabrica ($ varia bastante entre linhas)" },
      { label: "Modelo", detail: "define geração e desempenho" },
      { label: "Velocidade (GHz)", detail: "clock base e clock turbo" },
      { label: "Qtd. núcleos", detail: "cores físicos disponíveis" },
      { label: "TDP (consumo)", detail: "quanto calor/energia ele exige do cooler e da fonte" },
      { label: "Socket", detail: "o encaixe físico — precisa bater com a placa mãe" },
      { label: "Tipo de memória", detail: "DDR4 ou DDR5, decide o que a RAM pode ser" },
      { label: "Velocidade máx. de memória", detail: "teto de MHz que o CPU reconhece" },
      { label: "Chipsets compatíveis", detail: "quais placas mãe aceitam esse socket" },
      { label: "Vídeo integrado (S/N)", detail: "se dá pra ligar o monitor sem GPU dedicada" }
    ],
    dica: "O CPU escreve as regras: socket e tipo de memória saem daqui e amarram todo o resto da lista."
  },
  {
    id: "ram",
    number: "02",
    name: "Memória RAM",
    tagline: "o espaço de trabalho do cérebro",
    icon: "fa-layer-group",
    accent: "node",
    specs: [
      { label: "Tipo", detail: "DDR4 ou DDR5 — tem que casar com o CPU e a placa mãe" },
      { label: "Velocidade (MHz)", detail: "quanto maior, mais rápida a troca de dados" },
      { label: "Capacidade (GB)", detail: "16GB é o piso confortável hoje; 32GB dá folga" },
      { label: "Qtd. de pentes", detail: "2? 4? — canal duplo (2x) costuma render mais que 1 pente único" },
      { label: "Marca", detail: "impacta preço e, às vezes, o visual (RGB)" }
    ],
    dica: "Dois pentes menores em canal duplo geralmente superam um pente único da mesma capacidade total."
  },
  {
    id: "storage",
    number: "03",
    name: "Armazenamento",
    tagline: "seu estoque de arquivos",
    icon: "fa-database",
    accent: "node",
    specs: [
      { label: "Capacidade (GB)", detail: "espaço para sistema, jogos e arquivos" },
      { label: "Tipo", detail: "HDD (mecânico), SSD (rápido) ou NVMe (muito rápido)" },
      { label: "Conexão", detail: "SATA (mais comum e barato) ou M.2 (direto na placa mãe)" }
    ],
    dica: "NVMe via M.2 reduz tempo de carregamento de jogos — mas confira se a placa mãe tem slots M.2 sobrando."
  },
  {
    id: "gpu",
    number: "04",
    name: "Placa de Vídeo",
    tagline: "o cérebro gráfico",
    icon: "fa-tv",
    accent: "node",
    specs: [
      { label: "Marca", detail: "fabricante da placa (parceira da NVIDIA/AMD/Intel)" },
      { label: "Modelo (GPU)", detail: "o chip gráfico por trás — é o que define a geração" },
      { label: "VRAM", detail: "memória exclusiva de vídeo — texturas de jogos vivem aqui" },
      { label: "Consumo (Watts)", detail: "principal responsável pelo Wattage total da fonte" }
    ],
    dica: "Busque benchmarks de jogos reais rodando com o modelo antes de comprar — o resultado costuma surpreender, pra cima ou pra baixo."
  },
  {
    id: "motherboard",
    number: "05",
    name: "Placa Mãe",
    tagline: "onde você vai conectar muuuuuuuita coisa",
    icon: "fa-diagram-project",
    accent: "hub",
    specs: [
      { label: "Compatibilidade com o CPU", detail: "o socket bate certinho?" },
      { label: "Compatibilidade com a RAM", detail: "aceita a quantidade e o tipo (DDR4/DDR5) escolhidos?" },
      { label: "Compatibilidade com o armazenamento", detail: "tem slots M.2 ou portas SATA suficientes?" },
      { label: "Wi-Fi e Bluetooth", detail: "built-in ou vai depender de adaptador externo?" },
      { label: "Portas USB", detail: "quantidade e tipos (A, C) disponíveis no painel" }
    ],
    dica: "Quase tudo que você compra vai passar por aqui — leia o manual de especificações da placa com calma antes de fechar o resto da lista."
  },
  {
    id: "psu",
    number: "06",
    name: "Fonte de Alimentação",
    tagline: "sem energia, não funfa",
    icon: "fa-plug-circle-bolt",
    accent: "power",
    specs: [
      { label: "Marca", detail: "reputação importa mais aqui do que em quase qualquer outra peça" },
      { label: "Wattage total", detail: "some o consumo de CPU + GPU + margem de segurança" },
      { label: "Cabos inclusos", detail: "quais conectores vêm de fábrica" },
      { label: "Modular ou não modular", detail: "modular deixa só os cabos usados — organização e fluxo de ar" },
      { label: "Selo de eficiência", detail: "80 Plus (Bronze/Gold/Platinum) ou Cybenetics" },
      { label: "Certificações de segurança", detail: "proteções contra curto, sobrecarga e sobretensão" }
    ],
    dica: "Use uma calculadora de fonte online para somar o consumo real do seu build — e nunca economize na certificação. Qualidade aqui é tudo."
  },
  {
    id: "cooling",
    number: "07",
    name: "Cooler / FAN",
    tagline: "aquela refrescada na máquina",
    icon: "fa-fan",
    accent: "node",
    specs: [
      { label: "CPU: ar ou água", detail: "air cooler (dissipador) ou water cooler (líquido)" },
      { label: "Quantas FANs", detail: "quantidade de ventoinhas planejadas no gabinete" },
      { label: "Conexões na placa mãe", detail: "ela tem headers suficientes para todas as FANs?" },
      { label: "Marca", detail: "impacta ruído, durabilidade e estética" }
    ],
    dica: "Combine estética com eficiência térmica — um build bonito que esquenta não é vitória nenhuma."
  },
  {
    id: "monitor",
    number: "08",
    name: "Monitor",
    tagline: "o começo da interação com sua máquina",
    icon: "fa-desktop",
    accent: "peripheral",
    specs: [
      { label: "Tamanho (polegadas)", detail: "distância de uso importa tanto quanto o número" },
      { label: "Resolução", detail: "Full HD, Quad HD ou 4K" },
      { label: "Tipo de tela", detail: "VA, IPS ou OLED ($ sobe nessa ordem, geralmente)" },
      { label: "Taxa de atualização (Hz/FPS)", detail: "quanto mais alta, mais fluido o movimento" },
      { label: "Marca", detail: "afeta suporte, garantia e calibração de fábrica" }
    ],
    dica: "Seus olhos agradecerão — não economize demais na tela que fica na sua frente todos os dias."
  },
  {
    id: "keyboard",
    number: "09",
    name: "Teclado",
    tagline: "",
    icon: "fa-keyboard",
    accent: "peripheral",
    specs: [
      { label: "Teclas doubleshot", detail: "aquela impressão em duas camadas que não desbota" },
      { label: "Tamanho", detail: "número de teclas — full, TKL, 60%..." },
      { label: "Tecnologia", detail: "membrana, mecânico, magnético ou óptico" },
      { label: "Conexão", detail: "Bluetooth ou cabo" },
      { label: "Marca", detail: "afeta build quality e suporte de software" }
    ],
    dica: null
  },
  {
    id: "mouse",
    number: "10",
    name: "Mouse",
    tagline: "precisão na mira",
    icon: "fa-computer-mouse",
    accent: "peripheral",
    specs: [
      { label: "Marca", detail: "impacta preço e ergonomia" },
      { label: "Sensor", detail: "tecnologia óptica por trás do rastreamento" },
      { label: "DPI", detail: "pontos por polegada — sensibilidade do cursor" },
      { label: "Utilidades", detail: "botões extras, peso ajustável, formato, software" }
    ],
    dica: "Se o uso não for muito exigente, um mouse mais simples já resolve — nem todo build precisa do topo de linha aqui."
  },
  {
    id: "cables",
    number: "11",
    name: "Cabos",
    tagline: "se existe cabo, em algum lugar você vai usar",
    icon: "fa-plug",
    accent: "power",
    specs: [
      { label: "ATX (24-pin)", detail: "alimenta a placa mãe", group: "Fonte" },
      { label: "ATX12V (4/8-pin)", detail: "alimenta o processador na placa mãe", group: "Fonte" },
      { label: "SATA (dados)", detail: "usado em HD e SSD SATA", group: "Fonte" },
      { label: "SATA (energia)", detail: "alimenta armazenamentos compatíveis", group: "Fonte" },
      { label: "PCIe", detail: "alimenta a placa de vídeo", group: "Fonte" },
      { label: "12VHPWR", detail: "novo padrão para GPUs de alto consumo", group: "Fonte" },
      { label: "PWM", detail: "energia para girar as FANs, geralmente na placa mãe", group: "FANs" },
      { label: "ARGB", detail: "iluminação em múltiplas cores (arco-íris)", group: "FANs" },
      { label: "RGB", detail: "iluminação em cores básicas (vermelho, verde, azul), sem mistura", group: "FANs" },
      { label: "HDMI", detail: "vídeo e áudio — a versão influencia resolução e taxa de atualização", group: "Externos" },
      { label: "DisplayPort", detail: "mesma lógica do HDMI, versão importa", group: "Externos" },
      { label: "USB Tipo A", detail: "o conector USB comum", group: "Externos" },
      { label: "USB Tipo C", detail: "versão compacta e reversível", group: "Externos" },
      { label: "Óptico (áudio)", detail: "usado em dispositivos de som", group: "Externos" },
      { label: "RJ45", detail: "o cabo de rede ligado ao modem/roteador", group: "Externos" }
    ],
    dica: "Repare na função, não só no nome: vários dispositivos dividem o mesmo tipo de cabo. Ex.: um cooler de CPU ARGB carrega dois cabos — um pra girar, outro pra iluminar."
  }
];
