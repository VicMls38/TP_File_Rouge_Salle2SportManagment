import http from 'k6/http';
import { check, sleep } from 'k6';

export let options = {
  vus: 50,
  duration: '2m',
  thresholds: {
    http_req_duration: ['p(95)<900'],
    http_req_failed: ['rate<0.01'],
  },
};

// Load test : 50 annulations simultanées
export default function () {
  const payload = JSON.stringify({
    bookingId: Math.floor(Math.random() * 1000),
    userId: Math.floor(Math.random() * 1000)
  });
  const params = { headers: { 'Content-Type': 'application/json' } };
  let res = http.post('http://localhost:3000/api/bookings/cancel', payload, params);
  check(res, { 'status 200/204': (r) => r.status === 200 || r.status === 204 });
  sleep(1);
}
