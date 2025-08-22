import {useState} from react;

export default function abecedarioe(){
const abecedario = ["a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z"];
const[ini,setIni]=useState(0);
function handleClick(){
    if (ini<abecedario.length-1){
        setIni(ini+1);
    }
    else {
        setIni(0);
    }
    
}
return(
    <button onClick={handleClick}>
        tu letra del abcdario {abecedario[ini]} veces
    </button>
)
}