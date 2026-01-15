import crypto from 'crypto'

// 加密密钥，实际部署时应该从环境变量获取
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || 'goofish_credentials_bot_secret_key'
const IV_LENGTH = 16 // AES-256 需要 16 字节的初始化向量

export function generateMid(): string {
    const randomPart = Math.floor(Math.random() * 1000)
    const timestamp = Date.now()
    return `${randomPart}${timestamp} 0`
}

export function generateUuid(): string {
    const chars = '0123456789abcdef'
    const sections = [8, 4, 4, 4, 12]
    return sections.map(len =>
        Array.from({ length: len }, () => chars[Math.floor(Math.random() * 16)]).join('')
    ).join('-')
}

export function generateDeviceId(userId: string): string {
    const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'
    const result: string[] = []
    for (let i = 0; i < 36; i++) {
        if ([8, 13, 18, 23].includes(i)) {
            result.push('-')
        } else if (i === 14) {
            result.push('4')
        } else if (i === 19) {
            const randVal = Math.floor(Math.random() * 16)
            result.push(chars[(randVal & 0x3) | 0x8])
        } else {
            result.push(chars[Math.floor(Math.random() * 16)])
        }
    }
    return result.join('') + '-' + userId
}

export function generateSign(t: string, token: string, data: string): string {
    const appKey = '34839810'
    const msg = `${token}&${t}&${appKey}&${data}`
    return crypto.createHash('md5').update(msg).digest('hex')
}

/**
 * 加密字符串
 */
export function encrypt(text: string): string {
    const iv = crypto.randomBytes(IV_LENGTH)
    const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv)
    let encrypted = cipher.update(text, 'utf8', 'base64')
    encrypted += cipher.final('base64')
    return iv.toString('base64') + ':' + encrypted
}

/**
 * 解密字符串
 */
export function decrypt(text: string): string {
    const textParts = text.split(':')
    const iv = Buffer.from(textParts.shift()!, 'base64')
    const encryptedText = textParts.join(':')
    const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv)
    let decrypted = decipher.update(encryptedText, 'base64', 'utf8')
    decrypted += decipher.final('utf8')
    return decrypted
}

/**
 * 检查字符串是否已加密
 */
export function isEncrypted(text: string): boolean {
    return text.includes(':') && text.split(':').length === 2
}
