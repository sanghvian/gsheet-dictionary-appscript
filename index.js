function getWordDefinitions(cell) {
    const meanings = getResponseFromApi(cell)
    const objects = meanings.map((meaning)=>{
      const definitions = meaning.definitions
      definitionsString = definitions.map(def=>def?.definition).join('; ')
      return definitionsString
    })
    return objects.join('; ')
  }
  function getWordSynonyms(cell) {
    const meanings = getResponseFromApi(cell)
    const objects = meanings.map((meaning)=>{
      const definitions = meaning.definitions
      synonyms = definitions.map(def=>def?.synonyms)
      meaning.synonyms.forEach(syn => {
        if(!syn in synonyms){
          synonyms.push(syn)
        }
      })
      return synonyms.length ? synonyms.join(' ') : ""
    })
    return objects
  }
  function getWordExamples(cell) {
    const meanings = getResponseFromApi(cell)
    const objects = meanings?.map((meaning)=>{
      const definitions = meaning.definitions
      examples = definitions.map(def=>def?.example)
      return examples.length ? examples.join(' ') : ""
    })
    return objects.length ? objects.join(' ') : ""
  }
  
  function getResponseFromApi (word){
    var url = `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`
    const rsp = UrlFetchApp.fetch(url)
    const json = JSON.parse(rsp.getContentText())
    return json[0].meanings
  }
  
  function getResponseFromApiv2(word){
    let options = {
       "async": true,
       "crossDomain": true,
       "method" : "GET",
       "headers" : {
         "X-RapidAPI-Key" : "f9dace07dbmsh003841c3c16ae3bp12bc85jsn5472b5bffc09",
         "cache-control": "no-cache"
       }
     };
     try{
        var url = `https://wordsapiv1.p.rapidapi.com/words/${word}`
        const rsp = UrlFetchApp.fetch(url, options)
        const json = JSON.parse(rsp.getContentText())
        if(json.success!=false && json.results!==undefined){
          return {results : json.results, api:'wordsapi'}
        }else{
          return {results : getResponseFromApi(word), api:'dictionaryapi'}
        }
     }catch(err){
       return {results : getResponseFromApi(word), api:'dictionaryapi'}
     }
  }
  
  function getMeaning(cell){
    try{
      const {results, api} = getResponseFromApiv2(cell)
      if(api ==='dictionaryapi'){
        return getWordDefinitions(cell)
      }
      const defs = results.map((res)=>res?.definition)
      return defs.length ? defs.join('; ') : ""
    }catch(e){
      return "-"
    }
  }
  function getSynonyms(cell){
    try{
      const {results} = getResponseFromApiv2(cell)
      let synonyms = results.flatMap((res)=>res?.synonyms).filter(ex => ex?.length > 0)
      getWordSynonyms(cell).forEach(syn => {
        if(!syn in synonyms){
          synonyms.push(syn)
        }
      })
      return synonyms.length ? synonyms.join('; ') : ""
    }catch(e){
      return "-"
    }
  }
  function getEgs(cell){
    try{
      const {results, api} = getResponseFromApiv2(cell)
      if(api ==='dictionaryapi'){
        return getWordExamples(cell)
      }
      const exs = results.flatMap((res)=>res?.examples).filter(ex => ex?.length > 0)
      return exs.length ? exs.join('; ') : ""
    }catch(e){
      return "-"
    }
  }