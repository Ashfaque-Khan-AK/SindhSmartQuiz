import { meta, q } from './helpers.js';

export const gkQuestions = [
  ...meta(6, 'generalKnowledge', 'Pakistan & Sindh', [
    q(
      'What is the capital of Pakistan?',
      'پاکستان کا دارالحکومت کیا ہے؟',
      'پاڪستان جو گاديءَ جو هنڌ ڇا آهي؟',
      ['Islamabad', 'Karachi', 'Lahore', 'Peshawar'],
      0,
      ['Islamabad has been the capital of Pakistan since 1960.', 'اسلام آباد 1960 سے پاکستان کا دارالحکومت ہے۔', 'اسلام آباد 1960ع کان پاڪستان جو گاديءَ جو هنڌ آهي.']
    ),
    q(
      'Which is the largest city of Pakistan by population?',
      'آبادی کے لحاظ سے پاکستان کا سب سے بڑا شہر کون سا ہے؟',
      'آباديءَ جي لحاظ کان پاڪستان جو سڀ کان وڏو شهر ڪهڙو آهي؟',
      ['Karachi', 'Lahore', 'Islamabad', 'Multan'],
      0,
      ['Karachi is Pakistan’s largest city and main port.', 'کراچی پاکستان کا سب سے بڑا شہر اور اہم بندرگاہ ہے۔', 'ڪراچي پاڪستان جو سڀ کان وڏو شهر ۽ اهم بندرگاهه آهي.']
    ),
    q(
      'What is the national language of Pakistan?',
      'پاکستان کی قومی زبان کون سی ہے؟',
      'پاڪستان جي قومي ٻولي ڪهڙي آهي؟',
      ['Urdu', 'Sindhi', 'Punjabi', 'English'],
      0,
      ['Urdu is the national language of Pakistan.', 'اردو پاکستان کی قومی زبان ہے۔', 'اردو پاڪستان جي قومي ٻولي آهي.']
    ),
    q(
      'How many provinces does Pakistan have?',
      'پاکستان میں کتنے صوبے ہیں؟',
      'پاڪستان ۾ ڪيترا صوبا آهن؟',
      ['4', '5', '3', '6'],
      0,
      ['Pakistan has four provinces: Sindh, Punjab, Balochistan and Khyber Pakhtunkhwa.', 'پاکستان کے چار صوبے ہیں: سندھ، پنجاب، بلوچستان اور خیبر پختونخوا۔', 'پاڪستان جا چار صوبا آهن: سنڌ، پنجاب، بلوچستان ۽ خيبر پختونخوا.']
    ),
    q(
      'What is the national animal of Pakistan?',
      'پاکستان کا قومی جانور کون سا ہے؟',
      'پاڪستان جو قومي جانور ڪهڙو آهي؟',
      ['Markhor', 'Snow leopard', 'Deer', 'Camel'],
      0,
      ['The Markhor is the national animal of Pakistan.', 'مارخور پاکستان کا قومی جانور ہے۔', 'مارخور پاڪستان جو قومي جانور آهي.']
    ),
  ]),

  ...meta(6, 'generalKnowledge', 'World Around Us', [
    q(
      'How many days are there in a leap year?',
      'لیپ سال میں کتنے دن ہوتے ہیں؟',
      'ليپ سال ۾ ڪيترا ڏينهن هوندا آهن؟',
      ['366', '365', '364', '367'],
      0,
      ['A leap year has 366 days because February has 29 days.', 'لیپ سال میں 366 دن ہوتے ہیں کیونکہ فروری میں 29 دن ہوتے ہیں۔', 'ليپ سال ۾ 366 ڏينهن هوندا آهن ڇو ته فيبروري ۾ 29 ڏينهن هوندا آهن.']
    ),
    q(
      'Which is the largest ocean on Earth?',
      'زمین پر سب سے بڑا سمندر کون سا ہے؟',
      'زمين تي سڀ کان وڏو سمنڊ ڪهڙو آهي؟',
      ['Pacific Ocean', 'Atlantic Ocean', 'Indian Ocean', 'Arctic Ocean'],
      0,
      ['The Pacific Ocean is the largest and deepest ocean.', 'بحرالکاہل سب سے بڑا اور گہرا سمندر ہے۔', 'پيسفڪ سمنڊ سڀ کان وڏو ۽ اونهو سمنڊ آهي.']
    ),
    q(
      'Which planet is known as the Red Planet?',
      'کون سا سیارہ سرخ سیارہ کہلاتا ہے؟',
      'ڪهڙو سيارو ڳاڙهو سيارو سڏجي ٿو؟',
      ['Mars', 'Venus', 'Jupiter', 'Saturn'],
      0,
      ['Mars appears red because of iron oxide on its surface.', 'مریخ اپنی سطح پر آئرن آکسائیڈ کی وجہ سے سرخ دکھائی دیتا ہے۔', 'مريخ پنهنجي مٿاڇري تي آئرن آڪسائيڊ سبب ڳاڙهو نظر اچي ٿو.']
    ),
    q(
      'How many continents are there on Earth?',
      'زمین پر کتنے براعظم ہیں؟',
      'زمين تي ڪيترا کنڊ آهن؟',
      ['7', '6', '5', '8'],
      0,
      ['There are seven continents: Asia, Africa, North America, South America, Antarctica, Europe and Australia.', 'سات براعظم ہیں: ایشیا، افریقہ، شمالی امریکہ، جنوبی امریکہ، انٹارکٹیکا، یورپ اور آسٹریلیا۔', 'ست کنڊ آهن: ايشيا، آفريڪا، اتر آمريڪا، ڏکڻ آمريڪا، انٽارڪٽيڪا، يورپ ۽ آسٽريليا.']
    ),
    q(
      'What is the capital of Saudi Arabia?',
      'سعودی عرب کا دارالحکومت کیا ہے؟',
      'سعودي عرب جو گاديءَ جو هنڌ ڇا آهي؟',
      ['Riyadh', 'Jeddah', 'Mecca', 'Dubai'],
      0,
      ['Riyadh is the capital city of Saudi Arabia.', 'ریاض سعودی عرب کا دارالحکومت ہے۔', 'رياض سعودي عرب جو گاديءَ جو هنڌ آهي.']
    ),
  ]),

  ...meta(7, 'generalKnowledge', 'Pakistan & Sindh', [
    q(
      'What is the national flower of Pakistan?',
      'پاکستان کا قومی پھول کون سا ہے؟',
      'پاڪستان جو قومي گل ڪهڙو آهي؟',
      ['Jasmine', 'Rose', 'Tulip', 'Sunflower'],
      0,
      ['The jasmine (chambeli) is the national flower of Pakistan.', 'چنبیلی پاکستان کا قومی پھول ہے۔', 'چنبيلي پاڪستان جو قومي گل آهي.']
    ),
    q(
      'Which is the longest river of Pakistan?',
      'پاکستان کا سب سے طویل دریا کون سا ہے؟',
      'پاڪستان جو سڀ کان ڊگهو درياهه ڪهڙو آهي؟',
      ['Indus River', 'Jhelum River', 'Chenab River', 'Ravi River'],
      0,
      ['The Indus River is the longest river in Pakistan.', 'دریائے سندھ پاکستان کا سب سے طویل دریا ہے۔', 'سنڌو درياهه پاڪستان جو سڀ کان ڊگهو درياهه آهي.']
    ),
    q(
      'Lahore is the capital of which province?',
      'لاہور کس صوبے کا دارالحکومت ہے؟',
      'لاهور ڪهڙي صوبي جو گاديءَ جو هنڌ آهي؟',
      ['Punjab', 'Sindh', 'Balochistan', 'Khyber Pakhtunkhwa'],
      0,
      ['Lahore is the capital of Punjab province.', 'لاہور صوبہ پنجاب کا دارالحکومت ہے۔', 'لاهور صوبي پنجاب جو گاديءَ جو هنڌ آهي.']
    ),
    q(
      'Who is known as Quaid-e-Azam?',
      'قائد اعظم کس کو کہا جاتا ہے؟',
      'قائد اعظم ڪنهن کي چئبو آهي؟',
      ['Muhammad Ali Jinnah', 'Allama Iqbal', 'Liaquat Ali Khan', 'Sindhi leaders'],
      0,
      ['Muhammad Ali Jinnah is the founder of Pakistan and is called Quaid-e-Azam.', 'محمد علی جناح پاکستان کے بانی اور قائد اعظم ہیں۔', 'محمد علي جناح پاڪستان جو باني ۽ قائد اعظم آهي.']
    ),
    q(
      'Which is the highest mountain in Pakistan?',
      'پاکستان کی بلند ترین چوٹی کون سی ہے؟',
      'پاڪستان جي سڀ کان بلند چوٽي ڪهڙي آهي؟',
      ['K2', 'Nanga Parbat', 'Rakaposhi', 'Tirich Mir'],
      0,
      ['K2 (8,611 m) is the highest mountain in Pakistan.', 'کے ٹو (8,611 میٹر) پاکستان کی بلند ترین چوٹی ہے۔', 'K2 (8,611 ميٽر) پاڪستان جي سڀ کان بلند چوٽي آهي.']
    ),
  ]),

  ...meta(7, 'generalKnowledge', 'World Around Us', [
    q(
      'Which is the largest hot desert in the world?',
      'دنیا کا سب سے بڑا گرم صحرا کون سا ہے؟',
      'دنيا جو سڀ کان وڏو گرم ريگستان ڪهڙو آهي؟',
      ['Sahara', 'Gobi', 'Thar', 'Arabian Desert'],
      0,
      ['The Sahara in Africa is the largest hot desert.', 'افریقہ کا صحارا سب سے بڑا گرم صحرا ہے۔', 'آفريڪا جو صحارا سڀ کان وڏو گرم ريگستان آهي.']
    ),
    q(
      'What is the currency of Japan?',
      'جاپان کی کرنسی کیا ہے؟',
      'جاپان جي ڪرنسي ڇا آهي؟',
      ['Yen', 'Won', 'Yuan', 'Ringgit'],
      0,
      ['The Japanese yen is the currency of Japan.', 'جاپانی ین جاپان کی کرنسی ہے۔', 'جاپاني ين جاپان جي ڪرنسي آهي.']
    ),
    q(
      'Which country gifted the Statue of Liberty to the United States?',
      'مجسمہ آزادی امریکہ کو کس ملک نے تحفے میں دیا؟',
      'آزاديءَ جو مجسمو آمريڪا کي ڪهڙي ملڪ تحفي ۾ ڏنو؟',
      ['France', 'Britain', 'Spain', 'Italy'],
      0,
      ['France gifted the Statue of Liberty in 1886.', 'فرانس نے 1886 میں مجسمہ آزادی تحفے میں دیا۔', 'فرانس 1886ع ۾ آزاديءَ جو مجسمو تحفي ۾ ڏنو.']
    ),
    q(
      'Which river flows through Egypt?',
      'کون سا دریا مصر سے گزرتا ہے؟',
      'ڪهڙو درياهه مصر مان لنگهي ٿو؟',
      ['Nile', 'Amazon', 'Danube', 'Ganges'],
      0,
      ['The Nile flows through Egypt and is vital to its agriculture.', 'نیل مصر سے گزرتا ہے اور اس کی زراعت کے لیے اہم ہے۔', 'نيل مصر مان لنگهي ٿو ۽ ان جي زراعت لاءِ اهم آهي.']
    ),
    q(
      'How many hours are there in two days?',
      'دو دن میں کتنے گھنٹے ہوتے ہیں؟',
      'ٻن ڏينهن ۾ ڪيترا ڪلاڪ هوندا آهن؟',
      ['48', '24', '36', '60'],
      0,
      ['One day has 24 hours, so two days have 48 hours.', 'ایک دن میں 24 گھنٹے ہوتے ہیں، اس لیے دو دن میں 48 گھنٹے ہیں۔', 'هڪ ڏينهن ۾ 24 ڪلاڪ هوندا آهن، ان ڪري ٻن ڏينهن ۾ 48 ڪلاڪ آهن.']
    ),
  ]),

  ...meta(8, 'generalKnowledge', 'Pakistan & Sindh', [
    q(
      'What is the capital of Sindh?',
      'سندھ کا دارالحکومت کیا ہے؟',
      'سنڌ جو گاديءَ جو هنڌ ڇا آهي؟',
      ['Karachi', 'Hyderabad', 'Sukkur', 'Larkana'],
      0,
      ['Karachi is the capital of Sindh province.', 'کراچی صوبہ سندھ کا دارالحکومت ہے۔', 'ڪراچی صوبي سنڌ جو گاديءَ جو هنڌ آهي.']
    ),
    q(
      'Mohenjo-daro is located in which district?',
      'موئن جو دڑو کس ضلعے میں واقع ہے؟',
      'موئن جو دڙو ڪهڙي ضلعي ۾ واقع آهي؟',
      ['Larkana', 'Karachi', 'Thatta', 'Sukkur'],
      0,
      ['Mohenjo-daro is an ancient Indus Valley site in Larkana district.', 'موئن جو دڑو ضلع لاڑکانہ میں واقع وادی سندھ کا قدیم مقام ہے۔', 'موئن جو دڙو ضلعي لاڙڪاڻي ۾ واقع وادي سنڌ جو قديم ماڳ آهي.']
    ),
    q(
      'What is the national sport of Pakistan?',
      'پاکستان کا قومی کھیل کون سا ہے؟',
      'پاڪستان جو قومي راند ڪهڙي آهي؟',
      ['Hockey', 'Cricket', 'Football', 'Squash'],
      0,
      ['Field hockey is the national sport of Pakistan.', 'ہاکی پاکستان کا قومی کھیل ہے۔', 'هڪي پاڪستان جي قومي راند آهي.']
    ),
    q(
      'In which year did Pakistan gain independence?',
      'پاکستان کس سال آزاد ہوا؟',
      'پاڪستان ڪهڙي سال آزادي حاصل ڪئي؟',
      ['1947', '1946', '1948', '1950'],
      0,
      ['Pakistan became independent on 14 August 1947.', 'پاکستان 14 اگست 1947 کو آزاد ہوا۔', 'پاڪستان 14 آگسٽ 1947ع تي آزاد ٿيو.']
    ),
    q(
      'The Thar Desert mainly lies in which province?',
      'صحرائے تھر بنیادی طور پر کس صوبے میں ہے؟',
      'ٿر جو ريگستان بنيادي طور ڪهڙي صوبي ۾ آهي؟',
      ['Sindh', 'Punjab', 'Balochistan', 'Khyber Pakhtunkhwa'],
      0,
      ['The Thar Desert lies in southeastern Sindh.', 'صحرائے تھر جنوب مشرقی سندھ میں واقع ہے۔', 'ٿر جو ريگستان ڏکڻ اوڀر سنڌ ۾ واقع آهي.']
    ),
  ]),

  ...meta(8, 'generalKnowledge', 'World Around Us', [
    q(
      'Which is the largest country in the world by area?',
      'رقبے کے لحاظ سے دنیا کا سب سے بڑا ملک کون سا ہے؟',
      'رقبي جي لحاظ کان دنيا جو سڀ کان وڏو ملڪ ڪهڙو آهي؟',
      ['Russia', 'Canada', 'China', 'United States'],
      0,
      ['Russia is the largest country by land area.', 'رقبے کے لحاظ سے روس سب سے بڑا ملک ہے۔', 'رقبي جي لحاظ کان روس سڀ کان وڏو ملڪ آهي.']
    ),
    q(
      'Where is the headquarters of the United Nations?',
      'اقوام متحدہ کا صدر دفتر کہاں ہے؟',
      'گڏيل قومن جو مرڪزي دفتر ڪٿي آهي؟',
      ['New York', 'Geneva', 'Paris', 'London'],
      0,
      ['The UN headquarters is in New York City.', 'اقوام متحدہ کا صدر دفتر نیویارک میں ہے۔', 'گڏيل قومن جو مرڪزي دفتر نيو يارڪ ۾ آهي.']
    ),
    q(
      'Which sea lies to the south of Pakistan?',
      'پاکستان کے جنوب میں کون سا سمندر ہے؟',
      'پاڪستان جي ڏکڻ ۾ ڪهڙو سمنڊ آهي؟',
      ['Arabian Sea', 'Red Sea', 'Caspian Sea', 'Mediterranean Sea'],
      0,
      ['The Arabian Sea borders Pakistan to the south.', 'بحیرہ عرب جنوب میں پاکستان کی سرحد سے ملتا ہے۔', 'عرب سمنڊ ڏکڻ ۾ پاڪستان جي سرحد سان لڳي ٿو.']
    ),
    q(
      'What is the currency of the United Kingdom?',
      'برطانیہ کی کرنسی کیا ہے؟',
      'برطانيا جي ڪرنسي ڇا آهي؟',
      ['Pound sterling', 'Euro', 'Dollar', 'Franc'],
      0,
      ['The UK uses the pound sterling.', 'برطانیہ پاؤنڈ اسٹرلنگ استعمال کرتا ہے۔', 'برطانيا پائونڊ اسٽرلنگ استعمال ڪري ٿو.']
    ),
    q(
      'Which is the largest mammal in the world?',
      'دنیا کا سب سے بڑا ممالیہ کون سا ہے؟',
      'دنيا جو سڀ کان وڏو مماليه ڪهڙو آهي؟',
      ['Blue whale', 'Elephant', 'Giraffe', 'Hippopotamus'],
      0,
      ['The blue whale is the largest mammal and the largest animal.', 'نیلی وہیل سب سے بڑا ممالیہ اور سب سے بڑا جانور ہے۔', 'نيري وهيل سڀ کان وڏي مماليه ۽ سڀ کان وڏو جانور آهي.']
    ),
  ]),

  ...meta(9, 'generalKnowledge', 'Pakistan & Sindh', [
    q(
      'Kotri Barrage is built on which river?',
      'کوٹری بیراج کس دریا پر بنایا گیا ہے؟',
      'ڪوٽڙي بيراج ڪهڙي درياهه تي ٺاهيو ويو آهي؟',
      ['Indus River', 'Jhelum River', 'Ravi River', 'Chenab River'],
      0,
      ['Kotri Barrage is on the Indus River near Hyderabad.', 'کوٹری بیراج حیدرآباد کے قریب دریائے سندھ پر ہے۔', 'ڪوٽڙي بيراج حيدرآباد جي ويجهو سنڌو درياهه تي آهي.']
    ),
    q(
      'What is the national tree of Pakistan?',
      'پاکستان کا قومی درخت کون سا ہے؟',
      'پاڪستان جو قومي وڻ ڪهڙو آهي؟',
      ['Deodar', 'Neem', 'Banyan', 'Date palm'],
      0,
      ['The deodar cedar is the national tree of Pakistan.', 'دیودار پاکستان کا قومی درخت ہے۔', 'ديودار پاڪستان جو قومي وڻ آهي.']
    ),
    q(
      'Who was the first Governor-General of Pakistan?',
      'پاکستان کے پہلے گورنر جنرل کون تھے؟',
      'پاڪستان جو پهريون گورنر جنرل ڪير هو؟',
      ['Muhammad Ali Jinnah', 'Liaquat Ali Khan', 'Iskander Mirza', 'Ayub Khan'],
      0,
      ['Quaid-e-Azam Muhammad Ali Jinnah was the first Governor-General.', 'قائد اعظم محمد علی جناح پہلے گورنر جنرل تھے۔', 'قائد اعظم محمد علي جناح پهريون گورنر جنرل هو.']
    ),
    q(
      'Kirthar National Park is located in which province?',
      'کیرتھر نیشنل پارک کس صوبے میں واقع ہے؟',
      'ڪيرٿر نيشنل پارڪ ڪهڙي صوبي ۾ واقع آهي؟',
      ['Sindh', 'Punjab', 'Balochistan', 'Khyber Pakhtunkhwa'],
      0,
      ['Kirthar National Park is in Sindh, west of the Indus.', 'کیرتھر نیشنل پارک سندھ میں دریائے سندھ کے مغرب میں ہے۔', 'ڪيرٿر نيشنل پارڪ سنڌ ۾ سنڌو درياهه جي اولهه ۾ آهي.']
    ),
    q(
      'Which city is known as the city of gardens in Sindh?',
      'سندھ میں باغوں کا شہر کسے کہا جاتا ہے؟',
      'سنڌ ۾ باغن جو شهر ڪنهن کي چئبو آهي؟',
      ['Hyderabad', 'Karachi', 'Sukkur', 'Thatta'],
      0,
      ['Hyderabad is traditionally called the city of gardens.', 'حیدرآباد روایتی طور پر باغوں کا شہر کہلاتا ہے۔', 'حيدرآباد روايتي طور باغن جو شهر سڏجي ٿو.']
    ),
  ]),

  ...meta(9, 'generalKnowledge', 'World Around Us', [
    q(
      'Which is the smallest country in the world by area?',
      'رقبے کے لحاظ سے دنیا کا سب سے چھوٹا ملک کون سا ہے؟',
      'رقبي جي لحاظ کان دنيا جو سڀ کان ننڍو ملڪ ڪهڙو آهي؟',
      ['Vatican City', 'Monaco', 'Nauru', 'Maldives'],
      0,
      ['Vatican City is the smallest sovereign state.', 'ویٹی کن سٹی سب سے چھوٹی خودمختار ریاست ہے۔', 'ويٽيڪن سٽي سڀ کان ننڍي خودمختيار رياست آهي.']
    ),
    q(
      'Egypt is located on which continent?',
      'مصر کس براعظم میں واقع ہے؟',
      'مصر ڪهڙي کنڊ ۾ واقع آهي؟',
      ['Africa', 'Asia', 'Europe', 'Australia'],
      0,
      ['Egypt lies mainly in northeastern Africa.', 'مصر بنیادی طور پر شمال مشرقی افریقہ میں ہے۔', 'مصر بنيادي طور اتر اوڀر آفريڪا ۾ آهي.']
    ),
    q(
      'Who wrote the play "Romeo and Juliet"?',
      '"رومیو اینڈ جولیٹ" کس نے لکھا؟',
      '"روميو ۽ جوليت" ڪنهن لکيو؟',
      ['William Shakespeare', 'Charles Dickens', 'Jane Austen', 'John Milton'],
      0,
      ['William Shakespeare wrote Romeo and Juliet.', 'ولیم شیکسپیئر نے رومیو اینڈ جولیٹ لکھا۔', 'وليم شيڪسپيئر روميو ۽ جوليت لکيو.']
    ),
    q(
      'Which is the largest planet in our solar system?',
      'ہمارے نظام شمسی کا سب سے بڑا سیارہ کون سا ہے؟',
      'اسان جي شمسي نظام جو سڀ کان وڏو سيارو ڪهڙو آهي؟',
      ['Jupiter', 'Saturn', 'Neptune', 'Earth'],
      0,
      ['Jupiter is the largest planet in the solar system.', 'مشتری نظام شمسی کا سب سے بڑا سیارہ ہے۔', 'مشتري شمسي نظام جو سڀ کان وڏو سيارو آهي.']
    ),
    q(
      'In how many fields are Nobel Prizes awarded?',
      'نوبل انعام کتنے شعبوں میں دیا جاتا ہے؟',
      'نوبل انعام ڪيترن شعبن ۾ ڏنو ويندو آهي؟',
      ['6', '5', '4', '7'],
      0,
      ['Nobel Prizes are awarded in six fields, including peace and literature.', 'نوبل انعام چھ شعبوں میں دیا جاتا ہے، جن میں امن اور ادب شامل ہیں۔', 'نوبل انعام ڇهن شعبن ۾ ڏنو ويندو آهي، جن ۾ امن ۽ ادب شامل آهن.']
    ),
  ]),

  ...meta(10, 'generalKnowledge', 'Pakistan & Sindh', [
    q(
      'In which year was the Constitution of Pakistan adopted?',
      'پاکستان کا آئین کس سال منظور ہوا؟',
      'پاڪستان جو آئين ڪهڙي سال منظور ٿيو؟',
      ['1973', '1962', '1956', '1985'],
      0,
      ['The present Constitution of Pakistan was adopted in 1973.', 'پاکستان کا موجودہ آئین 1973 میں منظور ہوا۔', 'پاڪستان جو موجوده آئين 1973ع ۾ منظور ٿيو.']
    ),
    q(
      'The Khyber Pass connects Pakistan with which country?',
      'خیبر درہ پاکستان کو کس ملک سے جوڑتا ہے؟',
      'خيبر درو پاڪستان کي ڪهڙي ملڪ سان ڳنڍي ٿو؟',
      ['Afghanistan', 'India', 'Iran', 'China'],
      0,
      ['The Khyber Pass links Pakistan and Afghanistan.', 'خیبر درہ پاکستان اور افغانستان کو ملاتا ہے۔', 'خيبر درو پاڪستان ۽ افغانستان کي ملائي ٿو.']
    ),
    q(
      'Port Qasim is located in which city?',
      'بندرگاہ قاسم کس شہر میں واقع ہے؟',
      'بندرگاهه قاسم ڪهڙي شهر ۾ واقع آهي؟',
      ['Karachi', 'Gwadar', 'Hyderabad', 'Thatta'],
      0,
      ['Port Qasim is an industrial port in Karachi.', 'بندرگاہ قاسم کراچی میں ایک صنعتی بندرگاہ ہے۔', 'بندرگاهه قاسم ڪراچي ۾ هڪ صنعتي بندرگاهه آهي.']
    ),
    q(
      'What is the national fruit of Pakistan?',
      'پاکستان کا قومی پھل کون سا ہے؟',
      'پاڪستان جو قومي ميوو ڪهڙو آهي؟',
      ['Mango', 'Apple', 'Banana', 'Orange'],
      0,
      ['The mango is the national fruit of Pakistan.', 'آم پاکستان کا قومی پھل ہے۔', 'انب پاڪستان جو قومي ميوو آهي.']
    ),
    q(
      'Which pass connects Pakistan with China?',
      'کون سا درہ پاکستان کو چین سے جوڑتا ہے؟',
      'ڪهڙو درو پاڪستان کي چين سان ڳنڍي ٿو؟',
      ['Khunjerab Pass', 'Khyber Pass', 'Bolan Pass', 'Gomal Pass'],
      0,
      ['The Khunjerab Pass links Pakistan and China on the Karakoram Highway.', 'خنجراب درہ قراقرم ہائی وے پر پاکستان اور چین کو ملاتا ہے۔', 'خنجراب درو قراقرم هاءِ وي تي پاڪستان ۽ چين کي ملائي ٿو.']
    ),
  ]),

  ...meta(10, 'generalKnowledge', 'World Around Us', [
    q(
      'Which organisation works for the rights and welfare of children?',
      'کون سی تنظیم بچوں کے حقوق اور بہبود کے لیے کام کرتی ہے؟',
      'ڪهڙي تنظيم ٻارن جي حقن ۽ ڀلائيءَ لاءِ ڪم ڪري ٿي؟',
      ['UNICEF', 'WHO', 'UNESCO', 'IMF'],
      0,
      ['UNICEF is the United Nations agency for children.', 'یونیسف اقوام متحدہ کا بچوں کی بہبود کا ادارہ ہے۔', 'يونيسف گڏيل قومن جي ٻارن جي ڀلائيءَ جو ادارو آهي.']
    ),
    q(
      'Where is the headquarters of the World Health Organization?',
      'عالمی ادارہ صحت کا صدر دفتر کہاں ہے؟',
      'عالمي ادارو صحت جو مرڪزي دفتر ڪٿي آهي؟',
      ['Geneva', 'New York', 'Vienna', 'Rome'],
      0,
      ['The WHO headquarters is in Geneva, Switzerland.', 'ڈبلیو ایچ او کا صدر دفتر جنیوا، سوئٹزرلینڈ میں ہے۔', 'ڊبليو ايڇ او جو مرڪزي دفتر جنيوا، سوئٽزرلينڊ ۾ آهي.']
    ),
    q(
      'The Great Wall is located in which country?',
      'دیوارِ چین کس ملک میں واقع ہے؟',
      'ديوار چين ڪهڙي ملڪ ۾ واقع آهي؟',
      ['China', 'Japan', 'India', 'Mongolia'],
      0,
      ['The Great Wall of China is a historic fortification in China.', 'دیوارِ چین چین میں ایک تاریخی قلعہ بندی ہے۔', 'ديوار چين چين ۾ هڪ تاريخي قلعو بندي آهي.']
    ),
    q(
      'Which is the fastest land animal?',
      'زمین پر سب سے تیز جانور کون سا ہے؟',
      'زمين تي سڀ کان تيز جانور ڪهڙو آهي؟',
      ['Cheetah', 'Lion', 'Horse', 'Gazelle'],
      0,
      ['The cheetah can run at about 100 km/h.', 'چیتا تقریباً 100 کلومیٹر فی گھنٹہ دوڑ سکتا ہے۔', 'چيتو تقريباً 100 ڪلوميٽر في ڪلاڪ ڊوڙي سگهي ٿو.']
    ),
    q(
      'How many members are there in the UN Security Council?',
      'اقوام متحدہ کی سلامتی کونسل کے کتنے ارکان ہیں؟',
      'گڏيل قومن جي سلامتي ڪائونسل جا ڪيترا ميمبر آهن؟',
      ['15', '10', '5', '20'],
      0,
      ['The Security Council has 15 members: 5 permanent and 10 elected.', 'سلامتی کونسل کے 15 ارکان ہیں: 5 مستقل اور 10 منتخب۔', 'سلامتي ڪائونسل جا 15 ميمبر آهن: 5 مستقل ۽ 10 چونڊيل.']
    ),
  ]),
];
