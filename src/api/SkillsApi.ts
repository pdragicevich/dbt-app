import AppSettings from '../AppSettings/AppSettings';
import { dataResult } from '../models/Result';
import Skill from '../models/Skill';

const getSkillsSummary = async (settings: AppSettings) => {
  try {
    const url = settings.skillsApiUrl + '/Skills';
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

const getSkillDetail = async (settings: AppSettings, fileId: string) => {
  try {
    const url = settings.skillsApiUrl + '/Skills/' + fileId;
    const response = await fetch(url);
    if (!response.ok) {
      return dataResult(false, null, 'response not ok');
    }
    const data = (await response.json()) as Skill;
    return dataResult(true, data);
  } catch (ex) {
    return dataResult(false, null, ex);
  }
};

const SkillsApi = { getSkillDetail, getSkillsSummary };

export default SkillsApi;
