/*
 *
 * HomePage
 *
 */

import React, {useCallback, useEffect, useRef, useState} from "react";
// import PropTypes from 'prop-types';

import {Box} from "@strapi/design-system/Box";
import {Button} from "@strapi/design-system/Button";

import {LoadingIndicatorPage, ContentBox} from "@strapi/helper-plugin";
import InformationSquare from "@strapi/icons/InformationSquare";
import FeatherSquare from "@strapi/icons/FeatherSquare";

import {useIntl} from "react-intl";

import Header from "../../components/NexiPage/Header";
import Info from "../../components/NexiPage/Info";

import pluginId from "../../pluginId";
import {getVersion, migrate, serverRestartWatcher} from "../../utils/api";
import getTrad from "../../utils/getTrad";

const HomePage = () => {
  const {formatMessage} = useIntl();
  const [newVersion, setNewVersion] = useState(false);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    const checkVersion = async () => {
      const data = await getVersion();
      setNewVersion(data.version !== data.installedVersion);
    };

    checkVersion();
  }, []);

  const handleMigrateClicked = useCallback(async () => {
    try {
      setProcessing(true);

      await migrate();
      await serverRestartWatcher();

      const data = await getVersion();

      setNewVersion(data.version !== data.installedVersion);
    } catch (err) {
      console.log(err);
    } finally {
      setProcessing(false);
    }
  }, []);

  return (
    <div>
      <Header />

      {processing ? (
        <LoadingIndicatorPage />
      ) : (
        <>
          {newVersion ? (
            <Box paddingLeft={8} paddingRight={8}>
              <ContentBox
                title={formatMessage({
                  id: "New version",
                  defaultMessage: "New version",
                })}
                subtitle={
                  <>
                    {
                      formatMessage({
                        id: getTrad("NexiPage.info.newversion"),
                        defaultMessage: "New version is installed! To finish progress, migrate components and content-types.",
                      })
                    }
                    <Box paddingTop={2}>
                      <Button
                        variant="secondary"
                        onClick={handleMigrateClicked}
                      >
                        {formatMessage({
                          id: getTrad("NexiPage.info.migrate"),
                          defaultMessage: "Migrate",
                        })}
                      </Button>
                    </Box>
                  </>
                }
                icon={<FeatherSquare />}
                iconBackground="alternative100"
              />
            </Box>
          ) : (
            <Box paddingLeft={8} paddingRight={8}>
              <ContentBox
                title={formatMessage({
                  id: "Information",
                  defaultMessage: "Information",
                })}
                subtitle={formatMessage({
                  id: getTrad("NexiPage.info.information"),
                  defaultMessage: "Choose components you need for your site.",
                })}
                icon={<InformationSquare />}
                iconBackground="primary100"
              />
            </Box>
          )}

          <Info />
        </>
      )}
    </div>
  );
};
export default HomePage;
