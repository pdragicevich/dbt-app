import ChecklistItem from '../models/ChecklistItem';
import Result from '../models/Result';
import SkillSearchResult from '../models/SkillSearchResult';

interface Database {
  findSkill: (_arg0: string) => Promise<SkillSearchResult[]>;
  getChecklistItems: () => Promise<ChecklistItem[]>;
  recordChecklistCheck: (_arg0: number, _arg1: boolean) => Promise<Result>;
  rebuild: () => Promise<Result>;
  saveMood: (_arg0: number) => Promise<Result>;
  saveGratitude: (_arg0: string[]) => Promise<Result>;
}

export default Database;
