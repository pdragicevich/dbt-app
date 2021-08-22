import AppSettings from '../AppSettings/AppSettings';
import ChecklistItem from '../models/ChecklistItem';
import LogDef from '../models/LogDef';
import LogItem from '../models/LogItem';
import Result, { DataResult } from '../models/Result';
import Skill from '../models/Skill';
import SkillBrowserResult from '../models/SkillBrowserResult';
import SkillSearchResult from '../models/SkillSearchResult';
import Version from '../models/Version';

interface Database {
  findSkill: (
    searchTerm: string,
    maxResults: number,
  ) => Promise<SkillSearchResult[]>;
  getChecklistItems: (_arg0: number) => Promise<ChecklistItem[]>;
  getOptionLogItems: (_arg0: number) => Promise<LogItem[]>;
  getSkillById: (_arg0: number) => Promise<SkillSearchResult | null>;
  getSkillsCount: () => Promise<number>;
  getSkillsTitles: (
    _arg0: string[],
  ) => Promise<DataResult<SkillBrowserResult[]>>;
  insertAppLog: (severity: string, message: string) => Promise<Result>;
  readLogDef: (_arg0: number) => Promise<LogDef | null>;
  readLogDefs: () => Promise<LogDef[]>;
  readSettings: () => Promise<DataResult<AppSettings>>;
  rebuild: () => Promise<Result>;
  recordChecklistCheck: (_arg0: number, _arg1: boolean) => Promise<Result>;
  saveOptionLog: (_arg0: number, _arg1: number) => Promise<Result>;
  saveSkills: (_arg0: Skill[]) => Promise<Result>;
  saveTextLog: (_arg0: number, _arg1: string[]) => Promise<Result>;
  updateSkillContent: (_arg0: number, _arg1: string) => Promise<Result>;
  getVersion: () => Promise<Version>;
}

export default Database;
