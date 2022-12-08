import pluginPkg from "../../package.json";

// eslint-disable-next-line prefer-named-capture-group
const pluginId = pluginPkg.name.replace(/^(@[^-,.][\w,-]+\/|strapi-)plugin-/iu, "");

export default pluginId;
