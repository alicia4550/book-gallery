export default function BookListRow(props) {
	return (
		<tr>
			<td>
				<button onClick={()=>props.handleClick(props.id)}>
					<img 
						className="cover-img" 
						src={"public/images/" + props.imageUrl} 
						alt={props.title} 
					/>
				</button>
			</td>
			<td>
				<h2>{props.title}</h2>
				<h3><i>{props.author}</i></h3>
				<div>{props.description.split('\n').map((line, index) => (
					<p key={index}>
						{line.trim() === '' ? '' : line}
					</p>
				))}</div>
			</td>
		</tr>
	);
}