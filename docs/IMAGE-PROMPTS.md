# Anaqia: ছবি তৈরির সম্পূর্ণ তালিকা (মোট ৬৯টি ছবি)

## কীভাবে ব্যবহার করবেন
1. claude.ai তে নতুন চ্যাট খুলুন, Higgsfield কানেক্টর চালু রাখুন।
2. নিচের **"কপি করার অংশ"** পুরোটা কপি করে পেস্ট করুন।
3. ছবিগুলো ১০টা করে ব্যাচে তৈরি হবে। প্রতিটা ব্যাচ শেষ হলে লিখুন: `next batch`
4. সব ছবি ডাউনলোড করে **ফাইলের নাম ঠিক রেখে** দুটোর যেকোনো একভাবে দিন:
   - **A. GitHub-এ আপলোড:** `ccr-ff56b741-5095mp` ব্রাঞ্চে `public/images/products/`, `public/images/categories/` আর `public/images/site/` ফোল্ডারে রাখুন। ঠিক নামের ছবি রাখলেই ওয়েবসাইটে নিজে থেকে দেখাবে।
   - **B. Claude Code চ্যাটে পাঠান:** ছবির সাথে নম্বর লিখে দিন (যেমন "১৭ = চেয়ার")। আমি নাম ঠিক করে, সাইজ ছোট করে বসিয়ে দেব।
5. কোনো ছবি পছন্দ না হলে Claude chat-এ লিখুন: `Regenerate number 9 with blue colour`

> কোনো পণ্যের ছবি না থাকলে সেখানে আগের মতো আইকন দেখাবে, তাই ধীরে ধীরে ছবি যোগ করলেও সমস্যা নেই।

---

## কপি করার অংশ

