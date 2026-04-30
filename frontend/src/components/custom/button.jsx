import './styles/cbutton.css'

//**How to Use the cbotton component
// <cbutton name="the text you want to appear" type="to select your design design" */
const Cbutton=(props)=>{

const getPre=()=>{
	const judge = props.type?.toLowerCase();
	if(judge === 'primary')return 'primary';
	if(judge === 'secondary')return 'secondary';
	if(judge === 'ghost')return 'ghost';
	return 'default';
}

return(
<button className={getPre()} >{props.name}</button>
	)
}

export default Cbutton;