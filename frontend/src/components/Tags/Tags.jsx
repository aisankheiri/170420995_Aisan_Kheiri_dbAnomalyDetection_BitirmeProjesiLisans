import React from 'react';
import {
  MediumOutlined,
  LinkedinOutlined,
  LinkOutlined,
  WhatsAppOutlined,
  PhoneOutlined,
  MailOutlined,
} from '@ant-design/icons';
import { Flex, Tag } from 'antd';

const Tags = () => (
  <Flex justify="center" style={{ marginY: 32 }}>
    <Flex gap="4px 16px" wrap>
      <a href="https://dataplatform.com.tr" target="_blank" rel="noopener noreferrer">
        <Tag icon={<LinkOutlined />} color="#0000ff">
          Dataplatform 
        </Tag>
      </a>
      <a href="https://www.whatsapp.com" target="_blank" rel="noopener noreferrer">
        <Tag icon={<WhatsAppOutlined />} color="#24CB63">
          Whatsapp
        </Tag>
      </a>
      <a href="https://dataplatform.medium.com/" target="_blank" rel="noopener noreferrer">
        <Tag icon={<MediumOutlined />} color="#3b5999">
          Medium
        </Tag>
      </a>
      <a href="https://www.linkedin.com/search/results/all/?fetchDeterministicClustersOnly=true&heroEntityKey=urn%3Ali%3Aorganization%3A18198387&keywords=data%20platform%20information%20technologies&origin=RICH_QUERY_TYPEAHEAD_HISTORY&position=0&searchId=305ed620-9979-4453-b8fd-54e332089665&sid=47i&spellCorrectionEnabled=true" target="_blank" rel="noopener noreferrer">
        <Tag icon={<LinkedinOutlined />} color="#0A63BC">
          LinkedIn
        </Tag>
      </a>
      <Tag icon={<PhoneOutlined />} color="#607b8b">
      0850 393 89 37
      </Tag>
      <a href="mailto:info@dataplatform.com.tr">
      <Tag icon={<MailOutlined />} color="#ff0000">
      info@dataplatform.com.tr 
      </Tag>
      </a>
    </Flex>
  </Flex>
);

export default Tags;