function updateMatrix(mat) {
    var result = new Array(mat.length).fill(1).map(function (val) { return new Array(mat[0].length); });
    var hasCheck = new Array(mat.length).fill(1).map(function (val) { return new Array(mat[0].length).fill(false); });
    var queue = [];
    var NeighborNode = function (x, y) {
        var result = [];
        if (x - 1 >= 0)
            result.push([x - 1, y]);
        if (x + 1 <= mat.length - 1)
            result.push([x + 1, y]);
        if (y - 1 >= 0)
            result.push([x, y - 1]);
        if (y + 1 <= mat[0].length - 1)
            result.push([x, y + 1]);
        return result;
    };
    for (var i = 0; i < mat.length; i++) {
        for (var j = 0; j < mat[0].length; j++) {
            if (mat[i][j] === 0) {
                result[i][j] = 0;
                hasCheck[i][j] = true;
                queue.push({ data: [i, j], count: 0 });
            }
        }
    }
    console.log(hasCheck, queue, result, "begin--- ");
    while (queue.length) {
        var mid = queue.shift();
        console.log(mid, "mid---");
        var middata = mid.data;
        for (var _i = 0, _a = NeighborNode(middata[0], middata[1]); _i < _a.length; _i++) {
            var node = _a[_i];
            if (!hasCheck[node[0]][node[1]]) {
                result[node[0]][node[1]] = mid.count + 1;
                queue.push({ data: node, count: mid.count + 1 });
            }
        }
    }
    return result;
}
updateMatrix([[0, 0, 0], [0, 1, 0], [0, 0, 0]]);
