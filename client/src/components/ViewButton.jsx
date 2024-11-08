import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'

export default function ViewButton(props) {
    const styleSvg = {
        color : props.view === props.id ? "black" : "lightslategray"
    }
	return (
		<button onClick={()=>props.setView(props.id)}><FontAwesomeIcon icon={props.icon} style={styleSvg} className='icon'/></button>
	);
}