// Markdown parser ile güvenli rendering fonksiyonu
function renderMarkdown(text, isPreview = false) {
  if (!text) return "";

  let processedText = text;

  // Eğer preview modundaysa metni kısalt
  if (isPreview) {
    // Hr'leri kaldır (farklı formatlarını da yakala)
    processedText = text.replace(/^[\s]*[-=*_]{3,}[\s]*$/gm, "");
    // Fazla boşlukları temizle
    processedText = processedText.replace(/\n\s*\n\s*\n/g, "\n\n");
    // Metni 200 karakter ile sınırla
    if (processedText.length > 200) {
      processedText = processedText.substring(0, 200) + "...";
    }
  }

  try {
    // Markdown'ı HTML'e çevir
    const rawHtml = marked.parse(processedText);
    // Güçlendirilmiş XSS koruması
    return filterXSS(rawHtml, {
      whiteList: CONFIG.SECURITY.ALLOWED_HTML_TAGS,
      stripIgnoreTag: true,
      stripIgnoreTagBody: ["script", "style"],
      onIgnoreTagAttr: function (tag, name, value, isWhiteAttr) {
        // Sadece güvenli attributelere izin ver
        if (name === "href") {
          // URL validation for links
          if (
            isValidURL(value) ||
            value.startsWith("#") ||
            value.startsWith("/")
          ) {
            return name + '="' + filterXSS.escapeAttrValue(value) + '"';
          }
          return "";
        }
      },
    });
  } catch (error) {
    console.error("Markdown parsing error:", error);
    return filterXSS(processedText);
  }
}

let runCache = async (key) => {
  let n = null;
  if (cacheManager.has(key)) {
    n = cacheManager.get(key);
  } else {
    n = await get(key);
    cacheManager.set(key, n);
  }
  return n;
};
async function runAbout(e) {
  const event = e;
  about.innerHTML = `<div class="lds-dual-ring"></div>`;
  event.preventDefault();

  let n = await runCache("about");
  const aboutData = n.data || n;
  document.getElementById("dataAbout").innerHTML = renderMarkdown(
    aboutData.short
  );
  about.innerHTML = `About`;
  hoverAnimation(event.target);
  modalAnimation(event);
  history.pushState({}, "", "/#about");
  // window.routeManager.navigate("/about")
}
async function runContact(e) {
  const event = e;
  contact.innerHTML = `<div class="lds-dual-ring"></div>`;
  event.preventDefault();

  let n = await runCache("contact");
  const contactData = n.data || n;
  document.getElementById("github").href = filterXSS(contactData.github);
  document.getElementById("twitter").href = filterXSS(contactData.twitter);
  document.getElementById("codepen").href = filterXSS(contactData.codepen);
  document.getElementById("linkedin").href = filterXSS(contactData.linkedin);
  contact.innerHTML = `Contact`;
  hoverAnimation(event.target);
  modalAnimation(event);
  history.pushState({}, "", "/#contact");
  // window.routeManager.navigate("/contact")
}

// Modern Skills Animation Functions
function animateProgressRing(element, percentage, duration = 1000) {
  const circumference = 219.91; // 2 * π * 35 (radius)
  const offset = circumference - (percentage / 100) * circumference;

  // Set initial state
  element.style.strokeDashoffset = circumference;

  // Animate to target
  setTimeout(() => {
    element.style.strokeDashoffset = offset;
  }, 100);
}

function animatePercentageText(element, targetPercentage, duration = 1000) {
  let currentPercentage = 0;
  const increment = targetPercentage / (duration / 16); // 60fps

  const timer = setInterval(() => {
    currentPercentage += increment;
    if (currentPercentage >= targetPercentage) {
      currentPercentage = targetPercentage;
      clearInterval(timer);
    }
    element.textContent = Math.round(currentPercentage) + "%";
  }, 16);
}

function triggerSkillAnimations(skillData) {
  const skills = [
    { id: "js", name: "javascript", value: skillData.js },
    { id: "php", name: "php", value: skillData.php },
    { id: "html", name: "html", value: skillData.html },
    { id: "css", name: "css", value: skillData.css },
    { id: "sql", name: "sql", value: skillData.sql },
  ];

  skills.forEach((skill, index) => {
    const circle = document.getElementById(`${skill.id}-circle`);
    const percentage = document.getElementById(`${skill.id}-percentage`);
    const card = document.querySelector(`[data-skill="${skill.name}"]`);

    if (circle && percentage && card) {
      // Update data attribute with actual value from backend
      card.setAttribute("data-percentage", skill.value);

      // Animate progress ring
      setTimeout(() => {
        animateProgressRing(circle, skill.value);
        animatePercentageText(percentage, skill.value);
      }, index * 100);
    }
  });
}

