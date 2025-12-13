export default {
  'strapi-csv-import-export': {
    enabled: true,
    config: {
      authorizedExports: [
        'api::blog.blog',
        'api::author.author',
        'api::category.category',
        'api::tag.tag',
        'api::about.about',
        'api::global.global'
      ],
      authorizedImports: [
        'api::blog.blog',
        'api::author.author',
        'api::category.category',
        'api::tag.tag',
        'api::about.about',
        'api::global.global'
      ],
    },
  },
};