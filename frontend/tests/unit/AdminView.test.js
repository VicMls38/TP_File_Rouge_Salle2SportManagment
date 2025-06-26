import { describe, it, expect, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import { createRouter, createWebHistory } from 'vue-router';
import AdminView from '@/views/AdminView.vue';
import { vi } from 'vitest';

// Mock gymService and its methods before importing AdminView
vi.mock('@/services/gymService', () => ({
  dashboardService: {
    getAdminDashboard: vi.fn().mockResolvedValue({
      users: { total: 2, active: 1 },
      bookings: { total: 3, noShow: 1 },
      revenue: { monthly: 100 },
    }),
  },
  userService: {
    getAllUsers: vi.fn().mockResolvedValue([
      {
        id: 1,
        firstname: 'Alice',
        lastname: 'Smith',
        email: 'alice@mail.com',
        role: 'USER',
        dateJoined: '2024-01-01',
      },
      {
        id: 2,
        firstname: 'Bob',
        lastname: 'Jones',
        email: 'bob@mail.com',
        role: 'ADMIN',
        dateJoined: '2024-02-01',
      },
    ]),
    createUser: vi.fn(),
    updateUser: vi.fn(),
    deleteUser: vi.fn(),
  },
  classService: {
    getAllClasses: vi.fn().mockResolvedValue([]),
    createClass: vi.fn(),
    updateClass: vi.fn(),
    deleteClass: vi.fn(),
    purgeOldClasses: vi.fn(),
  },
  bookingService: {
    getAllBookings: vi.fn().mockResolvedValue([]),
    updateBookingStatus: vi.fn(),
    deleteBooking: vi.fn(),
    updateNoShowBookings: vi.fn(),
  },
  subscriptionService: {},
}));

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: { template: '<div />' } }
  ],
});

describe('AdminView', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it('cas passant : affiche la liste des utilisateurs', async () => {
    const wrapper = mount(AdminView, {
      global: {
        plugins: [createPinia(), router],
      },
    });
    await router.isReady();
    // Wait for onMounted to finish
    await new Promise((r) => setTimeout(r));
    expect(wrapper.text()).toMatch(/Alice/);
    expect(wrapper.text()).toMatch(/Bob/);
  });

  it('cas non passant : aucun utilisateur', async () => {
    // Mock getAllUsers to return empty
    const { userService } = await import('@/services/gymService');
    userService.getAllUsers.mockResolvedValueOnce([]);
    const wrapper = mount(AdminView, {
      global: {
        plugins: [createPinia(), router],
      },
    });
    await router.isReady();
    await new Promise((r) => setTimeout(r));
    // Should not find any user rows
    const rows = wrapper.findAll('tbody tr');
    expect(rows.length).toBe(0);
  });

  it('cas limite : nom très long', async () => {
    const longName = 'A'.repeat(200);
    const { userService } = await import('@/services/gymService');
    userService.getAllUsers.mockResolvedValueOnce([
      {
        id: 2,
        firstname: longName,
        lastname: '',
        email: 'long@mail.com',
        role: 'USER',
        dateJoined: '2024-01-01',
      },
    ]);
    const wrapper = mount(AdminView, {
      global: {
        plugins: [createPinia(), router],
      },
    });
    await router.isReady();
    await new Promise((r) => setTimeout(r));
    expect(wrapper.text()).toMatch(longName);
  });
});
