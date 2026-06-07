import axios from 'axios'

function toCamelCase(obj: any): any {
  if (Array.isArray(obj)) {
    return obj.map(toCamelCase)
  }
  if (obj !== null && typeof obj === 'object') {
    return Object.keys(obj).reduce((result: any, key) => {
      const camelKey = key.replace(/_([a-z])/g, (_, char) => char.toUpperCase())
      result[camelKey] = toCamelCase(obj[key])
      return result
    }, {})
  }
  return obj
}

function toSnakeCase(obj: any): any {
  if (Array.isArray(obj)) {
    return obj.map(toSnakeCase)
  }
  if (obj !== null && typeof obj === 'object') {
    return Object.keys(obj).reduce((result: any, key) => {
      const snakeKey = key.replace(/([A-Z])/g, '_$1').toLowerCase()
      result[snakeKey] = toSnakeCase(obj[key])
      return result
    }, {})
  }
  return obj
}

const api = axios.create({
  baseURL: '/api',
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  if (config.data) {
    config.data = toSnakeCase(config.data)
  }
  return config
})

api.interceptors.response.use(
  (res) => {
    if (res.data) {
      res.data = toCamelCase(res.data)
    }
    return res
  },
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)

export default api
