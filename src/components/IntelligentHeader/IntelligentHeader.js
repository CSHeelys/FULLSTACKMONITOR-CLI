import React from "react";
import CustomCheckboxes from "./CustomCheckboxes";
import TabsOptions from "./TabsOptions";
import Dashboard from "./Dashboard";

export default function IntelligentHeader({
  filterLogs,
  deleteLogs,
  logs,
  killServer,
  togglePause,
  pause,
  setCheckBoxes,
  checkBoxes,
  showCustom,
  showDashboard
}) {
  return (
    <div>
      <TabsOptions
        deleteLogs={deleteLogs}
        filterLogs={filterLogs}
        killServer={killServer}
        togglePause={togglePause}
        pause={pause}
      />
      {showCustom && (
        <CustomCheckboxes
          checkBoxes={checkBoxes}
          setCheckBoxes={setCheckBoxes}
        />
      )}
      {showDashboard && (
        <Dashboard
          logs={logs}
        />
      )}
    </div>
  );
}
