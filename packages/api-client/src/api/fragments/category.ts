import gql from 'graphql-tag';

const categoryFields = gql`
fragment CategoryFields on Category {
  categoryId
  categoryCode
  content {
    name
    description
    pageTitle
    metaTagTitle
    metaTagDescription
    metaTagKeywords
    slug
    categoryImages {
      altText
      imageUrl
      cmsId
      sequence
    }
  }
  sequence
  isDisplayed
  count
  updateDate
  shouldSlice
}
`;

export default gql`
  ${categoryFields}

  fragment Category on Category {
    ...CategoryFields
    parentCategory {
      ...CategoryFields
    }
  }
`;