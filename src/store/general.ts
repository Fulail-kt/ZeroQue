import { create } from "zustand";

interface CompanyState {
  companyId: string | null;
  companyRoute: string | null; 
  setCompanyData: (id: string, name: string) => void;
  clearCompanyData: () => void;
}

const useCompanyStore = create<CompanyState>((set) => ({
  companyId: null,
  companyRoute: null,
  setCompanyData: (id, name) =>
    set({
      companyId: id,
      companyRoute: name,
    }),
  clearCompanyData: () =>
    set({
      companyId: null,
      companyRoute: null,
    }),
}));

export default useCompanyStore;
