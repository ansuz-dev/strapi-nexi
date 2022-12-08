const addressItem = require("../components/items/address-item.json");
const contactItem = require("../components/items/contact-item.json");
const linkItem = require("../components/items/link-item.json");
const pricingItem = require("../components/items/pricing-item.json");
const quoteItem = require("../components/items/quote-item.json");
const serviceItem = require("../components/items/service-item.json");
const slideItem = require("../components/items/slide-item.json");
const socialItem = require("../components/items/social-item.json");
const statItem = require("../components/items/stat-item.json");

const contactSection = require("../components/sections/contact-section.json");
const gallerySection = require("../components/sections/gallery-section.json");
const headerSection = require("../components/sections/header-section.json");
const previewSection = require("../components/sections/preview-section.json");
const pricingSection = require("../components/sections/pricing-section.json");
const quoteSection = require("../components/sections/quote-section.json");
const serviceSection = require("../components/sections/service-section.json");
const statsSection = require("../components/sections/stats-section.json");
const textSection = require("../components/sections/text-section.json");

const homepageCollection = require("../content-types/homepage/schema.json");
const navbarCollection = require("../content-types/navbar/schema.json");
const footerCollection = require("../content-types/footer/schema.json");

const pageCollection = require("../content-types/page/schema.json");

const items = {
  "items.address-item": addressItem,
  "items.contact-item": contactItem,
  "items.link-item": linkItem,
  "items.pricing-item": pricingItem,
  "items.quote-item": quoteItem,
  "items.service-item": serviceItem,
  "items.slide-item": slideItem,
  "items.social-item": socialItem,
  "items.stat-item": statItem,
};

const sections = {
  "sections.contact-section": contactSection,
  "sections.gallery-section": gallerySection,
  "sections.header-section": headerSection,
  "sections.preview-section": previewSection,
  "sections.pricing-section": pricingSection,
  "sections.quote-section": quoteSection,
  "sections.service-section": serviceSection,
  "sections.stats-section": statsSection,
  "sections.text-section": textSection,
};

const singles = {
  "api::homepage.homepage": homepageCollection,
  "api::navbar.navbar": navbarCollection,
  "api::footer.footer": footerCollection,
};

const collections = {"api::page.page": pageCollection};

const components = {
  ...items,
  ...sections,
};

const contentTypes = {
  ...singles,
  ...collections,
};

const categories = {
  items,
  sections,
};

const itemRelations = {
  "items.address-item": [
    {category: "singles", uid: "plugin::nexi.footer"},
  ],
  "items.contact-item": [
    {category: "singles", uid: "plugin::nexi.footer"},
  ],
  "items.link-item": [
    {category: "singles", uid: "plugin::nexi.navbar"},
    {category: "singles", uid: "plugin::nexi.footer"},
    {category: "sections", uid: "sections.contact-section"},
    {category: "sections", uid: "sections.gallery-section"},
    {category: "sections", uid: "sections.header-section"},
    {category: "sections", uid: "sections.preview-section"},
    {category: "sections", uid: "sections.pricing-section"},
    {category: "sections", uid: "sections.quote-section"},
    {category: "sections", uid: "sections.service-section"},
    {category: "sections", uid: "sections.stats-section"},
    {category: "sections", uid: "sections.text-section"},
  ],
  "items.pricing-item": [
    {category: "sections", uid: "sections.pricing-section"},
  ],
  "items.quote-item": [
    {category: "sections", uid: "sections.quote-section"},
  ],
  "items.service-item": [
    {category: "sections", uid: "sections.service-section"},
  ],
  "items.slide-item": [
    {category: "sections", uid: "sections.header-section"},
  ],
  "items.social-item": [
    {category: "singles", uid: "plugin::nexi.footer"},
  ],
  "items.stat-item": [
    {category: "sections", uid: "sections.stats-section"},
  ],
};

const createComponents = async strapi => {
  try {
    const res = [];

    const itemEntries = Object.entries({
      ...items,
      ...sections,
    });

    for (const [uid, schemaContent] of itemEntries) {
      console.log(uid, schemaContent);

      const component = strapi.components[uid];

      const category = uid.split(".")[0];

      const data = component
        ? await strapi
          .plugin("content-type-builder")
          .services.components.editComponent(component.uid, {
            component: {
              category,
              displayName: schemaContent.info.displayName,
              icon: schemaContent.info.icon,
              attributes: schemaContent.attributes,
            },
          })
        : await strapi
          .plugin("content-type-builder")
          .services.components.createComponent({
            component: {
              category,
              displayName: schemaContent.info.displayName,
              icon: schemaContent.info.icon,
              attributes: schemaContent.attributes,
            },
          });

      res.push(data.uid);
    }

    return res;
  } catch (error) {
    console.log(error);
  }
};

const getRelatedComponents = (strapi, schema) => {
  const attrs = schema.attributes;
  const uids = Object.values(attrs).filter(e => e.type === "component")
    .map(e => e.component);

  const relatedComponents = [];

  for (const uid of uids) {
    if (!strapi.components[uid] && items[uid]) {
      const component = items[uid];

      relatedComponents.push({
        tmpUID: uid,
        category: "items",
        displayName: component.info.displayName,
        icon: component.info.icon,
        attributes: component.attributes,
      });
    }
  }

  return relatedComponents;
};

module.exports = {
  items,
  sections,
  singles,
  collections,
  components,
  contentTypes,
  categories,
  itemRelations,
  createComponents,
  getRelatedComponents,
};
