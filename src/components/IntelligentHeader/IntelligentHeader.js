import React from "react";
import CustomCheckboxes from "./CustomCheckboxes";
import TabsOptions from "./TabsOptions";

export default function IntelligentHeader({
  filterLogs,
  deleteLogs,
  setCheckBoxes,
  checkBoxes,
  showCustom,
}) {
  return (
    <div className="sticky-header">
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
    </div>
  );
}
