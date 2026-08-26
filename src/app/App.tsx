// 12. QueryProvider와 AppRouter를 포함한 최상위 App 컴포넌트
// src/app/App.tsx
import { QueryProvider } from './providers/query-client-provider';
import { AppRouter } from './routes/app-router';

function App() {
  return (
    <QueryProvider>
      <AppRouter />
    </QueryProvider>
  );
}

export default App;
