import React, { Component } from 'react';
import {app} from "../../config/firebase_config"
import firebase from "firebase"
import shortid from 'shortid'
import { Redirect } from 'react-router-dom'
import ContextUser from '../../contextUser'
import { WithContext as ReactTags } from 'react-tag-input';

// component for the upload page
class Upload extends Component {
    static contextType = ContextUser;

    constructor(props) {
        super(props)
        this.state = {
            file: null,
            uuid: undefined,
            tags: [],
            redirect: false,
            progress: false,
        }
    }

    handleDelete = (i) => {
        const { tags } = this.state;
        this.setState({
         tags: tags.filter((tag, index) => index !== i),
        });
    }
 
    handleAddition = (tag) => {
        this.setState(state => ({ tags: [...state.tags, tag] }));
    }
 
    handleDrag = (tag, currPos, newPos) => {
        const tags = [...this.state.tags];
        const newTags = tags.slice();
 
        newTags.splice(currPos, 1);
        newTags.splice(newPos, 0, tag);
 
        // re-render
        this.setState({ tags: newTags });
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
            let upload_task = app.storage().ref(`/images/${this.context.state.logged}/${new_name}`).put(image)

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
                app.storage().ref(`images/${this.context.state.logged}`).child(new_name).getDownloadURL().then((url) => {
                    let description = document.querySelector("#description").value;
                    
                    // create photo object with image and other info
                    app.database().ref('/posts').child(uuid).set({
                        username: this.context.state.logged,
                        time: firebase.database.ServerValue.TIMESTAMP,
                        description: description,
                        image: url,
                        tags: this.state.tags.map((tag) => tag.id)
                    }).then(() => {
                        // update logged users last_update time
                        app.database().ref(`/profile/${this.context.state.logged}/last_update`).set(firebase.database.ServerValue.TIMESTAMP)
                        
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

                    <ReactTags tags={this.state.tags}
                        handleDelete={this.handleDelete}
                        handleAddition={this.handleAddition}
                        handleDrag={this.handleDrag}
                        delimiters={[188, 13, 32]} />
                    <br/>

                    <textarea id="description" className="textarea" placeholder="Description"></textarea><br/>
                    <button className="button is-primary" onClick={this.handleUpload}>Submit</button>   
                </div>
                </div>
                </div>
            )
        }
    }
}

Upload.contextType = ContextUser;

export default Upload;