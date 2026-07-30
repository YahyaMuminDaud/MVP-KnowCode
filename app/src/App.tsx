import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Layout } from "./components/Layout";
import { ProblemList } from "./pages/ProblemList";
import { ProblemWorkspace } from "./pages/ProblemWorkspace";
import { ProgressProvider } from "./lib/ProgressContext";

function App() {
  return (
    <ProgressProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<ProblemList />} />
            <Route path="/problems/:problemId" element={<ProblemWorkspace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ProgressProvider>
  );
}

export default App;
