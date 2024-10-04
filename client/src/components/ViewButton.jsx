import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'

export default function ViewButton(props) {
    const styleButton = {
        float : props.id === 0 ? "left" : "right"
    }
    const styleSvg = {
        color : props.view === props.id ? "black" : "lightslategray"
    }
	return (
		<button onClick={()=>props.setView(props.id)} style={styleButton}><FontAwesomeIcon icon={props.icon} style={styleSvg} className='icon'/></button>
	);
}