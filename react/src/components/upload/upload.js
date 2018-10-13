import React, { Component } from 'react';
import firebase from "../../config/firebase_config"
import shortid from 'shortid'
import { Redirect } from 'react-router-dom'

class Upload extends Component {
    constructor(props) {
        super(props)
        this.state = {
            username: this.props.logged,
            file: null,
            uuid: undefined,
            redirect: false,
            progress: false,
        }
    }
    handleChange = (e) => {
        let type = e.target.files[0].type
        let name = e.target.files[0].name   

        console.log(e.target.files[0])
        if (type.includes("image")) {
            this.setState({file: e.target.files[0]})

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

    handleUpload = (e) => {
        if(this.state.file) {
            let image = this.state.file
            let uuid = shortid.generate()
            let extension = image.type.split('/')[1]
            let new_name = uuid + '.' + extension

            this.setState({progress: true})

            let upload_task = firebase.storage().ref(`/images/${this.state.username}/${new_name}`).put(image)
            upload_task.on('state_changed', (snapshot) => {
                this.progress.value = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            },(error) => {
                console.log(error)
            }, () => {
                
                firebase.storage().ref(`images/${this.state.username}`).child(new_name).getDownloadURL().then((url) => {
                    let description = document.querySelector("#description").value;

                    firebase.database().ref('/posts').child(uuid).set({
                        username: this.state.username,
                        time: firebase.database.ServerValue.TIMESTAMP,
                        description: description,
                        image: url,
                    }).then((snap) => {
                        this.setState({redirect: true, uuid: uuid })
                    })
                })
            })
        } else {
            alert("Select an image before submitting")
        }
    }

    render() {
        if(this.state.redirect) {
            let link = "/p/" + this.state.uuid
            return <Redirect to={link}/>
        } else {
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
                        <input className="file-input" type="file" name="resume" onChange={this.handleChange}/>
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

                    <progress className="progress is-primary" ref={(progress) => this.progress = progress} style={{display: this.state.progress === true ? 'block' : 'none' }} max="100" ></progress>

                    <textarea id="description" className="textarea" placeholder="Description"></textarea><br/>
                    <button className="button is-primary" onClick={this.handleUpload}>Submit</button>   
                </div>
                </div>
                </div>
            )
        }
    }
}

export default Upload;