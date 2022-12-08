const pkg = require("../../package.json");
const {
  items,
  sections,
  collections,
  singles,
  categories,
  contentTypes,
  getRelatedComponents,
  components,
} = require("./schema");

const {getInstalledVersion, setInstalledVersion} = require("./store");

module.exports = ({strapi}) => ({
  getWelcomeMessage() {
    return "Welcome to Strapi 🚀";
  },

  getSingleTypeStatus() {
    const statuses = {};

    const singleTypes = Object.keys(singles);
    for (const uid of singleTypes) {
      const contentType = strapi.contentTypes[uid];
      statuses[uid] = contentType
        ? {
          added: true,
          uid,
          displayName: contentType.info.displayName,
          icon: contentType.info.icon,
        }
        : {
          added: false,
          uid,
          displayName: singles[uid].info.displayName,
          icon: singles[uid].info.icon,
        };
    }

    return statuses;
  },

  getCollectionTypeStatus() {
    const statuses = {};

    const collectionTypes = Object.keys(collections);
    for (const uid of collectionTypes) {
      const contentType = strapi.contentTypes[uid];
      statuses[uid] = contentType
        ? {
          added: true,
          uid,
          displayName: contentType.info.displayName,
          icon: contentType.info.icon,
        }
        : {
          added: false,
          uid,
          displayName: collections[uid].info.displayName,
          icon: collections[uid].info.icon,
        };
    }

    return statuses;
  },

  getItemComponentStatus() {
    const statuses = {};

    const itemComponents = Object.keys(items);
    for (const uid of itemComponents) {
      const component = strapi.components[uid];
      statuses[uid] = component
        ? {
          added: true,
          uid,
          displayName: component.info.displayName,
          icon: component.info.icon,
        }
        : {
          added: false,
          uid,
          displayName: items[uid].info.displayName,
          icon: items[uid].info.icon,
        };
    }

    return statuses;
  },

  getSectionComponentStatus() {
    const statuses = {};

    const sectionComponents = Object.keys(sections);
    for (const uid of sectionComponents) {
      const component = strapi.components[uid];
      statuses[uid] = component
        ? {
          added: true,
          uid,
          displayName: component.info.displayName,
          icon: component.info.icon,
        }
        : {
          added: false,
          uid,
          displayName: sections[uid].info.displayName,
          icon: sections[uid].info.icon,
        };
    }

    return statuses;
  },

  async addContentType(uid) {
    let contentType = strapi.contentTypes[uid];

    if (!contentType) {
      contentType = contentTypes[uid];
      if (contentType) {
        const relatedComponents = getRelatedComponents(strapi, contentType);

        await strapi
          .plugin("content-type-builder")
          .services["content-types"]
          .createContentType({
            contentType: {
              ...contentType,
              displayName: contentType.info.displayName,
              pluralName: contentType.info.pluralName,
              singularName: contentType.info.singularName,
              icon: contentType.info.icon,
              draftAndPublish: contentType.options.draftAndPublish,
            },
            components: relatedComponents,
          });
      }
    }
  },

  async removeContentType(uid) {
    const contentType = strapi.contentTypes[uid];

    if (contentType) {
      await strapi
        .plugin("content-type-builder")
        .services["content-types"]
        .deleteContentType(contentType.uid);
    }
  },

  async addComponent(uid) {
    let component = strapi.components[uid];
    if (!component) {
      const category = uid.split(".")[0];
      component = categories[category][uid];
      if (component) {
        const relatedComponents = getRelatedComponents(strapi, component);

        await strapi
          .plugin("content-type-builder")
          .services.components.createComponent({
            component: {
              category,
              displayName: component.info.displayName,
              icon: component.info.icon,
              attributes: component.attributes,
            },
            components: relatedComponents,
          });
      }
    }
  },

  async removeComponent(uid) {
    const component = strapi.components[uid];
    if (component) {
      await strapi
        .plugin("content-type-builder")
        .services.components.deleteComponent(uid);
    }
  },

  async migrate() {
    const installedVersion = await getInstalledVersion(strapi);

    if (installedVersion !== pkg.version) {
      // migrate components
      const componentEntries = Object.entries(components);
      for (const [uid, schema] of componentEntries) {
        // just migrate already added components
        if (strapi.components[uid]) {
          const relatedComponents = getRelatedComponents(strapi, schema);

          const category = uid.split(".")[0];
          await strapi
            .plugin("content-type-builder")
            .services.components.editComponent(uid, {
              component: {
                category,
                displayName: schema.info.displayName,
                icon: schema.info.icon,
                attributes: schema.attributes,
              },
              components: relatedComponents,
            });
        }
      }

      // migrate content-types
      const contentTypesEntries = Object.entries(contentTypes);
      for (const [uid, schema] of contentTypesEntries) {
        // just migrate already added content-types
        if (strapi.contentTypes[uid]) {
          const relatedComponents = getRelatedComponents(strapi, schema);

          await strapi
            .plugin("content-type-builder")
            .services["content-types"]
            .editContentType(uid, {
              contentType: {
                ...schema,
                displayName: schema.info.displayName,
                pluralName: schema.info.pluralName,
                singularName: schema.info.singularName,
                icon: schema.info.icon,
                draftAndPublish: schema.options.draftAndPublish,
              },
              components: relatedComponents,
            });
        }
      }

      const res = await setInstalledVersion(strapi, pkg.version);

      return res;
    }
  },
});
