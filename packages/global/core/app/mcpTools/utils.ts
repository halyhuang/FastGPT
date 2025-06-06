import { NodeOutputKeyEnum, WorkflowIOValueTypeEnum } from '../../workflow/constants';
import {
  FlowNodeInputTypeEnum,
  FlowNodeOutputTypeEnum,
  FlowNodeTypeEnum
} from '../../workflow/node/constant';
import { nanoid } from 'nanoid';
import { ToolType } from '../type';
import { i18nT } from '../../../../web/i18n/utils';
import { RuntimeNodeItemType } from '../../workflow/runtime/type';

export const getMCPToolSetRuntimeNode = ({
  url,
  toolList,
  name,
  avatar
}: {
  url: string;
  toolList: ToolType[];
  name?: string;
  avatar?: string;
}): RuntimeNodeItemType => {
  return {
    nodeId: nanoid(16),
    flowNodeType: FlowNodeTypeEnum.toolSet,
    avatar,
    intro: 'MCP Tools',
    inputs: [
      {
        key: 'toolSetData',
        label: 'Tool Set Data',
        valueType: WorkflowIOValueTypeEnum.object,
        renderTypeList: [FlowNodeInputTypeEnum.hidden],
        value: { url, toolList }
      }
    ],
    outputs: [],
    name: name || '',
    version: ''
  };
};

export const getMCPToolRuntimeNode = ({
  tool,
  url,
  avatar = 'core/app/type/mcpToolsFill'
}: {
  tool: ToolType;
  url: string;
  avatar?: string;
}): RuntimeNodeItemType => {
  return {
    nodeId: nanoid(16),
    flowNodeType: FlowNodeTypeEnum.tool,
    avatar,
    intro: tool.description,
    inputs: [
      {
        key: 'toolData',
        label: 'Tool Data',
        valueType: WorkflowIOValueTypeEnum.object,
        renderTypeList: [FlowNodeInputTypeEnum.hidden],
        value: { ...tool, url }
      },
      ...Object.entries(tool.inputSchema?.properties || {}).map(([key, value]) => ({
        key,
        label: key,
        valueType: value.type as WorkflowIOValueTypeEnum,
        description: value.description,
        toolDescription: value.description || key,
        required: tool.inputSchema?.required?.includes(key) || false,
        renderTypeList: [
          value.type === 'string'
            ? FlowNodeInputTypeEnum.input
            : value.type === 'number'
              ? FlowNodeInputTypeEnum.numberInput
              : value.type === 'boolean'
                ? FlowNodeInputTypeEnum.switch
                : FlowNodeInputTypeEnum.JSONEditor
        ]
      }))
    ],
    outputs: [
      {
        id: NodeOutputKeyEnum.rawResponse,
        key: NodeOutputKeyEnum.rawResponse,
        required: true,
        label: i18nT('workflow:raw_response'),
        description: i18nT('workflow:tool_raw_response_description'),
        valueType: WorkflowIOValueTypeEnum.any,
        type: FlowNodeOutputTypeEnum.static
      }
    ],
    name: tool.name,
    version: ''
  };
};
