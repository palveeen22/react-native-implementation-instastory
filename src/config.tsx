//PAY ATTENTION HERE
const API_CONSTANTS = {
  dev: {
    url: "",//API HERE
    google: {
      placeToken: 'AIzaSyCIKZfJBD7w2i6sk6fNTFWxBxgLgkP_JIQ',
    },
    mapBox: {
      token: 'pk.eyJ1IjoibmFyemEiLCJhIjoiY2tyc3RpcTA2MG4yZTJ3cWU5aHdoYnFzMSJ9.LKE-gvUthBNA0oj6TbzRXg',
    },
  },
  prod: {
    url: 'https://bibig.bokus.ru',
    google: {
      placeToken: 'AIzaSyCIKZfJBD7w2i6sk6fNTFWxBxgLgkP_JIQ',
    },
    mapBox: {
      token: 'pk.eyJ1IjoibmFyemEiLCJhIjoiY2tyc3RpcTA2MG4yZTJ3cWU5aHdoYnFzMSJ9.LKE-gvUthBNA0oj6TbzRXg',
    },
  },
}
const CURRENT_API = API_CONSTANTS.dev

export const androidStores = ['play_market'] as const
export type AndroidStores = (typeof androidStores)[number]
export type StoresType = 'app_store' | 'play_market'

export default {
  store: androidStores[0],
  smsCodeLength: 4,
  api: {
    url: CURRENT_API.url + '/api',
    showLogs: true,
    useFixture: false,
    fixtureDuration: 0,
  },
  oneSignalAppID: '7d1980f1-96ba-4166-a477-5fba354284a0',
  animationDuration: 500,
  messageDuration: 5000,
  googlePlaceApiUrl: `https://maps.googleapis.com/maps/api/place/autocomplete/json?key=${CURRENT_API.google.placeToken}&language=ru&inputtype=textquery&types=(cities)&input=`,
  chat: {
    maxFileSize: 50,
    maxFiles: undefined,
    fileTypes: ['jpg', 'jpeg', 'png', 'doc', 'docx', 'xls', 'xlsx', 'zip', 'rar', 'pdf', 'dwg', 'bmp'],
  },
  mapBox: CURRENT_API.mapBox,
  timerDuration: 60,
}
