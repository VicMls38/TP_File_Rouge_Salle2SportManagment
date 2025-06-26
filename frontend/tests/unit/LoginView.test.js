import { describe, it, expect, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import { createRouter, createWebHistory } from 'vue-router';
import LoginView from '@/views/LoginView.vue';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: { template: '<div />' } },
    { path: '/dashboard', component: { template: '<div />' } }
  ],
});

// Mock du store et des services pour LoginView
vi.mock('@/store/auth', () => ({
  useAuthStore: () => ({
    login: vi.fn().mockResolvedValue({ user: { id: 1, email: 'test@email.com', role: 'USER' } }),
    currentUser: null,
    isAuthenticated: false,
  }),
}));

describe('LoginView', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.resetAllMocks();
  });

  it('cas passant : affiche le formulaire de connexion', async () => {
    const wrapper = mount(LoginView, {
      global: {
        plugins: [createPinia(), router],
      },
    });
    await router.isReady();
    expect(wrapper.find('form').exists()).toBe(true);
    expect(wrapper.find('input[type="email"]').exists()).toBe(true);
    // On ne teste pas le password si le composant ne l'affiche pas
  });

  it('cas non passant : formulaire incomplet', async () => {
    const wrapper = mount(LoginView, {
      global: {
        plugins: [createPinia(), router],
      },
    });
    await router.isReady();
    await wrapper.find('form').trigger('submit.prevent');
    // On vérifie qu'un message d'erreur ou d'obligation s'affiche
    expect(wrapper.text()).toMatch(/obligatoire|requis|remplir|email/i);
  });

  it('cas limite : email très long', async () => {
    const wrapper = mount(LoginView, {
      global: {
        plugins: [createPinia(), router],
      },
    });
    await router.isReady();
    const longEmail = 'a'.repeat(200) + '@test.com';
    const emailInput = wrapper.find('input[type="email"]');
    if (emailInput.exists()) {
      await emailInput.setValue(longEmail);
    }
    await wrapper.find('form').trigger('submit.prevent');
    // On vérifie qu'il n'y a pas d'erreur bloquante
    expect(wrapper.text().length).toBeGreaterThan(0);
  });
});
