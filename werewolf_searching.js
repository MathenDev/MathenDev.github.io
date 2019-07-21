onmessage = function (event) {
    console.log('Searching...');
    let data = event.data;
    let cardMap = search({
        cardMap: new Map(),
        deck: data.deck,
        count: 0,
        totalValue: 0,
    }, {
        balance: data.balance,
        maxDiff: data.maxDiff,
        minDiff: data.minDiff,
        amount: data.players,
        mustHave: data.mustHave
    });
    postMessage(cardMap);
    console.log('Done.');

}

function search(data, criteria) {
    if (data.count >= criteria.amount) {
        if (validate(data, criteria)) {
            return data;
        }
        return undefined;
    }
    let vlls = data.cardMap.get('vll');
    if (vlls && vlls.length > (criteria.amount / 4))
    return undefined;

    for (let i = 0; i < data.deck.length; i++) {
        let newData = search(createNewData(data, i), criteria);
        if (newData)
            return newData;
    }
    return undefined;

}

function createNewData(data, i) {
    let newDeck = Array.from(data.deck);
    let card = newDeck.splice(i, 1)[0];
    let newCardMap = new Map(data.cardMap);
    let group = newCardMap.get(card.id);
    let newGroup = group ? Array.from(group) : [];
    newGroup.push(card);
    newCardMap.set(card.id, newGroup);
    return {
        deck: newDeck,
        cardMap: newCardMap,
        count: data.count + 1,
        totalValue: data.totalValue + card.value
    };
}


function validate(data, criteria) {
    let diff = data.totalValue - criteria.balance;
    if (diff < criteria.minDiff || diff > criteria.maxDiff)
        return false;
    let cardMap = data.cardMap;
    for (let id of criteria.mustHave) {
        if (!cardMap.get(id))
            return false;
    }
    let msn = cardMap.get('msn');
    if (msn && msn.length == 1)
        return false;
if (cardMap.get('aps') && !cardMap.get('ser'))
return false;
    return true;
}
