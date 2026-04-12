/**
 * Camada de autenticação mockada. Para produção, substitua as implementações
 * por chamadas `fetch` à sua API e envie o token (ex.: JWT) em `Authorization`.
 */

import type { AuthSession } from './types'
import { AuthError } from './types'
import type { ForgotPasswordFormValues, LoginFormValues } from './schemas'

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms))

/** Credenciais de demonstração — documente na UI de login. */
const DEMO_EMAIL = 'demo@territory.run'
const DEMO_PASSWORD = 'demo123'

export async function login(
  credentials: LoginFormValues,
): Promise<AuthSession> {
  await delay(550)
  if (
    credentials.email.toLowerCase() === DEMO_EMAIL &&
    credentials.password === DEMO_PASSWORD
  ) {
    const expiresAt = Date.now() + 60 * 60 * 1000
    return {
      user: {
        id: 'user-demo-auth',
        email: credentials.email,
        displayName: 'Demo TerritoryRun',
      },
      accessToken: `mock.${btoa(
        JSON.stringify({ sub: 'user-demo-auth', exp: expiresAt }),
      )}`,
      refreshToken: null,
      expiresAt,
    }
  }
  throw new AuthError('E-mail ou senha incorretos.')
}

export async function requestPasswordReset(
  data: ForgotPasswordFormValues,
): Promise<void> {
  await delay(500)
  if (data.email.toLowerCase().includes('fail@')) {
    throw new AuthError('Não foi possível enviar o e-mail. Tente novamente.')
  }
}
