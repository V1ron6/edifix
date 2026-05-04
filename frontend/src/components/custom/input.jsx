import React from 'react'
import './styles/input.css'
const Input = (props) => {
	
function getS(){
	 let designer = props.design.toLowerCase()
	if( designer==="primary") return 'inputPrimary'
	if( designer==="secondary") return 'inputSecondary'
   return 'inputDefault'

}
	

	return (
		<input className={getS()} type={props.type} placeholder={props.placeholder} name={props.name} value={props.value} />
	)
}

export default Input