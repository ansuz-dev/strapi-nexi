import React from "react";

import {Box} from "@strapi/design-system/Box";
import {BaseHeaderLayout} from "@strapi/design-system/Layout";

import {useIntl} from "react-intl";
import getTrad from "../../utils/getTrad";

const Header = () => {
  const {formatMessage} = useIntl();
  return (
    <Box background="neutral100">
      <BaseHeaderLayout
        title={formatMessage({
          id: getTrad("NexiPage.header.title"),
          defaultMessage: "Nexi",
        })}
        subtitle={formatMessage({
          id: getTrad("NexiPage.header.subtitle"),
          defaultMessage: "Create your site instantly",
        })}
        as="h2"
      />
    </Box>
  );
};

export default Header;
