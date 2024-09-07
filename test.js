import http from 'k6/http'
import { sleep } from 'k6'

export const options = {
  vus: 10, // Reduce to 1 VU for initial debugging
  duration: '30s',
  thresholds: {
    http_req_failed: ['rate<0.01'],
    http_req_duration: ['p(95)<200'],
  },
}

export default function () {
  const url = 'http://localhost:8080/api/v1/product/all?page=1&limit=8'
  const params = {
    headers: {
      // Add any headers that Postman is using
      'Content-Type': 'application/json',
      Accept: 'application/json',
      // 'Authorization': 'Bearer your-token-here', // If needed
    },
  }
  const res = http.get(url, params)

  console.log('Request URL:', url)
  console.log('Request Headers:', JSON.stringify(params.headers, null, 2))
  console.log('Response Status:', res.status)
  console.log('Response Body:', res.body)

  sleep(1)
}
