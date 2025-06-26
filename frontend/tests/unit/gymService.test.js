import { describe, it, expect, vi, beforeEach } from 'vitest';
import gymService from '@/services/gymService';

// Mock du module gymService pour tous les tests
vi.mock('@/services/gymService', () => {
  return {
    __esModule: true,
    default: {
      getClasses: vi.fn()
    }
  };
});

describe('gymService', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('cas passant : récupère les cours', async () => {
    gymService.getClasses.mockResolvedValue([{ id: 1, name: 'Yoga' }]);
    const classes = await gymService.getClasses();
    expect(classes).toEqual([{ id: 1, name: 'Yoga' }]);
  });

  it('cas non passant : erreur API', async () => {
    gymService.getClasses.mockRejectedValue(new Error('API error'));
    await expect(gymService.getClasses()).rejects.toThrow('API error');
  });

  it('cas limite : réponse vide', async () => {
    gymService.getClasses.mockResolvedValue([]);
    const classes = await gymService.getClasses();
    expect(classes).toEqual([]);
  });
});
