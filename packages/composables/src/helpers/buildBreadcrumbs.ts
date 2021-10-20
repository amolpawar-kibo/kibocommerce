import { PrCategory } from '@vue-storefront/kibocommerce-api';
const buildBreadcrumbsList = (rootCat, bc) => {
  const newBc = [
    ...bc,
    {
      text: rootCat.content?.name,
      link: `${rootCat.content?.slug}/${rootCat.categoryCode}`
    }
  ];
  return rootCat.parentCategory
    ? buildBreadcrumbsList(rootCat.parentCategory, newBc)
    : newBc;
};

export const buildBreadcrumbs = (rootCat: PrCategory): any[] =>
  buildBreadcrumbsList(rootCat, []).reverse();
