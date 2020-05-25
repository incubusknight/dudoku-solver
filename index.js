class BoardNode {
    constructor(value, id) {
        this.possible = (value === undefined) ? '123456789'.split('') : [value];
        this.value = value;
        this.order = 0;
        this.id = id;
    }

    removePossibilities(numbers) {
        if (this.value === undefined) {
            this.possible = this.possible.filter(e => numbers.indexOf(e) < 0);
            if (this.possible.length === 1) {
                this.value = this.possible[0];
            }
        }
    }

    setValue(number) {
        this.value = number;
        this.possible = [number];
    }
}

const board1 =
    '52---4--7' +
    '-39-8----' +
    '4876-----' +
    '7--2-6-41' +
    '9-1---3-2' +
    '84-3-1---' +
    '-----2718' +
    '----1-49-' +
    '6--9---35';

const board2 =
    '9--6-----' +
    '27--8---6' +
    '-86-43192' +
    '-9--165--' +
    '--5---2--' +
    '--345--7-' +
    '75916-48-' +
    '3---7--25' +
    '-----5--9';

const board3 =
    '---7-815-' +
    '1-72----6' +
    '----5-9-7' +
    '----8-563' +
    '-136-724-' +
    '846-2----' +
    '7-4-1----' +
    '9----68-2' +
    '-218-5---';

const board4 = // Challenging
    '------2-8' +
    '92---4---' +
    '---2-8-71' +
    '-36------' +
    '---7-9---' +
    '------64-' +
    '86-4-1---' +
    '---9---27' +
    '2-9------';

const board5 = // Tough
    '3------6-' +
    '6-79---8-' +
    '-----7---' +
    '14--8----' +
    '--32-57--' +
    '----9--48' +
    '---5-----' +
    '-5---26-1' +
    '-1------3';

const board6 = // Super Tough
    '---------' +
    '8---2---5' +
    '-----624-' +
    '-38--71--' +
    '2-4---3-9' +
    '--74--52-' +
    '-725-----' +
    '6---8---1' +
    '---------';

function solve(board) {
    const boardNumbers = board
        .split('')
        .map((e, index) => new BoardNode(e === '-' ? undefined : e, index));

    let rounds = 0;
    let order = 0;
    while (boardNumbers.find(e => e.value === undefined) && (rounds < 20)) {
        rounds++;
        for(let cuadIndex = 0; cuadIndex < 9; cuadIndex++) {
            const matrix = getMatrix(cuadIndex, boardNumbers);
            const matrixRow = getMatrixRow(cuadIndex, boardNumbers);
            const matrixCol = getMatrixCol(cuadIndex, boardNumbers);

            // 1. Basic number check by cuadrant, row, and column
            matrix.forEach((e, nodeIndex) => {
                if (e.value === undefined) {
                    let cuadValues = matrix.filter(f => f.value !== undefined).map(f => f.value);
                    let rowValues = getNodeRowValues(nodeIndex, matrixRow);
                    let colValues = getNodeColValues(nodeIndex, matrixCol);
                    e.removePossibilities([].concat(cuadValues, rowValues, colValues));

                    if (e.value !== undefined) {
                        e.order = ++order;
                    }
                }
            });

            // 2. Number check by possibility elimination
            matrix.forEach((e, nodeIndex) => {
                if (e.value === undefined) {
                    for (let i = 0; i < e.possible.length; i++) {
                        let found = false;
                        // Check in matrix itself
                        for (let g = 0; g < matrix.length; g++) {
                            if (matrix[g].id !== e.id) {
                                found = found || (matrix[g].possible.indexOf(e.possible[i]) >= 0);
                            }
                        }

                        // Check in row
                        if (found) {
                            found = false;
                            let row = getNodeRow(nodeIndex, matrixRow);
                            for (let g = 0; g < row.length; g++) {
                                if (row[g].id !== e.id) {
                                    found = found || (row[g].possible.indexOf(e.possible[i]) >= 0);
                                }
                            }
                        }

                        // Check in col
                        if (found) {
                            found = false;
                            let col = getNodeCol(nodeIndex, matrixCol);
                            for (let g = 0; g < col.length; g++) {
                                if (col[g].id !== e.id) {
                                    found = found || (col[g].possible.indexOf(e.possible[i]) >= 0);
                                }
                            }
                        }

                        if (!found) {
                            e.setValue(e.possible[i]);
                            e.order = ++order;
                            break;
                        }
                    }
                }
            });
        }
    }

    console.log(`\nTook ${rounds} round(s) to solve.`);
    for (let i = 0; i < 9; i++) {
        console.log(boardNumbers.slice(i * 9, 9 + (i * 9)).map(e => e.value || '-').join(' | '));
    }
    // for (let i = 0; i < 9; i++) {
    //     console.log(boardNumbers.slice(i * 9, 9 + (i * 9)).map(e => e.order || '-').join(' | '));
    // }
}

function getNodeColValues(nodeIndex, matrixCol) {
    let col = [];
    const startIndex = nodeIndex % 3;
    for (let i = 0; i < matrixCol.length; i++) {
        for (let j = 0; j < 3; j++) {
            if (matrixCol[i][startIndex + (j * 3)].value !== undefined) {
                col.push(matrixCol[i][startIndex + (j * 3)].value);
            }
        }
    }
    return col;
}

function getNodeCol(nodeIndex, matrixCol) {
    let col = [];
    const startIndex = nodeIndex % 3;
    for (let i = 0; i < matrixCol.length; i++) {
        for (let j = 0; j < 3; j++) {
            col.push(matrixCol[i][startIndex + (j * 3)]);
        }
    }
    return col;
}

function getNodeRowValues(nodeIndex, matrixRow) {
    let row = [];
    const startIndex = nodeIndex - (nodeIndex % 3);
    for (let i = 0; i < matrixRow.length; i++) {
        for (let j = 0; j < 3; j++) {
            if (matrixRow[i][startIndex + j].value !== undefined) {
                row.push(matrixRow[i][startIndex + j].value);
            }
        }
    }
    return row;
}

function getNodeRow(nodeIndex, matrixRow) {
    let row = [];
    const startIndex = nodeIndex - (nodeIndex % 3);
    for (let i = 0; i < matrixRow.length; i++) {
        for (let j = 0; j < 3; j++) {
            row.push(matrixRow[i][startIndex + j]);
        }
    }
    return row;
}

function getMatrixCol(cuadIndex, board) {
    let row = [];
    const startIndex = cuadIndex % 3;
    for (let i = 0; i < 3; i++) {
        row.push(getMatrix(startIndex + (i * 3), board));
    }
    return row;
}

function getMatrixRow(cuadIndex, board) {
    let row = [];
    const startIndex = cuadIndex - (cuadIndex % 3);
    for (let i = 0; i < 3; i++) {
        row.push(getMatrix(startIndex + i, board));
    }
    return row;
}

function getMatrix(cuadIndex, board) {
    const startIndex = (cuadIndex % 3) * 3 + (27 * Math.trunc(cuadIndex / 3));

    let values = [];
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            values.push(startIndex + j + (i * 9));
        }
    }

    return values.map(e => board[e]);
}

// solve(board1);
// solve(board2);
// solve(board3);
// solve(board4);
// solve(board5);
solve(board6);