chrome.runtime.onInstalled.addListener(() => {
  // Menu contextuel Findsly pour les pages
  chrome.contextMenus.create({
    id: "convertToFindsly",
    title: "Convert to Finds.ly",
    contexts: ["page", "link"], // Menu pour la page entière et les liens
  });

  // Menu contextuel Raw pour les pages
  chrome.contextMenus.create({
    id: "convertToRaw",
    title: "Convert to Raw",
    contexts: ["page", "link"], // Menu pour la page entière et les liens
  });
});

// Fonction utilitaire pour afficher une alerte dans l'onglet actif
const showAlert = (tab, message) => {
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: (msg) => alert(msg),
    args: [message],
  });
};

// Fonction pour extraire un paramètre depuis une query string dans l'URL
const getParam = (url, key) => {
  const regex = new RegExp(`[?&]${key}=([^&]+)`, 'i');  // Ajout du 'i' pour rendre la recherche insensible à la casse
  const match = url.match(regex);
  return match ? decodeURIComponent(match[1]) : null;
};

chrome.contextMenus.onClicked.addListener((info, tab) => {
  const url = info.linkUrl || tab.url; // Utiliser l'URL du lien ou de la page

  // Extraire le shopType et l'ID du produit
  const shopType = getParam(url, "shop_type") || getParam(url, "platform");
  const idMatch = url.match(/id=(\d+)/);
  const productId = idMatch ? idMatch[1] : null;

  if (info.menuItemId === "convertToFindsly") {
    if (shopType && productId) {
      const findslyUrl = `https://finds.ly/product/${shopType.toLowerCase()}/${productId}`; // Assurez-vous de rendre shopType en minuscule
      chrome.tabs.create({ url: findslyUrl });
    } else {
      showAlert(tab, "Couldn't extract 'shop_type', 'platform', or product ID from the URL.");
    }

  } else if (info.menuItemId === "convertToRaw") {
    if (productId && shopType) {
      let rawUrl = null;
      if (shopType.toLowerCase() === "weidian") {  // Comparaison insensible à la casse
        rawUrl = `https://weidian.com/item.html?itemID=${productId}`;
      } else if (shopType.toLowerCase() === "taobao") {  // Comparaison insensible à la casse
        rawUrl = `https://item.taobao.com/item.htm?ft=t&id=${productId}`;
      }

      if (rawUrl) {
        chrome.tabs.create({ url: rawUrl });
      } else {
        showAlert(tab, "Unsupported shop type or product ID not found.");
      }
    } else {
      showAlert(tab, "Couldn't extract product ID or shop type from the URL.");
    }
  }
});
