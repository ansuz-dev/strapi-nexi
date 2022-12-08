const pkg = require("../../package.json");

const getPluginStore = strapi => strapi.store({
  environment: "",
  type: "plugin",
  name: "nexi",
});

const setInstalledVersion = async (strapi, version) => {
  const pluginStore = getPluginStore(strapi);

  await pluginStore.set({
    key: "installedVersion",
    value: version,
  });

  return pluginStore.get({key: "installedVersion"});
};

const getInstalledVersion = async strapi => {
  const pluginStore = getPluginStore(strapi);

  let installedVersion = await pluginStore.get({key: "installedVersion"});
  if (!installedVersion) {
    await pluginStore.set({key: "installedVersion", value: pkg.version});
    installedVersion = await pluginStore.get({key: "installedVersion"});
  }

  return installedVersion;
};

module.exports = {
  getInstalledVersion,
  setInstalledVersion,
};
