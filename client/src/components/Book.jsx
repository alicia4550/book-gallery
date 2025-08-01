export default function Book(props) {
	return (
		<button onClick={()=>props.handleClick(props.id)}>
			<img 
				className="cover-img" 
				src={props.imageUrl} 
				alt={props.title} 
			/>
		</button>
	);
}