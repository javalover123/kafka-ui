import React, { Suspense, useCallback } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { clusterPath, getNonExactPath } from 'lib/paths';
import Nav from 'components/Nav/Nav';
import PageLoader from 'components/common/PageLoader/PageLoader';
import Dashboard from 'components/Dashboard/Dashboard';
import ClusterPage from 'components/Cluster/Cluster';
import Version from 'components/Version/Version';
import { ThemeProvider } from 'styled-components';
import { theme, darkTheme } from 'theme/theme';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { showServerError } from 'lib/errorHandling';
import { Toaster } from 'react-hot-toast';
import GlobalCSS from 'components/global.css';
import * as S from 'components/App.styled';
import Logo from 'components/common/Logo/Logo';
import GitIcon from 'components/common/Icons/GitIcon';
import DiscordIcon from 'components/common/Icons/DiscordIcon';

import ConfirmationModal from './common/ConfirmationModal/ConfirmationModal';
import { ConfirmContextProvider } from './contexts/ConfirmContext';
import { GlobalSettingsProvider } from './contexts/GlobalSettingsContext';
import Switch from './common/Switch/Switch';
import SunIcon from './common/Icons/SunIcon';
import MoonIcon from './common/Icons/MoonIcon';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      suspense: true,
    },
    mutations: {
      onError(error) {
        showServerError(error as Response);
      },
    },
  },
});

const App: React.FC = () => {
  const [isSidebarVisible, setIsSidebarVisible] = React.useState(false);
  const onBurgerClick = () => setIsSidebarVisible(!isSidebarVisible);
  const closeSidebar = useCallback(() => setIsSidebarVisible(false), []);
  const location = useLocation();
  const [isDarkMode, setIsDarkMode] = React.useState<boolean>(false);

  React.useEffect(() => {
    closeSidebar();
  }, [location, closeSidebar]);

  React.useLayoutEffect(() => {
    const dark = JSON.parse(localStorage.getItem('darkMode') as string);
    setIsDarkMode(dark);
  }, []);

  const handleSwitch = () => {
    if (isDarkMode) {
      localStorage.setItem('darkMode', 'false');
      setIsDarkMode(false);
    } else {
      localStorage.setItem('darkMode', 'true');
      setIsDarkMode(true);
    }
  };
  return (
    <QueryClientProvider client={queryClient}>
      <GlobalSettingsProvider>
        <ThemeProvider theme={isDarkMode ? darkTheme : theme}>
          <ConfirmContextProvider>
            <GlobalCSS />
            <S.Layout>
              <S.Navbar role="navigation" aria-label="Page Header">
                <S.NavbarBrand>
                  <S.NavbarBrand>
                    <S.NavbarBurger
                      onClick={onBurgerClick}
                      onKeyDown={onBurgerClick}
                      role="button"
                      tabIndex={0}
                      aria-label="burger"
                    >
                      <S.Span role="separator" />
                      <S.Span role="separator" />
                      <S.Span role="separator" />
                    </S.NavbarBurger>

                    <S.Hyperlink to="/">
                      <Logo />
                      UI for Apache Kafka
                    </S.Hyperlink>

                    <S.NavbarItem>
                      <Version />
                    </S.NavbarItem>
                  </S.NavbarBrand>
                </S.NavbarBrand>
                <S.NavbarSocial>
                  <Switch
                    name="switchRoundedDefault"
                    checked={isDarkMode}
                    onChange={handleSwitch}
                    checkedIcon={<MoonIcon />}
                    unCheckedIcon={<SunIcon />}
                  />
                  <S.LogoutLink href="/logout">
                    <S.LogoutButton buttonType="primary" buttonSize="M">
                      Log out
                    </S.LogoutButton>
                  </S.LogoutLink>
                  <S.SocialLink
                    href="https://github.com/provectus/kafka-ui"
                    target="_blank"
                  >
                    <GitIcon />
                  </S.SocialLink>
                  <S.SocialLink
                    href="https://discord.com/invite/4DWzD7pGE5"
                    target="_blank"
                  >
                    <DiscordIcon />
                  </S.SocialLink>
                </S.NavbarSocial>
              </S.Navbar>

              <S.Container>
                <S.Sidebar aria-label="Sidebar" $visible={isSidebarVisible}>
                  <Suspense fallback={<PageLoader />}>
                    <Nav />
                  </Suspense>
                </S.Sidebar>
                <S.Overlay
                  $visible={isSidebarVisible}
                  onClick={closeSidebar}
                  onKeyDown={closeSidebar}
                  tabIndex={-1}
                  aria-hidden="true"
                  aria-label="Overlay"
                />
                <Routes>
                  {['/', '/ui', '/ui/clusters'].map((path) => (
                    <Route
                      key="Home" // optional: avoid full re-renders on route changes
                      path={path}
                      element={<Dashboard />}
                    />
                  ))}
                  <Route
                    path={getNonExactPath(clusterPath())}
                    element={<ClusterPage />}
                  />
                </Routes>
              </S.Container>
              <Toaster position="bottom-right" />
            </S.Layout>
            <ConfirmationModal />
          </ConfirmContextProvider>
        </ThemeProvider>
      </GlobalSettingsProvider>
    </QueryClientProvider>
  );
};

export default App;
