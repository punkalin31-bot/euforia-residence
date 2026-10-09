"use strict";
/* CONFIGURARE CONTACT: completează înainte de publicare.
   WhatsApp: număr internațional, numai cifre (ex.: 40 urmat de număr fără primul 0).
   E-mail: adresa care trebuie să primească solicitările.
   Dacă ambele sunt goale, vizitatorul poate doar pregăti și copia mesajul.
   Site-ul nu colectează și nu salvează datele introduse.
*/
const CONTACT = {
  whatsapp: "40756851348",
  email: "alin.mihai00@gmail.com"
};

const menu = document.querySelector(".menu-toggle");
const navigation = document.querySelector("#navigation");
function closeMenu() { navigation.classList.remove("open"); menu.setAttribute("aria-expanded", "false"); }
menu.addEventListener("click", () => {
  const open = navigation.classList.toggle("open");
  menu.setAttribute("aria-expanded", String(open));
});
navigation.querySelectorAll("a").forEach(link => link.addEventListener("click", closeMenu));
document.addEventListener("keydown", e => { if (e.key === "Escape") closeMenu(); });
document.querySelector("#year").textContent = new Date().getFullYear();

const photos = [
  { src: "images/living.jpg", caption: "Living & bucătărie" },
  { src: "images/dormitor.jpg", caption: "Dormitor în tonuri naturale" },
  { src: "images/detaliu.jpg", caption: "Detalii & texturi" },
  { src: "images/ambient.jpg", caption: "Confort, în fiecare detaliu" }
];
const lightbox = document.querySelector("#lightbox");
let current = 0;
function showPhoto(index) {
  current = (index + photos.length) % photos.length;
  const img = document.querySelector("#lightbox-image");
  img.src = photos[current].src;
  img.alt = photos[current].caption;
  document.querySelector("#lightbox-caption").textContent = (current + 1) + " / " + photos.length + " — " + photos[current].caption;
}
document.querySelectorAll("[data-image]").forEach(button => {
  button.addEventListener("click", () => { showPhoto(Number(button.dataset.image)); lightbox.showModal(); });
});
document.querySelector(".close-lightbox").addEventListener("click", () => lightbox.close());
document.querySelector("#previous").addEventListener("click", () => showPhoto(current - 1));
document.querySelector("#next").addEventListener("click", () => showPhoto(current + 1));
lightbox.addEventListener("click", event => { if (event.target === lightbox) {
  const r = lightbox.getBoundingClientRect();
  if (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) lightbox.close();
}});
lightbox.addEventListener("keydown", e => {
  if (e.key === "ArrowRight") { e.preventDefault(); showPhoto(current + 1); }
  if (e.key === "ArrowLeft") { e.preventDefault(); showPhoto(current - 1); }
});
lightbox.addEventListener("close", () => { document.body.style.overflow = ""; });
const observer = new MutationObserver(() => { document.body.style.overflow = lightbox.open ? "hidden" : ""; });
observer.observe(lightbox, { attributes: true, attributeFilter: ["open"] });

const form = document.querySelector("#contact-form");
const status = document.querySelector("#form-status");
const phone = CONTACT.whatsapp.replace(/\D/g, "");
const hasWhatsapp = /^[1-9]\d{7,14}$/.test(phone);
const hasEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(CONTACT.email);
const note = document.querySelector("#form-note");
const submit = document.querySelector("#submit-button");
if (hasWhatsapp) {
  submit.textContent = "Continuă pe WhatsApp";
  note.textContent = "Se va deschide WhatsApp cu mesajul pregătit. Îl trimiți tu, după verificare.";
  const direct = document.querySelector("#direct-contact");
  direct.href = "https://wa.me/" + phone; direct.target = "_blank"; direct.rel = "noopener noreferrer"; direct.hidden = false;
} else if (hasEmail) {
  submit.textContent = "Continuă prin e-mail";
  note.textContent = "Se va deschide aplicația ta de e-mail cu mesajul pregătit. Îl trimiți tu, după verificare.";
} else {
  note.textContent = "Contactul direct nu este încă disponibil. Poți pregăti și copia mesajul; acesta nu este trimis automat.";
}
form.addEventListener("submit", e => {
  e.preventDefault();
  const data = new FormData(form);
  const name = String(data.get("name")).trim();
  const tel = String(data.get("phone")).trim();
  if (!name || !/[0-9]{3}/.test(tel.replace(/[\s()+.-]/g, ""))) {
    status.textContent = "Completează numele și un număr de telefon valid."; return;
  }
  const message = "Bună ziua! Sunt " + name + ".\nTelefon: " + tel + "\nInteres: " + data.get("interest") + "\n" + String(data.get("message")).trim() + "\nAș dori oferta pentru Blocul 1, Euforia Residence.";
  document.querySelector("#prepared-message").value = message;
  document.querySelector("#message-output").hidden = false;
  if (hasWhatsapp) {
    window.open("https://wa.me/" + phone + "?text=" + encodeURIComponent(message), "_blank", "noopener,noreferrer");
    status.textContent = "Mesaj pregătit. Finalizează trimiterea în WhatsApp. Dacă nu s-a deschis, copiază mesajul de mai jos.";
  } else if (hasEmail) {
    window.location.href = "mailto:" + CONTACT.email + "?subject=" + encodeURIComponent("Vizionare Euforia Residence") + "&body=" + encodeURIComponent(message);
    status.textContent = "Mesaj pregătit. Finalizează trimiterea în aplicația de e-mail sau copiază textul de mai jos.";
  } else status.textContent = "Mesaj pregătit, dar netrimis. Îl poți copia mai jos.";
});
document.querySelector("#copy-message").addEventListener("click", async () => {
  const textarea = document.querySelector("#prepared-message");
  try {
    if (!navigator.clipboard) throw new Error("Clipboard unavailable");
    await navigator.clipboard.writeText(textarea.value);
    status.textContent = "Mesaj copiat. Nu a fost trimis automat.";
  } catch {
    textarea.focus(); textarea.select();
    status.textContent = "Text selectat. Apasă Ctrl+C (sau Copiază pe telefon). Mesajul nu a fost trimis.";
  }
});


