import {prefixPluginTranslations} from "@strapi/helper-plugin";
import pluginPkg from "../../package.json";
import pluginId from "./pluginId";
import Initializer from "./components/Initializer";
import PluginIcon from "./components/PluginIcon";

const pluginName = pluginPkg.strapi.name;

export default {
  register(app) {
    app.addMenuLink({
      to: `/plugins/${pluginId}`,
      icon: PluginIcon,
      intlLabel: {
        id: `${pluginId}.plugin.name`,
        defaultMessage: pluginName,
      },
      Component: async () => {
        const component = await import(/* webpackChunkName: "[request]" */ "./pages/App");

        return component;
      },
      permissions: [
        // Uncomment to set the permissions of the plugin here
        // {
        //   action: '', // the action name should be plugin::plugin-name.actionType
        //   subject: null,
        // },
      ],
    });
    app.registerPlugin({
      id: pluginId,
      initializer: Initializer,
      isReady: false,
      name: pluginName,
    });
  },

  bootstrap(app) {},

  async registerTrads({locales}) {
    const importedTrads = await Promise.all(
      locales.map(locale => import(
          /* webpackChunkName: "translation-[request]" */ `./translations/${locale}.json`
      )
        .then(({default: data}) => ({
          data: prefixPluginTranslations(data, pluginId),
          locale,
        }))
        .catch(() => ({
          data: {},
          locale,
        }))),
    );

    return Promise.resolve(importedTrads);
  },
};
