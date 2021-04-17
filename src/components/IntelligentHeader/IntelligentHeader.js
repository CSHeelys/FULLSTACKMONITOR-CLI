import React from "react";
import CustomCheckboxes from "./CustomCheckboxes";
import TabsOptions from "./TabsOptions";
import Dashboard from "./Dashboard";

export default function IntelligentHeader({
  filterLogs,
  deleteLogs,
  logs,
  hardwareInfo,
  killServer,
  togglePause,
  pause,
  setCheckBoxes,
  checkBoxes,
  showCustom,
  showDashboard
}) {
  return (
    <div className="sticky-header">
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
          hardwareInfo={hardwareInfo}
        />
      )}
    </div>
  );
}
