import { meta, q } from './helpers.js';

export const englishQuestions = [
  ...meta(6, 'english', 'Grammar Basics', [
    q(
      'Choose the correct verb: She ___ to school every day.',
      'درست فعل منتخب کریں: She ___ to school every day.',
      'صحيح فعل چونڊيو: She ___ to school every day.',
      ['goes', 'go', 'gone', 'going'],
      0,
      ['With "she" (third person singular) we add -s: she goes.', '"She" کے ساتھ فعل میں -s کا اضافہ ہوتا ہے: she goes۔', '"She" سان فعل ۾ -s وڌبو آهي: she goes.']
    ),
    q(
      'What is the plural of "child"?',
      '"child" کا جمع کیا ہے؟',
      '"child" جو جمع ڇا آهي؟',
      ['children', 'childs', 'childes', 'childrens'],
      0,
      ['"Child" has the irregular plural "children".', '"Child" کا غیر قاعدہ جمع "children" ہے۔', '"Child" جو غير قاعدي جمع "children" آهي.']
    ),
    q(
      'Fill in the article: I saw ___ elephant.',
      'حرفِ تعریف بھریں: I saw ___ elephant.',
      'حرف ڀريو: I saw ___ elephant.',
      ['an', 'a', 'the', 'no article'],
      0,
      ['Use "an" before a vowel sound: an elephant.', 'حروفِ علت کی آواز سے پہلے "an" آتا ہے: an elephant۔', 'حرف علت جي آواز کان اڳ "an" ايندو آهي: an elephant.']
    ),
    q(
      'What is the past tense of "play"?',
      '"play" کا ماضی کیا ہے؟',
      '"play" جو ماضي ڇا آهي؟',
      ['played', 'play', 'playing', 'plays'],
      0,
      ['Regular verbs add -ed in the past: play → played.', 'باقاعدہ فعل ماضی میں -ed لیتے ہیں: play → played۔', 'باقاعدي فعل ماضي ۾ -ed وٺندا آهن: play → played.']
    ),
    q(
      'Which word is a pronoun?',
      'درج ذیل میں سے ضمیر کون سی ہے؟',
      'هيٺين مان ڪهڙي ضمير آهي؟',
      ['He', 'Ali', 'car', 'run'],
      0,
      ['"He" replaces a noun, so it is a pronoun.', '"He" اسم کی جگہ لیتا ہے، اس لیے یہ ضمیر ہے۔', '"He" اسم جي جاءِ وٺندو آهي، ان ڪري هي ضمير آهي.']
    ),
  ]),

  ...meta(6, 'english', 'Vocabulary Builders', [
    q(
      'What is the opposite of "happy"?',
      '"happy" کا متضاد کیا ہے؟',
      '"happy" جو متضاد ڇا آهي؟',
      ['sad', 'glad', 'cheerful', 'joyful'],
      0,
      ['"Sad" is the opposite of "happy".', '"Sad" "happy" کا متضاد ہے۔', '"Sad" "happy" جو متضاد آهي.']
    ),
    q(
      'Choose the synonym of "big".',
      '"big" کا ہم معنی لفظ منتخب کریں۔',
      '"big" جو هم معنيٰ لفظ چونڊيو.',
      ['large', 'small', 'tiny', 'short'],
      0,
      ['"Large" means the same as "big".', '"Large" کا مطلب "big" جیسا ہے۔', '"Large" جو مطلب "big" جهڙو آهي.']
    ),
    q(
      'Where are books kept?',
      'کتابیں کہاں رکھی جاتی ہیں؟',
      'ڪتاب ڪٿي رکيا ويندا آهن؟',
      ['library', 'kitchen', 'garden', 'hospital'],
      0,
      ['A library is a place where books are kept.', 'لائبریری وہ جگہ ہے جہاں کتابیں رکھی جاتی ہیں۔', 'لائبريري اها جاءِ آهي جتي ڪتاب رکيا ويندا آهن.']
    ),
    q(
      'Complete the sentence: The sun rises in the ___.',
      'جملہ مکمل کریں: The sun rises in the ___.',
      'جملو مڪمل ڪريو: The sun rises in the ___.',
      ['east', 'west', 'north', 'south'],
      0,
      ['The sun rises in the east.', 'سورج مشرق میں طلوع ہوتا ہے۔', 'سج اوڀر ۾ اڀري ٿو.']
    ),
    q(
      'Which one is a fruit?',
      'درج ذیل میں سے پھل کون سا ہے؟',
      'هيٺين مان ڪهڙو ميوو آهي؟',
      ['mango', 'book', 'chair', 'pen'],
      0,
      ['A mango is a fruit.', 'آم ایک پھل ہے۔', 'انب هڪ ميوو آهي.']
    ),
  ]),

  ...meta(7, 'english', 'Grammar Basics', [
    q(
      'Choose the correct verb: They ___ football yesterday.',
      'درست فعل منتخب کریں: They ___ football yesterday.',
      'صحيح فعل چونڊيو: They ___ football yesterday.',
      ['played', 'play', 'plays', 'playing'],
      0,
      ['"Yesterday" shows the past, so we use "played".', '"Yesterday" ماضی ظاہر کرتا ہے، اس لیے "played" آئے گا۔', '"Yesterday" ماضي ڏيکاري ٿو، ان ڪري "played" ايندو.']
    ),
    q(
      'What is the plural of "mouse"?',
      '"mouse" کا جمع کیا ہے؟',
      '"mouse" جو جمع ڇا آهي؟',
      ['mice', 'mouses', 'mouse', 'mices'],
      0,
      ['The irregular plural of "mouse" is "mice".', '"mouse" کا غیر قاعدہ جمع "mice" ہے۔', '"mouse" جو غير قاعدي جمع "mice" آهي.']
    ),
    q(
      'Fill in: He is taller ___ his brother.',
      'خالی جگہ بھریں: He is taller ___ his brother.',
      'خالي جاءِ ڀريو: He is taller ___ his brother.',
      ['than', 'then', 'that', 'as'],
      0,
      ['We use "than" with comparative adjectives: taller than.', 'تقابلی صفت کے ساتھ "than" آتا ہے: taller than۔', 'تقابلي صفت سان "than" ايندو آهي: taller than.']
    ),
    q(
      'Complete the present continuous: She is ___ a letter.',
      'حال جاری مکمل کریں: She is ___ a letter.',
      'حال جاري مڪمل ڪريو: She is ___ a letter.',
      ['writing', 'write', 'wrote', 'written'],
      0,
      ['Present continuous uses "is/am/are + verb-ing": is writing.', 'حال جاری میں "is/am/are + verb-ing" آتا ہے: is writing۔', 'حال جاري ۾ "is/am/are + verb-ing" ايندو آهي: is writing.']
    ),
    q(
      'Which sentence is correct?',
      'کون سا جملہ درست ہے؟',
      'ڪهڙو جملو درست آهي؟',
      ['I have two sisters.', 'I has two sisters.', 'I having two sisters.', 'I is two sisters.'],
      0,
      ['With "I" we use "have", not "has".', '"I" کے ساتھ "have" آتا ہے، "has" نہیں۔', '"I" سان "have" ايندو آهي، "has" نه.']
    ),
  ]),

  ...meta(7, 'english', 'Vocabulary Builders', [
    q(
      'What is the opposite of "generous"?',
      '"generous" کا متضاد کیا ہے؟',
      '"generous" جو متضاد ڇا آهي؟',
      ['selfish', 'kind', 'giving', 'helpful'],
      0,
      ['A generous person gives; a selfish person does not.', 'سخی شخص دیتا ہے، خود غرض نہیں دیتا۔', 'سخي ماڻهو ڏيندو آهي، خود غرض نه ڏيندو آهي.']
    ),
    q(
      'Choose the synonym of "brave".',
      '"brave" کا ہم معنی لفظ منتخب کریں۔',
      '"brave" جو هم معنيٰ لفظ چونڊيو.',
      ['courageous', 'afraid', 'weak', 'quiet'],
      0,
      ['"Courageous" means brave.', '"Courageous" کا مطلب بہادر ہے۔', '"Courageous" جو مطلب بهادر آهي.']
    ),
    q(
      'A person who teaches is called a ___.',
      'پڑھانے والے شخص کو کیا کہتے ہیں؟',
      'سيکارڻ واري شخص کي ڇا چئبو آهي؟',
      ['teacher', 'doctor', 'driver', 'farmer'],
      0,
      ['A person who teaches is a teacher.', 'پڑھانے والا شخص استاد (teacher) ہوتا ہے۔', 'سيکارڻ وارو ماڻهو استاد (teacher) هوندو آهي.']
    ),
    q(
      'Birds live in a ___.',
      'پرندے ___ میں رہتے ہیں۔',
      'پکي ___ ۾ رهندا آهن.',
      ['nest', 'cave', 'hole', 'field'],
      0,
      ['Birds build and live in nests.', 'پرندے گھونسلا بناتے ہیں اور اس میں رہتے ہیں۔', 'پکي آکيرو ٺاهيندا آهن ۽ ان ۾ رهندا آهن.']
    ),
    q(
      'Which word is an adjective?',
      'کون سا لفظ صفت ہے؟',
      'ڪهڙو لفظ صفت آهي؟',
      ['beautiful', 'quickly', 'run', 'table'],
      0,
      ['"Beautiful" describes a noun, so it is an adjective.', '"Beautiful" اسم کی توصیف کرتا ہے، اس لیے یہ صفت ہے۔', '"Beautiful" اسم جي وضاحت ڪري ٿو، ان ڪري هي صفت آهي.']
    ),
  ]),

  ...meta(8, 'english', 'Grammar Basics', [
    q(
      'Change to passive voice: Ali writes a letter.',
      'مجهول فعل میں بدلیں: Ali writes a letter.',
      'مجهول فعل ۾ بدلايو: Ali writes a letter.',
      [
        'A letter is written by Ali.',
        'A letter was written by Ali.',
        'A letter writes by Ali.',
        'Ali is written a letter.',
      ],
      0,
      ['Present simple passive = is/am/are + past participle: is written.', 'حال سادہ مجہول = is/am/are + past participle: is written۔', 'حال سادو مجهول = is/am/are + past participle: is written.']
    ),
    q(
      'Complete the conditional: If it rains, we ___ at home.',
      'شرطیہ جملہ مکمل کریں: If it rains, we ___ at home.',
      'شرطي جملو مڪمل ڪريو: If it rains, we ___ at home.',
      ['will stay', 'stayed', 'would stayed', 'stays'],
      0,
      ['First conditional: if + present simple, will + base verb.', 'پہلی شرط: if + حال سادہ، will + بنیادی فعل۔', 'پهرين شرط: if + حال سادو، will + بنيادي فعل.']
    ),
    q(
      'Choose the correct preposition: She is good ___ mathematics.',
      'درست حرفِ جار منتخب کریں: She is good ___ mathematics.',
      'صحيح حرف چونڊيو: She is good ___ mathematics.',
      ['at', 'in', 'on', 'for'],
      0,
      ['The correct phrase is "good at" a subject.', 'درست محاورہ "good at" ہے۔', 'صحيح محاورو "good at" آهي.']
    ),
    q(
      'Report this sentence: He said, "I am tired."',
      'بالواسطہ بیان کریں: He said, "I am tired."',
      'بلواسطو بيان ڪريو: He said, "I am tired."',
      [
        'He said that he was tired.',
        'He said that I am tired.',
        'He says that he is tired.',
        'He said that he is tired.',
      ],
      0,
      ['In reported speech the present tense shifts back: am → was, I → he.', 'بالواسطہ بیان میں حال ماضی میں بدلتا ہے: am → was، I → he۔', 'بلواسطو بيان ۾ حال ماضي ۾ بدلندو آهي: am → was، I → he.']
    ),
    q(
      'What is the plural of "analysis"?',
      '"analysis" کا جمع کیا ہے؟',
      '"analysis" جو جمع ڇا آهي؟',
      ['analyses', 'analysises', 'analysies', 'analysis'],
      0,
      ['Words ending in -sis often change to -ses: analysis → analyses.', '-sis پر ختم ہونے والے الفاظ اکثر -ses بن جاتے ہیں: analysis → analyses۔', '-sis تي ختم ٿيندڙ لفظ اڪثر -ses ٿي ويندا آهن: analysis → analyses.']
    ),
  ]),

  ...meta(8, 'english', 'Vocabulary Builders', [
    q(
      'Choose the synonym of "abundant".',
      '"abundant" کا ہم معنی لفظ منتخب کریں۔',
      '"abundant" جو هم معنيٰ لفظ چونڊيو.',
      ['plentiful', 'rare', 'empty', 'limited'],
      0,
      ['"Abundant" means existing in large quantities, or plentiful.', '"Abundant" کا مطلب بہت زیادہ یا وافر ہے۔', '"Abundant" جو مطلب گهڻو يا گهڻائي ۾ موجود آهي.']
    ),
    q(
      'What is the opposite of "ancient"?',
      '"ancient" کا متضاد کیا ہے؟',
      '"ancient" جو متضاد ڇا آهي؟',
      ['modern', 'old', 'historic', 'aged'],
      0,
      ['Ancient means very old; modern means new or current.', 'Ancient کا مطلب بہت پرانا، modern کا مطلب نیا ہے۔', 'Ancient جو مطلب تمام پراڻو، modern جو مطلب نئون آهي.']
    ),
    q(
      'A short story with a moral is called a ___.',
      'اخلاقی سبق والی مختصر کہانی کو کیا کہتے ہیں؟',
      'اخلاقي سبق واري مختصر ڪهاڻي کي ڇا چئبو آهي؟',
      ['fable', 'novel', 'poem', 'drama'],
      0,
      ['A fable is a short story, often with animals, that teaches a moral.', 'افسانہ ایک مختصر کہانی ہے، اکثر جانوروں کے ساتھ، جو اخلاقی سبق دیتی ہے۔', 'ڏند ڪٿا هڪ مختصر ڪهاڻي آهي، اڪثر جانورن سان، جيڪا اخلاقي سبق ڏئي ٿي.']
    ),
    q(
      'A person who studies stars and planets is an ___.',
      'ستاروں اور سیاروں کا مطالعہ کرنے والے کو کیا کہتے ہیں؟',
      'ستارن ۽ سيارن جو مطالعو ڪندڙ کي ڇا چئبو آهي؟',
      ['astronomer', 'astrologer', 'geologist', 'biologist'],
      0,
      ['An astronomer studies stars, planets and space.', 'ماہرِ فلکیات ستاروں، سیاروں اور خلا کا مطالعہ کرتا ہے۔', 'فلڪيات جو ماهر ستارن، سيارن ۽ خلا جو مطالعو ڪندو آهي.']
    ),
    q(
      'Choose the correct spelling.',
      'درست ہجے منتخب کریں۔',
      'صحيح هجيو چونڊيو.',
      ['necessary', 'neccessary', 'necesary', 'neccesary'],
      0,
      ['The correct spelling is "necessary" (one c, two s).', 'درست ہجے "necessary" ہے (ایک c، دو s)۔', 'صحيح هجيو "necessary" آهي (هڪ c، ٻه s).']
    ),
  ]),

  ...meta(9, 'english', 'Grammar Basics', [
    q(
      'Choose the correct verb: Neither Ali nor his friends ___ present.',
      'درست فعل منتخب کریں: Neither Ali nor his friends ___ present.',
      'صحيح فعل چونڊيو: Neither Ali nor his friends ___ present.',
      ['were', 'was', 'is', 'has'],
      0,
      ['With "neither...nor", the verb agrees with the nearer subject "friends", so "were".', '"neither...nor" میں فعل قریبی فاعل "friends" کے مطابق ہوتا ہے، اس لیے "were"۔', '"neither...nor" ۾ فعل ويجهي فاعل "friends" مطابق ٿيندو، ان ڪري "were".']
    ),
    q(
      'By tomorrow, she ___ the work.',
      'کل تک، وہ کام ___ چکی ہوگی۔',
      'سڀاڻي تائين، هوءَ ڪم ___ چڪي هوندي.',
      ['will have finished', 'will finish', 'finished', 'has finish'],
      0,
      ['Future perfect = will have + past participle: will have finished.', 'مستقبل مکمل = will have + past participle: will have finished۔', 'مستقبل مڪمل = will have + past participle: will have finished.']
    ),
    q(
      'He prevented me ___ going.',
      'اس نے مجھے جانے سے روکا: He prevented me ___ going.',
      'هن مون کي وڃڻ کان روڪيو: He prevented me ___ going.',
      ['from', 'to', 'of', 'for'],
      0,
      ['The verb "prevent" is followed by "from + -ing".', 'فعل "prevent" کے بعد "from + -ing" آتا ہے۔', 'فعل "prevent" کان پوءِ "from + -ing" ايندو آهي.']
    ),
    q(
      'In the sentence "The boy who lives in Lahore is my friend", what is "who lives in Lahore"?',
      'جملے میں "who lives in Lahore" کیا ہے؟',
      'جملو "who lives in Lahore" ۾ ڇا آهي؟',
      ['relative clause', 'main clause', 'phrase', 'noun'],
      0,
      ['It describes "the boy" and begins with the relative pronoun "who".', 'یہ "لڑکے" کی وضاحت کرتا ہے اور رشتہ دار ضمیر "who" سے شروع ہوتا ہے۔', 'هي "ڇوڪرو" جي وضاحت ڪري ٿو ۽ نسبتي ضمير "who" سان شروع ٿئي ٿو.']
    ),
    q(
      'Hardly had I arrived ___ the bell rang.',
      'میں پہنچا ہی تھا ___ گھنٹی بج گئی۔',
      'مان پهتو هوس ___ گھنٽي وڳي.',
      ['when', 'than', 'then', 'that'],
      0,
      ['The correct structure is "Hardly had ... when ...".', 'درست ساخت "Hardly had ... when ..." ہے۔', 'صحيح جوڙجڪ "Hardly had ... when ..." آهي.']
    ),
  ]),

  ...meta(9, 'english', 'Vocabulary Builders', [
    q(
      'Choose the synonym of "meticulous".',
      '"meticulous" کا ہم معنی لفظ منتخب کریں۔',
      '"meticulous" جو هم معنيٰ لفظ چونڊيو.',
      ['careful', 'careless', 'quick', 'lazy'],
      0,
      ['Meticulous means showing great attention to detail; careful.', 'Meticulous کا مطلب باریک بین اور محتاط ہے۔', 'Meticulous جو مطلب باريڪ بين ۽ محتاط آهي.']
    ),
    q(
      'What is the opposite of "transparent"?',
      '"transparent" کا متضاد کیا ہے؟',
      '"transparent" جو متضاد ڇا آهي؟',
      ['opaque', 'clear', 'visible', 'bright'],
      0,
      ['Transparent means see-through; opaque means not see-through.', 'Transparent کا مطلب شفاف، opaque کا مطلب غیر شفاف ہے۔', 'Transparent جو مطلب شفاف، opaque جو مطلب غير شفاف آهي.']
    ),
    q(
      'What does "ubiquitous" mean?',
      '"ubiquitous" کا کیا مطلب ہے؟',
      '"ubiquitous" جو ڇا مطلب آهي؟',
      ['present everywhere', 'very rare', 'extremely old', 'completely silent'],
      0,
      ['Ubiquitous describes something that appears everywhere.', 'Ubiquitous کسی ہر جگہ موجود چیز کو کہتے ہیں۔', 'Ubiquitous ڪنهن هر هنڌ موجود شيءِ کي چئبو آهي.']
    ),
    q(
      'The fear of water is called ___.',
      'پانی کے خوف کو کیا کہتے ہیں؟',
      'پاڻي جي ڊپ کي ڇا چئبو آهي؟',
      ['hydrophobia', 'claustrophobia', 'acrophobia', 'xenophobia'],
      0,
      ['"Hydro" means water and "phobia" means fear.', '"Hydro" کا مطلب پانی اور "phobia" کا مطلب خوف ہے۔', '"Hydro" جو مطلب پاڻي ۽ "phobia" جو مطلب ڊپ آهي.']
    ),
    q(
      'Choose the correct spelling.',
      'درست ہجے منتخب کریں۔',
      'صحيح هجيو چونڊيو.',
      ['occurrence', 'occurence', 'ocurrence', 'occurrance'],
      0,
      ['The correct spelling is "occurrence" (double c, double r).', 'درست ہجے "occurrence" ہے (دو c، دو r)۔', 'صحيح هجيو "occurrence" آهي (ٻه c، ٻه r).']
    ),
  ]),

  ...meta(10, 'english', 'Grammar Basics', [
    q(
      'If I had known, I ___ earlier.',
      'اگر مجھے معلوم ہوتا تو میں پہلے ___۔',
      'جيڪڏهن مون کي خبر هجي ها ته مان اڳي ___ ها.',
      ['would have come', 'would come', 'came', 'will come'],
      0,
      ['Third conditional uses "would have + past participle".', 'تیسری شرط میں "would have + past participle" آتا ہے۔', 'ٽئين شرط ۾ "would have + past participle" ايندو آهي.']
    ),
    q(
      'Choose the correct verb: The news ___ surprising.',
      'درست فعل منتخب کریں: The news ___ surprising.',
      'صحيح فعل چونڊيو: The news ___ surprising.',
      ['is', 'are', 'were', 'have'],
      0,
      ['"News" is an uncountable singular noun, so we use "is".', '"News" واحد غیر معدود اسم ہے، اس لیے "is" آئے گا۔', '"News" واحد غير شمار اسم آهي، ان ڪري "is" ايندو.']
    ),
    q(
      'Choose the correct indirect speech: She asked, "Where do you live?"',
      'درست بالواسطہ بیان منتخب کریں: She asked, "Where do you live?"',
      'صحيح بلواسطو بيان چونڊيو: She asked, "Where do you live?"',
      [
        'She asked where I lived.',
        'She asked where did I live.',
        'She asked where do I live.',
        'She asked where I live?',
      ],
      0,
      ['In reported questions, use the statement order and shift the tense: where I lived.', 'بالواسطہ سوال میں بیان کی ترتیب اور زمانے کی تبدیلی ہوتی ہے: where I lived۔', 'بلواسطو سوال ۾ بيان جي ترتيب ۽ زماني جي تبديلي ٿيندي آهي: where I lived.']
    ),
    q(
      'Despite ___ hard, he failed the test.',
      'سخت محنت ___ بھی وہ فیل ہو گیا۔',
      'سخت محنت ___ به هو فيل ٿي ويو.',
      ['working', 'work', 'worked', 'to work'],
      0,
      ['"Despite" is followed by a noun or -ing form: despite working hard.', '"Despite" کے بعد اسم یا -ing شکل آتی ہے: despite working hard۔', '"Despite" کان پوءِ اسم يا -ing شڪل ايندي آهي: despite working hard.']
    ),
    q(
      'Identify the gerund: "Swimming is good exercise."',
      'جیرنڈ کی نشاندہی کریں: "Swimming is good exercise."',
      'جيرنڊ سڃاڻو: "Swimming is good exercise."',
      ['Swimming', 'good', 'exercise', 'is'],
      0,
      ['"Swimming" is a verb form used as a noun, which is a gerund.', '"Swimming" فعل کی وہ شکل ہے جو اسم کے طور پر استعمال ہو، یہ جیرنڈ ہے۔', '"Swimming" فعل جي اها شڪل آهي جيڪا اسم طور استعمال ٿئي، اهو جيرنڊ آهي.']
    ),
  ]),

  ...meta(10, 'english', 'Vocabulary Builders', [
    q(
      'Choose the synonym of "candid".',
      '"candid" کا ہم معنی لفظ منتخب کریں۔',
      '"candid" جو هم معنيٰ لفظ چونڊيو.',
      ['honest', 'secretive', 'rude', 'shy'],
      0,
      ['Candid means honest and direct.', 'Candid کا مطلب ایماندار اور صاف گو ہے۔', 'Candid جو مطلب ايماندار ۽ صاف گو آهي.']
    ),
    q(
      'What is the opposite of "scarce"?',
      '"scarce" کا متضاد کیا ہے؟',
      '"scarce" جو متضاد ڇا آهي؟',
      ['abundant', 'rare', 'few', 'limited'],
      0,
      ['Scarce means in short supply; abundant means plentiful.', 'Scarce کا مطلب کم، abundant کا مطلب وافر ہے۔', 'Scarce جو مطلب گهٽ، abundant جو مطلب گهڻو آهي.']
    ),
    q(
      'What does "ephemeral" mean?',
      '"ephemeral" کا کیا مطلب ہے؟',
      '"ephemeral" جو ڇا مطلب آهي؟',
      ['short-lived', 'everlasting', 'powerful', 'hidden'],
      0,
      ['Ephemeral describes something that lasts for a very short time.', 'Ephemeral کسی بہت مختصر وقت تک رہنے والی چیز کو کہتے ہیں۔', 'Ephemeral ڪنهن تمام ٿوري وقت تائين رهندڙ شيءِ کي چئبو آهي.']
    ),
    q(
      'A speech made by a character alone on stage is a ___.',
      'اسٹیج پر اکیلی کردار کی تقریر کو کیا کہتے ہیں؟',
      'اسٽيج تي اڪيلي ڪردار جي تقرير کي ڇا چئبو آهي؟',
      ['soliloquy', 'monologue', 'dialogue', 'prologue'],
      0,
      ['A soliloquy is a speech where a character speaks their thoughts alone.', 'Soliloquy وہ تقریر ہے جس میں کردار اکیلا اپنے خیالات بولتا ہے۔', 'Soliloquy اها تقرير آهي جنهن ۾ ڪردار اڪيلو پنهنجا خيال ڳالهائيندو آهي.']
    ),
    q(
      'Choose the correct spelling.',
      'درست ہجے منتخب کریں۔',
      'صحيح هجيو چونڊيو.',
      ['accommodate', 'acommodate', 'accomodate', 'acommadate'],
      0,
      ['The correct spelling is "accommodate" (double c, double m).', 'درست ہجے "accommodate" ہے (دو c، دو m)۔', 'صحيح هجيو "accommodate" آهي (ٻه c، ٻه m).']
    ),
  ]),
];
