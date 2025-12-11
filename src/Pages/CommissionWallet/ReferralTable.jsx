// src/components/ReferralTable.jsx
import React from "react";

export default function ReferralTable({ history }) {
    if (!history || history.length === 0) {
        return (
            <div className="text-gray-400 text-center py-10">
                No transactions yet. Share your referral code to start earning.
            </div>
        );
    }

    return (
        <div className="overflow-x-auto">
            <table className="w-full text-left">
                <thead className="border-b border-gray-200">
                    <tr>
                        <th className="pb-2 text-sm text-gray-500">Date</th>
                        <th className="pb-2 text-sm text-gray-500">Type</th>
                        <th className="pb-2 text-sm text-gray-500 text-right">Amount</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {history.map((entry) => (
                        <tr key={entry.id}>
                            <td className="py-3 text-gray-700">{entry.date}</td>
                            <td className="py-3 text-gray-700">{entry.type}</td>
                            <td
                                className={`py-3 text-right font-semibold ${entry.direction === "credit" ? "text-green-600" : "text-red-600"
                                    }`}
                            >
                                {entry.direction === "credit" ? "+" : "-"}
                                {Math.abs(entry.amount)} birr
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
