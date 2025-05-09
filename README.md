# QCHelper - Chrome Extension

QCHelper is a lightweight Chrome extension designed to help users quickly convert product links from CNFANS to either **Raw Link** or **Finds.ly**. With just one click, or a right-click on the page, the extension extracts the product ID and platform type to generate the corresponding URLs.

## 🚀 Features

- ✅ One-click button to open the corresponding **Raw Link** or **Finds.ly** link from a CNFANS product page.
- ✅ Context menu support: right-click on any page to quickly generate and open the desired link.
- ✅ Custom alerts if required information (like `id`, `shop_type`, or `platform`) is missing from the URL.

## 🧠 How it works

The extension looks for the following parameters in the current page's URL:

- `id=...` → used to identify the product.
- `shop_type=...` or `platform=...` → used to determine the marketplace.

Based on these, it generates:

- 🔗 `https://weidian.com/item.html?itemID=...` for **Raw Link**.
- 🔗 `https://finds.ly/product/{shop_type_or_platform}/{id}` for **Finds.ly**.

## 🧩 Installation

1. Download or clone this repository.
2. Go to `chrome://extensions/` in your browser.
3. Enable **Developer mode**.
4. Click **Load unpacked** and select the project folder.
5. The QCHelper icon will now appear in your browser toolbar.

## 🖱️ Usage

### Popup Interface

Click the QCHelper icon in the toolbar to open the popup window. Two buttons are available:

- **Raw Link** → Opens the Raw Link page for the current product.
- **QC Photos (Finds.ly)** → Opens the Finds.ly page for the current product.

### Context Menu

Right-click on any product page, then choose:

- **Convert to Raw Link**
- **Convert to Finds.ly**

These will open the appropriate links in new tabs.
