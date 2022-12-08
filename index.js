require('dotenv').config();
const { Client, IntentsBitField, ActivityType, time } = require('discord.js');
const client = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent
    ]
});

// 定数宣言
// イベント名
// 例: クリスマス・お正月・誕生日など
const eventName = 'クリスマス';
// イベントの月
const month = 12;
// イベントの日付
const day = 25;
// イベントの時刻
const hours = 0;
// イベントの分
const minutes = 0;
// イベントの秒
const seconds = 0;

// Botが正常にログインした時に発火するEVENT
client.on('ready', () => {
    client.user.setStatus('online');
    client.user.setActivity({ name: remainingDate(), type: ActivityType.Playing });
    console.log(`Logged in as ${client.user.tag}`);

    // 30秒おきにアクティビティを更新する
    setInterval(() => {
        client.user.setActivity({ name: remainingDate(), type: ActivityType.Playing });
    }, 30 * 1000);
});

client.on('messageCreate', message => {
    if (message.author.bot || message.system) return;

    if (message.content.match(`${eventName}までの時間は？`)) {
        message.reply(remainingUNIX());
    }
});

// 指定日までの残り時間を計算する
function remainingDate() {
    // 現在の時刻
    const nowDate = new Date(new Date().toLocaleString('JST'));

    // イベントの時刻
    const eventDate = new Date(new Date(nowDate.getFullYear(), month - 1, day, hours, minutes, seconds).toLocaleString('JST'));

    // 残り時間を計算する
    const result = eventDate.getTime() - nowDate.getTime();
    const resultSeconds = Math.floor(result / 1000 % 60);
    const resultMinutes = Math.floor(result / 1000 / 60) % 60;
    const resultHours = Math.floor(result / 1000 / 60 / 60) % 24;
    const resultDay = Math.floor(result / 1000 / 60 / 60 / 24);

    return `${eventName}まであと${resultDay}日${resultHours}時間${resultMinutes}分${resultSeconds}秒`
}

function remainingUNIX() {
    // 現在の時刻
    const nowDate = new Date(new Date().toLocaleString('JST'));

    // イベントの時刻
    const eventDate = new Date(new Date(nowDate.getFullYear(), month - 1, day, hours, minutes, seconds).toLocaleString('JST'));

    return time(eventDate, 'R');
}

client.login();