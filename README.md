<p align="center">
   <img src="https://custom-icon-badges.demolab.com/badge/VS%20Code-0078d7.svg?logo=vsc&logoColor=white">
   <img src="https://img.shields.io/badge/0.9.2-kat?style=flat&label=Kyt%20Kat%20Version&labelColor=%236573b5&color=%23c0d7f2">
   <img src="https://img.shields.io/badge/Node.js-6DA55F?logo=node.js&logoColor=white">
   <img src="https://img.shields.io/badge/npm-CB3837?logo=npm&logoColor=fff">
   <img src="https://custom-icon-badges.demolab.com/badge/javascript-F9DC3E.svg?logo=javascript&logoColor=white">
   <img src="https://img.shields.io/badge/Apache%20Licence-2.0-0091ea?style=flat&logo=apache&labelColor=0071b7&color=0091ea">
</p>

# 🅺🆈🆃 🅺🅰🆃  - 𝘍𝘢𝘴𝘵 𝘢𝘯𝘥 𝘔𝘪𝘯𝘪𝘮𝘢𝘭𝘪𝘴𝘵 𝘚𝘦𝘳𝘷𝘦 𝘍𝘪𝘭𝘦 𝘓𝘪𝘣𝘳𝘢𝘳𝘺 / کیت کت - کتابخانه سریع و مینیمال برای سرو فایل

## 🍫 Kyt Kat is a JavaScript library for serving static files with smart caching capabilities.
##### 💠 ```kyt kat``` is a key to address transfermation - kit

## 💠 Introduction / معرفی

🏷 |```Kyt Kat```| is a lightweight, high-performance JavaScript library for serving static files in Node.js applications. It provides a simple yet powerful way to handle static assets with configurable caching policies.

🏷 |```کیت کت```| یک کتابخانه سبک و پرسرعت جاوااسکریپت برای سرو فایل‌های استاتیک در برنامه‌های Node.js است. این کتابخانه راهی ساده اما قدرتمند برای مدیریت فایل‌های استاتیک با سیاست‌های کش قابل تنظیم ارائه می‌دهد.

## 💠 Key Features / ویژگی‌های کلیدی ✨

- **1️⃣ Smart Caching System**: Configurable caching policies for different file types / سیستم کش هوشمند با سیاست‌های قابل تنظیم برای انواع فایل‌ها
- **2️⃣ Easy Configuration**: Simple setup with `kytkat.config.js` / پیکربندی آسان با فایل `kytkat.config.js`
- **3️⃣ CLI Tools**: Built-in command line tools for configuration / ابزارهای خط فرمان برای پیکربندی خودکار
- **4️⃣ Wide File Support**: Supports images, scripts, fonts, styles and more / پشتیبانی از انواع فایل‌ها شامل تصاویر، اسکریپت‌ها، فونت‌ها و استایل‌ها
- **5️⃣ Performance Optimized**: Efficient file handling with minimal overhead / بهینه‌شده برای عملکرد بالا با حداقل سربار

## 💠 Installation / نصب 📦

```bash
npm install kytkat
```

## 💠 Configuration / پیکربندی

Create a `kytkat.config.js` file / فایل `kytkat.config.js` را ایجاد کنید:

```javascript
import RootCollection from "kytkat/root";

export default new RootCollection(() => ({
  configCache: {
    images: {
      extensions: ["png", "jpg", "webp"],
      policy: "public, max-age=31536000, immutable"
    },
    scripts: {
      extensions: ["js", "mjs"],
      policy: "public, max-age=3600"
    }
  },
  staticRoot: {
    "logo": "./static/images/logo.png",
    "main": "./static/js/main.js"
  }
}));
```
#### - You can also use the Kyt Kat CLI and type the following command to automatically generate the config file:
```bash
npx kytkat config
```
## 💠 Basic Usage / استفاده پایه

```javascript
// app.js---------------------------------Start--------------------------------
// Initialize configuration
import 'kytkat/root';

// server.js---------------------------------App--------------------------------V1
import kitkat from 'kytkat';
import http from 'http';

http.createServer(async (req, res) => {
  if (req.url === '/logo.png') {
    await kitkat.staticRender("logo", (response) => {
      const { data, header } = response;
      res.writeHead(200, header);
      res.end(data);
    });
  } else {
    res.writeHead(404);
    res.end('Not found');
  }
}).listen(3000);

// server.js---------------------------------OR---------------------------------V2
import kitkat from 'kytkat';
import http from 'http';
http.createServer(async (req, res) => {
    const { method, url } = req;
  if (method === 'GET') {
    await kitkat.staticRender(url, (response) => {
      const { data, header } = response;
      res.writeHead(200, header);
      res.end(data);
    });
  } else {
    res.writeHead(404);
    res.end('Not found');
  }
}).listen(3000);
```
## 💠 CLI Tools / ابزارهای خط فرمان

### Kyt Kat comes with useful CLI tools:

```bash
# Generate config file automatically
npx kytkat config

# Scan a folder and generate config
npx kytkat generate assets

# Scan with specific file types
npx kytkat generate static -type png jpg css

# Set scan depth
npx kytkat generate src -depth 5
```

## 💠 Caching Policies / سیاست‌های کش

### You can configure different caching policies for different file types:

```javascript
configCache: {
  images: {
    extensions: ["png", "jpg", "webp"],
    policy: "public, max-age=31536000, immutable" // 1 year
  },
  scripts: {
    extensions: ["js", "mjs"],
    policy: "public, max-age=3600" // 1 hour
  },
  html: {
    extensions: ["html", "htm"],
    policy: "no-cache" // No caching
  }
}
```

## 💠 Supported File Types / انواع فایل‌های پشتیبانی شده

### Kyt Kat supports a wide range of file types with proper Content-Type headers:

- Images: png, jpg, jpeg, webp, gif, svg, ico, bmp, tiff

- Scripts: js, mjs, cjs, json, xml

- Fonts: woff, woff2, ttf, otf, eot

- Styles: css, scss, less

- Documents: html, htm, pdf, doc, xls, ppt

- Media: mp4, webm, ogg, mp3, wav


## 💠 Performance Analysis / تحلیل عملکرد

### 🔰 Kyt Kat is optimized for high performance with / کیت کت برای عملکرد بالا بهینه شده است:

- Minimal memory usage (~5KB per file cache) | حداقل استفاده از حافظه (حدود ۵ کیلوبایت برای هر فایل کش)

- Non-blocking I/O operations | عملیات ورودی/خروجی غیر مسدودکننده

- Efficient file handling | مدیریت کارآمد فایل‌ها

- Smart caching system | سیستم ذخیره‌سازی هوشمند

### 🔰 Fast file rendering / رندرینگ سریع فایل‌ها:

- Average response time: 5-15ms for static files | میانگین زمان پاسخ‌دهی: 5-15 میلی ثانیه برای فایل‌های استاتیک

- Optimization for frequent files with smart caching | بهینه‌سازی برای فایل‌های پرتکرار با کش هوشمند

- 40% reduction in loading time using advanced Cache-Control | کاهش 40% زمان بارگذاری

## License / مجوز 📄

Apache License 2.0 © Amir Hussein Muhammadi Fard

## Contribution / مشارکت 🤝

Contributions are welcome! Please refer to the contribution guidelines. / مشارکت‌ها مورد استقبال هستند! لطفاً به راهنمای مشارکت مراجعه کنید.
