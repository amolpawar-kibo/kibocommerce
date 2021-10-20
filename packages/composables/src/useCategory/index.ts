import {
  Context,
  useCategoryFactory,
  UseCategoryFactoryParams
} from '@vue-storefront/core';
import type { Category } from '@vue-storefront/kibocommerce-api';

const params: UseCategoryFactoryParams<Category, any> = {
  categorySearch: async (
    context: Context,
    params = { searchParams: undefined, customQuery: undefined }
  ): Promise<Category[]> => {
    const { searchParams, customQuery } = params;
    const categoryResponse = await context.$kibo.api.getCategory(
      searchParams,
      customQuery
    );
    return categoryResponse.data.categories?.items as any;
  }
};

export const useCategory = useCategoryFactory<Category, any>(params);
