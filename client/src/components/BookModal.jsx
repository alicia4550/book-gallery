export default function BookModal(props) {
	const style = {
		display : props.showModal ? "block" : "none"
	}
	return (
		<div id="bookModal" className="modal" style={style} onClick={(e) => {
			if (e.target.className === 'modal') {
				props.closeModal();
			}
		  }}>
			<div id="modal-id" hidden=""></div>
			<div className="modal-content">
				<span className="close" onClick={()=>props.closeModal()}>×</span>
				<div className="row">
					<div className="col-md-5 text-center"><img id="modal-img" src={"/public/images/" + props.imageUrl} alt={props.title}/></div>
					<div className="col-md-7">
						<b><h2 id="modal-title">{props.title}</h2></b>
						<i><h3 id="modal-author">{props.author}</h3></i>
						<br/>
						<div id="modal-description">
							{props.description.split('\n').map((line, index) => (
								<p key={index}>
									{line.trim() === '' ? '' : line}
								</p>
							))}
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}