export default function FormModal(props) {
	const style = {
		display : props.showModal ? "block" : "none"
	}
	return (
		<div id="formModal" className="modal" style={style} onClick={(e) => {
				if (e.target.className === 'modal') {
					props.closeModal();
				}
		  	}}>
			<div className="modal-content" ref={props.ref}>
				<span className="close" onClick={()=>props.closeModal()}>×</span>
				<h1>Add New Book</h1>
				<form id="addBookForm" method="post" action="/addBook" encType="multipart/form-data">
					<input id="id" name="id" hidden={true} value={props.id+1} readOnly={true}/> 
					<div className="form-group">
						<label htmlFor="title">Title</label>
						<input id="title" name="title" className="form-control" type="text" required={true}/>
					</div>
					<div className="form-group">
						<label htmlFor="author">Author</label>
						<input id="author" name="author" className="form-control" type="text" required={true}/>
					</div>
					<div className="form-group">
						<label htmlFor="description">Description</label>
						<textarea id="description" name="description" className="form-control" type="text" required={true} rows="10"></textarea>
					</div>
					<div className="form-group">
						<label htmlFor="cover">Cover</label>
						<input id="cover" name="cover" className="form-control-file" type="file" accept="image/*" required={true}/>
					</div>
					<button className="btn btn-primary btn-md submit">Submit</button>
				</form>
			</div>
		</div>
	)
}