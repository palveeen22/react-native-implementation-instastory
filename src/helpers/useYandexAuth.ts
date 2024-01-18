import { useState, useEffect } from 'react'
import { AuthorizeResult, authorize } from 'react-native-app-auth'
import axios from 'axios'

const baseUrl = 'https://oauth.yandex.ru'
const config = {
  issuer: baseUrl,
  clientId: '00842f69464e49daa599995784f6c1ce',
  // redirectUrl: 'https://bibig.ru',
  redirectUrl: 'com.bokus.bibig://oauthredirect',
  scopes: [],
  serviceConfiguration: {
    authorizationEndpoint: `${baseUrl}/authorize`,
    tokenEndpoint: `${baseUrl}/token`,
    revocationEndpoint: `${baseUrl}/revoke`,
  },
}

export const useYandexAuth = () => {
  const [stateYandex, setStateYandex] = useState<AuthorizeResult | any>({} as AuthorizeResult)

  const onLogin = async () => {
    try {
      const response = await authorize(config)
      const idToken = await getInfo(response.accessToken, 'jwt')
      const userInfo = await getInfo(response.accessToken, 'json')
      setStateYandex({ ...response, idToken, userInfo })
    } catch (error) {
      console.log(error, '<<<==== this is resp')
    }
  }

  const getInfo = async (accessToken: string, format: 'jwt' | 'json' | 'xml') => {
    const response = await axios.get(`https://login.yandex.ru/info?format=${format}`, {
      headers: {
        Authorization: `OAuth ${accessToken}`,
      },
    })
    return response.data
  }

  const handler = {
    onLogin,
  }
  return {
    stateYandex,
    handler,
  }
}
