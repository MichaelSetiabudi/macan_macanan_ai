function initializeBoard() {
    return {
        pieces: [{
                id: "macan_1",
                type: "macan",
                patternId: "macanPattern1",
                position: null,
                x: 25,
                y: 87,
            },
            {
                id: "macan_2",
                type: "macan",
                patternId: "macanPattern2",
                position: null,
                x: 35,
                y: 87,
            },
            ...Array(8)
            .fill()
            .map((_, i) => ({
                id: `anak_${i + 1}`,
                type: "anak",
                patternId: `anakPattern${(i % 8) + 1}`,
                position: null,
                x: 45 + i * 8.75,
                y: 87,
            })),
        ],
    };
}

export { initializeBoard }