class Items {
  constructor() {
    this.items = new Map();
    this.iniciarObjetos();
  }

  iniciarObjetos() {
    const objetos = [
      {
        nombre: "Anemic",
        tipo: "Passive",
        descripción: "Toxic Blood",
        id: "214",
      },
      {
        nombre: "Azazel's Rage",
        tipo: "Passive",
        descripción: "Ancient power",
        id: "699",
      },
      {
        nombre: "Chaos",
        tipo: "Passive",
        descripción: "!!!",
        id: "402",
      },
      {
        nombre: "Divorce Papers",
        tipo: "Passive",
        descripción: "Tears up + you feel empty",
        id: "547",
      },
      {
        nombre: "False PHD",
        tipo: "Passive",
        descripción: "Worse pills + evil up",
        id: "654",
      },
      {
        nombre: "Forever Alone",
        tipo: "Passive",
        descripción: "Attack Fly",
        id: "128",
      },
      {
        nombre: "Friend Finder",
        tipo: "Active",
        descripción: "Best friends forever!",
        id: "687",
      },
      {
        nombre: "Lachryphagy",
        tipo: "Passive",
        descripción: "Feed them!",
        id: "532",
      },
      {
        nombre: "Lemegeton",
        tipo: "Active",
        descripción: "Item summoner",
        id: "712",
      },
      {
        nombre: "Loki's Horns",
        tipo: "Passive",
        descripción: "Cross tears",
        id: "87",
      },
      {
        nombre: "Metronome",
        tipo: "Active",
        descripción: "Waggles a finger",
        id: "488",
      },
      {
        nombre: "Mom's Key",
        tipo: "Passive",
        descripción: "Better chest loot +2 keys",
        id: "199",
      },
      {
        nombre: "My Shadow",
        tipo: "Passive",
        descripción: "Me! And my shaaaadow!",
        id: "433",
      },
      {
        nombre: "Number Two",
        tipo: "Passive",
        descripción: "Uh oh...",
        id: "378",
      },
      {
        nombre: "Paschal Candle",
        tipo: "Passive",
        descripción: "Keep the flame burning",
        id: "567",
      },
      {
        nombre: "Red Candle",
        tipo: "Active",
        descripción: "Flame on",
        id: "289",
      },
      {
        nombre: "Red Stew",
        tipo: "Passive",
        descripción: "Full HP + temporary DMG up",
        id: "621",
      },
      {
        nombre: "Sack of Pennies",
        tipo: "Passive",
        descripción: "Gives money",
        id: "94",
      },
      {
        nombre: "Samson's Chains",
        tipo: "Passive",
        descripción: "The ol' ball and chain",
        id: "321",
      },
      {
        nombre: "Stye",
        tipo: "Passive",
        descripción: "DMG + range up",
        id: "731",
      },
      {
        nombre: "The Battery",
        tipo: "Passive",
        descripción: "Stores energy",
        id: "63",
      },
      {
        nombre: "The Peeper",
        tipo: "Passive",
        descripción: "Plop!",
        id: "155",
      },
      {
        nombre: "Yum Heart",
        tipo: "Active",
        descripción: "Reusable regeneration",
        id: "45",
      },
      // { nombre: "", tipo: "", descripción: "", id: ""},
    ];

    objetos.forEach((obj) =>
      this.crearItem(obj.nombre, obj.tipo, obj.descripción, obj.id)
    );
  }

  crearItem(nombre, tipo, descripción, id) {
    const tag = this.generarTag(id, tipo, nombre);
    const imagen = this.generarRuta(nombre, tipo);

    const item = {
      id,
      nombre,
      tipo,
      descripción,
      imagen,
      tag,
      esPasivo: tipo.toLowerCase() === "passive",
      esActivo: tipo.toLowerCase() === "active",
    };

    this.items.set(tag, item);
    return item;
  }

  generarRuta(nombre, tipo) {
    const nombreArchivo = nombre + ".png";
    if (tipo === "Active") {
      return `assets/img/active-items/${nombreArchivo}`;
    } else {
      return `assets/img/passive-items/${nombreArchivo}`;
    }
  }

