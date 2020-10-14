import axios from 'axios'
import Swal from 'sweetalert2'

const userActions = {
    //Crear una nueva cuenta
    createAccount : newUser =>{
        return async (dispatch, getState) => {       
            const res = await axios.post('http://localhost:4000/api/users', newUser)
      
            const error ={
                mail:"",
                user:""
            }
            if(!res.data.success && res.data.response !== undefined){
                if(res.data.response.errors.mail !== undefined){
                  error.mail = "That email is already used"
                }
                if(res.data.response.errors.user !== undefined){
                   error.user = "That username is already used"
                }
                return error
               
            }else{
              
                await Swal.fire({  
                    title: 'Welcome!',  
                    text: `It´s nice to have you here, ${res.data.response.name}.`,  
                    icon: 'success',  
                    showConfirmButton: false,
                     timer: 2000,
                     allowOutsideClick: false
                })
                dispatch({
                    type: "LOG_USER_INTO_APP",
                    payload:res.data.response
                    
                })
                return {
                    success: true,
                    user: res.data.response.name
                }
            }
        }

    },
    //Obtener si el usuario ya esta registrado 
    getUser: user =>{
        return async (dispatch, getState) =>{
            
            const res = await axios.post("http://localhost:4000/api/getUser", user)
            
            dispatch({
                type: "GET_USER_EXISTS"
            })
            return res.data.success
        }
    },
    //Logear un usuario
    logUser : user =>{
        return async ( dispatch, getState) => {
            const res = await axios.post("http://localhost:4000/api/login", user)
  
            if (!res.data.success){
                return (res.data.response)
                
            }else{
                await Swal.fire({  
                    title: 'Welcome!',  
                    text: `It´s nice to have you again, ${res.data.response.name}.`,  
                    icon: 'success',  
                    showConfirmButton: false, 
                    timer: 2000,
                    allowOutsideClick: false
                })
                dispatch({
                    type: "LOG_USER_INTO_APP",
                    payload:res.data.response
                })
                return {
                    success: true,
                    user: res.data.response.name
                }
            }
        }
    },
    //Desloguear un usuario
    unlogUser : () => {
        return (dispatch, getState) =>{
            dispatch({
                type: "UNLOG_USER_FROM_APP"
            })
        }
    },
    //Perdurar la sesion de un usuario gracias a local storage
    forcedLogin: token =>{
        return async(dispatch, getState) =>{
            const res = await axios.get("http://localhost:4000/api/validateToken", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            if(res.data.success){
            dispatch({
                type: "LOG_USER_INTO_APP",
                payload:{
                    token,
                    name: res.data.response.name,
                    photo: res.data.response.photo,
                    role: res.data.response.role
                    
                    
                }
            })}
        }
    },
    //Obtener datos del usuario 
    getFullUser: token =>{
    
        return async(dispatch, getState) =>{
            const res = await axios.get("http://localhost:4000/api/fullUser", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
       
            dispatch({
                type: "GET_FULL_USER"
            })
            return res.data.response.userToSend
        }
    },
    //Modificar cuenta subiendo un archivo
    modAccount: (token, fd) =>{
      
        return async(dispatch, getState) =>{
            const res = await axios.put("http://localhost:4000/api/modifyUser", fd,{
            headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            })
         
        
                if (res.data.success){
                    await Swal.fire({  
                        title: 'User Modified!',  
                        text: `Please wait, we are uploading your data`,  
                        icon: 'success',  
                        showConfirmButton: false, 
                        timer: 6000, 
                        allowOutsideClick: false
                    })
                    dispatch({
                        type: "LOG_USER_INTO_APP",
                        payload:{
                            token,
                            name: res.data.response.name,
                            role: res.data.response.role,
                            photo: res.data.response.photo
                        }
                    })
                    return {
                        success: true,
                        user: res.data.success
                    }
                }else{
                    await Swal.fire({  
                        title: 'User not Modified!',  
                        text: `Please try again`,  
                        icon: 'warning',  
                        showConfirmButton: false, 
                        timer: 6000, 
                        allowOutsideClick: false
                    })
                }

            
        }
    },
    //Modificar cuenta sin subir un archivo
    modAccount1: (token, userMod) =>{
     

        return async(dispatch, getState) =>{
            const res = await axios.put("http://localhost:4000/api/modifyUser1", {...userMod},{
            headers: {
                    Authorization: `Bearer ${token}`,
                }
            })
         
        
            if (res.data.success){
                await Swal.fire({  
                    title: 'User Modified!',  
                    text: `enjoy`,  
                    icon: 'success',  
                    showConfirmButton: false, 
                    timer: 6000, 
                    allowOutsideClick: false
                })
                dispatch({
                    type: "LOG_USER_INTO_APP",
                    payload:{
                        token,
                        name: res.data.response.name,
                        role: res.data.response.role,
                        photo: res.data.response.photo
                    }
                })
                return {
                    success: true,
                    user: res.data.success
                }
            }else{
                await Swal.fire({  
                    title: 'User not Modified!',  
                    text: `Please try again`,  
                    icon: 'warning',  
                    showConfirmButton: false, 
                    timer:6000, 
                    allowOutsideClick: false
                })
            }
            
        }
        //Obtener comentarios
    },getComments: (idHouse) =>{
        return async (dispatch, getState) =>{
            const res = await axios.get("http://localhost:4000/api/houseComment/"+idHouse)
            dispatch({
                type: "GET_COMMENTS"
            })
            return (res.data.response)
        }
    } ,
    //Comentar una casa
    commentItinerary: (token, idHouse, comment) => {
        
            var id = idHouse
            var newComment = comment
        return async (dispatch, getState) =>{
           
            const res = await axios.post(`http://localhost:4000/api/houseComment/${id}`,{newComment},{
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            
            dispatch({
                type: "POST_COMMENT"
            })
        }

    } 
}

export default userActions