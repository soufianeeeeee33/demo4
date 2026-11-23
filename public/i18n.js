/* =====================================================================
   TEXTES DE LA PAGE — Français / Arabe
   ---------------------------------------------------------------------
   Chaque clé correspond à un attribut data-i18n (texte) ou
   data-i18n-placeholder (placeholder) dans index.html.
   {fee}, {flavor}, {units}, {unit}, {save} sont remplacés automatiquement.
   Règle : arguments vrais uniquement (pas de promesse de résultat).
   ⚠️ Faites relire l'arabe avant la mise en ligne.
   ===================================================================== */
const I18N = {
  fr: {
    currency: "DH",
    promo: "Paiement à la livraison · Livraison partout au Maroc",
    langSwitch: "ع",
    langSwitchLabel: "Afficher la page en arabe",
    share: "Partager",
    copied: "Lien copié",
    galleryLabel: "Photos du produit",

    kicker: "Bulk · Nutrition sportive",
    title: "Creatine Monohydrate Powder",
    lead: "La créatine monohydrate, l'un des compléments les plus étudiés en sport, dans un goût que vous aurez envie de reprendre chaque jour.",
    highlights: `<li>Poudre de créatine 100 % pure.</li><li>Augmente la force et les performances physiques.</li><li>Stimule l'énergie en produisant de l'ATP.</li><li>3 g de créatine monohydrate, la dose quotidienne, pour une force améliorée.</li><li>100 % créatine, sans additifs inutiles.</li>`,
    sub: "Sachet de 500 g · Unflavoured, Vanille ou Mixed Berry",
    trustCod: "Rien à payer avant la livraison",
    trustFee: "Livré chez vous pour {fee}",
    trustCall: "Un appel pour confirmer, sans surprise",

    /* Bon de commande */
    tkHead: "BON DE COMMANDE",
    tkProduct: "CREATINE MONOHYDRATE POWDER",
    tkFlavor: "2. GOÛT", tkFlavors: "2. GOÛTS — un par sachet", sachet1: "Sachet 1", sachet2: "Sachet 2", errFlavor2: "Choisissez le goût du 2e sachet.", tkItem2: "{f1} + {f2} · 2 sachets",
    tkPack: "1. FORMAT",
    tkInfo: "3. VOS COORDONNÉES",
    wMix: "Mix", mixSub: "jusqu'à 10 sachets",
    tkMix: "2. COMPOSEZ VOTRE MIX", mixHint: "Choisissez combien de sachets de chaque goût.",
    mixEmpty: "Ajoutez vos sachets avec le bouton +.",
    mixSum: "{n} sachets · {kg} kg · {price}", mixSum1: "1 sachet · 500 g · {price}",
    mixMax: "Maximum {max} sachets par commande.", errMix: "Ajoutez au moins un sachet.",
    mixLess: "Retirer un sachet {flavor}", mixMore: "Ajouter un sachet {flavor}",
    mixPerPair: "Chaque paire de sachets au prix de {pair}.",
    flVanilla: "Vanille",
    flBerry: "Mixed Berry",
    flPlain: "Unflavoured",
    w500: "500 g",
    w1000: "1 kg",
    perUnit: "1 kg = 2 sachets · {unit} le sachet · vous économisez {save}",
    unit1: "1 sachet",
    unit2: "2 sachets",
    tkItem: "{flavor} × {units}",
    tkNoFlavor: "Goût à choisir",
    nameLabel: "Nom complet",
    namePh: "Ex. : Yassine El Amrani",
    phoneLabel: "Téléphone",
    addressLabel: "Adresse",
    addressPh: "Rue, quartier, immeuble, ville",
    sumDelivery: "Livraison",
    toConfirm: "à confirmer",
    tkTotal: "TOTAL",
    payNow: "Rien à payer maintenant.",
    orderBtn: "Commander maintenant",
    loading: "Enregistrement…",
    callNote: "Nous vous appelons pour confirmer avant l'envoi.",
    stickyBtn: "Commander",

    errFlavor: "Choisissez un goût.",
    errPack: "Choisissez un format.",
    errName: "Indiquez votre nom pour la livraison.",
    errPhone: "Indiquez votre numéro : nous vous appelons pour confirmer.",
    errPhoneInvalid: "Numéro non valide. Exemple : 06 12 34 56 78.",
    errAddress: "Indiquez votre adresse avec la ville.",
    errNetwork: "Pas de connexion. Vérifiez votre internet et réessayez.",
    errGeneric: "La commande n'a pas été enregistrée. Réessayez.",
    errTooMany: "Trop de tentatives. Réessayez dans quelques minutes.",

    okTitle: "Commande reçue, merci !",
    okText: "Nous vous appelons très vite pour confirmer la livraison. Gardez votre téléphone à portée de main.",
    okNumber: "N° de commande",
    sumCod: "Paiement à la livraison",
    okNew: "Passer une autre commande",

    reviewsTitle: "Ce qu'en disent nos clients",
    reviewsSub: "Avis authentiques laissés sur notre ancienne boutique, publiés tels quels.",

    detailsTitle: "Tout savoir",
    dDesc: "Le produit",
    dDescText: "Créatine monohydrate Bulk en poudre fine, en sachet de 500 g. Trois goûts au choix : Unflavoured, Vanille et Mixed Berry.",
    dProduct: "Comment la prendre",
    dProductText: "Une dose par jour, avec de l'eau ou dans votre shake. Suivez la dose indiquée sur le sachet.",
    dDelivery: "Livraison",
    dDeliveryText: "Livraison au Maroc pour {fee}. Après votre commande, nous vous appelons pour confirmer l'adresse et le délai.",
    dPayment: "Paiement à la livraison",
    dPaymentText: "Vous ne payez rien sur le site. Vous réglez le montant au livreur, à la réception de votre colis.",

    contact: "Une question ?",
    copyright: "© 2026 Bulk Maroc. Tous droits réservés.",

    /* Informations produit — contenu repris de bulk.com (fiche Créatine monohydrate), adapté au Maroc */
    accDescTitle: "Description",
    accUseTitle: "Quand et comment l'utiliser",
    accIngrTitle: "Ingrédients",
    accNutriTitle: "Valeurs nutritionnelles",
    accFaqTitle: "FAQs",
    accReviewsTitle: "Avis",
    accDesc: `
      <h3>Créatine monohydrate</h3>
      <p><strong>Plus de force. Plus de training.</strong> Ajoutez-la à votre routine quotidienne pour vous entraîner plus fort et voir de quoi vous êtes capable¹.</p>
      <h3>Résumé du produit</h3>
      <p>Enchaînez les reps. Soulevez plus lourd. Améliorez votre performance¹. La créatine booste la production d'énergie dans vos muscles et améliore votre performance sur les exercices courts et intenses : le coup de pouce pour ajouter une série ou battre un record personnel. Disponible en Unflavoured, Vanille et Mixed Berry, à ajouter à votre shake habituel.</p>
      <h3>L'assurance qualité Bulk™</h3>
      <p>La créatine monohydrate Bulk™ est testée selon des normes de qualité strictes. Chaque lot est fabriqué dans un souci de sécurité, de pureté et d'efficacité. La poudre est pure à 99,9 %.</p>
      <h3>Avantages principaux</h3>
      <ul>
        <li>Amélioration de la performance¹</li>
        <li>Charges plus lourdes</li>
        <li>Training plus intense</li>
        <li>Ressentir plus de force</li>
      </ul>
      <h3>La science derrière le produit</h3>
      <p>La créatine est produite naturellement par le corps et se trouve en petite quantité dans la viande ou le poisson. Un complément de créatine monohydrate augmente la phosphocréatine stockée dans vos muscles, pour une production d'énergie plus rapide pendant les efforts de haute intensité. Les bénéfices d'un usage régulier sont documentés sur les exercices courts et intenses, comme la musculation et les sprints.</p>
      <p class="note">¹ La créatine améliore la performance physique lors d'une succession d'exercices courts et intenses. L'effet bénéfique s'obtient en consommant 3 g de créatine par jour.</p>`,
    accUse: `
      <h3>Comment la consommer ?</h3>
      <ul>
        <li><strong>Unflavoured :</strong> mélangez 1 cuillère et demie (environ 3,4 g) à 200 ml d'eau ou à un shake avant ou après l'entraînement.</li>
        <li><strong>Vanille :</strong> mélangez 1 cuillère et demie (environ 3,6 g) à 200 ml d'eau ou à un shake avant ou après l'entraînement.</li>
        <li><strong>Mixed Berry :</strong> mélangez 1 cuillère trois quarts (environ 4,4 g) à 200 ml d'eau ou à un shake avant ou après l'entraînement.</li>
      </ul>
      <p><strong>Consommez 1 dose par jour.</strong></p>`,
    accIngr: `
      <p><strong>Unflavoured :</strong> créatine monohydrate.<br /><strong>Vanille et Mixed Berry :</strong> créatine monohydrate et arômes. La liste complète figure sur l'étiquette du sachet.</p>
      <h3>Convient pour</h3>
      <p>Végétariens, Halal, Végans.</p>
      <h3>Informations sur les allergènes</h3>
      <p>Peut contenir du lait, du soja, des céréales contenant du gluten, de la moutarde, des graines de sésame, de l'anhydride sulfureux et des sulfites.</p>
      <h3>Conservation</h3>
      <p>À conserver dans un endroit frais et sec.</p>
      <h3>Informations complémentaires</h3>
      <p>Les compléments alimentaires ne remplacent pas un régime alimentaire varié et équilibré ni un mode de vie sain. Ne pas dépasser la dose recommandée. Tenir hors de portée des enfants. Lisez toujours l'étiquette ou l'emballage avant utilisation. Chaque personne peut réagir différemment ; les résultats s'inscrivent dans le cadre d'une alimentation et d'un entraînement appropriés.</p>`,
    accNutri: `
      <h3>Ingrédients actifs</h3>
      <table>
        <thead><tr><th>Ingrédient</th><th>Par portion</th></tr></thead>
        <tbody>
          <tr><td>Créatine monohydrate</td><td>3,4 g</td></tr>
          <tr><td>dont créatine</td><td>3 g</td></tr>
        </tbody>
      </table>
      <p class="note">Valeurs d'une portion de la version Unflavoured. Les versions Vanille et Mixed Berry apportent elles aussi 3 g de créatine par portion (indiqué sur le sachet).</p>`,
    accFaq: `
      <h3>Qu'est-ce que la créatine monohydrate ?</h3>
      <p>C'est la forme de créatine la plus courante. Une molécule d'eau y est attachée, d'où le nom « monohydrate ». Elle stimule la production d'énergie dans les muscles lors des exercices courts et intenses.</p>
      <h3>Peut-on en prendre tous les jours ?</h3>
      <p>Oui. Le produit est prévu pour une prise quotidienne, aux doses recommandées, dans le cadre d'un mode de vie sain.</p>
      <h3>La créatine augmente-t-elle la force ?</h3>
      <p>Prise sur la durée (4 à 12 semaines) avec un programme d'entraînement adapté, elle aide à gagner en masse musculaire et en force. Elle favorise la production d'ATP (adénosine triphosphate), première source d'énergie des contractions musculaires.</p>
      <h3>Combien de temps pour observer des résultats ?</h3>
      <p>Cela dépend des personnes, mais la plupart constatent les bénéfices au bout de quelques semaines. Les résultats varient aussi selon la régularité de la prise et de l'entraînement.</p>
      <h3>Une « phase de charge » est-elle recommandée ?</h3>
      <p>Elle n'est pas nécessaire. Une dose de maintenance (environ une par jour) donne de bons résultats avec le temps. La phase de charge sature les réserves plus vite : c'est un choix personnel.</p>
      <h3>Comment se passe la livraison ?</h3>
      <p>Livraison au Maroc pour {fee}. Après votre commande, nous vous appelons pour confirmer l'adresse et le délai.</p>
      <h3>Comment fonctionne le paiement à la livraison ?</h3>
      <p>Vous ne payez rien sur le site. Vous réglez le montant au livreur, à la réception de votre colis.</p>`
  },

  ar: {
    currency: "درهم",
    promo: "الدفع عند الاستلام · التوصيل لجميع أنحاء المغرب",
    langSwitch: "FR",
    langSwitchLabel: "Afficher la page en français",
    share: "مشاركة",
    copied: "تم نسخ الرابط",
    galleryLabel: "صور المنتج",

    kicker: "Bulk · تغذية رياضية",
    title: "كرياتين مونوهيدرات",
    lead: "الكرياتين مونوهيدرات، من أكثر المكملات الرياضية دراسةً، بطعم ستحب أن تعود إليه كل يوم.",
    highlights: `<li>كرياتين نقي 100%.</li><li>يزيد القوة والأداء البدني.</li><li>يحفّز الطاقة عبر إنتاج ATP.</li><li>3 غ من الكرياتين مونوهيدرات، الجرعة اليومية، لقوة أفضل.</li><li>كرياتين 100%، بدون إضافات غير ضرورية.</li>`,
    sub: "500 غرام · فانيلا، ميكسد بيري أو بدون نكهة",
    trustCod: "لا تدفع شيئاً قبل الاستلام",
    trustFee: "التوصيل إلى بابك بـ {fee}",
    trustCall: "مكالمة لتأكيد الطلب، بدون مفاجآت",

    tkHead: "وصل الطلب",
    tkProduct: "كرياتين مونوهيدرات",
    tkFlavor: "2. النكهة", tkFlavors: "2. النكهات — نكهة لكل 500 غ", sachet1: "النكهة 1", sachet2: "النكهة 2", errFlavor2: "اختر النكهة الثانية.", tkItem2: "{f1} + {f2} · 1 كغ",
    tkPack: "1. الحجم",
    tkInfo: "3. معلوماتك",
    wMix: "ميكس", mixSub: "حتى 5 كغ",
    tkMix: "2. اختر تشكيلتك", mixHint: "اختر الكمية من كل نكهة، 500 غ في كل مرة.",
    mixEmpty: "أضف الكمية بالزر +.",
    mixSum: "{kg} كغ · {price}", mixSum1: "500 غ · {price}",
    mixMax: "الحد الأقصى 5 كغ للطلب.", errMix: "أضف 500 غ على الأقل.",
    mixLess: "أنقص 500 غ {flavor}", mixMore: "أضف 500 غ {flavor}",
    mixPerPair: "كل 1 كغ بسعر {pair}.",
    flVanilla: "فانيلا",
    flBerry: "ميكسد بيري",
    flPlain: "بدون نكهة",
    w500: "500 غ",
    w1000: "1 كغ",
    perUnit: "1 كغ · {unit} لكل 500 غ · توفّر {save}",
    unit1: "500 غ",
    unit2: "1 كغ",
    tkItem: "{flavor} × {units}",
    tkNoFlavor: "اختر النكهة",
    nameLabel: "الاسم الكامل",
    namePh: "مثال: ياسين العمراني",
    phoneLabel: "الهاتف",
    addressLabel: "العنوان",
    addressPh: "الشارع، الحي، العمارة، المدينة",
    sumDelivery: "التوصيل",
    toConfirm: "يُؤكَّد لاحقاً",
    tkTotal: "المجموع",
    payNow: "لا شيء تدفعه الآن.",
    orderBtn: "اطلب الآن",
    loading: "جارٍ التسجيل…",
    callNote: "نتصل بك لتأكيد الطلب قبل الإرسال.",
    stickyBtn: "اطلب الآن",

    errFlavor: "اختر نكهة.",
    errPack: "اختر الحجم.",
    errName: "أدخل اسمك من أجل التوصيل.",
    errPhone: "أدخل رقم هاتفك: سنتصل بك لتأكيد الطلب.",
    errPhoneInvalid: "رقم غير صحيح. مثال: 06 12 34 56 78",
    errAddress: "أدخل عنوانك مع المدينة.",
    errNetwork: "لا يوجد اتصال. تحقق من الإنترنت وحاول مرة أخرى.",
    errGeneric: "لم يتم تسجيل الطلب. حاول مرة أخرى.",
    errTooMany: "محاولات كثيرة. حاول بعد بضع دقائق.",

    okTitle: "تم استلام طلبك، شكراً!",
    okText: "سنتصل بك قريباً جداً لتأكيد التوصيل. أبقِ هاتفك قريباً منك.",
    okNumber: "رقم الطلب",
    sumCod: "الدفع عند الاستلام",
    okNew: "طلب جديد",

    reviewsTitle: "ماذا يقول زبناؤنا",
    reviewsSub: "آراء حقيقية تركها زبناؤنا في متجرنا السابق، منشورة كما هي.",

    detailsTitle: "كل ما تحتاج معرفته",
    dDesc: "المنتج",
    dDescText: "كرياتين مونوهيدرات من Bulk، 500 غرام. ثلاث نكهات: فانيلا، ميكسد بيري وبدون نكهة.",
    dProduct: "طريقة الاستعمال",
    dProductText: "جرعة واحدة في اليوم مع الماء أو الشيك. اتبع الجرعة المكتوبة على الملصق.",
    dDelivery: "التوصيل",
    dDeliveryText: "التوصيل داخل المغرب بـ {fee}. بعد طلبك، نتصل بك لتأكيد العنوان وموعد التوصيل.",
    dPayment: "الدفع عند الاستلام",
    dPaymentText: "لا تدفع أي شيء على الموقع. تدفع المبلغ لعامل التوصيل عند استلام طردك.",

    contact: "عندك سؤال؟",
    copyright: "© 2026 Bulk Maroc. جميع الحقوق محفوظة.",

    accDescTitle: "الوصف",
    accUseTitle: "متى وكيف تستعمله",
    accIngrTitle: "المكونات",
    accNutriTitle: "القيم الغذائية",
    accFaqTitle: "أسئلة شائعة",
    accReviewsTitle: "الآراء",
    accDesc: `
      <h3>كرياتين مونوهيدرات</h3>
      <p><strong>قوة أكثر. تمرين أكثر.</strong> أضفه إلى روتينك اليومي لتتمرن بقوة أكبر وتكتشف ما تستطيع تحقيقه¹.</p>
      <h3>ملخص المنتج</h3>
      <p>كرّر التكرارات. ارفع أوزاناً أثقل. حسّن أداءك¹. يعزز الكرياتين إنتاج الطاقة في عضلاتك ويحسن أداءك في التمارين القصيرة والمكثفة: الدفعة التي تحتاجها لإضافة مجموعة أو تحطيم رقمك الشخصي. متوفر بنكهة الفانيلا، ميكسد بيري وبدون نكهة، ويُضاف إلى الشيك المعتاد.</p>
      <h3>ضمان الجودة من Bulk™</h3>
      <p>يُختبر كرياتين مونوهيدرات من Bulk™ وفق معايير جودة صارمة. تُصنع كل دفعة مع الحرص على السلامة والنقاء والفعالية. الكرياتين نقي بنسبة 99.9%.</p>
      <h3>أهم المزايا</h3>
      <ul>
        <li>تحسين الأداء¹</li>
        <li>أوزان أثقل</li>
        <li>تمارين أكثر كثافة</li>
        <li>إحساس بقوة أكبر</li>
      </ul>
      <h3>العلم وراء المنتج</h3>
      <p>ينتج الجسم الكرياتين بشكل طبيعي، ويوجد بكميات صغيرة في اللحوم والأسماك. مكمّل الكرياتين مونوهيدرات يرفع مخزون الفوسفوكرياتين في العضلات، لإنتاج طاقة أسرع خلال المجهود العالي الشدة. فوائد الاستعمال المنتظم موثّقة في التمارين القصيرة والمكثفة مثل تمارين المقاومة والعدو السريع.</p>
      <p class="note">¹ يحسّن الكرياتين الأداء البدني خلال تمارين متتالية قصيرة ومكثفة. يتحقق الأثر المفيد بتناول 3 غرامات من الكرياتين يومياً.</p>`,
    accUse: `
      <h3>طريقة الاستعمال</h3>
      <ul>
        <li><strong>بدون نكهة:</strong> امزج ملعقة ونصف (حوالي 3.4 غ) في 200 مل من الماء أو في شيك قبل أو بعد التمرين.</li>
        <li><strong>فانيلا:</strong> امزج ملعقة ونصف (حوالي 3.6 غ) في 200 مل من الماء أو في شيك قبل أو بعد التمرين.</li>
        <li><strong>ميكسد بيري:</strong> امزج ملعقة وثلاثة أرباع (حوالي 4.4 غ) في 200 مل من الماء أو في شيك قبل أو بعد التمرين.</li>
      </ul>
      <p><strong>جرعة واحدة في اليوم.</strong></p>`,
    accIngr: `
      <p><strong>بدون نكهة:</strong> كرياتين مونوهيدرات.<br /><strong>فانيلا وميكسد بيري:</strong> كرياتين مونوهيدرات ونكهات. القائمة الكاملة مكتوبة على الملصق.</p>
      <h3>مناسب لـ</h3>
      <p>النباتيين، حلال، النباتيين الصرف (Vegan).</p>
      <h3>معلومات عن مسببات الحساسية</h3>
      <p>قد يحتوي على الحليب، الصويا، حبوب تحتوي على الغلوتين، الخردل، بذور السمسم، ثاني أكسيد الكبريت والكبريتيت.</p>
      <h3>الحفظ</h3>
      <p>يُحفظ في مكان بارد وجاف.</p>
      <h3>معلومات إضافية</h3>
      <p>المكملات الغذائية لا تعوّض نظاماً غذائياً متنوعاً ومتوازناً ونمط حياة صحياً. لا تتجاوز الجرعة الموصى بها. يُحفظ بعيداً عن متناول الأطفال. اقرأ دائماً الملصق قبل الاستعمال. قد تختلف النتائج من شخص لآخر، وهي مرتبطة بتغذية وتمارين مناسبة.</p>`,
    accNutri: `
      <h3>المكونات الفعالة</h3>
      <table>
        <thead><tr><th>المكوّن</th><th>لكل جرعة</th></tr></thead>
        <tbody>
          <tr><td>كرياتين مونوهيدرات</td><td>3.4 غ</td></tr>
          <tr><td>منها كرياتين</td><td>3 غ</td></tr>
        </tbody>
      </table>
      <p class="note">قيم جرعة واحدة من النسخة بدون نكهة. نسختا الفانيلا وميكسد بيري توفّران أيضاً 3 غ من الكرياتين لكل جرعة (مكتوب على الملصق).</p>`,
    accFaq: `
      <h3>ما هو الكرياتين مونوهيدرات؟</h3>
      <p>هو الشكل الأكثر شيوعاً للكرياتين. ترتبط به جزيئة ماء واحدة، ومن هنا جاء اسم «مونوهيدرات». يحفّز إنتاج الطاقة في العضلات خلال التمارين القصيرة والمكثفة.</p>
      <h3>هل يمكن تناوله كل يوم؟</h3>
      <p>نعم. المنتج مخصص للاستعمال اليومي بالجرعات الموصى بها، في إطار نمط حياة صحي.</p>
      <h3>هل يزيد الكرياتين من القوة؟</h3>
      <p>مع الاستعمال على المدى الطويل (4 إلى 12 أسبوعاً) وبرنامج تمارين مناسب، يساعد على زيادة الكتلة العضلية والقوة، لأنه يدعم إنتاج ATP، المصدر الأول للطاقة في انقباض العضلات.</p>
      <h3>متى تظهر النتائج؟</h3>
      <p>يختلف ذلك من شخص لآخر، لكن أغلب الناس يلاحظون الفوائد بعد بضعة أسابيع. تتأثر النتائج أيضاً بانتظام الاستعمال والتمارين.</p>
      <h3>هل يُنصح بـ«مرحلة التحميل»؟</h3>
      <p>ليست ضرورية. جرعة يومية واحدة تعطي نتائج جيدة مع الوقت. مرحلة التحميل تملأ المخزون بسرعة أكبر، وهي اختيار شخصي.</p>
      <h3>كيف يتم التوصيل؟</h3>
      <p>التوصيل داخل المغرب بـ {fee}. بعد طلبك، نتصل بك لتأكيد العنوان وموعد التوصيل.</p>
      <h3>كيف يعمل الدفع عند الاستلام؟</h3>
      <p>لا تدفع أي شيء على الموقع. تدفع المبلغ لعامل التوصيل عند استلام طردك.</p>`
  }
};
