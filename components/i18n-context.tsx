"use client";

/**
 * Language handling for the whole store (English + Arabic).
 *
 * How it works:
 *  - STRINGS holds every UI label in both languages (en / ar).
 *  - I18nProvider keeps the language in React state + localStorage and
 *    sets <html lang="…" dir="…"> so the page flips to RTL for Arabic.
 *  - Components read `t("key")` via useI18n() to get the right label.
 *
 * Product data (names, descriptions) stays English for now; the UI chrome,
 * buttons, forms and headings all switch. Arabic search terms work through
 * the keywords in lib/products.ts.
 *
 * The language itself is read with useSyncExternalStore (localStorage is an
 * external store); the <html> attributes are synced in an effect, which is
 * exactly what effects are for (synchronizing with the DOM).
 */

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useSyncExternalStore,
} from "react";
import type { ReactNode } from "react";

export type Language = "en" | "ar";

const STORAGE_KEY = "sunvolt-lang";
/** Custom event fired after setLang so every subscriber re-reads. */
const LANG_EVENT = "sunvolt-lang-change";

/** One dictionary entry per UI string. */
const STRINGS: Record<string, { en: string; ar: string }> = {
  // ---- Navigation -------------------------------------------------------
  "nav.aria": { en: "Main menu", ar: "القائمة الرئيسية" },
  "nav.skipToContent": { en: "Skip to content", ar: "تخطَّ إلى المحتوى" },
  "nav.home": { en: "Home", ar: "الرئيسية" },
  "nav.shop": { en: "Shop", ar: "المتجر" },
  "nav.solarPanels": { en: "Solar Panels", ar: "ألواح شمسية" },
  "nav.inverters": { en: "Inverters", ar: "انفرترات" },
  "nav.batteries": { en: "Batteries", ar: "بطاريات" },
  "nav.contact": { en: "Contact", ar: "تواصل معنا" },

  // ---- Header -----------------------------------------------------------
  "header.cart": { en: "Cart", ar: "السلة" },
  "header.searchPlaceholder": {
    en: "Search products… e.g. inverter",
    ar: "ابحث عن المنتجات… مثل انفرتر",
  },
  "header.toggleMenu": { en: "Toggle menu", ar: "فتح القائمة" },
  "header.language": { en: "Language", ar: "اللغة" },
  "header.categories": { en: "Categories", ar: "التصنيفات" },
  "header.quickBrowse": { en: "Quick browse", ar: "تصفح سريع" },
  "header.newArrivals": { en: "New arrivals", ar: "وصل حديثاً" },
  "header.bestSellers": { en: "Best sellers", ar: "الأكثر مبيعاً" },
  "header.featured": { en: "Featured products", ar: "منتجات مميزة" },
  "header.allProducts": { en: "All products", ar: "جميع المنتجات" },
  "header.viewAll": { en: "View all products", ar: "عرض جميع المنتجات" },

  // ---- Top bar ----------------------------------------------------------
  "topbar.freeShipping": {
    en: "Free shipping on orders over {amount}",
    ar: "شحن مجاني للطلبات فوق {amount}",
  },

  // ---- Shared labels ------------------------------------------------------
  "common.addToCart": { en: "Add to cart", ar: "أضف إلى السلة" },
  "common.added": { en: "✓ Added", ar: "✓ تمت الإضافة" },
  "common.soldOut": { en: "Sold out", ar: "نفدت الكمية" },
  "common.buyNow": { en: "Buy now", ar: "اشترِ الآن" },
  "common.orderWhatsapp": { en: "Order via WhatsApp", ar: "اطلب عبر واتساب" },
  "common.quickView": { en: "👁 Quick view", ar: "👁 عرض سريع" },
  "common.viewDetails": { en: "View full details", ar: "عرض التفاصيل الكاملة" },
  "common.sort": { en: "Sort:", ar: "ترتيب:" },
  "common.sortFeatured": { en: "Featured", ar: "المميز" },
  "common.sortPriceAsc": {
    en: "Price: low to high",
    ar: "السعر: من الأقل إلى الأعلى",
  },
  "common.sortPriceDesc": {
    en: "Price: high to low",
    ar: "السعر: من الأعلى إلى الأقل",
  },
  "common.apply": { en: "Apply", ar: "تطبيق" },
  "common.inStockOnly": { en: "In stock only", ar: "المتوفر فقط" },
  "common.inStock": {
    en: "In stock, ships within 24 hours",
    ar: "متوفر — يُشحن خلال 24 ساعة",
  },
  "common.lowStock": { en: "Low stock — order soon", ar: "كمية محدودة — اطلب الآن" },
  "common.outOfStock": { en: "Out of stock", ar: "غير متوفر حالياً" },
  "common.productsCount": { en: "{count} products", ar: "{count} منتجات" },
  "common.oneProduct": { en: "1 product", ar: "منتج واحد" },
  "common.all": { en: "All", ar: "الكل" },
  "common.clearFilters": { en: "Clear filters", ar: "مسح الفلاتر" },
  "common.noResults": { en: "No products found", ar: "لا توجد منتجات مطابقة" },
  "common.noResultsHint": {
    en: "Try a different search term or browse another category.",
    ar: "جرّب كلمة بحث مختلفة أو تصفح تصنيفاً آخر.",
  },
  "common.search": { en: "Search", ar: "بحث" },
  "common.remove": { en: "Remove", ar: "إزالة" },
  "common.each": { en: "each", ar: "للقطعة" },
  "common.close": { en: "Close", ar: "إغلاق" },
  "common.gridView": { en: "Grid view", ar: "عرض شبكي" },
  "common.listView": { en: "List view", ar: "عرض قائمة" },
  "common.decreaseQty": {
    en: "Decrease quantity of {name}",
    ar: "تقليل كمية {name}",
  },
  "common.increaseQty": {
    en: "Increase quantity of {name}",
    ar: "زيادة كمية {name}",
  },
  "common.rated": { en: "Rated {rating} out of 5", ar: "التقييم {rating} من 5" },

  // ---- Store page --------------------------------------------------------
  "store.title": { en: "Store", ar: "المتجر" },
  "store.home": { en: "Home", ar: "الرئيسية" },
  "store.allProducts": { en: "All products", ar: "جميع المنتجات" },
  "store.newArrivals": { en: "New arrivals", ar: "وصل حديثاً" },
  "store.bestSellers": { en: "Best sellers", ar: "الأكثر مبيعاً" },
  "store.featured": { en: "Featured products", ar: "منتجات مميزة" },
  "store.searchResults": { en: "Search: “{query}”", ar: "نتائج البحث: “{query}”" },
  "store.searchPlaceholder": { en: "Search products…", ar: "ابحث في المتجر…" },

  // ---- Cart ----------------------------------------------------------------
  "cart.title": { en: "Your cart", ar: "سلة التسوق" },
  "cart.items": { en: "({count} items)", ar: "({count} منتجات)" },
  "cart.oneItem": { en: "(1 item)", ar: "(منتج واحد)" },
  "cart.emptyTitle": { en: "Your cart is empty", ar: "سلتك فارغة" },
  "cart.emptyHint": {
    en: "Browse the catalog and add some solar goodness.",
    ar: "تصفح المتجر وأضف ما يعجبك من معدات الطاقة الشمسية.",
  },
  "cart.startShopping": { en: "Start shopping", ar: "ابدأ التسوق" },
  "cart.unlocked": {
    en: "🎉 You've unlocked free shipping!",
    ar: "🎉 حصلت على شحن مجاني!",
  },
  "cart.moreForFree": {
    en: "Add {amount} more for free shipping",
    ar: "أضف {amount} إضافية للحصول على شحن مجاني",
  },
  "cart.summary": { en: "Order summary", ar: "ملخص الطلب" },
  "cart.subtotal": { en: "Subtotal", ar: "المجموع الفرعي" },
  "cart.shipping": { en: "Shipping", ar: "الشحن" },
  "cart.free": { en: "Free", ar: "مجاني" },
  "cart.shippingNote": {
    en: "Flat {fee} rate — free over {threshold}.",
    ar: "تعرفة ثابتة {fee} — مجاني فوق {threshold}.",
  },
  "cart.total": { en: "Total", ar: "الإجمالي" },
  "cart.checkout": { en: "Proceed to checkout", ar: "إتمام الطلب" },
  "cart.continueShopping": { en: "Continue shopping", ar: "مواصلة التسوق" },

  // ---- Checkout -------------------------------------------------------------
  "checkout.title": { en: "Checkout", ar: "إتمام الطلب" },
  "checkout.demoNote": {
    en: "Demo checkout — no real payment is processed.",
    ar: "تجربة تجريبية — لا تتم أي عملية دفع حقيقية.",
  },
  "checkout.shippingDetails": { en: "Shipping details", ar: "بيانات الشحن" },
  "checkout.yourOrder": { en: "Your order", ar: "طلبك" },
  "checkout.nothingTitle": { en: "Nothing to check out", ar: "لا يوجد شيء لإتمامه" },
  "checkout.nothingHint": {
    en: "Your cart is empty — add a few products first.",
    ar: "سلتك فارغة — أضف بعض المنتجات أولاً.",
  },
  "checkout.goShopping": { en: "Go shopping", ar: "اذهب للتسوق" },
  "checkout.orderTotal": {
    en: "Order total (demo — no real payment)",
    ar: "إجمالي الطلب (تجريبي — بدون دفع حقيقي)",
  },
  "checkout.placeOrder": { en: "Place order", ar: "تأكيد الطلب" },
  "checkout.placedTitle": { en: "Order #{order} placed!", ar: "تم تقديم الطلب #{order}!" },
  "checkout.placedNote": {
    en: "This is a demo checkout — no payment was taken and no order was actually created. Thanks for trying Aleppo Power!",
    ar: "هذه تجربة تجريبية — لم يتم سحب أي مبلغ ولم يُنشأ طلب فعلي. شكراً لتجربتك صن فولت!",
  },
  "checkout.keepShopping": { en: "Keep shopping", ar: "واصل التسوق" },

  // ---- Forms ------------------------------------------------------------------
  "form.firstName": { en: "First name", ar: "الاسم الأول" },
  "form.lastName": { en: "Last name", ar: "اسم العائلة" },
  "form.email": { en: "Email", ar: "البريد الإلكتروني" },
  "form.address": { en: "Address", ar: "العنوان" },
  "form.city": { en: "City", ar: "المدينة" },
  "form.postalCode": { en: "Postal code", ar: "الرمز البريدي" },
  "form.country": { en: "Country", ar: "الدولة" },
  "form.name": { en: "Name", ar: "الاسم" },
  "form.subject": { en: "Subject", ar: "الموضوع" },
  "form.message": { en: "Message", ar: "الرسالة" },
  "form.send": { en: "Send message", ar: "إرسال الرسالة" },
  "form.subject1": {
    en: "I have a question about a product",
    ar: "لدي سؤال عن منتج",
  },
  "form.subject2": {
    en: "I need a quote for a large order",
    ar: "أحتاج عرض سعر لكمية كبيرة",
  },
  "form.subject3": { en: "Technical support", ar: "دعم فني" },
  "form.subject4": { en: "Something else", ar: "شيء آخر" },
  "countries.nl": { en: "Netherlands", ar: "هولندا" },
  "countries.be": { en: "Belgium", ar: "بلجيكا" },
  "countries.de": { en: "Germany", ar: "ألمانيا" },
  "countries.other": { en: "Other", ar: "أخرى" },

  // ---- Contact ----------------------------------------------------------------
  "contact.title": { en: "Contact us", ar: "تواصل معنا" },
  "contact.hint": {
    en: "Questions about sizing a system, bulk orders or technical support? Our engineers are happy to help. (All channels below are demo placeholders.)",
    ar: "أسئلة حول تجهيز نظام أو طلبات الجملة أو الدعم الفني؟ مهندسونا سعداء بمساعدتك. (جميع القنوات أدناه تجريبية.)",
  },
  "contact.phone": { en: "Phone", ar: "الهاتف" },
  "contact.email": { en: "Email", ar: "البريد الإلكتروني" },
  "contact.emailNote": {
    en: "We reply within 24 hours",
    ar: "نرد خلال 24 ساعة",
  },
  "contact.showroom": { en: "Showroom", ar: "المعرض" },
  "contact.showroomNote": {
    en: "Visit us — coffee's on us",
    ar: "زرنا — القهوة علينا",
  },
  "contact.whatsapp": { en: "WhatsApp", ar: "واتساب" },
  "contact.whatsappNote": {
    en: "Quick product questions",
    ar: "للاستفسارات السريعة عن المنتجات",
  },
  "contact.hours": { en: "Business hours", ar: "ساعات العمل" },
  "contact.sendMessage": { en: "Send us a message", ar: "أرسل لنا رسالة" },
  "contact.whyTitle": { en: "Why message an engineer?", ar: "لماذا تراسل مهندساً؟" },
  "contact.why1": {
    en: "Free system sizing for your roof or cabin",
    ar: "حساب حجم النظام مجاناً لسطحك أو كوخك",
  },
  "contact.why2": {
    en: "Help choosing the right inverter for your battery",
    ar: "مساعدتك في اختيار الانفرتر المناسب لبطاريتك",
  },
  "contact.why3": {
    en: "Bulk pricing for installers and resellers",
    ar: "أسعار جملة للمركبين والموزعين",
  },
  "contact.why4": { en: "Warranty and returns support", ar: "دعم الضمان والاسترجاع" },
  "contact.hoursText": {
    en: "Monday–Saturday, 9:00–18:00 (CET). Orders placed on weekends ship on Monday.",
    ar: "الإثنين–السبت، 9:00–18:00 (بتوقيت وسط أوروبا). الطلبات في عطلة نهاية الأسبوع تُشحن يوم الإثنين.",
  },
  "contact.receivedTitle": { en: "Message received!", ar: "تم استلام رسالتك!" },
  "contact.receivedNote": {
    en: "This is a demo store, so nothing was actually sent — but in a real build this form would reach the support team.",
    ar: "هذا متجر تجريبي — لم يُرسل أي شيء فعلياً، لكن في نسخة حقيقية ستصل رسالتك إلى فريق الدعم.",
  },

  // ---- Newsletter -----------------------------------------------------------------
  "newsletter.title": { en: "Newsletter", ar: "النشرة البريدية" },
  "newsletter.hint": {
    en: "New product drops and solar tips, once a month. No spam.",
    ar: "منتجات جديدة ونصائح طاقة شمسية مرة شهرياً. بدون إزعاج.",
  },
  "newsletter.placeholder": { en: "you@example.com", ar: "you@example.com" },
  "newsletter.join": { en: "Join", ar: "اشترك" },
  "newsletter.done": {
    en: "🎉 You're on the list! (demo — nothing was actually sent)",
    ar: "🎉 أنت في القائمة! (تجريبي — لم يُرسل أي شيء)",
  },

  // ---- Footer ------------------------------------------------------------------------
  "footer.about": {
    en: "Your one-stop shop for solar panels, inverters, batteries and electrical equipment. Demo storefront — no real orders are processed.",
    ar: "متجرك الشامل لألواح الطاقة الشمسية والانفرترات والبطاريات والمعدات الكهربائية. واجهة تجريبية — لا تتم معالجة طلبات حقيقية.",
  },
  "footer.company": { en: "Company", ar: "الشركة" },
  "footer.categories": { en: "Categories", ar: "التصنيفات" },
  "footer.shopAll": { en: "Shop All", ar: "كل المنتجات" },
  "footer.newArrivals": { en: "New Arrivals", ar: "وصل حديثاً" },
  "footer.bestSellers": { en: "Best Sellers", ar: "الأكثر مبيعاً" },
  "footer.cart": { en: "Cart", ar: "السلة" },
  "footer.contactUs": { en: "Contact Us", ar: "تواصل معنا" },
  "footer.copyright": {
    en: "© {year} Aleppo Power — Demo project built with Next.js.",
    ar: "© {year} متجر صن فولت — مشروع تجريبي مبني بـ Next.js.",
  },

  // ---- Home -----------------------------------------------------------------------------
  "home.badge": {
    en: "Solar · Inverters · Batteries · Electrical",
    ar: "طاقة شمسية · انفرترات · بطاريات · كهرباء",
  },
  "home.heroLead": { en: "Power your life with the ", ar: "أشعل حياتك بطاقة " },
  "home.heroAccent": { en: "sun", ar: "الشمس" },
  "home.heroTail": { en: ".", ar: "." },
  "home.heroSubtitle": {
    en: "Complete solar systems and electrical equipment at fair prices — from panels and inverters to cables and protection gear.",
    ar: "أنظمة طاقة شمسية متكاملة ومعدات كهربائية بأسعار عادلة — من الألواح والانفرترات إلى الكابلات ومعدات الحماية.",
  },
  "home.shopAll": { en: "Shop all products", ar: "تسوّق جميع المنتجات" },
  "home.talkEngineer": { en: "Talk to an engineer", ar: "تحدث مع مهندس" },
  "home.startingFrom": { en: "Panels from", ar: "الألواح من" },
  "home.feature1Title": { en: "Fast shipping", ar: "شحن سريع" },
  "home.feature1Text": { en: "Dispatched within 24 hours.", ar: "يُشحن خلال 24 ساعة." },
  "home.feature2Title": { en: "Real warranties", ar: "ضمانات حقيقية" },
  "home.feature2Text": { en: "2–25 years, in writing.", ar: "من 2 حتى 25 سنة موثقة." },
  "home.feature3Title": { en: "Expert support", ar: "دعم الخبراء" },
  "home.feature3Text": {
    en: "Engineers answer your calls.",
    ar: "مهندسون يجيبون على اتصالاتك.",
  },
  "home.feature4Title": { en: "Secure payment", ar: "دفع آمن" },
  "home.feature4Text": {
    en: "Cards, bank transfer, cash.",
    ar: "بطاقات، تحويل بنكي، نقداً.",
  },
  "home.shopByCategory": { en: "Shop by category", ar: "تسوّق حسب التصنيف" },
  "home.categoryHint": {
    en: "Everything for a complete solar or electrical installation.",
    ar: "كل ما تحتاجه لتركيب طاقة شمسية أو كهرباء متكامل.",
  },
  "home.viewAllProducts": { en: "View all products", ar: "عرض جميع المنتجات" },
  "home.quickBrowse": { en: "Quick browse", ar: "تصفح سريع" },
  "home.quickBrowseHint": {
    en: "What's new, what's hot, and what we love.",
    ar: "الجديد، الأكثر طلباً، وما نفضّله.",
  },
  "home.tabsFeatured": { en: "Featured", ar: "المميز" },
  "home.tabsNew": { en: "New arrivals", ar: "وصل حديثاً" },
  "home.tabsBestSellers": { en: "Best sellers", ar: "الأكثر مبيعاً" },
  "home.viewAll": { en: "View all →", ar: "عرض الكل ←" },
  "home.ourPick": { en: "Our pick", ar: "اختيارنا" },
  "home.viewProduct": { en: "View product", ar: "عرض المنتج" },
  "home.browseStore": { en: "Browse the store →", ar: "تصفح المتجر ←" },
  "home.quoteTitle": {
    en: "Not sure what your system needs?",
    ar: "غير متأكد مما يحتاجه نظامك؟",
  },
  "home.quoteText": {
    en: "Tell us about your roof, your appliances or your project — our engineers will size the system for you, free of charge.",
    ar: "أخبرنا عن سطحك أو أجهزتك أو مشروعك — سيحدد مهندسونا حجم النظام المناسب لك مجاناً.",
  },
  "home.askQuote": { en: "Ask for a free quote", ar: "اطلب عرض سعر مجاني" },

  // ---- Product page ---------------------------------------------------------------
  "product.specifications": { en: "Specifications", ar: "المواصفات" },
  "product.related": { en: "You may also like", ar: "قد يعجبك أيضاً" },

  // ---- Life: deals, stats, testimonials, toasts, floats, FAQ -----------------------
  "home.brandsTitle": {
    en: "Trusted brands we stock",
    ar: "علامات تجارية موثوقة لدينا",
  },
  "home.heroRating": {
    en: "4.8/5 — rated by 800+ customers",
    ar: "4.8/5 — تقييم أكثر من 800 عميل",
  },
  "home.dealBadge": { en: "Deal of the week", ar: "عرض الأسبوع" },
  "home.dealEnds": { en: "Offer ends in", ar: "ينتهي العرض خلال" },
  "home.dealSave": {
    en: "Save {amount} ({percent}% off)",
    ar: "وفّر {amount} (خصم {percent}%)",
  },
  "home.dealCta": { en: "View the deal", ar: "شاهد العرض" },
  "home.statsLabel": { en: "Store statistics", ar: "إحصائيات المتجر" },
  "home.statCustomers": { en: "happy customers", ar: "عميل سعيد" },
  "home.statProducts": { en: "products in stock", ar: "منتج متوفر" },
  "home.statYears": { en: "years in solar", ar: "سنة في الطاقة الشمسية" },
  "home.statSatisfaction": { en: "customer satisfaction", ar: "رضا العملاء" },
  "home.testimonialsTitle": {
    en: "What our customers say",
    ar: "ماذا يقول عملاؤنا",
  },
  "home.testimonialsHint": {
    en: "Real reviews from real rooftops.",
    ar: "تقييمات حقيقية من أسطح حقيقية.",
  },
  "testimonial.1.text": {
    en: "The 5 kW hybrid system they sized for us paid for itself in 14 months. Their engineers answered every question — in Arabic.",
    ar: "نظام الـ 5 كيلو واط الهجين الذي صمموه لنا غطى تكلفته خلال 14 شهراً، ومهندسوهم أجابوا عن كل سؤال — بالعربية.",
  },
  "testimonial.1.name": { en: "Ahmed K.", ar: "أحمد خ." },
  "testimonial.1.role": { en: "Homeowner — 5 kW system", ar: "صاحب منزل — نظام 5 كيلو واط" },
  "testimonial.2.text": {
    en: "Ordered a full rack of LiFePO4 batteries for our office backup. Delivered in two days and running flawlessly ever since.",
    ar: "طلبنا رف بطاريات LiFePO4 كاملاً للنسخ الاحتياطي لمكتبنا. وصل خلال يومين ويعمل بلا أي مشاكل منذ ذلك الحين.",
  },
  "testimonial.2.name": { en: "Mariam S.", ar: "مريم س." },
  "testimonial.2.role": { en: "Office manager", ar: "مديرة مكتب" },
  "testimonial.3.text": {
    en: "Best price I found for cable and MC4 connectors — and the team helped me pick the right DC breaker for my strings.",
    ar: "أفضل سعر وجدته للكابلات وموصلات MC4 — وساعدني الفريق في اختيار القاطع المناسب لسلاسل الألواح.",
  },
  "testimonial.3.name": { en: "Tom V.", ar: "توم ف." },
  "testimonial.3.role": { en: "DIY installer", ar: "مُركّب بنفسه" },
  "toast.added": { en: "{name} added to cart", ar: "تمت إضافة {name} إلى السلة" },
  "toast.viewCart": { en: "View cart", ar: "عرض السلة" },
  "common.backToTop": { en: "Back to top", ar: "العودة للأعلى" },
  "common.chatWhatsapp": {
    en: "Chat with us on WhatsApp",
    ar: "تواصل معنا عبر واتساب",
  },
  "time.days": { en: "Days", ar: "يوم" },
  "time.hours": { en: "Hours", ar: "ساعة" },
  "time.minutes": { en: "Minutes", ar: "دقيقة" },
  "time.seconds": { en: "Seconds", ar: "ثانية" },
  "faq.title": { en: "Frequently asked questions", ar: "الأسئلة الشائعة" },
  "faq.hint": {
    en: "Quick answers before you ask us anything.",
    ar: "إجابات سريعة قبل أن تسألنا أي شيء.",
  },
  "faq.1.q": { en: "Do you ship internationally?", ar: "هل تشحنون دولياً؟" },
  "faq.1.a": {
    en: "Yes — we ship across the EU within 2–5 business days, and worldwide with tracked couriers.",
    ar: "نعم — نشحن داخل الاتحاد الأوروبي خلال 2–5 أيام عمل، وإلى جميع أنحاء العالم عبر شركات شحن موثوقة مع تتبع للشحنة.",
  },
  "faq.2.q": { en: "How long does delivery take?", ar: "كم تستغرق مدة التوصيل؟" },
  "faq.2.a": {
    en: "Orders placed before 16:00 leave our warehouse the same day. Local deliveries arrive within 24 hours.",
    ar: "الطلبات قبل الساعة 16:00 تغادر مستودعنا في نفس اليوم، وتصل الطلبات المحلية خلال 24 ساعة.",
  },
  "faq.3.q": {
    en: "Can your engineers size my system for free?",
    ar: "هل يمكن لمهندسيكم تحديد حجم النظام مجاناً؟",
  },
  "faq.3.a": {
    en: "Absolutely. Send us your roof size and monthly consumption and we'll design the system and quote it — free of charge.",
    ar: "بالتأكيد. أرسل لنا مساحة سطحك واستهلاكك الشهري وسنصمم النظام ونقدم لك عرض سعر — مجاناً.",
  },
  "faq.4.q": {
    en: "What warranty do the products carry?",
    ar: "ما الضمان الذي تتمتع به المنتجات؟",
  },
  "faq.4.a": {
    en: "2–25 years depending on the product, all in writing: panels carry 25-year power warranties, inverters 5 years, batteries up to 5 years.",
    ar: "من 2 إلى 25 سنة حسب المنتج وكلها موثقة كتابياً: الألواح 25 سنة ضمان أداء، والانفرترات 5 سنوات، والبطاريات حتى 5 سنوات.",
  },
  "faq.5.q": { en: "Can I order via WhatsApp?", ar: "هل يمكنني الطلب عبر واتساب؟" },
  "faq.5.a": {
    en: "Yes! Every product has an “Order via WhatsApp” button that opens a pre-filled message with the product and price.",
    ar: "نعم! يحتوي كل منتج على زر «اطلب عبر واتساب» يفتح رسالة جاهزة تتضمن اسم المنتج وسعره.",
  },

  // ---- 404 -----------------------------------------------------------------------------
  "notFound.title": { en: "This page is off the grid", ar: "هذه الصفحة خارج الشبكة" },
  "notFound.text": {
    en: "The page you're looking for doesn't exist — maybe the product was disconnected.",
    ar: "الصفحة التي تبحث عنها غير موجودة — ربما فُصل المنتج.",
  },
  "notFound.home": { en: "Back home", ar: "العودة للرئيسية" },
  "notFound.browse": { en: "Browse products", ar: "تصفح المنتجات" },
};

