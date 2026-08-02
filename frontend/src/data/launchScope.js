const DEFAULT_LAUNCH_BRANCH_IDS = ["anna-nagar", "virugambakkam"];

export const LAUNCH_SCOPE_STORAGE_KEY = "pg_admin_launch_scope";

const normalizeBranchId = (branchId) => String(branchId || "").replace(/-pg$/, "");

const readStoredBranchIds = () => {
  try {
    const stored = JSON.parse(localStorage.getItem(LAUNCH_SCOPE_STORAGE_KEY));
    if (Array.isArray(stored)) {
      const ids = [...new Set(stored.map(normalizeBranchId).filter(Boolean))];
      if (ids.length) return ids;
    }
  } catch (error) {
    // Ignore malformed stored value and fall back to defaults.
  }
  return DEFAULT_LAUNCH_BRANCH_IDS;
};

export const LAUNCH_BRANCH_IDS = new Set(readStoredBranchIds());

export const getLaunchBranchIds = () => [...LAUNCH_BRANCH_IDS];

export const registerLaunchBranchIds = (branchIds) => {
  let changed = false;
  (branchIds || []).forEach((id) => {
    const normalized = normalizeBranchId(id);
    if (normalized && !LAUNCH_BRANCH_IDS.has(normalized)) {
      LAUNCH_BRANCH_IDS.add(normalized);
      changed = true;
    }
  });
  if (changed) {
    localStorage.setItem(LAUNCH_SCOPE_STORAGE_KEY, JSON.stringify([...LAUNCH_BRANCH_IDS]));
    window.dispatchEvent(new CustomEvent("pg:launch-scope-updated", { detail: { branchIds: [...LAUNCH_BRANCH_IDS] } }));
  }
};

export const isLaunchBranchId = (branchId) => LAUNCH_BRANCH_IDS.has(normalizeBranchId(branchId));

export const onlyLaunchRecords = (records, field = "branchId") => records.filter((record) => isLaunchBranchId(record[field]));

export const LAUNCH_AREAS = ["Anna Nagar", "Virugambakkam"];
