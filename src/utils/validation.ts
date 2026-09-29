export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

export const isValidEmail = (email: string): boolean => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return re.test(email)
}

export const isValidApiKey = (key: string): boolean => {
  // API Key 应该是字母数字，长度至少32位
  return /^[a-zA-Z0-9]{32,}$/.test(key)
}

export const isRequired = (value: unknown): boolean => {
  if (typeof value === 'string') return value.trim().length > 0
  return value !== null && value !== undefined
}

export const minLength = (value: string, min: number): boolean => {
  return value.length >= min
}

export const maxLength = (value: string, max: number): boolean => {
  return value.length <= max
}

export const isPositiveNumber = (value: number): boolean => {
  return typeof value === 'number' && value > 0
}

export const isInRange = (value: number, min: number, max: number): boolean => {
  return value >= min && value <= max
}

export const validateProviderEndpoint = (endpoint: string, providerType: string): string | null => {
  if (!endpoint) return '请输入服务商端点'

  if (providerType === 'OPENAI' && !endpoint.includes('openai.com')) {
    return 'OpenAI 服务商端点应包含 openai.com'
  }
  if (providerType === 'CLAUDE' && !endpoint.includes('anthropic.com')) {
    return 'Claude 服务商端点应包含 anthropic.com'
  }
  if (providerType === 'GEMINI' && !endpoint.includes('googleapis.com')) {
    return 'Gemini 服务商端点应包含 googleapis.com'
  }

  return null
}

export const validateApiKeyFormat = (key: string, providerType: string): string | null => {
  if (!key) return '请输入 API Key'

  if (providerType === 'OPENAI' && !key.startsWith('sk-')) {
    return 'OpenAI API Key 应以 sk- 开头'
  }
  if (providerType === 'CLAUDE' && !key.startsWith('sk-ant-')) {
    return 'Claude API Key 应以 sk-ant- 开头'
  }

  return null
}
