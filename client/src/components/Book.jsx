export default function Book(props) {
	return (
		<img 
			className="cover-img" 
			src={"public/images/" + props.imageUrl} 
			alt={props.title} 
			onClick={()=>props.handleClick(props.id)}
		/>
	);
}