```
Use Higgsfield with my unlimited subscription (use_unlim: true) to create all images for my online store "Anaqia". Use model gpt_image_2_6. Generate in batches of 10 using the list numbers below, then wait until I say "next batch".

STYLE for products (1-56) and categories (57-63): square 1:1, professional e-commerce studio product photo, single product centered with some empty space around it, soft pastel gradient background in the colour given, soft natural shadow, bright even lighting, high detail, sharp focus. No text, no logos, no brand names, no watermark, no people.
Homepage images (64-69) use the aspect ratio written on each line; text and logos are still not allowed.

After each image, show it with its file name (e.g. products/anc-headphones.jpg) so I can download and name it correctly.

LIST (number. file name | background or ratio | what to show)

# Fashion (background: soft light lavender)
1. products/denim-jacket.jpg | soft light lavender | oversized light-wash blue denim jacket, neatly laid flat
2. products/linen-shirt.jpg | soft light lavender | sage green linen relaxed-fit shirt on a wooden hanger
3. products/street-sneakers.jpg | soft light lavender | pair of white, grey and red street style sneakers
4. products/summer-dress.jpg | soft light lavender | pastel floral summer midi dress on a hanger
5. products/leather-tote.jpg | soft light lavender | tan brown leather tote bag with handles
6. products/panjabi.jpg | soft light lavender | elegant off-white cotton panjabi (South Asian long men's kurta) with subtle embroidery, on a hanger
7. products/cotton-saree.jpg | soft light lavender | handloom cotton saree in teal and maroon with a woven border, neatly folded
8. products/sunglasses.jpg | soft light lavender | gold-frame polarized aviator sunglasses

# Electronics (background: soft light blue)
9. products/anc-headphones.jpg | soft light blue | premium matte black wireless over-ear noise cancelling headphones
10. products/smart-watch-pro.jpg | soft light blue | black smart fitness watch with a colourful activity display
11. products/earbuds-x.jpg | soft light blue | white true wireless earbuds next to their open charging case
12. products/bt-speaker.jpg | soft light blue | portable black cylindrical bluetooth speaker with red accents
13. products/phone-x12.jpg | soft light blue | modern smartphone with a purple gradient screen, shown front and back
14. products/laptop-air.jpg | soft light blue | thin silver 14 inch laptop, open, screen with abstract purple wallpaper
15. products/power-bank.jpg | soft light blue | slim white 20000mAh power bank with a small LED indicator and a USB-C cable
16. products/tablet-10.jpg | soft light blue | 10 inch tablet with a thin bezel and colourful wallpaper, standing at an angle

# Beauty (background: soft light pink)
17. products/glow-serum.jpg | soft light pink | vitamin C serum in an amber glass dropper bottle with orange slices nearby
18. products/matte-lipstick.jpg | soft light pink | red velvet matte lipstick in a gold case, cap off
19. products/amber-perfume.jpg | soft light pink | amber glass perfume bottle with a gold cap
20. products/skincare-kit.jpg | soft light pink | set of four minimal white and pink skincare bottles and jars
21. products/sunscreen.jpg | soft light pink | white sunscreen tube SPF 50 with a few water droplets
22. products/eyeshadow-palette.jpg | soft light pink | open nude-tone eyeshadow palette with a makeup brush
23. products/face-wash.jpg | soft light pink | gentle foaming face wash pump bottle with soft foam
24. products/hair-dryer.jpg | soft light pink | modern rose-gold ionic hair dryer

# Home & Living (background: soft light peach)
25. products/accent-chair.jpg | soft light peach | velvet coral-pink accent armchair with wooden legs
26. products/aroma-diffuser.jpg | soft light peach | ceramic aroma diffuser with soft glowing LED light and mist
27. products/desk-organizer.jpg | soft light peach | minimal wooden desk organizer with pens and a small succulent plant
28. products/cookware-set.jpg | soft light peach | sage green nonstick cookware set: two pots and a frying pan
29. products/table-lamp.jpg | soft light peach | modern table lamp with a white fabric shade and brass base, switched on
30. products/bedsheet-set.jpg | soft light peach | neatly folded cotton bedsheet set with pillow covers in soft grey and white
31. products/wall-clock.jpg | soft light peach | minimal round wall clock with a wooden frame
32. products/ceramic-vase.jpg | soft light peach | matte white ceramic flower vase with dried pampas grass

# Sports (background: soft mint green)
33. products/football-pro.jpg | soft mint green | professional white and black match football
34. products/yoga-mat.jpg | soft mint green | rolled purple non-slip yoga mat with a strap
35. products/cricket-bat.jpg | soft mint green | English willow cricket bat with a red cricket ball
36. products/badminton-set.jpg | soft mint green | two badminton rackets with white shuttlecocks
37. products/dumbbells.jpg | soft mint green | pair of black adjustable dumbbells
38. products/running-shoes.jpg | soft mint green | pair of lightweight blue and orange running shoes
39. products/water-bottle.jpg | soft mint green | matte teal insulated stainless steel water bottle
40. products/cycling-helmet.jpg | soft mint green | aerodynamic white and blue cycling helmet

# Toys & Kids (background: soft light orange)
41. products/teddy-bear.jpg | soft light orange | large soft brown teddy bear with a red ribbon
42. products/building-blocks.jpg | soft light orange | colourful creative building blocks toy set, partly assembled
43. products/rc-car.jpg | soft light orange | red remote control racing car with its remote
44. products/school-bag.jpg | soft light orange | colourful kids school backpack with cute print
45. products/art-kit.jpg | soft light orange | kids art and colouring kit with crayons, markers and a sketchbook
46. products/baby-romper.jpg | soft light orange | soft pastel yellow cotton baby romper laid flat
47. products/plush-bunny.jpg | soft light orange | cute white plush bunny soft toy with pink ears
48. products/wooden-puzzle.jpg | soft light orange | wooden learning puzzle board with colourful shapes

# Grocery (background: soft light green)
49. products/premium-tea.jpg | soft light green | elegant tin of premium loose black tea with a cup of tea beside it
50. products/honey.jpg | soft light green | glass jar of pure golden honey with a wooden honey dipper
51. products/basmati-rice.jpg | soft light green | 5kg sack of premium long-grain basmati rice with a bowl of rice
52. products/mustard-oil.jpg | soft light green | glass bottle of golden mustard oil with mustard seeds and yellow mustard flowers
53. products/mixed-nuts.jpg | soft light green | glass jar of premium mixed nuts: almonds, cashews, pistachios
54. products/coffee-beans.jpg | soft light green | kraft paper bag of roasted coffee beans with beans scattered
55. products/dates.jpg | soft light green | wooden bowl of premium dark Ajwa dates
56. products/ghee.jpg | soft light green | glass jar of pure golden cow ghee with a wooden spoon

# Category icons (square, white background)
57. categories/fashion.jpg | white | a red puffer jacket, single cute 3D-style object, centered, soft pastel circle glow behind
58. categories/electronics.jpg | white | black over-ear headphones, single cute 3D-style object, centered, soft pastel circle glow behind
59. categories/beauty.jpg | white | a lipstick and a makeup palette, single cute 3D-style object, centered, soft pastel circle glow behind
60. categories/home.jpg | white | a small teal armchair, single cute 3D-style object, centered, soft pastel circle glow behind
61. categories/sports.jpg | white | a blue dumbbell and a football, single cute 3D-style object, centered, soft pastel circle glow behind
62. categories/kids.jpg | white | a cute teddy bear, single cute 3D-style object, centered, soft pastel circle glow behind
63. categories/grocery.jpg | white | a small basket of fresh vegetables and fruits, single cute 3D-style object, centered, soft pastel circle glow behind

# Homepage images (aspect ratio as noted, NOT square)
64. site/hero.jpg | 4:3 | futuristic neon shopping mall at night; a young Bangladeshi woman in a stylish casual outfit stands on a glowing circular hologram platform, touching floating transparent glass panels that show fashion, electronics, beauty and home products; deep navy blue background with purple and cyan neon light, cinematic, high detail
65. site/collection-electronics.jpg | 4:3 | smartwatch, wireless earbuds and headphones arranged on a soft lavender-blue pastel stage, product scene on the right side, empty soft space on the left
66. site/collection-beauty.jpg | 4:3 | skincare serum bottles and cream jars on pink pastel podiums, product scene on the right side, empty soft space on the left
67. site/collection-home.jpg | 4:3 | coral velvet armchair with a potted plant in a soft peach pastel room, scene on the right side, empty soft space on the left
68. site/collection-fashion.jpg | 4:3 | navy hoodie and black cap on a soft lilac-pink pastel background, product on the right side, empty soft space on the left
69. site/sale-banner.jpg | 16:9 | stylish young South Asian woman in sunglasses and a pastel jacket holding colourful shopping bags, standing on the RIGHT side inside a glowing pink-purple neon frame, city lights at night, the LEFT half is darker empty space for text, purple and magenta tones
```
