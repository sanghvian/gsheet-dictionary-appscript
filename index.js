function getWordDefinitions(cell) {
    const meanings = getResponseFromApi(cell)
    const objects = meanings.map((meaning) => {
        const definitions = meaning.definitions
        definitionsString = definitions.map(def => def?.definition).join('; ')
        return definitionsString
    })
    return objects.join('; ')
}
function getWordSynonyms(cell) {
    const meanings = getResponseFromApi(cell)
    const objects = meanings.map((meaning) => {
        const definitions = meaning.definitions
        synonyms = definitions.map(def => def?.synonyms)
        meaning.synonyms.forEach(syn => {
            if (!syn in synonyms) {
                synonyms.push(syn)
            }
        })
        return synonyms.length ? synonyms.join(' ') : ""
    })
    return objects.length ? objects.join(' ') : ""
}
function getWordExamples(cell) {
    const meanings = getResponseFromApi(cell)
    const objects = meanings?.map((meaning) => {
        const definitions = meaning.definitions
        examples = definitions.map(def => def?.example)
        return examples.length ? examples.join(' ') : ""
    })
    return objects.length ? objects.join(' ') : ""
}

function getResponseFromApi(word) {
    var url = `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`
    const rsp = UrlFetchApp.fetch(url)
    const json = JSON.parse(rsp.getContentText())
    return json[0].meanings
}

function getResponseFromApiv2(word) {
    let options = {
        "async": true,
        "crossDomain": true,
        "method": "GET",
        "headers": {
            "X-RapidAPI-Key": "X_RAPID_API_KEY",
            "cache-control": "no-cache"
        }
    };
    try {
        var url = `https://wordsapiv1.p.rapidapi.com/words/${word}`
        const rsp = UrlFetchApp.fetch(url, options)
        const json = JSON.parse(rsp.getContentText())
        if (json.success != false && json.results !== undefined) {
            return { results: json.results, api: 'wordsapi' }
        } else {
            return { results: getResponseFromApi(word), api: 'dictionaryapi' }
        }
    } catch (err) {
        return { results: getResponseFromApi(word), api: 'dictionaryapi' }
    }
}

function getWordDefinitionsv2(cell) {
    const { results, api } = getResponseFromApiv2(cell)
    if (api === 'dictionaryapi') {
        return getWordDefinitions(cell)
    }
    const defs = results.map((res) => res?.definition)
    return defs.length ? defs.join('; ') : ""
}
function getWordSynonymsv2(cell) {
    const { results, api } = getResponseFromApiv2(cell)
    if (api === 'dictionaryapi') {
        return getWordSynonyms(cell)
    }
    const synonyms = results.flatMap((res) => res?.synonyms).filter(ex => ex?.length > 0)
    return synonyms.length ? synonyms.join('; ') : ""
}
function getWordExamplesv2(cell) {
    const { results, api } = getResponseFromApiv2(cell)
    if (api === 'dictionaryapi') {
        return getWordExamples(cell)
    }
    const exs = results.flatMap((res) => res?.examples).filter(ex => ex?.length > 0)
    return exs.length ? exs.join('; ') : ""
}