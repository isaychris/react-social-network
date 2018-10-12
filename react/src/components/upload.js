import React, { Component } from 'react';

class Upload extends Component {

    handleChange = (e) => {
        let type = e.target.files[0].type
        let name = e.target.files[0].name   

        if (type.includes("image")) {
            var reader = new FileReader();
            
            reader.onload = (e) => {
                document.querySelector("#preview").setAttribute('src', e.target.result)
                document.querySelector(".file-name").innerText = name

            };
            reader.readAsDataURL(e.target.files[0]);
        } else {
            alert("File must be a picture. Try again")
        }
    
    }

    render() {
        return(
            <div className="upload">
                <div className="card">
                <div className="card-header">
                    <p className="card-header-title is-centered">
                    Upload image
                    </p>
                </div>
                <div className="card-content">
                <div className="file has-name is-centered">
                <label className="file-label">
                    <input className="file-input" type="file" name="resume" onChange={(e) => this.handleChange(e)}/>
                    <span className="file-cta">
                    <span className="file-icon">
                        <i className="fas fa-upload"></i>
                    </span>
                    <span className="file-label">
                        Choose a file…
                    </span>
                    </span>
                    <span className="file-name">
                    None
                    </span>
                </label>
                </div><br/>
                <div>
                <img className="is-center is-rounded" id="preview" src=""/>
                </div><br/>
                <textarea className="textarea" placeholder="Description"></textarea><br/>
     
                <button className="button is-primary">Submit</button>   
            </div>
            </div>
            </div>
         )
    }
}

export default Upload;