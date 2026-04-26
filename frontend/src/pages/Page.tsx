import { Navigate } from 'react-router-dom';
import { useRecoilValue } from 'recoil';

import {
  loadingState,
  sideViewState,
  useAuth,
  useConfig
} from '@chainlit/react-client';

import ChatSettingsSidebar from '@/components/ChatSettings/ChatSettingsSidebar';
import ElementSideView from '@/components/ElementSideView';
import LeftSidebar from '@/components/LeftSidebar';
import ProgressBar from '@/components/ProgressBar';
import ArtifactsPanel from '@/components/SidePanel/ArtifactsPanel';
import { PanelErrorBoundary } from '@/components/SidePanel/ErrorBoundary';
import SourcesPanel from '@/components/SidePanel/SourcesPanel';
import { TaskList } from '@/components/Tasklist';
import { Header } from '@/components/header';
import { ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';

import { activeSidePanelState } from '@/state/project';
import { userEnvState } from 'state/user';

type Props = {
  children: JSX.Element;
};

const Page = ({ children }: Props) => {
  const { config } = useConfig();
  const { data } = useAuth();
  const userEnv = useRecoilValue(userEnvState);
  const sideView = useRecoilValue(sideViewState);
  const activePanel = useRecoilValue(activeSidePanelState);
  const loading = useRecoilValue(loadingState);

  if (config?.userEnv) {
    for (const key of config.userEnv || []) {
      if (!userEnv[key]) return <Navigate to="/env" />;
    }
  }

  const showSettingsSidebar = config?.ui?.chat_settings_location === 'sidebar';

  const mainContent = (
    <div className="flex flex-col h-full w-full">
      <Header />
      {loading ? <ProgressBar /> : null}
      <ResizablePanelGroup
        direction="horizontal"
        className="flex flex-row flex-grow"
      >
        <ResizablePanel
          className="flex flex-col h-full w-full"
          minSize={40}
          defaultSize={60}
        >
          <div className="flex flex-row flex-grow overflow-auto">
            {children}
          </div>
        </ResizablePanel>
        {activePanel === 'sources' ? (
          <PanelErrorBoundary name="Sources">
            <SourcesPanel />
          </PanelErrorBoundary>
        ) : activePanel === 'artifacts' ? (
          <PanelErrorBoundary name="Artifacts">
            <ArtifactsPanel />
          </PanelErrorBoundary>
        ) : sideView ? (
          <ElementSideView />
        ) : (
          <TaskList isMobile={false} />
        )}
        {showSettingsSidebar && <ChatSettingsSidebar />}
      </ResizablePanelGroup>
    </div>
  );

  const historyEnabled = config?.dataPersistence && data?.requireLogin;
  const sidebarHidden = config?.ui?.default_sidebar_state === 'hidden';

  return (
    <SidebarProvider
      defaultOpen={config?.ui.default_sidebar_state !== 'closed'}
    >
      {historyEnabled && !sidebarHidden ? (
        <>
          <LeftSidebar />
          <SidebarInset className="max-h-svh min-w-0">
            {mainContent}
          </SidebarInset>
        </>
      ) : (
        <div className="h-screen w-screen flex">{mainContent}</div>
      )}
    </SidebarProvider>
  );
};

export default Page;
