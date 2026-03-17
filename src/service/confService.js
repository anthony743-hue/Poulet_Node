async function getLastConf(arr, daty){
    let last = null;
    let idx = -1;
    for (let i = 0; i < arr.length; i++) {
        if (arr[i].daty.getTime() >= daty.getTime()) {
            idx = i - 1;
            break;
        }
    }

    idx = idx >= 0 ? idx : 0;
    return arr[idx];
}