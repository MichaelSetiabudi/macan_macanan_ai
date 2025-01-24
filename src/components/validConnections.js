const VALID_CONNECTIONS = [
    // Vertical connections
    ["A1", "A2"],
    ["A2", "A3"],
    ["A4", "A5"],
    ["A5", "A6"],
    ["B1", "B2"],
    ["B2", "B3"],
    ["B4", "B5"],
    ["B5", "B6"],

    // Horizontal connections as per image
    ["A4", "C3"],
    ["A5", "C3"],
    ["A6", "C3"],
    ["B1", "C23"],
    ["B2", "C23"],
    ["B3", "C23"],

    // Diagonal connections
    ["A1", "A4"],
    ["A2", "A5"],
    ["A3", "A6"],
    ["B4", "B1"],
    ["C5", "C9"],
    ["B5", "B2"],
    ["B6", "B3"],

    ["C1", "C7"],
    ["C3", "C7"],
    ["C3", "C9"],
    ["C5", "C9"],

    ["C11", "C7"],
    ["C13", "C7"],
    ["C13", "C9"],
    ["C15", "C9"],

    ["C15", "C19"],
    ["C13", "C19"],
    ["C13", "C17"],
    ["C11", "C17"],

    ["C21", "C17"],
    ["C23", "C17"],
    ["C23", "C19"],
    ["C25", "C19"],

    ...generateCenterGridConnections(),
];

function generateCenterGridConnections() {
    const connections = [];

    for (let row = 0; row < 5; row++) {
        for (let col = 0; col < 4; col++) {
            const current = `C${row * 5 + col + 1}`;
            const next = `C${row * 5 + col + 2}`;
            connections.push([current, next]);
        }
    }

    for (let col = 0; col < 5; col++) {
        for (let row = 0; row < 4; row++) {
            const current = `C${row * 5 + col + 1}`;
            const below = `C${(row + 1) * 5 + col + 1}`;
            connections.push([current, below]);
        }
    }

    const diagonals = [
        ["C3", "C8"],
        ["C8", "C13"],
        ["C13", "C18"],
        ["C18", "C23"],
        ["C4", "C9"],
        ["C9", "C14"],
        ["C14", "C19"],
        ["C19", "C24"],
        ["C5", "C10"],
        ["C10", "C15"],
        ["C15", "C20"],
        ["C20", "C25"],
    ];
    connections.push(...diagonals);

    return connections;
}

const isValidConnection = (p1, p2) => {
    const connection = [p1.id, p2.id].sort().join("-");
    return VALID_CONNECTIONS.some(([start, end]) => {
        const validConnection = [start, end].sort().join("-");
        return connection === validConnection;
    });
};

export { VALID_CONNECTIONS, isValidConnection }