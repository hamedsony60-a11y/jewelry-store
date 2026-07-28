# زرنگار | فروشگاه طلا و جواهرات

سایت فروشگاهی لوکس با طراحی iOS-inspired

## آدرس سایت
بعد از فعال‌سازی Pages:
**https://hamedsony60-a11y.github.io/jewelry-store/**

## چطور محصول اضافه کنیم؟

فایل `script.js` را باز کن و داخل آرایه `products` یک آبجکت جدید اضافه کن:

```js
{
  id: 9,                          // عدد یکتا
  name: "نام محصول",
  category: "ring",               // ring | necklace | bracelet | earring
  price: 35000000,
  image: "آدرس عکس از اینترنت",
  badge: "جدید",                  // یا خالی ""
  desc: "توضیحات محصول",
  paymentLink: "https://zarinp.al/xxxx"  // لینک درگاه پرداخت
}
```

## اتصال به درگاه پرداخت (زرین‌پال)

1. در زرین‌پال یک لینک پرداخت بساز
2. لینک را در فیلد `paymentLink` هر محصول قرار بده
3. کاربر با زدن دکمه «خرید مستقیم» به درگاه هدایت می‌شود

> برای سبد خرید داینامیک واقعی نیاز به سرور (بک‌اند) دارید.

## فعال‌سازی GitHub Pages
Settings → Pages → Deploy from a branch → main → / (root) → Save
