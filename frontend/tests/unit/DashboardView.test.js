import { describe, it, expect, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import { createRouter, createWebHistory } from 'vue-router';
import DashboardView from '@/views/DashboardView.vue';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: { template: '<div />' } }
  ],
});

// Mock gymService et ses méthodes pour DashboardView
vi.mock('@/services/gymService', () => ({
  dashboardService: {
    getUserDashboard: vi.fn().mockResolvedValue({
      user: { id: 1, firstname: 'Test', lastname: 'User', email: 'test@email.com', dateJoined: '2024-01-01' },
      subscription: {
        planType: 'Premium', startDate: '2024-01-01', endDate: '2025-01-01', active: true, autoRenew: true
      },
      stats: { totalClasses: 10, confirmedClasses: 8, totalMinutes: 600, noShowClasses: 1 },
      billing: { monthlyAmount: 50 },
      recentBookings: [
        { id: 1, class: { title: 'Yoga', coach: 'Coach A', datetime: '2025-06-26T10:00:00Z' }, status: 'CONFIRMED', createdAt: '2025-06-01' }
      ]
    })
  },
  classService: {
    getAllClasses: vi.fn().mockResolvedValue([])
  },
  bookingService: {
    createBooking: vi.fn(),
    cancelBooking: vi.fn()
  }
}));

// Mock du store d'auth pour fournir un currentUser
vi.mock('@/store/auth', () => ({
  useAuthStore: () => ({
    currentUser: { id: 1, firstname: 'Test', lastname: 'User', email: 'test@email.com', dateJoined: '2024-01-01' }
  })
}));

describe('DashboardView', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.resetAllMocks();
  });

  it('cas passant : affiche les réservations', async () => {
    const { dashboardService, classService } = await import('@/services/gymService');
    dashboardService.getUserDashboard.mockResolvedValueOnce({
      user: { id: 1, firstname: 'Test', lastname: 'User', email: 'test@email.com', dateJoined: '2024-01-01' },
      subscription: null,
      stats: { totalClasses: 1, confirmedClasses: 1, totalMinutes: 60, noShowClasses: 0 },
      billing: { monthlyAmount: 10 },
      recentBookings: [
        { id: 1, class: { title: 'Yoga', coach: 'Coach A', datetime: '2025-06-26T10:00:00Z' }, status: 'CONFIRMED', createdAt: '2025-06-01' }
      ]
    });
    classService.getAllClasses.mockResolvedValueOnce([]);
    const wrapper = mount(DashboardView, {
      global: {
        plugins: [createPinia(), router],
      }
    });
    await router.isReady();
    await new Promise(r => setTimeout(r));
    expect(wrapper.text()).toMatch(/Yoga/);
    expect(wrapper.text()).toMatch(/26\/06\/2025/);
  });

  it('cas non passant : aucune réservation', async () => {
    const { dashboardService, classService } = await import('@/services/gymService');
    dashboardService.getUserDashboard.mockResolvedValueOnce({
      user: { id: 1, firstname: 'Test', lastname: 'User', email: 'test@email.com', dateJoined: '2024-01-01' },
      subscription: null,
      stats: { totalClasses: 0, confirmedClasses: 0, totalMinutes: 0, noShowClasses: 0 },
      billing: { monthlyAmount: 0 },
      recentBookings: []
    });
    classService.getAllClasses.mockResolvedValueOnce([]);
    const wrapper = mount(DashboardView, {
      global: {
        plugins: [createPinia(), router],
      }
    });
    await router.isReady();
    await new Promise(r => setTimeout(r));
    expect(wrapper.text()).toMatch(/aucune réservation|no bookings|aucun cours/i);
  });

  it('cas limite : très grand nombre de réservations', async () => {
    const { dashboardService, classService } = await import('@/services/gymService');
    const bookings = Array.from({ length: 100 }, (_, i) => ({
      id: i,
      class: { title: 'Test', coach: 'Coach', datetime: '2025-06-26T10:00:00Z' },
      status: 'CONFIRMED',
      createdAt: '2025-06-01'
    }));
    dashboardService.getUserDashboard.mockResolvedValueOnce({
      user: { id: 1, firstname: 'Test', lastname: 'User', email: 'test@email.com', dateJoined: '2024-01-01' },
      subscription: null,
      stats: { totalClasses: 100, confirmedClasses: 100, totalMinutes: 6000, noShowClasses: 0 },
      billing: { monthlyAmount: 100 },
      recentBookings: bookings
    });
    classService.getAllClasses.mockResolvedValueOnce([]);
    const wrapper = mount(DashboardView, {
      global: {
        plugins: [createPinia(), router],
      }
    });
    await router.isReady();
    await new Promise(r => setTimeout(r));
    expect(wrapper.findAll('tbody tr').length).toBeGreaterThanOrEqual(50);
  });
});
