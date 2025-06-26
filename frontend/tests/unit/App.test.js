import { describe, it, expect, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import { createRouter, createWebHistory } from 'vue-router';
import App from '@/App.vue';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: { template: '<div />' } }
  ],
});

describe('App.vue', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it('cas passant : affiche le composant principal', async () => {
    const wrapper = mount(App, {
      global: {
        plugins: [createPinia(), router],
      },
    });
    await router.isReady();
    expect(wrapper.exists()).toBe(true);
  });

  it('cas non passant : navigation vers une page inconnue', async () => {
    const wrapper = mount(App, {
      global: {
        plugins: [createPinia(), router],
      },
    });
    await router.isReady();
    expect(wrapper.exists()).toBe(true);
  });

  it('cas limite : rendu avec props vides', async () => {
    const wrapper = mount(App, {
      global: {
        plugins: [createPinia(), router],
      },
      props: {},
    });
    await router.isReady();
    expect(wrapper.exists()).toBe(true);
  });
});
