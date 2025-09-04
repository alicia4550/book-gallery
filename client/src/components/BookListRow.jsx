function getDescription(text) {
	var description = text.split('\n').filter((line) => line.trim() !== '').join('\n');
	return description.length > 500 ? description.substring(0, 500) + '...' : description;
}

export default function BookListRow(props) {
	return (
		<tr>
			<td>
				<button onClick={()=>props.handleClick(props.id)}>
					<img 
						className="cover-img" 
						src={props.imageUrl} 
						alt={props.title} 
					/>
				</button>
			</td>
			<td>
				<h2>{props.title}</h2>
				<h3><i>{props.author}</i></h3>
				<div>
					<p>{getDescription(props.description)}</p>
				</div>
			</td>
		</tr>
	);
}