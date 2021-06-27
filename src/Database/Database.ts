import ChecklistItem from '../models/ChecklistItem';
import Result from '../models/Result';
import SkillSearchResult from '../models/SkillSearchResult';

interface Database {
  findSkill: (_arg0: string) => Promise<SkillSearchResult[]>;
  getChecklistItems: () => Promise<ChecklistItem[]>;
  rebuild: () => Promise<Result>;
}

export default Database;
