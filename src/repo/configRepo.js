import { VALID_TOOL_CONFIGS } from '@/lib/constants';
import axios from 'axios';

export async function getToolData(tool) {
  const fileName = `${ tool }.json`;
  const { data } = await axios(`/data/${ fileName }`);
  return data;
}

const configRepo = {
  async getConfig(tools) {
    const validTools = tools
      .split(',')
      .filter(tool => VALID_TOOL_CONFIGS.includes(tool));

    if (validTools.length === 0) {
      const toolToUse = VALID_TOOL_CONFIGS[0];
      validTools.push(toolToUse);
      console.warn(`No (valid) tool provided, falling back to ${ toolToUse.name }`);
    }

    return Promise.all(validTools.map(getToolData))
      .then(toolData => {
        return { ...toolData[0] };
      });
  },
};

export default configRepo;
