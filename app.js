const $ = (s) => document.querySelector(s),
  $$ = (s) => document.querySelectorAll(s);
window.addEventListener("load", () =>
  setTimeout(() => $("#loader").classList.add("done"), 500),
);
const glow = $("#glow");
window.addEventListener("pointermove", (e) => {
  glow.style.left = e.clientX + "px";
  glow.style.top = e.clientY + "px";
});
window.addEventListener("scroll", () => {
  let h = document.documentElement.scrollHeight - innerHeight;
  $("#scrollProgress").style.width = (scrollY / h) * 100 + "%";
  $("#nav").classList.toggle("stuck", scrollY > 40);
});
$("#hamburger").onclick = () => $("#menu").classList.toggle("open");
$$("#menu a").forEach(
  (a) => (a.onclick = () => $("#menu").classList.remove("open")),
);
const search = $("#eventSearch");
search?.addEventListener("input", (e) =>
  $$("#technicalGrid .event-card").forEach(
    (c) =>
      (c.style.display = c.dataset.name.includes(e.target.value.toLowerCase())
        ? "flex"
        : "none"),
  ),
);
const dialog = $("#rulesDialog");
$$(".rules").forEach(
  (b) =>
    (b.onclick = () => {
      $("#ruleTitle").textContent = b.dataset.title;
      $("#ruleList").innerHTML = b.dataset.rules
        .split("|")
        .map((x) => `<li>${x}</li>`)
        .join("");
      dialog.showModal();
    }),
);
$(".close").onclick = () => dialog.close();
dialog.addEventListener("click", (e) => {
  if (e.target === dialog) dialog.close();
});
function toast(t) {
  let x = $("#toast");
  x.textContent = t;
  x.classList.add("show");
  setTimeout(() => x.classList.remove("show"), 2600);
}
$("#copyLink").onclick = async () => {
  try {
    await navigator.clipboard.writeText(
      "https://docs.google.com/forms/d/e/1FAIpQLSfqVHv9h-TVXLEeJekLV90vyWVdqraAZtLsTosYT09HKLioBQ/viewform",
    );
    toast("Registration link copied!");
  } catch {
    toast("electra26.vercel.app/register");
  }
};
$("#calendar").onclick = () => {
  let start = "20260917T033000Z",
    end = "20260917T113000Z",
    u = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=E-MISSION+2K26&dates=${start}/${end}&details=19th+State+Level+Technical+Symposium&location=EDISION+HALL,+M.A.M.+College+of+Engineering`;
  window.open(u, "_blank");
};
function tick() {
  let d = new Date("2026-09-17T09:00:00+05:30") - Date.now();
  let vals = [
    Math.max(0, Math.floor(d / 864e5)),
    Math.max(0, Math.floor(d / 36e5) % 24),
    Math.max(0, Math.floor(d / 6e4) % 60),
  ];
  $$("#countdown b").forEach(
    (b, i) => (b.textContent = String(vals[i]).padStart(2, "0")),
  );
}
tick();
setInterval(tick, 60000);
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.getRegistrations().then((registrations) => {
    registrations.forEach((registration) => registration.unregister());
  });
}
