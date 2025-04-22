import { useEffect, useState } from "react"

function ActivateAccount(){

    const [email, setEmail] = useState("");
    const [activationCode, setActivationCode] = useState("");
    const [activated, setActivated] = useState(false);
    const[message,setMessage]= useState("");

    useEffect(()=>{
        const searchParams = new URLSearchParams(window.location.search)
        const emailParam = searchParams.get("email");
        const activationCode = searchParams.get("activationCode");

        if(emailParam&& activationCode){
            setEmail(emailParam);
            setActivationCode(activationCode);
            performActivation();
            

        }
    },[]);
    const performActivation = async()=>{
        try {
            const url:string = `http://localhost:8080/accounnt/activate?email=${email}&activationCode=${activationCode}`
            const response = await fetch(url,{
                method:"GET"
            }
            );

            if(response.ok){
                setActivated(true);

            }else{
                setMessage(response.text+"")
                
            }
            
        } catch (error) {
            console.log("loi khi kich hoat :", error);
            
        }
    }
    return(
        <div>
            <h1> ACTIVE ACCOUNT</h1>
            {activated ?(<p>Your account has been activated. Please log in to use it.</p> )
            :(
                <p>{message}</p>
            )

            }
        </div>
    )


}
export default ActivateAccount