interface I18nContextValue {
  lang: Language;
  isRtl: boolean;
  /** Returns the label for `key` in the active language. */
  t: (key: string, vars?: Record<string, string | number>) => string;
  setLang: (lang: Language) => void;
}

const I18nContext = createContext<I18nContextValue | null>(null);

/** Reads the saved language; falls back to the browser language. */
function readLang(): Language {
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved === "en" || saved === "ar") return saved;
  } catch {
    // Ignore storage errors — fall through to the browser language.
  }
  return navigator.language.toLowerCase().startsWith("ar") ? "ar" : "en";
}

/** Re-renders subscribers when the language changes (any tab). */
function subscribeLang(listener: () => void): () => void {
  window.addEventListener("storage", listener);
  window.addEventListener(LANG_EVENT, listener);
  return () => {
    window.removeEventListener("storage", listener);
    window.removeEventListener(LANG_EVENT, listener);
  };
}

export function I18nProvider({ children }: { children: ReactNode }) {
  // Client snapshot = saved/browser language; server snapshot = English.
  const lang = useSyncExternalStore(subscribeLang, readLang, () => "en" as Language);

  /** Switches the language everywhere and persists the choice. */
  function setLang(next: Language) {
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // Ignore storage errors.
    }
    window.dispatchEvent(new Event(LANG_EVENT));
  }

  // Apply <html lang + dir> (RTL for Arabic) and a localized tab title —
  // DOM sync, the intended use of an effect.
  const originalTitleRef = useRef<string | null>(null);

  useEffect(() => {
    // Capture the per-page English title ONCE (e.g. "Store | Aleppo Power"),
    // so switching back to English can always restore it.
    if (originalTitleRef.current === null) {
      originalTitleRef.current = document.title;
    }
    const originalTitle = originalTitleRef.current;
    if (lang === "ar") {
      if (originalTitle === "Aleppo Power — Solar & Electrical Equipment Store") {
        document.title = "حلب باور — متجر معدات الطاقة الشمسية والكهربائية";
      } else {
        document.title = originalTitle.replace(/\s\|\sAleppo Power$/, " | حلب باور");
      }
    } else {
      document.title = originalTitle;
    }
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
  }, [lang]);

  /** Translates a key, replacing {placeholders} with values. */
  function t(key: string, vars?: Record<string, string | number>): string {
    const entry = STRINGS[key];
    let text = entry ? entry[lang] : key;
    if (vars) {
      for (const [name, value] of Object.entries(vars)) {
        text = text.replaceAll(`{${name}}`, String(value));
      }
    }
    return text;
  }

  const value: I18nContextValue = {
    lang,
    isRtl: lang === "ar",
    t,
    setLang,
  };

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

/** Hook for reading the language and translating labels. */
export function useI18n(): I18nContextValue {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error("useI18n must be used inside <I18nProvider>");
  }
  return context;
}