  generarTag(id, tipo, nombre) {
    const prefijo = tipo === "passive" ? "P" : "A";
    const nombreNormalizado = nombre.toLowerCase().replaceAll("'", "");
    return `${prefijo}${String(id).padStart(5, "5.100")}_${nombreNormalizado}`;
  }

  buscarPorTag(tag) {
    return this.items.get(tag);
  }

  buscarPorId(id) {
    return Array.from(this.items.values()).find((item) => item.id === id);
  }

  buscarPorNombre(nombre) {
    return Array.from(this.items.values()).find((item) =>
      item.nombre.toLowerCase().includes(nombre.toLowerCase())
    );
  }

  buscarPorTexto(texto) {
    texto = texto.toLowerCase();
    return Array.from(this.items.values()).filter(
      (item) =>
        item.nombre.toLowerCase().includes(texto) ||
        item.tag.toLowerCase().includes(texto) ||
        item.id.toLowerCase().includes(texto) ||
        item.descripción.toLowerCase().includes(texto)
    );
  }

  filtrarPorTipo(tipo) {
    if (tipo === "todos") return Array.from(this.items.values());
    return Array.from(this.items.values()).filter((item) => item.tipo === tipo);
  }

  obtenerTodos() {
    return Array.from(this.items.values());
  }
}

const tagSystem = new Items();

class ConvertidorTextoImagenes {
  constructor() {
    this.cache = new Map();
    this.config = {
      carpetas: {
        mayusculas: "assets/font/Tboi/upper_case",
        minusculas: "assets/font/Tboi/lower_case",
        simbolos: "assets/font/Tboi/simbols",
      },
    };
  }

  convertirTexto(texto, contenedor) {
    contenedor.innerHTML = "";
    const span = document.createElement("span");
    span.className = "texto-imagenes";
    span.style.whiteSpace = "nowrap";

    for (let letra of texto) {
      if (letra === " ") {
        const espacioSpan = document.createElement("span");
        espacioSpan.innerHTML = "&nbsp;";
        espacioSpan.style.margin = "0 2px"; // Espaciado adicional para espacios
        span.appendChild(espacioSpan);
        continue;
      }

      const elemento = this.obtenerElementoLetra(letra);
      span.appendChild(elemento);
    }

    contenedor.appendChild(span);
    return span;
  }

  obtenerElementoLetra(letra) {
    if (this.cache.has(letra)) {
      return this.cache.get(letra).cloneNode(true);
    }

    const { carpeta, nombreArchivo } = this.analizarCaracter(letra);
    const img = document.createElement("img");

    img.src = `${carpeta}/${nombreArchivo}.webp`;
    img.alt = letra;
    img.className = `letra-imagen letra-${this.obtenerTipoCaracter(letra)}`;
    img.style.verticalAlign = "bottom";
    img.style.imageRendering = "pixelated";
    img.style.margin = "0 1px"; // Espaciado entre letras

    img.onerror = () => {
      console.warn(`No se encontró imagen para: "${letra}" en ${carpeta}`);
      const fallback = this.crearFallback(letra);
      img.replaceWith(fallback);
      this.cache.set(letra, fallback);
    };

    img.onload = () => {
      this.cache.set(letra, img);
    };

    return img;
  }

  analizarCaracter(caracter) {
    if (/\d/.test(caracter)) {
      return {
        carpeta: this.config.carpetas.simbolos,
        nombreArchivo: caracter,
      };
    }

    // Verificar si es mayúscula
    if (/[A-Z]/.test(caracter)) {
      return {
        carpeta: this.config.carpetas.mayusculas,
        nombreArchivo: caracter,
      };
    }

    if (/[a-z]/.test(caracter)) {
      return {
        carpeta: this.config.carpetas.minusculas,
        nombreArchivo: caracter,
      };
    }

    return {
      carpeta: this.config.carpetas.simbolos,
      nombreArchivo: this.mapearSimbolo(caracter),
    };
  }

