// Mock du module api.js pour que le store utilise le mock
vi.mock('@/services/api', () => {
  const mockAxiosInstance = {
    post: vi.fn(),
    interceptors: {
      request: { use: vi.fn(), eject: vi.fn() },
      response: { use: vi.fn(), eject: vi.fn() }
    }
  };
  return {
    __esModule: true,
    default: mockAxiosInstance
  };
});

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';
import { useAuthStore } from '@/store/auth';
import axios from 'axios';
import apiClient from '@/services/api';

vi.mock('axios');

describe('auth store', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.resetAllMocks();
  });

  it('cas passant : connexion réussie', async () => {
    apiClient.post.mockResolvedValue({ data: { user: { id: 1, email: 'test@email.com', role: 'USER' } } });
    const store = useAuthStore();
    await store.login('test@email.com', 'password');
    expect(store.isAuthenticated).toBe(true);
  });

  it('cas non passant : mauvais identifiants', async () => {
    apiClient.post.mockRejectedValue(new Error('Login failed'));
    const store = useAuthStore();
    await expect(store.login('wrong@email.com', 'bad')).rejects.toThrow();
    expect(store.isAuthenticated).toBe(false);
  });

  it('cas limite : email vide', async () => {
    apiClient.post.mockRejectedValue(new Error('Login failed'));
    const store = useAuthStore();
    await expect(store.login('', 'password')).rejects.toThrow();
    expect(store.isAuthenticated).toBe(false);
  });
});
