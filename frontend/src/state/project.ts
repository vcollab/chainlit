import { atom } from 'recoil';

export const chatSettingsOpenState = atom<boolean>({
  key: 'chatSettingsOpen',
  default: false
});

export const chatSettingsSidebarOpenState = atom<boolean>({
  key: 'chatSettingsSidebarOpen',
  default: false
});

export type SidePanel = 'sources' | 'artifacts' | null;

export const activeSidePanelState = atom<SidePanel>({
  key: 'activeSidePanel',
  default: null
});
