"use client";

import { useState } from "react";

const headCoaches = ["بهنام", "خانم شهریاری", "آقای احسانی"];

// Fixed group for خانم شهریاری
const fixedGroup = ["خانم شهریاری", "خانم سارا", "خانم خدادادی"];

// Remaining members excluding those in خانم شهریاری's group
const members = [
    "آقای رسولی", "خانم مروت", "خانم رویا",
    "خانم ناهید", "خانم ندا", "خانم شادی"
];

function shuffleArray(array) {
    return array.sort(() => Math.random() - 0.5);
}

export default function Portfolio() {
    const [groups, setGroups] = useState([]);

    const generateGroups = () => {
        const shuffledMembers = shuffleArray([...members]); // Shuffle remaining members
        const shuffledCoaches = shuffleArray(["بهنام", "آقای احسانی"]); // Shuffle the 2 remaining coaches

        // Divide remaining members into two groups of 4
        const group1 = [shuffledCoaches[0], ...shuffledMembers.slice(0, 3)];
        const group2 = [shuffledCoaches[1], ...shuffledMembers.slice(3, 6)];

        setGroups([fixedGroup, group1, group2]);
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4">
            <h1 className="text-2xl font-bold mb-4">Frontend Team Randomizer</h1>
            <button
                onClick={generateGroups}
                className="px-4 py-2 bg-blue-500 text-white rounded"
            >
                Generate Random Groups
            </button>
            {groups.length > 0 && (
                <div className="mt-4">
                    {groups.map((group, index) => (
                        <div key={index} className="mb-3">
                            <h2 className="text-lg font-semibold">Group {index + 1}</h2>
                            <ul className="list-disc pl-5">
                                {group.map((member, i) => (
                                    <li key={member} className={i === 0 ? "font-bold text-red-500" : ""}>
                                        {member}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
