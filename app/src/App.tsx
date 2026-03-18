import { Content, JiraLensErrorBoundary } from "./jira-lens/content";
import "./global-styles/0-index.scss"

function App() {
  return (
    <JiraLensErrorBoundary>
      <Content />
    </JiraLensErrorBoundary>
  );
}

export default App
