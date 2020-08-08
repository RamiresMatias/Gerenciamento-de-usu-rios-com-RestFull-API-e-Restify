class UserController{

    constructor(formId,formIdUpdate, tableId){
        this.formEl = document.getElementById(formId);
        this.tableEl = document.getElementById(tableId);
        this.formIdUpdate = document.getElementById(formIdUpdate);
        this.onSubmit();
        this.onEdit();
        this.selectAll();
    }

    /* Método para edição de dados do usuário */
    onEdit(){
       document.querySelector('#box-user-update .btn-cancel').addEventListener('click', e =>{
            this.showPanelCreate();
        });

        this.formIdUpdate.addEventListener("submit", event=>{
            
            event.preventDefault();

            let btn = this.formIdUpdate.querySelector("[type=submit]");

            btn.disabled = true;

            /* Recupera os dados editados do usuário no formulário */
            let values = this.getValues(this.formIdUpdate);

            /* Recupera o index da <tr> onde está os dados que serão alterados */
            let index = this.formIdUpdate.dataset.trIndex;

            /* Recupera a <tr> onde está os dados que serão alterados */
            let tr = this.tableEl.rows[index];

            /* Recupera os dados antigos do usuário depois de ser feito a alteração */
            let userOld = JSON.parse(tr.dataset.user);

            /* Criando um novo objeto e substituindo no antigo. Usamos esse método para substituir a foto no formulário
            na hora da edição. Logo o objeto perde a instância e é criado novamente logo abaixo*/ 

            /* Sobrescreve os dados alterados e recuepra os não alterados e inseri em uma nova variável */
            let result = Object.assign({},userOld,values);

            this.getPhoto(this.formIdUpdate).then(
                (content)=>{//Se a promise der certo executa esta função


                    /* Se a foto for vazia, retorna a foto em branco como no cadastro */
                    if(!values.photo){
                        result._photo = userOld._photo;
                    }else{
                        /* Se não ele recupera a imagem selecionada */
                        result._photo = content;

                    }

                    let user = new User();

                    user.loadFromJSON(result);
            
                    user.save().then(user =>{

                        /* Cria um nova <tr> com os dados modificados e inserindo na view */
                        this.getTr(user, tr);

                        this.updateCount();
                        
                        this.formIdUpdate.reset();

                        btn.disabled = false;

                        this.showPanelCreate();

                        
                    });

                }, 
                (e) => { // Se der errado execute esta função
                    console.error(e);
            });
            

            

        });
        
    }

        /* Método de envio de formulário. Ao capturar o evento de click sobre o botão 'salvar' que é do tipo 
        submit */
    onSubmit(){ 

        this.formEl.addEventListener("submit",(event) => {

            event.preventDefault();// Cancela um evento sem interromper a execução do método

            let btn = this.formEl.querySelector("[type=submit]");

            btn.disabled = true;

            let values = this.getValues(this.formEl);//A variável vai receber o objeto 

            if(!values){
                return false;
            }

            this.getPhoto(this.formEl).then(
            (content)=>{//Se a promise der certo executa esta função

                values.photo = content; // Variável recebe a foto

                values.save().then(user =>{

                    this.addLine(user); 

                    this.formEl.reset();

                    btn.disabled = false;

    

                });

                
            }, 
            (e) => { // Se der errado execute esta função
                console.error(e);
            });
 
        });
    }

    /* Método para carregar a foto do usuário e retornar. Deve ser passado no parâmetro se o formulário é o de criação
    ou de edição do usuário */
    getPhoto(formEl){

        return new Promise((resolve,reject) => {

            let fileReader = new FileReader();

            let elements =  [...formEl.elements].filter(item => { //Filtrando o array para encontrar o campo photo
                //Se encontrar retornar na variável element
                if(item.name === 'photo'){ 
                    // Condição onde se o campo filtrado entre elementos do array for igual a photoele recupera o item
                    return item;
                }
            });

            let file = elements[0].files[0];

            fileReader.onload = () => {               
                resolve(fileReader.result);

                /* evento onload disparado assim que a leitura do arquivo for completada*/ 
            };

            fileReader.onerror = () => {
                // Parâmetro para quando a promise retorna algum erro
                reject(e); 
            }

            /* Se o caminho do arquivo for válido ele irá carregar a imagem, se não irá carregar uma imagem padrão*/
            if(file){
                fileReader.readAsDataURL(file);
            }else{
                resolve("dist/img/boxed-bg.jpg");
            }

            /* Método utilizado para ler o conteúdo do tipo blob ou file.Quando a leitura acaba, o loadend é disparado,
            então o atributo result recebe e irá conter uma url codificada da imagem em base64 do arquivo*/
        });   
    }

    /* Método para criar uma instância do objeto com os dados do usuário */
    getValues(formEl){

        let user = {};
        let isValue = true;
        
        /* Transformando os elementos dentro do formulário em array, para percorrer */
        [...formEl.elements].forEach(function (field,index){

            /* Se os campos abaixos forem encontrados e caso eles não tenham nada dentro */

            if(['name','email','password'].indexOf(field.name) > -1 && !field.value ){

                /*Se o campo não for preenchido ele aplicará a classe do bootstrap para deixa-la vermelha
                para que o usuário preencha o campo obrigatório */ 

                field.parentElement.classList.add('has-error');
                isValue = false;;
            }

            if(field.name == "gender"){
    
                if(field.checked){
                    /* Variável JSON */ 
    
                    /* Recuperando o campo gender (gênero) e inicializando ele como 'Masculino'*/
                    user[field.name] = field.value;
                }
        
            }else if(field.name == "admin"){

                user[field.name] = field.checked;

            }else{
    
                /* Atribuindo o nome do campo e montando um objeto JSON como um atributo para o objeto user.
                O valor digitado no campo será recebido pelo atributo*/ 
                
                user[field.name] = field.value;
            } 
        });

         
        /* Validando se os campos obrigatórios foram preenchidos. Se sim, ele retorna o objeto, se não ele retorna false*/ 
        if(!isValue){
            return false;
        }
        let objectUser = new User(user.name,user.gender,user.birth,user.country,
        user.email,user.password,user.photo,user.admin);

        return objectUser;
        
    }

    /* Método para carregar os dados dos usuários que estão em localStorage e inseri-los na view caso o browser seja 
    fechado ou recarregado */
    selectAll(){

        User.getUsersDb().then(data =>{

            data.users.forEach(dataUSer => {

                let user = new User();
    
                user.loadFromJSON(dataUSer);
             
                this.addLine(user);
            });
            

        });

        
    }

    /* Método para adicionar os dados do usuário na <tr> */
    addLine(dataUser){
        
        let tr = this.getTr(dataUser);

        this.tableEl.appendChild(tr);

        this.updateCount();


        /*Utilizando innerHTML iniciamos a tag <tr> com o HTML abaixo com template string para recuperar os valores
        das variáveis do objeto user*/
       
    }

    /* Método que seleciona a <tr> que iremos modificar ou inserir novo usuário*/
    getTr(dataUser, tr = null){

        if(tr === null){
            tr = document.createElement("tr");
        }

        tr.dataset.user = JSON.stringify(dataUser);

        tr.innerHTML = `
        <tr>
            <td><img src="${dataUser.photo}" alt="User Image" class="img-circle img-sm"></td>
            <td>${dataUser.name}</td>
            <td>${dataUser.email}</td>
            <td>${(dataUser.admin) ? 'Sim': 'Não'}</td>
            <td>${dataUser.register}</td>
            <td>
                <button type="button" class="btn btn-primary btn-edit btn-xs btn-flat">Editar</button>
                <button type="button" class="btn btn-danger btn-delete btn-xs btn-flat">Excluir</button>
            </td>
        </tr>
         `;

        this.addEventsTr(tr);

        return tr;
    }

    /* Método para retornar os dados preenchidos no antigo formulário do usuário. Ao clicar em editar as informações são 
    carregadas novamente, caso queira atualizar somente um campo as demais informações estarão preenchidas */
    addEventsTr(tr){

        /* Captura um evento de click no botão excluir e remove a tr na view */
        tr.querySelector('.btn-delete').addEventListener("click", e =>{

            if(confirm("Deseja realmente excluir?")){

                let user = new User ();

                user.loadFromJSON(JSON.parse(tr.dataset.user));

                user.removeReq().then(data =>{

                    tr.remove();

                    this.updateCount();
                });

                
            }

        });

        /* Captura um evento de click no botão editar abrindo o formulário para edição de usuários */
        
        tr.querySelector('.btn-edit').addEventListener("click", e=>{

            /* Recupera os dados do usuário naquela linha onde ocorreu o evento */
            let json = JSON.parse(tr.dataset.user);

            this.formIdUpdate.dataset.trIndex = tr.sectionRowIndex;

            for(let name in json){
                
                let field = this.formIdUpdate.querySelector("[name="+name.replace("_","")+"]");

                if(field){
                    
                    switch(field.type){
                        case 'file':
                            continue;
                        break;

                        case 'radio':
                            field = this.formIdUpdate.querySelector("[name="+name.replace("_","")+ "][value="+ json[name]+ "]");
                            field.checked = true;
                        break;

                        case 'checkbox':
                            field.checked = json[name];
                        break;

                        default:
                            field.value = json[name];
                    }
                    
                }
     
            }

            this.formIdUpdate.querySelector(".photo").src = json._photo;          

            this.showPanelUpdate();
        });
    }

    /* Método para mostrar o formulário de edição do usuário*/
    showPanelCreate(){
        document.querySelector('#box-user-create').style.display = "block";
        document.querySelector('#box-user-update').style.display = "none";
    }
    /* Método para mostrar o formulário de edição do usuário*/
    showPanelUpdate(){
        document.querySelector('#box-user-create').style.display = "none";
        document.querySelector('#box-user-update').style.display = "block";
    }
    /* Método para atualizar os dados de quantidade de usuários na view */
    updateCount(){

        let numberUsers = 0;
        let numberAdmin = 0;
        [...this.tableEl.children].forEach(tr => {
            numberUsers++;
            let user = JSON.parse(tr.dataset.user);
            if(user._admin){
                numberAdmin++;
            }
        });

        document.querySelector('#number-users').innerHTML = numberUsers;
        document.querySelector('#number-admin').innerHTML = numberAdmin;
    }

}