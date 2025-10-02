import React from "react";
import AppNavigation from "./components/app-navigation/app-navigation";
import "./index.css";

export { default as AppHeader } from "./components/app-header/app-header";
export type { AppHeaderTabName } from "./components/app-header/app-header";

function App() {
  return (
    <div className="app">
      <AppNavigation />
    </div>
  );
}

export default App;
