import React from 'react';
// Importing a variety of icons
import { 
  FaPrayingHands, 
  FaOm, 
  FaGift, 
  FaStar, 
  FaBriefcase, 
  FaGraduationCap, 
  FaHeartbeat, 
  FaPlaneDeparture, 
  FaUserFriends,
  FaHandHoldingUsd 
} from 'react-icons/fa';
import { GiCrystalBall, GiLoveMystery } from 'react-icons/gi';

// Data for the top bar
export const premiumServicesData = [
  { title: 'Live Pooja', icon: <FaPrayingHands />, link: '/pooja' },
  { title: 'Astrologers', icon:<FaOm />, link: '/astro-connect' },
];

// Data for the main grid with bilingual descriptions
export const complimentaryServicesData = [
  { 
    title: 'Finance', 
    icon: <FaHandHoldingUsd />, 
    description: {
      en: 'Are you facing financial problems? After years of hard work, does your standard of living seem very ordinary? Many times it has been seen that even when the financial condition is very good, the accumulated capital is being wasted in court cases, hospitals, etc. in such a way that controlling expenses has become a challenge. You can get the solution to such problems from our astrologers.',
      hi: 'क्या आप धन संबंधित समस्याओं का सामना कर रहे हैं। वर्षों मेहनत करने के पश्चात भी जीवन स्तर बहुत ही सामान्य सा लगता है। कई बार ऐसा भी देखा गया है, धन की स्थिति बहुत अच्छी होने पर भी जमा पूंजी कोर्ट कचहरी हॉस्पिटल इत्यादि में इस कदर बर्बाद हो रही है। मानो खर्चों पर नियंत्रण करना एक चुनौती बन गई हो। इस प्रकार की समस्याओं का समाधान आप हमारे ज्योतिर्विद आचार्यों द्वारा प्राप्त कर सकते हैं।'
    },
    link: '/horoscope' 
  },
  { 
    title: 'Love', 
    icon: <GiLoveMystery />, 
    description: {
      en: 'As soon as the love yoga is formed in the horoscope, we definitely find a lover who seems favorable to us in all respects. There is no dispute or fear in such relationships. This relationship is very strong on the foundation of honesty. But even without love yoga, love relationships have been seen to be formed. Sadness, suffering, and fear are seen in such relationships. Are you not sad and disappointed with your lover, is there a situation like frequent breakups in your relationship? You can get complete information and solutions of this type.',
      hi: 'जन्म पत्री में प्रेम योग बनते ही हमें कोई ऐसा प्रेमी जरूर मिलता है,जो सभी प्रकार से हमारे अनुकूल नजर आता है। ऐसे रिश्तों में विवाद व भय नहीं होता। ईमानदारी की नींव पर यह रिश्ता बहुत मजबूत होता है। किंतु बिना प्रेम योग के भी प्रेम संबंध बनते देखे गए हैं। ऐसे रिश्तों में दुख,कष्ट, व डर दिखाई देता है।कहीं आप अपने प्रेमी से दुखी व निराश तो नहीं, क्या आपके रिलेशनशिप में बार-बार ब्रेकअप जैसी स्थिति तो नहीं बन रही है।इस प्रकार की संपूर्ण जानकारी व समाधान प्राप्त कर सकते हैं।'
    },
    link: '/compatibility' 
  },
  { 
    title: 'Marriage', 
    icon: <FaUserFriends />,
    description: {
      en: 'Marriage in marriage yoga - the condition of married life is better. Even if there are many ups and downs in married life due to other planetary positions, a situation like divorce does not arise. If there is no marriage yoga - many types of obstacles in marriage, the married life becomes chaotic after marriage, or there is a great lack of marital happiness, such problems have been seen. Make married life happy and prosperous by getting complete information about the obstructing planets.',
      hi: 'विवाह योग- में विवाह होने पर वैवाहिक जीवन की स्थिति बेहतर होती है।यदि अन्य ग्रह स्थिति के कारण वैवाहिक जीवन में अत्यधिक उतार-चढ़ाव ही क्यों ना आ जाए,तलाक जैसी स्थिति नहीं बनती। विवाह योग न होने पर- विवाह में अनेक प्रकार की बाधाओं का आना,विवाह के पश्चात वैवाहिक जीवन का अस्त-व्यस्त हो जाना, अथवा वैवाहिक सुख में अत्यधिक कमी इस प्रकार की समस्याएं देखी गई है। बाधक ग्रहों की संपूर्ण जानकारी प्राप्त करके वैवाहिक जीवन को सुखी एवं समृद्ध बनाएं।'
    }, 
    link: '/kundli' 
  },
  { 
    title: 'Health', 
    icon: <FaHeartbeat />, 
    description: {
      en: 'Generally, all the planets have a role in the side effects on health. Mostly they cause common health problems. But many times, due to the inauspicious Shadashtak yoga formed by the dasha-antardasha of the planets, the possibility of serious and incurable diseases increases. Which cannot be cured. If you have excessive health related problems in your life, then you must consult.',
      hi: 'स्वास्थ्य पर पढ़ने वाले दुष्प्रभाव पर सामान्यतया सभी ग्रहों की भूमिका रहती है।ज्यादातर यह सामान्य स्वास्थ्य समस्याएं पैदा करते हैं। किंतु कई बार ग्रहों की दशा-अंतर्दशा से बनने वाले आशुभ षडाष्टक योग से गंभीर व असाध्य रोगों के पैदा होने की संभावना प्रबल हो जाती है। जिन्हें ठीक ना किया जा सके।यदि आपके जीवन में अत्यधिक स्वास्थ्य संबंधित समस्याएं हैं,तो अवश्यमेव परामर्श ले।'
    }, 
    link: '/panchang' 
  },
  { 
    title: 'Abroad', 
    icon: <FaPlaneDeparture />, 
    description: {
      en: 'If the foreign yoga in the horoscope is in an excellent position, then there is a better situation of education, career and wealth gain abroad. If there is a moderate yoga, it gives the benefit of education and wealth. If there is a normal foreign yoga, then it makes one travel abroad as a tourist. What does your horoscope say about traveling abroad? You can get its exact information from our astrologers.',
      hi: 'कुंडली में विदेश योग उत्कृष्ट स्थिति में होने पर विदेश में शिक्षा,करियर के साथ धन लाभ की श्रेष्ठ स्थिति बनती है। मध्यम योग होने पर ,शिक्षा एवं धन का लाभ देता है। सामान्य विदेश योग हो तो,पर्यटक के तौर पर विदेश भ्रमण कराता है। विदेश भ्रमण को लेकर आपकी कुण्डली क्या कहती है।इसकी सटीक जानकारी हमारे ज्योतिषियों द्वारा प्राप्त क'
    }, 
    link: '/horoscope' 
  },
  { 
    title: 'Career', 
    icon: <FaBriefcase />, 
    description: {
      en: 'Many times it has been seen that a person does a job, there are problems there, after that a person does business, there are problems there. In the horoscope of such people, the house of employment is obstructed by the obstructing planets in such a way that progress is just like a dream for them. It is very important for such people to get information about the obstructing planets and get a complete solution.',
      hi: 'कई बार ऐसा देखा गया है।जातक नौकरी करता है,वहां भी समस्याएं,उसके पश्चात व्यक्ति व्यापार करता है,वहां समस्याएं।इस प्रकार के जातकों की कुंडली में रोजगार का भाव,बाधक ग्रहों के द्वारा,इस प्रकार बाधित होता है।मानो तरक्की उनके लिए केवल एक सपने जैसी होती है। ऐसे जातकों को बाधक ग्रहों की जानकारी प्राप्त करके, पूर्ण समाधान करना अत्यावश्यक होता है।'
    }, 
    link: '/compatibility' 
  },
  { 
    title: 'Education', 
    icon: <FaGraduationCap />, 
    description: {
      en: 'What should be our subjects through the planets? Are there chances of higher education in our horoscope or not? Will our education give us success? If this type of information is taken at the right time, then benefit is definitely available.',
      hi: 'ग्रहों के माध्यम से हमारे सब्जेक्ट क्या होने चाहिए।उच्च शिक्षा के योग हमारी कुंडली में है भी या नहीं।क्या हमारी शिक्षा हमें सफलता प्रदान करने वाली होगी? इस प्रकार की जानकारी सही समय पर ले ली जाएं,तो अवश्य लाभ मिलता है।'
    }, 
    link: '/kundli' 
  },
  { 
    title: 'Job & Business', 
    icon: <FaStar />, 
    description: {
      en: 'Do you know whether there are strong yogas of business or job in your horoscope? Is it not that our efforts are going in the wrong direction, due to which we are not getting both success and satisfaction in our business or job? If you want to be successful in life, then you must consult an astrologer once.',
      hi: 'क्या आपको पता है?आपकी कुंडली में व्यापार के मजबूत योग हैं,या नौकरी के। कहीं ऐसा तो नहीं कि हमारा प्रयास गलत दिशा में हो रहा है,जिस कारण हमें अपने व्यापार अथवा नौकरी में सफलता और संतुष्टि दोनों ही नहीं मिल पा रही है। यदि जीवन में सफल होना चाहते हैं।तो एक बार ज्योतिषी परामर्श अवश्य लेना चाहिए।'
    }, 
    link: '/panchang' 
  },
];