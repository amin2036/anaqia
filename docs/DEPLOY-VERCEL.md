# Vercel-এ Anaqia তোলা ও anaqia.com যুক্ত করা

## ১. Vercel-এ সাইট তোলা
1. vercel.com → **Sign Up** → **Continue with GitHub** (amin2036 অ্যাকাউন্ট দিয়ে)।
2. **Add New… → Project** → `amin2036/anaqia` এর পাশে **Import**।
   (না দেখালে "Adjust GitHub App Permissions" থেকে anaqia রিপোজিটরিকে অনুমতি দিন।)
3. Framework Preset: **Vite** (নিজে থেকেই আসবে)। Build Command `npm run build`, Output Directory `dist`। কিছু বদলাতে হবে না।
4. **Deploy** চাপুন। ১ মিনিটের মধ্যে `anaqia-xxxx.vercel.app` এর মতো একটা লিঙ্ক পাবেন।

## ২. anaqia.com যুক্ত করা
1. Vercel প্রজেক্ট → **Settings → Domains** → `anaqia.com` লিখে **Add**। `www.anaqia.com` ও যোগ করুন।
2. Vercel যে DNS রেকর্ড দেখাবে সেগুলো লিখে রাখুন। সাধারণত:
   - `A` রেকর্ড, Host `@`, Value `76.76.21.21`
   - `CNAME` রেকর্ড, Host `www`, Value `cname.vercel-dns.com`
   (Vercel আলাদা মান দেখালে সেটাই ব্যবহার করুন।)
3. Spaceship → **Launchpad → Domain Manager → anaqia.com → Advanced DNS**।
   আগে থেকে থাকা `@` আর `www` এর A/CNAME (পার্কিং) রেকর্ড মুছে উপরের দুটি রেকর্ড যোগ করুন।
4. ১০ মিনিট থেকে কয়েক ঘণ্টার মধ্যে Vercel-এ ডোমেইনের পাশে সবুজ ✓ আসবে, আর https (SSL) নিজে থেকে চালু হবে।

## পরে আপডেট
কোড GitHub-এ push হলেই Vercel নিজে থেকে নতুন ভার্সন অনলাইনে তুলে দেবে।
