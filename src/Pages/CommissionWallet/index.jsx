// src/components/ReferralDashboard.jsx

import React, { useEffect, useState } from "react";
import { Clipboard, RefreshCw } from "lucide-react";
import ReferralTable from "./ReferralTable"; // we'll make this reusable

// Summary Card Component
const SummaryCard = ({ title, value }) => (
    <div className="bg-white shadow rounded-lg p-6 flex flex-col">
        <span className="text-sm text-gray-500">{title}</span>
        <span className="mt-2 text-4xl font-bold text-gray-900">{value} birr</span>
    </div>
);

// Referral Link Component
const ReferralLink = ({ link, onCopy }) => (
    <div className="bg-white shadow rounded-lg p-6 flex flex-col space-y-2">
        <span className="text-gray-700 font-medium">Your Referral Link</span>
        <div className="flex flex-col sm:flex-row">
            <input
                type="text"
                readOnly
                value={link}
                className="flex-grow border border-gray-300 rounded-l-lg px-4 py-2 text-sm text-gray-700 bg-gray-50 mb-2 sm:mb-0"
            />
            <button
                onClick={onCopy}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-r-lg flex items-center gap-2"
            >
                <Clipboard size={16} /> Copy / Share
            </button>
        </div>
    </div>
);

// Action Buttons Component
const ActionButtons = ({ actions }) => (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {actions.map((name) => (
            <button
                key={name}
                disabled
                className="bg-gray-200 text-gray-500 py-3 rounded-lg cursor-not-allowed flex items-center justify-center"
                title="Coming soon"
            >
                {name}
            </button>
        ))}
    </div>
);

export default function ReferralDashboard() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [referralLink, setReferralLink] = useState('');

    const [balances, setBalances] = useState({
        available: 1240,
        lifetime: 3580,
    });

    const [history, setHistory] = useState([
        { id: 1, date: "2025-12-10", type: "Referral Earning", amount: 500, direction: "credit" },
        { id: 2, date: "2025-12-09", type: "Adjustment", amount: -60, direction: "debit" },
    ]);

    

    useEffect(() => {
        const customer = JSON.parse(localStorage.getItem("customer"));
        if (!customer || !customer.userAttributes) return;

        const referralAttr = customer.userAttributes.find(
            (attr) => attr.Name === "custom:referral_code"
        );

        if (referralAttr) {
            setReferralLink(`${window.location.origin}/signup?refCode=${referralAttr.Value}`);
        }
    }, []);


    function copyReferralLink() {
        navigator.clipboard.writeText(referralLink);
        alert("Referral link copied to clipboard!");
    }

    return (
        <div className="min-h-screen flex flex-col bg-[#FAF9FE] pt-24 sm:pt-32 pb-10 px-4">
            <main className="flex-grow md:px-10 space-y-8">

                {/* Header */}
                <header className="flex items-center justify-between">
                    <h1 className="text-3xl font-semibold text-gray-800">Commission Wallet</h1>
                    <button
                        onClick={() => { }}
                        className="p-2 rounded hover:bg-gray-200"
                        title="Refresh"
                    >
                        <RefreshCw size={24} />
                    </button>
                </header>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <SummaryCard title="Total Commission Available" value={balances.available} />
                    <SummaryCard title="Lifetime Commission Earned" value={balances.lifetime} />
                </div>

                {/* Referral Link */}
                <ReferralLink link={referralLink} onCopy={copyReferralLink} />

                {/* Action Buttons */}
                <ActionButtons actions={["Withdraw", "Convert to Airtime", "Convert to Credits", "Donate"]} />

                {/* Commission History */}
                <div className="bg-white shadow rounded-lg p-6">
                    <h2 className="text-xl font-semibold mb-4">Commission History</h2>
                    <ReferralTable history={history} />
                </div>

                {/* Error / Loading */}
                {error && <div className="text-red-600 text-center mt-4">{error}</div>}
                {loading && <div className="text-gray-500 text-center mt-4">Loading...</div>}

            </main>
        </div>
    );
}
