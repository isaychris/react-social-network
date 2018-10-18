import React, { Component } from 'react';
import {app} from "../../config/firebase_config"
import firebase from "firebase"
import shortid from 'shortid'
import { Redirect } from 'react-router-dom'
import { throws } from 'assert';

class Settings extends Component {
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
    handleUploadChange = (e) => {
        if(e.target.files) {
            let type = e.target.files[0].type
            let name = e.target.files[0].name   

            if (type.includes("image")) {
                this.setState({file: e.target.files[0]})

                var reader = new FileReader();
                
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

    handleBioChange= (e) => {
        this.setState({bio: e.target.value});
    }

    handleBio= (e) => {
        app.database().ref(`/profile/${this.props.logged}/description`).set(this.state.bio).then(() => {
            alert("Bio was changed!")
        }).catch((error) => {
            alert(error)
        })
    }

    handleUpload = (e) => {
        if(this.state.file) {
            let image = this.state.file


            this.setState({progress: true})

            let upload_task = app.storage().ref(`/profile/${this.props.logged}/profile`).put(image)
            upload_task.on('state_changed', (snapshot) => {
                this.progress.value = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            },(error) => {
                console.log(error)
            }, () => {
                app.storage().ref(`profile/${this.props.logged}`).child("profile").getDownloadURL().then((url) => {
                    this.setState({profile_pic: url})
                    alert("Profile picture changed!")
                    this.setState({progress: false})
                })
            })
        } else {
            alert("Select an image before submitting")
        }
    }

    componentWillMount = () => {
        app.storage().ref(`profile/${this.props.logged}`).child("profile").getDownloadURL().then((url) => {
            this.setState({profile_pic: url})
        }).catch((error) => {
            this.setState({profile_pic: "https://firebasestorage.googleapis.com/v0/b/react-social-network-7e88b.appspot.com/o/assets%2Fdefault.png?alt=media"})
        })

        app.database().ref(`/profile/${this.props.logged}`).once("value", (snapshot) => {
            if(snapshot.val()) {
                this.setState({bio: snapshot.val().description})
            }
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
                    <button className="button is-primary" onClick={this.handleBio}>Save Bio</button>   
                </div>
                </div>
                </div>
            )
        }
    }
}

export default Settings;