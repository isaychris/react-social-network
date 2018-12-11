import React, { Component } from 'react';
import { app } from "../../config/firebase_config"
import { Redirect } from 'react-router-dom'
import ContextUser from '../../contextUser'

// component for the settings page
class Settings extends Component {
    static contextType = ContextUser;

    constructor(props) {
        super(props)

        this.state = {
            profile_pic: undefined,
            bio: undefined,
            file: null,
            redirect: false,
            progress: false
        }
    }


    
    // Called immediately before mounting occurs, and before Component#render
    componentWillMount = () => {
        // retrieve their info
        app.database().ref(`/profile/${this.context.state.logged}`).once("value", (snapshot) => {
            if(snapshot.val()) {
                if(snapshot.val().picture) {
                    this.setState({profile_pic: snapshot.val().picture})
                } else {
                    this.setState({profile_pic: "https://firebasestorage.googleapis.com/v0/b/react-social-network-7e88b.appspot.com/o/assets%2Fdefault.png?alt=media"})
                }
                this.setState({bio: snapshot.val().description})
            }
        })
    }



    // handles file upload submission
    handleUpload = (e) => {
        if(this.state.file) {
            let upload_task = app.storage().ref(`/profile/${this.context.state.logged}/profile`).put(this.state.file)

            // set progress to true to make progress bar appear
            this.setState({progress: true})

            // listener for upload progress
            upload_task.on('state_changed', (snapshot) => {
                // update progress value through reference
                this.progress.value = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            },(error) => {
                console.log(error)
            }, () => {

                // update profile picture
                app.storage().ref(`profile/${this.context.state.logged}`).child("profile").getDownloadURL().then((url) => {
                    app.database().ref(`/profile/${this.context.state.logged}/picture`).set(url).then(()=>{
                         // hide process since its done
                        this.setState({profile_pic: url})
                        this.setState({progress: false})
                        alert("Profile picture changed!")
                    })
                })
            })
        } else {
            alert("Select an image before submitting")
        }
    }

    // handles file upload selection
    handleUploadChange = (e) => {
        // if a file was selected
        if(e.target.files) {
            let type = e.target.files[0].type

            // only accept files that are images
            if (type.includes("image")) {
                let name = e.target.files[0].name
                this.setState({file: e.target.files[0]})

                var reader = new FileReader();

                // once loaded, change profile pic 
                reader.onload = (e) => {
                    this.setState({pic_changed: true})
                    this.setState({profile_pic: e.target.result})

                    document.querySelector(".file-name").innerText = name
                };
                reader.readAsDataURL(e.target.files[0]);

            } else {
                alert("File must be a picture. Try again")
            }
        }
    }
    
    // handles any changes to the bio
    handleBioChange= (e) => {
        this.setState({bio: e.target.value});
    }

    // handles the saving of the bio
    handleBioSave = (e) => {
        app.database().ref(`/profile/${this.context.state.logged}/description`).set(this.state.bio).then(() => {
            alert("Bio was changed!")
        }).catch((error) => {
            alert(error)
        })
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
                        Settings
                        </p>
                    </div>
                    <div className="card-content">
                    <label className='label'>Profile: </label>
                    <article className="media">
                        <figure className="media-left" ref={(profile) => this.profile = profile}>
                            <p className="image is-128x128">
                            <img src={this.state.profile_pic}/>
                            </p>
                        </figure>
                        <div className="media-content">
                            <div className="content">
                                <div className="file has-name">
                            <label className="file-label">
                                <input className="file-input" type="file" name="resume" onChange={this.handleUploadChange}/>
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
                            </div>
                            <br/>
                                <button className="button is-primary" onClick={this.handleUpload}>Save Photo</button>   
                            </div>
                        </div>
                    </article>

                    <progress className="progress is-primary" ref={(progress) => this.progress = progress} style={{display: this.state.progress === true ? 'block' : 'none' }} max="100" ></progress>
                    <hr/><br/>
                    <label className='label'>Biography: </label>
                    <textarea id="description" className="textarea" placeholder="Enter bio" value={this.state.bio} onChange={this.handleBioChange}></textarea><br/>
                    <button className="button is-primary" onClick={this.handleBioSave}>Save Bio</button>   
                </div>
                </div>
                </div>
            )
        }
    }
}

export default Settings;