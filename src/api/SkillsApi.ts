import Skill from '../models/Skill';
import inMemorySettings from '../AppSettings/InMemorySettings';
import { dataResult } from '../models/Result';

const getSkillsSummary = async () => {
  try {
    const url = inMemorySettings.skillsApiUrl + '/Skills';
    console.log('getSkillsSummary url', url);
    const response = await fetch(url);
    if (!response.ok) {
      return Promise.resolve(dataResult(false, [], 'response not ok'));
    }
    const data = (await response.json()) as Skill[];
    return dataResult(true, data);
  } catch (ex) {
    return Promise.resolve(dataResult(false, [], ex));
  }
};

const SkillsApi = { getSkillsSummary };

export default SkillsApi;
