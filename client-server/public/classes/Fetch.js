class Fetch{



    static get(url, params = {}){

        return Fetch.request('GET',url, params);

    }

    static delete(url, params = {}){

        return Fetch.request('DELETE',url, params);
        
    }

    static put(url, params = {}){

        return Fetch.request('PUT',url, params);
        
    }

    static post(url, params = {}){

        return Fetch.request('POST',url, params);
  
    }


    /* Método para fazer uma requisição ao servidor. No primeiro parâmetro passamos o método como GET,PUT,POST etc
    . No segundo parâmetro passamos a URL, que no caso é /users */
    static request(method, url, params = {}){

        return new Promise((resolve,reject)=>{

            let request;

            switch(method.toLowerCase()){
                case 'get':
                    request = url;
                    break;
                    default:
                        
                    request = new Request(url,{
                        method,
                        body: JSON.stringify(params),
                        headers: new Headers({'Content-Type':'application/json'})
                    });

            }


            fetch(request).then(response =>{
                response.json().then(json =>{
                    resolve(json);
                }).catch(e =>{
                    reject(e);
                });
            }).catch(e =>{
                reject(e);
            });
               
        });

        
    }

}