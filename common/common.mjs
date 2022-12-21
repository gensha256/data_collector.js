const evalTTS = (cmcObj) => {
    let dateStr = cmcObj.last_updated;
    const parts = dateStr.split(':');
    dateStr = `${parts[0]}:00:00.000Z`;

    return new Date(dateStr).valueOf();
}

const compareTTS = (cmcObj1, cmcObj2) => {
    if (evalTTS(cmcObj1) < evalTTS(cmcObj2)) {
        return -1;
    } else if (evalTTS(cmcObj1) > evalTTS(cmcObj2)) {
        return 1;
    } else {
        return 0;
    }
}

export {evalTTS, compareTTS}