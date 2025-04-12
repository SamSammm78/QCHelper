document.addEventListener('DOMContentLoaded', function() {

    function transformCnfansToWeidian(cnfansUrl) {
      // Utilisation d'une expression régulière pour extraire l'ID du produit
      const regex = /id=(\d+)/;
      const match = cnfansUrl.match(regex);
      
      if (match) {
        const productId = match[1];
        // Construire l'URL correspondant sur Weidian
        const weidianUrl = `https://weidian.com/item.html?itemID=${productId}`;
        return [weidianUrl, productId];
      } else {
        return null; // Retourner null si l'ID n'est pas trouvé
      }
    }
  
    // Fonction pour récupérer la valeur de shop_type dans l'URL
    function getShopTypeFromUrl(url) {
      const regex = /[?&]shop_type=([^&]+)/;
      const match = url.match(regex);
      return match ? match[1] : null; // Retourne la valeur après "shop_type=" ou null si non trouvé
    }
  
    document.getElementById('weidianButton').addEventListener('click', function() {
      // Récupérer l'URL actuelle de l'onglet actif
      chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
        const currentUrl = tabs[0].url; // URL de l'onglet actif
  
        // Vérifier le paramètre shop_type dans l'URL
        const shopType = getShopTypeFromUrl(currentUrl);
        if (!shopType) {
          showCustomAlert("The 'shop_type' parameter was not found in the URL.");
          return;
        }
  
        // Transformer l'URL cnfans en URL Weidian
        const result = transformCnfansToWeidian(currentUrl);
  
        if (result) {
          const weidianUrl = result[0];
          // Ouvrir l'URL de Weidian dans un nouvel onglet
          chrome.tabs.create({ url: weidianUrl });
        } else {
          showCustomAlert("Product ID not found in the URL.");
        }
      });
    });
  
    document.getElementById('QCButton').addEventListener('click', function() {
      // Récupérer l'URL actuelle de l'onglet actif
      chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
        const currentUrl = tabs[0].url; // URL de l'onglet actif
  
        // Vérifier le paramètre shop_type dans l'URL
        const shopType = getShopTypeFromUrl(currentUrl);
        if (!shopType) {
          showCustomAlert("The 'shop_type' parameter was not found in the URL.");
          return;
        }
  
        // Transformer l'URL cnfans en URL Weidian
        const result = transformCnfansToWeidian(currentUrl);
  
        if (result) {
          const FindslyUrl = `https://finds.ly/product/${shopType}/${result[1]}`;
          // Ouvrir l'URL de Finds.ly dans un nouvel onglet
          chrome.tabs.create({ url: FindslyUrl });
        } else {
          showCustomAlert("Product ID not found in the URL.");
        }
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
  