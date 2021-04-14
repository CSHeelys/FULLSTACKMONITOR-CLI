import React from "react";
import CustomCheckboxes from "./CustomCheckboxes";
import TabsOptions from "./TabsOptions";

export default function IntelligentHeader({
  filterLogs,
  deleteLogs,
  killServer,
  togglePause,
  pause,
  setCheckBoxes,
  checkBoxes,
  showCustom,
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
    </div>
  );
}
