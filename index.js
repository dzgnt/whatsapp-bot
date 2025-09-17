const { makeWASocket, useMultiFileAuthState } = require('@whiskeysockets/baileys')
const pino = require('pino')

async function startBot() {
    const { state, saveCreds } = await useMultiFileAuthState('auth_info')

    const sock = makeWASocket({
        logger: pino({ level: 'silent' }),
        printQRInTerminal: true,
        auth: state
    })

    sock.ev.on('creds.update', saveCreds)

    sock.ev.on('messages.upsert', async ({ messages }) => {
        const msg = messages[0]
        if (!msg.message) return
        const from = msg.key.remoteJid
        const text = msg.message.conversation || msg.message.extendedTextMessage?.text

        if (text) {
            console.log(`Pesan dari ${from}: ${text}`)
            if (text.toLowerCase() === 'halo') {
                await sock.sendMessage(from, { text: 'Hai Dzjet 👋, aku bot Railway nih!' })
            }
        }
    })
}

startBot()