// Schițe și solicitări: întotdeauna Blocul 1.
const planDialog = document.querySelector("#plan-dialog");
const planCards = Array.from(document.querySelectorAll(".plan-card"));
let selectedType = "";
function selectApartment(type) {
  if (planDialog.open) planDialog.close();
  document.querySelector('[name="interest"]').value = type;
  document.querySelector("#contact").scrollIntoView({behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth"});
  document.querySelector('[name="name"]').focus({preventScroll:true});
}
document.querySelectorAll(".select-plan").forEach(button => button.addEventListener("click", () => selectApartment(button.dataset.type)));
document.querySelectorAll("[data-plan]").forEach(button => button.addEventListener("click", () => {
  const card = button.closest(".plan-card");
  selectedType = card.querySelector(".select-plan").dataset.type;
  document.querySelector("#plan-title").textContent = selectedType;
  const src = button.querySelector("img").getAttribute("src");
  const img = document.querySelector("#plan-large"); img.src = src; img.alt = "Schiță " + selectedType;
  document.querySelector("#original-plan").href = src;
  planDialog.showModal(); document.body.style.overflow = "hidden";
}));
document.querySelector(".close-plan").addEventListener("click", () => planDialog.close());
planDialog.addEventListener("close", () => { document.body.style.overflow = ""; });
document.querySelector("#plan-offer").addEventListener("click", () => selectApartment(selectedType));
document.querySelector("#plan-sort").addEventListener("change", event => {
  const sorted = [...planCards];
  if (event.target.value !== "type") sorted.sort((a,b) => (Number(a.dataset.area)-Number(b.dataset.area)) * (event.target.value === "asc" ? 1 : -1));
  document.querySelector(".plans-grid").append(...sorted);
});

// Derulare nativă lină, meniu fix și apariții discrete.
// Conținutul rămâne vizibil dacă JavaScript sau IntersectionObserver nu sunt disponibile.
const header = document.querySelector(".header");
window.addEventListener("scroll", () => header.classList.toggle("scrolled", window.scrollY > 20), {passive:true});
if ("IntersectionObserver" in window) {
  const navLinks = Array.from(navigation.querySelectorAll('a[href^="#"]'));
  const sectionObserver = new IntersectionObserver(entries => {
    for (const entry of entries) if (entry.isIntersecting) {
      navLinks.forEach(link => {
        if (link.hash === "#" + entry.target.id) link.setAttribute("aria-current","location");
        else link.removeAttribute("aria-current");
      });
    }
  }, {rootMargin:"-15% 0px -55% 0px", threshold:0});
  document.querySelectorAll("main section[id]").forEach(section => sectionObserver.observe(section));
}

// Apariții progresive pentru conținut, cu accesibilitate și revenire sigură.

function initializeMotion(){
  const root=document.documentElement;
  if (!("IntersectionObserver" in window) || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  try {
    const items=document.querySelectorAll(".hero-copy,.hero-visual,.intro-bar,.section-heading,.project-overview,.building-stages article,.plan-toolbar,.plan-card,.gallery-item,.gallery-disclaimer,.construction-details,.location>div,.faq>h2,.faq>details,.contact>div,.contact form,footer");
    document.querySelectorAll(".building-stages article").forEach(function(el,i){
      el.style.setProperty("--enter-delay",(i*100)+"ms");
    });
    document.querySelectorAll(".plan-card,.gallery-item").forEach(function(el,i){
      el.style.setProperty("--enter-delay",((i%2)*110)+"ms");
    });
    const observer=new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if(entry.isIntersecting){
          entry.target.classList.add("in-view");
        }else if(entry.boundingClientRect.top>window.innerHeight){
          // Reapare delicat când revii spre un element aflat mai jos.
          entry.target.classList.remove("in-view");
        }
      });
    },{threshold:0.06,rootMargin:"0px 0px -35px 0px"});
    root.classList.add("motion-ready");
    items.forEach(function(item){observer.observe(item)});
    window.matchMedia("(prefers-reduced-motion: reduce)").addEventListener("change",function(e){
      if(e.matches){root.classList.remove("motion-ready");observer.disconnect()}
    });
  }catch(error){
    root.classList.remove("motion-ready");
  }
}
initializeMotion();
