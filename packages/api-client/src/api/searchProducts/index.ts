/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { CustomQuery, Context } from '@vue-storefront/core';
import { buildProductSearchVars } from './_util';
import productSearchQuery from './defaultQuery';
import { ProductSearchResponse } from '../../types/Api';

export default async function getProduct(
  context: Context,
  params: any,
  customQuery?: CustomQuery
): Promise<ProductSearchResponse> {
  const searchVars = buildProductSearchVars(params);
  const { productSearch } = context.extendQuery(customQuery, {
    productSearch: { query: productSearchQuery, variables: searchVars }
  });
  return context.client.query({
    query: productSearch.query,
    variables: productSearch.variables,
    fetchPolicy: 'no-cache'
  });
}
