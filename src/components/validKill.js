/*
    villagerPositionThatCanBeAttackedByTiger itu array yang nampung titik titik yang bisa ditempati villager
    & di-kill oleh tiger. Jadi nanti dicek. Nanti dicek kalo tile yang dipilih tiger itu indexnya genap berarti move killnya
    50% valid. Lalu dicek lagi apabila semua tile yang dilompati oleh tiger itu ada villagernya, berarti move killnya
    100% valid.
*/
const validKill = [
    //A1-A6 left area
    {
        tigerPosition: 'A1',
        villagerPositionThatCanBeAttackedByTiger: ['A4', 'C3', 'C9']
    },
    {
        tigerPosition: 'A3',
        villagerPositionThatCanBeAttackedByTiger: ['A6', 'C3', 'C7']
    },
    {
        tigerPosition: 'A6',
        villagerPositionThatCanBeAttackedByTiger: ['C3', 'C7', 'C11']
    },
    {
        tigerPosition: 'A4',
        villagerPositionThatCanBeAttackedByTiger: ['C3', 'C9', 'C15']
    },
    {
        tigerPosition: 'A2',
        villagerPositionThatCanBeAttackedByTiger: ['A5', 'C3', 'C8', 'C13', 'C18', 'C23', 'B2']
    },
    {
        tigerPosition: 'A5',
        villagerPositionThatCanBeAttackedByTiger: ['C3', 'C8', 'C13', 'C18', 'C23', 'B2', 'B5']
    },


    //B1-B6 right area
    {
        tigerPosition: 'B4',
        villagerPositionThatCanBeAttackedByTiger: ['B1', 'C23', 'C19']
    },
    {
        tigerPosition: 'B6',
        villagerPositionThatCanBeAttackedByTiger: ['B3', 'C23', 'C17']
    },
    {
        tigerPosition: 'B1',
        villagerPositionThatCanBeAttackedByTiger: ['C23', 'C19', 'C15']
    },
    {
        tigerPosition: 'B3',
        villagerPositionThatCanBeAttackedByTiger: ['C23', 'C17', 'C11']
    },
    {
        tigerPosition: 'B5',
        villagerPositionThatCanBeAttackedByTiger: ['B2', 'C23', 'C18', 'C13', 'C8', 'C3', 'A5']
    },
    {
        tigerPosition: 'B2',
        villagerPositionThatCanBeAttackedByTiger: ['C23', 'C18', 'C13', 'C8', 'C3', 'A5', 'A2']
    },

    // C1-C25
    // C with only 1 direction to kill
    {
        tigerPosition: 'C3',
        villagerPositionThatCanBeAttackedByTiger: ['C8', 'C13', 'C18', 'C23', 'B2']
    },
    {
        tigerPosition: 'C23',
        villagerPositionThatCanBeAttackedByTiger: ['C18', 'C13', 'C8', 'C3', 'A5']
    },

    // C with 2 direction to kill
    {
        tigerPosition: 'C10',
        villagerPositionThatCanBeAttackedByTiger: ['C15', 'C20', 'C25']
    },
    {
        tigerPosition: 'C10',
        villagerPositionThatCanBeAttackedByTiger: ['C9', 'C8', 'C7']
    },
    {
        tigerPosition: 'C20',
        villagerPositionThatCanBeAttackedByTiger: ['C15', 'C10', 'C5']
    },
    {
        tigerPosition: 'C20',
        villagerPositionThatCanBeAttackedByTiger: ['C19', 'C18', 'C17']
    },
    {
        tigerPosition: 'C6',
        villagerPositionThatCanBeAttackedByTiger: ['C11', 'C16', 'C21']
    },
    {
        tigerPosition: 'C6',
        villagerPositionThatCanBeAttackedByTiger: ['C7', 'C8', 'C9']
    },
    {
        tigerPosition: 'C16',
        villagerPositionThatCanBeAttackedByTiger: ['C11', 'C6', 'C1']
    },
    {
        tigerPosition: 'C16',
        villagerPositionThatCanBeAttackedByTiger: ['C17', 'C18', 'C19']
    },

    {
        tigerPosition: 'C2',
        villagerPositionThatCanBeAttackedByTiger: ['C3', 'C4', 'C5']
    },
    {
        tigerPosition: 'C2',
        villagerPositionThatCanBeAttackedByTiger: ['C7', 'C12', 'C17']
    },
    {
        tigerPosition: 'C4',
        villagerPositionThatCanBeAttackedByTiger: ['C3', 'C2', 'C1']
    },
    {
        tigerPosition: 'C4',
        villagerPositionThatCanBeAttackedByTiger: ['C9', 'C14', 'C19']
    },
    {
        tigerPosition: 'C22',
        villagerPositionThatCanBeAttackedByTiger: ['C23', 'C24', 'C25']
    },
    {
        tigerPosition: 'C22',
        villagerPositionThatCanBeAttackedByTiger: ['C17', 'C12', 'C7']
    },
    {
        tigerPosition: 'C24',
        villagerPositionThatCanBeAttackedByTiger: ['C23', 'C22', 'C21']
    },
    {
        tigerPosition: 'C24',
        villagerPositionThatCanBeAttackedByTiger: ['C19', 'C14', 'C9']
    },

    // in the center area
    {
        tigerPosition: 'C8',
        villagerPositionThatCanBeAttackedByTiger: ['C3', 'A5', 'A2']
    },
    {
        tigerPosition: 'C8',
        villagerPositionThatCanBeAttackedByTiger: ['C13', 'C18', 'C23']
    },
    {
        tigerPosition: 'C8',
        villagerPositionThatCanBeAttackedByTiger: ['C13', 'C18', 'C23', 'B2', 'B5']
    },
    {
        tigerPosition: 'C14',
        villagerPositionThatCanBeAttackedByTiger: ['C13', 'C12', 'C11']
    },

    {
        tigerPosition: 'C18',
        villagerPositionThatCanBeAttackedByTiger: ['C23', 'B2', 'B5']
    },
    {
        tigerPosition: 'C18',
        villagerPositionThatCanBeAttackedByTiger: ['C13', 'C8', 'C3']
    },
    {
        tigerPosition: 'C18',
        villagerPositionThatCanBeAttackedByTiger: ['C13', 'C8', 'C3', 'A5', 'A2']
    },
    {
        tigerPosition: 'C12',
        villagerPositionThatCanBeAttackedByTiger: ['C13', 'C14', 'C15']
    },

    // C with 3 direction to kill 90 degree
    {
        tigerPosition: 'C5',
        villagerPositionThatCanBeAttackedByTiger: ['C10', 'C15', 'C20']
    },
    {
        tigerPosition: 'C5',
        villagerPositionThatCanBeAttackedByTiger: ['C4', 'C3', 'C2']
    },
    {
        tigerPosition: 'C5',
        villagerPositionThatCanBeAttackedByTiger: ['C9', 'C13', 'C17']
    },

    {
        tigerPosition: 'C25',
        villagerPositionThatCanBeAttackedByTiger: ['C20', 'C15', 'C10']
    },
    {
        tigerPosition: 'C25',
        villagerPositionThatCanBeAttackedByTiger: ['C24', 'C23', 'C22']
    },
    {
        tigerPosition: 'C25',
        villagerPositionThatCanBeAttackedByTiger: ['C19', 'C13', 'C7']
    },

    {
        tigerPosition: 'C21',
        villagerPositionThatCanBeAttackedByTiger: ['C16', 'C11', 'C6']
    },
    {
        tigerPosition: 'C21',
        villagerPositionThatCanBeAttackedByTiger: ['C22', 'C23', 'C24']
    },
    {
        tigerPosition: 'C21',
        villagerPositionThatCanBeAttackedByTiger: ['C17', 'C13', 'C9']
    },

    {
        tigerPosition: 'C1',
        villagerPositionThatCanBeAttackedByTiger: ['C6', 'C11', 'C16']
    },
    {
        tigerPosition: 'C1',
        villagerPositionThatCanBeAttackedByTiger: ['C2', 'C3', 'C4']
    },
    {
        tigerPosition: 'C1',
        villagerPositionThatCanBeAttackedByTiger: ['C7', 'C13', 'C19']
    },

    {
        tigerPosition: 'C11',
        villagerPositionThatCanBeAttackedByTiger: ['C7', 'C3', 'A6']
    },
    {
        tigerPosition: 'C11',
        villagerPositionThatCanBeAttackedByTiger: ['C17', 'C23', 'B3']
    },
    {
        tigerPosition: 'C11',
        villagerPositionThatCanBeAttackedByTiger: ['C12', 'C13', 'C14']
    },

    {
        tigerPosition: 'C15',
        villagerPositionThatCanBeAttackedByTiger: ['C9', 'C3', 'A4']
    },
    {
        tigerPosition: 'C15',
        villagerPositionThatCanBeAttackedByTiger: ['C19', 'C23', 'B1']
    },
    {
        tigerPosition: 'C15',
        villagerPositionThatCanBeAttackedByTiger: ['C14', 'C13', 'C12']
    },

    // with 4 direction to kill
    {
        tigerPosition: 'C7',
        villagerPositionThatCanBeAttackedByTiger: ['C8', 'C9', 'C10']
    },
    {
        tigerPosition: 'C7',
        villagerPositionThatCanBeAttackedByTiger: ['C13', 'C19', 'C25']
    },
    {
        tigerPosition: 'C7',
        villagerPositionThatCanBeAttackedByTiger: ['C12', 'C17', 'C22']
    },
    {
        tigerPosition: 'C7',
        villagerPositionThatCanBeAttackedByTiger: ['C3', 'A6', 'A3']
    },

    {
        tigerPosition: 'C9',
        villagerPositionThatCanBeAttackedByTiger: ['C3', 'A4', 'A1']
    },
    {
        tigerPosition: 'C9',
        villagerPositionThatCanBeAttackedByTiger: ['C14', 'C19', 'C24']
    },
    {
        tigerPosition: 'C9',
        villagerPositionThatCanBeAttackedByTiger: ['C8', 'C7', 'C6']
    },
    {
        tigerPosition: 'C9',
        villagerPositionThatCanBeAttackedByTiger: ['C13', 'C17', 'C21']
    },

    {
        tigerPosition: 'C17',
        villagerPositionThatCanBeAttackedByTiger: ['C23', 'B3', 'B6']
    },
    {
        tigerPosition: 'C17',
        villagerPositionThatCanBeAttackedByTiger: ['C18', 'C19', 'C20']
    },
    {
        tigerPosition: 'C17',
        villagerPositionThatCanBeAttackedByTiger: ['C13', 'C9', 'C5']
    },
    {
        tigerPosition: 'C17',
        villagerPositionThatCanBeAttackedByTiger: ['C12', 'C7', 'C2']
    },

    {
        tigerPosition: 'C19',
        villagerPositionThatCanBeAttackedByTiger: ['C23', 'B1', 'B4']
    },
    {
        tigerPosition: 'C19',
        villagerPositionThatCanBeAttackedByTiger: ['C14', 'C9', 'C4']
    },
    {
        tigerPosition: 'C19',
        villagerPositionThatCanBeAttackedByTiger: ['C18', 'C17', 'C16']
    },
    {
        tigerPosition: 'C19',
        villagerPositionThatCanBeAttackedByTiger: ['C13', 'C7', 'C1']
    },


    {
        tigerPosition: 'C13',
        villagerPositionThatCanBeAttackedByTiger: ['C18', 'C23', 'B2']
    },
    {
        tigerPosition: 'C13',
        villagerPositionThatCanBeAttackedByTiger: ['C8', 'C3', 'A5']
    },
]


function isValidKill(p1, p2, board) {
    // console.log("test valid kill ")
    const check = validKill.find(
        (e) =>
        e.tigerPosition === p1.id &&
        e.villagerPositionThatCanBeAttackedByTiger.includes(p2.id)
    );
    if (!check || board.pieces.find((e) => e.position === p2.id)) return false;
    const targetIndex =
        check.villagerPositionThatCanBeAttackedByTiger.findIndex(
            (e) => e === p2.id
        );

    if (targetIndex === 0 || targetIndex % 2 !== 0) {
        return false;
    }

    const requiredVillagerPositions = [];
    for (let i = 0; i < targetIndex; i++) {
        requiredVillagerPositions.push(
            check.villagerPositionThatCanBeAttackedByTiger[i]
        );
    }
    const allVillagersPresent = requiredVillagerPositions.every((pos) =>
        board.pieces.some((p) => p.position === pos && p.type === "anak")
    );
    let allKilledVillagers = []

    if (allVillagersPresent) {
        allKilledVillagers = board.pieces.filter((e) => e.type === 'anak' && requiredVillagerPositions.includes(e.position))

    }

    return { allVillagersPresent: allVillagersPresent, allKilledVillagers: allKilledVillagers };
}


export { validKill, isValidKill }