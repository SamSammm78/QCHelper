chrome.runtime.onInstalled.addListener(() => {
    // Menu contextuel Findsly
    chrome.contextMenus.create({
      id: "convertToFindslyPage",
      title: "Convert to Finds.ly",
      contexts: ["page"],
    });
  
    // Menu contextuel Weidian
    chrome.contextMenus.create({
      id: "convertToWeidian",
      title: "Convert to Weidian",
      contexts: ["page"],
    });
  });
  
  chrome.contextMenus.onClicked.addListener((info, tab) => {
    const url = tab.url;
  
    // Fonction utilitaire pour afficher une alerte dans l'onglet actif
    const showAlert = (message) => {
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: (msg) => alert(msg),
        args: [message],
      });
    };
  
    // Fonction pour extraire une valeur depuis une query string
    const getParam = (url, key) => {
      const regex = new RegExp(`[?&]${key}=([^&]+)`);
      const match = url.match(regex);
      return match ? match[1] : null;
    };
  
    if (info.menuItemId === "convertToFindslyPage") {
      const shopType = getParam(url, "shop_type") || getParam(url, "platform");
      const idMatch = url.match(/id=(\d+)/);
      const productId = idMatch ? idMatch[1] : null;
  
      if (shopType && productId) {
        const findslyUrl = `https://finds.ly/product/${shopType}/${productId}`;
        chrome.tabs.create({ url: findslyUrl });
      } else {
        showAlert("Couldn't extract 'shop_type', 'platform', or product ID from the URL.");
      }
  
    } else if (info.menuItemId === "convertToWeidian") {
      const idMatch = url.match(/id=(\d+)/);
      const productId = idMatch ? idMatch[1] : null;
  
      if (productId) {
        const weidianUrl = `https://weidian.com/item.html?itemID=${productId}`;
        chrome.tabs.create({ url: weidianUrl });
      } else {
        showAlert("Couldn't extract product ID from the URL.");
      }
    }
  });
  