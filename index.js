const TelegramBot = require('node-telegram-bot-api');

const token = "7045668559:AAHcMvLqWW9fEuA6DsjgLH3W5Nguvbvb2Iw" // Bot tokenini bu yerga kiriting
const adminId = "5671783552"; // Adminning Telegram ID sini kiriting
const bot = new TelegramBot(token, {webHook: true}); // Botni ishga tushirish



// Savollarni vaqtincha saqlash uchun (RAM ichida)
const userQuestions = {};

bot.setMyCommands([
    {command: '/start', description: 'Botni ishga tushirish'},
    {command: '/help', description: 'Yordam'},
    {command: '/info', description: 'Bot haqida ma\'lumot'},
])


// 1. Foydalanuvchidan savol kelganda

bot.on('message', async (msg) => {
    const text = msg.text;
    const chatId = msg.chat.id;
    
    if(text === '/start') {
        return bot.sendMessage(chatId, `Assalamu alaykum!, Hurmatli ${msg.from?.first_name} RoboKid botiga xush kelibsiz!`);
    }

    if(text === '/help') {
        return bot.sendMessage(chatId, `Bu bot sizga yordam berish uchun yaratilgan. Siz quyidagi buyruqlarni ishlatishingiz mumkin: /start, /help, /info`);
    }
    if(text === '/info') {
        return bot.sendMessage(chatId, `Bu bot sizga turli xil sizni qiziqtirgan savollarga javob berish uchun yaratilgan.O'zinginingizni qiziqtirgan savollarni yozing va bot sizga javob beradi.`);   
    }

     // Agar bu admin bo'lsa va /javob emas bo‘lsa - e’tiborga olma
     if (chatId.toString() === adminId.toString() && !text.startsWith('/javob')) return;

     // Agar oddiy foydalanuvchi bo‘lsa, savolni saqlaymiz
    if (chatId.toString() !== adminId.toString()) {
        userQuestions[chatId] = text; // savolni saqlab qo'yamiz
    
        // Adminga savol yuboriladi
        bot.sendMessage(adminId,
          `❓ Yangi savol:\n"${text}"\n\n👤 Foydalanuvchi ID: ${chatId}\n✍️ Javob yuborish uchun faqat javob matnini yuboring.`);
        
        // Foydalanuvchiga javob yuborilishini bildir
        bot.sendMessage(chatId, "Savolingiz adminga yuborildi. Tez orada javob olasiz.");
      }
});

// 2. Admin tomonidan javob kelganda
bot.on('message', (msg) => {
    console.log(msg);
    const chatId = msg.chat.id;
    const text = msg.text;

  
    // Faqat admin javob yuborishi mumkin
    if (chatId.toString() !== adminId.toString()) return;

  
    // Eng birinchi foydalanuvchi IDni aniqlash
    const userId = Object.keys(userQuestions)[0]; // Navbatdagi foydalanuvchi IDni olamiz
  
    if (!userId) {
      bot.sendMessage(adminId, "❌ Javob berish uchun hech qanday savol topilmadi.");
      return;
    }
  
    const originalQuestion = userQuestions[userId];
  
    // Admin javob yuborgan matnni foydalanuvchiga yuboramiz
    const replyMessage = `Sizning savolingiz: "${originalQuestion}"\nAdmin javobi: ${text}`;
    console.log(chatId,adminId)
    bot.sendMessage(userId, replyMessage);
    bot.sendMessage(adminId, `✅ Javob foydalanuvchiga yuborildi (ID: ${userId}).`);
  
    // Savolni bazadan o'chiramiz
    delete userQuestions[userId];
  });