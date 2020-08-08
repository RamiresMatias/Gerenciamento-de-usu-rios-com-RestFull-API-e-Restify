class User{

    constructor(name,gender,birth,country,email,password,photo,admin){

        this._id;
        this._name = name;
        this._gender = gender;
        this._birth = birth;
        this._country = country;
        this._email = email;
        this._password = password;
        this._photo = photo;
        this._admin = admin;
        this._register = new Date().toLocaleString('pt-br');

    }

    get id(){
        return this._id;
    }
    get register(){
        return this._register;
    }

    get name(){
        return this._name;
    }
    get gender(){
        return this._gender;
    }
    get birth(){
        return this._birth;
    }
    get country(){
        return this._country;
    }
    get email(){
        return this._email;
    }
    get password(){
        return this._password;
    }
    get photo(){
        return this._photo;
    }
    get admin(){
        return this._admin;
    }

    set name(name){
        this._name = name;
    }
    set gender(gender){
        this._gender = gender;
    }
    set birth(birth){
        this._birth = birth;
    }
    set country(country){
        this._country = country;
    }
    set email(email){
        this._email = email;
    }
    set password(password){
        this._password = password;
    }
    set photo(photo){
        this._photo = photo;
    }
    set admin(admin){
        this._admin = admin;
    }
    set id(id){
        this._id = id;
    }

    /* Método que recuepra em uma variável json os valores de usuário */
    loadFromJSON(json){

        for( let name in json){
             switch(name){
                 case '_register':
                    this[name] = new Date(json[name]).toLocaleString('pt-br');
                    break;
                default:
                    this[name] = json[name];  
             }
        }
        
    }

    toJSON(){

        let json = {};

        Object.keys(this).forEach(key =>{

            if(this[key] !== undefined){
                json[key] = this[key];
            }

        });

        return json;
    }

    /* Método para inserir os registros dos usuários no NeDB */
    save(){

        return new Promise((resolve, reject) =>{


            let promise;

            if(this.id){

                promise = Fetch.put(`/users/${this.id}`,this.toJSON());

            }else{
                promise = Fetch.post(`/users`,this.toJSON());
                
            }

            promise.then(data =>{

                this.loadFromJSON(data);

                resolve(data);

            }).catch(e =>{
                reject(e);
            });

        });
        
      
    }

    /* Método que retorna todos os usuários armazenados no NeDB */
    static getUsersDb(){

        return Fetch.get('/users');
    } 

    /* Método para remover os registros dos usuários do NeDB */
    removeReq(){

        return Fetch.delete(`/users/${this.id}`);

    }

}