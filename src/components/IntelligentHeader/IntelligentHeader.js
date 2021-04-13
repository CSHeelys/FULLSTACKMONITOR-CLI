import React from "react";
import CustomCheckboxes from "./CustomCheckboxes";
import TabsOptions from "./TabsOptions";
import Dashboard from "./Dashboard";

export default function IntelligentHeader({
  filterLogs,
  deleteLogs,
  logs,
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