  obtenerTipoCaracter(caracter) {
    if (/[0-9]/.test(caracter)) return "simbolo";
    if (/[A-Z]/.test(caracter)) return "mayuscula";
    if (/[a-z]/.test(caracter)) return "minuscula";
    return "simbolo";
  }

  mapearSimbolo(simbolo) {
    const mapeoSimbolos = {
      "!": "!",
      "'": "'",
      "?": "qmark",
      ".": "dot",
      "<": "lthan",
    };

    return mapeoSimbolos[simbolo] || "unknown";
  }

  crearFallback(letra) {
    const span = document.createElement("span");
    span.textContent = letra;
    span.className = `letra-fallback fallback-${this.obtenerTipoCaracter(
      letra
    )}`;
    span.style.display = "inline-block";
    span.style.fontFamily = "monospace";
    span.style.fontWeight = "bold";
    span.style.margin = "0 1px";

    return span;
  }

  debugTexto(texto) {
    console.log(`Análisis del texto: "${texto}"`);
    for (let letra of texto) {
      if (letra === " ") {
        console.log(`"${letra}" -> ESPACIO (se convertirá a &nbsp;)`);
        continue;
      }
      const analisis = this.analizarCaracter(letra);
      console.log(
        `"${letra}" -> Tipo: ${this.obtenerTipoCaracter(letra)}, Carpeta: ${
          analisis.carpeta
        }, Archivo: ${analisis.nombreArchivo}`
      );
    }
  }
}

const convertidorTexto = new ConvertidorTextoImagenes();

function mostrarItems(items) {
  const container = document.getElementById("item-container");

  if (!container) {
    console.error("No se encontró el contenedor con id 'item-container'");
    return;
  }

  container.innerHTML = "";

  if (items.length === 0) {
    container.innerHTML = "<p>No se encontraron items.</p>";
    return;
  }

  items.forEach((item) => {
    const col = document.createElement("div");
    col.className =
      "col-6 col-sm-4 col-md-3 col-lg-2 mb-4 d-flex justify-content-center";
    container.appendChild(col);
    const card = document.createElement("div");
    card.className = `card item-card ${item.tipo.toLowerCase()} d-flex flex-column h-100`;
    card.innerHTML = `
        <span class="text-center py-3">
          <img src="${item.imagen}" alt="${item.nombre}" height="128" width="128" class="mx-auto">
          <img src="assets/altar.png" alt="Altar">
        </span>
        <div class="card-body text-center d-flex flex-column flex-grow-1">
          <h5 class="card-title mb-2"></h5>
          <h5 class="card-text mb-3 flex-grow-1 d-flex align-items-center justify-content-center">${item.descripción}</h5>
          <small class="mt-auto text-muted">ID: 5.100.${item.id}</small>
        </div>
      `;

    const titulo = card.querySelector(".card-title");
    convertidorTexto.convertirTexto(item.nombre, titulo);

    col.appendChild(card);
    container.appendChild(col);
  });
}

document.addEventListener("DOMContentLoaded", function () {
  mostrarItems(tagSystem.obtenerTodos());
  document.querySelectorAll(".filter-btn").forEach((btn) => {
    btn.addEventListener("click", function () {
      const tipo = this.getAttribute("data-tipo");
      filtrarObjetos(tipo, this);
    });
  });
});

function filtrarObjetos(tipo, elemento = null) {
  document.querySelectorAll(".filter-btn").forEach((btn) => {
    btn.classList.remove("active");
  });
  if (elemento) {
    elemento.classList.add("active");
  }

  const items = tagSystem.filtrarPorTipo(tipo);
  mostrarItems(items);
}

function buscarObjeto() {
  const input = document.getElementById("searchInput");
  const texto = input.value.trim();

  if (texto === "") {
    filtrarObjetos("todos");
    return;
  }

  const resultado = tagSystem.buscarPorTexto(texto);
  mostrarItems(resultado);
}

document.addEventListener("DOMContentLoaded", function () {
  mostrarItems(tagSystem.obtenerTodos());
});
