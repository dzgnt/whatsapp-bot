const { default: makeWASocket, useMultiFileAuthState } = require('@whiskeysockets/baileys')
const pino = require('pino')
const qrcode = require('qrcode-terminal')

async function startBot() {
    const { state, saveCreds } = await useMultiFileAuthState('auth_info')

    const sock = makeWASocket({
        logger: pino({ level: 'silent' }),
        auth: state
    })

    sock.ev.on('creds.update', saveCreds)

    sock.ev.on('connection.update', (update) => {
        const { connection, qr } = update
        if (qr) {
            console.log('📲 Scan QR berikut pakai WhatsApp (Linked Devices):')
            qrcode.generate(qr, { small: true })  // ✅ QR langsung muncul di terminal
        }
        if (connection === 'open') {
            console.log('✅ Bot sudah terhubung ke WhatsApp!')
        }
    })
}

startBot()
