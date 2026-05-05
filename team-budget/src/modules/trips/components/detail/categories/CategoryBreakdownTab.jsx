import React from "react";

import {
  getCategoryByKey,
  getCategoryColor,
} from "../../../utils/tripCategories";
import { formatMoney } from "../../../utils/tripMoney";

export default function CategoryBreakdownTab({ trip, categoryTotals }) {
  const total = Object.values(categoryTotals).reduce(
    (sum, value) => sum + value,
    0
  );

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <h3 className="mb-4 font-bold text-gray-900">Spending by category</h3>

      <div className="space-y-4">
        {Object.entries(categoryTotals).map(([categoryKey, amount]) => {
          const category = getCategoryByKey(trip, categoryKey);
          const color = getCategoryColor(category);
          const width =
            total > 0 ? `${Math.min((amount / total) * 100, 100)}%` : "0%";

          return (
            <div key={categoryKey}>
              <div className="mb-1 flex justify-between text-sm font-semibold">
                <span>{category.name}</span>
                <span>{formatMoney(amount)}</span>
              </div>

              <div className="h-2 rounded-full bg-gray-200">
                <div
                  className={`h-2 rounded-full ${color.bar}`}
                  style={{ width }}
                />
              </div>
            </div>
          );
        })}

        {Object.keys(categoryTotals).length === 0 && (
          <div className="py-10 text-center text-sm text-gray-500">
            No category spending yet.
          </div>
        )}

        <div className="border-t border-gray-200 pt-3">
          <div className="flex justify-between font-bold text-gray-900">
            <span>Total</span>
            <span>{formatMoney(total)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
