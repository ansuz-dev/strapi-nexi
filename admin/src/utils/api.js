import pluginId from "../pluginId";
import apiInstance from "./axiosInstance";

export const getVersion = async () => {
  try {
    const res = await apiInstance.get(`/${pluginId}/version`);

    return res.data;
  } catch (error) {
    return null;
  }
};

export const migrate = async () => {
  try {
    const res = await apiInstance.post(`/${pluginId}/migrate`);

    return res.data;
  } catch (error) {
    return null;
  }
};

export const getSingleTypeStatus = async () => {
  try {
    const res = await apiInstance.get(`/${pluginId}/status/single-type`);

    return res.data;
  } catch (error) {
    return null;
  }
};

export const getCollectionTypeStatus = async () => {
  try {
    const res = await apiInstance.get(`/${pluginId}/status/collection-type`);

    return res.data;
  } catch (error) {
    return null;
  }
};

export const getItemComponentStatus = async () => {
  try {
    const res = await apiInstance.get(`/${pluginId}/status/item-component`);

    return res.data;
  } catch (error) {
    return null;
  }
};

export const getSectionComponentStatus = async () => {
  try {
    const res = await apiInstance.get(`/${pluginId}/status/section-component`);

    return res.data;
  } catch (error) {
    return null;
  }
};

export const addContentType = async uid => {
  try {
    const res = await apiInstance.post(`/${pluginId}/add/content-type`, {uid});

    return res.data;
  } catch (error) {
    return null;
  }
};

export const removeContentType = async uid => {
  try {
    const res = await apiInstance.post(`/${pluginId}/remove/content-type`, {uid});

    return res.data;
  } catch (error) {
    return null;
  }
};

export const addComponent = async uid => {
  try {
    const res = await apiInstance.post(`/${pluginId}/add/component`, {uid});

    return res.data;
  } catch (error) {
    return null;
  }
};

export const removeComponent = async uid => {
  try {
    const res = await apiInstance.post(`/${pluginId}/remove/component`, {uid});

    return res.data;
  } catch (error) {
    return null;
  }
};

/**
 * Server restart watcher
 * Sends an HEAD method to check if the server has been shut down correctly
 * and then pings until it's back on
 * @param response
 * @returns {object} the response data
 */
export const serverRestartWatcher = () => new Promise(resolve => {
  apiInstance({
    url: "/_health",
    method: "HEAD",
  })
    .then(() => {
      resolve();
    })
    .catch(() => {
      // eslint-disable-next-line promise/no-nesting
      setTimeout(() => serverRestartWatcher().then(resolve), 100);
    });
});
