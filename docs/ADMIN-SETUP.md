# অ্যাডমিন প্যানেল চালু করা (Supabase)

সময় লাগবে প্রায় ১৫ মিনিট। সব কিছু ফ্রি প্ল্যানে হবে।

## ১. Supabase প্রজেক্ট খোলা
1. **supabase.com** → **Start your project** → **Continue with GitHub**।
2. **New project**:
   - Name: `anaqia`
   - Database Password: একটা শক্ত পাসওয়ার্ড দিন এবং **নিরাপদে লিখে রাখুন** (কাউকে দেবেন না, আমাকেও না)।
   - Region: **South Asia (Mumbai)** — বাংলাদেশের সবচেয়ে কাছে।
3. **Create new project** চাপুন, ১–২ মিনিট অপেক্ষা করুন।

## ২. ডেটাবেস তৈরি
1. বাঁ পাশে **SQL Editor** → **New query**।
2. GitHub-এ `supabase/schema.sql` ফাইলটি খুলে **Raw** চাপুন, পুরোটা কপি করে এখানে পেস্ট করুন → **Run**। "Success" দেখাবে।
3. আবার **New query** → `supabase/seed.sql` এর পুরোটা পেস্ট → **Run**। এতে ৭টি ক্যাটাগরি আর ৫৬টি পণ্য চলে আসবে।

## ৩. নিজেকে অ্যাডমিন বানানো
1. বাঁ পাশে **Authentication → Users → Add user → Create new user**।
   ইমেইল ও পাসওয়ার্ড দিন, **Auto Confirm User** টিক দিন → **Create user**।
2. **SQL Editor → New query**, নিচের লাইনে নিজের ইমেইল বসিয়ে **Run**:
   ```sql
   insert into public.admins (user_id) select id from auth.users where email = 'আপনার-ইমেইল@gmail.com';
   ```

## ৪. ক্রেতাদের অ্যাকাউন্টের লিংক ঠিক করা
**Authentication → URL Configuration** → Site URL: `https://anaqia.com` → **Save**।

## ৫. ওয়েবসাইটকে Supabase-এর সাথে যুক্ত করা
1. **Project Settings → API** (বা **Connect**) থেকে দুটি জিনিস কপি করুন:
   - **Project URL** (যেমন `https://abcd1234.supabase.co`)
   - **anon public** key (লম্বা লেখা, `eyJ...` দিয়ে শুরু)
   > এই দুটি প্রকাশ্য রাখার জন্যই বানানো, নিরাপদ। কিন্তু **service_role** key বা ডেটাবেস পাসওয়ার্ড কখনো কাউকে দেবেন না।
2. **Vercel → anaqia প্রজেক্ট → Settings → Environment Variables** এ দুটি যোগ করুন:
   - `VITE_SUPABASE_URL` = Project URL
   - `VITE_SUPABASE_ANON_KEY` = anon public key
3. **Deployments** → সবচেয়ে উপরেরটির পাশে **⋯ → Redeploy**।

## ৬. ব্যবহার
- অ্যাডমিন প্যানেল: **https://anaqia.com/#/admin** (মোবাইলেও চলে)
- পণ্য যোগ: পণ্য → + নতুন পণ্য → ছবি (একাধিক), দাম, স্টক, সাইজ, রঙ → সেভ
- অর্ডার: অর্ডার → অর্ডারে চাপুন → অবস্থা বদলান → সেভ। বাতিল করলে স্টক ফেরত যায়।
- ডেলিভারি চার্জ, বিকাশ/নগদ নম্বর: সেটিংস

## নিরাপত্তা সম্পর্কে
- দাম, ছাড় আর ডেলিভারি চার্জ সার্ভারে হিসাব হয়, তাই ক্রেতা ব্রাউজারে দাম বদলাতে পারবে না।
- অর্ডার ট্র্যাক করতে অর্ডার আইডি আর ফোন নম্বর দুটোই লাগে।
- কার্ড নম্বর কোথাও সংরক্ষণ হয় না।
