import React, {useCallback} from "react";
import PropTypes from "prop-types";
import {useIntl} from "react-intl";
import styled from "styled-components";

import {pxToRem} from "@strapi/helper-plugin";
import {Tr, Td} from "@strapi/design-system/Table";
import {Button} from "@strapi/design-system/Button";
import {Typography} from "@strapi/design-system/Typography";
import {Flex} from "@strapi/design-system/Flex";

import Plus from "@strapi/icons/Plus";
import Cross from "@strapi/icons/Cross";

import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

import getTrad from "../../utils/getTrad";
import {addContentType, removeContentType} from "../../utils/api";

const StyledFontAwesomeIcon = styled(FontAwesomeIcon)`
  padding-right: ${pxToRem(8)};
`;

const ContentTypeItem = ({item, onChange}) => {
  const {formatMessage} = useIntl();

  const handleAddClicked = useCallback(async () => {
    console.log(item.uid);
    const res = await addContentType(item.uid);
    if (res) {
      // refresh plugin
      if (onChange) onChange();
    }
  }, [item.uid, onChange]);

  const handleRemoveClicked = useCallback(async () => {
    console.log(item.uid);
    const res = await removeContentType(item.uid);
    if (res) {
      // refresh plugin
      if (onChange) onChange();
    }
  }, [item.uid, onChange]);

  return (
    <Tr key={item.uid}>
      <Td>
        <StyledFontAwesomeIcon icon={item.icon} />
        <Typography textColor="neutral800">
          {item.displayName}
        </Typography>
      </Td>
      <Td>
        <Flex justifyContent="right" alignItems="right">
          {item.added ? (
            <Button
              startIcon={<Cross />}
              variant="danger-light"
              onClick={handleRemoveClicked}
            >
              {formatMessage({
                id: getTrad("NexiPage.info.removecontenttype"),
                defaultMessage: "Remove content type",
              })}
            </Button>
          ) : (
            <Button
              startIcon={<Plus />}
              variant="secondary"
              onClick={handleAddClicked}
            >
              {formatMessage({
                id: getTrad("NexiPage.info.addcontenttype"),
                defaultMessage: "Add content type",
              })}
            </Button>
          )}
        </Flex>
      </Td>
    </Tr>
  );
};

ContentTypeItem.propTypes = {
  item: PropTypes.object.isRequired,
  onChange: PropTypes.func,
};

export default ContentTypeItem;
