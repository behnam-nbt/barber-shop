"use client";

import { useState } from "react";

const headCoaches = ["بهنام", "خانم شهریاری", "آقای احسانی"];

const members = [
    "آقای رسولی", "خانم مروت", "خانم رویا", "خانم خدادادی", "خانم سارا", "خانم ناهید", "خانم ندا", "خانم شادی"
];

function shuffleArray(array) {
    return array.sort(() => Math.random() - 0.5);
}

function Portfolio() {
    const [groups, setGroups] = useState([]);

    const generateGroups = () => {
        const shuffledMembers = shuffleArray([...members]); // Shuffle non-coach members
        const shuffledCoaches = shuffleArray([...headCoaches]); // Shuffle head coaches
        const groupSizes = shuffleArray([4, 4, 3]); // Randomize which group will have 3 members

        let startIndex = 0;
        const newGroups = groupSizes.map((size, i) => {
            const group = [shuffledCoaches[i], ...shuffledMembers.slice(startIndex, startIndex + size - 1)];
            startIndex += size - 1;
            return group;
        });

        setGroups(newGroups);
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

export default Portfolio