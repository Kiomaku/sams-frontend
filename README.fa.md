<div align="center">

<img src="public/logo.webp" width="120" alt="SamS logo" />

# SamS — رابط کاربری چت

**یک رابط وب شبیه ChatGPT برای API چت شخصی شما. تاریک و روشن، پرانیمیشن و دوستدار فارسی.**

[🇬🇧 English](README.md) · 🇮🇷 فارسی · [📖 صفحه آموزش](https://kiomaku.github.io/sams-frontend/) · [🔌 راهنمای API](docs/API.md)

![License](https://img.shields.io/badge/license-MIT-1a8cff)
![Node](https://img.shields.io/badge/node-%E2%89%A518-339933?logo=nodedotjs&logoColor=white)
![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-5-646CFF?logo=vite&logoColor=white)
![Tailwind](https://img.shields.io/badge/Tailwind-3-06B6D4?logo=tailwindcss&logoColor=white)
![HeroUI](https://img.shields.io/badge/HeroUI-2-000000)

<img src="https://skillicons.dev/icons?i=react,vite,tailwind,js,html,css,nodejs,npm,python,flask,git,github&perline=12" alt="tech stack icons" />

</div>

<div dir="rtl">

---

## ✨ SamS چیست؟

SamS فقط **فرانت‌اند** یک چت‌بات است. با یک API ساده‌ی JSON (ورود، چت، نشست‌ها، وضعیت — [docs/API.md](docs/API.md)) که روی همان سیستم یا هر سرور دیگری اجرا می‌شود کار می‌کند. پروژه را کلون کنید، به بک‌اند خودتان وصل کنید و یک اپ چت شیک همراه با پنل ادمین داشته باشید.

## 🧩 امکانات

**💬 چت**
- نمایش Markdown (جدول، لیست، لینک، بولد و…) با پاک‌سازی امن توسط DOMPurify
- **بلوک کد** به سبک ChatGPT: نام زبان، رنگ‌آمیزی کد و دکمه‌ی **کپی** (حتی روی `http://` ساده)
- **اوربِ تفکر** متحرک هنگام پاسخ‌دهی (working ← searching ← solving ← composing)
- پیام خطای دوستانه و دکمه‌ی **تلاش دوباره** (صف شلوغ، شکست تلاش‌ها، منقضی شدن نشست)
- سایدبار چت‌های اخیر: باز کردن، حذف، جمع کردن؛ و کشوی موبایل
- **شخصیت / اهداف / خطوط قرمز** برای هر چت و سوییچ ذخیره در تاریخچه
- کپی پاسخ، اسکرول خودکار، `Enter` برای ارسال و `Shift+Enter` برای خط جدید
- **۸۰ خوشامدگویی** متناسب با ساعت روز (صبح، ظهر، عصر، شب، نیمه‌شب)

**🎨 طراحی**
- حالت تاریک و روشن با پالت مشکی (`#111111`، `#151515`، `#20201f`) و ذخیره روی هر دستگاه
- کامپوننت‌های [HeroUI](https://www.heroui.com) و چیدمان شبیه ChatGPT که کل ارتفاع مرورگر را پر می‌کند
- انیمیشن‌های نرم با Framer Motion (قابل خاموش شدن در تنظیمات)
- آیکن‌های [Hugeicons](https://hugeicons.com) و ایموجی‌های سبک اپل (قابل تعویض)
- فاوآیکن، آیکن اپل، مانیفست وب و تگ‌های Open Graph

**👤 حساب و تنظیمات**
- ثبت‌نام / ورود / خروج با اعتبارسنجی و بازیابی نشست
- صفحه‌ی تنظیمات: پروفایل و آمار، تم، انیمیشن، پیش‌فرض‌های چت، *حذف همه‌ی چت‌ها*
- عنوان‌های خنده‌دار و تصادفی صفحات 😄

**🛠 پنل ادمین**
- وضعیت زنده هر ۳ ثانیه: ورکرهای آنلاین/مشغول، عمق صف، تعداد تاریخچه
- جدول ورکرها و نشست‌های شما همراه با حذف
- فقط برای ایمیل‌های `VITE_ADMIN_EMAILS` نمایش داده می‌شود (فقط در رابط؛ بخش [امنیت](#-نکات-امنیتی))

## 🚀 شروع سریع

</div>

```bash
git clone https://github.com/kiomaku/sams-frontend.git
cd sams-frontend
cp .env.example .env        # سپس .env را ویرایش کنید
npm install
npm start                   # http://localhost:5173
```

<div dir="rtl">

پیش‌نیازها: **Node.js نسخه‌ی ۱۸ یا بالاتر** و یک بک‌اند در حال اجرا (پیش‌فرض `http://127.0.0.1:5000`).

| دستور | کاربرد |
|---|---|
| `npm start` / `npm run dev` | سرور توسعه با پروکسی `/api` به بک‌اند |
| `npm run build` | ساخت نسخه‌ی نهایی در پوشه‌ی `dist/` |
| `npm run start:prod` | ساخت + پیش‌نمایش روی پورت ۵۱۷۳ |

## ⚙️ تنظیمات (`.env`)

| متغیر | پیش‌فرض | توضیح |
|---|---|---|
| `VITE_APP_NAME` | `SamS` | نام نمایش داده‌شده در رابط |
| `VITE_ADMIN_EMAILS` | *(خالی)* | ایمیل‌هایی (جداشده با کاما) که تب **Admin** را می‌بینند (فقط ظاهری) |
| `VITE_API_BASE` | *(خالی)* | خالی = همان دامنه با `/api`؛ یا مثلاً `https://api.example.com` (نیاز به CORS و credentials) |
| `API_PROXY_TARGET` | `http://127.0.0.1:5000` | مقصد پروکسی در توسعه |
| `DEV_PORT` | `5173` | پورت سرور توسعه |

> فایل `.env` در Git نادیده گرفته می‌شود. **فقط `.env.example` را کامیت کنید.** هر متغیر `VITE_*` داخل جاوااسکریپت عمومی قرار می‌گیرد.

## 🗺 صفحه‌ها (مسیرها)

SamS یک اپ تک‌صفحه‌ای **بدون روتر URL** است؛ آدرس همیشه `/` می‌ماند و روی هر هاست استاتیکی اجرا می‌شود.

| صفحه | روش باز کردن | چه کسی |
|---|---|---|
| ورود / ثبت‌نام | خودکار وقتی وارد نشده‌اید | همه |
| چت (جدید / قبلی) | پیش‌فرض، سایدبار ← *New chat* یا یک چت اخیر | کاربر واردشده |
| تنظیمات | منوی حساب (پایین سایدبار) ← *Settings* | کاربر واردشده |
| ادمین | سایدبار ← *Admin* | ایمیل‌های `VITE_ADMIN_EMAILS` |

## 🔌 مسیرهای API

جزئیات کامل در **[docs/API.md](docs/API.md)**.

| متد | مسیر | نیاز به ورود | کاربرد |
|---|---|---|---|
| POST | `/api/auth/register` | – | ساخت حساب |
| POST | `/api/auth/login` | – | ورود (ست شدن کوکی) |
| POST | `/api/auth/logout` | ✔ | خروج |
| GET | `/api/auth/me` | ✔ | بازیابی وضعیت ورود |
| POST | `/api/chat` | ✔ | ارسال پیام (بدون `session_id` = چت جدید) |
| GET | `/api/sessions` | ✔ | فهرست چت‌ها |
| GET | `/api/sessions/<id>` | ✔ | تاریخچه‌ی یک چت |
| DELETE | `/api/sessions/<id>` | ✔ | حذف چت |
| GET | `/api/status` | – | وضعیت ورکرها و صف (هر ۳ ثانیه) |

## 🏗 استقرار

```bash
npm run build      # ← dist/
```

**Flask (روی همان سیستم API پایتون):**

</div>

```python
app = Flask(__name__, static_folder="dist", static_url_path="")
@app.route("/")
def index(): return app.send_static_file("index.html")
```

<div dir="rtl">

**Nginx:**

</div>

```nginx
server {
  listen 80;
  root /var/www/sams/dist;
  location /api/ { proxy_pass http://127.0.0.1:5000; proxy_read_timeout 180s; }
  location / { try_files $uri /index.html; }
}
```

<div dir="rtl">

> پاسخ چت ممکن است زمان‌بر باشد؛ مقدار `proxy_read_timeout` را بزرگ نگه دارید.

## 📖 صفحه‌ی آموزش

یک راهنمای زیبا و دوزبانه (فارسی/English) به‌صورت گام‌به‌گام در [`docs/index.html`](docs/index.html) قرار دارد.
فعال‌سازی در گیت‌هاب: **Settings ← Pages ← Source: GitHub Actions** (ورک‌فلوی `.github/workflows/pages.yml` پوشه‌ی `docs/` را منتشر می‌کند).

## 📁 ساختار پروژه

</div>

```
sams-frontend/
├─ docs/                 صفحه‌ی آموزش (GitHub Pages) + API.md
├─ public/               لوگو، فاوآیکن‌ها، مانیفست
├─ src/
│  ├─ App.jsx            ورود، تم، وضعیت آنلاین
│  ├─ Chat.jsx           چیدمان: سایدبار، چت، ورودی، صفحه‌ها
│  ├─ Auth.jsx           ورود / ثبت‌نام
│  ├─ SettingsPage.jsx   پروفایل و تنظیمات
│  ├─ Admin.jsx          داشبورد وضعیت
│  ├─ Markdown.jsx       مارک‌داون امن + بلوک کد
│  ├─ Thinking.jsx       لودرهای thinking-orbs
│  ├─ emoji.js · EmojiText.jsx   ایموجی تصویری سبک اپل
│  ├─ greetings.js · titles.js   متن‌های بامزه (آزادانه ویرایش کنید)
│  ├─ api.js · config.js         کلاینت API و تنظیمات env
│  └─ icons.jsx          نگاشت آیکن‌های Hugeicons
├─ .env.example · tailwind.config.js · vite.config.js
```

<div dir="rtl">

## 🎛 شخصی‌سازی

- **رنگ‌ها:** `tailwind.config.js` (پالت تاریک/روشن)
- **خوشامدگویی‌ها و عنوان‌ها:** `src/greetings.js` و `src/titles.js`
- **لوگو و فاوآیکن:** فایل‌های پوشه‌ی `public/` را جایگزین کنید
- **مجموعه‌ی ایموجی:** مقدار `BASE` در `src/emoji.js`

## 🔒 نکات امنیتی

- هرگز `.env` را کامیت نکنید و هیچ رازی را در متغیرهای `VITE_*` نگذارید.
- محدودیت تب Admin فقط **ظاهری** است؛ نقش‌ها را در بک‌اند اعمال کنید.
- پاسخ هوش مصنوعی غیرقابل‌اعتماد است و پیش از نمایش پاک‌سازی می‌شود؛ این مرحله را حذف نکنید.

## 🙏 منابع و مجوزها

React، Vite، Tailwind CSS، [HeroUI](https://www.heroui.com)، Framer Motion، marked، DOMPurify، highlight.js، [Hugeicons](https://hugeicons.com) و [thinking-orbs](https://www.npmjs.com/package/thinking-orbs).
تصاویر ایموجی از بسته‌ی `emoji-datasource-apple` بارگذاری می‌شوند. **طرح ایموجی‌های اپل متعلق به شرکت اپل است**؛ پیش از استفاده در محصول عمومی/تجاری مجوز را بررسی کنید یا مجموعه را در `src/emoji.js` عوض کنید.

## 🤝 مشارکت · 📄 مجوز

[CONTRIBUTING.md](CONTRIBUTING.md) را ببینید. تحت [مجوز MIT](LICENSE) منتشر شده است.

</div>
