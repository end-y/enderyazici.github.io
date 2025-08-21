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
    // XSS koruması ile temizle
    return filterXSS(rawHtml, {
      whiteList: {
        h1: [],
        h2: [],
        h3: [],
        h4: [],
        h5: [],
        h6: [],
        p: [],
        br: [],
        strong: [],
        b: [],
        em: [],
        i: [],
        u: [],
        ul: [],
        ol: [],
        li: [],
        blockquote: [],
        code: [],
        pre: ["class"],
        a: ["href", "target", "rel"],
        img: ["src", "alt", "title", "width", "height"],
        hr: [],
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

async function runSkills(e) {
  const event = e;
  skills.innerHTML = `<div class="lds-dual-ring"></div>`;
  event.preventDefault();

  const n = await runCache("skill");
  const skillData = n.data || n;
  document.getElementById("JSbar").style.width = filterXSS(skillData.js) + "%";
  document.getElementById("PHPbar").style.width =
    filterXSS(skillData.php) + "%";
  document.getElementById("HTMLbar").style.width =
    filterXSS(skillData.html) + "%";
  document.getElementById("CSSbar").style.width =
    filterXSS(skillData.css) + "%";
  document.getElementById("SQLbar").style.width =
    filterXSS(skillData.sql) + "%";
  skills.innerHTML = `Skills`;
  hoverAnimation(event.target);
  modalAnimation(event);
  history.pushState({}, "", "/#skills");
  // window.routeManager.navigate("/skills")
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
