import { meta, q } from './helpers.js';

export const scienceQuestions = [
  ...meta(6, 'science', 'Living Things', [
    q(
      'Which organ pumps blood around the body?',
      'کون سا عضو جسم میں خون پمپ کرتا ہے؟',
      'ڪهڙو عضوو جسم ۾ رت پمپ ڪري ٿو؟',
      ['Heart', 'Lungs', 'Liver', 'Stomach'],
      0,
      ['The heart pumps blood through the blood vessels.', 'دل خون کو نالیوں کے ذریعے پمپ کرتا ہے۔', 'دل رت کي رڳن ذريعي پمپ ڪري ٿو.']
    ),
    q(
      'Green plants make their food by the process of ___.',
      'سبز پودے کھانا کس عمل سے بناتے ہیں؟',
      'ساوا ٻوٽا کاڌو ڪهڙي عمل سان ٺاهيندا آهن؟',
      ['photosynthesis', 'respiration', 'digestion', 'transpiration'],
      0,
      ['Plants use sunlight, water and carbon dioxide in photosynthesis.', 'پودے دھوپ، پانی اور کاربن ڈائی آکسائیڈ سے غذا بناتے ہیں۔', 'ٻوٽا سج، پاڻي ۽ ڪاربن ڊاءِ آڪسائيڊ مان کاڌو ٺاهيندا آهن.']
    ),
    q(
      'Which of these is a mammal?',
      'ان میں سے کون سا ممالیہ (mammal) ہے؟',
      'انهن مان ڪهڙو مماليه (mammal) آهي؟',
      ['Cow', 'Snake', 'Frog', 'Fish'],
      0,
      ['A cow gives birth to young and feeds them milk, so it is a mammal.', 'گائے بچے جنتی ہے اور دودھ پلاتی ہے، اس لیے یہ ممالیہ ہے۔', 'ڳائو ٻچا ڄڻي ٿي ۽ کير پياري ٿي، ان ڪري اها مماليه آهي.']
    ),
    q(
      'Plants absorb water from the soil through their ___.',
      'پودے مٹی سے پانی کس حصے کے ذریعے جذب کرتے ہیں؟',
      'ٻوٽا مٽيءَ مان پاڻي ڪهڙي حصي ذريعي جذب ڪندا آهن؟',
      ['roots', 'leaves', 'flowers', 'fruits'],
      0,
      ['Roots anchor the plant and absorb water and minerals.', 'جڑیں پودے کو سہارا دیتی ہیں اور پانی و معدنیات جذب کرتی ہیں۔', 'پاڙون ٻوٽي کي سهارو ڏين ٿيون ۽ پاڻي ۽ معدنيات جذب ڪن ٿيون.']
    ),
    q(
      'What is the basic unit of life?',
      'زندگی کی بنیادی اکائی کیا ہے؟',
      'زندگيءَ جي بنيادي ايڪائي ڇا آهي؟',
      ['Cell', 'Atom', 'Organ', 'Tissue'],
      0,
      ['All living things are made of one or more cells.', 'تمام جاندار ایک یا زیادہ خلیات سے بنے ہیں۔', 'سڀ جاندار هڪ يا وڌيڪ خليا سان ٺهيل آهن.']
    ),
  ]),

  ...meta(6, 'science', 'Matter & Energy', [
    q(
      'At what temperature does pure water freeze?',
      'خالص پانی کس درجہ حرارت پر جمتا ہے؟',
      'خالص پاڻي ڪهڙي درجي حرارت تي ڄمي ٿو؟',
      ['0 °C', '100 °C', '50 °C', '−10 °C'],
      0,
      ['Pure water freezes at 0 °C and boils at 100 °C.', 'خالص پانی 0 °C پر جمتا اور 100 °C پر ابلتا ہے۔', 'خالص پاڻي 0 °C تي ڄمي ٿو ۽ 100 °C تي ٻرندو آهي.']
    ),
    q(
      'Which of these is a gas at room temperature?',
      'ان میں سے کون سا کمرے کے درجہ حرارت پر گیس ہے؟',
      'انهن مان ڪهڙو ڪمري جي درجي حرارت تي گئس آهي؟',
      ['Oxygen', 'Iron', 'Wood', 'Sand'],
      0,
      ['Oxygen is a gas that we breathe in from the air.', 'آکسیجن ایک گیس ہے جو ہم ہوا سے سانس لیتے ہیں۔', 'آڪسيجن هڪ گئس آهي جيڪا اسان هوا مان ساهه ۾ وٺون ٿا.']
    ),
    q(
      'What is the main natural source of light and heat on Earth?',
      'زمین پر روشنی اور حرارت کا بنیادی قدرتی ذریعہ کیا ہے؟',
      'زمين تي روشني ۽ حرارت جو بنيادي قدرتي ذريعو ڇا آهي؟',
      ['The Sun', 'The Moon', 'Stars', 'Fire'],
      0,
      ['The Sun provides almost all of the light and heat energy on Earth.', 'سورج زمین کی تقریباً تمام روشنی اور حرارت فراہم کرتا ہے۔', 'سج زمين جي تقريباً سڀني روشني ۽ حرارت مهيا ڪري ٿو.']
    ),
    q(
      'The change of a liquid into a gas is called ___.',
      'مائع کے گیس میں تبدیل ہونے کو کیا کہتے ہیں؟',
      'مائع جي گئس ۾ تبديل ٿيڻ کي ڇا چئبو آهي؟',
      ['evaporation', 'condensation', 'freezing', 'melting'],
      0,
      ['Evaporation happens when particles escape from the surface of a liquid.', 'بخارات اس وقت بنتے ہیں جب مائع کی سطح سے ذرات نکلتے ہیں۔', 'بخار تڏهن ٿئي ٿو جڏهن مائع جي مٿاڇري مان ذرڙا نڪرن ٿا.']
    ),
    q(
      'Which material is attracted by a magnet?',
      'کون سا مادہ مقناطیس کی طرف کشش رکھتا ہے؟',
      'ڪهڙو مادو مقناطيس ڏانهن ڇڪجي ٿو؟',
      ['Iron', 'Plastic', 'Wood', 'Glass'],
      0,
      ['Iron is a magnetic material and is attracted to magnets.', 'لوہا مقناطیسی مادہ ہے اور مقناطیس سے کشش رکھتا ہے۔', 'لوهه مقناطيسي مادو آهي ۽ مقناطيس ڏانهن ڇڪجي ٿو.']
    ),
  ]),

  ...meta(7, 'science', 'Human Body', [
    q(
      'What is the largest organ of the human body?',
      'انسانی جسم کا سب سے بڑا عضو کون سا ہے؟',
      'انساني جسم جو سڀ کان وڏو عضوو ڪهڙو آهي؟',
      ['Skin', 'Heart', 'Liver', 'Brain'],
      0,
      ['The skin is the body’s largest organ.', 'جِلد انسانی جسم کا سب سے بڑا عضو ہے۔', 'چمڙي انساني جسم جو سڀ کان وڏو عضوو آهي.']
    ),
    q(
      'Which gas do we take in from the air for breathing?',
      'سانس لینے کے لیے ہم ہوا سے کون سی گیس لیتے ہیں؟',
      'ساهه وٺڻ لاءِ اسان هوا مان ڪهڙي گئس وٺون ٿا؟',
      ['Oxygen', 'Carbon dioxide', 'Nitrogen', 'Hydrogen'],
      0,
      ['We breathe in oxygen and breathe out carbon dioxide.', 'ہم آکسیجن لیتے ہیں اور کاربن ڈائی آکسائیڈ خارج کرتے ہیں۔', 'اسان آڪسيجن وٺون ٿا ۽ ڪاربن ڊاءِ آڪسائيڊ ڇڏيون ٿا.']
    ),
    q(
      'Which blood cells help fight infection?',
      'کون سے خون کے خلیے انفیکشن سے لڑنے میں مدد کرتے ہیں؟',
      'ڪهڙا رت جا خليا انفيڪشن سان وڙهڻ ۾ مدد ڪن ٿا؟',
      ['White blood cells', 'Red blood cells', 'Platelets', 'Plasma'],
      0,
      ['White blood cells defend the body against germs.', 'سفید خونی خلیے جراثیم کے خلاف جسم کا دفاع کرتے ہیں۔', 'سفيد رت جا خليا جراثيمن خلاف جسم جو دفاع ڪن ٿا.']
    ),
    q(
      'Which organs filter waste from the blood?',
      'کون سے اعضاء خون سے فضلہ چھانتے ہیں؟',
      'ڪهڙا عضوا رت مان فضلو ڇني ٿا؟',
      ['Kidneys', 'Lungs', 'Eyes', 'Ears'],
      0,
      ['The kidneys filter waste and extra water to form urine.', 'گردے فضلہ اور اضافی پانی چھان کر پیشاب بناتے ہیں۔', 'گردا فضلو ۽ اضافي پاڻي ڇڻي پيشاب ٺاهيندا آهن.']
    ),
    q(
      'How many bones are there in an adult human body?',
      'بالغ انسانی جسم میں کتنی ہڈیاں ہوتی ہیں؟',
      'بالغ انساني جسم ۾ ڪيتريون هڏيون هونديون آهن؟',
      ['206', '106', '306', '250'],
      0,
      ['An adult human has 206 bones.', 'ایک بالغ انسان کے 206 ہڈیاں ہوتی ہیں۔', 'هڪ بالغ انسان کي 206 هڏيون هونديون آهن.']
    ),
  ]),

  ...meta(7, 'science', 'Force & Motion', [
    q(
      'What is the SI unit of force?',
      'قوت کی SI اکائی کیا ہے؟',
      'قوت جي SI ايڪائي ڇا آهي؟',
      ['Newton', 'Joule', 'Watt', 'Pascal'],
      0,
      ['Force is measured in newtons (N).', 'قوت کو نیوٹن (N) میں ناپا جاتا ہے۔', 'قوت کي نيوٽن (N) ۾ ماپيو ويندو آهي.']
    ),
    q(
      'Which force pulls objects towards the Earth?',
      'کون سی قوت اشیاء کو زمین کی طرف کھینچتی ہے؟',
      'ڪهڙي قوت شين کي زمين ڏانهن ڇڪي ٿي؟',
      ['Gravity', 'Friction', 'Magnetism', 'Tension'],
      0,
      ['Gravity is the force of attraction between masses, such as the Earth and objects.', 'کششِ ثقل زمین اور اشیاء کے درمیان کشش کی قوت ہے۔', 'ڪشش ثقل زمين ۽ شين جي وچ ۾ ڇڪ جي قوت آهي.']
    ),
    q(
      'A device that makes work easier is called a ___.',
      'کام آسان بنانے والے آلے کو کیا کہتے ہیں؟',
      'ڪم آسان ڪرڻ واري اوزار کي ڇا چئبو آهي؟',
      ['machine', 'magnet', 'battery', 'mixture'],
      0,
      ['Simple machines such as levers and pulleys make work easier.', 'سادہ مشینیں جیسے لیور اور گھرنی کام آسان بناتی ہیں۔', 'سادي مشينون جهڙوڪ ليور ۽ گِرني ڪم آسان ڪن ٿيون.']
    ),
    q(
      'Speed is calculated as ___.',
      'رفتار کا حساب کس طرح کیا جاتا ہے؟',
      'رفتار جو حساب ڪيئن ڪيو ويندو آهي؟',
      ['distance ÷ time', 'time ÷ distance', 'distance × time', 'mass × time'],
      0,
      ['Speed = distance travelled divided by the time taken.', 'رفتار = طے شدہ فاصلہ تقسیم وقت۔', 'رفتار = طئي ٿيل فاصلو ورهايل وقت.']
    ),
    q(
      'Which force opposes the motion of objects that touch each other?',
      'کون سی قوت ایک دوسرے کو چھونے والی اشیاء کی حرکت کی مخالفت کرتی ہے؟',
      'ڪهڙي قوت هڪ ٻئي کي ڇهندڙ شين جي حرڪت جي مخالفت ڪري ٿي؟',
      ['Friction', 'Gravity', 'Magnetism', 'Inertia'],
      0,
      ['Friction acts between surfaces and slows movement.', 'رگڑ سطحوں کے درمیان کام کرتی ہے اور حرکت کو سست کرتی ہے۔', 'رگڙ مٿاڇرن جي وچ ۾ ڪم ڪري ٿي ۽ حرڪت کي سست ڪري ٿي.']
    ),
  ]),

  ...meta(8, 'science', 'Cells & Reproduction', [
    q(
      'Which part of the cell controls its activities?',
      'خلیے کا کون سا حصہ اس کی سرگرمیوں کو کنٹرول کرتا ہے؟',
      'خليي جو ڪهڙو حصو ان جي سرگرمين کي ڪنٽرول ڪري ٿو؟',
      ['Nucleus', 'Cytoplasm', 'Cell membrane', 'Vacuole'],
      0,
      ['The nucleus contains genetic material and controls the cell.', 'مرکزہ جینیاتی مواد رکھتا ہے اور خلیے کو کنٹرول کرتا ہے۔', 'مرڪزو جينياتي مواد رکي ٿو ۽ خليي کي ڪنٽرول ڪري ٿو.']
    ),
    q(
      'Flowering plants reproduce mainly through ___.',
      'پھولدار پودے بنیادی طور پر کس ذریعے افزائش کرتے ہیں؟',
      'گلن وارا ٻوٽا بنيادي طور ڪهڙي ذريعي افزائش ڪن ٿا؟',
      ['seeds', 'roots', 'leaves', 'stems'],
      0,
      ['Flowers produce seeds, which grow into new plants.', 'پھول بیج بناتے ہیں جو نئے پودوں میں تبدیل ہوتے ہیں۔', 'گل ٻج ٺاهيندا آهن جيڪي نوان ٻوٽا ٿيندا آهن.']
    ),
    q(
      'What gives leaves their green colour?',
      'پتوں کو سبز رنگ کیا دیتا ہے؟',
      'پنن کي سائو رنگ ڇا ڏئي ٿو؟',
      ['Chlorophyll', 'Glucose', 'Protein', 'Starch'],
      0,
      ['Chlorophyll is the green pigment used in photosynthesis.', 'کلوروفل سبز رنگت ہے جو ضیائی تالیف میں استعمال ہوتی ہے۔', 'ڪلوروفل سائو رنگ آهي جيڪو ضيائي تاليف ۾ استعمال ٿئي ٿو.']
    ),
    q(
      'Which structure is found in plant cells but not in animal cells?',
      'کون سی ساخت پودوں کے خلیوں میں ہوتی ہے مگر جانوروں کے خلیوں میں نہیں؟',
      'ڪهڙي بناوٽ ٻوٽن جي خليا ۾ هوندي آهي پر جانورن جي خليا ۾ نه؟',
      ['Cell wall', 'Nucleus', 'Cytoplasm', 'Cell membrane'],
      0,
      ['Plant cells have a rigid cell wall for support.', 'پودوں کے خلیوں میں سہارے کے لیے سخت خلوی دیوار ہوتی ہے۔', 'ٻوٽن جي خليا ۾ سهارو ڏيڻ لاءِ سخت خلوي ديوار هوندي آهي.']
    ),
    q(
      'The male reproductive cell is called a ___.',
      'نر تولیدی خلیے کو کیا کہتے ہیں؟',
      'نر پيدائشي خليي کي ڇا چئبو آهي؟',
      ['sperm', 'egg', 'embryo', 'seed'],
      0,
      ['Sperm is the male gamete; the egg is the female gamete.', 'سپرم نر گیمیٹ ہے، انڈا مادہ گیمیٹ ہے۔', 'اسپرم نر گيميٽ آهي، آنو مادي گيميٽ آهي.']
    ),
  ]),

  ...meta(8, 'science', 'Chemical Reactions', [
    q(
      'What is the chemical formula of water?',
      'پانی کا کیمیائی فارمولا کیا ہے؟',
      'پاڻي جو ڪيميائي فارمولو ڇا آهي؟',
      ['H₂O', 'CO₂', 'O₂', 'NaCl'],
      0,
      ['Water contains two hydrogen atoms and one oxygen atom: H₂O.', 'پانی میں دو ہائیڈروجن اور ایک آکسیجن ایٹم ہوتا ہے: H₂O۔', 'پاڻي ۾ ٻه هائيڊروجن ۽ هڪ آڪسيجن ايٽم هوندو آهي: H₂O.']
    ),
    q(
      'Which gas is released when fuels burn?',
      'ایندھن جلنے پر کون سی گیس خارج ہوتی ہے؟',
      'ٻارڻ جلڻ تي ڪهڙي گئس خارج ٿئي ٿي؟',
      ['Carbon dioxide', 'Oxygen', 'Hydrogen', 'Nitrogen'],
      0,
      ['Burning fuels release carbon dioxide into the air.', 'ایندھن جلنے سے کاربن ڈائی آکسائیڈ ہوا میں خارج ہوتی ہے۔', 'ٻارڻ جلڻ سان ڪاربن ڊاءِ آڪسائيڊ هوا ۾ خارج ٿئي ٿي.']
    ),
    q(
      'A pH value below 7 means a substance is ___.',
      'pH کی قیمت 7 سے کم ہونے کا مطلب ہے کہ مادہ ___ ہے۔',
      'pH قيمت 7 کان گهٽ هجڻ جو مطلب آهي ته مادو ___ آهي.',
      ['acidic', 'basic', 'neutral', 'pure'],
      0,
      ['Below 7 is acidic, 7 is neutral and above 7 is basic.', '7 سے کم تیزابی، 7 غیر جانبدار اور 7 سے زیادہ اساس ہے۔', '7 کان گهٽ تيزابي، 7 غير جانبدار ۽ 7 کان وڌيڪ اساس آهي.']
    ),
    q(
      'Rusting of iron needs oxygen and ___.',
      'لوہے کو زنگ لگانے کے لیے آکسیجن اور ___ درکار ہے۔',
      'لوهي کي ڄنگ لڳڻ لاءِ آڪسيجن ۽ ___ گهربل آهي.',
      ['water', 'oil', 'salt', 'sunlight'],
      0,
      ['Iron rusts when both oxygen and moisture are present.', 'لوہا اس وقت زنگ کھاتا ہے جب آکسیجن اور نمی دونوں موجود ہوں۔', 'لوهه تڏهن ڄنگ کائيندو آهي جڏهن آڪسيجن ۽ نمي ٻئي موجود هجن.']
    ),
    q(
      'What is the chemical symbol for sodium?',
      'سوڈیم کی کیمیائی علامت کیا ہے؟',
      'سوڊيم جي ڪيميائي علامت ڇا آهي؟',
      ['Na', 'So', 'S', 'Ni'],
      0,
      ['Sodium is represented by Na, from its Latin name natrium.', 'سوڈیم کو Na سے ظاہر کیا جاتا ہے، جو اس کے لاطینی نام natrium سے ہے۔', 'سوڊيم کي Na سان ظاهر ڪيو ويندو آهي، جيڪو ان جي لاطيني نالي natrium مان آهي.']
    ),
  ]),

  ...meta(9, 'science', 'Ecosystems', [
    q(
      'In a food chain, plants are called ___.',
      'غذائی زنجیر میں پودوں کو کیا کہتے ہیں؟',
      'غذائي زنجير ۾ ٻوٽن کي ڇا چئبو آهي؟',
      ['producers', 'consumers', 'decomposers', 'predators'],
      0,
      ['Plants produce their own food, so they are producers.', 'پودے اپنی غذا خود بناتے ہیں، اس لیے وہ پیداواری ہیں۔', 'ٻوٽا پنهنجي کاڌي پاڻ ٺاهيندا آهن، ان ڪري اهي پيداواري آهن.']
    ),
    q(
      'Animals that eat only plants are called ___.',
      'صرف پودے کھانے والے جانوروں کو کیا کہتے ہیں؟',
      'رڳو ٻوٽا کائڻ وارن جانورن کي ڇا چئبو آهي؟',
      ['herbivores', 'carnivores', 'omnivores', 'decomposers'],
      0,
      ['Herbivores feed only on plant material.', 'سبزی خور جانور صرف پودوں کی خوراک کھاتے ہیں۔', 'سبزي خور جانور رڳو ٻوٽن جي خوراڪ کائيندا آهن.']
    ),
    q(
      'Which organisms break down dead plants and animals?',
      'کون سے جاندار مردہ پودوں اور جانوروں کو تحلیل کرتے ہیں؟',
      'ڪهڙا جاندار مئل ٻوٽن ۽ جانورن کي تحليل ڪن ٿا؟',
      ['Decomposers', 'Producers', 'Herbivores', 'Carnivores'],
      0,
      ['Fungi and bacteria are decomposers that recycle nutrients.', 'پھپھوندی اور بیکٹیریا تحلیل کرنے والے ہیں جو غذائی اجزاء کو ری سائیکل کرتے ہیں۔', 'فنگس ۽ بيڪٽيريا تحليل ڪندڙ آهن جيڪي غذائي جزا ري سائيڪل ڪن ٿا.']
    ),
    q(
      'What is the largest level of ecological organisation?',
      'ماحولیاتی نظام کی سب سے بڑی سطح کیا ہے؟',
      'ماحولياتي نظام جي سڀ کان وڏي سطح ڇا آهي؟',
      ['Biosphere', 'Community', 'Population', 'Ecosystem'],
      0,
      ['The biosphere includes all ecosystems on Earth.', 'بایوسفیئر زمین کے تمام ماحولیاتی نظاموں کو شامل ہے۔', 'بايوسفيئر زمين جي سڀني ماحولياتي نظامن کي شامل آهي.']
    ),
    q(
      'A food chain always begins with ___.',
      'غذائی زنجیر ہمیشہ ___ سے شروع ہوتی ہے۔',
      'غذائي زنجير هميشه ___ کان شروع ٿئي ٿي.',
      ['energy from the Sun', 'a carnivore', 'a decomposer', 'a predator'],
      0,
      ['Sunlight is the original source of energy for most food chains.', 'سورج کی روشنی زیادہ تر غذائی زنجیروں کی اصل توانائی ہے۔', 'سج جي روشني اڪثر غذائي زنجيرن جي اصل توانائي آهي.']
    ),
  ]),

  ...meta(9, 'science', 'Light & Sound', [
    q(
      'In which medium does light travel fastest?',
      'روشنی کس واسطے میں سب سے تیز سفر کرتی ہے؟',
      'روشني ڪهڙي وسيلي ۾ سڀ کان تيز سفر ڪري ٿي؟',
      ['Vacuum', 'Water', 'Glass', 'Air'],
      0,
      ['Light travels fastest in a vacuum at about 300,000 km/s.', 'روشنی خلا میں سب سے تیز، تقریباً 300,000 کلومیٹر فی سیکنڈ سفر کرتی ہے۔', 'روشني خلا ۾ سڀ کان تيز، تقريباً 300,000 ڪلوميٽر في سيڪنڊ سفر ڪري ٿي.']
    ),
    q(
      'Sound cannot travel through ___.',
      'آواز ___ سے نہیں گزر سکتی۔',
      'آواز ___ مان نه ٿي گذري سگهي.',
      ['a vacuum', 'water', 'steel', 'air'],
      0,
      ['Sound needs a medium; it cannot travel through empty space.', 'آواز کو واسطہ درکار ہوتا ہے، خالی جگہ سے نہیں گزر سکتی۔', 'آواز کي وسيلو گهربل آهي، خالي جاءِ مان نه ٿي گذري سگهي.']
    ),
    q(
      'What is the unit of frequency?',
      'تعدد (frequency) کی اکائی کیا ہے؟',
      'تعدد (frequency) جي ايڪائي ڇا آهي؟',
      ['Hertz', 'Metre', 'Second', 'Decibel'],
      0,
      ['Frequency is measured in hertz (Hz), or cycles per second.', 'تعدد ہرٹز (Hz) یا فی سیکنڈ چکر میں ناپا جاتا ہے۔', 'تعدد هرٽز (Hz) يا في سيڪنڊ چڪر ۾ ماپيو ويندو آهي.']
    ),
    q(
      'Which mirror bulges outward and gives a wide view?',
      'کون سا آئینہ باہر کی طرف ابھرا ہوتا ہے اور وسیع منظر دیتا ہے؟',
      'ڪهڙو آئينو ٻاهر ڏانهن اُڀريل هوندو آهي ۽ ويڪرو نظارو ڏئي ٿو؟',
      ['Convex mirror', 'Concave mirror', 'Plane mirror', 'Flat mirror'],
      0,
      ['Convex mirrors are used in vehicle side mirrors for a wider field of view.', 'محدب آئینے گاڑیوں کے سائیڈ مرر میں وسیع منظر کے لیے استعمال ہوتے ہیں۔', 'محدب آئينا گاڏين جي سائيڊ مرر ۾ ويڪري نظر لاءِ استعمال ٿيندا آهن.']
    ),
    q(
      'Sound travels fastest through ___.',
      'آواز سب سے تیز ___ میں سفر کرتی ہے۔',
      'آواز سڀ کان تيز ___ ۾ سفر ڪري ٿي.',
      ['solids', 'liquids', 'gases', 'a vacuum'],
      0,
      ['Particles are closest together in solids, so sound travels fastest there.', 'ٹھوس میں ذرات سب سے قریب ہوتے ہیں، اس لیے آواز وہاں تیز چلتی ہے۔', 'ٺوس ۾ ذرڙا سڀ کان ويجها هوندا آهن، ان ڪري آواز اتي تيز هلندي آهي.']
    ),
  ]),

  ...meta(10, 'science', 'Genetics & Health', [
    q(
      'What are the units of heredity called?',
      'وراثت کی اکائیوں کو کیا کہتے ہیں؟',
      'وراثت جي ايڪائين کي ڇا چئبو آهي؟',
      ['Genes', 'Cells', 'Hormones', 'Enzymes'],
      0,
      ['Genes are sections of DNA that carry hereditary information.', 'جین DNA کے حصے ہیں جو وراثتی معلومات رکھتے ہیں۔', 'جين DNA جا حصا آهن جيڪي وراثتي معلومات رکن ٿا.']
    ),
    q(
      'DNA stands for ___.',
      'DNA کا مکمل نام کیا ہے؟',
      'DNA جو مڪمل نالو ڇا آهي؟',
      ['Deoxyribonucleic acid', 'Dinucleic acid', 'Deoxyribose nucleus', 'Double nucleic acid'],
      0,
      ['DNA is deoxyribonucleic acid, the molecule that stores genetic information.', 'DNA ڈی آکسی رائبو نیوکلئیک ایسڈ ہے جو جینیاتی معلومات محفوظ رکھتا ہے۔', 'DNA ڊي آڪسي رائبو نيويڪلئڪ اسيد آهي جيڪو جينياتي معلومات محفوظ رکي ٿو.']
    ),
    q(
      'A deficiency of vitamin C causes ___.',
      'وٹامن C کی کمی سے کون سی بیماری ہوتی ہے؟',
      'وٽامن C جي گهٽتائي سان ڪهڙي بيماري ٿئي ٿي؟',
      ['Scurvy', 'Rickets', 'Night blindness', 'Beriberi'],
      0,
      ['Scurvy is caused by a lack of vitamin C.', 'اسکروی وٹامن C کی کمی سے ہوتا ہے۔', 'اسڪروي وٽامن C جي گهٽتائي سان ٿئي ٿو.']
    ),
    q(
      'Which disease is spread by mosquitoes?',
      'کون سی بیماری مچھروں سے پھیلتی ہے؟',
      'ڪهڙي بيماري مڇرن کان پکڙي ٿي؟',
      ['Malaria', 'Typhoid', 'Tuberculosis', 'Cholera'],
      0,
      ['Malaria is caused by a parasite spread by female Anopheles mosquitoes.', 'ملیریا ایک طفیلی کی وجہ سے ہوتا ہے جو مادہ اینوفلیز مچھر پھیلاتی ہے۔', 'مليريا هڪ طفيلي سبب ٿئي ٿو جيڪو مادي اينوفليز مڇر پکيڙي ٿي.']
    ),
    q(
      'Which blood group is called the universal donor?',
      'کون سا بلڈ گروپ عالمگیر عطیہ دہندہ کہلاتا ہے؟',
      'ڪهڙو بلڊ گروپ عالمي عطيه ڏيندڙ چئبو آهي؟',
      ['O negative', 'AB positive', 'A positive', 'B negative'],
      0,
      ['O negative blood can be given to patients of any blood group.', 'O منفی خون کسی بھی بلڈ گروپ کے مریض کو دیا جا سکتا ہے۔', 'O منفي رت ڪنهن به بلڊ گروپ جي مريض کي ڏئي سگهجي ٿو.']
    ),
  ]),

  ...meta(10, 'science', 'Electricity & Magnetism', [
    q(
      'What is the SI unit of electric current?',
      'برقی رو کی SI اکائی کیا ہے؟',
      'برقي رو جي SI ايڪائي ڇا آهي؟',
      ['Ampere', 'Volt', 'Ohm', 'Watt'],
      0,
      ['Current is measured in amperes (A).', 'رو کو ایمپیئر (A) میں ناپا جاتا ہے۔', 'رو کي ايمپيئر (A) ۾ ماپيو ويندو آهي.']
    ),
    q(
      'Which instrument measures electric current?',
      'کون سا آلہ برقی رو ناپتا ہے؟',
      'ڪهڙو اوزار برقي رو ماپي ٿو؟',
      ['Ammeter', 'Voltmeter', 'Thermometer', 'Barometer'],
      0,
      ['An ammeter measures current and is connected in series.', 'ایمیٹر رو ناپتا ہے اور سیریز میں جوڑا جاتا ہے۔', 'ايمٽر رو ماپي ٿو ۽ سيريز ۾ ڳنڍيو ويندو آهي.']
    ),
    q(
      'Ohm’s law is written as ___.',
      'اوہم کا قانون کس طرح لکھا جاتا ہے؟',
      'اوهم جو قانون ڪيئن لکيو ويندو آهي؟',
      ['V = IR', 'V = I/R', 'I = VR', 'R = VI'],
      0,
      ['Voltage equals current multiplied by resistance: V = IR.', 'وولٹیج رو ضرب مزاحمت کے برابر ہے: V = IR۔', 'وولٽيج رو ضرب مزاحمت جي برابر آهي: V = IR.']
    ),
    q(
      'Which material allows electricity to pass through it easily?',
      'کون سا مادہ بجلی کو آسانی سے گزرنے دیتا ہے؟',
      'ڪهڙو مادو بجلي کي آساني سان لنگهڻ ڏئي ٿو؟',
      ['Copper', 'Rubber', 'Glass', 'Plastic'],
      0,
      ['Copper is a good conductor; rubber, glass and plastic are insulators.', 'تانبا اچھا موصل ہے، ربڑ، شیشہ اور پلاسٹک غیر موصل ہیں۔', 'ٽامو سٺو موصل آهي، رٻڙ، شيشو ۽ پلاسٽڪ غير موصل آهن.']
    ),
    q(
      'What happens when two like magnetic poles are brought together?',
      'دو یکساں مقناطیسی قطب قریب لائے جائیں تو کیا ہوتا ہے؟',
      'ٻه هڪجهڙا مقناطيسي قطب ويجها آڻجن ته ڇا ٿيندو؟',
      ['They repel each other', 'They attract each other', 'They become neutral', 'They lose magnetism'],
      0,
      ['Like poles repel and opposite poles attract.', 'یکساں قطب ایک دوسرے کو دھکیلتے ہیں اور مخالف قطب کشش کرتے ہیں۔', 'هڪجهڙا قطب هڪ ٻئي کي ڌڪين ٿا ۽ مخالف قطب ڇڪين ٿا.']
    ),
  ]),
];