async function runSkills(e) {
  const event = e;
  skills.innerHTML = `<div class="lds-dual-ring"></div>`;
  event.preventDefault();

  try {
    const n = await runCache("skill");
    const skillData = n.data || n;

    // Legacy support for old bar system (hidden by CSS)
    const jsBar = document.getElementById("JSbar");
    const phpBar = document.getElementById("PHPbar");
    const htmlBar = document.getElementById("HTMLbar");
    const cssBar = document.getElementById("CSSbar");
    const sqlBar = document.getElementById("SQLbar");

    if (jsBar) jsBar.style.width = filterXSS(skillData.js) + "%";
    if (phpBar) phpBar.style.width = filterXSS(skillData.php) + "%";
    if (htmlBar) htmlBar.style.width = filterXSS(skillData.html) + "%";
    if (cssBar) cssBar.style.width = filterXSS(skillData.css) + "%";
    if (sqlBar) sqlBar.style.width = filterXSS(skillData.sql) + "%";

    skills.innerHTML = `Skills`;
    hoverAnimation(event.target);
    modalAnimation(event);

    // Initialize skill animations
    setTimeout(() => {
      triggerSkillAnimations(skillData);
    }, 200);

    history.pushState({}, "", "/#skills");
  } catch (error) {
    console.error("Skills loading error:", error);
    skills.innerHTML = `Skills`;
    hoverAnimation(event.target);
    modalAnimation(event);
  }
}

async function runBlog(e) {
  document.getElementById("blogSec").innerHTML = "";
  blog.innerHTML = `<div class="lds-dual-ring"></div>`;
  e.preventDefault();
  const event = e;
  const n = await runCache("blogs");
  const blogData = n.data || n;
  for (let i of blogData) {
    let blogDiv = document.createElement("div");
    blogDiv.className = "blog-item";
    blogDiv.style.cursor = "pointer";
    let h2 = document.createElement("h2");
    let short = document.createElement("div");
    let date = document.createElement("p");
    const itemData = i.attributes || i;
    h2.innerHTML = filterXSS(itemData.head);
    h2.style.marginBottom = "20px";
    date.innerText = filterXSS(itemData.date);
    blogDiv.style.textAlign = "left";
    short.className = "markdown-content blog-summary";
    short.innerHTML = renderMarkdown(itemData.short, true); // Preview modu
    blogDiv.appendChild(h2);
    blogDiv.appendChild(date);
    blogDiv.appendChild(short);
    blogDiv.style.borderBottom = "1px solid black";
    blogDiv.style.marginBottom = "15px";
    blogDiv.style.paddingBottom = "10px";
    document.getElementById("blogSec").appendChild(blogDiv);
    blogDiv.addEventListener("click", async (e) => {
      document.getElementById("content").innerHTML = "";
      modalFold.style.display = "block";

      // Local data'yı kullan, external link hatası olursa fallback
      let displayData = {
        head: itemData.head,
        short: itemData.short,
      };

      // External link'ten data çekmeye çalış (opsiyonel)
      try {
        if (itemData.link) {
          let res = await getFull(itemData.link);
          if (res && res.short) {
            displayData = res;
          }
        }
      } catch (error) {
        console.log("External link fetch failed, using local data:", error);
      }

      let con = document.createElement("div");
      let h1 = document.createElement("h1");
      h1.style.marginBottom = "20px";
      h1.innerHTML = filterXSS(displayData.head);
      let p = document.createElement("div");
      p.className = "markdown-content";
      // Eğer short data yoksa placeholder göster
      const textContent = displayData.short || "İçerik yüklenemedi.";
      p.innerHTML = renderMarkdown(textContent, false); // Tam metin, preview değil
      con.appendChild(h1);
      con.appendChild(p);
      document.getElementById("content").appendChild(con);
    });
  }
  blog.innerHTML = `Blog`;
  hoverAnimation(event.target);
  modalAnimation(event, true);
  history.pushState({}, "", "/#blog");
}
