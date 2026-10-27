/* Da Pencil · interacciones
   - Menú móvil
   - Aparición de elementos y trazos al bajar
   - Lápiz de progreso
   - Rastro de aerosol que deja el cursor
   - Visor de obras
   - Proceso creativo por etapas (garabato, línea, color, vida)
   - Evento de Garabatos y Mañas con cuenta regresiva (data/evento.json)
*/
(function () {
  "use strict";

  document.documentElement.classList.add("js");
  var sinMovimiento = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var punteroFino = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  /* ---------- Menú móvil ---------- */
  var menuBtn = document.querySelector(".menu-btn");
  var menu = document.getElementById("menu");
  function cerrarMenu() {
    menu.classList.remove("abierto");
    menuBtn.setAttribute("aria-expanded", "false");
  }
  menuBtn.addEventListener("click", function () {
    var abierto = menu.classList.toggle("abierto");
    menuBtn.setAttribute("aria-expanded", String(abierto));
  });
  menu.addEventListener("click", function (e) {
    if (e.target.closest("a")) cerrarMenu();
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && menu.classList.contains("abierto")) {
      cerrarMenu();
      menuBtn.focus();
    }
  });

  /* ---------- Aparición al bajar ---------- */
  var observables = document.querySelectorAll(".revela, .hoja");
  if ("IntersectionObserver" in window && !sinMovimiento) {
    var io = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (en) {
        if (en.isIntersecting) {
          en.target.classList.add("visto");
          io.unobserve(en.target);
        }
      });
    }, { threshold: 0.15, rootMargin: "0px 0px -40px 0px" });
    observables.forEach(function (el) { io.observe(el); });
  } else {
    observables.forEach(function (el) { el.classList.add("visto"); });
  }

  /* ---------- Lápiz de progreso ---------- */
  var progreso = document.querySelector(".progreso");
  var pendiente = false;
  function actualizarProgreso() {
    var max = document.documentElement.scrollHeight - window.innerHeight;
    var p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
    progreso.style.setProperty("--p", p.toFixed(4));
    pendiente = false;
  }
  window.addEventListener("scroll", function () {
    if (!pendiente) {
      pendiente = true;
      requestAnimationFrame(actualizarProgreso);
    }
  }, { passive: true });
  actualizarProgreso();

  /* ---------- Rastro de aerosol ---------- */
  var lienzo = document.querySelector(".grafito");
  if (punteroFino && !sinMovimiento && lienzo.getContext) {
    var ctx = lienzo.getContext("2d");
    var puntos = [];
    var VIDA = 900; // ms que tarda en borrarse el trazo
    var animando = false;
    var dpr = 1;

    var ajustar = function () {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      lienzo.width = window.innerWidth * dpr;
      lienzo.height = window.innerHeight * dpr;
      lienzo.style.width = window.innerWidth + "px";
      lienzo.style.height = window.innerHeight + "px";
    };
    ajustar();
    window.addEventListener("resize", ajustar);

    var dibujar = function () {
      var ahora = performance.now();
      while (puntos.length && ahora - puntos[0].t > VIDA) puntos.shift();
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      for (var i = 1; i < puntos.length; i++) {
        var a = puntos[i - 1], b = puntos[i];
        if (b.t - a.t > 80) continue; // no unir saltos
        var vida = 1 - (ahora - b.t) / VIDA;
        ctx.strokeStyle = "rgba(218, 98, 201," + (0.7 * vida).toFixed(3) + ")";
        ctx.lineWidth = 1 + 3 * vida;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
        // salpicado de aerosol alrededor del trazo (posiciones fijas por punto)
        ctx.fillStyle = "rgba(218, 98, 201," + (0.45 * vida).toFixed(3) + ")";
        for (var k = 0; k < b.gotas.length; k += 2) {
          ctx.fillRect(b.x + b.gotas[k], b.y + b.gotas[k + 1], 1.6, 1.6);
        }
      }
      if (puntos.length) {
        requestAnimationFrame(dibujar);
      } else {
        animando = false;
      }
    };

    window.addEventListener("pointermove", function (e) {
      if (e.pointerType !== "mouse") return;
      // la punta del cursor-lápiz está en (5, 27) del icono de 32px
      var gotas = [];
      for (var g = 0; g < 4; g++) gotas.push((Math.random() - 0.5) * 14, (Math.random() - 0.5) * 14);
      puntos.push({ x: e.clientX, y: e.clientY, t: performance.now(), gotas: gotas });
      if (puntos.length > 160) puntos.shift();
      if (!animando) {
        animando = true;
        requestAnimationFrame(dibujar);
      }
    }, { passive: true });
  }

  /* ---------- Visor de obras ---------- */
  var visor = document.querySelector(".visor");
  var botones = Array.prototype.slice.call(document.querySelectorAll("[data-ampliar]"));
  var actual = 0;
  var origen = null;
  function mostrar(i) {
    actual = (i + botones.length) % botones.length;
    var btn = botones[actual];
    var img = btn.querySelector("img");
    var pie = btn.closest("figure").querySelector("figcaption");
    var vImg = visor.querySelector("img");
    vImg.src = img.currentSrc || img.src;
    vImg.alt = img.alt;
    visor.querySelector("figcaption").textContent = pie ? pie.textContent : "";
  }
  if (visor && typeof visor.showModal === "function") {
    botones.forEach(function (btn, i) {
      btn.addEventListener("click", function () {
        origen = btn;
        mostrar(i);
        visor.showModal();
      });
    });
    visor.querySelector(".visor__cerrar").addEventListener("click", function () { visor.close(); });
    visor.querySelector(".visor__nav--prev").addEventListener("click", function () { mostrar(actual - 1); });
    visor.querySelector(".visor__nav--next").addEventListener("click", function () { mostrar(actual + 1); });
    visor.addEventListener("click", function (e) { if (e.target === visor) visor.close(); });
    visor.addEventListener("keydown", function (e) {
      if (e.key === "ArrowLeft") mostrar(actual - 1);
      if (e.key === "ArrowRight") mostrar(actual + 1);
    });
    visor.addEventListener("close", function () { if (origen) origen.focus(); });
  }

  /* ---------- El proceso: del garabato al muñequito ---------- */
  var proceso = document.querySelector("[data-proceso]");
  if (proceso) {
    var pasos = proceso.querySelectorAll("[data-paso]");
    var explicaciones = proceso.querySelectorAll("[data-explica]");
    var nota = proceso.querySelector("[data-proceso-nota]");
    var nombres = { 1: "1 · Garabato", 2: "2 · Línea", 3: "3 · Color", 4: "4 · ¡Vida!" };
    var auto = null;

    var irA = function (n) {
      proceso.setAttribute("data-etapa", String(n));
      pasos.forEach(function (b) { b.setAttribute("aria-pressed", String(b.getAttribute("data-paso") === String(n))); });
      explicaciones.forEach(function (li) { li.classList.toggle("activo", li.getAttribute("data-explica") === String(n)); });
      nota.textContent = nombres[n];
    };
    var parar = function () { if (auto) { clearInterval(auto); auto = null; } };

    irA(sinMovimiento ? 4 : 1);
    pasos.forEach(function (b) {
      b.addEventListener("click", function () {
        parar();
        irA(Number(b.getAttribute("data-paso")));
      });
    });

    // Al verlo por primera vez, el dibujo avanza solo hasta cobrar vida
    if (!sinMovimiento && "IntersectionObserver" in window) {
      var vistaProceso = new IntersectionObserver(function (entradas) {
        if (!entradas[0].isIntersecting) return;
        vistaProceso.disconnect();
        var n = 1;
        auto = setInterval(function () {
          n += 1;
          irA(n);
          if (n >= 4) parar();
        }, 1700);
      }, { threshold: 0.45 });
      vistaProceso.observe(proceso.querySelector(".proceso-lab__lienzo"));
    }
  }

  /* ---------- Garabatos y Mañas: evento ---------- */
  var cajaEvento = document.querySelector("[data-evento]");

  function texto(etiqueta, clase, contenido) {
    var el = document.createElement(etiqueta);
    if (clase) el.className = clase;
    if (contenido != null) el.textContent = contenido;
    return el;
  }

  function pintarEvento(ev) {
    var fecha = new Date(ev.fecha);
    if (isNaN(fecha.getTime())) return;

    var boleta = texto("article", "boleta revela visto");
    boleta.setAttribute("aria-labelledby", "evento-nombre");
    var cuerpo = texto("div", "boleta__cuerpo");
    var titulo = texto("h3", null, ev.nombre || "Garabatos y Mañas");
    titulo.id = "evento-nombre";
    cuerpo.appendChild(titulo);
    if (ev.descripcion) cuerpo.appendChild(texto("p", null, ev.descripcion));

    var datos = texto("ul", "boleta__datos");
    var formatoFecha = new Intl.DateTimeFormat("es-CO", { weekday: "long", day: "numeric", month: "long", year: "numeric", timeZone: "America/Bogota" });
    var formatoHora = new Intl.DateTimeFormat("es-CO", { hour: "numeric", minute: "2-digit", timeZone: "America/Bogota" });
    [["Fecha", formatoFecha.format(fecha)], ["Hora", formatoHora.format(fecha)], ["Lugar", ev.lugar || "Por anunciar"]].forEach(function (par) {
      var li = document.createElement("li");
      li.appendChild(texto("span", null, par[0] + ": "));
      li.appendChild(document.createTextNode(par[1]));
      datos.appendChild(li);
    });
    cuerpo.appendChild(datos);

    var cuenta = texto("div", "cuenta");
    cuenta.setAttribute("role", "timer");
    cuenta.setAttribute("aria-label", "Cuenta regresiva para el evento");
    var unidades = [["dias", "días"], ["horas", "horas"], ["min", "minutos"], ["seg", "segundos"]];
    var nums = {};
    unidades.forEach(function (u) {
      var caja = texto("div", "cuenta__caja");
      nums[u[0]] = texto("span", "cuenta__num", "00");
      caja.appendChild(nums[u[0]]);
      caja.appendChild(texto("span", "cuenta__txt", u[1]));
      cuenta.appendChild(caja);
    });
    cuerpo.appendChild(cuenta);
    boleta.appendChild(cuerpo);

    var talon = texto("div", "boleta__talon");
    talon.appendChild(texto("span", "sello", "Admite uno"));
    var comprar = texto("a", "boton boton--magenta", "Comprar entradas");
    if (ev.urlEntradas) {
      comprar.href = ev.urlEntradas;
      comprar.rel = "noopener";
    } else {
      comprar.textContent = "Entradas muy pronto";
      comprar.setAttribute("aria-disabled", "true");
    }
    talon.appendChild(comprar);
    boleta.appendChild(talon);

    cajaEvento.replaceChildren(boleta);

    function dos(n) { return (n < 10 ? "0" : "") + n; }
    var reloj = null;
    function tic() {
      var resta = fecha.getTime() - Date.now();
      if (resta <= 0) {
        clearInterval(reloj);
        cuenta.replaceChildren(texto("p", "nota-mano", "¡Llegó el día! Nos vemos en el encuentro."));
        comprar.textContent = "Evento en curso";
        comprar.removeAttribute("href");
        comprar.setAttribute("aria-disabled", "true");
        return;
      }
      var s = Math.floor(resta / 1000);
      nums.dias.textContent = dos(Math.floor(s / 86400));
      nums.horas.textContent = dos(Math.floor((s % 86400) / 3600));
      nums.min.textContent = dos(Math.floor((s % 3600) / 60));
      nums.seg.textContent = dos(s % 60);
    }
    tic();
    reloj = setInterval(tic, 1000);
  }

  if (cajaEvento && window.fetch) {
    fetch("data/evento.json", { cache: "no-store" })
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (ev) { if (ev && ev.activo && ev.fecha) pintarEvento(ev); })
      .catch(function () { /* sin evento: se queda el "Próximamente" */ });
  }

  /* ---------- Año del pie ---------- */
  var anio = document.querySelector("[data-anio]");
  if (anio) anio.textContent = String(new Date().getFullYear());
})();
