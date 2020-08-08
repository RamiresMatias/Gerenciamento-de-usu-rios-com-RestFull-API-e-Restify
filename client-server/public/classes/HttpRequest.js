class HttpRequest{



    static get(url, params = {}){

        return HttpRequest.request('GET',url, params);

    }

    static delete(url, params = {}){

        return HttpRequest.request('DELETE',url, params);
        
    }

    static put(url, params = {}){

        return HttpRequest.request('PUT',url, params);
        
    }

    static post(url, params = {}){

        return HttpRequest.request('POST',url, params);
  
    }


    /* Método para fazer uma requisição ao servidor. No primeiro parâmetro passamos o método como GET,PUT,POST etc
    . No segundo parâmetro passamos a URL, que no caso é /users */
    static request(method, url, params = {}){

        return new Promise((resolve,reject)=>{

            let ajax = new XMLHttpRequest();
            // Criamos uma variável ajax

            // Onde ele irá buscar os dados. No primeiro parâmetro nós passamos o método GET para retorno.
            // E no segundo parâmetro a rota onde ele retornará os dados.
            ajax.open(method.toUpperCase(),url,true);

            /* O evento onload é enquanto ele processa a informação ele irá carregar na tela. De forma assíncrona */

            ajax.onerror = (event) =>{
                reject(event);
            };

            ajax.onload = event => {

                
                let obj = {};

                try{
                   
                    obj = JSON.parse(ajax.responseText);
                    
                   
                }catch(e){
                    reject(e);
               
                }
                resolve(obj);
                
            };

            try{

                /* Setando o Header. Para saber que estamos enviando um json. Ou seja ele irá definir o cabeçalho da 
                requisição */

                ajax.setRequestHeader("Content-Type","application/json");

                /* O método send() serve para enviar uma requisição ao servidor. No método open() você específica os 
                parâmetros enviados pelo usuário. Iremos transformá-lo em uma string.  */
               
     
                ajax.send(JSON.stringify(params));
            }catch(e){
                console.log(e);
            }

            

               
            });

        
    }

}