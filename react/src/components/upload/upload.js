import React, { Component } from 'react';
import {app} from "../../config/firebase_config"
import firebase from "firebase"
import shortid from 'shortid'
import { Redirect } from 'react-router-dom'


// component for the upload page
class Upload extends Component {
    constructor(props) {
        super(props)
        this.state = {
            file: null,
            uuid: undefined,
            redirect: false,
            progress: false,
        }
    }
    


    // handles file selection change
    handleChange = (e) => {
        // if a file was selected
        if(e.target.files) {
            let type = e.target.files[0].type
            let name = e.target.files[0].name   

            // only accept files that are images
            if (type.includes("image")) {
                this.setState({file: e.target.files[0]})

                var reader = new FileReader();
                
                // once loaded, change profile pic 
                reader.onload = (e) => {
                    document.querySelector("#preview").setAttribute('src', e.target.result)
                    document.querySelector(".file-name").innerText = name

                };
                reader.readAsDataURL(e.target.files[0]);
            } else {
                alert("File must be a picture. Try again")
            }
        }
    }



    // handles file upload
    handleUpload = (e) => {
        if(this.state.file) {
            let image = this.state.file
            let extension = image.type.split('/')[1]

            // generate a unique identifier for photo
            let uuid = shortid.generate()

            let new_name = uuid + '.' + extension
            let upload_task = app.storage().ref(`/images/${this.props.logged}/${new_name}`).put(image)

            // set progress to true to make progress bar appear
            this.setState({progress: true})

            // listener for upload progress
            upload_task.on('state_changed', (snapshot) => {
                // update progress value through reference
                this.progress.value = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            },(error) => {
                console.log(error)
            }, () => {
                
                // upload the image to storage
                app.storage().ref(`images/${this.props.logged}`).child(new_name).getDownloadURL().then((url) => {
                    let description = document.querySelector("#description").value;

                    // create photo object with image and other info
                    app.database().ref('/posts').child(uuid).set({
                        username: this.props.logged,
                        time: firebase.database.ServerValue.TIMESTAMP,
                        description: description,
                        image: url,
                    }).then((snap) => {
                        // update logged users last_update time
                        app.database().ref(`/profile/${this.props.logged}/last_update`).set(firebase.database.ServerValue.TIMESTAMP)
                        
                        // then redirect to the actual photo post
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
                    <img className="is-center is-rounded" id="preview" alt="" src=""/>
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