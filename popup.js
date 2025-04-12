document.addEventListener('DOMContentLoaded', function() {

  // Fonction pour transformer l'URL en Raw (Weidian ou Taobao) en fonction du shopType
  function transformToRawUrl(cnfansUrl, shopType) {
    // Expression régulière pour extraire l'ID produit
    const idRegex = /id=(\d+)/;
    const match = cnfansUrl.match(idRegex);
  
    if (match) {
      const productId = match[1];
  
      // Vérifier le shopType et générer l'URL appropriée
      let rawUrl = null;
      if (shopType.toLowerCase() === "weidian") {  // Comparaison insensible à la casse
        rawUrl = `https://weidian.com/item.html?itemID=${productId}`;
      } else if (shopType.toLowerCase() === "taobao") {  // Comparaison insensible à la casse
        rawUrl = `https://item.taobao.com/item.htm?ft=t&id=${productId}`;
      }
  
      if (rawUrl) {
        return [rawUrl, productId];
      }
    }
    
    return null; // Retourner null si l'ID n'est pas trouvé ou le shopType est invalide
  }

  function getPlatformAndIdFromUrl(url) {
    // Expression régulière pour détecter un lien Taobao
    const taobaoRegex = /https:\/\/item\.taobao\.com\/item\.htm\?ft=t&id=(\d+)/;
  
    // Expression régulière pour détecter un lien Weidian
    const weidianRegex = /https:\/\/weidian\.com\/item\.html\?itemID=(\d+)/;
  
    let platform = null;
    let productId = null;
  
    // Vérification pour Taobao
    const taobaoMatch = url.match(taobaoRegex);
    if (taobaoMatch) {
      platform = 'taobao';
      productId = taobaoMatch[1];
    }
  
    // Vérification pour Weidian
    const weidianMatch = url.match(weidianRegex);
    if (weidianMatch) {
      platform = 'weidian';
      productId = weidianMatch[1];
    }
  
    if (platform && productId) {
      return { platform, productId };
    } else {
      return null; // Retourne null si l'URL n'est ni Taobao ni Weidian
    }
  }

  // Fonction pour récupérer le shopType (en gérant les majuscules et minuscules)
  function getShopTypeFromUrl(url) {
    const regex = /[?&](shop_type|platform)=([^&]+)/;
    const match = url.match(regex);
    return match ? match[2].toLowerCase() : null; // Retourne la valeur après "shop_type=" ou "platform=" en minuscule
  }

  // Écouter le clic sur le bouton "Raw"
  document.getElementById('rawButton').addEventListener('click', function() {
    // Récupérer l'URL actuelle de l'onglet actif
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      const currentUrl = tabs[0].url; // URL de l'onglet actif

      // Vérifier le paramètre shop_type dans l'URL
      const shopType = getShopTypeFromUrl(currentUrl);
      if (!shopType) {
        showCustomAlert("The 'shop_type' parameter was not found in the URL.");
        return;
      }
      
      // Transformer l'URL cnfans en URL Raw (Weidian ou Taobao)
      const result = transformToRawUrl(currentUrl, shopType);
      
      if (result) {
        const rawUrl = result[0];
        // Ouvrir l'URL Raw dans un nouvel onglet
        chrome.tabs.create({ url: rawUrl });
      } else {
        showCustomAlert("Product ID not found in the URL.");
      }
    });
  });

  // Écouter le clic sur le bouton "QC"
  document.getElementById('QCButton').addEventListener('click', function() {
    // Récupérer l'URL actuelle de l'onglet actif
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      const currentUrl = tabs[0].url; // URL de l'onglet actif

      // Vérifier le paramètre shop_type dans l'URL
      const shopType = getShopTypeFromUrl(currentUrl);
        if (currentUrl.startsWith("https://item.taobao.com/") || currentUrl.startsWith("https://weidian.com/")) {
          const result = getPlatformAndIdFromUrl(currentUrl);
          const findslyUrl = `https://finds.ly/product/${result.platform.toLowerCase()}/${result.productId}`; // Assurez-vous de rendre shopType en minuscule
          chrome.tabs.create({ url: findslyUrl });
          return;
      } else if (!shopType) {
        showCustomAlert("The 'shop_type' parameter was not found in the URL.");
        return;
      } 

      // Transformer l'URL cnfans en URL Weidian
      const result = transformToRawUrl(currentUrl, shopType);

      if (result) {
        const FindslyUrl = `https://finds.ly/product/${shopType}/${result[1]}`;
        // Ouvrir l'URL de Finds.ly dans un nouvel onglet
        chrome.tabs.create({ url: FindslyUrl });
      } else {
        showCustomAlert("Product ID not found in the URL.");
      }
    });
  });

  // Écouter le clic sur le bouton "QC"
  document.getElementById('CnfansButton').addEventListener('click', function() {
    // Récupérer l'URL actuelle de l'onglet actif
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      
      const currentUrl = tabs[0].url; // URL de l'onglet actif
      const result = getPlatformAndIdFromUrl(currentUrl);

      const cnfansLink = `https://cnfans.com/product/?shop_type=${result.platform}&id=${result.productId}`

      chrome.tabs.create({ url: cnfansLink });
    });
  });
});

// Fonction pour afficher l'alerte personnalisée
function showCustomAlert(message) {
  // Sélectionner l'élément de l'alerte
  const alertBox = document.getElementById('customAlert');
  const alertMessage = document.getElementById('alertMessage');
  
  // Mettre à jour le message
  alertMessage.textContent = message;
  
  // Afficher l'alerte
  alertBox.style.display = 'flex';
  
  // Fermer l'alerte quand on clique sur le bouton "Fermer"
  document.getElementById('closeAlert').addEventListener('click', function() {
    alertBox.style.display = 'none'; // Cacher l'alerte
  });
}
