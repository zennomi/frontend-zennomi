// routes
import Router from './routes';
import CacheBuster from 'react-cache-buster';
import { version } from '../package.json';
// theme
import ThemeProvider from './theme';
// components
import RtlLayout from './components/RtlLayout';
import ScrollToTop from './components/ScrollToTop';
import { ProgressBarStyle } from './components/ProgressBar';
import NotistackProvider from './components/NotistackProvider';
import ThemeColorPresets from './components/ThemeColorPresets';
import MotionLazyContainer from './components/animate/MotionLazyContainer';
import LoadingScreen from './components/LoadingScreen';

// ----------------------------------------------------------------------

export default function App() {
  const isProduction = process.env.NODE_ENV === 'production';
  return (
    <CacheBuster
      currentVersion={version}
      isEnabled={isProduction} //If false, the library is disabled.
      isVerboseMode={false} //If true, the library writes verbose logs to console.
      loadingComponent={<LoadingScreen fullSrceen />} //If not pass, nothing appears at the time of new version check.
    >
      <ThemeProvider>
        <ThemeColorPresets>
          <RtlLayout>
            <NotistackProvider>
              <MotionLazyContainer>
                <ProgressBarStyle />
                <ScrollToTop />
                <Router />
              </MotionLazyContainer>
            </NotistackProvider>
          </RtlLayout>
        </ThemeColorPresets>
      </ThemeProvider>
    </CacheBuster>
  );
}
