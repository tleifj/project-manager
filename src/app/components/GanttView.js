"use client";

import { useEffect, useRef } from "react";

export default function GanttView({ tasks }) {
  const containerRef = useRef(null);

  // Get the date range for all tasks
  const getDateRange = () => {
    let minDate = new Date();
    let maxDate = new Date();

    tasks.forEach(task => {
      if (task.startDate) {
        const startDate = new Date(task.startDate);
        if (startDate < minDate) minDate = startDate;
      }
      if (task.endDate) {
        const endDate = new Date(task.endDate);
        if (endDate > maxDate) maxDate = endDate;
      }
    });

    // Add padding of 2 days on each side
    minDate.setDate(minDate.getDate() - 2);
    maxDate.setDate(maxDate.getDate() + 2);

    return { minDate, maxDate };
  };

  // Calculate task position and width based on dates
  const calculateTaskStyle = (task) => {
    const { minDate, maxDate } = getDateRange();
    const totalDays = (maxDate - minDate) / (1000 * 60 * 60 * 24);
    
    const startDate = task.startDate ? new Date(task.startDate) : minDate;
    const endDate = task.endDate ? new Date(task.endDate) : maxDate;
    
    const daysFromStart = (startDate - minDate) / (1000 * 60 * 60 * 24);
    const duration = (endDate - startDate) / (1000 * 60 * 60 * 24);
    
    const left = (daysFromStart / totalDays) * 100;
    const width = (duration / totalDays) * 100;

    return {
      left: `${left}%`,
      width: `${width}%`,
    };
  };

  // Generate month labels
  const generateMonthLabels = () => {
    const { minDate, maxDate } = getDateRange();
    const months = [];
    let currentDate = new Date(minDate);

    while (currentDate <= maxDate) {
      months.push({
        label: currentDate.toLocaleString('default', { month: 'short', year: '2-digit' }),
        position: ((currentDate - minDate) / (maxDate - minDate)) * 100
      });
      currentDate.setMonth(currentDate.getMonth() + 1);
    }

    return months;
  };

  return (
    <div className="w-full overflow-x-auto">
      <div className="min-w-[800px] p-4">
        {/* Timeline header */}
        <div className="h-8 relative border-b mb-4">
          {generateMonthLabels().map((month, index) => (
            <div
              key={index}
              className="absolute text-sm text-gray-600"
              style={{ left: `${month.position}%` }}
            >
              {month.label}
            </div>
          ))}
        </div>

        {/* Tasks */}
        <div className="space-y-2">
          {tasks.map((task) => (
            <div key={task.id} className="relative h-8 group">
              <div className="absolute inset-y-0 left-0 right-0 bg-gray-100 group-hover:bg-gray-200" />
              <div
                className={`absolute h-6 top-1 rounded status-${task.statusId} group-hover:brightness-95`}
                style={calculateTaskStyle(task)}
              >
                <div className="px-2 truncate text-sm">
                  {task.name}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
