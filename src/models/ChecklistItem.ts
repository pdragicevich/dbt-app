interface ChecklistItem {
  id: number;
  item: string;
  checked: boolean;
}

export default ChecklistItem;

export function checklistItemSort(a: ChecklistItem, b: ChecklistItem) {
  if (a.checked && !b.checked) {
    return 1;
  }
  if (!a.checked && b.checked) {
    return -1;
  }
  if (a.id > b.id) {
    return 1;
  }
  if (a.id < b.id) {
    return -1;
  }
  return 0;
}
