const { Telegraf, Markup } = require('telegraf');
const bot = new Telegraf('8143614090:AAEe-68L_ByOlHgYcaeJvUDr79g8E6GP1Iw');

const CHANNEL_ID = '@x_crypto_1';
const CHANNEL_LINK = 'https://t.me/x_crypto_1';

// Middleware للتحقق من الاشتراك الإلزامي
async function checkSub(ctx) {
    try {
        const member = await ctx.telegram.getChatMember(CHANNEL_ID, ctx.from.id);
        const allowed = ['member', 'administrator', 'creator'];
        return allowed.includes(member.status);
    } catch (e) {
        return false;
    }
}

bot.use(async (ctx, next) => {
    if (ctx.chat.type !== 'private') return next();
    const isSubscribed = await checkSub(ctx);
    
    if (!isSubscribed) {
        return ctx.replyWithMarkdown(
            `⚠️ *عذراً، الوصول مرفوض*\n\nيجب عليك الاشتراك في قناة النظام أولاً لتتمكن من استخدام البوت وتفعيل وحدات البرمجة.\n\n📢 القناة: ${CHANNEL_ID}`,
            Markup.inlineKeyboard([
                [Markup.button.url('⚡️ انضم الآن', CHANNEL_LINK)],
                [Markup.button.callback('🔄 تم الاشتراك (تفعيل)', 'check_sub')]
            ])
        );
    }
    return next();
});

bot.start((ctx) => {
    ctx.replyWithMarkdown(
        '✅ *تم منح حق الوصول*\n\nمرحباً بك في وحدة تعليم البرمجة التابعة لـ Alioun OS.\n\nابدأ بالتعلم من خلال المستويات المتدرجة:', 
        Markup.keyboard([['📂 الدروس الصغيرة (الأساسيات)', '🏆 التحديات'], ['🛠 أدوات المطور', '⚙️ حالة الاشتراك']]).resize()
    );
});

bot.hears('📂 الدروس الصغيرة (الأساسيات)', (ctx) => {
    ctx.reply('المستوى الأول: أساسيات المنطق البرمجي.\nتعلم كيف يفكر الحاسوب.', 
    Markup.inlineKeyboard([
        [Markup.button.callback('1. ما هي البرمجة؟', 'lesson_1')],
        [Markup.button.callback('2. المتغيرات والدوال', 'lesson_2')]
    ]));
});

bot.on('callback_query', async (ctx) => {
    const data = ctx.callbackQuery.data;
    
    if (data === 'check_sub') {
        const isSubscribed = await checkSub(ctx);
        if (isSubscribed) {
            ctx.answerCbQuery('✅ تم التحقق، تم فتح النظام.');
            ctx.reply('تم تفعيل الصلاحيات. اضغط /start للبدء.');
        } else {
            ctx.answerCbQuery('❌ لم تشترك بعد!', { show_alert: true });
        }
    }

    if (data === 'lesson_1') {
        ctx.reply('أحسنت! البرمجة هي لغة التخاطب مع الآلة. لإتمام هذا المستوى، اكتب كود `print("Hello Alioun")`');
    }
});

bot.launch();
console.log('Alioun OS Bot is patrolling...');
