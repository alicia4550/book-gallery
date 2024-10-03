export default function BookTableRow(props) {
	function decodeHtml(html) {
		var txt = document.createElement("textarea");
		txt.innerHTML = html;
		return txt.value;
	}

	return (
		<tr>
			<td>
				<button onClick={()=>props.getBook(props.id)}>
					<img src={props.imgUrl} className="tableImg"/>
				</button>
			</td>
			<td>
				<h3>{props.title}</h3>
				<h4><i>{props.author}</i></h4>
				<p>{decodeHtml(props.snippet)}</p>
			</td>
		</tr>
	);
}